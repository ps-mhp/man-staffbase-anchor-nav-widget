# FAQ

## Le widget n'affiche rien.

Il n'y a encore aucune entrée avec un texte de lien. Ouvrez la boîte de dialogue dans Studio, puis, dans la
fenêtre **Modifier les liens**, créez des entrées, validez et enregistrez. Un
widget vide n'affiche rien — pas même une zone vide ni un titre.

## Une entrée manque dans la liste.

Il lui manque le texte du lien. Désormais, un lien sans texte ne peut plus
être validé : la fenêtre affiche le message « Lien 2 : texte du lien manquant » et le met en évidence dans la
liste. Les blocs plus anciens peuvent encore contenir de telles entrées ; elles apparaissent dans la fenêtre
sous la mention « Sans texte de lien » dans la liste.

## L’ouverture de la fenêtre modifie-t-elle un bloc plus ancien ?

Non. Les blocs plus anciens contiennent encore les titres et les liens dans les champs `heading` et
`links`. La fenêtre les reprend à l’ouverture ; tant que vous ne modifiez rien,
rien ne peut être appliqué et le bloc reste tel quel. Ce n’est qu’en
cliquant sur **Appliquer** que les titres et les liens sont enregistrés dans le nouveau champ `anchor-nav-config` – avec
le même résultat sur la page.

## Un clic ne fonctionne pas.

Le titre contenant exactement ce texte n’existe pas sur la page. La comparaison
se fait avec la cible ou, si celle-ci est vide, avec le texte du lien. Une faute de frappe,
une différence de majuscules ou de minuscules, ou un titre qui a été renommé entre-temps
suffisent. Copiez le texte du titre et insérez-le dans la cible
.

Les titres dans une navigation par ancres ne comptent jamais comme cible — pas même le
titre d’un deuxième widget sur la même page.

## Un lien manque sur la page.

Sa destination n’existe plus sur la page : le titre ou le widget
a été supprimé, ou – dans le cas des liens sur le texte – le titre a changé.
Dans la fenêtre **Modifier les liens**, le lien est signalé par un « ! ». Choisissez une nouvelle destination
ou supprimez le lien.

## Des liens manquent sur les pages traduites.

Les titres de la page sont traduits, mais pas le texte du lien ni sa destination. Un
lien sur le texte ne retrouve plus son titre dans l’autre langue
et y est masqué. Les liens vers un identifiant de bloc (issu de la sélection ou de la
structure de la page) ne sont pas liés au texte du titre.

## Quand le marqueur rouge change-t-il de position ?

Lors du défilement : il se trouve au niveau de la section dont le titre a atteint en dernier le
quart supérieur de l’écran. Tout en bas de la page, là où les dernières
sections ne remontent plus aussi haut, elle se place sur la dernière section visible.
Après un clic, elle reste sur l’entrée sélectionnée jusqu’à ce que tu fasses à nouveau défiler la page.
Avant la première section, elle se place sur la première entrée. Si quelqu’un ouvre la
page via un lien avec un repère, par exemple `…#équipement`, elle se place sur
cette entrée.

Les entrées comportant une adresse (`/…`, `https://…`) n’ont pas de section sur la
page ; le repère ne s’y déplace pas lors du défilement.

## Peut-on modifier l’ordre ?

Oui. Dans la fenêtre, faites glisser la poignée vers la gauche, ou sélectionnez la poignée, appuyez sur Entrée
pour la sélectionner, utilisez les touches fléchées pour la déplacer et appuyez sur Entrée pour la déposer. Ou utilisez les
flèches **Lien vers le haut** / **Lien vers le bas** situées au-dessus du formulaire. La liste ne doit
pas nécessairement suivre l’ordre de la page.

## Deux titres portent le même nom — vers lequel le lien renvoie-t-il ?

Vers le premier sur la page. Si vous souhaitez qu’il renvoie vers le second, la seule solution est de
donner des noms différents aux titres.

## Une entrée peut-elle renvoyer vers une autre page ?

Oui. Saisissez comme destination une adresse commençant par `/`, `http://` ou `https://`.
En cliquant dessus, on y accède comme pour n’importe quel autre lien.
