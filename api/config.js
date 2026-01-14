module.exports =  {
    ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET || "EMMA123",
    JWT: {
        SECRET: process.env.ACCESS_TOKEN_SECRET || "EMMA123",
        EXPIRATION: "24h"
    },
    BDD : {
    "host" :"dpg-d5jmii94tr6s73aug6h0-a.oregon-postgres.render.com",
    "port" : "5432",
    "user" : "pollution_user",
    "password" : "R5jzYyWLnYOooAz7wD9EmKuuGy0Zsoic",
    "bdname" :"pollution_74re" 
    }
}