const Telegraf = require('telegraf');
const bot = new Telegraf('882595709:AAGW8hXpOn95FYYI07fB56MSnp61XP_Ijhk');
const session = require('telegraf/session');
const puppeteer = require('puppeteer');

var browser;

async function GetPage() {
  var url = "https://www.google.it";
  browser = await puppeteer.launch();
  var page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitFor(7 * 1000);
  let data = await page.evaluate(() => {

    let prova = document.querySelector('div[id="hptl"]').innerText;
    return prova;
  })

  console.log(data);
  //return data;
}
/*
async function GetIATACode() {
  var url = "https://en.wikipedia.org/wiki/IATA_airport_code";
  //document.querySelector('a[href$="A"]')
  browser = await puppeteer.launch();
  var page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitFor(2 * 1000);
  let data = await page.evaluate(() => {

    let prova = document.querySelector('a[href$="A"]');
    return prova;
  })
  console.log(data);
  //await page.click(data);
  await page.waitForNavigation();
  console.log("OKKK");
  await page.close();
}*/

module.exports = { GetPage: GetPage/*,GetIATACode:GetIATACode */}