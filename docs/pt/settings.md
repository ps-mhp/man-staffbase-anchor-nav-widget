# Configurações

Tudo é gerido na janela **Editar links**. Esta abre-se automaticamente no Studio
assim que acederes à caixa de diálogo de configurações do bloco; para a fechar,
basta clicar no botão **Editar links**. Na parte superior encontram-se **Aplicar**,
**Cancelar**, **Anular/Repetir**, a Ajuda e o botão de alternância **Editor ·
Desktop · Tablet · Móvel**. **Aplicar** insere o título e os links na
caixa de diálogo; depois, guarda como habitualmente.

A janela tem três colunas: à esquerda, os **Links**; no centro, o
link selecionado; à direita, a **Navegação** com o título e a **Estrutura da página**.

Os elementos da página são atualizados em tempo real a partir do editor – incluindo os títulos que
ainda não foram guardados – e acompanham todas as alterações.

## Título

À direita, em **Navegação**, na parte superior: o título acima da lista, por exemplo, «Nesta
página». Se deixares em branco, ela fica oculta; a lista permanece.

O título é traduzido juntamente com a página.

## Links

A coluna da esquerda mostra todos os links pela ordem da navegação. Cada linha
indica o texto do link e, abaixo, para onde este remete – por exemplo, «Título
«Agenda»», «Widget: Galeria de ficheiros», «#contacto» ou «Vazio – título com o mesmo nome
». Um clique seleciona um link para edição.

- **Novo link** abre um menu: no topo, **Link vazio** (cria um
  link vazio e coloca o cursor no texto do link); abaixo, a pesquisa
  pelos títulos e widgets da página (ver abaixo).
- Um **«!»** no final da linha significa que o destino já não existe
  na página (título eliminado ou renomeado). Na página, o link
  fica oculto até selecionares um novo destino ou o eliminares – o formulário
  oferece a opção **Remover link** para esse efeito.
- Podes alterar a ordem utilizando o manípulo à esquerda: arrasta ou seleciona o manípulo,
  confirma com Enter, move-o para a nova posição com as setas e
  confirma com Enter. Ou utiliza as setas **Link para cima** / **Link para baixo**
  acima do formulário.
- As opções **Duplicar link** e **Apagar link** também se encontram aí.

### Texto do link e destino

No centro, acima do formulário, aparece «Link 2 de 5» e o tipo de destino
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
    bloco da página. É assim que a seleção e a estrutura da página o definem. O link
    permanece válido mesmo após a renomeação do título.
  - **Um endereço** que comece por `/`, `http://`, `https://` ou `mailto:`
    : uma referência normal que o navegador segue.

Na comparação com o título, o que conta é o texto, não o nível – H1 a H6
são todos destinos válidos. Os espaços múltiplos não têm importância,
mas as maiúsculas e minúsculas sim. Se houver vários títulos com o mesmo texto,
a entrada salta para o primeiro.

### Criar um link para um título ou widget da página

Existem duas formas, ambas criam um link com o nome do elemento; o destino é
o seu ID de bloco (`#…`); podes alterar o texto do link posteriormente:

- **Novo link** → **Procurar título ou widget**: a lista mostra os
  títulos (com o nível, por exemplo, «H3 em “Agenda”») e os widgets da
  página com o seu nome e característica (por exemplo, «Principais concorrentes · Caixa USP») e
  pode ser filtrada ao digitar – inclusive pelo tipo de widget.
- **Estrutura da página** à direita: a estrutura da página apresentada como uma árvore recuada.
  Arraste um elemento para a lista à esquerda – ele fica onde o largares –
  ou clica nele, e ele vai para o final.

O que já está ligado tem uma marca de verificação ou «já ligado»; uma segunda
tentativa seleciona o link existente, em vez de o duplicar.

## Quando a página muda

Mesmo com a janela fechada, o widget no Studio mantém-se atento aos seus destinos:

- **Título com link eliminado:** pergunta se o link também deve ser
  navegação. Se o mantiveres, ele exibe um
  «!» na janela e desaparece da página.
- **Título com link renomeado:** Assim que o cursor sair do título,
  pergunta se o link deve ser atualizado. O novo texto do link
  é preenchido automaticamente com o texto do título e pode ser alterado diretamente.

A resposta altera o bloco como qualquer outra edição: é possível reverter a ação, que
entra em vigor ao guardar a página.

## Pré-visualização

**Desktop**, **Tablet** e **Móvel** mostram, em vez do formulário, a
navegação ajustada à largura do dispositivo, tal como a página a apresenta; as ligações sem texto de ligação
ou sem destino na página não aparecem ali, tal como na página. No **telemóvel**, esta fica reduzida a um botão
. A lista e o título permanecem operacionais ao lado. Na pré-visualização
, nada salta e a página do Studio permanece inalterada.

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
