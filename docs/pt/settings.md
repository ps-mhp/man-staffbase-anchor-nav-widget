# Configurações

## Título

O título acima da lista, por exemplo, «Em resumo». Se o deixares em branco,
o título é ocultado; a lista permanece.

O título é traduzido juntamente com a página.

## Links

Os itens da lista. No Studio, neste local existe um editor que se abre através
de **Editar links**. Os links ficam à esquerda e os campos do item selecionado
à direita; clica num link da lista para selecionar outro. **Adicionar link** cria
e seleciona um novo, e a lixeira remove-o. Podes alterar a ordem utilizando o
manípulo à esquerda: arrasta-o ou seleciona-o, prime Enter para o pegar, move-o
com as teclas de seta para a nova posição e prime Enter para o largar.
**Aplicar** insere a lista na caixa de diálogo; depois, guarda como habitualmente.

A forma mais rápida é através de **Adicionar elemento à página**, na parte superior do editor:
A seleção mostra os títulos e os widgets da página guardada
(▣ = widget) e a seleção pode ser filtrada escrevendo. Um clique cria um link
com o nome do elemento, sendo o destino o
ID do bloco (`#…`). Podes alterar o texto do link posteriormente. Novas secções
só aparecem na lista de seleção depois de a página ser guardada.

Cada link tem dois campos:

- **Texto do link** — o que aparece na lista. Obrigatório: uma entrada sem texto de link
  não é apresentada.
- **Destino** — para onde a entrada remete.
  - **Em branco:** para o título na página com o mesmo nome que o texto do link.
  - **Texto de um título:** para esse título. Assim, a entrada pode ter um nome mais curto
    do que a secção, por exemplo, «Equipamento» em vez de «Equipamento em detalhe».
  - **Um ID de bloco** como `#a447d858-1bba-4a49-b620-b49c60dd67a7`: para este
    bloco da página. Desta forma, define a seleção na parte superior. A ligação permanece válida mesmo após
    a renomeação do título.
  - **Um endereço** que comece por `/`, `http://`, `https://` ou `mailto:`
    : uma ligação normal que o navegador segue.

Na comparação com o título, o que conta é o texto, não o nível — H1 a H6
são todos destinos válidos. Os espaços múltiplos não têm importância,
mas as maiúsculas e minúsculas sim. Se houver vários títulos com o mesmo texto,
a entrada salta para o primeiro.

Caso o editor não apareça, surge um campo de texto com a lista em formato
JSON, por exemplo:

```json
[{ "label": "Equipamento", "target": "Equipamento em detalhe" }]
```

`label` é o texto do link, `target` é o destino (opcional).
