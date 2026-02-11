# MC Bots Controller (Electron + mineflayer)

Graphical interface for launching multiple Minecraft bots (using mineflayer) directly to a server IP/domain.

## Features

- Launch multiple bots simultaneously
- Custom nicknames or random Ukrainian-style names
- Auto-registration: `/register password password` with configurable delay
- Auto-chat features:
  - Custom message text
  - Interval between messages
  - Option to prefix messages with `/g` (global chat)
  - Option to prefix text with `!`
  - Flexible delays: login → `/register` → `/g` → first message
- Configurable reconnect delay after kick/disconnect
- Logging to console + file `bot_logs.txt`
- "Stop All Bots" button in the GUI

## Requirements

- Node.js 18+ (recommended)

## Installation

```bash
git clone https://github.com/zhrom/minecraft-Bots
cd Minecraft-Bots
npm install