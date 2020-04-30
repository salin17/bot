const emoji = require('node-emoji');

const log_keyboard = {
  reply_markup: {
    keyboard: [
      [emoji.get('airplane_departure') + "Accedi" + emoji.get('airplane_departure'), emoji.get('small_airplane') + "Registrati" + emoji.get('small_airplane')],
      [emoji.get('satellite') + "Continua senza accedere" + emoji.get('satellite')]
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  }
};

const menu_keyboard = {
  reply_markup: {
    keyboard: [
      [emoji.get('mag_right') + "Cerca Voli" + emoji.get('mag_right'), "prova2"],
      [emoji.get('gear') + "Impostazioni Utente" + emoji.get('gear')]
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  }
};

module.exports = { log_keyboard, menu_keyboard }