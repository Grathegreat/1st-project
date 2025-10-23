module.exports = {
  config: {
    name: 'uid',
    aliases: ['id', 'userid'],
    description: 'Get user ID',
    usage: 'uid [@mention]',
    cooldown: 3,
    adminOnly: false
  },

  run: async ({ api, event, lang }) => {
    let targetUID = event.senderID;
    
    if (Object.keys(event.mentions).length > 0) {
      targetUID = Object.keys(event.mentions)[0];
    }
    
    const response = lang.get('uid.response', { uid: targetUID });
    await api.sendMessage(response, event.threadID).catch(err => {
      console.error('Failed to send UID message:', err);
    });
  }
};
