# MC Bots Controller (Electron + Mineflayer)

A graphical interface for launching multiple Minecraft bots (mineflayer) directly to a server IP/domain.

---

## 🚀 Features

- Launch multiple bots simultaneously  
- Custom nicknames or random Ukrainian nicknames  
- Auto-registration using `/register password password` with configurable delay  
- Auto chat system:
  - Custom message text  
  - Configurable message interval  
  - Option to add `/g` before messages  
  - Option to add `!` before message text  
  - Flexible delays between login → `/register` → `/g` → first message  
- Configurable reconnect delay after kick  
- Logs written to console and `bot_logs.txt` file  
- "Stop All Bots" button in GUI  

---

## 📦 Requirements

- Node.js 18+ (recommended)

---

## ⚙ Installation

```bash
git clone https://github.com/Zakhar2256/minecraft-Bots
cd Minecraft-Bots
npm install
```

If Electron is not installed:

```bash
npm install electron --save-dev
```

---

## 🖥 Running the GUI

```bash
npm start
```

The **MC Bots Controller** window will open.

Fill in:

- Server IP/domain and port  
- Minecraft version (or leave empty for auto-detect)  
- Number of bots and connection interval  
- Message text and message interval  
- `/register`, `/g`, and `!` options  
- All delay settings:
  - Delay before `/register`  
  - Delay after `/register`  
  - Delay before first message  
  - Delay between `/g` and message text  
  - Delay before reconnect  

Click **"Start Bots"** to launch bots.  
Click **"Stop All Bots"** to fully stop them.

---

## 💻 Running from Console (CLI Mode)

```bash
node bot.js
```

The script will ask for configuration in the console:

- IP  
- Port  
- Number of bots  
- Delays  
- Other settings  

It can also save configuration templates to `templates.json`.