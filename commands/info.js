module.exports = {
  config: {
    name: 'info',
    aliases: ['botinfo', 'about'],
    description: 'Show bot information',
    usage: 'info',
    cooldown: 5,
    adminOnly: false
  },

  run: async ({ api, event, config }) => {
    const os = require('os');
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    let message = `╔════ BOT INFO ════╗\n\n`;
    message += `🤖 Name: ${config.botName}\n`;
    message += `📝 Nickname: ${config.botNickname}\n`;
    message += `⌨️ Prefix: ${config.prefix}\n`;
    message += `🌐 Language: ${config.language.toUpperCase()}\n`;
    message += `⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s\n`;
    message += `💾 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n`;
    message += `🖥️ Platform: ${os.platform()}\n`;
    message += `📦 Node: ${process.version}\n\n`;
    message += `╚═══════════════════╝`;
    
    await api.sendMessage(message, event.threadID).catch(err => {
      console.error('Failed to send info message:', err);
    });
  }
};
