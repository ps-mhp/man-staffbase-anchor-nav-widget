# Configurações

Tudo é gerido na janela **Editar links**. Esta abre-se automaticamente no Studio
assim que acederes à caixa de diálogo de configurações do bloco; para a fechar,
basta clicar no botão **Editar links**. Na parte superior encontram-se **Aplicar**,
**Cancelar**, **Anular/Repetir**, a Ajuda e o botão de alternância **Editor ·
Desktop · Tablet · Móvel**. **Aplicar** insere o título e os links na
caixa de diálogo; depois, guarda como habitualmente.

A janela tem três colunas: à esquerda, os **Links**; no centro, o
link selecionado e a seleção da página; à direita, a **Navegação** com o título.

## Título

À direita, em **Navegação**: o título acima da lista, por exemplo, «Nesta
página». Se deixar em branco, o título é ocultado; a lista permanece.

O título é traduzido juntamente com a página.

## Links

A coluna da esquerda mostra todos os links pela ordem da navegação. Cada linha
indica o texto do link e, abaixo, para onde este remete – por exemplo, «Título
«Agenda»», «Widget: Galeria de ficheiros», «#contacto» ou «Em branco – título com o mesmo nome
». Um clique seleciona um link para edição.

- **Novo link** cria um link vazio, seleciona-o e coloca o cursor no
  texto do link.
- Pode alterar a ordem utilizando o controlador à esquerda: arraste-o ou selecione-o,
  confirme com Enter, mova-o para a nova posição com as setas e
  confirme com Enter. Ou utilize as setas **Link para cima** / **Link para baixo**
  acima do formulário.
- **Duplicar link** e **Apagar link** também se encontram aí.

### Texto do link e destino

No centro, por cima do formulário, aparece «Link 2 de 5» e o tipo de destino
(«Destino nesta página» ou «Referência a um endereço»).

- **Texto do link** – o que consta na lista. Obrigatório: sem texto do link, a
  janela não pode ser guardada; o estado na parte superior indica então o link em questão.
- **Destino** – para onde a entrada remete.
  - **Em branco:** para o título na página com o mesmo nome que o
    texto do link. O campo apresenta-o como um espaço reservado.
  - **Texto de um título:** para esse título. Desta forma, a entrada
    pode ter um nome mais curto do que a secção, por exemplo, «Equipamento» em vez de «Equipamento em
    detalhe».
  - **Um ID de bloco** como `#a447d858-1bba-4a49-b620-b49c60dd67a7`: para este
    bloco da página. Desta forma, define a seleção na parte inferior. A ligação permanece válida mesmo após
    a renomeação do título.
  - **Um endereço** que comece por `/`, `http://`, `https://` ou `mailto:`
    : uma ligação normal que o navegador segue.

Na comparação com o título, o que conta é o texto, não o nível – H1 a H6
são todos destinos válidos. Os espaços múltiplos não têm importância,
mas as maiúsculas e minúsculas sim. Se houver vários títulos com o mesmo nome,
a entrada salta para o primeiro.

### Adicionar um elemento à página

A forma mais rápida é através da opção **Procurar título ou widget**, situada por baixo do
formulário: a lista apresenta os títulos (com o nível, por exemplo, «H3 em
«Agenda»») e os widgets da página guardada, e pode ser filtrada
toques. Um clique cria um novo link com o nome do elemento, sendo o destino
o ID do bloco (`#…`). Podes alterar o texto do link posteriormente. O que já
estiver ligado aparece bloqueado na lista com a indicação «já ligado». Novas
secções só aparecem depois de a página ser guardada.

## Pré-visualização

**Desktop**, **Tablet** e **Móvel** mostram, em vez do formulário, a
navegação ajustada à largura do dispositivo, tal como a página a apresenta; os links sem texto de link
não aparecem aí, tal como na página. No **telemóvel**, esta fica reduzida a um botão
. A lista e o título permanecem operacionais ao lado. Na pré-visualização
nada salta e a página do Studio permanece inalterada.

## Formato guardado

O título e os links estão agrupados no atributo `anchor-nav-config`. Os blocos mais antigos
ainda os contêm nos campos `heading` e `links`; a página lê
o novo campo, se houver uma especificação, e, caso contrário, o antigo, pelo que parecem inalterados.
Ao abrir pela primeira vez, a janela assume os valores antigos; só ao clicar em **Aplicar**
é que estes são gravados no novo campo. Os campos antigos estão ocultos na caixa de diálogo.

Se a janela não aparecer, existe ali um campo de texto com a versão bruta,
por exemplo:

```json
{ "heading": "Em resumo", "links": [{ "id": "a", "label": "Equipamento", "target": "Equipamento em detalhe" }] }
```

`label` é o texto do link, `target` é o destino (opcional).
