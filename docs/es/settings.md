# Configuración

## Título

El encabezado que aparece sobre la lista, por ejemplo, «De un vistazo». Si lo dejas en blanco
, se oculta; la lista permanece.

El título se traduce junto con la página.

## Enlaces

Las entradas de la lista. En Studio, hay un editor que se abre mediante
**Editar enlaces**. Los enlaces aparecen a la izquierda y los campos de la
entrada seleccionada a la derecha; haz clic en la lista para seleccionar otra.
**Añadir enlace** crea y selecciona uno nuevo, y la papelera lo elimina. Para
cambiar el orden, utiliza el controlador de la izquierda: arrástralo o
selecciónalo, pulsa Intro para tomarlo, muévelo con las teclas de flecha hasta
la nueva posición y pulsa Intro para soltarlo. **Aplicar** guarda la lista en
el cuadro de diálogo; a continuación, guarda como de costumbre.

La forma más rápida es mediante **Añadir elemento a la página**, en la parte superior del editor:
la selección muestra los encabezados y los widgets de la página guardada
(▣ = widget) y se puede filtrar escribiendo. Al hacer clic se crea un enlace
con su nombre; el destino es el
ID del bloque (`#…`). Después puedes modificar el texto del enlace. Las nuevas secciones
solo aparecerán en la selección una vez que se haya guardado la página.

Cada enlace tiene dos campos:

- **Texto del enlace**: lo que aparece en la lista. Obligatorio: una entrada sin texto de enlace
  no se muestra.
- **Destino**: adónde lleva la entrada.
  - **Vacío:** al título de la página que tiene el mismo nombre que el texto del enlace.
  - **Texto de un título:** a ese título. De este modo, la entrada puede tener un nombre más corto
    que la sección, por ejemplo, «Equipamiento» en lugar de «Equipamiento en detalle».
  - **Un ID de bloque** como `#a447d858-1bba-4a49-b620-b49c60dd67a7`: a este
    bloque de la página. De este modo, se establece la selección en la parte superior. El enlace sigue siendo válido incluso después
    de cambiar el nombre del título.
  - **Una dirección** que comience por `/`, `http://`, `https://` o `mailto:`
    : un enlace normal que el navegador sigue.

A la hora de comparar con el título, lo que cuenta es el texto, no el nivel: de H1 a H6
son destinos equivalentes. Los espacios múltiples no influyen,
pero sí se distingue entre mayúsculas y minúsculas. Si hay varios títulos con el mismo texto,
la entrada salta al primero.

Si en algún momento no aparece el editor, aparecerá un campo de texto con la lista en formato
JSON, por ejemplo:

```json
[{ "label": "Equipamiento", "target": "Equipamiento en detalle" }]
```

`label` es el texto del enlace, `target` es el destino (opcional).
