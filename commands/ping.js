module.exports = {
  config: {
    name: 'ping',
    aliases: ['p'],
    description: 'Check bot latency',
    usage: 'ping',
    cooldown: 3,
    adminOnly: false
  },

  run: async ({ api, event, lang }) => {
    const start = Date.now();
    
    api.sendMessage('Pinging...', event.threadID, (err, messageInfo) => {
      const latency = Date.now() - start;
      const response = lang.get('ping.response', { ms: latency });
      
      api.editMessage(response, messageInfo.messageID);
    });
  }
};
