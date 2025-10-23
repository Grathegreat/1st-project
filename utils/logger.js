const chalk = require('chalk');

class Logger {
  static info(message) {
    console.log(chalk.blue('[INFO]'), chalk.white(message));
  }

  static success(message) {
    console.log(chalk.green('[SUCCESS]'), chalk.white(message));
  }

  static warn(message) {
    console.log(chalk.yellow('[WARN]'), chalk.white(message));
  }

  static error(message, error) {
    console.log(chalk.red('[ERROR]'), chalk.white(message));
    if (error) {
      console.log(chalk.red(error.stack || error));
    }
  }

  static command(commandName, senderName, threadID) {
    console.log(
      chalk.magenta('[COMMAND]'),
      chalk.cyan(commandName),
      chalk.white('from'),
      chalk.yellow(senderName),
      chalk.white('in thread'),
      chalk.green(threadID)
    );
  }

  static event(eventType, data) {
    console.log(
      chalk.cyan('[EVENT]'),
      chalk.magenta(eventType),
      chalk.white(data ? JSON.stringify(data) : '')
    );
  }

  static banner() {
    console.log(chalk.cyan('╔══════════════════════════════════════╗'));
    console.log(chalk.cyan('║') + chalk.bold.white('   Facebook Messenger Bot Started    ') + chalk.cyan('║'));
    console.log(chalk.cyan('╚══════════════════════════════════════╝'));
  }
}

module.exports = Logger;
