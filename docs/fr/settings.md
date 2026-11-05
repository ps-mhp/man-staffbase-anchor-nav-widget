# Paramètres

## Titre

Le titre au-dessus de la liste, par exemple « En un coup d'œil ». Si vous laissez ce champ vide,
le titre est masqué ; la liste reste affichée.

Le titre est traduit avec la page.

## Liens

Les éléments de la liste. Dans Studio, un éditeur s’ouvre en cliquant sur
**Modifier les liens**. Les liens sont à gauche et les champs de l’élément
sélectionné à droite ; cliquez sur un lien dans la liste pour en sélectionner
un autre. **Ajouter un lien** en crée un nouveau et le sélectionne, et la
corbeille le supprime. Vous pouvez modifier l’ordre à l’aide de la poignée à
gauche : faites-la glisser, ou sélectionnez-la, appuyez sur Entrée pour la
saisir, déplacez-la avec les touches fléchées jusqu’à sa nouvelle position et
appuyez sur Entrée pour la déposer. **Appliquer** enregistre la liste dans la
boîte de dialogue, puis enregistrez comme d’habitude.

Le plus rapide est d’utiliser **Ajouter un élément à la page** en haut de l’éditeur :
la sélection affiche les titres et les widgets de la page enregistrée
(▣ = widget) et la sélection peut être filtrée en tapant. Un clic crée un lien
portant leur nom, dont la destination est l’
ID du bloc (`#…`). Vous pouvez modifier le texte du lien par la suite. Les nouvelles sections
n’apparaissent dans la liste que lorsque la page est enregistrée.

Chaque lien comporte deux champs :

- **Texte du lien** — ce qui apparaît dans la liste. Obligatoire : une entrée sans texte de lien
  ne s’affiche pas.
- **Cible** — où mène l’entrée.
  - **Vide :** vers le titre de la page portant le même nom que le texte du lien.
  - **Texte d’un titre :** vers ce titre. L’entrée peut ainsi être plus courte
    que la section, par exemple « Équipement » pour « Équipement en détail ».
  - **Un identifiant de bloc** tel que `#a447d858-1bba-4a49-b620-b49c60dd67a7` : vers ce
    bloc de la page. Cela place la sélection en haut. Le lien reste valide même après
    le changement de nom du titre.
  - **Une adresse** commençant par `/`, `http://`, `https://` ou `mailto:`
    : un lien classique que le navigateur suit.

Lors de la comparaison avec le titre, c’est le texte qui compte, pas le niveau — H1 à H6
sont tous des cibles au même titre. Les espaces multiples n’ont pas d’importance,
contrairement à la distinction entre majuscules et minuscules. S’il existe plusieurs titres identiques,
l’entrée renvoie vers le premier.

Si l’éditeur n’apparaît pas, un champ de texte s’affiche avec la liste au format
JSON, par exemple :

```json
[{ "label": "Équipement", "target": "Équipement en détail" }]
```

`label` correspond au texte du lien, `target` à la destination (facultatif).
