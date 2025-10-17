// Constantes para controlar la paginación inicial
const REGISTRO_INICIAL = 0; // Índice del primer registro a mostrar
const CANTIDAD_DE_REGISTRO = 10; // Cantidad de registros a mostrar por página

// Referencia al botón que inicia la partida
const boton_jugar = document.getElementById('boton_jugar');

// Variables de estado para la paginación
let paginaActual = 1; // Página actual del listado de puntuaciones
let totalDatos = 0;   // Total de registros obtenidos desde la API
let totalPaginas = 0; // Total de páginas según los datos recibidos

// Si ya existe información de partida en sessionStorage, redirige directamente al juego
if (sessionStorage.getItem('infoPartida')) {
    window.location.href = "juego.html";
}

// Evento que se ejecuta cuando el usuario hace clic en el botón "Jugar"
boton_jugar.addEventListener('click', function(event) {
    event.preventDefault(); // Previene comportamiento por defecto del botón (ej. recarga)

    // Inicializa una matriz 10x10 con ceros que representará el tablero de juego
    let matriz = Array.from({ length: 10 }, () => Array(10).fill(0));

    // Variables de estado inicial del juego
    let puntuacion = 0;  // Puntuación inicial del jugador
    let nPiezas = 0;     // Número de piezas colocadas en el juego
    let array = [];      // Array auxiliar para almacenar información adicional

    // Objeto con toda la información necesaria para guardar el estado de la partida
    let infoPartida = {
        matriz: matriz,
        puntuacion: puntuacion,
        nPiezas: nPiezas,
        array: array
    };

    // Guarda en sessionStorage los elementos individuales y el objeto completo
    sessionStorage.setItem('matriz', JSON.stringify(matriz));
    sessionStorage.setItem('array', JSON.stringify(array));
    sessionStorage.setItem('puntuacion', puntuacion.toString());
    sessionStorage.setItem('nPiezas', nPiezas.toString());
    sessionStorage.setItem('infoPartida', JSON.stringify(infoPartida));

    // Redirige a la pantalla del juego
    window.location.href = "juego.html";
});

// Función para cargar la tabla de puntuaciones desde la API según el índice de registro
function tablaPuntuaciones(reg) {
    fetch(`api/puntuaciones/${reg}/${CANTIDAD_DE_REGISTRO}`)
    .then(response => {
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return response.json(); // Parsear la respuesta a JSON
    })
    .then(data => {
        const tbody = document.querySelector('.tabla tbody');
        tbody.innerHTML = ''; // Limpia el contenido anterior de la tabla

        // Recorre cada fila recibida desde la API y construye la tabla HTML
        data.FILAS.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.classList.add('elementosLista');

            // Posición del jugador en la tabla (índice + offset de página)
            const tdPos = document.createElement('td');
            tdPos.textContent = (reg + index + 1);

            // Crea las celdas de nombre, puntuación y número de piezas
            const tdNombre = document.createElement('td');
            tdNombre.textContent = item.nombre;

            const tdPuntos = document.createElement('td');
            tdPuntos.textContent = item.puntos;

            const tdPiezas = document.createElement('td');
            tdPiezas.textContent = item.piezas;

            // Añade las celdas al elemento <tr>
            tr.appendChild(tdPos);
            tr.appendChild(tdNombre);
            tr.appendChild(tdPuntos);
            tr.appendChild(tdPiezas);

            // Añade la fila completa al cuerpo de la tabla
            tbody.appendChild(tr);
        });

        // Calcula el total de páginas y actualiza la interfaz de paginación
        totalDatos = data.TOTAL_REGISTROS;
        totalPaginas = Math.ceil(totalDatos / CANTIDAD_DE_REGISTRO);
        actualizarPaginacion();
    })
    .catch(error => {
        console.error('Error al obtener datos:', error);
    });
}

// Función que actualiza los botones de paginación (anterior, actual, siguiente)
function actualizarPaginacion() {
    let paginationContainer = document.querySelector('.paginacion');
    paginationContainer.innerHTML = ''; // Limpia contenido anterior

    // Botón para retroceder de página
    let btnAnterior = document.createElement('button');
    btnAnterior.textContent = 'ANTERIOR';
    btnAnterior.disabled = (paginaActual === 1); // Desactiva si ya está en la primera página
    btnAnterior.addEventListener('click', () => irPagina(paginaActual - 1));
    paginationContainer.appendChild(btnAnterior);

    // Mostrar número de página actual
    let paginaActualDisplay = document.createElement('span');
    paginaActualDisplay.textContent = `${paginaActual}`;
    paginationContainer.appendChild(paginaActualDisplay);

    // Botón para avanzar de página
    let btnSiguiente = document.createElement('button');
    btnSiguiente.textContent = 'SIGUIENTE';
    btnSiguiente.disabled = (paginaActual === totalPaginas); // Desactiva si ya está en la última página
    btnSiguiente.addEventListener('click', () => irPagina(paginaActual + 1));
    paginationContainer.appendChild(btnSiguiente);
}

// Función que permite moverse a una página específica y actualiza la tabla
function irPagina(pagina) {
    if (pagina >= 1 && pagina <= totalPaginas) {
        paginaActual = pagina;
        let reg = (paginaActual - 1) * CANTIDAD_DE_REGISTRO; // Cálculo del índice de inicio
        tablaPuntuaciones(reg); // Carga la tabla con los registros correspondientes
    }
}

// Llamada inicial para cargar la tabla al cargar la página
tablaPuntuaciones(REGISTRO_INICIAL);

// Muestra el contenido del sessionStorage en consola (para debug)
console.log(sessionStorage);
