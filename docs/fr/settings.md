# Paramètres

## Titre

Le titre au-dessus de la liste, par exemple « En un coup d'œil ». Si vous laissez ce champ vide,
le titre est masqué ; la liste reste affichée.

Le titre est traduit avec la page.

## Liens

Les éléments de la liste. Dans Studio, cet emplacement contient un éditeur avec une
ligne par lien. Cliquez sur **Modifier les liens** pour l’ouvrir, sur **Ajouter un lien**
pour ajouter une ligne, et sur la corbeille pour la supprimer. Vous pouvez
modifier l’ordre à l’aide de la poignée à gauche : faites-la glisser, ou sélectionnez-la et utilisez
les touches fléchées pour la déplacer vers le haut ou vers le bas. **Appliquer** enregistre la
liste dans la boîte de dialogue ; enregistrez ensuite comme d’habitude.

Le plus rapide est d’utiliser **Ajouter un élément de la page** en haut de l’éditeur :
la sélection affiche les titres et widgets de la page enregistrée
(▣ = widget). Un clic crée un lien portant leur nom ; la destination est
l’ID de bloc (`#…`). Vous pouvez ensuite modifier le texte du lien. Les nouvelles sections
n’apparaissent dans la sélection qu’une fois la page enregistrée.

Chaque ligne comporte deux champs :

- **Texte du lien** — ce qui apparaît dans la liste. Obligatoire : une entrée sans texte de lien
  n’est pas affichée.
- **Destination** — où mène l’entrée.
  - **Vide :** vers le titre de la page portant le même nom que le texte du lien.
  - **Texte d’un titre :** vers ce titre. L’entrée peut ainsi être plus courte
    que le titre de la section, par exemple « Équipement » pour « Équipement en détail ».
  - **Un ID de bloc** tel que `#a447d858-1bba-4a49-b620-b49c60dd67a7` : vers ce
    bloc de la page. C’est ce que définit la sélection ci-dessus. Le lien reste
    valide même après le renommage du titre.
  - **Une adresse** commençant par `/`, `http://`, `https://` ou `mailto:`
    : un lien classique que le navigateur suit.

Lors de la comparaison avec le titre, c’est le texte qui compte, pas le niveau — H1 à H6
sont toutes des cibles au même titre. Les espaces multiples n’ont aucune importance,
contrairement à la distinction entre majuscules et minuscules. S’il existe plusieurs titres identiques,
l’entrée renvoie vers le premier.

Si l’éditeur n’apparaît pas, un champ de texte contenant la liste au format
JSON s’affiche, par exemple :

```json
[{ "label": "Équipement", "target": "Équipement en détail" }]
```

`label` correspond au texte du lien, `target` à la cible (facultative).
