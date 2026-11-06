# Paramètres

## Titre

Le titre au-dessus de la liste, par exemple « En un coup d'œil ». Si vous laissez ce champ vide,
le titre est masqué ; la liste reste affichée.

Le titre est traduit avec la page.

## Liens

Les entrées de la liste. Dans Studio, un éditeur s'affiche à cet endroit, accessible
via **Modifier les liens**. À gauche se trouvent les liens, à droite les champs de l'
élément sélectionné ; un clic dans la liste en sélectionne un autre. **Ajouter un lien**
en crée un nouveau et le sélectionne, tandis que la corbeille le supprime
. Pour modifier l’ordre, utilisez la poignée à gauche : faites-la glisser, ou sélectionnez la poignée,
validez avec Entrée, déplacez-la à l’emplacement souhaité à l’aide des touches fléchées et
validez avec Entrée. **Appliquer** copie la liste dans la boîte de dialogue, puis
enregistrez comme d’habitude.

Le plus rapide est d’utiliser **Ajouter un élément à la page** en haut de l’éditeur :
la sélection affiche les titres et les widgets de la page enregistrée
(▣ = widget) et peut être filtrée en tapant. Un clic crée un lien avec leur nom ; la destination est l’
ID du bloc (`#…`). Tu peux modifier le texte du lien par la suite. Les nouvelles sections
n’apparaissent dans la liste que lorsque la page est enregistrée.

Chaque lien comporte deux champs :

- **Texte du lien** — ce qui apparaît dans la liste. Obligatoire : une entrée sans texte de lien
  n’est pas affichée.
- **Cible** — où mène l’entrée.
  - **Vide :** vers le titre de la page portant exactement le même nom que le texte du lien.
  - **Texte d’un titre :** vers ce titre. L’entrée peut ainsi être plus courte
    que le titre de la section, par exemple « Équipement » pour « Équipement en détail ».
  - **Un identifiant de bloc** tel que `#a447d858-1bba-4a49-b620-b49c60dd67a7` : vers ce
    bloc de la page. Cela place la sélection en haut. Le lien reste valide même après
    le changement de nom du titre.
  - **Une adresse** commençant par `/`, `http://`, `https://` ou `mailto:`
    : un lien classique que le navigateur suit.

Lors de la comparaison avec le titre, c’est le texte qui compte, pas le niveau — H1 à H6
sont tous des cibles au même titre. Les espaces multiples n’ont aucune importance,
contrairement à la distinction entre majuscules et minuscules. S’il existe plusieurs titres identiques,
l’entrée renvoie vers le premier.

Si l'éditeur n'apparaît pas, un champ de texte s'affiche avec la liste au format
JSON, par exemple :

```json
[{ "label": "Équipement", "target": "Équipement en détail" }]
```

`label` correspond au texte du lien, `target` à la destination (facultatif).
