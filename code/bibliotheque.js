var express = require('express');
var cons = require('consolidate');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var app = express();

app.engine('html', cons.pug);
app.set('view engine', 'html');
app.set('views',  __dirname +  '/views')
app.use(bodyParser())

// Récupération du client mongodb
var mongoClient = require('mongodb').MongoClient;

// Paramètres de connexion
var url = 'mongodb://localhost:27017/bibliotheque';

//Affiche les livres
app.get('/bibliotheque', function(req, res) {
	app.db.collection('bibliotheque.livres').find({}).toArray(function(err, livres) {
		res.render("bibliotheque", {
			'liste_livres' : livres
		});
	});
});

// Connexion au serveur avec la méthode connect
mongoClient.connect(url, function (err, db) {
	app.db = db;
	app.listen(8000);
	console.log("Express server started on 8000");
});