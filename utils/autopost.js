const https = require('https');
const Logger = require('./logger');

function getCatFact() {
  return new Promise((resolve, reject) => {
    https.get('https://catfact.ninja/fact', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.fact);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function startAutopost(api, config) {
  if (!config.autopost.enabled || !config.autopost.threadID) {
    Logger.info('Autopost is disabled or no thread ID set');
    return null;
  }
  
  const intervalMs = (config.autopost.intervalMinutes || 3) * 60 * 1000;
  
  Logger.success(`Autopost started: posting every ${config.autopost.intervalMinutes} minutes to thread ${config.autopost.threadID}`);
  
  const intervalId = setInterval(async () => {
    try {
      const catFact = await getCatFact();
      const message = `🐱 Cat Fact of the Moment!\n\n${catFact}\n\n━━━━━━━━━━━━━━━\n⏰ Auto-posted every ${config.autopost.intervalMinutes} minutes`;
      
      api.sendMessage(message, config.autopost.threadID, (err) => {
        if (err) {
          Logger.error('Failed to send autopost:', err);
        } else {
          Logger.success(`Posted cat fact to thread ${config.autopost.threadID}`);
        }
      });
    } catch (error) {
      Logger.error('Failed to get cat fact:', error);
    }
  }, intervalMs);
  
  return intervalId;
}

module.exports = {
  getCatFact,
  startAutopost
};
