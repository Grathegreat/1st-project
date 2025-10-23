module.exports = {
  config: {
    name: 'prefix',
    aliases: ['setprefix'],
    description: 'Show or change bot prefix',
    usage: 'prefix [new_prefix]',
    cooldown: 5,
    adminOnly: false
  },

  run: async ({ api, event, args, lang, config }) => {
    const fs = require('fs');
    
    if (args.length === 0) {
      const response = lang.get('prefix.current', { prefix: config.prefix });
      return await api.sendMessage(response, event.threadID).catch(err => {
        console.error('Failed to send prefix message:', err);
      });
    }
    
    if (!config.adminUIDs.includes(event.senderID)) {
      return await api.sendMessage(lang.get('adminOnly'), event.threadID).catch(err => {
        console.error('Failed to send admin-only message:', err);
      });
    }
    
    const newPrefix = args[0];
    config.prefix = newPrefix;
    
    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
    
    const response = lang.get('prefix.changed', { prefix: newPrefix });
    await api.sendMessage(response, event.threadID).catch(err => {
      console.error('Failed to send prefix changed message:', err);
    });
  }
};
