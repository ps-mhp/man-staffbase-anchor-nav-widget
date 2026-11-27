# Paramètres

Tout est géré dans la fenêtre **Modifier les liens**. Elle s'ouvre automatiquement dans Studio
dès que vous accédez à la boîte de dialogue des paramètres du bloc ; pour la fermer,
cliquez sur le bouton **Modifier les liens**. En haut se trouvent les boutons **Appliquer**,
**Annuler**, Annuler/Rétablir, l’aide et le bouton de basculement **Éditeur ·
Ordinateur de bureau · Tablette · Mobile**. **Appliquer** inscrit le titre et les liens dans la
boîte de dialogue ; enregistrez ensuite comme d’habitude.

La fenêtre comporte trois colonnes : à gauche, les **liens** ; au centre, le
lien sélectionné ; à droite, la **navigation** avec le titre et la **structure de la page**.

Les éléments de la page proviennent en temps réel de l’éditeur – y compris les titres qui
ne sont pas encore enregistrés – et suivent chaque modification.

## Titre

À droite, sous **Navigation**, en haut : le titre au-dessus de la liste, par exemple « Sur
cette page ». Si vous laissez ce champ vide, il est masqué ; la liste reste affichée.

Le titre est traduit avec la page.

## Liens

La colonne de gauche affiche tous les liens dans l’ordre de la navigation. Chaque ligne
indique le texte du lien et, en dessous, la destination vers laquelle il renvoie – par exemple « Titre
« Dates » », « Widget : galerie de fichiers », « #contact » ou « Vide – titre du même nom
». Un clic sélectionne un lien pour le modifier.

- **Nouveau lien** ouvre un menu déroulant : en haut, **Lien vide** (crée un
  lien vide et place le curseur dans le texte du lien), en dessous, la recherche
  parmi les titres et les widgets de la page (voir ci-dessous).
- Un **« ! »** à la fin de la ligne signifie que la destination n’existe plus
  sur la page (titre supprimé ou renommé). Sur la page, le lien
  est masqué jusqu’à ce que tu choisisses une nouvelle destination ou que tu le supprimes – le formulaire
  propose pour cela l’option **Supprimer le lien**.
- Pour modifier l’ordre, utilisez la poignée à gauche : faites-la glisser, ou sélectionnez la poignée,
  validez avec Entrée, déplacez-la vers le nouvel emplacement à l’aide des touches fléchées et
  validez avec Entrée. Vous pouvez également utiliser les flèches **Lien vers le haut** / **Lien vers le bas**
  au-dessus du formulaire.
- Les options **Dupliquer le lien** et **Supprimer le lien** s’y trouvent également.

### Texte du lien et destination

Au centre, au-dessus du formulaire, s’affiche « Lien 2 sur 5 » ainsi que le type de destination
(« Destination sur cette page » ou « Lien vers une adresse »).

- **Texte du lien** – ce qui apparaît dans la liste. Obligatoire : sans texte de lien, la
  fenêtre ne peut pas être validée ; le statut en haut indique alors le lien concerné.
- **Destination** – vers où l'entrée renvoie.
  - **Vide :** vers le titre de la page portant exactement le même nom que le
    texte du lien. Le champ l'affiche alors comme un espace réservé.
  - **Texte d’un titre :** vers ce titre. Ainsi, l’entrée peut
    être plus courte que la section, par exemple « Équipement » pour « Équipement en
    détail ».
  - **Un identifiant de bloc** tel que `#a447d858-1bba-4a49-b620-b49c60dd67a7` : vers ce
    bloc de la page. C’est ainsi que la sélection et la structure de la page le définissent. Le lien
    reste valide même après le changement de nom du titre.
  - **Une adresse** commençant par `/`, `http://`, `https://` ou `mailto:`
    : un lien classique que le navigateur suit.

Lors de la comparaison avec le titre, c’est le texte qui compte, pas le niveau – H1 à H6
sont tous des cibles au même titre. Les espaces multiples n’ont aucune importance,
contrairement à la distinction entre majuscules et minuscules. S’il existe plusieurs titres identiques,
l’entrée renvoie vers le premier.

### Créer un lien vers un titre ou un widget de la page

Deux méthodes sont possibles ; toutes deux créent un lien avec le nom de l’élément, la cible étant
son identifiant de bloc (`#…`) ; vous pouvez modifier le texte du lien par la suite :

- **Nouveau lien** → **Rechercher un titre ou un widget** : la liste affiche les
  titres (avec leur niveau, par exemple « H3 sous « Agenda » ») et les widgets de la
  page avec leur nom et leur caractéristique (par exemple « Principaux concurrents · Encadré USP ») et
  peut être filtrée en tapant – y compris selon le type de widget.
- **Structure de la page** à droite : la structure de la page sous forme d’arborescence indentée.
  Faites glisser un élément vers la liste de gauche – il se place là où vous le lâchez –
  ou cliquez dessus pour l’ajouter à la fin.

Ce qui est déjà lié est coché ou porte la mention « déjà lié » ; une deuxième
tentative sélectionne le lien existant au lieu de le dupliquer.

## Lorsque la page change

Même lorsque la fenêtre est fermée, le widget dans Studio surveille ses cibles :

- **Titre lié supprimé :** il demande si le lien doit également être
  navigation. Si tu le conserves, il est signalé par un
  « ! » dans la fenêtre et n’apparaît pas sur la page.
- **Titre lié renommé :** dès que le curseur quitte le titre,
  le widget te demande si le lien doit être mis à jour. Le nouveau texte du lien
  est prérempli avec le texte du titre et peut être modifié directement.

La réponse modifie le bloc comme toute modification : elle peut être annulée et
prend effet lors de l’enregistrement de la page.

## Aperçu

**Ordinateur de bureau**, **tablette** et **mobile** affichent, à la place du formulaire, la
navigation adaptée à la largeur de l’appareil, telle que la page la présente ; les liens sans texte de lien
ou sans destination sur la page y sont absents, tout comme sur la page. Sur **mobile**, elle est réduite à un bouton
. La liste et le titre restent accessibles à côté. Dans l’aperçu,
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
