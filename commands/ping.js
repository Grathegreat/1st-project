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
      if (err) {
        console.error('Failed to send ping message:', err);
        return;
      }
      const latency = Date.now() - start;
      const response = lang.get('ping.response', { ms: latency });
      
      api.editMessage(response, messageInfo.messageID, (editErr) => {
        if (editErr) {
          console.error('Failed to edit ping message:', editErr);
        }
      });
    });
  }
};
