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
    return html.substring(0, 3);
  } catch (err) {
    console.log("Errore in GetIATACode :" + err);
  }
}

async function GetTickets(data) {
  try {
    var url = "https://www.edreams.it/travel/#results/type=R;dep=" + data[6] + ";from=" + data[11] + ";to=" + data[12] + ";ret=" + data[7] + ";adults=" + data[8] + ";children=" + data[9] + ";infants=" + data[10] + ";collectionmethod=false;airlinescodes=false;internalSearch=true";
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitFor(10 * 1000);
    const cod = await page.$$('div[class="odf-box odf-box-primary"]');
    if (cod.length == 0) {
      return false;
    }

    let tickets = [];

    for (let i = 0; i < cod.length; i++) {
      var temp = [];
      temp.push(await page.evaluate(body => ((((((body.children[0]).children[0]).children[0]).children[0]).children[0]).children[1]).innerText, cod[i]));
      var num_andate = await page.evaluate(body => ((((((((body.children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).childElementCount, cod[i]);
      var num_ritorni = await page.evaluate(body => ((((((((body.children[1]).children[0]).children[0]).children[1]).children[1]).children[1]).children[1]).children[0]).childElementCount, cod[i]);
      temp.push(num_andate);
      temp.push(num_ritorni);

      for (let x = 0; x < num_andate; x++) {
        temp.push(await page.evaluate((body, x) => ((((((((((((body.children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[1]).children[0]).children[0].innerText, cod[i], x));
        temp.push(await page.evaluate((body, x) => (((((((((((((body.children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[1]).children[0]).children[1]).children[0].innerText, cod[i], x)); //Orario
        temp.push(await page.evaluate((body, x) => ((((((((((((((((body.children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[2].children[0].children[0]).children[0]).children[0]).children[0]).children[0]).children[0]).children[0].innerText, cod[i], x)); //Durata
        temp.push(await page.evaluate((body, x) => (((((((((((((((body.children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[1]).children[0]).children[1]).children[1]).children[2]).children[0].innerText, cod[i], x)); //Partenza
        temp.push(await page.evaluate((body, x) => (((((((((((((((body.children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[1]).children[0]).children[1]).children[1]).children[2]).children[1].innerText, cod[i], x)); //Arrivo

        var NScali = await page.evaluate((body, x) => ((((((((((((((((body.children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[2].children[0].children[0]).children[0]).children[0]).children[0]).children[0]).children[1]).children[0].innerText, cod[i], x); //Numero scali
        temp.push(NScali);
        //if(!isNaN(NScali.substring(0,1)))
        //temp.push(await page.evaluate((body, x) => ((((((((((((((((body.children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[2].children[0].children[0]).children[0]).children[0]).children[0]).children[0]).children[1]).children[1].innerText, cod[i], x)); //Luogo e durata scali
      }

      for (let x = 0; x < num_ritorni; x++) {
        temp.push(await page.evaluate((body, x) => ((((((((((((body.children[1]).children[0]).children[0]).children[1]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[1]).children[0]).children[0].innerText, cod[i], x)); //Societa
        temp.push(await page.evaluate((body, x) => (((((((((((((body.children[1]).children[0]).children[0]).children[1]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[1]).children[0]).children[1]).children[0].innerText, cod[i], x)); //Orario
        temp.push(await page.evaluate((body, x) => ((((((((((((((((body.children[1]).children[0]).children[0]).children[1]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[2].children[0].children[0]).children[0]).children[0]).children[0]).children[0]).children[0]).children[0].innerText, cod[i], x)); //Durata
        temp.push(await page.evaluate((body, x) => (((((((((((((((body.children[1]).children[0]).children[0]).children[1]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[1]).children[0]).children[1]).children[1]).children[2]).children[0].innerText, cod[i], x)); //Partenza
        temp.push(await page.evaluate((body, x) => (((((((((((((((body.children[1]).children[0]).children[0]).children[1]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[1]).children[0]).children[1]).children[1]).children[2]).children[1].innerText, cod[i], x)); //Arrivo
        var NScali = await page.evaluate((body, x) => ((((((((((((((((body.children[1]).children[0]).children[0]).children[1]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[2].children[0].children[0]).children[0]).children[0]).children[0]).children[0]).children[1]).children[0].innerText, cod[i], x); //Numero scali
        temp.push(NScali);
        //if(!isNaN(NScali.substring(0,1)))
        //temp.push(await page.evaluate((body, x) => ((((((((((((((((body.children[1]).children[0]).children[0]).children[1]).children[1]).children[1]).children[1]).children[0]).children[x]).children[0]).children[2].children[0].children[0]).children[0]).children[0]).children[0]).children[0]).children[1]).children[1].innerText, cod[i], x)); //Luogo e durata scali
      }
      tickets.push(temp);
    }
    return tickets;

  } catch (err) {
    console.log("Errore in GetTickets")
    console.log(err)
  }

}

module.exports = { GetIATACode: GetIATACode, GetTickets: GetTickets }



//((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[0]).children[0]).children[0]).children[0]).children[0]).children[1]).innerText //Prezzo
//((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0])    //Div Andata
//((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[1]).children[1]).children[1]).children[1]).children[0])   //Div Ritorno
//((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).childElementCount //numero scelta Andate
//((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0].innerText // Singola scelta NOME SOCIETA
//((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[1]).children[0]).children[0].innerText // Nome societa VERA

//((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[1]).children[0]).children[1] // Date della prima scelta andata
//((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[1]).children[0]).children[1]).children[0]).children[1] // Date della seconda scelta andata
//((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[1]).children[0]).children[2].innerText // Bagaglio prima scelta andata
//((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[2].children[0].innerText // Durata prima scelta andata

//(((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[1]).children[0]).children[1]).children[0].innerText // Orario Preciso primo Andata
//(((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[1]).children[0]).children[1]).children[1].innerText // Itinerario primo Andata
//(((((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[1]).children[0]).children[1]).children[1]).children[2]).children[0].innerText // Partenza
//((((((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[2].children[0].children[0]).children[0]).children[0]).children[0]).children[0]).children[0]).children[0].innerText //Durata volo
//((((((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[2].children[0].children[0]).children[0]).children[0]).children[0]).children[0]).children[1]).children[0].innerText //Numero scali
//((((((((((((((((document.querySelector('div[class="odf-box odf-box-primary"]').children[1]).children[0]).children[0]).children[0]).children[1]).children[1]).children[1]).children[0]).children[0]).children[0]).children[2].children[0].children[0]).children[0]).children[0]).children[0]).children[0]).children[1]).children[1].innerText //Scali e durata