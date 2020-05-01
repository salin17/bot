const Telegraf = require('telegraf');
const bot = new Telegraf('882595709:AAGW8hXpOn95FYYI07fB56MSnp61XP_Ijhk');
const session = require('telegraf/session');
const emoji = require('node-emoji');

const Utils = require('./Other/utils');
//const Api = require('./Other/api');
const Keyboard = require('./Other/keyboard');
const Scraping = require('./Other/scraping');

var user_info = [0.0, null, null];
const log_keyboard = Keyboard.log_keyboard;
const menu_keyboard = Keyboard.menu_keyboard;


bot.use(session());

bot.command(["Start", "start"], (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, "Benvenuto nel bot!!! @" + ctx.from.username, log_keyboard);
})

bot.hears(emoji.get('airplane_departure') + "Accedi" + emoji.get('airplane_departure'), (ctx) => {
    ctx.reply("Inserire nome utente:");
    user_info[0] = 1.0;
})

bot.hears(emoji.get('small_airplane') + "Registrati" + emoji.get('small_airplane'), (ctx) => {
    ctx.reply("Inserire nome utente:");
    user_info[0] = 2.0;
})

bot.hears(emoji.get('satellite') + "Continua senza accedere" + emoji.get('satellite'), (ctx) => {
    user_info[0] = 3.0;
    bot.telegram.sendMessage(ctx.chat.id, "Cosa si desidera fare?", menu_keyboard);
})

bot.hears(emoji.get('mag_right') + "Cerca Voli" + emoji.get('mag_right'), async (ctx) => {
    if (user_info[0] >= 3) 
        ctx.reply("Inserire luogo di partenza(inglese):");
})

bot.hears("Cerca", async (ctx) => {
    if (user_info[0] == 3.7) 
    {}
    await Scraping.GetIATACode();
    //await Scraping.GetPage();
        
})

bot.on("text", async (ctx) => {
    if (user_info[0] >= 3) {
        user_info = await Utils.InputCercaVoli(ctx, user_info);
        return;
    }

    user_info = await Utils.Navigazione(ctx, user_info);
})

bot.launch();