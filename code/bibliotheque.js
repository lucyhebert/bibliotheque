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

//Ajoute un livre
app.post('/bibliotheque/new', function(req, res) {
	var isbn = req.body.isbn;
	var titre = req.body.titre;
	var auteurs = req.body.auteurs.split(",");
	var date_achat = req.body.date_achat;
	var catégories = req.body.catégories.split(",");

	app.db.collection('bibliotheque.livres').insert({'isbn' : isbn, 'titre' : titre
	, 'auteurs' : auteurs, 'date_achat' : date_achat, 'catégories' : catégories});

	res.redirect('/bibliotheque');
});

//Supprime un livre
app.post('/bibliotheque/delete/:id', function(req, res) {
	var id = new mongodb.ObjectId(req.params.id);

	app.db.collection('bibliotheque.livres').remove({_id : id});

	res.redirect('/bibliotheque');
});

// Connexion au serveur avec la méthode connect
mongoClient.connect(url, function (err, db) {
	app.db = db;
	app.listen(8000);
	console.log("Express server started on 8000");
});