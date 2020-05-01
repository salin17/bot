const emoji = require('node-emoji');

const log_keyboard = {
  reply_markup: {
    keyboard: [
      [emoji.get('airplane_departure') + "Log In" + emoji.get('airplane_departure'), emoji.get('small_airplane') + "Sign In" + emoji.get('small_airplane')],
      [emoji.get('satellite') + "Continue without logging in" + emoji.get('satellite')]
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  }
};

const menu_keyboard = {
  reply_markup: {
    keyboard: [
      [emoji.get('mag_right') + "Search for flights" + emoji.get('mag_right'), "prova2"],
      [emoji.get('gear') + "User" + emoji.get('gear')]
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  }
};

const confirm_keyboard = {
  reply_markup: {
    keyboard: [
      ["Yes " + emoji.get('heavy_check_mark'),"No " + emoji.get('x')]
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  }
};

module.exports = { log_keyboard, menu_keyboard, confirm_keyboard }