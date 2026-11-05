# FAQ

## Le widget n'affiche rien.

La page ne comporte aucun titre du niveau défini. Choisissez un autre niveau
ou insérez un titre dans le texte. Un widget vide n'affiche rien —
pas même une zone vide ni un titre.

## Il affiche trop peu de titres.

Les titres dont le texte est vide sont ignorés. De plus, les titres situés à l’intérieur du
widget lui-même ne sont pas pris en compte, sinon il renverrait à lui-même.

Si d’autres entrées manquent, c’est que l’option « Uniquement les titres des blocs Title et
Text » est activée et que le titre manquant se trouve dans un autre
module. Désactivez cette option pour l’inclure.

## Il affiche des titres qui ne correspondent à aucune section.

D'autres widgets gèrent leurs propres titres — les titres d'une liste d'actualités,
par exemple. Si ceux-ci figurent dans la liste, l'option « Titres provenant uniquement des blocs Title et
Text » est désactivée. L'activer limite la liste aux
sections que vous avez vous-même rédigées.

Si elles apparaissent toujours après cela, la page ne se trouve pas dans le Content Designer. Là-bas,
les blocs sur lesquels se base le bouton pour faire la distinction n’existent pas, et celui-ci ne fonctionne
pas.

## Il affiche son propre titre comme entrée.

Cela ne devrait pas se produire. Si c’est pourtant le cas, le titre se trouve en dehors
du conteneur du widget — par exemple sous la forme d’un bloc de texte distinct situé au-dessus. Dans ce cas, utilisez soit le
titre du widget, soit un niveau que le bloc de texte ne possède pas.

## Le marqueur rouge ne suit pas le défilement.

Il suit le défilement et reste sur le titre qui a atteint en dernier le
quart supérieur de la fenêtre. Tout en haut de la page, il se trouve sur le titre
— ou, si aucun titre n’est saisi, sur la première entrée. Si vous avez activé l’option « Réduire les
mouvements », vous la verrez sauter au lieu de glisser — c’est voulu.

## Peut-on modifier l’ordre ?

Non. La liste suit l’ordre du texte. Si vous souhaitez modifier l’ordre des liens,
modifiez l’ordre des sections.

## Si deux titres portent le même nom, le lien fonctionne-t-il correctement ?

Oui. Les liens mémorisent le titre lui-même, et non son nom.
