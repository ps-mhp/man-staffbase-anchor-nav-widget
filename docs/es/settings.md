# Configuración

Todo se gestiona en la ventana **Editar enlaces**. Se abre automáticamente en Studio
en cuanto accedes al cuadro de diálogo de configuración del bloque; para cerrarla,
haz clic en el botón **Editar enlaces**. En la parte superior aparecen **Aplicar**,
**Cancelar**, **Deshacer/Rehacer**, la ayuda y el selector **Editor ·
Ordenador · Tableta · Móvil**. **Aplicar** introduce el título y los enlaces en el
cuadro de diálogo; a continuación, guarda como de costumbre.

La ventana tiene tres columnas: a la izquierda, los **enlaces**; en el centro, el enlace seleccionado
—o, tras hacer clic en **Nuevo enlace**, el **mapa del sitio**—; y a la derecha, la **navegación**
con lo que se aplica a toda la navegación: título y navegación en
el borde de la pantalla.

Los elementos de la página se muestran en tiempo real desde el editor —incluidos los encabezados que
aún no se han guardado— y se actualizan con cada cambio.

## Título

A la derecha, en **Navegación**: el encabezado situado encima de la lista, por ejemplo, «En
esta página». Si se deja en blanco, se oculta; la lista permanece.

El título se traduce junto con la página.

## Navegación en el borde de la pantalla

A la derecha, debajo de **Navegación**, está activada por defecto. En ordenadores de sobremesa y tabletas,
al desplazarse por primera vez, aparece una pequeña barra de navegación a la derecha del borde de la pantalla: una
línea por sección, la actual en rojo. Al pasar el cursor por una línea, aparece
a la izquierda el texto del enlace; al hacer clic, se salta a esa sección, y las flechas de arriba y
de abajo permiten saltar a la sección anterior o siguiente, respectivamente. En el teléfono, en el
estudio y en la vista previa de la ventana no aparece. Si hay varias
navegaciones por anclajes en una página, solo la primera las muestra.

## Enlaces

La columna de la izquierda muestra todos los enlaces en el orden de la navegación. Cada línea
indica el texto del enlace y, debajo, a dónde lleva: por ejemplo, «Título
«Citas»», «Widget: Galería de archivos», «#contacto» o «Vacío — título del mismo nombre
». Al hacer clic se selecciona un enlace para editarlo.

- **Nuevo enlace** abre en el centro el **mapa del sitio** (véase más abajo). Si no hay
  enlaces, la ventana se abre directamente en él.
- Un **«!»** al final de la línea significa que el destino ya no existe
  en la página (el título se ha eliminado o renombrado). En la página, el enlace
  queda oculto hasta que selecciones un nuevo destino o lo elimines; para ello, el formulario
  ofrece la opción **Eliminar enlace**.
- Para cambiar el orden, utiliza el controlador de la izquierda: arrástralo o selecciónalo,
  fíjalo con Intro, muévelo a la nueva posición con las teclas de flecha y
  suéltalo con Intro. O bien utiliza las flechas **Enlace arriba** / **Enlace abajo**
  situadas encima del formulario.
- Las opciones **Duplicar enlace** y **Eliminar enlace** también se encuentran ahí.

### Texto del enlace y destino

En el centro, encima del formulario, aparece «Enlace 2 de 5» y el tipo de destino
(«Destino de salto en esta página» o «Enlace a una dirección»).

- **Texto del enlace**: lo que aparece en la lista. Obligatorio: sin texto de enlace,
  no se puede guardar la ventana; el estado que aparece arriba indicará entonces el enlace en cuestión.
- **Destino**: a dónde lleva la entrada.
  - **Vacío:** al título de la página que tiene el mismo nombre que el
    texto del enlace. El campo lo muestra como marcador de posición.
  - **Texto de un título:** a ese título. De este modo, la entrada
    puede tener un nombre más breve que el apartado, por ejemplo, «Equipamiento» en lugar de «Equipamiento en
    detalle».
  - **Un ID de bloque** como `#a447d858-1bba-4a49-b620-b49c60dd67a7`: a este
    bloque de la página. Así lo establece el mapa del sitio. El enlace
    sigue siendo válido incluso después de renombrar el encabezado.
  - **Una dirección** que comience por `/`, `http://`, `https://` o `mailto:`
    : un enlace habitual que sigue el navegador.

A la hora de comparar con el título, lo que cuenta es el texto, no el nivel: de H1 a H6
son destinos equivalentes. Los espacios múltiples no influyen,
pero sí se distingue entre mayúsculas y minúsculas. Si hay varios títulos con el mismo texto,
la entrada salta al primero.

### Mapa de la página

El mapa de la página muestra los encabezados y los widgets de la página como recuadros,
ordenados tal y como aparecen en el borrador: secciones una debajo de otra, columnas una al lado de otra según
su anchura. Cada recuadro indica el tipo (por ejemplo, «H2» o «Widget · Cuadro USP»)
y el texto o el widget. Los recuadros con enlaces aparecen en azul.

- **Al hacer clic en un recuadro** se crea un enlace con su texto (el destino es el
  ID del bloque `#…`) y abre el texto del enlace en el recuadro para que puedas modificarlo; pulsa Intro
  para confirmar. Al hacer clic en un recuadro que ya tiene un enlace, se abre su
  texto de enlace.
- El símbolo situado en la esquina superior derecha del recuadro azul elimina el enlace.
- Los recuadros también se pueden arrastrar a la lista de la izquierda; el enlace se coloca allí
  donde sueltes el ratón.
- **Enlace vacío** crea un enlace para una dirección o un destino propio;
  **Listo** vuelve al enlace seleccionado.

## Cuando cambia la página

Incluso con la ventana cerrada, el widget de Studio supervisa sus destinos:

- **Título enlazado eliminado:** te pregunta si también quieres eliminar el enlace de la
  navegación. Si lo mantienes, aparecerá un
  «!» en la ventana y desaparecerá de la página.
- **Título enlazado renombrado:** en cuanto el cursor
  sale del título, te pregunta si quieres actualizar el enlace. El nuevo texto del enlace
  aparece predeterminado con el texto del título y se puede modificar directamente.

La respuesta modifica el bloque como cualquier otra edición: se puede deshacer, y
se aplica al guardar la página.

## Vista previa

**Ordenador**, **tableta** y **móvil** muestran, en lugar del formulario, la
navegación adaptada al ancho del dispositivo, tal y como aparece en la página; los enlaces sin texto
o sin destino en la página no aparecen allí, al igual que en la página. En **móvil**, se pliega en un botón.
La lista y el título siguen siendo accesibles junto a él. En la vista previa
no se produce ningún salto y la página del estudio permanece inalterada.

## Formato guardado

El título y los enlaces se incluyen juntos en el atributo `anchor-nav-config`. Los bloques más antiguos
aún los contienen en los campos `heading` y `links`; la página lee
el nuevo campo si hay datos, y en caso contrario el antiguo, por lo que parecen no haber cambiado.
Al abrirla por primera vez, la ventana toma los valores antiguos; solo al hacer clic en **Aplicar**
se guardan en el nuevo campo. Los campos antiguos están ocultos en el cuadro de diálogo.

Si la ventana no aparece, aparecerá un campo de texto con el contenido sin formatear,
por ejemplo:

```json
{ "heading": "De un vistazo», «links»: [{ «id»: «a», «label»: «Equipamiento», «target»: «Equipamiento en detalle» }] }
```

`label` es el texto del enlace, `target` el destino (opcional).
