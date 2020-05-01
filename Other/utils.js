const Telegraf = require('telegraf');
const bot = new Telegraf('882595709:AAGW8hXpOn95FYYI07fB56MSnp61XP_Ijhk');
const session = require('telegraf/session');

const Mongo = require('./mongo');
const Keyboard = require('./keyboard');
const Scraping = require('./scraping');

let nome, psw;
const log_keyboard = Keyboard.log_keyboard;
const menu_keyboard = Keyboard.menu_keyboard;
bot.use(session());

async function Navigazione(ctx, info) {
  await Mongo.Setup();
  switch (info[0]) {

    case 1.0:
      nome = await Mongo.Nome(ctx.message.text.toLowerCase());
      info[1] = nome.username;
      info[2] = nome.password;
      if (nome != null) {
        ctx.reply("Enter password:");
        user = "ciao";
        info[0] = 1.1;
      } else {
        ctx.reply("User not found");
        bot.telegram.sendMessage(ctx.chat.id, "Retry again", log_keyboard);
      }
      break;

    case 1.1:
      if (nome.password == ctx.message.text.toLowerCase()) {
        bot.telegram.sendMessage(ctx.chat.id, "Loged in successfully", menu_keyboard);
        ctx.reply("What do you want to do?");
        info[0] = 3;
      } else {
        ctx.reply("Wrong password!!");
        bot.telegram.sendMessage(ctx.chat.id, "Try again", log_keyboard);
      }
      break;

    case 2.0:
      nome = ctx.message.text.toLowerCase();
      ctx.reply("Enter password:");
      info[0] = 2.1;
      break;

    case 2.1:
      psw = ctx.message.text.toLowerCase();
      await Mongo.AddUser(nome, psw);
      bot.telegram.sendMessage(ctx.chat.id, "Signed in successfully", menu_keyboard);
      ctx.reply("What do you want to do?");
      info[0] = 3;
      info[1] = nome;
      info[2] = psw;
      break;

    default:
      ctx.reply("Command not valid");
      bot.telegram.sendMessage(ctx.chat.id, "Try again", log_keyboard);
      break;
  }

  return info;
}

async function InputCercaVoli(ctx, info) {
  switch (info[0]) {
    case 3.0:
      info[4]= ctx.message.text.substring(0, 1).toUpperCase() + ctx.message.text.substring(1, ctx.message.text.length).toLowerCase();
      ctx.reply("Enter place of destination:");
      info[0] = 3.1;
      break;

    case 3.1:
      info[5]= ctx.message.text.substring(0, 1).toUpperCase() + ctx.message.text.substring(1, ctx.message.text.length).toLowerCase();
      ctx.reply("Enter departure date(yyyy-mm-dd):");
      info[0] = 3.2;
      break;

    case 3.2:
      info[6] = ctx.message.text.substring(0, 4) + ctx.message.text.substring(5, 7) + ctx.message.text.substring(8, 10);
      ctx.reply("Enter return date(yyyy-mm-dd):");
      info[0] = 3.3;
      break;

    case 3.3:
      info[7] = ctx.message.text.substring(0, 4) + ctx.message.text.substring(5, 7) + ctx.message.text.substring(8, 10);
      ctx.reply("Enter number of adults:");
      info[0] = 3.4;
      break;

    case 3.4:
      info[8] = ctx.message.text.toLowerCase();
      ctx.reply("Enter number of childrens:");
      info[0] = 3.5;
      break;

    case 3.5:
      info[9] = ctx.message.text.toLowerCase();
      ctx.reply("Enter number of babies:");
      info[0] = 3.6;
      break;

    case 3.6:
      info[10] = ctx.message.text.toLowerCase();
      bot.telegram.sendMessage(ctx.chat.id, "Confirm?", Keyboard.confirm_keyboard);
      info[0] = 3.7;
      break;
  }

  return info;
}

module.exports = { nome, Navigazione: Navigazione, InputCercaVoli: InputCercaVoli }