const Telegraf = require('telegraf');
const bot = new Telegraf('882595709:AAGW8hXpOn95FYYI07fB56MSnp61XP_Ijhk');
const session = require('telegraf/session');
const puppeteer = require('puppeteer');

var browser;
var url = "https://www.edreams.it/travel/#results/type=R;dep=2020-05-04;from=MIL;to=FRA;ret=2020-05-09;adults=3;collectionmethod=false;airlinescodes=false;internalSearch=true";


async function GetPage() {
  browser = await puppeteer.launch();
  var page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitFor(5 * 1000);
  let data = await page.evaluate(() => {

    let prova = document.querySelector('span[class="odf-h1"]').innerText;
    return prova;
  })

  console.log(data);
  return data;
}

module.exports = { GetPage: GetPage }