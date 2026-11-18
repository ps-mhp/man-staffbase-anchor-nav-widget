# Paramètres

Tout est géré dans la fenêtre **Modifier les liens**. Elle s'ouvre automatiquement dans Studio
dès que tu accèdes à la boîte de dialogue des paramètres du bloc ; pour la fermer,
clique sur le bouton **Modifier les liens**. En haut se trouvent les boutons **Appliquer**,
**Annuler**, Annuler/Rétablir, l’aide et le bouton de basculement **Éditeur ·
Ordinateur de bureau · Tablette · Mobile**. **Appliquer** inscrit les titres et les liens dans la
boîte de dialogue ; enregistrez ensuite comme d’habitude.

La fenêtre comporte trois colonnes : à gauche, les **liens** ; au centre, le
lien sélectionné et la sélection issue de la page ; à droite, la **navigation** avec le titre.

## Titre

À droite, sous **Navigation** : l’en-tête au-dessus de la liste, par exemple « Sur
cette page ». Si vous laissez ce champ vide, il est masqué ; la liste reste affichée.

Le titre est traduit avec la page.

## Liens

La colonne de gauche affiche tous les liens dans l’ordre de la navigation. Chaque ligne
indique le texte du lien et, en dessous, la destination vers laquelle il renvoie – par exemple « Titre
« Agenda » », « Widget : Galerie de fichiers », « #contact » ou « Vide – titre du même nom
». Un clic sélectionne un lien pour le modifier.

- **Nouveau lien** crée un lien vide, le sélectionne et place le curseur dans
  le texte du lien.
- Vous pouvez modifier l’ordre à l’aide de la poignée située à gauche : faites-la glisser, ou sélectionnez-la,
  validez avec Entrée, déplacez-la à l’aide des touches fléchées vers son nouvel emplacement et
  validez avec Entrée. Vous pouvez également utiliser les flèches **Lien vers le haut** / **Lien vers le bas**
  situées au-dessus du formulaire.
- **Dupliquer le lien** et **Supprimer le lien** s’y trouvent également.

### Texte du lien et destination

Au centre, au-dessus du formulaire, figure « Lien 2 sur 5 » ainsi que le type de destination
(« Destination sur cette page » ou « Lien vers une adresse »).

- **Texte du lien** – ce qui figure dans la liste. Obligatoire : sans texte de lien, la
  fenêtre ne peut pas être validée ; le statut en haut indique alors le lien concerné.
- **Destination** – vers où mène l’entrée.
  - **Vide :** vers le titre de la page portant exactement le même nom que le
    texte du lien. Le champ l’affiche alors comme espace réservé.
  - **Texte d’un titre :** vers ce titre. Ainsi, l’entrée peut
    être plus courte que la section, par exemple « Équipement » pour « Équipement en
    détail ».
  - **Un identifiant de bloc** tel que `#a447d858-1bba-4a49-b620-b49c60dd67a7` : vers ce
    bloc de la page. C’est ainsi que la sélection s’effectue ci-dessous. Le lien reste valide même après
    le changement de nom du titre.
  - **Une adresse** commençant par `/`, `http://`, `https://` ou `mailto:`
    : un lien classique que le navigateur suit.

Lors de la comparaison avec le titre, c’est le texte qui compte, pas le niveau – les titres H1 à H6
sont tous des cibles au même titre. Les espaces multiples n’ont aucune importance,
contrairement à la distinction entre majuscules et minuscules. S’il existe plusieurs titres identiques,
l’entrée renvoie vers le premier.

### Ajouter un élément à la page

Le plus rapide est d’utiliser la fonction **Rechercher un titre ou un widget** située sous le
formulaire : la liste affiche les titres (avec leur niveau, par exemple « H3 sous
« Agenda » ») et les widgets de la page enregistrée ; elle peut être filtrée en
taper. Un clic crée un nouveau lien avec leur nom, la destination
étant l’ID du bloc (`#…`). Tu peux modifier le texte du lien par la suite. Ce qui est déjà
lié apparaît verrouillé avec la mention « déjà lié » dans la liste. Les nouvelles
sections n’apparaissent qu’une fois la page enregistrée.

## Aperçu

Sur **ordinateur de bureau**, **tablette** et **mobile**, le formulaire est remplacé par la
navigation adaptée à la largeur de l’appareil, telle que la page l’affiche ; les liens sans texte
y sont absents, tout comme sur la page. Sur **mobile**, elle est réduite à un bouton
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
