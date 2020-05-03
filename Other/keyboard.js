const emoji = require('node-emoji');

const log_keyboard = {
  reply_markup: {
    keyboard: [
      [emoji.get('airplane_departure') + " Sign In " + emoji.get('airplane_departure'), emoji.get('small_airplane') + " Create an account " + emoji.get('small_airplane')],
      [emoji.get('satellite') + " Continue without sign in " + emoji.get('satellite')]
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  }
};

const menu_keyboard = {
  reply_markup: {
    keyboard: [
      [emoji.get('mag_right') + " Search for flights " + emoji.get('mag_right')],
      [emoji.get('gear') + " User " + emoji.get('gear')]
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  }
};

const confirm_keyboard = {
  reply_markup: {
    keyboard: [
      ["Yes " + emoji.get('heavy_check_mark'), "No " + emoji.get('x')]
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  }
};

const user_keyboard = {
  reply_markup: {
    keyboard: [
      [emoji.get('leftwards_arrow_with_hook') + " Go back " + emoji.get('leftwards_arrow_with_hook')],
      [emoji.get('small_orange_diamond') + " Log out " + emoji.get('small_orange_diamond')]
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  }
};

const notuser_keyboard = {
  reply_markup: {
    keyboard: [
      [emoji.get('leftwards_arrow_with_hook') + " Go back " + emoji.get('leftwards_arrow_with_hook')]
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  }
};

module.exports = { log_keyboard, menu_keyboard, confirm_keyboard, user_keyboard, notuser_keyboard }