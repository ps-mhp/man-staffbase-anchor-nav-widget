# Configurações

## Título

O título acima da lista, por exemplo, «Em resumo». Se o deixares em branco,
este fica oculto; a lista permanece.

O título é traduzido juntamente com a página.

## Links

Os itens da lista. No Studio, neste local existe um editor com uma
linha por link. Clica em **Editar links** para o abrir; com **Adicionar
link**, é adicionada uma linha; a lixeira remove-a. Podes
alterar a ordem utilizando o manípulo à esquerda: arrasta ou seleciona o manípulo e, com
as setas para cima e para baixo, desloca-o. **Aplicar** insere a
lista na caixa de diálogo; depois, guarde como habitualmente.

A forma mais rápida é através de **Adicionar elemento da página**, no topo do editor:
a seleção mostra os títulos e widgets da página guardada
(▣ = widget). Um clique cria um link com o respetivo nome; o destino é o
ID do bloco (`#…`). Depois, podes alterar o texto do link. As novas secções
só aparecem na seleção depois de a página ser guardada.

Cada linha tem dois campos:

- **Texto do link** — o que aparece na lista. Obrigatório: uma entrada sem texto de link
  não é apresentada.
- **Destino** — para onde a entrada remete.
  - **Em branco:** para o título na página com o mesmo nome que o texto do link.
  - **Texto de um título:** para esse título. Assim, a entrada pode ter um nome mais curto
    do que a secção, por exemplo, «Equipamento» em vez de «Equipamento em detalhe».
  - **Um ID de bloco** como `#a447d858-1bba-4a49-b620-b49c60dd67a7`: para esse
    bloco da página. É o que a seleção acima define. O link continua válido
    mesmo depois de o título ser renomeado.
  - **Um endereço** que comece por `/`, `http://`, `https://` ou `mailto:`
    : uma referência normal, que o navegador segue.

Na comparação com o título, o que conta é o texto, não o nível — H1 a H6
são todos destinos equivalentes. Os espaços múltiplos não têm importância,
mas as maiúsculas e minúsculas sim. Se houver vários títulos com o mesmo texto,
a entrada salta para o primeiro.

Caso o editor não apareça, existe um campo de texto com a lista em formato
JSON, por exemplo:

```json
[{ "label": "Equipamento", "target": "Equipamento em detalhe" }]
```

`label` é o texto do link, `target` é o destino (opcional).
