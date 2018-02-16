const express = require('express');
const fs = require("fs");
const app = express();
const ObjectID = require('mongodb').ObjectID;
app.use(express.static('public'));
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
const MongoClient = require('mongodb').MongoClient // le pilote MongoDB



app.set('view engine', 'ejs'); // générateur de template
 var util = require("util");


/*app.get('/formulaire', function (req, res) {

 	//console.log(__dirname);
 	//res.sendFile( __dirname + "/public/html/" + "formulaire.html" );


 res.render('formulaire.ejs')


});*/


 app.get('/membres', (req, res) => {

 	var cursor = db.collection('adresse').find().toArray(function(err, resultat){
 if (err) return console.log(err)
 	console.log('util = ' + util.inspect(resultat));

 // transfert du contenu vers la vue index.ejs (renders)
 // affiche le contenu de la BD

 res.render('membres.ejs', {adresses: resultat})
 }) 

 
});

app.get('/', (req, res) => {

 console.log('accueil')
 //res.end('<h1>Accueil</h1>')
 res.render('accueil.ejs')

})


//////////////////////////////////////////////////////AJOUTER

app.get('/ajouter', function (req, res) {

 // Preparer l'output en format JSON

console.log('la route /traiter_get')



 db.collection('adresse').save(req.query, (err, result) => {
 if (err) return console.log(err)
 console.log('sauvegarder dans la BD')
 res.redirect('/membres')
 })


})

/////////////////////////////////////////////////////////SUPPRIMER

app.get('/supprimer/:id', (req, res) => {

 var id = req.params.id
console.log(id)
// var critere = 'ObjectId("58bae3feaf5a674b240cfe53")'
// 58bae3feaf5a674b240cfe53
// var critere = ObjectID.createFromHexString(id)

 db.collection('adresse').findOneAndDelete({"_id": ObjectID(req.params.id)}, (err, resultat) => {

if (err) return console.log(err)
 res.redirect('/membres')
 })
})

///////////////////////////////////////////////////////////TRIER

app.get('/trier/:cle/:ordre', (req, res) => {
	
	let cle = req.params.cle
 	let ordre = (req.params.ordre == 'asc' ? 1 : -1)

 	let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat){

 		if(ordre == 1){

 			ordre = 'dsc';
 		}
 		else {

 			ordre = 'asc';
 		}

 		res.render('membres.ejs', {adresses: resultat, test:ordre})

 
 })

 })

////////////////////////////////////////////////////////////MODIFIER
app.post('/modifier', (req, res) => {
	console.log(req)
 	
 		console.log('sauvegarde') 
 		var oModif = {
 			"_id": ObjectID(req.body['_id']), 
 			nom: req.body.nom,
 			prenom:req.body.prenom, 
 			telephone:req.body.telephone,
 			courriel:req.body.courriel

 		}


 		var util = require("util");
 		console.log('util = ' + util.inspect(oModif));
 	


 	db.collection('adresse').save(oModif, (err, result) => {
 	if (err) return console.log(err)
 	console.log('sauvegarder dans la BD')
 	res.redirect('/membres')
 })

 })

/////////////////////////////////////////////////////////FUB

let db // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
 if (err) return console.log(err)
 
 db = database.db('carnet_adresse');
// lancement du serveur Express sur le port 8081
 app.listen(8081, () => {
 console.log('connexion à la BD et on écoute sur le port 8081')
 })
})