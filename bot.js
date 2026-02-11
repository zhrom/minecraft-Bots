const mineflayer = require('mineflayer');
const chalk = require('chalk');
const fs = require('fs');
const { createWriteStream } = require('fs');
let rl = null; 

const bots = [];
let stopRequested = false;
const TEMPLATE_FILE = 'templates.json';
const LOG_FILE = 'bot_logs.txt';
const logStream = createWriteStream(LOG_FILE, { flags: 'a' });
let muteConsoleLogs = false;

const usedNames = new Set();

function ask(question) {
  if (!rl) {
    const readline = require('readline');
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
  return new Promise(resolve => {
    muteConsoleLogs = false;
    rl.question(chalk.cyanBright(`Question ${question} `), (answer) => {
      muteConsoleLogs = true;
      resolve(answer);
    });
  });
}

function generateUniqueUsername(index) {
  const names = [
    'Oleg', 'Andriy', 'Mykola', 'Dmytro', 'Ivan',
    'Yuriy', 'Serhiy', 'Volodymyr', 'Taras', 'Roman',
    'Oleksandr', 'Lesya', 'Artem', 'Julia', 'Anna', 'Vitaliy'
  ];
  let name;
  while (true) {
    const n = names[Math.floor(Math.random() * names.length)];
    const num = Math.floor(Math.random() * 1000000);
    name = `${n}${num}_${index+1}`;
    if (!usedNames.has(name)) {
      usedNames.add(name);
      break;
    }
  }
  return name;
}

function getUsernameForIndex(baseNamesArr, i) {
  if (i < baseNamesArr.length && baseNamesArr[i]) {
    return baseNamesArr[i];
  }
  if (baseNamesArr.length === 1 && baseNamesArr[0]) {
    let base = baseNamesArr[0];
    let name = `${base}${i+1}`;
    let tryName = name;
    let suffix = 1;
    while (usedNames.has(tryName)) {
      tryName = `${name}_${suffix++}`;
    }
    usedNames.add(tryName);
    return tryName;
  }
  return generateUniqueUsername(i);
}

function displayBanner() {
  console.log(chalk.greenBright(`
=======================================
                MC Bot 
=======================================
  Minecraft Multi-Bot direct IP
=======================================\n`));
}

function logToFile(message) {
  const timestamp = new Date().toISOString();
  logStream.write(`[${timestamp}] ${message}\n`);
}

function log(message, consoleColor) {
  logToFile(message);
  if (!muteConsoleLogs) {
    console.log(consoleColor(message));
  }
}

function loadTemplates() {
  if (fs.existsSync(TEMPLATE_FILE)) {
    return JSON.parse(fs.readFileSync(TEMPLATE_FILE, 'utf8'));
  }
  return {};
}

function saveTemplates(templates) {
  fs.writeFileSync(TEMPLATE_FILE, JSON.stringify(templates, null, 2));
}

function parseAndStartBotsFromConfig(rawConfig) {
  const {
    ip,
    portInput,
    count,
    connectInterval,
    useAutoChat,
    message,
    messageInterval,
    customNamesInput,
    version,
    useRegister,
    registerPassword,
    useGlobalChat,
    useExclamation,
    verboseLogging,
    muteConsole,
    registerDelaySeconds,
    postRegisterDelaySeconds,
    firstMessageDelaySeconds,
    globalChatDelaySeconds,
    reconnectDelaySeconds
  } = rawConfig;

  muteConsoleLogs = !!muteConsole;
  stopRequested = false;

  const port = portInput ? parseInt(portInput) : 25565;
  const customNamesArr = customNamesInput
    ? customNamesInput.split(',').map(name => name.trim()).filter(Boolean)
    : [];

  usedNames.clear();

  const safeRegisterDelay = typeof registerDelaySeconds === 'number' ? registerDelaySeconds : 5;
  const safePostRegisterDelay = typeof postRegisterDelaySeconds === 'number' ? postRegisterDelaySeconds : 5;
  const safeFirstMessageDelay = typeof firstMessageDelaySeconds === 'number' ? firstMessageDelaySeconds : 5;
  const safeGlobalChatDelay = typeof globalChatDelaySeconds === 'number' ? globalChatDelaySeconds : 1;
  const safeReconnectDelay = typeof reconnectDelaySeconds === 'number' ? reconnectDelaySeconds : 5;

  console.log(chalk.greenBright(`\nStarting ${count} bots on server ${ip}:${port}, version: ${version || 'auto'}`));
  logToFile(`Starting ${count} bots on server ${ip}:${port}, version: ${version || 'auto'}`);

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      if (stopRequested) return;
      const username = getUsernameForIndex(customNamesArr, i);
      startBot(
        i,
        ip,
        port,
        version,
        message,
        messageInterval,
        useRegister,
        useGlobalChat,
        useExclamation,
        useAutoChat,
        username,
        verboseLogging,
        registerPassword || '342384248292',
        safeRegisterDelay,
        safePostRegisterDelay,
        safeFirstMessageDelay,
        safeGlobalChatDelay,
        safeReconnectDelay
      );
    }, i * connectInterval * 1000);
  }
}

function stopAllBots() {
  stopRequested = true;
  log('Stop all bots at user request', chalk.redBright);
  bots.forEach(bot => {
    try {
      bot.end('Stopped by user');
    } catch (e) {
      // ignore
    }
  });
}

async function main() {
  displayBanner();
  const templates = loadTemplates();
  let config = {};

  if (Object.keys(templates).length > 0) {
    console.log(chalk.yellow('saved templates:'));
    const templateNames = Object.keys(templates);
    templateNames.forEach((name, idx) => {
      console.log(chalk.yellow(`${idx + 1}. ${name}`));
    });
    const choice = await ask('Select a template (number) or press Enter for a new one:');
    const selectedIdx = parseInt(choice) - 1;
    if (!isNaN(selectedIdx) && selectedIdx >= 0 && selectedIdx < templateNames.length) {
      const selectedName = templateNames[selectedIdx];
      config = templates[selectedName];
      console.log(chalk.green(`Downloaded tampate: ${selectedName}`));
    }
  }

  const verboseLogging = (await ask('Verbose logging? (y/n):')).toLowerCase() === 'y';
  const muteConsole = (await ask('Mute console logs during bot activity? (y/n):')).toLowerCase() === 'y';

  const ip = config.ip || await ask('Enter server IP or domain:');
  const portInput = config.portInput || await ask('Enter port (default 25565):');
  const count = config.count || parseInt(await ask('How many bots:'));
  const connectInterval = config.connectInterval || parseInt(await ask('Connection interval seconds:'));
  const useAutoChat = config.useAutoChat ?? (await ask('Should bots automatically send messages? (y/n):')).toLowerCase() === 'y';
  let message = config.message || '';
  let messageInterval = config.messageInterval || 0;
  if (useAutoChat) {
    message = await ask('Chat message:') || config.message;
    messageInterval = parseInt(await ask('Message interval seconds:')) || config.messageInterval;
  }

  const customNamesInput = config.customNamesInput || await ask('Enter custom bot names (comma-separated, leave empty for random):');
  const version = config.version || await ask('Minecraft version (e.g., 1.21.4 or empty):');
  const useRegister = config.useRegister ?? (await ask('Use /register command on login? (y/n):')).toLowerCase() === 'y';
  let registerPassword = config.registerPassword || '342384248292';
  if (useRegister) {
    registerPassword = await ask('Enter password for /register (leave empty for default: 342384248292):') || '342384248292';
  }

  const useGlobalChat = config.useGlobalChat ?? (await ask('Use /g command before messages? (y/n):')).toLowerCase() === 'y';
  const useExclamation = config.useExclamation ?? (await ask('Add ! before messages? (y/n):')).toLowerCase() === 'y';

  let registerDelaySeconds = config.registerDelaySeconds ?? 5;
  let postRegisterDelaySeconds = config.postRegisterDelaySeconds ?? 5;
  let firstMessageDelaySeconds = config.firstMessageDelaySeconds ?? 5;
  const globalChatDelaySeconds = config.globalChatDelaySeconds ?? 1;
  const reconnectDelaySeconds = config.reconnectDelaySeconds ?? 5;

  if (useRegister) {
    registerDelaySeconds = parseInt(await ask('Seconds after login before /register (default 5):')) || 5;
    if (useAutoChat) {
      postRegisterDelaySeconds = parseInt(await ask('Seconds after /register before starting chat (default 5):')) || 5;
    }
  } else if (useAutoChat) {
    firstMessageDelaySeconds = parseInt(await ask('Seconds after login before starting chat (default 5):')) || 5;
  }

  const finalConfig = {
    ip,
    portInput,
    count,
    connectInterval,
    useAutoChat,
    message: useAutoChat ? message : '',
    messageInterval: useAutoChat ? messageInterval : 0,
    customNamesInput,
    version,
    useRegister,
    registerPassword,
    useGlobalChat,
    useExclamation,
    verboseLogging,
    muteConsole,
    registerDelaySeconds,
    postRegisterDelaySeconds,
    firstMessageDelaySeconds,
    globalChatDelaySeconds,
    reconnectDelaySeconds
  };

  parseAndStartBotsFromConfig(finalConfig);

  if (rl) {
    rl.on('line', (input) => {
      const [command, botName, ...messageParts] = input.trim().split(' ');
      if (command === '/bot') {
        const messageText = messageParts.join(' ');
        const bot = bots.find(b => b.username === botName);
        if (bot) {
          bot.chat(messageText);
          log(`${botName} wrote: ${messageText}`, chalk.cyan);
        } else {
          log(`Бот ${botName} не знайдено`, chalk.red);
        }
      }
    });
  }

  const saveTemplate = (await ask('Save this configuration as template? (y/n):')).toLowerCase() === 'y';
  if (saveTemplate) {
    const templateName = await ask('Enter template name:');
    templates[templateName] = finalConfig;
    saveTemplates(templates);
    console.log(chalk.green(`Tamplate "${templateName}" saved!`));
  }
}

function startBot(
  index,
  ip,
  port,
  version,
  message,
  messageInterval,
  useRegister,
  useGlobalChat,
  useExclamation,
  useAutoChat,
  username,
  verboseLogging,
  registerPassword,
  registerDelaySeconds,
  postRegisterDelaySeconds,
  firstMessageDelaySeconds,
  globalChatDelaySeconds,
  reconnectDelaySeconds
) {
  log(`${username} Creating a bot without a proxy (direct connection)`, chalk.yellow);

  const bot = mineflayer.createBot({
    host: ip,
    port: port,
    username: username,
    version: version || false,
    auth: 'offline'
  });

  bots.push(bot);

  bot.once('spawn', () => {
    log(`${username} bot joined server`, chalk.green);
  });

  bot.on('message', (jsonMsg) => {
    const text = jsonMsg.toString();

    log(`${username} received a message: ${text}`, chalk.gray);

    const match = text.match(/not\s.*right?[:\-\s]\s*([A-Za-z0-9]{4,10})/i);
    if (match) {
      const code = match[1].trim();
      log(`${username} КАПТЧА → ${code}`, chalk.redBright.bold);
      setTimeout(() => {
        bot.chat(code);
        log(`${username} відповів: ${code}`, chalk.greenBright.bold);
      }, 800 + Math.random() * 800);
    }

    if (text.includes('You have exceeded the maximum number of registrations')) {
      log(`${username} ліміт реєстрацій вичерпано`, chalk.red);
    }
  });

  bot.once('login', () => {
    log(`${username} joined server`, chalk.green);
    const startChatFlow = () => {
      if (!useAutoChat || !message) return;
      if (useGlobalChat) {
        bot.chat('/g');
        log(`${username} wrote: /g`, chalk.cyan);
      }
      setTimeout(() => {
        const msg = useExclamation ? `!${message}` : message;
        bot.chat(msg);
        log(`${username} wrote: ${msg}`, chalk.cyan);
        setInterval(() => {
          bot.chat(msg);
          log(`${username} wrote: ${msg}`, chalk.cyan);
        }, messageInterval * 1000);
      }, globalChatDelaySeconds * 1000);
    };

    if (useRegister) {
      setTimeout(() => {
        bot.chat(`/register ${registerPassword} ${registerPassword}`);
        log(`${username} wrote: /register ${registerPassword} ${registerPassword}`, chalk.cyan);
        if (useAutoChat) {
          setTimeout(startChatFlow, postRegisterDelaySeconds * 1000);
        }
      }, registerDelaySeconds * 1000);
    } else if (useAutoChat) {
      setTimeout(startChatFlow, firstMessageDelaySeconds * 1000);
    }
  });

  bot.on('chat', (sender, msg) => log(`${username} чат: ${sender}: ${msg}`, chalk.white));
  bot.on('whisper', (sender, msg) => log(`${username} шепіт: ${sender}: ${msg}`, chalk.magenta));
  bot.on('kicked', reason => {
    log(`${username} кік: ${reason}`, chalk.red);
    if (stopRequested) return;
    setTimeout(() => startBot(
      index,
      ip,
      port,
      version,
      message,
      messageInterval,
      useRegister,
      useGlobalChat,
      useExclamation,
      useAutoChat,
      username,
      verboseLogging,
      registerPassword,
      registerDelaySeconds,
      postRegisterDelaySeconds,
      firstMessageDelaySeconds,
      globalChatDelaySeconds,
      reconnectDelaySeconds
    ), reconnectDelaySeconds * 1000);
  });
  bot.on('end', () => {
    const idx = bots.findIndex(b => b.username === username);
    if (idx !== -1) bots.splice(idx, 1);
    log(`${username} kicked`, chalk.red);
  });
  bot.on('error', err => log(`Помилка ${username}: ${err.message}`, chalk.red));

  if (verboseLogging) {
  }
}

module.exports = {
  parseAndStartBotsFromConfig,
  stopAllBots
};

if (require.main === module) {
  main();
}
