module.exports = {
  config: {
    name: 'autopost',
    aliases: ['ap', 'autoposting'],
    description: 'Toggle autopost cat facts on/off',
    usage: 'autopost [on|off] [threadID]',
    cooldown: 5,
    adminOnly: true
  },

  run: async ({ api, event, args, lang, config }) => {
    const fs = require('fs');
    
    if (args.length === 0) {
      const status = config.autopost.enabled ? 'ON' : 'OFF';
      const threadID = config.autopost.threadID || 'Not set';
      const interval = config.autopost.intervalMinutes || 3;
      
      let message = `📊 Autopost Status\n\n`;
      message += `Status: ${status}\n`;
      message += `Interval: ${interval} minutes\n`;
      message += `Thread ID: ${threadID}\n\n`;
      message += `Usage:\n`;
      message += `${config.prefix}autopost on - Enable in this thread\n`;
      message += `${config.prefix}autopost off - Disable autopost\n`;
      message += `${config.prefix}autopost on [threadID] - Enable in specific thread`;
      
      return api.sendMessage(message, event.threadID);
    }
    
    const action = args[0].toLowerCase();
    
    if (action === 'on') {
      const targetThreadID = args[1] || event.threadID;
      
      if (global.autopostInterval) {
        clearInterval(global.autopostInterval);
        global.autopostInterval = null;
      }
      
      config.autopost.enabled = true;
      config.autopost.threadID = targetThreadID;
      
      try {
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
      } catch (error) {
        return api.sendMessage(
          `❌ Failed to save config: ${error.message}`,
          event.threadID
        );
      }
      
      global.autopostInterval = require('../utils/autopost').startAutopost(api, config);
      
      api.sendMessage(
        `✅ Autopost enabled!\n\n` +
        `📍 Thread ID: ${targetThreadID}\n` +
        `⏰ Interval: ${config.autopost.intervalMinutes} minutes\n\n` +
        `Cat facts will be posted automatically.`,
        event.threadID
      );
    } else if (action === 'off') {
      config.autopost.enabled = false;
      
      try {
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
      } catch (error) {
        return api.sendMessage(
          `❌ Failed to save config: ${error.message}`,
          event.threadID
        );
      }
      
      if (global.autopostInterval) {
        clearInterval(global.autopostInterval);
        global.autopostInterval = null;
      }
      
      api.sendMessage(
        `❌ Autopost disabled!\n\nCat facts will no longer be posted automatically.`,
        event.threadID
      );
    } else {
      api.sendMessage(
        `Invalid action. Use:\n${config.prefix}autopost on\n${config.prefix}autopost off`,
        event.threadID
      );
    }
  }
};
