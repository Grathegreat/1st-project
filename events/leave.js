module.exports = {
  config: {
    name: 'leave',
    description: 'Send goodbye message when someone leaves'
  },

  run: async ({ api, event }) => {
    if (event.logMessageType === 'log:unsubscribe') {
      const leftParticipantFbId = event.logMessageData.leftParticipantFbId;
      
      if (leftParticipantFbId !== api.getCurrentUserID()) {
        api.getUserInfo(leftParticipantFbId, (err, userInfo) => {
          if (!err && userInfo) {
            const name = userInfo[leftParticipantFbId]?.name || 'Someone';
            const message = `👋 ${name} has left the group. Goodbye!`;
            
            api.sendMessage(message, event.threadID);
          }
        });
      }
    }
  }
};
