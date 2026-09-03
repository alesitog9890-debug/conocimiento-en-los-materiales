const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();

// Servir los archivos del juego desde la carpeta padre
app.use(express.static(path.join(__dirname, '..')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let players = {};
let raceInProgress = false;
let finishedCount = 0;

io.on('connection', (socket) => {
  console.log('Un jugador se ha conectado:', socket.id);

  // Cuando un jugador se une al lobby
  socket.on('joinLobby', (data) => {
    players[socket.id] = {
      id: socket.id,
      name: data.name || 'Piloto Anónimo',
      carData: data.carData || {},
      ready: true,
      x: 0,
      y: 0,
      ang: 0,
      speed: 0,
      vueltas: 0,
      idx: 0
    };
    
    // Asignar puesto en la grilla (basado en cuántos hay)
    const positionIndex = Object.keys(players).length - 1;
    players[socket.id].gridPosition = positionIndex;

    // Enviar a todos la lista actualizada de jugadores
    io.emit('lobbyUpdate', Object.values(players));
    console.log(`${players[socket.id].name} se unió. Total: ${Object.keys(players).length}`);
  });

  socket.on('adminWarning', () => {
    io.emit('raceWarning');
  });

  // El admin manda a todos al taller
  socket.on('adminGoToTaller', () => {
    console.log('El admin mandó a todos al taller');
    io.emit('goToTaller');
  });

  // El admin inicia la carrera
  socket.on('adminStartRace', () => {
    console.log('¡El admin ha iniciado la carrera!');
    raceInProgress = true;
    finishedCount = 0;
    // Reset finished status
    Object.values(players).forEach(p => p.finishedData = null);
    io.emit('raceStarting', { countdown: 3 });
  });

  // Actualización de posición durante la carrera
  socket.on('playerUpdate', (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      players[socket.id].ang = data.ang;
      players[socket.id].speed = data.speed;
      players[socket.id].vueltas = data.vueltas || 0;
      players[socket.id].idx = data.idx || 0;
      
      // Emitir a todos los demás jugadores (broadcast)
      socket.broadcast.emit('opponentsUpdate', {
        id: socket.id,
        name: players[socket.id].name,
        x: data.x,
        y: data.y,
        ang: data.ang,
        speed: data.speed,
        vueltas: data.vueltas || 0,
        idx: data.idx || 0
      });
    }
  });

  // Alguien terminó la carrera
  socket.on('playerFinished', (data) => {
    if (players[socket.id] && !players[socket.id].finishedData) {
      players[socket.id].finishedData = data;
      finishedCount++;
      console.log(`${players[socket.id].name} terminó. (${finishedCount}/${Object.keys(players).length})`);
      
      if (finishedCount === Object.keys(players).length && Object.keys(players).length > 0) {
        console.log('¡Todos terminaron! Enviando tabla global.');
        // Ordenar: primero los que llegaron (motivo='meta') por tiempo, luego los demás por puntos
        const results = Object.values(players).map(p => ({
          name: p.name,
          ...p.finishedData
        }));
        
        results.sort((a, b) => {
          if (a.motivo === 'meta' && b.motivo !== 'meta') return -1;
          if (a.motivo !== 'meta' && b.motivo === 'meta') return 1;
          if (a.motivo === 'meta' && b.motivo === 'meta') return a.tiempo - b.tiempo;
          return b.puntos - a.puntos; // Los que no llegaron se ordenan por puntos
        });

        io.emit('raceFinishedGlobal', results);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
    if (players[socket.id] && players[socket.id].finishedData) {
      finishedCount--;
    }
    delete players[socket.id];
    io.emit('lobbyUpdate', Object.values(players));
    io.emit('playerDisconnected', socket.id);
    
    // Si la carrera estaba en progreso, ver si con este disconnect ya terminaron todos
    if (raceInProgress && Object.keys(players).length > 0 && finishedCount === Object.keys(players).length) {
      console.log('Tras desconexión, ¡Todos terminaron! Enviando tabla global.');
      const results = Object.values(players).map(p => ({
        name: p.name,
        ...p.finishedData
      }));
      results.sort((a, b) => {
        if (a.motivo === 'meta' && b.motivo !== 'meta') return -1;
        if (a.motivo !== 'meta' && b.motivo === 'meta') return 1;
        if (a.motivo === 'meta' && b.motivo === 'meta') return a.tiempo - b.tiempo;
        return (b.puntos||0) - (a.puntos||0);
      });
      io.emit('raceFinishedGlobal', results);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor multijugador corriendo en el puerto ${PORT}`);
  console.log(`Los alumnos deben abrir: http://<TU-IP>:${PORT}/index.html`);
});
