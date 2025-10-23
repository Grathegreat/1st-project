module.exports = {
  config: {
    name: 'autoReact',
    description: 'Auto react to bot mentions'
  },

  run: async ({ api, event, config }) => {
    if (event.type === 'message' || event.type === 'message_reply') {
      const botID = api.getCurrentUserID();
      
      if (event.body && event.body.includes(`@${botID}`)) {
        const reactions = ['👋', '👍', '❤️', '😊'];
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        
        api.setMessageReaction(randomReaction, event.messageID, (err) => {
          if (err) console.error('Failed to react:', err);
        }, true);
      }
      
      if (event.body && event.body.startsWith(config.prefix)) {
        api.setMessageReaction('⚡', event.messageID, (err) => {
          if (err) console.error('Failed to react:', err);
        }, true);
      }
    }
  }
};
