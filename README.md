# Facebook Messenger Bot

A powerful Facebook Messenger chatbot with Discord-like command structure, multi-language support, and colorful console logging.

## Features

- ✨ Discord-like command and event system
- 🌐 Multi-language support (English & Tagalog)
- 🎨 Beautiful console output with Chalk
- ⚡ Command cooldowns and permissions
- 🤖 Auto-set bot nickname in new groups
- 📝 Easy configuration via config.json

## ⚠️ Security Warning

**IMPORTANT:** Your `appstate.json` and `fb_dtsg_data.json` contain sensitive Facebook credentials. 
- **NEVER** commit these files to version control
- **NEVER** share these files with anyone
- Both files are already in `.gitignore` to prevent accidental commits
- If these files are exposed, your Facebook account could be compromised
- Rotate your credentials immediately if you suspect they've been exposed

## Setup Instructions

### 1. Get Your Facebook AppState

You need to get your Facebook appstate to login. You can use a browser extension:

- **C3C FBState** (Chrome/Edge)
- **EditThisCookie** (Chrome/Firefox)

After installing the extension:
1. Login to Facebook in your browser
2. Use the extension to export your appstate
3. Copy the JSON array

### 2. Configure appstate.json

Replace the empty array in `appstate.json` with your Facebook appstate:

```json
[
  {
    "key": "...",
    "value": "...",
    ...
  }
]
```

### 3. Configure config.json

Edit `config.json` to customize your bot:

```json
{
  "botName": "FacebookBot",
  "botNickname": "🤖 Bot",
  "prefix": "!",
  "adminUIDs": ["YOUR_FACEBOOK_UID_HERE"],
  "language": "en",
  "autoSetNickname": true,
  "appState": "appstate.json"
}
```

**Important Settings:**
- `adminUIDs`: Add your Facebook UID (use `!uid` command to get it)
- `prefix`: Command prefix (default: `!`)
- `language`: `"en"` for English or `"tl"` for Tagalog
- `botNickname`: The nickname the bot will set for itself in groups

### 4. Run the Bot

```bash
node index.js
```

## Available Commands

| Command | Description | Admin Only |
|---------|-------------|------------|
| `!help` | Show all commands | No |
| `!ping` | Check bot latency | No |
| `!uid` | Get user ID | No |
| `!info` | Show bot information | No |
| `!prefix` | Show/change prefix | Yes (to change) |
| `!restart` | Restart the bot | Yes |
| `!autopost` | Toggle autopost cat facts | Yes |

## Events

- **welcome** - Sends welcome message when someone joins
- **leave** - Sends goodbye message when someone leaves
- **autoReact** - Auto reacts to messages with bot commands

## Autopost Feature

The bot can automatically post random cat facts from [catfact.ninja](https://catfact.ninja/fact) at regular intervals.

### Configure in config.json

```json
{
  "autopost": {
    "enabled": false,
    "intervalMinutes": 3,
    "threadID": ""
  }
}
```

- `enabled`: Set to `true` to enable autopost on bot startup
- `intervalMinutes`: How often to post (default: 3 minutes)
- `threadID`: The thread/group ID where cat facts will be posted

### Control with Commands

**Check status:**
```
!autopost
```

**Enable autopost in current thread:**
```
!autopost on
```

**Enable autopost in specific thread:**
```
!autopost on [threadID]
```

**Disable autopost:**
```
!autopost off
```

Cat facts will be automatically posted with a formatted message every X minutes (configurable).

## Creating Custom Commands

Create a new file in the `commands/` folder:

```javascript
module.exports = {
  config: {
    name: 'mycommand',
    aliases: ['mc'],
    description: 'My custom command',
    usage: 'mycommand [args]',
    cooldown: 5,
    adminOnly: false
  },

  run: async ({ api, event, args, lang, config }) => {
    // Your command logic here
    api.sendMessage('Hello!', event.threadID);
  }
};
```

## Creating Custom Events

Create a new file in the `events/` folder:

```javascript
module.exports = {
  config: {
    name: 'myevent',
    description: 'My custom event'
  },

  run: async ({ api, event, lang, config }) => {
    // Your event logic here
  }
};
```

## Language Support

Add translations to `languages/en.json` or `languages/tl.json`:

```json
{
  "mycommand": {
    "description": "My command description",
    "response": "Hello {name}!"
  }
}
```

Use in code:
```javascript
lang.get('mycommand.response', { name: 'User' })
```

## Troubleshooting

### Bot won't login
- Make sure your appstate is valid and up-to-date
- Try getting a fresh appstate
- Check if your Facebook account has 2FA enabled

### Commands not working
- Check if the prefix is correct
- Make sure you're using the right format: `prefix + command`
- Check console for errors

### Bot keeps logging out
- Your appstate may have expired, get a new one
- Facebook may have detected unusual activity

## License

MIT
