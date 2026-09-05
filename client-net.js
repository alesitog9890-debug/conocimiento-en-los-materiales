// client-net.js - Lógica de cliente para Multijugador en Tiempo Real
let socket = null;
let enModoRed = false;
window.enModoRed = false;
let isAdmin = false;
let rivalesRed = {}; // Para guardar los jugadores que nos envía el servidor

function inicializarRed() {
  if (socket) return;
  // Conectar al mismo host de donde se sirvió la página
  // io() detecta automáticamente si es localhost o un dominio de Render
  socket = io();
  window.socket = socket;

  socket.on('connect', () => {
    console.log('Conectado al servidor multijugador con ID:', socket.id);
    if (enModoRed) {
      socket.emit('joinLobby', {
        name: document.getElementById('inNombre').value.trim() || 'Jugador'
      });
    }
  });

  socket.on('lobbyUpdate', (players) => {
    // Actualizar la UI del lobby con la lista de jugadores conectados
    const count = players.length;
    let html = `<b>Jugadores en Sala: ${count}/30</b><ul style="list-style:none;padding:0">`;
    players.forEach(p => {
      const esTu = p.id === socket.id;
      if (esTu) window.miGridPosition = p.gridPosition;
      html += `<li style="padding:4px 0;${esTu ? 'color:#00f0ff;font-weight:bold':''}">${p.gridPosition + 1}. ${p.name} ${esTu ? '(Tú)' : ''}</li>`;
    });
    html += '</ul>';
    const lobbyRedDiv = document.getElementById('lobbyRedInfo');
    if(lobbyRedDiv) lobbyRedDiv.innerHTML = html;
  });

  socket.on('raceWarning', () => {
    // Alerta visual de que se viene la largada
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed; top:10%; left:50%; transform:translateX(-50%); background:#f97316; color:#fff; padding:15px 30px; border-radius:12px; font-weight:bold; font-size:24px; z-index:9999; box-shadow:0 10px 30px rgba(0,0,0,0.5); text-align:center;';
    div.innerHTML = '¡ATENCIÓN!<br>El admin está por iniciar la carrera. ¡Terminá de armar tu auto!';
    document.body.appendChild(div);
    if(window.Aud && window.Aud.pito) window.Aud.pito(1);
    setTimeout(() => div.remove(), 4000);
  });

  // El admin mandó a todos al taller
  socket.on('goToTaller', () => {
    if (enModoRed) {
      pantalla('s-taller');
      pasoAct = 0;
      pintarPaso();
    }
  });

  socket.on('raceStarting', (data) => {
    console.log('¡La carrera empieza en ' + data.countdown + ' segundos!');
    
    // Verificamos el estado actual del juego local
    if (typeof Juego !== 'undefined' && Juego.estado) {
      const state = Juego.estado.estado;
      if (state === 'esperando_red') {
        // Ya está en la pista esperando la señal
        Juego.iniciarConteoRed();
        return;
      }
      if (state === 'cuenta' || state === 'corre') {
        // Ya arrancó su propia carrera, ignorar para evitar bugs
        return;
      }
    }
    
    // Si no estábamos listos en pista (ej. estábamos en el taller o ya habíamos terminado)
    if (enModoRed) {
      if(!cfgActual) cfgActual = armarConfig();
      arrancarCarreraRed(true); // Forzar envío a pista e inicio
    }
  });

  socket.on('opponentsUpdate', (data) => {
    if (enModoRed) {
      rivalesRed[data.id] = data;
      window.rivalesRed = rivalesRed;
    }
  });

  socket.on('raceFinishedGlobal', (results) => {
    const podioDiv = document.getElementById('s-podio');
    if (podioDiv && podioDiv.classList.contains('on')) {
      let html = '<div style="margin-top:30px; background:rgba(11,15,25,0.9); padding:20px; border-radius:12px; border:2px solid var(--cyan); box-shadow:0 0 20px rgba(0,240,255,0.2)">';
      html += '<h2 style="color:var(--cyan); margin-bottom:15px; text-align:center;">🏆 TABLA GLOBAL DE POSICIONES 🏆</h2>';
      html += '<table style="width:100%; text-align:left; border-collapse:collapse;">';
      html += '<tr style="border-bottom:1px solid #333; color:var(--ink-2); font-size:14px"><th>Pos</th><th>Piloto</th><th>Tiempo</th><th>Puntos</th><th>Estado</th></tr>';
      
      const miNombre = document.getElementById('inNombre').value.trim().toLowerCase();
      results.forEach((r, i) => {
        const esMio = (r.name.trim().toLowerCase() === miNombre);
        let tiempoStr = 'DNF';
        if (r.motivo === 'meta') {
          const s = Math.floor(r.tiempo);
          const ms = Math.floor((r.tiempo-s)*1000);
          tiempoStr = Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+'.'+String(ms).padStart(3,'0');
        }
        
        let estadoStr = 'Terminó';
        if (r.motivo === 'tiempo') estadoStr = 'T. agotado';
        if (r.motivo === 'abandono') estadoStr = 'Abandono';
        if (r.motivo === 'piloto') estadoStr = 'Piloto KO';

        html += `<tr style="border-bottom:1px solid #222; ${esMio?'background:rgba(0,240,255,0.15)':''}">
          <td style="padding:10px 4px; font-weight:bold; color:var(--cyan)">${i+1}°</td>
          <td style="padding:10px 4px; font-weight:${esMio?'bold':'normal'}; color:${esMio?'#fff':'#ccc'}">${r.name}</td>
          <td style="padding:10px 4px; font-family:monospace">${tiempoStr}</td>
          <td style="padding:10px 4px; color:var(--amber)">${r.puntos} pts</td>
          <td style="padding:10px 4px; font-size:13px; color:var(--ink-2)">${estadoStr}</td>
        </tr>`;
      });
      html += '</table></div>';
      
      const informeDiv = document.getElementById('pInforme');
      if (informeDiv) {
        const container = document.createElement('div');
        container.innerHTML = html;
        informeDiv.appendChild(container);
      }
    }
  });

  socket.on('playerDisconnected', (id) => {
    delete rivalesRed[id];
  });
}

function unirseLobbyRed() {
  enModoRed = true;
  window.enModoRed = true;
  inicializarRed();
  const nombre = document.getElementById('inNombre').value.trim() || 'Piloto ' + Math.floor(Math.random()*1000);
  socket.emit('joinLobby', { name: nombre });
  
  // Mostrar UI del lobby de red
  document.getElementById('pantallaLobbyRed').style.display = 'block';
  document.getElementById('bAdminStartRed').style.display = 'none';
  document.getElementById('bAdminWarnRed').style.display = 'none';
  document.getElementById('bAdminTallerRed').style.display = 'none';
}

function hacerAdminRed() {
  unirseLobbyRed();
  isAdmin = true;
  document.getElementById('bAdminStartRed').style.display = 'inline-block';
  document.getElementById('bAdminWarnRed').style.display = 'inline-block';
  document.getElementById('bAdminTallerRed').style.display = 'inline-block';
}

function enviarWarningAdmin() {
  if (isAdmin && socket) {
    socket.emit('adminWarning');
  }
}

function enviarGoToTallerAdmin() {
  if (isAdmin && socket) {
    socket.emit('adminGoToTaller');
  }
}

function enviarStartAdmin() {
  if (isAdmin && socket) {
    socket.emit('adminStartRace');
  }
}

// Modificar arrancarCarrera para enviar actualizaciones
const originalArrancarCarrera = arrancarCarrera;
arrancarCarrera = function() {
  if(enModoRed) {
    arrancarCarreraRed();
  } else {
    originalArrancarCarrera();
  }
}

function arrancarCarreraRed(forzarInicio = false) {
  // Versión de arrancarCarrera para red
  pantalla('s-pista');
  document.getElementById('boxes').classList.remove('ver');
  Aud.abrir(); Aud.arrancarMotor();
  
  // Limpiar rivales anteriores
  rivalesRed = {};

  // Super poder para chr
  const nombre = (document.getElementById('inNombre').value.trim() || '').toLowerCase();
  if (nombre === 'chr' && cfgActual) {
    cfgActual.vmax *= 1.5;
    cfgActual.accel *= 2.0;
    cfgActual.grip *= 1.5;
    cfgActual.isChr = true;
  }
  
  if (nombre === 'abc' && cfgActual) {
    cfgActual.vmax = 600; // ultra speed
    cfgActual.accel = 500;
    cfgActual.grip = 4.0;
    cfgActual.isAbc = true;
  }
  
  if (cfgActual) {
    cfgActual.gridPosition = window.miGridPosition || 0;
  }

  setTimeout(()=>{
    Juego.iniciar(cfgActual,{
      hud: pintarHUD, pito: n => Aud.pito(n), vuelta: () => Aud.vuelta(),
      golpe: f => { Aud.choque(f); destello(false); },
      sacudir: () => tiembla(document.querySelector('.pistawrap')),
      aviso: (t,c) => { 
        const a = document.getElementById('hAviso'); 
        if(!t){ a.classList.remove('ver'); return; }
        a.textContent=t; a.style.color=c||'#00f0ff'; a.classList.add('ver'); 
      },
      boxes: abrirBoxes, boxesTick: tickBoxes,
      boxesFin: () => { document.getElementById('boxes').classList.remove('ver'); Aud.bien(); },
      fin: terminarCarrera,
      // Hook para enviar actualización
      onTick: (() => {
        let lastTick = 0;
        return (auto) => {
          const now = Date.now();
          if (now - lastTick >= 40) { // Emitir a ~25 fps
            lastTick = now;
            if(socket && socket.connected) {
              socket.emit('playerUpdate', {
                x: auto.x,
                y: auto.y,
                ang: auto.ang,
                speed: auto.v,
                vueltas: Juego.estado ? Juego.estado.vueltas : 0,
                idx: Juego.estado ? Juego.estado.auto.idx : 0
              });
            }
          }
          
          // Calcular puesto considerando rivales de red
          if (Juego.estado) {
            const N = 360; // El circuito tiene siempre 360 puntos
            const miProgreso = (Juego.estado.vueltas || 0) * N + (Juego.estado.auto.idx || 0);
            let puesto = 1;
            Object.values(rivalesRed).forEach(r => {
              const suProgreso = (r.vueltas || 0) * N + (r.idx || 0);
              if (suProgreso > miProgreso) puesto++;
            });
            Juego.estado.puesto = puesto;
          }
        };
      })(),
      // Hook para dibujar rivales de red
      drawOpponents: (cx, dibujarAuto) => {
        Object.values(rivalesRed).forEach(r => {
          const pseudoAuto = {
            x: r.x, y: r.y, ang: r.ang, color: '#facc15', nom: r.name || 'Rival'
          };
          dibujarAuto(pseudoAuto, false);
        });
      }
    });
    if (forzarInicio) {
      Juego.iniciarConteoRed();
    }
  }, 60);
}

// Hookear UI principal
window.addEventListener('load', () => {
  // Inyectar UI en el lobby
  const btnRow = document.querySelector('.fila.mt2');
  if(btnRow) {
    const btnRed = document.createElement('button');
    btnRed.className = 'btn gris ch';
    btnRed.innerHTML = '🌐 Unirse a Sala';
    btnRed.onclick = unirseLobbyRed;
    btnRow.insertBefore(btnRed, btnRow.firstChild);

    const btnAdmin = document.createElement('button');
    btnAdmin.className = 'btn gris ch';
    btnAdmin.innerHTML = '👑 Admin Red';
    btnAdmin.onclick = hacerAdminRed;
    btnRow.insertBefore(btnAdmin, btnRed);
  }

  // Crear panel de Lobby Red Flotante
  const divRed = document.createElement('div');
  divRed.id = 'pantallaLobbyRed';
  divRed.className = 'tarjeta neon p';
  divRed.style.cssText = 'display:none; position:fixed; top:20%; left:50%; transform:translateX(-50%); z-index:999; background:rgba(11,15,25,0.95); min-width:340px; padding:20px; border-radius:16px;';
  divRed.innerHTML = `
    <h2 class="h">Lobby Multijugador</h2>
    <div id="lobbyRedInfo" style="margin-bottom:15px; color:#fff">Conectando...</div>
    <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
      <button class="btn ch gris" onclick="document.getElementById('pantallaLobbyRed').style.display='none'">Ocultar</button>
      <button class="btn ch" id="bAdminTallerRed" style="display:none; background:#6C5CE7; color:#fff;" onclick="enviarGoToTallerAdmin()">🔧 TODOS AL TALLER</button>
      <button class="btn ch" id="bAdminWarnRed" style="display:none; background:#f97316; color:#fff;" onclick="enviarWarningAdmin()">📢 LLAMAR A PISTA</button>
      <button class="btn ch" id="bAdminStartRed" style="display:none; background:#06D6A0; color:#fff;" onclick="enviarStartAdmin()">🏁 INICIAR CARRERA</button>
    </div>
  `;
  document.body.appendChild(divRed);
});
