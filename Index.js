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


bot.use(session());

bot.command(["Start", "start"], (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, "Welcome to the bot!!! @" + ctx.from.username, log_keyboard);
})

bot.hears(emoji.get('airplane_departure') + " Log In " + emoji.get('airplane_departure'), (ctx) => {
    ctx.reply("Enter username:");
    user_info[0] = 1.0;
})

bot.hears(emoji.get('small_airplane') + " Sign In " + emoji.get('small_airplane'), (ctx) => {
    ctx.reply("Enter username:");
    user_info[0] = 2.0;
})

bot.hears(emoji.get('satellite') + " Continue without logging in " + emoji.get('satellite'), (ctx) => {
    user_info[0] = 3.0;
    bot.telegram.sendMessage(ctx.chat.id, "What do you want to do?", menu_keyboard);
})

bot.hears(emoji.get('mag_right') + " Search for flights " + emoji.get('mag_right'), async (ctx) => {
    if (user_info[0] >= 3)
        ctx.reply("Enter place of departure:");
})

bot.hears('S', async (ctx) => {
    user_info[11] = "MIL";
    user_info[12] = "BER";
    user_info[6] = "2020-05-04";
    user_info[7] = "2020-05-20";
    user_info[8] = "1";
    user_info[9] = "0";
    user_info[10] = "0";

    var tichets = await Scraping.GetTickets(user_info);
    if (!tichets)
        bot.telegram.sendMessage(ctx.chat.id, "there are no flights according to the search criteria", menu_keyboard);
    else {
        SendTickets(tichets, ctx);
    }

})

bot.hears("Yes " + emoji.get('heavy_check_mark'), async (ctx) => {

    ctx.reply("Searching for tichets...");
    user_info[11] = await Scraping.GetIATACode(user_info[4]);
    user_info[12] = await Scraping.GetIATACode(user_info[5]);

    if (user_info[11] == null && user_info[12] == null) {
        ctx.reply("Departure & destination place are invalid");
        bot.telegram.sendMessage(ctx.chat.id, "What do you want to do?", menu_keyboard);
        user_info[0] = 3.0;
        return;
    } else if (user_info[11] == null) {
        ctx.reply("Departure place invalid");
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
    if (!tichets){
        bot.telegram.sendMessage(ctx.chat.id, "there are no flights according to the search criteria", menu_keyboard);
        ctx.reply("What do you want to do?");
        user_info[0]=3.0;
    }
    else {
        SendTickets(tichets, ctx);
    }

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
        cont = 0;
        str += "Ticket N:" + (i + 1) + "\r\n" + "Price :" + arr[i][cont] + "\r\n";
        cont = 2;
        for (let x = 0; x < parseInt(arr[i][1]); x++) {
            str += "Going options" + (x + 1) + ": //////////////\r\n";
            str += "Airline: " + GetAirline(arr[i][++cont])+"\r\n";
            str+=arr[i][++cont]+"\r\n";
            str+="Flight hours: "+arr[i][++cont]+"\r\n";
            str+="From: "+arr[i][++cont]+"\r\n";
            str+="To: "+arr[i][++cont]+"\r\n";
            if(!isNaN(arr[i][++cont].substring(0,1)))
            {
                str+="Stopovers: "+arr[i][cont].substring(0,1)+"\r\n";
            }
            else
                str+="No Stopovers\r\n";
            
        }

        for (let x = 0; x < parseInt(arr[i][2]); x++) {
            str += "Return options " + (x + 1) + "//////////////\r\n";
            str += "Airline: " + GetAirline(arr[i][++cont])+"\r\n";
            str+=arr[i][++cont]+"\r\n";
            str+="Flight hours: "+arr[i][++cont]+"\r\n";
            str+="From: "+arr[i][++cont]+"\r\n";
            str+="To: "+arr[i][++cont]+"\r\n";
            if(!isNaN(arr[i][++cont].substring(0,1)))
            {
                str+="Stopovers: "+arr[i][cont].substring(0,1)+"\r\n";
            }
            else
                str+="No Stopovers\r\n";
            
        }
        await ctx.reply(str);
    }


    function GetAirline(air) {
        if (air[0] == "S")
            return air.substring(9, air.length);
        else
            return "Various airlines";
    }

   

}

