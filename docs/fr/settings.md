# Paramètres

Tout est géré dans la fenêtre **Modifier les liens**. Elle s'ouvre automatiquement dans Studio
dès que tu accèdes à la boîte de dialogue des paramètres du bloc ; pour la fermer,
clique sur le bouton **Modifier les liens**. En haut se trouvent les boutons **Appliquer**,
**Annuler**, Annuler/Rétablir, l’aide et le bouton de basculement **Éditeur ·
Ordinateur de bureau · Tablette · Mobile**. **Appliquer** inscrit le titre et les liens dans la
boîte de dialogue ; enregistrez ensuite comme d’habitude.

La fenêtre comporte trois colonnes : à gauche, les **liens** ; au centre, le
lien sélectionné – ou, après avoir cliqué sur **Nouveau lien**, le **plan du site** ; à droite, la **navigation**
avec ce qui s’applique à l’ensemble de la navigation : titre et navigation sur le
bord de l’écran.

Les éléments de la page proviennent en temps réel de l’éditeur – y compris les titres qui
ne sont pas encore enregistrés – et suivent chaque modification.

## Titre

À droite sous **Navigation** : le titre au-dessus de la liste, par exemple « Sur
cette page ». Si vous laissez ce champ vide, il est masqué ; la liste reste affichée.

Le titre est traduit avec la page.

## Navigation sur le bord de l’écran

À droite sous **Navigation**, activée par défaut. Sur ordinateur de bureau et tablette,
lors du premier défilement, une petite navigation apparaît à droite sur le bord de l’écran : un
trait par section, la section actuelle étant en rouge. Lorsque l’on survole un trait,
le texte du lien s’affiche à gauche ; un clic permet d’y accéder, tandis que les flèches au-dessus et
en dessous permettent de passer à la section précédente ou suivante. Sur le téléphone, dans
le Studio et dans l’aperçu de la fenêtre, elle n’apparaît pas. S’il y a plusieurs
navigations par ancres sur une page, seule la première l’affiche.

## Liens

La colonne de gauche affiche tous les liens dans l’ordre de la navigation. Chaque ligne
indique le texte du lien et, en dessous, la destination vers laquelle il renvoie – par exemple « Titre
« Dates » », « Widget : Galerie de fichiers », « #contact » ou « Vide – titre du même nom
». Un clic sélectionne un lien pour le modifier.

- **Nouveau lien** ouvre le **plan du site** au centre (voir ci-dessous). En l’absence de
  liens, la fenêtre s’ouvre directement sur celui-ci.
- Un **« ! »** à la fin de la ligne signifie que la destination n’existe plus
  sur la page (titre supprimé ou renommé). Sur la page, le lien
  est masqué jusqu’à ce que tu choisisses une nouvelle destination ou que tu le supprimes – le formulaire
  propose pour cela l’option **Supprimer le lien**.
- Pour modifier l’ordre, utilisez la poignée à gauche : faites-la glisser, ou sélectionnez-la,
  validez avec Entrée, déplacez-la à l’aide des touches fléchées vers son nouvel emplacement et
  validez avec Entrée. Vous pouvez également utiliser les flèches **Lien vers le haut** / **Lien vers le bas**
  situées au-dessus du formulaire.
- Les options **Dupliquer le lien** et **Supprimer le lien** s’y trouvent également.

### Texte du lien et destination

Au centre, au-dessus du formulaire, s’affiche « Lien 2 sur 5 » ainsi que le type de destination
(« Destination sur cette page » ou « Lien vers une adresse »).

- **Texte du lien** – ce qui figure dans la liste. Obligatoire : sans texte de lien, la
  fenêtre ne peut pas être validée ; le statut en haut indique alors le lien concerné.
- **Destination** – vers où l'entrée renvoie.
  - **Vide :** vers le titre de la page portant exactement le même nom que le
    texte du lien. Le champ l'affiche alors comme espace réservé.
  - **Texte d’un titre :** vers ce titre. Ainsi, l’entrée peut
    être plus courte que la section, par exemple « Équipement » pour « Équipement en
    détail ».
  - **Un identifiant de bloc** tel que `#a447d858-1bba-4a49-b620-b49c60dd67a7` : vers ce
    bloc de la page. C’est ainsi que le plan du site le définit. Le lien
    reste valide même après le changement de nom du titre.
  - **Une adresse** commençant par `/`, `http://`, `https://` ou `mailto:`
    : un lien classique que le navigateur suit.

Lors de la comparaison avec le titre, c’est le texte qui compte, pas le niveau – H1 à H6
sont tous des cibles au même titre. Les espaces multiples n’ont aucune importance,
contrairement à la distinction entre majuscules et minuscules. S’il existe plusieurs titres identiques,
l’entrée renvoie vers le premier.

### Plan du site

Le plan du site affiche les titres et les widgets de la page sous forme de blocs –
disposés comme dans le brouillon : les sections les unes en dessous des autres, les colonnes les unes à côté des autres selon
leur largeur. Chaque encadré indique le type (par exemple « H2 » ou « Widget · Boîte USP »)
et le texte ou le widget. Les encadrés liés sont bleus.

- **Un clic sur un encadré** crée un lien avec son texte (la cible est l’
  ID du bloc `#…`) et ouvre le texte du lien dans le bloc pour le modifier ; la touche Entrée
  valide. Un clic sur un bloc déjà lié ouvre son
  texte de lien.
- Le symbole en haut à droite du bloc bleu supprime le lien.
- Les encadrés peuvent également être glissés vers la liste de gauche : le lien s’affiche à l’endroit
  où vous relâchez la souris.
- **Lien vide** crée un lien vers une adresse ou une destination personnalisée,
  **Terminé** revient au lien sélectionné.

## Lorsque la page change

Même lorsque la fenêtre est fermée, le widget dans Studio surveille ses cibles :

- **Titre lié supprimé :** il vous demande si le lien doit également être
  supprimé de la navigation. Si vous le conservez, il affiche un
  « ! » dans la fenêtre et n’apparaît plus sur la page.
- **Titre lié renommé :** dès que le curseur quitte le titre,
  le widget vous demande si le lien doit être mis à jour. Le nouveau texte du lien
  est prérempli avec le texte du titre et peut être modifié directement.

La réponse modifie le bloc comme toute modification : il est possible de revenir en arrière, et la modification
prend effet lors de l’enregistrement de la page.

## Aperçu

Les versions **Ordinateur de bureau**, **Tablette** et **Mobile** affichent, à la place du formulaire, la
navigation adaptée à la largeur de l’appareil, telle qu’elle apparaît sur la page ; les liens sans texte de lien
ou sans destination sur la page y sont absents, tout comme sur la page. Sur **mobile**, elle est réduite à un bouton
. La liste et le titre restent accessibles à côté. Dans l'aperçu,
rien ne se déplace et la page du Studio reste inchangée.

## Formulaire enregistré

Le titre et les liens sont regroupés dans l’attribut `anchor-nav-config`. Les anciens
blocs les contiennent encore dans les champs `heading` et `links` ; la page lit
le nouveau champ s’il est renseigné, sinon l’ancien, ils apparaissent donc inchangés.
Lors de la première ouverture, la fenêtre reprend les anciennes valeurs ; ce n’est qu’après avoir cliqué sur **Appliquer**
qu’elle les enregistre dans le nouveau champ. Les anciens champs sont masqués dans la boîte de dialogue.

Si la fenêtre ne s’affiche pas, un champ de texte contenant la version brute apparaît à cet endroit,
par exemple :

```json
{ "heading": "En bref", "links": [{ "id": "a", "label": "Équipement", "target": "Équipement en détail" }] }
```

`label` correspond au texte du lien, `target` à la destination (facultative).
