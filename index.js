const { login } = require('ws3-fca');
const fs = require('fs');
const path = require('path');
const Logger = require('./utils/logger');
const Language = require('./utils/language');
const autopost = require('./utils/autopost');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const lang = new Language(config.language);

const commands = new Map();
const events = new Map();
const cooldowns = new Map();

function loadCommands() {
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    try {
      const command = require(`./commands/${file}`);
      commands.set(command.config.name, command);
      Logger.success(`Loaded command: ${command.config.name}`);
    } catch (error) {
      Logger.error(`Failed to load command ${file}:`, error);
    }
  }
}

function loadEvents() {
  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
  
  for (const file of eventFiles) {
    try {
      const event = require(`./events/${file}`);
      events.set(event.config.name, event);
      Logger.success(`Loaded event: ${event.config.name}`);
    } catch (error) {
      Logger.error(`Failed to load event ${file}:`, error);
    }
  }
}

function handleCommand(api, event, args, senderID) {
  const commandName = args[0].toLowerCase();
  const command = commands.get(commandName) || [...commands.values()].find(cmd => 
    cmd.config.aliases && cmd.config.aliases.includes(commandName)
  );

  if (!command) {
    return api.sendMessage(
      lang.get('commandNotFound', { prefix: config.prefix }),
      event.threadID
    );
  }

  if (command.config.adminOnly && !config.adminUIDs.includes(senderID)) {
    return api.sendMessage(lang.get('adminOnly'), event.threadID);
  }

  if (!cooldowns.has(command.config.name)) {
    cooldowns.set(command.config.name, new Map());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.config.name);
  const cooldownAmount = (command.config.cooldown || 3) * 1000;

  if (timestamps.has(senderID)) {
    const expirationTime = timestamps.get(senderID) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return api.sendMessage(
        `⏳ Please wait ${timeLeft.toFixed(1)} seconds before using this command again.`,
        event.threadID
      );
    }
  }

  timestamps.set(senderID, now);
  setTimeout(() => timestamps.delete(senderID), cooldownAmount);

  try {
    api.getUserInfo(senderID, (err, userInfo) => {
      const senderName = userInfo && userInfo[senderID] ? userInfo[senderID].name : 'Unknown';
      Logger.command(command.config.name, senderName, event.threadID);
    });

    command.run({ api, event, args: args.slice(1), lang, config });
  } catch (error) {
    Logger.error(`Error executing command ${command.config.name}:`, error);
    api.sendMessage(
      `${lang.get('error')}: ${error.message}`,
      event.threadID
    );
  }
}

function startBot() {
  Logger.banner();
  
  let appState;
  try {
    const appStateContent = fs.readFileSync(config.appState, 'utf8');
    appState = JSON.parse(appStateContent);
    
    if (!appState || appState.length === 0) {
      Logger.error('AppState is empty! Please add your Facebook appstate to appstate.json');
      Logger.info('You can get your appstate using a browser extension like "c3c-fbstate"');
      process.exit(1);
    }
  } catch (error) {
    Logger.error('Failed to read appstate.json:', error);
    Logger.info('Please create appstate.json with your Facebook appstate');
    process.exit(1);
  }

  loadCommands();
  loadEvents();

  login(appState, (err, api) => {
    if (err) {
      Logger.error('Login failed:', err);
      return;
    }

    Logger.success(lang.get('botStarted'));
    Logger.info(lang.get('listening'));
    Logger.info(`Prefix: ${config.prefix}`);
    Logger.info(`Language: ${config.language}`);
    Logger.info(`Admin UIDs: ${config.adminUIDs.join(', ')}`);

    if (config.autopost && config.autopost.enabled) {
      global.autopostInterval = autopost.startAutopost(api, config);
    }

    api.setOptions({
      listenEvents: true,
      logLevel: 'silent',
      selfListen: false
    });

    const listenEmitter = api.listenMqtt((err, event) => {
      if (err) {
        Logger.error('Listen error:', err);
        return;
      }

      for (const [eventName, eventHandler] of events) {
        try {
          eventHandler.run({ api, event, lang, config });
        } catch (error) {
          Logger.error(`Error in event ${eventName}:`, error);
        }
      }

      if (event.type === 'message' || event.type === 'message_reply') {
        if (event.body && event.body.startsWith(config.prefix)) {
          const args = event.body.slice(config.prefix.length).trim().split(/ +/);
          handleCommand(api, event, args, event.senderID);
        }
      }

      if (event.type === 'event' && event.logMessageType === 'log:subscribe' && config.autoSetNickname) {
        const botID = api.getCurrentUserID();
        if (event.logMessageData.addedParticipants.some(p => p.userFbId === botID)) {
          setTimeout(() => {
            api.changeNickname(config.botNickname, event.threadID, botID, (err) => {
              if (err) {
                Logger.error('Failed to set nickname:', err);
              } else {
                Logger.success(`Set nickname to "${config.botNickname}" in thread ${event.threadID}`);
              }
            });
          }, 3000);
        }
      }
    });
  });
}

startBot();
