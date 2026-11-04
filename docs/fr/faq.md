# FAQ

## Le widget n'affiche rien.

La page ne comporte aucun titre du niveau défini. Choisissez un autre niveau
ou insérez un titre dans le texte. Un widget vide n'affiche rien —
pas même une zone vide ni un titre.

## Il affiche trop peu de titres.

Les titres dont le texte est vide sont ignorés. Et les titres situés à l’intérieur du
widget lui-même ne sont pas pris en compte, sinon il ferait référence à lui-même.

## Il affiche son propre titre comme entrée.

Cela ne devrait pas se produire. Si c’est pourtant le cas, le titre se trouve en dehors
du conteneur du widget — par exemple sous forme de bloc de texte distinct au-dessus. Il faut alors soit utiliser le
titre du widget, soit choisir un niveau que le bloc de texte ne possède pas.

## Le marqueur rouge ne suit pas le défilement.

Elle suit le défilement et reste sur le titre qui a atteint en dernier le
quart supérieur de la fenêtre. Tout en haut de la page, elle se trouve sur la première
entrée. Si vous avez activé l’option « Réduire les mouvements », vous la verrez sauter au lieu de
glisser — c’est voulu.

## Peut-on modifier l’ordre ?

Non. La liste suit l’ordre du texte. Si vous souhaitez modifier l’ordre des liens,
il faut modifier l’ordre des sections.

## Si deux titres portent le même nom, le lien fonctionne-t-il correctement ?

Oui. Les liens mémorisent le titre lui-même, et non son nom.
