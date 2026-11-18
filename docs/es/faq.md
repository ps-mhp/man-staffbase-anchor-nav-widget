# Preguntas frecuentes

## El widget no muestra nada.

Aún no hay ninguna entrada con texto de enlace. Abre el cuadro de diálogo en Studio y, en la
ventana **Editar enlaces**, crea las entradas, aplícalas y guárdalas. Un
widget vacío no muestra nada, ni siquiera un recuadro vacío ni un título.

## Falta una entrada en la lista.

Le falta el texto del enlace. Ahora ya no es posible aplicar un enlace sin texto de enlace:
la ventana muestra el mensaje «Enlace 2: falta el texto del enlace» y lo marca en la
lista. Los bloques más antiguos aún pueden contener este tipo de entradas; aparecen en la ventana
en la lista como «Sin texto de enlace».

## ¿Al abrir la ventana se modifica un bloque antiguo?

No. Los bloques más antiguos siguen conteniendo títulos y enlaces en los campos `heading` y
`links`. La ventana los recoge al abrirse; mientras no modifiques nada,
no se aplicará ningún cambio y el bloque permanecerá tal y como está. Solo
al hacer clic en **Aplicar** se escriben los títulos y enlaces en el nuevo campo `anchor-nav-config`, con
el mismo resultado en la página.

## Al hacer clic no se produce el salto.

El título con ese texto exacto no existe en la página. La comparación
se realiza con el destino o —si el destino está vacío— con el texto del enlace. Basta con un error tipográfico,
una diferencia en mayúsculas y minúsculas o un título que haya sido renombrado
basta. Copia el texto del encabezado y pégalo en el destino
.

Los encabezados de una navegación por enlaces nunca cuentan como destino, ni siquiera el
título de un segundo widget en la misma página.

## En las páginas traducidas, al hacer clic no se produce el salto.

Los encabezados de la página se traducen, pero el texto del enlace y el destino no. En el
otro idioma, la entrada ya no encuentra su encabezado, y la
lista sigue mostrando los textos de los enlaces en el idioma en el que se crearon.

## ¿Cuándo cambia la marca roja?

Al desplazarse: se sitúa en la sección cuyo título haya alcanzado en último lugar el
cuarto superior de la pantalla. En la parte inferior de la página, donde las últimas
secciones ya no se desplazan tanto hacia arriba, se sitúa en la última visible.
Tras un clic, permanece en la entrada seleccionada hasta que vuelvas a desplazarte.
Antes del primer apartado, se sitúa en la primera entrada. Si alguien abre la
página a través de un enlace con marca de salto, como `…#equipamiento`, se sitúa en
esa entrada.

Las entradas con una dirección (`/…`, `https://…`) no tienen ningún apartado en la
página; el marcador no llega a ellas al desplazarse.

## ¿Se puede cambiar el orden?

Sí. Arrastra el controlador de la ventana hacia la izquierda, o selecciona el controlador, pulsa Intro
para seleccionarlo, utilice las teclas de flecha para moverlo y pulsa Intro para soltarlo. O bien, utiliza las
flechas **Enlace hacia arriba** / **Enlace hacia abajo** situadas encima del formulario. La lista no tiene
por qué seguir el orden de la página.

## Si dos títulos tienen el mismo nombre, ¿a cuál lleva el enlace?

Al primero que aparezca en la página. Si quieres que lleve al segundo, la única solución es
dar nombres diferentes a los
dar nombres diferentes a los encabezados.

## ¿Puede una entrada enlazar a otra página?

Sí. Introduce como destino una dirección que comience por `/`, `http://` o `https://`.
Al hacer clic, se abrirá como cualquier otro enlace.
