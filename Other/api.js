var unirest = require("unirest");

function Luoghi(place) {
    unirest
        .get("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/IT/EUR/it-IT/")
        .headers({ "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com", "x-rapidapi-key": "a32373c704mshbe769e83869fa5ep1e5c46jsn4857f4c37cea" })
        .query({ "query": place })
        .then((response) => {
            console.log(response.body.Places[0].PlaceId);
        })

}

module.exports = {Luoghi:Luoghi}