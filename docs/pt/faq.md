# Perguntas frequentes

## O widget não mostra nada.

Ainda não existe nenhuma entrada com texto de ligação. No Studio, abra a caixa de diálogo e, na
janela **Editar ligações**, crie entradas, aplique as alterações e guarde. Um
widget vazio não apresenta nada — nem mesmo uma caixa vazia nem um título.

## Falta uma entrada na lista.

Falta-lhe o texto do link. Agora, já não é possível aplicar um link sem texto de link:
a janela apresenta a mensagem «Link 2: Falta o texto do link» e destaca-o na
lista. Os blocos mais antigos ainda podem conter essas entradas; aparecem na janela
na lista como «Sem texto do link».

## Abrir a janela altera um bloco mais antigo?

Não. Os blocos mais antigos ainda contêm títulos e links nos campos `heading` e
`links`. A janela importa-os ao abrir; enquanto não alterares nada,
não é possível importar nada e o bloco permanece tal como está. Só
ao clicar em **Aplicar** é que os títulos e links são gravados no novo campo `anchor-nav-config` – com
o mesmo resultado na página.

## Um clique não funciona.

O título com exatamente este texto não existe na página. A comparação
é feita com o destino ou — se o destino estiver vazio — com o texto do link. Basta um erro ortográfico,
uma diferença nas maiúsculas e minúsculas ou um título que tenha sido renomeado
basta. Copie o texto do título e insira-o no destino
.

Os títulos numa navegação por âncora nunca contam como destino — nem mesmo o
título de um segundo widget na mesma página.

## Falta um link na página.

O seu destino já não existe na página: o título ou o widget
foi eliminado ou — no caso de ligações sobre o texto — o título tem agora um nome diferente.
Na janela **Editar ligações**, a ligação apresenta um «!». Selecione um novo destino
ou remova a ligação.

## Faltam links nas páginas traduzidas.

Os títulos da página são traduzidos, mas o texto do link e o destino não. Um
link sobre o texto já não encontra o seu título na outra língua
e é ocultado nessa página. Os links para um ID de bloco (do
mapa da página) não estão associados ao texto do título.

## Quando é que o marcador vermelho muda de posição?

Ao percorrer a página: fica na secção cujo título foi o último a atingir o
quarto superior do ecrã. Na parte inferior da página, onde as últimas
secções já não aparecem tão acima, fica na última secção visível.
Após um clique, permanece na entrada selecionada até voltares a percorrer a página.
Antes da primeira secção, fica na primeira entrada. Se alguém abrir a
página através de uma ligação com marcador de salto, por exemplo `…#equipamento`, fica
nesta entrada.

As entradas com um endereço (`/…`, `https://…`) não têm qualquer secção na
página; o marcador não chega até elas ao percorrer a página.

## É possível alterar a ordem?

Sim. Na janela, arrasta a alça à esquerda ou seleciona a alça, pressiona Enter
para selecionar, utiliza as setas para deslocar e pressiona Enter para soltar. Ou através das
setas **Link para cima** / **Link para baixo** acima do formulário. A lista não tem
de seguir a ordem da página.

## Se dois títulos tiverem o mesmo nome — para onde salta a ligação?

Para o primeiro na página. Se quiser que salte para o segundo, a única solução é
dar nomes diferentes aos títulos.

## Uma entrada pode remeter para outra página?

Sim. Introduza como destino um endereço que comece por `/`, `http://` ou `https://`.
Ao clicar, o utilizador será redirecionado tal como em qualquer outro link.
