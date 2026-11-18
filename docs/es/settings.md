# Configuración

Todo se gestiona en la ventana **Editar enlaces**. Se abre automáticamente en Studio
en cuanto accedes al cuadro de diálogo de configuración del bloque; para cerrarla,
haz clic en el botón **Editar enlaces**. En la parte superior aparecen **Aplicar**,
**Cancelar**, **Deshacer/Rehacer**, la ayuda y el selector **Editor ·
Ordenador · Tableta · Móvil**. **Aplicar** introduce los títulos y los enlaces en el
cuadro de diálogo; a continuación, guarda como de costumbre.

La ventana tiene tres columnas: a la izquierda, los **enlaces**; en el centro, el enlace seleccionado
y la selección de la página; a la derecha, la **navegación** con el título.

## Título

A la derecha, debajo de **Navegación**: el encabezado que aparece sobre la lista, por ejemplo, «En
esta página». Si se deja en blanco, se oculta; la lista permanece.

El título se traduce junto con la página.

## Enlaces

La columna de la izquierda muestra todos los enlaces en el orden de la navegación. Cada línea
indica el texto del enlace y, debajo, a dónde lleva: por ejemplo, «Título
«Fechas»», «Widget: Galería de archivos», «#contacto» o «Vacío — título del mismo nombre
». Al hacer clic, se selecciona un enlace para editarlo.

- **Nuevo enlace** crea un enlace vacío, lo selecciona y coloca el cursor en
  el texto del enlace.
- Para cambiar el orden, utiliza el controlador de la izquierda: arrástralo o selecciónalo,
  fíjalo con Intro, muévelo a la nueva posición con las teclas de flecha y
  súbelo con Intro. O bien utiliza las flechas **Enlace arriba** / **Enlace abajo**
  situadas encima del formulario.
- **Duplicar enlace** y **Eliminar enlace** también se encuentran ahí.

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
    bloque de la página. Así se establece la selección en la parte inferior. El enlace sigue siendo válido incluso después
    de cambiar el nombre del encabezado.
  - **Una dirección** que empiece por `/`, `http://`, `https://` o `mailto:`
    : un enlace habitual que sigue el navegador.

A la hora de comparar con el título, lo que cuenta es el texto, no el nivel: de H1 a H6
son destinos válidos por igual. Los espacios múltiples no influyen,
pero sí se distingue entre mayúsculas y minúsculas. Si hay varios títulos con el mismo nombre,
la entrada salta al primero.

### Añadir un elemento a la página

La forma más rápida es mediante **Buscar título o widget**, debajo del
formulario: la lista muestra los títulos (con su nivel, por ejemplo, «H3 bajo
«Fechas»») y los widgets de la página guardada, y se puede filtrar
pulsando. Al hacer clic se crea un nuevo enlace con su nombre; el destino
es el ID del bloque (`#…`). Después puedes modificar el texto del enlace. Lo que ya
está enlazado aparece bloqueado en la lista con la indicación «ya enlazado». Las nuevas
secciones no aparecen hasta que se guarda la página.

## Vista previa

**Ordenador**, **tableta** y **móvil** muestran, en lugar del formulario, la
navegación adaptada al ancho del dispositivo, tal y como aparece en la página; los enlaces sin texto
no aparecen allí, al igual que en la página. En **móvil**, se pliega en un botón
. La lista y el título siguen siendo accesibles junto a él. En la vista previa
nada se desplaza y la página del estudio permanece inalterada.

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
