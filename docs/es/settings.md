# Configuración

## Aplicar encabezados

El widget no lee los encabezados de la página publicada, sino
mientras se edita en Studio: en cuanto se abre el cuadro de diálogo de configuración del widget,
este aplica los encabezados de la página. En la parte inferior del cuadro de diálogo se indica cuántos
se han importado, por ejemplo, «Se han importado 22 encabezados de la página (H1: 12 · H2: 10)».

A continuación, guarda los cambios. Solo entonces la página publicada reconocerá la lista.

Si cambian los encabezados de la página, vuelve a abrir el cuadro de diálogo y guarda los cambios;
de lo contrario, el widget mostrará la información antigua. Los encabezados que ya no existan
se eliminarán automáticamente.

## Nivel de encabezado

Nivel que muestra la lista: de **H1** a **H6**. El valor predeterminado es **H2**.

Se trata de un único nivel, no de «a partir de este nivel». Si se selecciona H2, se mostrarán los H2
de la página; los H3 que estén por debajo quedarán excluidos.

Si el widget no muestra nada, significa que la página no utiliza ese nivel. En ese caso, comprueba en el texto
qué nivel tienen realmente las secciones.

## Título

El título que aparece encima de la lista, por ejemplo, «De un vistazo». Si se deja en blanco,
se oculta; la lista permanece.

El título se traduce junto con la página. Las entradas de la lista no necesitan
eso: son los encabezados de la página y ya llevan su traducción
de todos modos.

## Solo encabezados de bloques «Title» y «Text»

Activado de forma predeterminada. En ese caso, la lista solo cuenta los encabezados que se encuentran en un
bloque **Title** o **Text**, es decir, las secciones que tú mismo
has escrito.

Si está desactivada, se cuentan todos los encabezados de ese nivel que aparecen en la página. Esto
incluye también aquellos que otros widgets muestran en su propia presentación: los
títulos de una lista de noticias, por ejemplo, o las etiquetas de un portafolio.
Estos no forman parte de la página, y un enlace a ellos lleva a un
lugar que el lector no espera.

En las páginas sin Content Designer, el conmutador no funciona. Allí no existen los
elementos en función de los cuales distingue, y la lista muestra, como hasta ahora,
todos los encabezados de ese nivel; un widget vacío no tendría sentido en ese contexto.
