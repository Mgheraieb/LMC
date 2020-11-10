const express = require('express');
const bodyparser = require('body-parser')
const mongoose = require('mongoose')

const app = express()


const username = 'moha'
const password = 'Aqzsed94'
const dbname = 'LBCDB'
const uri = `mongodb://${username}:${password}@cluster0-shard-00-00.oqgnz.mongodb.net:27017,cluster0-shard-00-01.oqgnz.mongodb.net:27017,cluster0-shard-00-02.oqgnz.mongodb.net:27017/${dbname}?ssl=true&replicaSet=atlas-10295i-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(uri,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(bodyparser.json())

app.get('/api/', (req, res, next) => {
    res.status(200).json({ok :'ok'})
})

module.exports = app;
