# Navigation par ancres

Le widget analyse les titres de la page et affiche ceux d'un même niveau — H1 à
H6 — sous forme de liste de liens. Un clic permet d'accéder directement à l'endroit correspondant ; pendant la lecture,
un marqueur rouge se déplace vers le titre sur lequel on se trouve actuellement.

La liste est générée lors de l’affichage de la page. Il n’y a rien à gérer : si vous
renommez, déplacez ou supprimez un titre, cela modifie automatiquement la navigation.

## À quoi cela sert-il ?

Aux longues pages présentant une structure claire — un modèle de voiture avec ses équipements,
une directive avec ses sections. Cela ne vaut pas la peine sur les pages courtes.

## Ce qu’il ne fait pas

- **Ne renvoie pas vers d’autres pages.** Tous les liens restent sur cette page.
  Pour les liens vers d’autres pages, il existe le widget de navigation.
- **Pas d’imbrication.** Il n’affiche qu’un seul niveau, pas d’arborescence.
- **Ne crée pas de titres.** Il ne détecte que ce qui figure déjà dans le texte.
