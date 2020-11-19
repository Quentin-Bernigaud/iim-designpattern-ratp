# Exercice sur le Revealing Module Pattern
## Consignes de l'exercice
Le but de cet exercice est de créer une interface HTML pour lister les lignes de métros via l’API&nbsp;:<br>https://api-ratp.pierre-grimaud.fr/v4/
### Étape 1
Récupérer la liste des métros avec fetch via l’url suivante :<br>https://api-ratp.pierre-grimaud.fr/v4/lines/metros
### Étape 2
Extraire les données
### Étape 3
Créer une balise `select` avec dans chaque `option` les lignes récupérées à l’étape 2<br>https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
### Étape 4
Ajouter un `écouteur d'événement (change)` sur le select qui va lancer une requête `asynchrone` pour récupérer la liste des `stations` de la ligne de métro sélectionnée
### Étape 5
Créer une autre balise select (#2) avec dans chaque option les `stations` récupérées à l’étape 4
### Étape 6
Ajouter un `écouteur d'événement (change)` sur le select (#2) qui va lancer une requête asynchrone pour récupérer la liste des `prochains horaires` de la ligne de métro sélectionnée et de la station sélectionnée. Par exemple, si j’ai sélectionné la `ligne 6`, puis la `station Nation`, récupérer les données de l’url suivante :<br>
https://api-ratp.pierre-grimaud.fr/v4/schedules/metros/6/nation/A+R 
### Étape 7
Afficher dans des balises `ul` et `li` la liste des prochains horaires récupérés à l’étape 6 ainsi que la destination associée
### Étape 8
Ajouter un refresh des données toutes les 30 secondes
### Étape Bonus #1
Afficher la date exacte (ex. 15:30) au lieu de la valeur d’attente renvoyée par l’API (métro dans x minutes)
### Étape Bonus #2
Séparer les données en les regroupants par destination et créer 2 listes avec des balises `ul` différentes
### Étape Bonus #3
Afficher la moyenne d’attente par destination
### Étape Bonus #4
Récupérer l’état du trafic de la ligne sélectionnée<br>
Exemple : si j’ai sélectionné la ligne `6` à l’étape 4, faire un appel fetch à l’url suivante :<br>https://api-ratp.pierre-grimaud.fr/v4/traffic/metros/6<br>
Afficher la donnée de trafic sur la page, dans une div
### Étape Bonus #5
Ajouter une étape entre la sélection de la ligne et de la station, demandant la destination<br>https://api-ratp.pierre-grimaud.fr/v4/destinations/metros/6
## Bonus supplémentaires
- Ajout d'une mise en page `CSS`
- Affichage de l'`heure d'état`
- Transfortmation des textes des messages 
  - `Destination unavailable` devient `Destination indisponible`
  - `mn` devient `min`
  - `Train a quai` devient `À quai`
  - `Train a l'approche` devient `À l'approche`
  - `Train retarde` devient `En retard`
  - `Schedules unavailable` devient `Horaire indisponible`
- `Sélection automatique` du premier élément de chaque `select box`