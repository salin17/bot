const Telegraf = require('telegraf');
const bot = new Telegraf('882595709:AAGW8hXpOn95FYYI07fB56MSnp61XP_Ijhk');
const session = require('telegraf/session');
const puppeteer = require('puppeteer');

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
  var url = "https://en.wikipedia.org/wiki/IATA_airport_code";
  browser = await puppeteer.launch();
  var page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(url, { waitUntil: 'networkidle2' });
  let data = await page.evaluate(() => {
    let prova = document.querySelector('a[href$="M"]').click();
    return prova;
  })

  await page.waitForNavigation();

  let data2 = await page.evaluate(() => {
    let prova2 = (((document.querySelector('a[href$="/wiki/Milan"]').parentElement).parentElement).firstElementChild).firstChild.textContent;
    return prova2;
  })
  console.log(data2);
  console.log("Fine");
}

module.exports = { GetPage: GetPage, GetIATACode: GetIATACode }