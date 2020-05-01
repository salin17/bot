const Telegraf = require('telegraf');
const bot = new Telegraf('882595709:AAGW8hXpOn95FYYI07fB56MSnp61XP_Ijhk');
const session = require('telegraf/session');
const puppeteer = require('puppeteer');
const Index = require('../Index');

var browser;

async function GetPage() {
  var url = "https://www.edreams.it/travel/#results/type=R;dep=2020-05-04;from=MIL;to=FRA;ret=2020-05-09;adults=3;collectionmethod=false;airlinescodes=false;internalSearch=true";
  browser = await puppeteer.launch();
  var page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitFor(7 * 1000);
  let data = await page.evaluate(() => {

    let prova = document.querySelector('span[class="odf-h1"]').innerText;;
    return prova;
  })
  //await page.screenshot({ path: 'mouse_click.png' })
  console.log(data);
  //return data;
}

async function GetIATACode() {
  (async () => {
    var place=Index.user_info[4];
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.goto('https://en.wikipedia.org/wiki/IATA_airport_code', { waitUntil: 'networkidle2' });
    const lettera = await page.$('a[href$=' + place.substring(0,1) + ']');
    await lettera.click();
    await page.waitForNavigation();
    const cod = await page.$('a[href$="/wiki/'+place+'"]');

    const html = await page.evaluate(body => (((body.parentElement).parentElement).firstElementChild).innerHTML, cod);
    await cod.dispose();
    console.log(html.substring(0,3));
    Index.user_info[11] = html.substring(0,3);
    
})();
}

module.exports = { GetPage: GetPage, GetIATACode: GetIATACode }