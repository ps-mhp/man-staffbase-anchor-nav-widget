# Paramètres

## Reprendre les titres

Le widget ne lit pas les titres sur la page publiée, mais
lors de la modification dans Studio : dès que la boîte de dialogue des paramètres du widget s'ouvre,
il reprend les titres de la page. En bas de la boîte de dialogue, le nombre de
titres récupérés est indiqué, par exemple « 22 titres de la page récupérés (H1 : 12 · H2 : 10) ».

Enregistrez ensuite. Ce n’est qu’à ce moment-là que la page publiée prendra en compte la liste.

Si les titres de la page changent, rouvrez la boîte de dialogue et enregistrez —
sinon, le widget affichera l'ancienne version. Les titres qui n'existent plus
sont automatiquement supprimés.

## Niveau des titres

Niveau affiché par la liste : **H1** à **H6**. La valeur par défaut est **H2**.

Il s’agit d’un niveau précis, et non pas « à partir de ce niveau ». Si vous sélectionnez H2, vous obtiendrez les H2
de la page — les H3 situés en dessous ne seront pas pris en compte.

Si le widget n’affiche rien, cela signifie que la page n’utilise pas ce niveau. Vérifiez alors dans le texte
quel niveau les sections ont réellement.

## Titre

Le titre au-dessus de la liste, par exemple « En un coup d’œil ». Si vous laissez ce champ vide,
il est masqué ; la liste reste affichée.

Le titre est traduit avec la page. Les éléments de la liste n’en ont pas besoin
: ce sont les titres de la page et ils portent de toute façon leur traduction.

## Uniquement les titres des blocs **Title** et **Text**

Activé par défaut. Dans ce cas, la liste ne prend en compte que les titres figurant dans un
bloc **Title** ou **Text** — c’est-à-dire les sections que vous avez vous-même
rédigées.

Lorsqu’elle est désactivée, chaque titre de ce niveau présent sur la page est pris en compte. Cela
inclut également ceux que d’autres widgets affichent dans leur propre présentation : les
titres d’une liste d’actualités, par exemple, ou les légendes d’un portfolio.
Ceux-ci ne constituent pas une section de la page, et un lien vers eux renvoie à un
endroit auquel le lecteur ne s’attend pas.

Sur les pages sans Content Designer, le bouton ne fonctionne pas. Ces pages ne disposent pas des
éléments sur lesquels il se base pour faire la distinction, et la liste affiche comme auparavant
tous les titres de ce niveau — un widget vide serait en effet inexplicable dans ce contexte.
