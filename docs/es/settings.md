# Configuración

## Título

El encabezado que aparece sobre la lista, por ejemplo, «De un vistazo». Si lo dejas en blanco
, se oculta; la lista permanece.

El título se traduce junto con la página.

## Enlaces

Las entradas de la lista. En Studio, en este lugar hay un editor con una
línea por enlace. Se abre con **Editar enlaces**; con **Añadir enlace**
se añade una línea, y con la papelera se elimina. El
orden se cambia con el controlador de la izquierda: arrastra o selecciona el controlador y
muévelo con las teclas de flecha arriba y abajo. **Aplicar** guarda la
lista en el cuadro de diálogo; a continuación, guarda como de costumbre.

La forma más rápida es **Añadir elemento de la página**, en la parte superior del editor:
la selección muestra los títulos y widgets de la página guardada
(▣ = widget). Con un clic se crea un enlace con su nombre; el destino es el
ID de bloque (`#…`). Después puedes cambiar el texto del enlace. Las secciones nuevas
solo aparecen en la selección cuando la página se ha guardado.

Cada línea tiene dos campos:

- **Texto del enlace**: lo que aparece en la lista. Obligatorio: una entrada sin texto de enlace
  no se muestra.
- **Destino**: a dónde lleva la entrada.
  - **Vacío:** al título de la página que tiene el mismo nombre que el texto del enlace.
  - **Texto de un título:** a ese título. De este modo, la entrada puede tener un nombre más corto
    que el apartado, por ejemplo, «Equipamiento» en lugar de «Equipamiento en detalle».
  - **Un ID de bloque** como `#a447d858-1bba-4a49-b620-b49c60dd67a7`: a ese
    bloque de la página. Así lo establece la selección de arriba. El enlace sigue
    siendo válido aunque se renombre el título.
  - **Una dirección** que comience por `/`, `http://`, `https://` o `mailto:`
    : un enlace normal que sigue el navegador.

A la hora de comparar con el título, lo que cuenta es el texto, no el nivel —de H1 a H6
son destinos equivalentes. Los espacios múltiples no influyen,
pero sí se distingue entre mayúsculas y minúsculas. Si hay varios encabezados con el mismo texto,
la entrada salta al primero.

Si en algún momento no aparece el editor, habrá un campo de texto con la lista en formato
JSON, por ejemplo:

```json
[{ "label": "Equipamiento", "target": "Equipamiento en detalle" }]
```

`label` es el texto del enlace, `target` es el destino (opcional).
