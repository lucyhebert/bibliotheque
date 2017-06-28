var express = require('express');
var cons = require('consolidate');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var app = express();

app.engine('html', cons.pug);
app.set('view engine', 'html');
app.set('views',  __dirname +  '/views')
app.use(bodyParser())
app.locals.moment = require('moment')
// Récupération du client mongodb
var mongoClient = require('mongodb').MongoClient;

// Paramètres de connexion
var url = 'mongodb://localhost:27017/bibliotheque';

//Affiche les livres
app.get('/bibliotheque', function(req, res) {
	app.db.collection('bibliotheque.livres').find({}).toArray(function(err, livres) {
		res.render("bibliotheque", {'liste_livres' : livres});
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
	, 'auteurs' : auteurs, 'date_achat' : new Date(date_achat), 'catégories' : catégories});

	res.redirect('/bibliotheque');
});

//Supprime un livre
app.post('/bibliotheque/delete/:id', function(req, res) {
	var id = new mongodb.ObjectId(req.params.id);

	app.db.collection('bibliotheque.livres').remove({_id : id});

	res.redirect('/bibliotheque');
});

//Affiche un livre
// TODO : à améliorer
app.get('/bibliotheque/:id', function(req, res) {
	var id = new mongodb.ObjectId(req.params.id);

	app.db.collection('bibliotheque.livres').find({_id : id}).toArray(function(err, livres) {
		res.render("livre", {'liste_livres' : livres});
	});
});

//Renvoie vers le formulaire de prêt d'un livre
app.post('/bibliotheque/:id/edit', function(req, res) {
	var id = new mongodb.ObjectId(req.params.id);

	app.db.collection('bibliotheque.livres').find({_id : id}).toArray(function(err, livres) {
    		res.render("edit", {'liste_livres' : livres});
    	});
});

//Génère un prêt
app.post('/bibliotheque/:id', function(req, res) {
	var livre = new mongodb.ObjectId(req.params.id);
	var emprunteur = req.body.emprunteur;
	var date_pret = req.body.date_pret;

	app.db.collection('bibliotheque.prets').insert({'livre' : livre, 'emprunteur' : emprunteur
	, 'date_pret' : new Date(date_pret)});

	app.db.collection('bibliotheque.livres').update({'_id' : livre}, {$set : {'emprunt' : true}});

    res.redirect('/bibliotheque');
});

//Termine un prêt
app.post('/bibliotheque/return/:id', function(req, res) {
	var livre = new mongodb.ObjectId(req.params.id);

	if(req.body.retourner) {
	    app.db.collection('bibliotheque.livres').update({'_id' : livre}, {$set : {'emprunt' : false}});
	}

    res.redirect('/bibliotheque');
});

// Connexion au serveur avec la méthode connect
mongoClient.connect(url, function (err, db) {
	app.db = db;
	app.listen(8000);
	console.log("Express server started on 8000");
});