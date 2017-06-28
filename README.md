bibliotheque
==

Modélisation des données : 
-

- On utilise une collection bibliotheque.livre avec les clés 'isbn', 'titre', 'auteurs[]', 'date_achat', 'etat', 
'categories[]', 'emprunt' (booléen qui permet de savoir si le livre est emprunté ou non) :  


    db.bibliotheque.livres.insert({  
        "isbn" : "978-2-290-10591-7",  
        "titre" : "Dangerous Women",  
        "auteurs" :  [ "Martin George R.R." , "Dozois Gardner"  ],  
        "date_achat" : new Date("23/12/2016"),  
        "etat" : "neuf",  
        "catégories" : [ "Science Fiction", "Fantasy", "Thriller" ] ,  
        "emprunt" : false  
    })

- On utilise une collection bibliotheque.prets avec les clés 'livre' (qui correspond à l'id du livre en question), 
'emprunteur', 'date_pret':  


    db.bibliotheque.prets.insert({
        "livre" : ObjectId("59528ae2291ab33b9bdd521f"), 
        "emprunteur" : "Hebert Lucy", 
        "date_pret" : new Date()
    })



    

