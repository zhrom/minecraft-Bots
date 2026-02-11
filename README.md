
MC Bots Controller (Electron + mineflayer)
Graphical interface for launching multiple Minecraft bots (using mineflayer) directly to a server IP/domain.
Features
Launch multiple bots at the same time
Custom names or random Ukrainian nicknames
Auto-registration: /register password password with configurable delay
Auto-chat:
Custom message text
Interval between messages
Option to add /g before messages (global chat)
Option to add ! before the text
Flexible delays: login → /register → /g → first message
Configurable delay before reconnecting after a kick
Logs output to console + saved to bot_logs.txt file
"Stop All Bots" button in the GUI
Requirements
Node.js 18 or higher (recommended)
Installation
git clone https://github.com/Zakhar2256/minecraft-Bots
cd Minecraft-Bots
npm install
If Electron is not installed:
npm install electron --save-dev
Launching the GUI
npm start
A window will open: MC Bots Controller
Fill in:
Server IP/domain and port
Minecraft version (leave empty for auto-detect)
Number of bots and connection interval
Message text and interval
Options for /register, /g, ! prefix
All delays (before /register, after it, before first message, between /g and text, before reconnect)
Then click "Start Bots"
To completely stop all bots, click "Stop All Bots"
Console Mode
node bot.js
The script will ask questions in the console (IP, port, number of bots, delays, etc.)
It can also save configuration templates to templates.json.
Enjoy using the bot controller! 🚀