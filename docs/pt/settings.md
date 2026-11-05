# Configurações

## Importar títulos

O widget não lê os títulos na página publicada, mas sim
durante a edição no Studio: assim que a caixa de diálogo de configurações do widget se abrir,
este importa os títulos da página. Na parte inferior da caixa de diálogo, é indicado quantos
foram importados, por exemplo, «22 títulos da página importados (H1: 12 · H2: 10)».

Em seguida, guarde. Só então a página publicada terá acesso à lista.

Se os títulos da página forem alterados, abra novamente a caixa de diálogo e guarde —
caso contrário, o widget exibirá a versão antiga. Os títulos que já não existem
são automaticamente removidos.

## Nível dos títulos

Qual o nível que a lista apresenta: **H1** a **H6**. O valor predefinido é **H2**.

Trata-se de exatamente um nível, não «a partir deste nível». Quem selecionar H2 obtém os H2
da página — os H3 abaixo ficam de fora.

Se o widget não mostrar nada, significa que a página não utiliza esse nível. Nesse caso, verifique no texto
qual o nível que as secções têm efetivamente.

## Título

O título acima da lista, por exemplo, «Em resumo». Se deixar em branco,
este é ocultado; a lista permanece.

O título é traduzido juntamente com a página. As entradas da lista não precisam disso
— são os títulos da página e já incluem a respetiva tradução
de qualquer forma.

## Apenas títulos de blocos «Title» e «Text»

Ativado por predefinição. Nesse caso, a lista conta apenas os títulos que se encontram num
bloco **Title** ou **Text** — ou seja, as secções que o próprio
escreveu.

Quando desativada, conta-se qualquer título desse nível que conste na página. Isso
inclui também aqueles que outros widgets apresentam na sua própria visualização: os
títulos de uma lista de notícias, por exemplo, ou as legendas de um portfólio.
Estes não são secções da página, e uma referência a eles remete para um
local que o leitor não espera.

Em páginas sem o Content Designer, o botão não funciona. Nelas não existem os
elementos com base nos quais ele faz a distinção, e a lista mostra, como até agora,
todos os títulos desse nível — um widget vazio não teria sentido nesse contexto.
