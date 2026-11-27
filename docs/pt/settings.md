# Configurações

Tudo é gerido na janela **Editar links**. Esta abre-se automaticamente no Studio
assim que acederes à caixa de diálogo de configurações do bloco; para a fechar,
basta clicar no botão **Editar links**. Na parte superior encontram-se **Aplicar**,
**Cancelar**, **Anular/Repetir**, a Ajuda e o botão de alternância **Editor ·
Desktop · Tablet · Móvel**. **Aplicar** insere o título e os links na
caixa de diálogo; depois, guarda como habitualmente.

A janela tem três colunas: à esquerda, os **Links**; no centro, o link selecionado
– ou, após clicar em **Novo link**, o **Mapa do site**; à direita, a **Navegação**
com o que se aplica a toda a navegação: título e navegação na
margem do ecrã.

Os elementos da página vêm em tempo real do Editor – incluindo os títulos que
ainda não foram guardados – e acompanham todas as alterações.

## Título

À direita, em **Navegação**: o título acima da lista, por exemplo, «Nesta
página». Se deixares em branco, ela fica oculta; a lista permanece.

O título é traduzido juntamente com a página.

## Navegação na margem do ecrã

À direita, em **Navegação**, a predefinição está ativada. No computador e no tablet,
ao percorrer a página pela primeira vez, aparece uma pequena barra de navegação à direita, na margem do ecrã: uma
traço por secção, sendo a atual a vermelho. Ao passar o cursor sobre um traço, aparece
à esquerda o texto do link; um clique leva-o para lá, e as setas acima e
abaixo levam à secção anterior ou seguinte, respetivamente. No telemóvel, no
estúdio e na pré-visualização da janela, esta não aparece. Se houver várias
navegações por âncoras numa página, apenas a primeira as exibe.

## Links

A coluna da esquerda mostra todos os links pela ordem da navegação. Cada linha
indica o texto do link e, abaixo, para onde este remete – por exemplo, «Título
«Agenda»», «Widget: Galeria de ficheiros», «#contacto» ou «Vazio – título com o mesmo nome
». Um clique seleciona um link para edição.

- **Novo link** abre o **mapa do site** no centro (ver abaixo). Sem
  links, a janela começa diretamente com ele.
- Um **«!»** no final da linha significa que o destino já não existe
  na página (título eliminado ou renomeado). Na página, o link
  fica oculto até selecionares um novo destino ou o removeres – o formulário
  oferece a opção **Remover link** para esse efeito.
- Pode alterar a ordem utilizando o controlador à esquerda: arraste-o ou selecione-o,
  confirme com Enter, desloque-o para a nova posição com as setas e
  confirme com Enter. Ou utilize as setas **Link para cima** / **Link para baixo**
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
    bloco da página. É assim que o mapa da página o define. O link
    permanece válido mesmo após a redenominação do título.
  - **Um endereço** que comece por `/`, `http://`, `https://` ou `mailto:`
    : uma referência normal que o navegador segue.

Na comparação com o título, o que conta é o texto, não o nível – H1 a H6
são todos destinos equivalentes. Os espaços múltiplos não têm importância,
mas as maiúsculas e minúsculas sim. Se houver vários títulos com o mesmo texto,
a entrada salta para o primeiro.

### Mapa da página

O mapa da página mostra os títulos e os widgets da página como caixas –
organizadas tal como no esboço: secções umas abaixo das outras, colunas lado a lado na
sua largura. Cada caixa indica o tipo (por exemplo, «H2» ou «Widget · Caixa USP»)
e o texto ou o widget. As caixas com hiperligações aparecem a azul.

- **Ao clicar numa caixa**, é criada uma hiperligação com o texto da mesma (o destino é o
  ID do bloco `#…`) e abre o texto do link no bloco para edição; a tecla Enter
  confirma. Clicar num bloco que já tenha um link abre o seu
  texto de link.
- O ícone no canto superior direito do bloco azul remove o link.
- As caixas também podem ser arrastadas para a lista à esquerda – o link fica onde
  soltares a caixa.
- **Link vazio** cria um link para um endereço ou um destino personalizado,
  **Concluído** regressa ao link selecionado.

## Quando a página muda

Mesmo com a janela fechada, o widget no Studio mantém-se atento aos seus destinos:

- **Título com link eliminado:** pergunta se o link também deve ser
  removido da navegação. Se o mantiveres, ele exibe um
  «!» na janela e desaparece da página.
- **Título com link renomeado:** Assim que o cursor sair do título,
  pergunta se o link deve ser atualizado. O novo texto do link
  é preenchido automaticamente com o texto do título e pode ser alterado diretamente.

A resposta altera o bloco como qualquer outra edição: é possível reverter, e a alteração
torna-se efetiva ao guardar a página.

## Pré-visualização

**Desktop**, **Tablet** e **Móvel** mostram, em vez do formulário, a
navegação ajustada à largura do dispositivo, tal como a página a apresenta; as ligações sem texto de ligação
ou sem destino na página não aparecem ali, tal como na página. No **telemóvel**, a navegação está reduzida a um botão
. A lista e o título permanecem acessíveis ao lado. Na pré-visualização
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
