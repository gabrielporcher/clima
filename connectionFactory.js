const fetch = require("node-fetch")
const link = 'https://api.hgbrasil.com/weather?woeid=455908&array_limit=0&fields=only_results,temp,city_name,date,humidity,wind_speedy,sunset,sunrise,description,condition_slug&key=12bd2f31'
const { Pool, Client } = require('pg')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'mais_uma',
    password: '1234',
    port: 5432,
})


fetch(link).then(function (response) {
    return response.json()
}).then(function (myJson) {

    const temp = myJson.temp
    const date = myJson.date
    const description = myJson.description
    const humidity = myJson.humidity
    const wind = myJson.wind_speedy
    const sunrise = myJson.sunrise
    const sunset = myJson.sunset
    const condition = myJson.condition_slug
    const city = myJson.city_name

    console.log(`cidade: ${city}, Data: ${date}, Temperatura: ${temp}, Descricao: ${description}, Umidade: ${humidity}, 
                Vento: ${wind}, Nascer do sol: ${sunrise}, Por do sol: ${sunset}, Condicao: ${condition}` )

    
    client.connect()
    client.query(`INSERT INTO dados (cidade, data, temperatura, descricao, umidade, vento, sunrise, sunset, condicao) VALUES  ('${city}', '${date}', ${temp}, '${description}', ${humidity}, '${wind}', '${sunrise}', '${sunset}', '${condition}' ) `, (err, res) => {
        if (err){
            console.error(err)
        } else {
            console.log("Query success")
            console.log(res)
        }
        client.end()
    })

    
})

/*
    DATABASE:
    CREATE TABLE dados (
	id SERIAL,
	cidade varchar(50),
	data varchar(50),
	temperatura int,
	descricao varchar(80),
	umidade int,
	vento varchar(50),
	sunrise varchar(50),
	sunset varchar(50),
	condicao varchar(50)
        )
        */