# Configuración

Todo se gestiona en la ventana **Editar enlaces**. Se abre automáticamente en Studio
en cuanto accedes al cuadro de diálogo de configuración del bloque; para cerrarla,
haz clic en el botón **Editar enlaces**. En la parte superior aparecen **Aplicar**,
**Cancelar**, **Deshacer/Rehacer**, la ayuda y el selector **Editor ·
Ordenador · Tableta · Móvil**. **Aplicar** introduce el título y los enlaces en el
cuadro de diálogo; a continuación, guarda como de costumbre.

La ventana tiene tres columnas: a la izquierda, los **enlaces**; en el centro, el
enlace seleccionado; y a la derecha, la **navegación** con el título y la **estructura de la página**.

Los elementos de la página se actualizan en tiempo real desde el editor —incluidos los encabezados que
aún no se han guardado— y se adaptan a cada cambio.

## Título

A la derecha, debajo de **Navegación**, en la parte superior: el encabezado que aparece sobre la lista, por ejemplo, «En
esta página». Si se deja en blanco, se oculta; la lista permanece.

El título se traduce junto con la página.

## Enlaces

La columna de la izquierda muestra todos los enlaces en el orden de la navegación. Cada línea
indica el texto del enlace y, debajo, a dónde lleva: por ejemplo, «Título
«Fechas»», «Widget: Galería de archivos», «#contacto» o «Vacío — título del mismo nombre
». Al hacer clic se selecciona un enlace para editarlo.

- **Nuevo enlace** abre un menú desplegable: en la parte superior, **Enlace vacío** (crea un
  enlace vacío y coloca el cursor en el texto del enlace); debajo, la búsqueda
  entre los títulos y widgets de la página (véase más abajo).
- Un **«!»** al final de la línea significa que el destino ya no existe
  en la página (encabezado eliminado o renombrado). En la página, el enlace
  queda oculto hasta que selecciones un nuevo destino o lo elimines; el formulario
  ofrece la opción **Eliminar enlace** para ello.
- Para cambiar el orden, utiliza el controlador de la izquierda: arrastra, o selecciona el controlador,
  fíjalo con Intro, muévelo a la nueva posición con las teclas de flecha y
  suéltalo con Intro. O bien utiliza las flechas **Enlace hacia arriba** / **Enlace hacia abajo**
  situadas encima del formulario.
- Las opciones **Duplicar enlace** y **Eliminar enlace** también se encuentran allí.

### Texto del enlace y destino

En el centro, encima del formulario, aparece «Enlace 2 de 5» y el tipo de destino
(«Destino de salto en esta página» o «Referencia a una dirección»).

- **Texto del enlace**: lo que aparece en la lista. Obligatorio: sin texto de enlace,
  no se puede guardar la ventana; el estado que aparece arriba indicará entonces el enlace en cuestión.
- **Destino**: a dónde lleva la entrada.
  - **Vacío:** al título de la página que tiene el mismo nombre que el
    texto del enlace. El campo lo muestra como marcador de posición.
  - **Texto de un título:** a ese título. De este modo, la entrada
    puede tener un nombre más breve que el apartado, por ejemplo, «Equipamiento» en lugar de «Equipamiento en
    detalle».
  - **Un ID de bloque** como `#a447d858-1bba-4a49-b620-b49c60dd67a7`: a este
    bloque de la página. Así lo determinan la selección y la estructura de la página. El enlace
    sigue siendo válido incluso después de cambiar el nombre del encabezado.
  - **Una dirección** que comience por `/`, `http://`, `https://` o `mailto:`
    : un enlace habitual que sigue el navegador.

A la hora de comparar con el título, lo que cuenta es el texto, no el nivel: de H1 a H6
son destinos equivalentes. Los espacios múltiples no influyen,
pero sí se distingue entre mayúsculas y minúsculas. Si hay varios títulos con el mismo texto,
la entrada salta al primero.

### Crear un enlace a un título o a un widget de la página

Hay dos formas de hacerlo; ambas crean un enlace con el nombre del elemento, cuyo destino es
su ID de bloque (`#…`); después puedes modificar el texto del enlace:

- **Nuevo enlace** → **Buscar encabezado o widget**: la lista muestra los
  encabezados (con su nivel, por ejemplo, «H3 en “Fechas”») y los widgets de la
  página con su nombre y característica (por ejemplo, «Principales competidores · Cuadro USP») y
  se puede filtrar al escribir, incluso por el tipo de widget.
- **Estructura de la página** a la derecha: el esquema de la página como un árbol sangrado.
  Arrastra un elemento a la lista de la izquierda —se colocará donde lo sueltes—
  o haz clic en él, y se añadirá al final.

Lo que ya está enlazado lleva una marca de verificación o la indicación «ya enlazado»; un segundo
intento selecciona el enlace existente, en lugar de duplicarlo.

## Cuando cambia la página

Incluso con la ventana cerrada, el widget del Studio supervisa sus destinos:

- **Título enlazado eliminado:** te pregunta si también quieres eliminar el enlace de la
  navegación. Si lo mantienes, aparecerá un
  «!» en la ventana y no aparecerá en la página.
- **Título enlazado renombrado:** En cuanto el cursor
  sale del título, te pregunta si quieres actualizar el enlace. El nuevo texto del enlace
  aparece prellenado con el texto del título y se puede modificar directamente.

La respuesta modifica el bloque como cualquier otra edición: se puede deshacer y
se aplica al guardar la página.

## Vista previa

**Ordenador**, **tableta** y **móvil** muestran, en lugar del formulario, la
navegación adaptada al ancho del dispositivo, tal y como aparece en la página; los enlaces sin texto
o sin destino en la página no aparecen allí, al igual que en la página. En **móvil**, se pliega en un botón.
La lista y el título siguen siendo accesibles junto a él. En la vista previa
no se produce ningún salto y la página del Studio permanece inalterada.

## Formato guardado

El título y los enlaces se incluyen juntos en el atributo `anchor-nav-config`. Los bloques más antiguos
aún los contienen en los campos `heading` y `links`; la página lee
el nuevo campo si hay datos, y en caso contrario el antiguo, por lo que parecen no haber cambiado.
Al abrirla por primera vez, la ventana toma los valores antiguos; solo al hacer clic en **Aplicar**
se guardan en el nuevo campo. Los campos antiguos están ocultos en el cuadro de diálogo.

Si la ventana no aparece, aparecerá un campo de texto con el contenido sin formato,
por ejemplo:

```json
{ "heading": "De un vistazo», «links»: [{ «id»: «a», «label»: «Equipamiento», «target»: «Equipamiento en detalle» }] }
```

`label` es el texto del enlace, `target` el destino (opcional).
