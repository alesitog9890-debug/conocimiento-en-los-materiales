# Polymer Racer — guía del TP N° 5 (Grupo 5, Procesamiento)

Archivo único: **`index.html`**. Se abre con doble clic y funciona sin internet.
Se llama `index.html` a propósito: es el nombre que necesita GitHub Pages para que la dirección quede corta.

---

## 1. Cómo se conecta con la consigna

| Lo que pide la cátedra | Dónde está en el juego |
|---|---|
| Investigar y describir la propiedad del grupo | Botón 📘 **Ficha técnica**: extrusión, moldeo (inyección / termoconformado / compresión), curado y vulcanización, reciclabilidad y códigos 1 a 7, con diagramas |
| Ejemplificar con materiales reales | Las 12 opciones del taller son procesos y materiales reales: HIPS, baquelita, PP copolímero, PS cristal, PRFV, PU RIM, EPS, policarbonato |
| Concluir | Cada opción tiene su “dato técnico” al elegirla, y al terminar la carrera el informe **“Qué te pasó con cada pieza”** explica por qué falló lo que falló |
| Gamificar | La carrera: el proceso que elegiste decide cómo se comporta el coche |
| Que enganche a alguien ajeno al tema | Se juega en 3 minutos, sin instrucciones previas, desde el celular |
| Nota por ranking (1° 10, 2° 9, 3° 8, 4° 7, 5° 6) | Panel del profesor: pega los códigos y arma la tabla oficial con las notas |
| Medir interacciones | Contadores de **Visitas (1 pto)** y **Partidas jugadas (3 ptos)** en la pantalla de inicio |

---

## 2. La respuesta correcta (para que la sepas vos, no los jugadores)

El **bonus de eficiencia de flujo (+10 % de velocidad)** se desbloquea con estas cuatro:

| Pieza | Opción óptima | Por qué |
|---|---|---|
| Neumáticos | **Vulcanización óptima (2–3 % de azufre)** | Entrecruzamiento justo: elástico y tenaz. Con exceso da ebonita (dura y frágil); sin azufre se deforma y frena |
| Carrocería frontal | **Inyección de PP copolímero tenaz** | Espesor parejo y memoria elástica. El HIPS termoconformado se adelgaza en las esquinas; la baquelita blinda pero pesa y no funde |
| Paragolpes trasero | **Poliuretano elastomérico (RIM)** | Disipa la energía. El PS cristal estalla; el PRFV no se rompe pero le manda el golpe entero al piloto |
| Casco | **Calota de PC + EPS multidensidad** | La calota reparte, la espuma frena. Sin EPS no hay absorción por más rígida que sea la calota |

Las tres combinaciones de fallo que conviene mostrar en la presentación:

- **Sobre-vulcanizado + bache** → reventón, se pierde el 45 % de la velocidad punta.
- **HIPS termoconformado + muro** → rotura total y lluvia de fragmentos.
- **Cualquier termoestable roto** → boxes al doble de tiempo, con el cartel **“¡NO FUNDE, REQUIERE PIEZA NUEVA!”**. Es la escena que explica la reciclabilidad sin decir una palabra de teoría.

---

## 3. Tiempos y reglas de la carrera

- 3 vueltas, 3 rivales con IA (Extrusor 900, Vulcanix, Termo-Kart).
- Cuenta regresiva de 3 segundos y límite de 4 minutos por carrera.
- Controles: **W A S D** o flechas en la compu; los cuatro botones táctiles en el celular.
- Pasar rozando el muro te frena pero no te rompe; el impacto real sí.
- **Positivo extra**: llegar a la meta con integridad 100 % y el piloto con 100 HP. Queda marcado con ⭐ dentro del código.

Puntaje = base por tiempo + integridad × 22 + vida del piloto × 12 + bonus de flujo + puesto en pista − 400 por cada parada en boxes.

---

## 4. Subirlo para que lo jueguen (y que sume puntos)

El QR y los contadores solo tienen sentido con una dirección web real.

1. Cuenta en **github.com** → **+ → New repository** → nombre `polymer-racer`, **Public** → Create.
2. **uploading an existing file** → arrastrá `index.html` → **Commit changes**.
3. **Settings → Pages** → Source: *Deploy from a branch*, rama **main**, carpeta **/ (root)** → Save.
4. En un par de minutos te da la dirección: `https://TUUSUARIO.github.io/polymer-racer/`
5. Abrila desde ahí y usá el botón **🔳 Ver código QR**: el QR se genera solo con esa dirección. Ese QR va en el reel, en la historia y en el carrusel.

> Ojo con los contadores: se guardan en el navegador de cada persona, así que miden las visitas y partidas **de ese dispositivo**. Sirven para mostrar el mecanismo en la presentación; para el conteo real del TP, lo que vale son las métricas de Instagram y TikTok más los códigos que te pasen.

---

## 5. Ideas para el posteo (el 60 % de la nota)

El formato que mejor funciona con este juego es el **duelo de propiedades**, que además es uno de los que pide la cátedra:

- **Reel de 15–20 s**: primer plano del taller, se elige *“Termoconformado fino”*, y corte directo al choque con la carrocería estallando en fragmentos. Placa: *“Elegiste mal el moldeo.”* Cierre con el QR.
- **Historia con encuesta**: “¿Con qué % de azufre vulcanizarías la cubierta? 0 % / 2-3 % / 10 %”. La respuesta se revela con el reventón del juego.
- **Carrusel de 5 slides**: portada tipo versus (HIPS vs Baquelita), tres slides con las stats de cada uno, y el último con el QR.
- **Comentarios valen 3 puntos**: cerrá el posteo con una pregunta directa —“Tirá tu mejor tiempo en los comentarios”—, que es lo que más empuja la métrica que más pesa.

Antes de publicar, probalo con alguien que no curse la materia: si no entiende qué tiene que hacer en los primeros cinco segundos del taller, hay que simplificar el texto de esa pantalla.
