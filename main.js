async function fetchJson(url) {
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

const ratp = (function () {
    const API_URL = 'https://api-ratp.pierre-grimaud.fr/v4/';
    let currentCodeMetro = ""
    let currentCodeStation = ""
    let currentCodeDestination = ""

    async function displaySelectMetro() {
        let jsonMetros = await fetchJson(API_URL + "lines/metros");
        const arrayMetros = jsonMetros.result.metros;
        if (!arrayMetros) {
            console.error("Erreur de lecture des métros")
            return
        }

        // build options
        let html = '';
        arrayMetros.forEach(metro => {
            html += "<option value='" + metro.code + "'>" + metro.name + "</option>"
        });

        // update metros select in html
        let container = document.getElementById('metros');
        container.innerHTML = html;

        // select first by default
        if (arrayMetros.length > 0)
            this.changeMetro(arrayMetros[0].code)
    }

    async function changeMetro(codeMetro) {
        this.currentCodeMetro = codeMetro
        this.displaySelectStation(codeMetro)
        this.displayTrafficMetro(codeMetro)
    }

    async function displayTrafficMetro(codeMetro) {
        let jsonTraffic = await fetchJson(API_URL + "traffic/metros/" + codeMetro);
        const result = jsonTraffic.result;
        let html = '';

        if (result === undefined || result.code) {
            console.error("Erreur de lecture du traffic")
        } else {
            html += "<h2>" + result.title + "</h2>"
            html += "<p>" + result.message + "</p>"
        }

        // update stations select in html
        let container = document.getElementById('traffic');
        container.innerHTML = html;
    }

    async function displaySelectStation(codeMetro) {
        let jsonStations = await fetchJson(API_URL + "stations/metros/" + codeMetro);
        const arrayStations = jsonStations.result.stations;
        if (!arrayStations) {
            console.error("Erreur de lecture des stations")
            return
        }

        // build options
        let html = '';
        arrayStations.forEach(station => {
            let htmlSegment = "<option value='" + station.slug + "'>" + station.name + "</option>"

            html += htmlSegment;
        });

        // update stations select in html
        let container = document.getElementById('stations');
        container.innerHTML = html;

        // select first by default
        if (jsonStations.result.stations.length > 0)
            this.changeStation(jsonStations.result.stations[0].slug)
    }

    async function changeStation(codeStation) {
        this.currentCodeStation = codeStation
        this.displaySelectDestination(this.currentCodeMetro, codeStation)
    }

    async function displaySelectDestination(codeMetro, codeStation) {
        let jsonDestinations = await fetchJson(API_URL + "destinations/metros/" + codeMetro);
        const arrayDestinations = jsonDestinations.result.destinations;
        if (!arrayDestinations) {
            console.error("Erreur de lecture des destinations")
            return
        }

        // build options
        let html = '<option value="A+R">Toutes directions</options>';
        arrayDestinations.forEach(destination => {
            let htmlSegment = "<option value='" + destination.way + "'>" + destination.name + "</option>"

            html += htmlSegment;
        });

        // update stations select in html
        let container = document.getElementById('destinations');
        container.innerHTML = html;

        // select first by default
        this.changeDestination("A+R")
    }

    async function changeDestination(codeDestination) {
        this.currentCodeDestination = codeDestination
        this.displaySchedules(this.currentCodeMetro, this.currentCodeStation, codeDestination)
    }

    async function displaySchedules(codeMetro, codeStation, codeDestination) {
        let jsonSchedules = await fetchJson(API_URL + "schedules/metros/" + codeMetro + "/" + codeStation + '/' + codeDestination);
        const arraySchedules = jsonSchedules.result.schedules;

        let html = '';

        if (!arraySchedules) {
            console.error("Erreur de lecture des horaires")
        } else {
            // destinations sort
            let destinationMessages = {}
            arraySchedules.forEach(schedule => {
                if (destinationMessages[schedule.destination]) {
                    destinationMessages[schedule.destination].push(schedule.message)
                } else {
                    destinationMessages[schedule.destination] = [schedule.message]
                }
            })
            // build options
            let dateJson = new Date(jsonSchedules._metadata.date)
            // Display API time
            document.querySelector('.time').innerHTML = 'État à ' + dateJson.toLocaleTimeString()


            Object.keys(destinationMessages).forEach(destination => {
                html += "<h2>" + destination.replace("Destination unavailable", "Destination indisponible") + "</h2>"
                html += '<ul>'
                let sum = 0
                let previousDelta = 0
                destinationMessages[destination].forEach(message => {
                    let delta = parseInt(message)
                    if (isNaN(delta)) {
                        delta = 0
                    }
                    sum += delta - previousDelta
                    previousDelta = delta
                    let dateArrival = new Date(dateJson)
                    dateArrival.setMinutes(dateArrival.getMinutes() + delta)
                    let displayMessage = message.replace(" mn", " min")
                        .replace("Train a quai", "À quai")
                        .replace("Train a l'approche", "À l'approche")
                        .replace("Train retarde", "En retard")
                        .replace("Schedules unavailable", "Horaire indisponible")
                    let htmlSegment = "<li>" + dateArrival.getHours().toString().padStart(2, '0') + ":" + dateArrival.getMinutes().toString().padStart(2, '0') + "<span class='badge'>&nbsp;" + displayMessage + "&nbsp;</span>" + "</li>"

                    html += htmlSegment;
                });
                html += '</ul>'

                html += "<p>Temps moyen d'attente&nbsp;: " + (sum / destinationMessages[destination].length).toFixed(2) + " min</p>"
            })
        }

        // display schedules or nothing if any error
        let container = document.getElementById('schedules');
        container.innerHTML = html;
    }

    async function refresh() {
        if (this.currentCodeMetro !== "" && this.currentCodeStation !== "" && this.currentCodeDestination !== "") {
            this.displaySchedules(this.currentCodeMetro, this.currentCodeStation, this.currentCodeDestination)
        }
    }


    return {
        displaySelectMetro: displaySelectMetro,
        changeMetro: changeMetro,
        displayTrafficMetro: displayTrafficMetro,
        changeDestination: changeDestination,
        displaySelectStation: displaySelectStation,
        changeStation: changeStation,
        displaySelectDestination: displaySelectDestination,
        displaySchedules: displaySchedules,
        refresh: refresh
    }
})()

// refresh every 30s
setInterval(async () => {
    await ratp.refresh()
}, 30000)