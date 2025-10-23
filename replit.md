# Overview

This is a Facebook Messenger chatbot built with Node.js that features a Discord-like command and event system. The bot uses the `ws3-fca` library to interact with Facebook Messenger and provides a modular architecture for commands and events. It supports multi-language localization (English and Tagalog), command cooldowns, admin permissions, and beautiful console logging with Chalk. The bot can automatically react to messages, welcome new group members, respond to various commands with a configurable prefix system, and automatically post cat facts at regular intervals.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Core Architecture Pattern

**Command and Event System**: The bot uses a modular plugin architecture similar to Discord.js bots, where commands and events are separate modules dynamically loaded at runtime. Each command/event is a self-contained module with its own configuration and execution logic.

- **Rationale**: Provides scalability and maintainability by allowing easy addition/removal of features without modifying core bot logic
- **Pros**: Clean separation of concerns, easy to extend, simple to debug individual features
- **Cons**: Slight overhead from dynamic module loading

## Authentication & Session Management

**Facebook AppState Authentication**: Uses JSON-based cookie storage (`appstate.json`) to maintain Facebook session without requiring username/password login.

- **Rationale**: Facebook's official API doesn't support bot accounts; this unofficial method uses browser cookies to authenticate
- **Security Note**: AppState files contain sensitive credentials and must never be committed to version control (already in `.gitignore`)
- **Pros**: No password storage, persistent sessions
- **Cons**: Sessions can expire, requires manual cookie extraction from browser

## Message Processing Flow

**Synchronous Command Handler with Cooldown System**: Messages are processed through a main handler that:
1. Checks if message starts with configured prefix
2. Parses command name and arguments
3. Validates permissions (admin-only commands)
4. Enforces per-user, per-command cooldowns
5. Executes command with dependency injection pattern

**Dependency Injection**: Commands receive an object containing `{ api, event, args, lang, config }` allowing them to access all necessary services without direct imports.

## Localization System

**JSON-based i18n**: Language files stored as JSON with nested key-value structure supporting placeholder replacement.

- **Implementation**: `Language` utility class provides `get(key, replacements)` method for retrieving translated strings
- **Fallback**: Automatically falls back to English if translation key missing or language file unavailable
- **Rationale**: Simple to maintain, easy for non-developers to add translations
- **Currently Supported**: English (en), Tagalog (tl)

## Command Structure

Each command module exports:
- `config`: Metadata (name, aliases, description, usage, cooldown, adminOnly flag)
- `run`: Async function that executes command logic

**Permission Levels**: 
- Regular users: Can execute all non-admin commands
- Admins: Defined by UIDs in `config.json`, can execute all commands including system operations

## Event System

Events automatically respond to Facebook Messenger events:
- **welcome**: Greets new group members with help information
- **leave**: Sends goodbye message when members leave
- **autoReact**: Adds emoji reactions to bot mentions and command messages

**Event Pattern**: Each event listens for specific `logMessageType` or message patterns and responds accordingly.

## Autopost Feature

**Scheduled Cat Fact Posting**: The bot can automatically post random cat facts from catfact.ninja at configurable intervals using Node.js setInterval.

- **Implementation**: `utils/autopost.js` fetches cat facts via HTTPS and manages interval timers
- **Control**: Can be enabled/disabled via config.json or the `autopost` command (admin-only)
- **Configuration**: Interval timing (default 3 minutes) and target thread ID are configurable
- **Safety**: Clears existing intervals before starting new ones to prevent duplicate timers
- **Rationale**: Demonstrates scheduled tasks and external API integration; provides engaging content for groups
- **Added**: October 2025

## Logging System

**Chalk-based Console Logger**: Custom logger utility with color-coded severity levels (info, success, warn, error) and specialized formatters for commands and events.

- **Rationale**: Provides better debugging and monitoring experience during development and production
- **Output**: Structured, colorful console output for different log types

# External Dependencies

## Third-Party Libraries

**ws3-fca** (v2.0.1): Unofficial Facebook Chat API library
- Purpose: Provides programmatic access to Facebook Messenger
- Core Functions: Login, send messages, listen for events, user info retrieval, reactions
- Note: This is an unofficial library that may break if Facebook changes their internal APIs

**chalk** (v4.1.2): Terminal styling library
- Purpose: Colorize console output for better readability
- Used in: Custom Logger utility for different log levels

## Runtime Environment

**Node.js**: JavaScript runtime (version not specified, but chalk v4 requires Node.js 10+)

## File-Based Storage

**Configuration**: `config.json` stores bot settings (prefix, admin UIDs, language, bot name/nickname)

**Session Storage**: `appstate.json` stores Facebook authentication cookies (excluded from version control)

**Additional Files**: `fb_dtsg_data.json` mentioned in README as sensitive credential file (not present in current codebase)

## No Database

The bot currently operates entirely in-memory and uses file-based storage for configuration and authentication. No database system (SQL or NoSQL) is currently integrated.

**Design Decision**: Stateless operation with file-based config suitable for simple bot use cases
- **Alternative Considered**: Could integrate database for persistent cooldowns, user preferences, or command history
- **Current Limitation**: Cooldowns reset on bot restart, no persistent user data storage