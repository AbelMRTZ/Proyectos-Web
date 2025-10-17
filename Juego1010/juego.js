// Define el tamaño de cada celda en las piezas como 20 píxeles
const CELDA_SIZE = 20;

// Define el tamaño de cada celda en el tablero como 27 píxeles
const TABLERO_SIZE = 27;

// Obtiene el array de piezas desde sessionStorage y lo parsea de JSON a objeto JavaScript
let array = JSON.parse(sessionStorage.getItem('array')) || []

// Obtiene la matriz del tablero desde sessionStorage y lo parsea de JSON a objeto JavaScript
let matriz = JSON.parse(sessionStorage.getItem('matriz'));

// Obtiene la puntuación desde sessionStorage y la convierte a número entero
let puntuacion = parseInt(sessionStorage.getItem('puntuacion'));

// Obtiene el número de piezas colocadas desde sessionStorage y lo convierte a número entero
let nPiezas = parseInt(sessionStorage.getItem('nPiezas'));

// Variable para almacenar la pieza que se está arrastrando actualmente (inicialmente null)
let piezaArrastrada = null;

// Objeto para almacenar la posición original de la pieza que se está arrastrando
let originalPos = { x: 0, y: 0 };

// Variable para almacenar la referencia al canvas del tablero (inicialmente null)
let tableroCanvas = null;

// Función para obtener las piezas desde el servidor
function obtenerPiezas() {
    fetch("api/piezas")
    .then(response => {
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        const zona_piezas = document.querySelector('.piezas_canvas');
        zona_piezas.innerHTML = '';
        
        // Limpia el array existente y asigna las nuevas piezas
        array = data.FILAS; // <-- Cambio clave aquí
        
        array.forEach(item => crearCanvas(item));
        sessionStorage.setItem('array', JSON.stringify(array));
        terminarJuego();
    })
    .catch(error => {
        console.error('Error al obtener datos:', error);
    });
}

// Función para crear un canvas para una pieza
function crearCanvas(pieza) {
    // Selecciona el contenedor de piezas
    const container = document.querySelector('.piezas_canvas');
    // Crea un elemento canvas
    const canvas = document.createElement('canvas');
    // Obtiene el contexto 2D del canvas
    const ctx = canvas.getContext('2d');
    // Añade la clase 'canvas_ind' al canvas
    canvas.classList.add('canvas_ind');

    // Calcula el alto del canvas basado en la pieza
    const alto = pieza.length * CELDA_SIZE;
    // Calcula el ancho del canvas basado en la pieza
    const ancho = pieza[0].length * CELDA_SIZE;

    // Establece el ancho del canvas
    canvas.width = ancho;
    // Establece el alto del canvas
    canvas.height = alto;
    // Hace el canvas arrastrable
    canvas.draggable = true;
    // Almacena los datos de la pieza en una propiedad del canvas
    canvas.matrizData = pieza;

    // Recorre las filas de la pieza
    for (let i = 0; i < pieza.length; i++) {
        // Recorre las columnas de cada fila
        for (let j = 0; j < pieza[i].length; j++) {
            // Obtiene el color de la celda actual
            const color = pieza[i][j];
            // Si el color no es 0 (no es vacío)
            if (color !== 0) {
                // Establece el color de relleno
                ctx.fillStyle = color;
                // Dibuja el rectángulo relleno
                ctx.fillRect(j * CELDA_SIZE, i * CELDA_SIZE, CELDA_SIZE, CELDA_SIZE);
                // Establece el color del borde
                ctx.strokeStyle = '#000000';
                // Dibuja el borde del rectángulo
                ctx.strokeRect(j * CELDA_SIZE, i * CELDA_SIZE, CELDA_SIZE, CELDA_SIZE);
            }
        }
    }

    // Añade event listener para cuando comienza el arrastre
    canvas.addEventListener('dragstart', (e) => {
        // Establece la pieza arrastrada como este canvas
        piezaArrastrada = canvas;
        // Guarda la posición original X
        originalPos.x = canvas.offsetLeft;
        // Guarda la posición original Y
        originalPos.y = canvas.offsetTop;
        // Establece los datos que se transferirán durante el arrastre
        e.dataTransfer.setData('text/plain', JSON.stringify({
            matriz: canvas.matrizData,
            offsetX: e.offsetX,
            offsetY: e.offsetY
        }));
        // Permite solo la operación de mover
        e.dataTransfer.effectAllowed = 'move';
        // Reduce la opacidad durante el arrastre
        canvas.style.opacity = '0.5';
    });

    // Añade event listener para cuando termina el arrastre
    canvas.addEventListener('dragend', (e) => {
        // Restaura la opacidad
        canvas.style.opacity = '1';
        // Si no se completó el drop
        if (e.dataTransfer.dropEffect === 'none') {
            // Restaura el estilo de posición
            canvas.style.position = '';
            // Restaura el z-index
            canvas.style.zIndex = '';
            // Restaura la posición left
            canvas.style.left = '';
            // Restaura la posición top
            canvas.style.top = '';
            // Selecciona el contenedor de piezas
            const zonaPiezas = document.querySelector('.piezas_canvas');
            // Añade el canvas de vuelta al contenedor
            zonaPiezas.appendChild(canvas);
        }
        // Limpia la referencia a la pieza arrastrada
        piezaArrastrada = null;
    });

    // Añade el canvas al contenedor
    container.appendChild(canvas);
}

// Función para dibujar el tablero
function tablero(matriz) {
    // Actualiza la visualización de piezas y puntuación
    ActPiezasPuntuacion();
    // Selecciona el contenedor del tablero
    const container = document.querySelector('.tablero_juego');
    // Limpia el contenedor
    container.innerHTML = '';

    // Crea un elemento canvas
    const canvas = document.createElement('canvas');
    // Obtiene el contexto 2D
    const ctx = canvas.getContext('2d');
    // Añade la clase al canvas
    canvas.classList.add('canvas_ind_tablero');

    // Calcula el alto del tablero
    const alto = matriz.length * TABLERO_SIZE;
    // Calcula el ancho del tablero
    const ancho = matriz[0].length * TABLERO_SIZE;

    // Establece el ancho del canvas
    canvas.width = ancho;
    // Establece el alto del canvas
    canvas.height = alto;

    // Recorre las filas de la matriz
    for (let i = 0; i < matriz.length; i++) {
        // Recorre las columnas de cada fila
        for (let j = 0; j < matriz[i].length; j++) {
            // Obtiene el color de la celda
            const color = matriz[i][j];
            // Establece el color de relleno (blanco si es 0)
            ctx.fillStyle = color !== 0 ? color : '#ffffff';
            // Dibuja el rectángulo relleno
            ctx.fillRect(j * TABLERO_SIZE, i * TABLERO_SIZE, TABLERO_SIZE, TABLERO_SIZE);
            // Establece el color del borde
            ctx.strokeStyle = '#000000';
            // Dibuja el borde del rectángulo
            ctx.strokeRect(j * TABLERO_SIZE, i * TABLERO_SIZE, TABLERO_SIZE, TABLERO_SIZE);
        }
    }

    // Añade event listener para cuando se arrastra sobre el tablero
    canvas.addEventListener('dragover', (e) => {
        // Previene el comportamiento por defecto
        e.preventDefault();
        // Establece el efecto de mover
        e.dataTransfer.dropEffect = 'move';
    });

    // Añade event listener para cuando se suelta una pieza en el tablero
    canvas.addEventListener('drop', (e) => {
        // Previene el comportamiento por defecto
        e.preventDefault();
        // Obtiene los datos transferidos
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        // Obtiene la matriz de la pieza
        const pieza = data.matriz;
        // Obtiene el elemento canvas de la pieza arrastrada
        const canvasElement = piezaArrastrada;

        // Obtiene las dimensiones y posición del canvas
        const rect = canvas.getBoundingClientRect();
        // Calcula la posición X relativa
        const xRel = e.clientX - rect.left;
        // Calcula la posición Y relativa
        const yRel = e.clientY - rect.top;
        // Calcula la fila donde se intenta colocar
        const fila = Math.floor(yRel / TABLERO_SIZE) - 2;
        // Calcula la columna donde se intenta colocar
        const col = Math.floor(xRel / TABLERO_SIZE) - 2;

        // Bandera para verificar si se puede insertar
        let puedeInsertarse = true;

        // Verifica si la pieza puede colocarse en la posición
        for (let i = 0; i < pieza.length; i++) {
            for (let j = 0; j < pieza[i].length; j++) {
                if (pieza[i][j] !== 0) {
                    // Calcula la posición en el tablero
                    const filaTablero = fila + i;
                    const colTablero = col + j;
                    // Verifica límites y si la celda está ocupada
                    if (
                        filaTablero < 0 || filaTablero >= matriz.length ||
                        colTablero < 0 || colTablero >= matriz[0].length ||
                        matriz[filaTablero][colTablero] !== 0
                    ) {
                        // No se puede insertar
                        puedeInsertarse = false;
                    }
                }
            }
        }

        // Si se puede insertar
        if (puedeInsertarse) {
            // Coloca la pieza en el tablero
            for (let i = 0; i < pieza.length; i++) {
                for (let j = 0; j < pieza[i].length; j++) {
                    if (pieza[i][j] !== 0) {
                        // Asigna el color a la celda del tablero
                        matriz[fila + i][col + j] = pieza[i][j];
                        // Incrementa la puntuación
                        puntuacion++;
                    }
                }
            }
            // Guarda la puntuación en sessionStorage
            sessionStorage.setItem('puntuacion', puntuacion);
            // Incrementa el contador de piezas
            nPiezas++;
            // Guarda el contador en sessionStorage
            sessionStorage.setItem('nPiezas', nPiezas);
            // Guarda la matriz actualizada
            sessionStorage.setItem('matriz', JSON.stringify(matriz));

            // Elimina el canvas de la pieza colocada
            canvasElement.remove();
            // Filtra la pieza del array
            array = array.filter(p => !matricesIguales(p, pieza));
            // Guarda el array actualizado
            sessionStorage.setItem('array', JSON.stringify(array));

            // Redibuja el tablero
            tablero(matriz);
            // Verifica si hay líneas completas
            comprobarEliminacion();

            // Si no quedan piezas
            const zonaPiezas = document.querySelector('.piezas_canvas');
            if (zonaPiezas.children.length === 0) {
                // Reinicia el array
                array = [];
                // Guarda el array vacío
                sessionStorage.setItem('array', JSON.stringify(array));
                // Obtiene nuevas piezas
                obtenerPiezas();
            }
        } else {
            // Si no se puede colocar, restaura la pieza a su posición original
            canvasElement.style.position = '';
            canvasElement.style.zIndex = '';
            canvasElement.style.left = '';
            canvasElement.style.top = '';
            // Selecciona el contenedor de piezas
            const zonaPiezas = document.querySelector('.piezas_canvas');
            // Añade el canvas de vuelta al contenedor
            zonaPiezas.appendChild(canvasElement);
        }
    });

    // Añade el canvas al contenedor
    container.appendChild(canvas);
    // Guarda la referencia al canvas del tablero
    tableroCanvas = canvas;
}

// Selecciona el botón de terminar partida
const btn_terminar = document.getElementById('boton_terminar');
// Añade event listener para el click
btn_terminar.addEventListener('click', function (event) {
    // Previene el comportamiento por defecto
    event.preventDefault();
    // Muestra el modal de confirmación
    mensajeModal("TERMINAR PARTIDA", "¿Seguro que quieres abandonar la partida?", "index.html");
});

function matricesIguales(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

// Función para mostrar un modal
function mensajeModal(titulo, mensaje, url) {
    // Crea el elemento div del modal
    const modal = document.createElement("div");
    // Añade la clase modal
    modal.classList.add("modal");
    // Establece el HTML interno del modal
    modal.innerHTML = `
        <div class="modal-content">
            <p><strong>${titulo}</strong></p>
            <p>${mensaje}</p>
            <div class="modal-buttons">
                <button class="btn-aceptar">Aceptar</button>
                <button class="btn-cancelar">Cancelar</button>
            </div>
        </div>
    `;
    // Añade el modal al body
    document.body.appendChild(modal);
    // Añade la clase active
    modal.classList.add("active");

    // Evento para el botón cancelar
    modal.querySelector(".btn-cancelar").onclick = () => modal.remove();
    // Evento para el botón aceptar
    modal.querySelector(".btn-aceptar").onclick = () => {
        // Limpia el sessionStorage
        sessionStorage.clear();
        // Si hay URL, redirige
        if (url) {
            window.location.href = url;
        }
    };
}

// Función para actualizar la visualización de piezas y puntuación
function ActPiezasPuntuacion() {
    // Selecciona el elemento para mostrar piezas colocadas
    const piezas_colocadas = document.querySelector('.puntuacion table #pic .th_vari');
    // Establece el texto con el número de piezas
    piezas_colocadas.textContent = nPiezas;

    // Selecciona el elemento para mostrar la puntuación
    const puntuacion_conseguida = document.querySelector('.puntuacion table #puc .th_vari')
    // Establece el texto con la puntuación
    puntuacion_conseguida.textContent = puntuacion;
}

// Función para comprobar y eliminar líneas completas
function comprobarEliminacion() {
    // Crea los parámetros para la petición
    const params = new URLSearchParams();
    // Añade la matriz como parámetro
    params.append('matriz', JSON.stringify(matriz));

    // Realiza la petición al servidor
    fetch('api/tablero', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',        
        },
        body: params
        
    })
    .then(response => {
        // Si la respuesta no es OK, lanza error
        if(!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        // Convierte la respuesta a JSON
        return response.json();
        
    })
    .then(data => {
        // Si no hay líneas completas
        if(data.FILAS.length === 0) {
            // No hace nada
        } else {
            // Para cada celda a eliminar
            data.FILAS.forEach(item => {
                // Establece la celda como vacía (0)
                matriz[item.fila][item.col] = 0;
                // Incrementa la puntuación
                puntuacion++;
            })
            // Guarda la puntuación actualizada
            sessionStorage.setItem('puntuacion', puntuacion);
            // Guarda la matriz actualizada
            sessionStorage.setItem('matriz', JSON.stringify(matriz));
            // Redibuja el tablero
            tablero(matriz);
        }

        // Verifica si el juego terminó
        terminarJuego();
    }) .catch(error => {
        // Muestra el error en consola
        console.error('Error al obtener datos:', error);
    });
}

// Función de inicialización del juego
function init() {
    // Verifica si el juego ya terminó
    if (sessionStorage.getItem('juegoTerminado') === 'true') {
        // Limpia el sessionStorage
        sessionStorage.clear();
        // Redirige a la página principal
        window.location.href = 'index.html';
        return;
    }
    
    // Si no hay piezas o el array está vacío
    if (!array || array.length === 0) {
        // Inicializa el array vacío
        array = [];
        // Obtiene nuevas piezas
        obtenerPiezas();
    } else {
        // Para cada pieza en el array, crea su canvas
        array.forEach(pieza => crearCanvas(pieza));
    }

    // Si no hay matriz definida
    if (!matriz) {
        // Crea una matriz vacía (función no mostrada en el código)
        matriz = crearMatrizVacia();
        // Guarda la matriz en sessionStorage
        sessionStorage.setItem('matriz', JSON.stringify(matriz));
    }
    // Dibuja el tablero con la matriz
    tablero(matriz);
}

// Función para verificar si el juego terminó
function terminarJuego() {
    // Si no hay piezas o no hay matriz, no hace nada
    if (!array || array.length === 0 || !matriz) return;

    // Para cada pieza en el array
    for (let pieza of array) {
        // Obtiene las dimensiones de la pieza
        const pFilas = pieza.length;
        const pCols = pieza[0].length;

        // Intenta colocar la pieza en todas las posiciones posibles
        for (let fila = 0; fila <= matriz.length - pFilas; fila++) {
            for (let col = 0; col <= matriz[0].length - pCols; col++) {
                // Bandera para verificar si se puede colocar
                let sePuedeColocar = true;

                // Verifica cada celda de la pieza
                for (let i = 0; i < pFilas && sePuedeColocar; i++) {
                    for (let j = 0; j < pCols && sePuedeColocar; j++) {
                        if (pieza[i][j] !== 0) {
                            // Calcula la posición en el tablero
                            const filaTablero = fila + i;
                            const colTablero = col + j;

                            // Si la celda está ocupada
                            if (matriz[filaTablero][colTablero] !== 0) {
                                // No se puede colocar
                                sePuedeColocar = false;
                            }
                        }
                    }
                }

                // Si se puede colocar en alguna posición
                if (sePuedeColocar) {
                    // El juego no ha terminado, sale de la función
                    return;
                }
            }
        }
    }

    // Si ninguna pieza puede colocarse, muestra el modal final
    mensajeModalFinal("FIN DE LA PARTIDA","index.html");
}

// Función para mostrar el modal final del juego
function mensajeModalFinal(titulo, url) {
    // Marca el juego como terminado en sessionStorage
    sessionStorage.setItem('juegoTerminado', 'true');

    // Crea el elemento del modal
    const modal = document.createElement("div");
    // Añade la clase modal
    modal.classList.add("modal");
    // Establece el HTML interno
    modal.innerHTML = `
        <div class="modal-content">
            <p><strong>${titulo}</strong></p>
            <p>Puntos Conseguidos: ${puntuacion}</p>
            <p>Piezas Colocadas: ${nPiezas}</p>
            <div id="inputModals">
                <label for="input">Nombre: </label>
                <input type="text" id="input">
            </div>
            <div class="modal-buttons">
                <button class="btn-aceptar">Aceptar</button>
                <button class="btn-cancelar">Cancelar</button>
            </div>
        </div>
    `;
    // Añade el modal al body
    document.body.appendChild(modal);
    // Añade la clase active
    modal.classList.add("active");

    // Evento para el botón cancelar
    modal.querySelector(".btn-cancelar").onclick = () => {
        // Limpia el sessionStorage
        sessionStorage.clear();
        // Si hay URL, redirige
        if (url) {
            window.location.href = url;
        }
    };
    // Evento para el botón aceptar
    modal.querySelector(".btn-aceptar").onclick = () => {
        // Obtiene el elemento input
        const input = document.getElementById('input');
        // Obtiene y limpia el valor
        const nombre = input.value.trim();

        // Si el nombre está vacío, no hace nada
        if (nombre === "") return;

        // Crea los parámetros para la petición
        const params = new URLSearchParams();
        // Añade el nombre
        params.append("nombre", nombre);
        // Añade los puntos
        params.append("puntos", puntuacion);
        // Añade el número de piezas
        params.append("piezas", nPiezas);

        // Envía los datos al servidor
        fetch('api/puntuaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString()
        })
        .then(response => {
            // Si la respuesta no es OK, lanza error
            if(!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            // Convierte la respuesta a JSON
            return response.json();
        })
        .then(data => {
            // Limpia el sessionStorage
            sessionStorage.clear();
            // Si hay URL, redirige
            if (url) {
                window.location.href = url;
            }
        }) .catch(error => {
            // Muestra el error en consola
            console.error('Error al obtener datos:', error);
        });
    };
}

// Inicia el juego llamando a la función init
init()