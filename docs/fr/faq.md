# FAQ

## Le widget n'affiche rien.

Il n'y a encore aucune entrée avec un texte de lien. Dans Studio, ouvrez la boîte de dialogue, créez des entrées via
**Modifier les liens**, validez et enregistrez. Un widget vide
n'affiche rien — pas même une zone vide ni un titre.

## Une entrée manque dans la liste.

Il lui manque le texte du lien. Dans l’éditeur, la ligne suivante s’affiche alors : « Sans texte de lien,
cette entrée ne s’affiche pas. »

## Un clic ne redirige pas.

Le titre contenant exactement ce texte n’existe pas sur la page. La comparaison
se fait avec la destination ou, si celle-ci est vide, avec le texte du lien. Une faute de frappe,
une différence de majuscules et de minuscules ou un titre qui a été renommé
entre-temps suffisent. Copiez le texte du titre et insérez-le dans la cible
.

Les titres dans une navigation par ancres ne comptent jamais comme cible — pas même le
titre d’un deuxième widget sur la même page.

## Sur les pages traduites, le clic ne fonctionne pas.

Les titres de la page sont traduits, mais pas le texte du lien ni la destination. Dans l’
autre langue, l’entrée ne retrouve alors plus son titre, et la
liste continue d’afficher les textes des liens dans la langue dans laquelle ils ont été gérés.

## Le marqueur rouge ne suit pas le défilement.

C’est voulu. Elle se trouve sur l’entrée sur laquelle on a cliqué en dernier. Avant le
premier clic, elle se trouve sur le titre — ou, si aucun titre n’est renseigné, sur la
première entrée. Si quelqu’un ouvre la page via un lien avec un repère de saut,
par exemple `…#équipement`, elle se trouve sur cette entrée.

## Peut-on modifier l’ordre ?

Oui. Dans l’éditeur, faites glisser la poignée vers la gauche, ou sélectionnez la poignée, appuyez sur Entrée
pour la sélectionner, utilisez les touches fléchées pour la déplacer et appuyez sur Entrée pour la déposer. La liste ne doit pas nécessairement suivre l’ordre de la page.

## Deux titres portent le même nom — vers lequel le lien renvoie-t-il ?

Vers le premier sur la page. Si vous souhaitez qu’il renvoie vers le second, la seule solution est de
donner des noms différents aux titres.

## Une entrée peut-elle renvoyer vers une autre page ?

Oui. Saisissez comme destination une adresse commençant par `/`, `http://` ou `https://`.
En cliquant dessus, on y accède comme pour n’importe quel autre lien.
