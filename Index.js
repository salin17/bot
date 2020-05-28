const Telegraf = require('telegraf');
const bot = new Telegraf('882595709:AAGW8hXpOn95FYYI07fB56MSnp61XP_Ijhk');
const session = require('telegraf/session');
const emoji = require('node-emoji');
const puppeteer = require('puppeteer');

var browser;

const Utils = require('./Other/utils');
const Keyboard = require('./Other/keyboard');
const Scraping = require('./Other/scraping');

var user_info = [0.0, null, null, null, null];
const log_keyboard = Keyboard.log_keyboard;
const menu_keyboard = Keyboard.menu_keyboard;
const user_keyboard = Keyboard.user_keyboard;
const notuser_keyboard = Keyboard.notuser_keyboard;

bot.use(session());

bot.command(["Start", "start"], (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, "Welcome to the bot!!! @" + ctx.from.username, log_keyboard);
    user_info[0] = 0;
})

bot.hears(emoji.get('airplane_departure') + " Sign In " + emoji.get('airplane_departure'), (ctx) => {
    ctx.reply("Enter username:");
    user_info[0] = 1.0;
})

bot.hears(emoji.get('small_airplane') + " Create an account " + emoji.get('small_airplane'), (ctx) => {
    ctx.reply("Enter username:");
    user_info[0] = 2.0;
})

bot.hears(emoji.get('satellite') + " Continue without sign in " + emoji.get('satellite'), (ctx) => {
    user_info[0] = 3.0;
    user_info[1] = null;
    user_info[2] = null;
    bot.telegram.sendMessage(ctx.chat.id, "What do you want to do?", menu_keyboard);
})

bot.hears(emoji.get('mag_right') + " Search for flights " + emoji.get('mag_right'), async (ctx) => {
    if (user_info[0] >= 3)
        ctx.reply("Enter place of departure:");
})

bot.hears(emoji.get('gear') + " User " + emoji.get('gear'), async (ctx) => {
    if (user_info[1]) {
        var str = "username: " + user_info[1] + "\r\npassword: ";
        for (let i = 0; i < user_info[2].length; i++)
            str += "*";
        await ctx.reply("User information:");
        bot.telegram.sendMessage(ctx.chat.id, str, user_keyboard);
    } else {
        bot.telegram.sendMessage(ctx.chat.id, "You are not logged in", notuser_keyboard)
    }
})

bot.hears(emoji.get('leftwards_arrow_with_hook') + " Go back " + emoji.get('leftwards_arrow_with_hook'), async (ctx) => {
    if (user_info[0] >= 3)
        bot.telegram.sendMessage(ctx.chat.id, "What do you want to do?", menu_keyboard);
    else
        bot.telegram.sendMessage(ctx.chat.id, "Command not valid", menu_keyboard);
})

bot.hears(emoji.get('small_orange_diamond') + " Log out " + emoji.get('small_orange_diamond'), async (ctx) => {
    if (user_info[0] >= 3)
        bot.telegram.sendMessage(ctx.chat.id, "Welcome to the bot!!! @" + ctx.from.username, log_keyboard), user_info[0] = 0;
    else
        bot.telegram.sendMessage(ctx.chat.id, "You are not logged in", log_keyboard), user_info[0] = 0;
})

bot.hears("Yes " + emoji.get('heavy_check_mark'), async (ctx) => {

    ctx.reply("Searching for tichets...");
    user_info[11] = await Scraping.GetIATACode(user_info[4]);
    user_info[12] = await Scraping.GetIATACode(user_info[5]);

    if (user_info[11] == null && user_info[12] == null) {
        await ctx.reply("Departure & destination place are invalid");
        bot.telegram.sendMessage(ctx.chat.id, "What do you want to do?", menu_keyboard);
        user_info[0] = 3.0;
        return;
    } else if (user_info[11] == null) {
        await ctx.reply("Departure place invalid");
        bot.telegram.sendMessage(ctx.chat.id, "What do you want to do?", menu_keyboard);
        user_info[0] = 3.0;
        return;
    } else if (user_info[12] == null) {
        ctx.reply("Destination place invalid");
        bot.telegram.sendMessage(ctx.chat.id, "What do you want to do?", menu_keyboard);
        user_info[0] = 3.0;
        return;
    }

    var tichets = await Scraping.GetTickets(user_info);
    if (!tichets) {
        bot.telegram.sendMessage(ctx.chat.id, "There are no flights according to the search criteria", menu_keyboard);
        ctx.reply("What do you want to do?");
        user_info[0] = 3.0;
    }
    else {
        await SendTickets(tichets, ctx);
        bot.telegram.sendMessage(ctx.chat.id, "What do you want to do?", menu_keyboard);
    }

})

bot.hears("No " + emoji.get('x'), async (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, "What do you want to do?", menu_keyboard);
    user_info[0] = 3.0;
})



bot.on("text", async (ctx) => {
    if (user_info[0] >= 3) {
        user_info = await Utils.InputCercaVoli(ctx, user_info);
        return;
    }
    user_info = await Utils.Navigazione(ctx, user_info);
})

bot.launch();

async function SendTickets(arr, ctx) {
    str = "";
    var cont = 0;
    for (let i = 0; i < arr.length; i++) {
        str = "";
        // for (let z = 0; z < 17; z++) { str += emoji.get('ticket') } str += "\r\n";
        cont = 0;
        str += emoji.get('small_blue_diamond') + " Ticket N: " + (i + 1) + " " + emoji.get('small_blue_diamond') + "\r\n" + emoji.get('money_with_wings') + " Price : " + arr[i][cont] + " " + emoji.get('money_with_wings') + "\r\n\r\n";
        cont = 2;
        for (let x = 0; x < parseInt(arr[i][1]); x++) {
            str += emoji.get('airplane_departure') + " Going options: " + (x + 1);
            for (let z = 0; z < 9; z++) { str += emoji.get('airplane_departure') } str += "\r\n";
            str += emoji.get('european_post_office') + " Airline: " + GetAirline(arr[i][++cont]) + " " + emoji.get('european_post_office') + "\r\n";
            str += emoji.get('clock12') + " " + arr[i][++cont] + " " + emoji.get('clock12') + "\r\n";
            str += emoji.get('cloud') + " Flight hours: " + arr[i][++cont] + " " + emoji.get('cloud') + "\r\n";
            str += emoji.get('airplane_departure') + " From: " + arr[i][++cont] + " " + emoji.get('airplane_departure') + "\r\n";
            str += emoji.get('airplane_arriving') + " To: " + arr[i][++cont] + " " + emoji.get('airplane_arriving') + "\r\n";
            if (!isNaN(arr[i][++cont].substring(0, 1)))
                str += emoji.get('red_circle') + " Stopovers: " + arr[i][cont].substring(0, 1) + emoji.get('red_circle') + "\r\n\r\n";
            else
                str += emoji.get('red_circle') + " No Stopovers " + emoji.get('red_circle') + "\r\n\r\n";

        }

        for (let x = 0; x < parseInt(arr[i][2]); x++) {
            str += emoji.get('airplane_arriving') + " Return options: " + (x + 1);
            for (let z = 0; z < 9; z++) { str += emoji.get('airplane_arriving') } str += "\r\n";
            str += emoji.get('european_post_office') + " Airline: " + GetAirline(arr[i][++cont]) + " " + emoji.get('european_post_office') + "\r\n";
            str += emoji.get('clock12') + " " + arr[i][++cont] + " " + emoji.get('clock12') + "\r\n";
            str += emoji.get('cloud') + "Flight hours: " + arr[i][++cont] + " " + emoji.get('cloud') + "\r\n";
            str += emoji.get('airplane_departure') + " From: " + arr[i][++cont] + " " + emoji.get('airplane_departure') + "\r\n";
            str += emoji.get('airplane_arriving') + " To: " + arr[i][++cont] + " " + emoji.get('airplane_arriving') + "\r\n";
            if (!isNaN(arr[i][++cont].substring(0, 1)))
                str += emoji.get('red_circle') + " Stopovers: " + arr[i][cont].substring(0, 1) + emoji.get('red_circle') + "\r\n\r\n";
            else
                str += emoji.get('red_circle') + " No Stopovers " + emoji.get('red_circle') + "\r\n\r\n";
        }
        //for (let z = 0; z < 17; z++) { str += emoji.get('admission_tickets') }
        await ctx.reply(str);
    }


    function GetAirline(air) {
        if (air[0] == "S")
            return air.substring(9, air.length);
        else
            return "Various airlines";
    }



}

