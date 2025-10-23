module.exports = {
  config: {
    name: 'help',
    aliases: ['h', 'commands'],
    description: 'Show all available commands',
    usage: 'help [command]',
    cooldown: 5,
    adminOnly: false
  },

  run: async ({ api, event, args, lang, config }) => {
    const fs = require('fs');
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    
    if (args.length === 0) {
      let message = `${lang.get('help.title')}\n\n`;
      
      for (const file of commandFiles) {
        const command = require(`./${file}`);
        const desc = lang.get(`${command.config.name}.description`) || command.config.description;
        message += `${config.prefix}${command.config.name} - ${desc}\n`;
      }
      
      message += `\n💡 Use ${config.prefix}help <command> for more info`;
      
      await api.sendMessage(message, event.threadID).catch(err => {
        console.error('Failed to send help message:', err);
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commandFiles
        .map(f => require(`./${f}`))
        .find(cmd => cmd.config.name === commandName || (cmd.config.aliases && cmd.config.aliases.includes(commandName)));
      
      if (!command) {
        return await api.sendMessage(`Command "${commandName}" not found.`, event.threadID).catch(err => {
          console.error('Failed to send message:', err);
        });
      }
      
      const desc = lang.get(`${command.config.name}.description`) || command.config.description;
      let message = `📌 Command: ${command.config.name}\n`;
      message += `📝 ${lang.get('help.description')}: ${desc}\n`;
      message += `⌨️ ${lang.get('help.usage')
        .replace('{prefix}', config.prefix)
        .replace('{command}', command.config.name)
        .replace('{args}', command.config.usage.split(' ').slice(1).join(' '))}\n`;
      
      if (command.config.aliases) {
        message += `🔖 Aliases: ${command.config.aliases.join(', ')}\n`;
      }
      
      message += `⏱️ Cooldown: ${command.config.cooldown || 3}s\n`;
      message += `🔒 Admin Only: ${command.config.adminOnly ? 'Yes' : 'No'}`;
      
      await api.sendMessage(message, event.threadID).catch(err => {
        console.error('Failed to send help message:', err);
      });
    }
  }
};
