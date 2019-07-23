import axios from "axios" // Axios library voor de http client
import {verify, signToken} from "./signatures"

export default axios.create({ // Genereer een speciale instantie die in de hele applicatie gebrui8kt wordt
  //baseURL: "http://localhost:5000/", // Baseurl die we op dit moment niet gebruiken
  baseURL: "http://back3ndb0is.herokuapp.com/", // Baseurl die we op dit moment niet gebruiken
  headers: { 
    "Content-Type": "application/json"
  },
  transformResponse: [function (data, headers) { // De "interceptor" die ons helpt standaard een response te manipuleren
    if (headers.Token || headers.token) localStorage.setItem("_token", headers.Token || headers.token)

    try {
      let actData

      if (data.trim()) {
        actData = JSON.parse(data)
      } else {
        actData = data
      }
      
      if (headers.signature) {
        // Wanneer een gebruiker is ingelogd en er is data.
        if (verify(data, headers.signature)) {
          return actData
        } else {
          window.location.reload()
          throw new axios.Cancel("Something went wrong while verifying the server data.")
        }
      } else if (!headers.signature && !actData) {
        // Wanneer een gebruiker niet is ingelogd en er geen data is.
        return actData
      } else {
        // Gebruiker is niet ingelogd maar er is wel data.
        throw new axios.Cancel("Something went wrong while verifying the server data.")
      }
    }
    catch (e) {
      throw new axios.Cancel("Something went wrong while verifying the server data.")
    }
  }],
  transformRequest: [function(data, headers) { // De "interceptor" voor de request
    if(localStorage.getItem("_token")) { // Indien er een token staat in localstorage
      headers.Token = localStorage.getItem("_token") // Verander de header van de request want wij hebben dit token nodig
      if(localStorage.getItem("_certificate")) { // Kijk of er een certificaat beschikbaar is
        const signature = signToken(JSON.stringify(data || {token: localStorage.getItem("_token")}), localStorage.getItem("_certificate")) // Sign de token met het certificaat
        headers.Name = localStorage.getItem("_username")  // De gebruikersnaam
        headers.Signature = signature  // De signature
        return JSON.stringify(data) // Verzend de data als json
      } else {
        return JSON.stringify(data) // Verzend de data als json
      }
    } else {
      return JSON.stringify(data) // Verzend de data als json
    }
  }]
})