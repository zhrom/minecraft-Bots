window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('config-form');
  const statusEl = document.getElementById('status');
  const stopBtn = document.getElementById('stop-bots-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const config = {
      ip: formData.get('ip') || '',
      portInput: formData.get('port') || '25565',
      count: parseInt(formData.get('count') || '1', 10),
      connectInterval: parseInt(formData.get('connectInterval') || '1', 10),
      useAutoChat: formData.get('useAutoChat') === 'on',
      message: formData.get('message') || '',
      messageInterval: parseInt(formData.get('messageInterval') || '5', 10),
      customNamesInput: formData.get('customNames') || '',
      version: formData.get('version') || '',
      useRegister: formData.get('useRegister') === 'on',
      registerPassword: formData.get('registerPassword') || '342384248292',
      useGlobalChat: formData.get('useGlobalChat') === 'on',
      useExclamation: formData.get('useExclamation') === 'on',
      verboseLogging: formData.get('verboseLogging') === 'on',
      muteConsole: formData.get('muteConsole') === 'on',
      registerDelaySeconds: parseInt(formData.get('registerDelaySeconds') || '5', 10),
      postRegisterDelaySeconds: parseInt(formData.get('postRegisterDelaySeconds') || '5', 10),
      firstMessageDelaySeconds: parseInt(formData.get('firstMessageDelaySeconds') || '5', 10),
      globalChatDelaySeconds: parseInt(formData.get('globalChatDelaySeconds') || '1', 10),
      reconnectDelaySeconds: parseInt(formData.get('reconnectDelaySeconds') || '5', 10)
    };

    statusEl.textContent = 'Запускаємо ботів...';

    try {
      if (window.mcBots && typeof window.mcBots.startBots === 'function') {
        await window.mcBots.startBots(config);
        statusEl.textContent = 'Боти запускаються. Дивіться лог в консолі застосунку / файлі bot_logs.txt';
      } else {
        statusEl.textContent = 'Помилка: API недоступне.';
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Сталася помилка при запуску ботів. Перевірте консоль.';
    }
  });

  if (stopBtn) {
    stopBtn.addEventListener('click', async () => {
      statusEl.textContent = 'Зупиняємо всіх ботів...';
      try {
        if (window.mcBots && typeof window.mcBots.stopBots === 'function') {
          await window.mcBots.stopBots();
          statusEl.textContent = 'Всі боти зупинені.';
        } else {
          statusEl.textContent = 'Помилка: API зупинки недоступне.';
        }
      } catch (err) {
        console.error(err);
        statusEl.textContent = 'Сталася помилка при зупинці ботів. Перевірте консоль.';
      }
    });
  }
});


