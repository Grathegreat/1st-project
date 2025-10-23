module.exports = {
  config: {
    name: 'restart',
    aliases: ['reboot'],
    description: 'Restart the bot',
    usage: 'restart',
    cooldown: 10,
    adminOnly: true
  },

  run: async ({ api, event, lang }) => {
    api.sendMessage(lang.get('restart.response'), event.threadID, () => {
      process.exit(0);
    });
  }
};
