# Cómo dejar andando el ranking en vivo

Objetivo del día de la presentación: proyectás un QR, los alumnos lo escanean con la cámara del celular,
juegan, y el podio de la pantalla se va reacomodando solo mientras terminan.

Para eso hacen falta dos cosas, y una sola vez cada una:

1. **Una dirección web del juego** que los celulares puedan abrir (el QR apunta ahí).
2. **Una planilla de Google que reciba los resultados** (el ranking en vivo lee de ahí).

Calculá 15 minutos la primera vez. Después ya queda.

---

## Antes que nada: por qué no alcanza con el link de claude.ai

El link publicado en claude.ai sirve perfecto para **jugar**: entrás, jugás, y al terminar te queda tu código.
Lo que ese link **no** puede hacer es llamar a Google desde adentro de la página — está bloqueado por seguridad.
Así que si querés el ranking automático, el juego tiene que estar subido a un hosting común.
Es gratis y son cinco minutos.

---

## Paso 1 — Subir el juego a GitHub Pages (gratis)

1. Creá una cuenta en **github.com** si no tenés.
2. Arriba a la derecha, **+ → New repository**.
   - Nombre: `polimeros`
   - Marcá **Public**
   - **Create repository**
3. En el repo vacío, **uploading an existing file**.
4. Arrastrá el archivo `polimeros-en-juego.html`.
5. **Renombralo a `index.html`** (lo podés renombrar antes de arrastrarlo, en tu carpeta).
   Es importante: así la dirección queda corta y el QR sale más simple de escanear.
6. **Commit changes**.
7. Andá a **Settings → Pages**. En *Source* elegí **Deploy from a branch**, rama **main**, carpeta **/ (root)**. **Save**.
8. Esperá uno o dos minutos y recargá esa misma pantalla: te va a mostrar la dirección, algo como

   ```
   https://TUUSUARIO.github.io/polimeros/
   ```

   Esa es **la dirección del juego**. Probala desde tu celular antes de seguir.

> Alternativa sin cuenta de GitHub: cualquier hosting estático sirve (Netlify, Cloudflare Pages, el hosting de la facultad).
> Lo único que importa es que sea una dirección `https://` que abra el archivo.

---

## Paso 2 — La planilla que recibe los resultados

1. Entrá a **sheets.new**. Se crea una planilla vacía; ponele el nombre que quieras.
2. Menú **Extensiones → Apps Script**. Se abre un editor con un archivo `Código.gs`.
3. Borrá todo lo que haya y pegá el contenido del archivo **`ranking-en-vivo.gs`** (está en esta misma carpeta).
   También lo podés copiar desde la app: Panel del Docente → ⚙ → *Copiar el script*.
4. Guardá con el ícono del disquete.
5. Botón azul **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**  ← esto es clave
   - **Implementar**
6. Google te va a pedir autorizar. Va a decir que la aplicación no está verificada: es tu propio script.
   Entrá en **Configuración avanzada → Ir a (nombre del proyecto)** y permití.
7. Copiá la **dirección de la aplicación web**. Termina en `/exec`.

**Verificación rápida:** pegá esa dirección en una pestaña del navegador.
Tiene que responder un texto que arranca con `{"ok":true`. Si te pide permisos o da error,
volvé al paso 5 y revisá que el acceso sea *Cualquier persona*.

---

## Paso 3 — Conectar la app

1. Abrí el juego desde **la dirección de GitHub Pages** (no desde el archivo local).
2. Entrá a **Panel del Docente → 📡 Ranking en vivo → ⚙**.
3. Pegá la dirección que termina en `/exec` y dejá la clave como está (`polimeros2026`).
   Si la cambiás, cambiala también en la línea `const CLAVE` del script.
4. **Guardar y conectar**. Tiene que aparecer el punto verde *En vivo*.

Esa configuración queda guardada en esa computadora. En el aula ya está lista.

---

## El día de la presentación

1. Abrí el juego en la notebook, **Panel del Docente → Ranking en vivo → 🔳 Proyectar QR**.
   Se pone a pantalla completa: QR gigante a la izquierda, podio a la derecha.
2. Los alumnos apuntan la cámara del celular al QR y entran.
3. Cada uno escribe su nombre y juega. Al terminar, su resultado sale solo a la planilla
   y en un máximo de 6 segundos aparece en el podio proyectado, con confetti y sonido.
4. El podio asigna las notas automáticamente: 1° 10, 2° 9, 3° 8, 4° 7, 5° 6.
5. Hay dos rankings separados, porque no se pueden comparar: **Trivia** (ordena por aciertos y, a igualdad,
   por menor tiempo) y **Laboratorio de Compuestos** (ordena por puntaje).

### Para borrar los resultados entre un curso y otro

Abrí en el navegador la dirección del script agregándole esto al final:

```
?accion=reset&token=polimeros2026
```

Te responde `{"ok":true,"rows":[]}` y la planilla queda limpia.

---

## Plan B, por si el wifi falla

No hay que hacer nada especial: si la app no puede mandar el resultado, se lo avisa al alumno en pantalla
(*"Pasale tu código al profe"*) y le deja igual su código firmado.
Vos entrás a **Panel del Docente → 📋 Por códigos**, pegás todos juntos y el podio se arma igual.
El código lleva firma: si alguien le cambia una letra para inflarse los aciertos, aparece en *Códigos rechazados*.

Por eso conviene tener el archivo `polimeros-en-juego.html` también en la notebook, no solo el link.

---

## Los tiempos del juego, para que lo tengas presente al presentar

**Laboratorio de Compuestos**, por cada uno de los 3 pedidos:

| Etapa | Tiempo |
|---|---|
| Leer el pedido y ver los ingredientes | 30 s |
| Formular: repartir el 100 % | 30 s |
| Elegir la temperatura de proceso | 20 s |
| Proceso en la máquina y resultado | 10 s |

Son 90 segundos por pedido, 4 minutos y medio la partida completa.
Se puede adelantar cada etapa con el botón, así que en la práctica sale más rápido.

**Trivia:** 15 preguntas de 20 segundos cada una.
