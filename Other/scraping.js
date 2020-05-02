const Telegraf = require('telegraf');
const bot = new Telegraf('882595709:AAGW8hXpOn95FYYI07fB56MSnp61XP_Ijhk');
const session = require('telegraf/session');
const puppeteer = require('puppeteer');

bot.use(session());

async function GetIATACode(data) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://en.wikipedia.org/wiki/IATA_airport_code', { waitUntil: 'networkidle2' });
    const lettera = await page.$('a[href$=' + data.substring(0, 1) + ']');
    await lettera.click();
    await page.waitForNavigation();
    const cod = await page.$('a[href$="/wiki/' + data + '"]');

    const html = await page.evaluate(body => (((body.parentElement).parentElement).firstElementChild).innerHTML, cod);
    await cod.dispose();
    console.log(html.substring(0, 3));
    return html.substring(0, 3);
  } catch (err) {
    console.log("Erroe in GetIATACode");
  }
}

async function GetTickets(data) {
  try {
    var url = "https://www.edreams.it/travel/#results/type=R;dep=" + data[6] + ";from=" + data[11] + ";to=" + data[12] + ";ret=" + data[7] + ";adults=" + data[8] + ";children=" + data[9] + ";infants=" + data[10] + ";collectionmethod=false;airlinescodes=false;internalSearch=true";
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitFor(5 * 1000);
    const cod = await page.$$('div[class="odf-box odf-box-primary"]');
    const Prezzo = await page.evaluate(body => (body.firstElementChild).parentElement.innerText, cod[0]);

    console.log(Prezzo);
    console.log("//////////////////////");
    console.log(Prezzo.substring(3,11)); //Prezzo
    console.log(Prezzo.substring(3,11));


  } catch (err) {
    console.log("Errore in GetTickets")
  }

}

module.exports = {GetIATACode: GetIATACode, GetTickets: GetTickets }



//((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0])    //Div Andata
//((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[1]).children[1]).children[1]).children[1]).children[0])   //Div Ritorno
//((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).childElementCount //numero scelta Andate
//((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0].innerText // Singola scelta

//((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[1]).children[0]).children[1] // Date della prima scelta andata
//((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[1]).children[0]).children[2].innerText // Bagaglio prima scelta andata
//((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[2].children[0].innerText // Durata prima scelta andata

//(((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[1]).children[0]).children[1]).children[0].innerText // Orario Preciso primo Andata
//(((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[1]).children[0]).children[1]).children[1].innerText // Itinerario primo Andata