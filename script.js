// ================= ESTADO GLOBAL DEL JUEGO =================
const gameState = {
    age: 4,               // 3, 4, 5 años
    isTeamPlay: false,    // Juego individual o por equipos
    players: ["Guardiana/o"], // Nombres de los jugadores o equipos
    activePlayerIdx: 0,   // Índice del jugador en turno
    currentLevel: 1,      // 1 al 5
    stars: [false, false, false, false, false], // Estrellas ganadas por nivel
    badges: {
        plants: false,    // Insignia Amigo de las Plantas
        animals: false    // Insignia Protector de los Animales
    },
    voiceEnabled: true,   // Locución de Lula activada/desactivada
    selectedDraggableId: null, // Para soporte de clics (móviles/accesibilidad)
    
    // Registros para la evaluación del docente
    evaluation: {
        level1: { completed: false, errors: 0, itemsPlaced: 0, totalItems: 0 },
        level2: { completed: false, errors: 0, correctSelected: 0 },
        level3: { completed: false, errors: 0, correctSelected: 0 },
        level4: { completed: false, errors: 0, itemsPlaced: 0, totalItems: 0 },
        level5: { completed: false, errors: 0, itemsPlaced: 0, totalItems: 0 },
        reflections: [] // Respuestas a preguntas de 5 años
    }
};

// ================= DICCIONARIOS DE DATOS Y CONFIGURACIÓN =================
const LEVEL_CONFIGS = {
    1: {
        title: "Nivel 1: ¿Quién vive aquí?",
        instruction: "Ayuda a cada animal y planta a encontrar su casa. Arrástralos a su hábitat correcto: el bosque, la granja, el jardín o el estanque. Si estás en celular, toca el elemento y luego toca su casita.",
        habitats: [
            { id: "bosque", name: "Bosque", color: "bosque-t", emoji: "🌲" },
            { id: "granja", name: "Granja", color: "granja-t", emoji: "🚜" },
            { id: "jardin", name: "Jardín", color: "jardin-t", emoji: "🌻" },
            { id: "estanque", name: "Estanque", color: "estanque-t", emoji: "💧" }
        ],
        items: [
            { id: "ardilla", name: "Ardilla", emoji: "🐿️", target: "bosque", age: [3, 4, 5] },
            { id: "vaca", name: "Vaca", emoji: "🐄", target: "granja", age: [3, 4, 5] },
            { id: "rana", name: "Rana", emoji: "🐸", target: "estanque", age: [3, 4, 5] },
            { id: "mariposa", name: "Mariposa", emoji: "🦋", target: "jardin", age: [4, 5] },
            { id: "pato", name: "Pato", emoji: "🦆", target: "estanque", age: [5] }
        ]
    },
    2: {
        title: "Nivel 2: Cuida las plantas",
        instruction: "¡Cuidemos las plantas! Toca únicamente los dibujos que ayudan a la planta a crecer grande, feliz y sana.",
        items: [
            { id: "regar", name: "Regarla con agua", emoji: "💧", correct: true, age: [3, 4, 5] },
            { id: "sol", name: "Darle luz del sol", emoji: "☀️", correct: true, age: [3, 4, 5] },
            { id: "pisar", name: "Pisarla con botas", emoji: "🥾", correct: false, age: [3, 4, 5] },
            { id: "arrancar", name: "Arrancar sus hojas", emoji: "🥀", correct: false, age: [4, 5] }
        ]
    },
    3: {
        title: "Nivel 3: Amigos de los animales",
        instruction: "¡Los animales son nuestros amigos! Elige los dibujos que demuestran cariño, respeto y empatía hacia los animales.",
        items: [
            { id: "observar", name: "Observar mariposas", emoji: "👀🦋", correct: true, age: [3, 4, 5] },
            { id: "agua", name: "Dar agua a tu perrito", emoji: "🐕💧", correct: true, age: [3, 4, 5] },
            { id: "nido", name: "Molestar un nido de aves", emoji: "🪺🫱", correct: false, age: [3, 4, 5] },
            { id: "jalar", name: "Jalar la cola al gato", emoji: "🐈‍⬛💨", correct: false, age: [4, 5] }
        ]
    },
    4: {
        title: "Nivel 4: Clasifica las acciones",
        instruction: "Arrastra los dibujos: pon las buenas acciones en la caja verde 'Cuidamos la naturaleza', y las malas acciones en la caja roja. Si estás en celular, toca el dibujo y luego la caja.",
        boxes: [
            { id: "cuidamos", name: "Cuidamos la naturaleza", type: "good" },
            { id: "no-cuidamos", name: "No cuidamos la naturaleza", type: "bad" }
        ],
        items: [
            { id: "sembrar", name: "Sembrar flores", emoji: "🌱", target: "cuidamos", age: [3, 4, 5] },
            { id: "basura", name: "Tirar basura al suelo", emoji: "🗑️✖️", target: "no-cuidamos", age: [3, 4, 5] },
            { id: "grifo", name: "Dejar el agua tirándose", emoji: "🚰💦", target: "no-cuidamos", age: [3, 4, 5] },
            { id: "apagar", name: "Apagar la luz al salir", emoji: "💡✔️", target: "cuidamos", age: [4, 5] },
            { id: "reciclar", name: "Reciclar botellas", emoji: "♻️🍼", target: "cuidamos", age: [5] }
        ]
    },
    5: {
        title: "Nivel 5: Misión especial",
        instruction: "¡El parque está sucio! Recoge la basura arrastrándola al bote correcto: la comida va en Orgánico y el plástico o metal en Reciclable. En celular, toca la basura y luego el bote.",
        bins: [
            { id: "organico", name: "Orgánico", logo: "🍎", type: "organic" },
            { id: "reciclable", name: "Reciclable", logo: "♻️", type: "recyclable" }
        ],
        items: [
            { id: "platano", name: "Cáscara de plátano", emoji: "🍌", target: "organico", age: [3, 4, 5] },
            { id: "botella", name: "Botella de plástico", emoji: "🧴", target: "reciclable", age: [3, 4, 5] },
            { id: "manzana", name: "Manzana mordida", emoji: "🍎", target: "organico", age: [3, 4, 5] },
            { id: "lata", name: "Lata de metal", emoji: "🥫", target: "reciclable", age: [4, 5] },
            { id: "carton", name: "Caja de cartón", emoji: "📦", target: "reciclable", age: [4, 5] },
            { id: "hojas", name: "Hojas secas", emoji: "🍂", target: "organico", age: [5] }
        ]
    }
};

const REFLECTION_QUESTIONS = {
    1: {
        question: "¿Por qué los animales deben vivir felices en su hábitat natural?",
        options: [
            { text: "Porque ahí tienen su alimento, agua y refugio para vivir sanos.", correct: true },
            { text: "Porque quieren estar lejos de los niños y no jugar.", correct: false }
        ]
    },
    2: {
        question: "¿Qué pasaría con las plantas si nadie las regara y no les diera el sol?",
        options: [
            { text: "Se secarían, se enfermarían y dejarían de darnos oxígeno.", correct: true },
            { text: "Caminarían a otro parque a buscar agua.", correct: false }
        ]
    },
    3: {
        question: "¿Por qué es importante observar a los animales sin atraparlos?",
        options: [
            { text: "Porque son seres vivos libres que se asustan y sufren si los encerramos.", correct: true },
            { text: "Porque corren muy rápido y nos pueden ganar.", correct: false }
        ]
    },
    4: {
        question: "¿Por qué no debemos tirar basura en los bosques y ríos?",
        options: [
            { text: "Porque ensucia el agua y la tierra, y enferma a los animales.", correct: true },
            { text: "Porque hace que el suelo se vea de muchos colores.", correct: false }
        ]
    },
    5: {
        question: "¿Qué podemos hacer en el salón de clases para cuidar el planeta?",
        options: [
            { text: "Usar termos de agua reutilizables y reciclar las hojas de papel.", correct: true },
            { text: "Tirar la basura debajo de las mesas para que no se vea.", correct: false }
        ]
    }
};

// ================= MOTOR DE EFECTOS DE SONIDO (WEB AUDIO API) =================
const audioSynth = {
    ctx: null,
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    
    playPop() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },
    
    playCorrect() {
        this.init();
        const now = this.ctx.currentTime;
        const gain = this.ctx.createGain();
        gain.connect(this.ctx.destination);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        // Acorde alegre de dos notas sucesivas
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.connect(gain);
        osc1.start(now);
        osc1.stop(now + 0.15);
        
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, now + 0.12); // E5
        osc2.connect(gain);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.35);
    },
    
    playIncorrect() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.25);
        
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    },
    
    playWater() {
        this.init();
        const now = this.ctx.currentTime;
        const duration = 0.5;
        
        for (let i = 0; i < 5; i++) {
            const timeOffset = i * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.frequency.setValueAtTime(800 + Math.random() * 400, now + timeOffset);
            osc.frequency.exponentialRampToValueAtTime(1200 + Math.random() * 400, now + timeOffset + 0.06);
            
            gain.gain.setValueAtTime(0.1, now + timeOffset);
            gain.gain.exponentialRampToValueAtTime(0.005, now + timeOffset + 0.06);
            
            osc.start(now + timeOffset);
            osc.stop(now + timeOffset + 0.06);
        }
    },
    
    playFanfare() {
        this.init();
        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 783.99]; // C4, E4, G4, C5, E5, C5, G5
        const durations = [0.15, 0.15, 0.15, 0.2, 0.2, 0.15, 0.5];
        
        let accumulatedTime = 0;
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + accumulatedTime);
            
            gain.gain.setValueAtTime(0.2, now + accumulatedTime);
            gain.gain.exponentialRampToValueAtTime(0.01, now + accumulatedTime + durations[idx] - 0.02);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now + accumulatedTime);
            osc.stop(now + accumulatedTime + durations[idx]);
            
            accumulatedTime += durations[idx] * 0.85;
        });
    }
};

// ================= NARRADOR Y SÍNTESIS DE VOZ =================
const narrator = {
    synth: window.speechSynthesis,
    activeUtterance: null,
    
    speak(text, onEndCallback = null) {
        this.synth.cancel(); // Detener cualquier locución previa
        
        // Actualizar visualmente la burbuja de texto
        document.getElementById("narrator-text").innerText = text;
        
        if (!gameState.voiceEnabled) {
            if (onEndCallback) onEndCallback();
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-MX'; // Español latino o neutral
        utterance.rate = 0.9;    // Narración pausada para preescolar
        utterance.pitch = 1.35;   // Tono agudo y amigable (tipo caricatura/ardilla)
        
        // Animación de Lula hablando
        const lulaElement = document.getElementById("lula-svg-element");
        utterance.onstart = () => {
            if (lulaElement) lulaElement.classList.add("talking");
        };
        
        utterance.onend = () => {
            if (lulaElement) lulaElement.classList.remove("talking");
            if (onEndCallback) onEndCallback();
        };
        
        utterance.onerror = () => {
            if (lulaElement) lulaElement.classList.remove("talking");
            if (onEndCallback) onEndCallback();
        };
        
        this.activeUtterance = utterance;
        this.synth.speak(utterance);
    },
    
    cancel() {
        this.synth.cancel();
        const lulaElement = document.getElementById("lula-svg-element");
        if (lulaElement) lulaElement.classList.remove("talking");
    },
    
    bounceLula() {
        const avatar = document.getElementById("lula-avatar");
        if (avatar) {
            avatar.classList.remove("happy-bounce");
            void avatar.offsetWidth; // Forzar reflow
            avatar.classList.add("happy-bounce");
        }
    }
};

// ================= INICIALIZACIÓN Y CONFIGURACIÓN INICIAL =================
document.addEventListener("DOMContentLoaded", () => {
    setupWelcomeScreenEvents();
    setupGameControlEvents();
    setupModalEvents();
    
    // Desbloquear audio en el primer clic general
    document.body.addEventListener("click", () => {
        audioSynth.init();
    }, { once: true });
});

// Configurar los controles de la pantalla de inicio
function setupWelcomeScreenEvents() {
    // Selección de modo (Individual vs Equipos)
    const btnIndiv = document.getElementById("btn-mode-individual");
    const btnTeams = document.getElementById("btn-mode-teams");
    const playerNamesGroup = document.getElementById("player-names-group");
    const inputPlayerName = document.getElementById("input-player-name");
    const teamNamesInputs = document.getElementById("team-names-inputs");
    
    btnIndiv.addEventListener("click", () => {
        audioSynth.playPop();
        btnIndiv.classList.add("active");
        btnIndiv.setAttribute("aria-checked", "true");
        btnTeams.classList.remove("active");
        btnTeams.setAttribute("aria-checked", "false");
        
        playerNamesGroup.querySelector("h3").innerText = "✍️ Escribe tu nombre:";
        inputPlayerName.classList.remove("hidden");
        teamNamesInputs.classList.add("hidden");
        gameState.isTeamPlay = false;
    });
    
    btnTeams.addEventListener("click", () => {
        audioSynth.playPop();
        btnTeams.classList.add("active");
        btnTeams.setAttribute("aria-checked", "true");
        btnIndiv.classList.remove("active");
        btnIndiv.setAttribute("aria-checked", "false");
        
        playerNamesGroup.querySelector("h3").innerText = "✍️ Nombres de los equipos:";
        inputPlayerName.classList.add("hidden");
        teamNamesInputs.classList.remove("hidden");
        gameState.isTeamPlay = true;
    });
    
    // Selección de edad
    const ageButtons = {
        3: document.getElementById("btn-age-3"),
        4: document.getElementById("btn-age-4"),
        5: document.getElementById("btn-age-5")
    };
    const ageAdaptationInfo = document.getElementById("age-adaptation-info");
    
    Object.keys(ageButtons).forEach(ageKey => {
        ageButtons[ageKey].addEventListener("click", () => {
            audioSynth.playPop();
            
            // Desactivar todos y activar el seleccionado
            Object.keys(ageButtons).forEach(k => {
                ageButtons[k].classList.remove("active");
                ageButtons[k].setAttribute("aria-checked", "false");
            });
            ageButtons[ageKey].classList.add("active");
            ageButtons[ageKey].setAttribute("aria-checked", "true");
            
            gameState.age = parseInt(ageKey);
            
            // Explicar la adaptación
            if (gameState.age === 3) {
                ageAdaptationInfo.innerText = "Modo fácil: Menos elementos, colores de ayuda y locución completa.";
            } else if (gameState.age === 4) {
                ageAdaptationInfo.innerText = "Modo estándar: Desafíos completos acordes a tu edad.";
            } else {
                ageAdaptationInfo.innerText = "Modo avanzado: Desafíos estándar y preguntas para reflexionar.";
            }
        });
    });
    
    // Iniciar Juego
    document.getElementById("btn-start-game").addEventListener("click", () => {
        // Inicializar datos del jugador
        if (gameState.isTeamPlay) {
            const team1 = document.getElementById("input-team-1").value.trim() || "Equipo Verde";
            const team2 = document.getElementById("input-team-2").value.trim() || "Equipo Flor";
            gameState.players = [team1, team2];
        } else {
            gameState.players = [inputPlayerName.value.trim() || "Guardiana/o"];
        }
        gameState.activePlayerIdx = 0;
        gameState.currentLevel = 1;
        gameState.stars = [false, false, false, false, false];
        gameState.badges.plants = false;
        gameState.badges.animals = false;
        
        // Resetear evaluación
        gameState.evaluation = {
            level1: { completed: false, errors: 0, itemsPlaced: 0, totalItems: 0 },
            level2: { completed: false, errors: 0, correctSelected: 0 },
            level3: { completed: false, errors: 0, correctSelected: 0 },
            level4: { completed: false, errors: 0, itemsPlaced: 0, totalItems: 0 },
            level5: { completed: false, errors: 0, itemsPlaced: 0, totalItems: 0 },
            reflections: []
        };
        
        // Pasar a pantalla de juego
        switchScreen("screen-welcome", "screen-gameplay");
        startLevel(1);
    });
}

function setupGameControlEvents() {
    // Volver al menú
    document.getElementById("btn-go-home").addEventListener("click", () => {
        audioSynth.playPop();
        narrator.cancel();
        switchScreen("screen-gameplay", "screen-welcome");
    });
    
    // Control de Mute
    const muteBtn = document.getElementById("btn-voice-toggle");
    muteBtn.addEventListener("click", () => {
        gameState.voiceEnabled = !gameState.voiceEnabled;
        audioSynth.playPop();
        if (gameState.voiceEnabled) {
            muteBtn.innerText = "🔊";
            // Volver a leer la instrucción
            narrator.speak(LEVEL_CONFIGS[gameState.currentLevel].instruction);
        } else {
            muteBtn.innerText = "🔇";
            narrator.cancel();
        }
    });
    
    // Repetir locución
    document.getElementById("btn-voice-repeat").addEventListener("click", () => {
        audioSynth.playPop();
        narrator.speak(LEVEL_CONFIGS[gameState.currentLevel].instruction);
    });
    
    // Lula la ardilla reacciona al hacerle clic
    document.getElementById("lula-avatar").addEventListener("click", () => {
        audioSynth.playPop();
        narrator.bounceLula();
        const frasesGraciosas = [
            "¡Me encantan las bellotas y cuidar los árboles!",
            "¿Sabías que las plantas nos dan aire limpio para respirar?",
            "¡Cada animalito es importante para el planeta!",
            "¡Lo estás haciendo genial, Guardián!",
            "¡Si todos cuidamos un poquito, el mundo será muy feliz!"
        ];
        const randomFrase = frasesGraciosas[Math.floor(Math.random() * frasesGraciosas.length)];
        narrator.speak(randomFrase);
    });
    
    // Botón reiniciar en victoria
    document.getElementById("btn-restart").addEventListener("click", () => {
        audioSynth.playPop();
        switchScreen("screen-victory", "screen-welcome");
    });
    
    // Botón de imprimir diploma
    document.getElementById("btn-print-diploma").addEventListener("click", () => {
        audioSynth.playPop();
        window.print();
    });
    
    // Botón ver evaluación en pantalla final
    document.getElementById("btn-view-evaluation-final").addEventListener("click", () => {
        audioSynth.playPop();
        openTeacherDashboard();
    });
}

function setupModalEvents() {
    // Abrir panel docente (con gate matemático)
    document.getElementById("btn-teacher-dashboard-trigger").addEventListener("click", () => {
        audioSynth.playPop();
        openGateModal();
    });
    
    // Cerrar gate
    document.getElementById("btn-close-gate").addEventListener("click", () => {
        audioSynth.playPop();
        document.getElementById("modal-gate").classList.remove("active");
    });
    
    // Verificar gate matemático
    document.getElementById("btn-submit-gate").addEventListener("click", verifyGateMath);
    document.getElementById("gate-math-answer").addEventListener("keypress", (e) => {
        if (e.key === "Enter") verifyGateMath();
    });
    
    // Cerrar panel de evaluación
    document.getElementById("btn-close-modal").addEventListener("click", () => {
        audioSynth.playPop();
        document.getElementById("modal-teacher-dashboard").classList.remove("active");
    });
    
    // Imprimir reporte de evaluación
    document.getElementById("btn-print-eval").addEventListener("click", () => {
        audioSynth.playPop();
        window.print();
    });
    
    // Resetear datos de evaluación
    document.getElementById("btn-reset-eval").addEventListener("click", () => {
        if (confirm("¿Estás seguro de que quieres borrar todos los registros de evaluación?")) {
            audioSynth.playIncorrect();
            resetEvaluationData();
            alert("Los registros han sido borrados.");
            document.getElementById("modal-teacher-dashboard").classList.remove("active");
        }
    });
}

// ================= CONTROL DE PANTALLAS =================
function switchScreen(fromId, toId) {
    document.getElementById(fromId).classList.remove("active");
    document.getElementById(toId).classList.add("active");
}

function updateStarsHUD() {
    const starSlots = document.querySelectorAll("#stars-container .star-slot");
    starSlots.forEach((slot, index) => {
        if (gameState.stars[index]) {
            slot.classList.add("earned");
        } else {
            slot.classList.remove("earned");
        }
    });
}

function updateBadgesHUD() {
    const badgePlants = document.getElementById("badge-plants-mini");
    const badgeAnimals = document.getElementById("badge-animals-mini");
    
    if (gameState.badges.plants) {
        badgePlants.classList.remove("locked");
        badgePlants.classList.add("earned");
    } else {
        badgePlants.classList.add("locked");
        badgePlants.classList.remove("earned");
    }
    
    if (gameState.badges.animals) {
        badgeAnimals.classList.remove("locked");
        badgeAnimals.classList.add("earned");
    } else {
        badgeAnimals.classList.add("locked");
        badgeAnimals.classList.remove("earned");
    }
}

function updateTurnHUD() {
    const turnBubble = document.getElementById("team-turn-display");
    const activePlayer = gameState.players[gameState.activePlayerIdx];
    
    if (gameState.isTeamPlay) {
        turnBubble.innerHTML = `<span>👥 Turno: <strong>${activePlayer}</strong></span>`;
        if (gameState.activePlayerIdx === 1) {
            turnBubble.classList.add("team-orange-turn");
        } else {
            turnBubble.classList.remove("team-orange-turn");
        }
    } else {
        turnBubble.innerHTML = `<span>🧒 Jugador: <strong>${activePlayer}</strong></span>`;
        turnBubble.classList.remove("team-orange-turn");
    }
}

// ================= MOTOR DE NIVELES =================
function startLevel(levelNum) {
    gameState.currentLevel = levelNum;
    updateStarsHUD();
    updateBadgesHUD();
    updateTurnHUD();
    
    const config = LEVEL_CONFIGS[levelNum];
    document.getElementById("level-title-display").innerText = config.title;
    
    const workspace = document.getElementById("level-workspace");
    workspace.innerHTML = ""; // Vaciar área de trabajo
    
    gameState.selectedDraggableId = null; // Reiniciar selección por clics
    
    // Inyectar la interfaz específica del nivel
    if (levelNum === 1) {
        renderLevel1(workspace, config);
    } else if (levelNum === 2) {
        renderLevel2(workspace, config);
    } else if (levelNum === 3) {
        renderLevel3(workspace, config);
    } else if (levelNum === 4) {
        renderLevel4(workspace, config);
    } else if (levelNum === 5) {
        renderLevel5(workspace, config);
    }
    
    // Narrar instrucciones
    let customInstruction = config.instruction;
    if (gameState.isTeamPlay) {
        customInstruction = `¡Es el turno de ${gameState.players[gameState.activePlayerIdx]}! ` + customInstruction;
    }
    narrator.speak(customInstruction);
}

// Alterna los turnos en juego cooperativo por nivel o fase
function switchPlayerTurn() {
    if (gameState.isTeamPlay) {
        gameState.activePlayerIdx = (gameState.activePlayerIdx + 1) % 2;
        updateTurnHUD();
    }
}

// Finalización y validación del nivel
function completeLevel() {
    audioSynth.playFanfare();
    narrator.bounceLula();
    
    // Marcar estrella
    gameState.stars[gameState.currentLevel - 1] = true;
    updateStarsHUD();
    
    // Otorgar insignias específicas
    if (gameState.currentLevel === 2) {
        gameState.badges.plants = true;
        updateBadgesHUD();
        narrator.speak("¡Fabuloso! Has ganado la insignia: Amigo de las Plantas. ¡Sigue cuidándolas!", () => {
            proceedToNextSteps();
        });
        return;
    } else if (gameState.currentLevel === 3) {
        gameState.badges.animals = true;
        updateBadgesHUD();
        narrator.speak("¡Excelente! Has ganado la insignia: Protector de los Animales. ¡Trata siempre con amor a las mascotas!", () => {
            proceedToNextSteps();
        });
        return;
    }
    
    // Felicitaciones generales del nivel
    const elogios = [
        "¡Excelente trabajo! Has completado el nivel.",
        "¡Lo lograste! Eres una gran ayuda para la naturaleza.",
        "¡Qué bien! Los seres vivos te lo agradecen.",
        "¡Grandioso! Hemos limpiado y protegido nuestro entorno."
    ];
    const elogio = elogios[Math.floor(Math.random() * elogios.length)];
    
    narrator.speak(elogio, () => {
        proceedToNextSteps();
    });
}

function proceedToNextSteps() {
    // Si la edad es 5 años, mostrar la pregunta reflexiva obligatoria
    if (gameState.age === 5) {
        showReflectionOverlay();
    } else {
        advanceLevel();
    }
}

function advanceLevel() {
    switchPlayerTurn(); // Alternar el turno para el siguiente nivel
    
    if (gameState.currentLevel < 5) {
        startLevel(gameState.currentLevel + 1);
    } else {
        // Ir a la pantalla de victoria final
        showVictoryScreen();
    }
}

// ================= INTERFAZ NIVEL 1: HÁBITATS =================
function renderLevel1(parent, config) {
    const container = document.createElement("div");
    container.className = "level-container";
    
    // Grid de Hábitats
    const grid = document.createElement("div");
    grid.className = "habitats-grid";
    
    config.habitats.forEach(hab => {
        const box = document.createElement("div");
        box.className = `habitat-box habitat-${hab.id}`;
        box.dataset.habitat = hab.id;
        box.innerHTML = `
            <span class="habitat-title ${hab.color}">${hab.emoji} ${hab.name}</span>
            <div class="habitat-placed-container" id="placed-${hab.id}"></div>
        `;
        
        // Drag & Drop event listeners
        box.addEventListener("dragover", e => e.preventDefault());
        box.addEventListener("dragenter", () => box.classList.add("drag-over"));
        box.addEventListener("dragleave", () => box.classList.remove("drag-over"));
        box.addEventListener("drop", handleLevel1Drop);
        
        // Touch/Click fallback
        box.addEventListener("click", () => handleLevel1TargetClick(hab.id));
        
        grid.appendChild(box);
    });
    container.appendChild(grid);
    
    // Filtro por edad de los elementos arrastrables
    const activeItems = config.items.filter(item => item.age.includes(gameState.age));
    
    // Guardar para evaluación
    gameState.evaluation.level1.totalItems = activeItems.length;
    gameState.evaluation.level1.itemsPlaced = 0;
    gameState.evaluation.level1.errors = 0;
    
    // Fila de cartas arrastrables
    const row = document.createElement("div");
    row.className = "draggable-items-row";
    row.id = "level1-draggables";
    
    // Mezclar los elementos para que sea aleatorio
    const shuffledItems = [...activeItems].sort(() => Math.random() - 0.5);
    
    shuffledItems.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "item-card";
        // Si tiene 3 años, dar una pista de borde del mismo color del hábitat
        if (gameState.age === 3) {
            const outlines = { bosque: "1", granja: "2", jardin: "3", estanque: "4" };
            card.classList.add(`age-3-outline-${outlines[item.target]}`);
        }
        card.draggable = true;
        card.id = `drag-${item.id}`;
        card.dataset.id = item.id;
        card.dataset.target = item.target;
        card.dataset.emoji = item.emoji;
        card.dataset.name = item.name;
        
        card.innerHTML = `
            <span class="item-graphic">${item.emoji}</span>
            <span class="item-label">${item.name}</span>
        `;
        
        card.addEventListener("dragstart", handleLevel1DragStart);
        card.addEventListener("click", (e) => {
            e.stopPropagation();
            handleLevel1ItemClick(card);
        });
        
        row.appendChild(card);
    });
    
    container.appendChild(row);
    parent.appendChild(container);
}

function handleLevel1DragStart(e) {
    audioSynth.playPop();
    e.dataTransfer.setData("text/plain", e.target.id);
}

function handleLevel1ItemClick(card) {
    audioSynth.playPop();
    // Quitar borde a cartas previas
    document.querySelectorAll(".item-card").forEach(c => c.style.boxShadow = "");
    
    if (gameState.selectedDraggableId === card.id) {
        gameState.selectedDraggableId = null;
    } else {
        gameState.selectedDraggableId = card.id;
        card.style.boxShadow = "0 0 15px #2e7d32";
        narrator.speak(`¿Dónde vive la ${card.dataset.name}?`);
    }
}

function handleLevel1TargetClick(habitatId) {
    if (!gameState.selectedDraggableId) return;
    
    const card = document.getElementById(gameState.selectedDraggableId);
    if (!card) return;
    
    const targetHabitat = card.dataset.target;
    
    if (targetHabitat === habitatId) {
        placeLevel1Item(card, habitatId);
    } else {
        handleLevel1Error(card, habitatId);
    }
}

function handleLevel1Drop(e) {
    e.preventDefault();
    const box = e.currentTarget;
    box.classList.remove("drag-over");
    
    const dragId = e.dataTransfer.getData("text/plain");
    const card = document.getElementById(dragId);
    if (!card) return;
    
    const targetHabitat = card.dataset.target;
    const dropHabitat = box.dataset.habitat;
    
    if (targetHabitat === dropHabitat) {
        placeLevel1Item(card, dropHabitat);
    } else {
        handleLevel1Error(card, dropHabitat);
    }
}

function placeLevel1Item(card, habitatId) {
    audioSynth.playCorrect();
    
    const placedContainer = document.getElementById(`placed-${habitatId}`);
    
    // Crear una miniatura fija en el hábitat
    const mini = document.createElement("span");
    mini.style.fontSize = "2.3rem";
    mini.style.animation = "lulaBounce 0.5s ease-out";
    mini.innerText = card.dataset.emoji;
    mini.title = card.dataset.name;
    placedContainer.appendChild(mini);
    
    // Remover la tarjeta arrastrable
    card.remove();
    gameState.selectedDraggableId = null;
    
    // Registrar acierto
    gameState.evaluation.level1.itemsPlaced++;
    
    // Lula dice un cumplido
    narrator.speak(`¡Sí! La ${card.dataset.name} vive en la/el ${habitatId}.`);
    
    // Verificar si ya terminó
    if (gameState.evaluation.level1.itemsPlaced === gameState.evaluation.level1.totalItems) {
        gameState.evaluation.level1.completed = true;
        setTimeout(completeLevel, 1000);
    }
}

function handleLevel1Error(card, habitatId) {
    audioSynth.playIncorrect();
    gameState.evaluation.level1.errors++;
    
    // Agitar la tarjeta temporalmente
    card.style.animation = "shake 0.4s ease";
    setTimeout(() => card.style.animation = "", 400);
    
    // Lula da una pista amigable
    narrator.speak(`Oh, la ${card.dataset.name} no se siente cómoda en el ${habitatId}. ¡Intenta en otro lugar!`);
}

// Animación de sacudida
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
}`, styleSheet.cssRules.length);


// ================= INTERFAZ NIVEL 2: CUIDA LAS PLANTAS =================
function renderLevel2(parent, config) {
    const container = document.createElement("div");
    container.className = "level-container";
    
    // Planta en el escenario central
    const stage = document.createElement("div");
    stage.className = "central-stage";
    stage.style.marginBottom = "10px";
    stage.innerHTML = `<span class="central-stage-graphic" id="plant-graphic">🌱</span>`;
    container.appendChild(stage);
    
    // Grid de Acciones
    const grid = document.createElement("div");
    grid.className = "action-cards-grid";
    
    const activeItems = config.items.filter(item => item.age.includes(gameState.age));
    
    const correctCount = activeItems.filter(i => i.correct).length;
    gameState.evaluation.level2.correctSelected = 0;
    gameState.evaluation.level2.errors = 0;
    
    activeItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "action-card";
        card.dataset.id = item.id;
        card.dataset.correct = item.correct;
        card.dataset.name = item.name;
        
        card.innerHTML = `
            <span class="action-icon">${item.emoji}</span>
            <span class="action-text">${item.name}</span>
        `;
        
        card.addEventListener("click", () => {
            if (card.classList.contains("selected-correct") || card.classList.contains("selected-incorrect")) return;
            
            if (item.correct) {
                audioSynth.playWater();
                card.classList.add("selected-correct");
                gameState.evaluation.level2.correctSelected++;
                
                // Animación de crecimiento de planta
                const plant = document.getElementById("plant-graphic");
                if (gameState.evaluation.level2.correctSelected === 1) {
                    plant.innerText = "🌿";
                    plant.style.transform = "scale(1.15)";
                    narrator.speak(`¡Muy bien! ${item.name} ayuda a que la planta viva.`);
                } else if (gameState.evaluation.level2.correctSelected === correctCount) {
                    plant.innerText = "🌻";
                    plant.style.transform = "scale(1.3)";
                    narrator.speak(`¡Eso es! La planta ha crecido hermosa y feliz.`, () => {
                        gameState.evaluation.level2.completed = true;
                        completeLevel();
                    });
                }
            } else {
                audioSynth.playIncorrect();
                card.classList.add("selected-incorrect");
                gameState.evaluation.level2.errors++;
                narrator.speak(`¡Cuidado! ${item.name} lastima a las plantas y no las deja respirar. ¡Elige solo lo bueno!`);
            }
        });
        
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
    parent.appendChild(container);
}


// ================= INTERFAZ NIVEL 3: AMIGOS DE LOS ANIMALES =================
function renderLevel3(parent, config) {
    const container = document.createElement("div");
    container.className = "level-container";
    
    // Escenario central con animalito
    const stage = document.createElement("div");
    stage.className = "central-stage";
    stage.style.borderColor = "#ffcc80";
    stage.style.marginBottom = "10px";
    stage.innerHTML = `<span class="central-stage-graphic" id="animal-graphic">🐶</span>`;
    container.appendChild(stage);
    
    // Grid de Acciones
    const grid = document.createElement("div");
    grid.className = "action-cards-grid";
    
    const activeItems = config.items.filter(item => item.age.includes(gameState.age));
    const correctCount = activeItems.filter(i => i.correct).length;
    gameState.evaluation.level3.correctSelected = 0;
    gameState.evaluation.level3.errors = 0;
    
    activeItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "action-card";
        card.dataset.id = item.id;
        card.dataset.correct = item.correct;
        card.dataset.name = item.name;
        
        card.innerHTML = `
            <span class="action-icon">${item.emoji}</span>
            <span class="action-text">${item.name}</span>
        `;
        
        card.addEventListener("click", () => {
            if (card.classList.contains("selected-correct") || card.classList.contains("selected-incorrect")) return;
            
            if (item.correct) {
                audioSynth.playCorrect();
                card.classList.add("selected-correct");
                gameState.evaluation.level3.correctSelected++;
                
                // Cambiar reacción del animal central
                const animal = document.getElementById("animal-graphic");
                if (gameState.evaluation.level3.correctSelected === 1) {
                    animal.innerText = "😺";
                    narrator.speak(`¡Excelente! ${item.name} demuestra empatía y amor.`);
                } else if (gameState.evaluation.level3.correctSelected === correctCount) {
                    animal.innerText = "🦜✨";
                    narrator.speak(`¡Perfecto! Has demostrado ser un verdadero protector de los animales.`, () => {
                        gameState.evaluation.level3.completed = true;
                        completeLevel();
                    });
                }
            } else {
                audioSynth.playIncorrect();
                card.classList.add("selected-incorrect");
                gameState.evaluation.level3.errors++;
                narrator.speak(`Oh no, ${item.name} asusta y lastima a los animales. Ellos sienten dolor como nosotros.`);
            }
        });
        
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
    parent.appendChild(container);
}


// ================= INTERFAZ NIVEL 4: CLASIFICACIÓN DE ACCIONES =================
function renderLevel4(parent, config) {
    const container = document.createElement("div");
    container.className = "level-container";
    
    // Cajas de Clasificación
    const rowBoxes = document.createElement("div");
    rowBoxes.className = "sorting-boxes-row";
    
    config.boxes.forEach(boxConf => {
        const box = document.createElement("div");
        box.className = `sorting-box ${boxConf.type === 'good' ? 'box-good' : 'box-bad'}`;
        box.dataset.box = boxConf.id;
        box.innerHTML = `
            <div class="box-header">${boxConf.name}</div>
            <div class="box-items-container" id="box-items-${boxConf.id}"></div>
        `;
        
        box.addEventListener("dragover", e => e.preventDefault());
        box.addEventListener("dragenter", () => box.classList.add("drag-over"));
        box.addEventListener("dragleave", () => box.classList.remove("drag-over"));
        box.addEventListener("drop", handleLevel4Drop);
        
        box.addEventListener("click", () => handleLevel4TargetClick(boxConf.id));
        
        rowBoxes.appendChild(box);
    });
    container.appendChild(rowBoxes);
    
    // Filtrar elementos por edad
    const activeItems = config.items.filter(item => item.age.includes(gameState.age));
    gameState.evaluation.level4.totalItems = activeItems.length;
    gameState.evaluation.level4.itemsPlaced = 0;
    gameState.evaluation.level4.errors = 0;
    
    // Fila de elementos arrastrables
    const rowDrags = document.createElement("div");
    rowDrags.className = "draggable-items-row";
    rowDrags.id = "level4-draggables";
    
    const shuffledItems = [...activeItems].sort(() => Math.random() - 0.5);
    
    shuffledItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";
        card.style.width = "78px";
        card.style.height = "78px";
        // Si tiene 3 años, colorear el borde según la caja como pista
        if (gameState.age === 3) {
            card.style.borderColor = item.target === "cuidamos" ? "#81c784" : "#e57373";
        }
        card.draggable = true;
        card.id = `drag4-${item.id}`;
        card.dataset.id = item.id;
        card.dataset.target = item.target;
        card.dataset.emoji = item.emoji;
        card.dataset.name = item.name;
        
        card.innerHTML = `
            <span class="item-graphic" style="font-size: 1.8rem;">${item.emoji}</span>
            <span class="item-label" style="font-size: 0.7rem; line-height: 1.1;">${item.name}</span>
        `;
        
        card.addEventListener("dragstart", handleLevel4DragStart);
        card.addEventListener("click", (e) => {
            e.stopPropagation();
            handleLevel4ItemClick(card);
        });
        
        rowDrags.appendChild(card);
    });
    
    container.appendChild(rowDrags);
    parent.appendChild(container);
}

function handleLevel4DragStart(e) {
    audioSynth.playPop();
    e.dataTransfer.setData("text/plain", e.target.id);
}

function handleLevel4ItemClick(card) {
    audioSynth.playPop();
    document.querySelectorAll(".item-card").forEach(c => c.style.boxShadow = "");
    
    if (gameState.selectedDraggableId === card.id) {
        gameState.selectedDraggableId = null;
    } else {
        gameState.selectedDraggableId = card.id;
        card.style.boxShadow = "0 0 12px #2e7d32";
        narrator.speak(`¿${card.dataset.name} es algo que cuida o no cuida la naturaleza?`);
    }
}

function handleLevel4TargetClick(boxId) {
    if (!gameState.selectedDraggableId) return;
    
    const card = document.getElementById(gameState.selectedDraggableId);
    if (!card) return;
    
    if (card.dataset.target === boxId) {
        placeLevel4Item(card, boxId);
    } else {
        handleLevel4Error(card, boxId);
    }
}

function handleLevel4Drop(e) {
    e.preventDefault();
    const box = e.currentTarget;
    box.classList.remove("drag-over");
    
    const dragId = e.dataTransfer.getData("text/plain");
    const card = document.getElementById(dragId);
    if (!card) return;
    
    if (card.dataset.target === box.dataset.box) {
        placeLevel4Item(card, box.dataset.box);
    } else {
        handleLevel4Error(card, box.dataset.box);
    }
}

function placeLevel4Item(card, boxId) {
    audioSynth.playCorrect();
    const boxContainer = document.getElementById(`box-items-${boxId}`);
    
    const mini = document.createElement("span");
    mini.style.fontSize = "2rem";
    mini.style.animation = "lulaBounce 0.4s ease-out";
    mini.innerText = card.dataset.emoji;
    mini.title = card.dataset.name;
    boxContainer.appendChild(mini);
    
    card.remove();
    gameState.selectedDraggableId = null;
    
    gameState.evaluation.level4.itemsPlaced++;
    
    const isGood = boxId === "cuidamos";
    narrator.speak(`¡Excelente! ${card.dataset.name} es una acción que ${isGood ? 'SÍ' : 'NO'} cuida la naturaleza.`);
    
    if (gameState.evaluation.level4.itemsPlaced === gameState.evaluation.level4.totalItems) {
        gameState.evaluation.level4.completed = true;
        setTimeout(completeLevel, 1000);
    }
}

function handleLevel4Error(card, boxId) {
    audioSynth.playIncorrect();
    gameState.evaluation.level4.errors++;
    
    card.style.animation = "shake 0.4s ease";
    setTimeout(() => card.style.animation = "", 400);
    
    const isGoodBox = boxId === "cuidamos";
    narrator.speak(`Piensa con cuidado. ¿${card.dataset.name} realmente ${isGoodBox ? 'ayuda' : 'daña'} a la naturaleza?`);
}


// ================= INTERFAZ NIVEL 5: LIMPIEZA DEL PARQUE =================
function renderLevel5(parent, config) {
    const container = document.createElement("div");
    container.className = "level-container";
    
    // Parque (Zona donde estará la basura tirada)
    const park = document.createElement("div");
    park.className = "park-canvas";
    park.innerHTML = `
        <div class="park-decorations">
            <span class="park-tree tree-1">🌳</span>
            <span class="park-bush bush-1">🌿</span>
            <span class="park-bush bush-2">🌱</span>
            <span class="park-tree tree-2">🌲</span>
        </div>
    `;
    
    // Filtrar la basura por edad
    const activeTrash = config.items.filter(item => item.age.includes(gameState.age));
    gameState.evaluation.level5.totalItems = activeTrash.length;
    gameState.evaluation.level5.itemsPlaced = 0;
    gameState.evaluation.level5.errors = 0;
    
    // Generar basura en coordenadas aleatorias dentro del parque
    activeTrash.forEach((item, index) => {
        const trash = document.createElement("div");
        trash.className = "litter-item";
        trash.id = `trash-${item.id}`;
        trash.dataset.id = item.id;
        trash.dataset.target = item.target;
        trash.dataset.emoji = item.emoji;
        trash.dataset.name = item.name;
        trash.draggable = true;
        trash.style.fontSize = "2.3rem";
        
        // Pista de color en borde si tiene 3 años
        if (gameState.age === 3) {
            trash.style.border = item.target === "organico" ? "3px solid #8d6e63" : "3px solid #0288d1";
            trash.style.borderRadius = "50%";
            trash.style.backgroundColor = "rgba(255,255,255,0.7)";
            trash.style.padding = "3px";
        }
        
        // Coordenadas esparcidas por el parque
        // Anchura: 15% a 85%, Altura: 25% a 70%
        const xPos = 15 + Math.random() * 65;
        const yPos = 25 + Math.random() * 45;
        
        trash.style.left = `${xPos}%`;
        trash.style.top = `${yPos}%`;
        
        trash.innerText = item.emoji;
        
        trash.addEventListener("dragstart", handleLevel5DragStart);
        trash.addEventListener("click", (e) => {
            e.stopPropagation();
            handleLevel5ItemClick(trash);
        });
        
        park.appendChild(trash);
    });
    
    container.appendChild(park);
    
    // Contenedores / Botes
    const binsRow = document.createElement("div");
    binsRow.className = "trash-bins-row";
    
    config.bins.forEach(binConf => {
        const bin = document.createElement("div");
        bin.className = `trash-bin bin-${binConf.id}`;
        bin.dataset.bin = binConf.id;
        bin.innerHTML = `
            <span class="bin-logo">${binConf.logo}</span>
            <span class="bin-label">${binConf.name}</span>
        `;
        
        bin.addEventListener("dragover", e => e.preventDefault());
        bin.addEventListener("dragenter", () => bin.classList.add("drag-over"));
        bin.addEventListener("dragleave", () => bin.classList.remove("drag-over"));
        bin.addEventListener("drop", handleLevel5Drop);
        
        bin.addEventListener("click", () => handleLevel5TargetClick(binConf.id));
        
        binsRow.appendChild(bin);
    });
    
    container.appendChild(binsRow);
    parent.appendChild(container);
}

function handleLevel5DragStart(e) {
    audioSynth.playPop();
    e.dataTransfer.setData("text/plain", e.target.id);
}

function handleLevel5ItemClick(trashCard) {
    audioSynth.playPop();
    document.querySelectorAll(".litter-item").forEach(t => t.style.boxShadow = "");
    
    if (gameState.selectedDraggableId === trashCard.id) {
        gameState.selectedDraggableId = null;
    } else {
        gameState.selectedDraggableId = trashCard.id;
        trashCard.style.boxShadow = "0 0 10px #ff9100";
        narrator.speak(`Recoge la ${trashCard.dataset.name}. ¿Va en Orgánico o Reciclable?`);
    }
}

function handleLevel5TargetClick(binId) {
    if (!gameState.selectedDraggableId) return;
    
    const trash = document.getElementById(gameState.selectedDraggableId);
    if (!trash) return;
    
    if (trash.dataset.target === binId) {
        placeLevel5Item(trash, binId);
    } else {
        handleLevel5Error(trash, binId);
    }
}

function handleLevel5Drop(e) {
    e.preventDefault();
    const bin = e.currentTarget;
    bin.classList.remove("drag-over");
    
    const dragId = e.dataTransfer.getData("text/plain");
    const trash = document.getElementById(dragId);
    if (!trash) return;
    
    if (trash.dataset.target === bin.dataset.bin) {
        placeLevel5Item(trash, bin.dataset.bin);
    } else {
        handleLevel5Error(trash, bin.dataset.bin);
    }
}

function placeLevel5Item(trash, binId) {
    audioSynth.playCorrect();
    trash.remove();
    gameState.selectedDraggableId = null;
    
    gameState.evaluation.level5.itemsPlaced++;
    
    narrator.speak(`¡Excelente! Depositaste la/el ${trash.dataset.name} en el contenedor ${binId === 'organico' ? 'Orgánico' : 'Reciclable'}.`);
    
    // Adaptación por Equipos: Alternar turno a mitad de basura en nivel 5 para cooperar
    const half = Math.floor(gameState.evaluation.level5.totalItems / 2);
    if (gameState.isTeamPlay && gameState.evaluation.level5.itemsPlaced === half) {
        switchPlayerTurn();
        narrator.speak(`¡Muy bien! Ahora es el turno del ${gameState.players[gameState.activePlayerIdx]} para recoger la basura restante.`);
    }
    
    if (gameState.evaluation.level5.itemsPlaced === gameState.evaluation.level5.totalItems) {
        gameState.evaluation.level5.completed = true;
        setTimeout(completeLevel, 1000);
    }
}

function handleLevel5Error(trash, binId) {
    audioSynth.playIncorrect();
    gameState.evaluation.level5.errors++;
    
    trash.style.animation = "shake 0.4s ease";
    setTimeout(() => trash.style.animation = "", 400);
    
    const isOrganic = trash.dataset.target === "organico";
    if (isOrganic) {
        narrator.speak(`La/el ${trash.dataset.name} es comida o resto natural. Va en Orgánico.`);
    } else {
        narrator.speak(`La/el ${trash.dataset.name} es plástico, metal o cartón. Va en Reciclable.`);
    }
}


// ================= PREGUNTAS REFLEXIVAS (EDAD 5 AÑOS) =================
function showReflectionOverlay() {
    const parent = document.getElementById("level-workspace");
    const qData = REFLECTION_QUESTIONS[gameState.currentLevel];
    
    const overlay = document.createElement("div");
    overlay.className = "reflection-overlay";
    
    const qText = document.createElement("div");
    qText.className = "reflection-question";
    qText.innerText = `💬 Lula pregunta:\n"${qData.question}"`;
    overlay.appendChild(qText);
    
    const optionsRow = document.createElement("div");
    optionsRow.className = "reflection-options";
    
    qData.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "reflection-opt-btn";
        btn.innerText = opt.text;
        
        btn.addEventListener("click", () => {
            // Guardar respuesta en la evaluación
            gameState.evaluation.reflections.push({
                level: gameState.currentLevel,
                question: qData.question,
                selected: opt.text,
                correct: opt.correct
            });
            
            if (opt.correct) {
                audioSynth.playCorrect();
                btn.style.backgroundColor = "#c8e6c9";
                narrator.speak("¡Excelente reflexión, Guardián de la Naturaleza! Qué hermosa manera de pensar.", () => {
                    overlay.remove();
                    advanceLevel();
                });
            } else {
                audioSynth.playIncorrect();
                btn.style.backgroundColor = "#ffcdd2";
                
                // Lula explica brevemente la opción correcta
                const correctOptText = qData.options.find(o => o.correct).text;
                narrator.speak(`¡Piensa un poco más! ${correctOptText}`, () => {
                    overlay.remove();
                    advanceLevel();
                });
            }
        });
        
        optionsRow.appendChild(btn);
    });
    
    overlay.appendChild(optionsRow);
    parent.appendChild(overlay);
    
    // Locución de la pregunta y opciones
    const speechText = `${qData.question}... Opción uno: ${qData.options[0].text}... Opción dos: ${qData.options[1].text}`;
    narrator.speak(speechText);
}


// ================= PANTALLA DIPLOMA FINAL =================
function showVictoryScreen() {
    switchScreen("screen-gameplay", "screen-victory");
    
    // Colocar nombres en el diploma
    const nameDisplay = document.getElementById("diploma-player-name");
    if (gameState.isTeamPlay) {
        nameDisplay.innerText = `${gameState.players[0]} y ${gameState.players[1]}`;
    } else {
        nameDisplay.innerText = gameState.players[0];
    }
    
    // Mostrar insignias logradas
    const badgePlants = document.getElementById("diploma-badge-plants");
    const badgeAnimals = document.getElementById("diploma-badge-animals");
    
    if (gameState.badges.plants) badgePlants.classList.add("unlocked");
    else badgePlants.classList.remove("unlocked");
    
    if (gameState.badges.animals) badgeAnimals.classList.add("unlocked");
    else badgeAnimals.classList.remove("unlocked");
    
    // Rellenar estrellas ganadas
    const starsContainer = document.getElementById("diploma-stars-list");
    starsContainer.innerText = "⭐".repeat(gameState.stars.filter(s => s).length);
    
    // Fecha actual
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const today  = new Date();
    document.getElementById("diploma-current-date").innerText = `Fecha: ${today.toLocaleDateString("es-ES", options)}`;
    
    // Iniciar confeti flotante
    startConfetti();
    
    // Lula da felicitaciones finales
    const nombreGanador = gameState.isTeamPlay ? "Guardianes" : gameState.players[0];
    const felicitacionFinal = `¡Muchas felicidades ${nombreGanador}! Has completado todas las misiones. Ahora eres un Guardián de la Naturaleza oficial. ¡Imprime tu diploma para colgarlo en el salón!`;
    narrator.speak(felicitacionFinal);
}


// ================= MOTOR DE CONFETI EN CANVAS =================
let confettiActive = false;
function startConfetti() {
    const canvas = document.getElementById("victory-confetti");
    const ctx = canvas.getContext("2d");
    
    // Ajustar resolución
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    const colors = ["#4caf50", "#81c784", "#ffeb3b", "#ff9800", "#e91e63", "#00bcd4"];
    const pieces = [];
    
    for (let i = 0; i < 75; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            size: 6 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: 2 + Math.random() * 4,
            angle: Math.random() * 360,
            rotationSpeed: -4 + Math.random() * 8
        });
    }
    
    confettiActive = true;
    
    function update() {
        if (!confettiActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        pieces.forEach(p => {
            p.y += p.speed;
            p.angle += p.rotationSpeed;
            
            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });
        
        requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}


// ================= EVALUACIÓN DOCENTE / PASARELA DE SEGURIDAD =================
let gateMathAnswerCorrect = 0;

function openGateModal() {
    const num1 = Math.floor(2 + Math.random() * 6);
    const num2 = Math.floor(1 + Math.random() * 5);
    gateMathAnswerCorrect = num1 + num2;
    
    document.getElementById("gate-math-text").innerText = `${num1} + ${num2} = ?`;
    document.getElementById("gate-math-answer").value = "";
    document.getElementById("gate-error-message").classList.add("hidden");
    
    document.getElementById("modal-gate").classList.add("active");
}

function verifyGateMath() {
    const ans = parseInt(document.getElementById("gate-math-answer").value.trim());
    if (ans === gateMathAnswerCorrect) {
        audioSynth.playCorrect();
        // Cerrar gate y abrir evaluación
        document.getElementById("modal-gate").classList.remove("active");
        openTeacherDashboard();
    } else {
        audioSynth.playIncorrect();
        document.getElementById("gate-error-message").classList.remove("hidden");
    }
}

function openTeacherDashboard() {
    // Rellenar datos
    const activeNames = gameState.isTeamPlay ? `${gameState.players[0]} y ${gameState.players[1]}` : gameState.players[0];
    document.getElementById("eval-student-info").innerHTML = `<strong>Alumno(s):</strong> ${activeNames} | <strong>Edad:</strong> ${gameState.age} años | <strong>Modo:</strong> ${gameState.isTeamPlay ? 'Equipos' : 'Individual'}`;
    
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateStr = new Date().toLocaleDateString("es-ES", options);
    document.getElementById("eval-date-info").innerHTML = `<strong>Fecha:</strong> ${dateStr}`;
    
    // KPI 1: Nivel 1 Hábitats
    const lvl1 = gameState.evaluation.level1;
    if (lvl1.completed) {
        document.getElementById("eval-kpi-1").innerHTML = `<span class="kpi-success">Logrado ✔️</span><br>Ubicó ${lvl1.itemsPlaced}/${lvl1.totalItems} elementos. Errores: ${lvl1.errors}.`;
    } else {
        document.getElementById("eval-kpi-1").className = "kpi-pending";
        document.getElementById("eval-kpi-1").innerText = "No completado o en progreso.";
    }
    
    // KPI 2: Nivel 2 Cuidado Plantas
    const lvl2 = gameState.evaluation.level2;
    if (lvl2.completed) {
        document.getElementById("eval-kpi-2").innerHTML = `<span class="kpi-success">Logrado ✔️</span><br>Identificó acciones correctas. Errores de selección: ${lvl2.errors}.`;
    } else {
        document.getElementById("eval-kpi-2").className = "kpi-pending";
        document.getElementById("eval-kpi-2").innerText = "No completado o en progreso.";
    }
    
    // KPI 3: Nivel 3 Empatía Animal
    const lvl3 = gameState.evaluation.level3;
    if (lvl3.completed) {
        document.getElementById("eval-kpi-3").innerHTML = `<span class="kpi-success">Logrado ✔️</span><br>Mostró actitudes de empatía y cuidado. Errores de selección: ${lvl3.errors}.`;
    } else {
        document.getElementById("eval-kpi-3").className = "kpi-pending";
        document.getElementById("eval-kpi-3").innerText = "No completado o en progreso.";
    }
    
    // KPI 4: Nivel 4 Clasifica Acciones
    const lvl4 = gameState.evaluation.level4;
    if (lvl4.completed) {
        document.getElementById("eval-kpi-4").innerHTML = `<span class="kpi-success">Logrado ✔️</span><br>Clasificó ${lvl4.itemsPlaced}/${lvl4.totalItems} conductas socioambientales. Errores: ${lvl4.errors}.`;
    } else {
        document.getElementById("eval-kpi-4").className = "kpi-pending";
        document.getElementById("eval-kpi-4").innerText = "No completado o en progreso.";
    }
    
    // KPI 5: Nivel 5 Reciclaje
    const lvl5 = gameState.evaluation.level5;
    if (lvl5.completed) {
        document.getElementById("eval-kpi-5").innerHTML = `<span class="kpi-success">Logrado ✔️</span><br>Depositó ${lvl5.itemsPlaced}/${lvl5.totalItems} residuos en botes adecuados. Errores: ${lvl5.errors}.`;
    } else {
        document.getElementById("eval-kpi-5").className = "kpi-pending";
        document.getElementById("eval-kpi-5").innerText = "No completado o en progreso.";
    }
    
    // Rellenar reflexiones de 5 años si aplica
    const reflectionsList = document.getElementById("eval-reflections-list");
    reflectionsList.innerHTML = "";
    
    if (gameState.age !== 5) {
        reflectionsList.innerHTML = "<li><em>No aplica: La edad del alumno registrada es menor de 5 años (no se habilitan preguntas reflexivas).</em></li>";
    } else if (gameState.evaluation.reflections.length === 0) {
        reflectionsList.innerHTML = "<li><em>Aún no se han respondido preguntas reflexivas en esta partida.</em></li>";
    } else {
        gameState.evaluation.reflections.forEach(ref => {
            reflectionsList.innerHTML += `
                <li>
                    <strong>Nivel ${ref.level} - Pregunta:</strong> ${ref.question}<br>
                    <strong>Respuesta elegida:</strong> "${ref.selected}" <span style="font-weight:bold; color:${ref.correct ? '#2e7d32' : '#e53935'}">(${ref.correct ? 'Correcta ✔️' : 'Incorrecta ✖'})</span>
                </li>
            `;
        });
    }
    
    // Abrir Modal
    document.getElementById("modal-teacher-dashboard").classList.add("active");
}

function resetEvaluationData() {
    gameState.evaluation = {
        level1: { completed: false, errors: 0, itemsPlaced: 0, totalItems: 0 },
        level2: { completed: false, errors: 0, correctSelected: 0 },
        level3: { completed: false, errors: 0, correctSelected: 0 },
        level4: { completed: false, errors: 0, itemsPlaced: 0, totalItems: 0 },
        level5: { completed: false, errors: 0, itemsPlaced: 0, totalItems: 0 },
        reflections: []
    };
    gameState.stars = [false, false, false, false, false];
    gameState.badges.plants = false;
    gameState.badges.animals = false;
    
    updateStarsHUD();
    updateBadgesHUD();
}
