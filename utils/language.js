const fs = require('fs');
const path = require('path');

class Language {
  constructor(lang = 'en') {
    this.lang = lang;
    this.data = this.loadLanguage(lang);
  }

  loadLanguage(lang) {
    try {
      const filePath = path.join(__dirname, '..', 'languages', `${lang}.json`);
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      console.error(`Failed to load language file for ${lang}, falling back to en`);
      const filePath = path.join(__dirname, '..', 'languages', 'en.json');
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  }

  get(key, replacements = {}) {
    const keys = key.split('.');
    let value = this.data;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value === 'string') {
      Object.keys(replacements).forEach(replaceKey => {
        value = value.replace(new RegExp(`{${replaceKey}}`, 'g'), replacements[replaceKey]);
      });
    }

    return value;
  }

  setLanguage(lang) {
    this.lang = lang;
    this.data = this.loadLanguage(lang);
  }
}

module.exports = Language;
