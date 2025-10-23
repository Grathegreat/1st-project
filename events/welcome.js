module.exports = {
  config: {
    name: 'welcome',
    description: 'Send welcome message when someone joins'
  },

  run: async ({ api, event, config }) => {
    if (event.logMessageType === 'log:subscribe') {
      const addedParticipants = event.logMessageData.addedParticipants;
      
      for (const participant of addedParticipants) {
        if (participant.userFbId !== api.getCurrentUserID()) {
          const name = participant.fullName;
          
          let welcomeMessage = `👋 Welcome ${name} to the group!\n\n`;
          welcomeMessage += `Use ${config.prefix}help to see available commands.\n`;
          welcomeMessage += `Have fun! 🎉`;
          
          setTimeout(() => {
            api.sendMessage(welcomeMessage, event.threadID);
          }, 1000);
        }
      }
    }
  }
};
