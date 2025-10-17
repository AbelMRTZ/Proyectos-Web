const urlParam = new URLSearchParams(window.location.search);
const botonBuscar = document.getElementById('botonBuscar');

let paginaActual = 1;
let totalExperiencias = 0;
let cantidadPaginas = 6;
let filtrosActuales = {};

if ([...urlParam].length > 0) {
    const categoria = urlParam.get('c');

    if (categoria) {
        document.getElementById('forminput6').value = categoria;
    }

    const filtros = {
        c: categoria,
        reg: 0,
        cant: 1
    };

    paginaActual = 1;
    buscarExperiencias(filtros, 0, cantidadPaginas);
    filtrosActuales = filtros;
}

botonBuscar.addEventListener('click', function(event) {
    event.preventDefault();
    const filtros = {
        t: document.getElementById('forminput').value,
        c: document.getElementById('forminput6').value,
        td: document.getElementById('forminput4').value,
        th: document.getElementById('forminput5').value,
        vd: document.getElementById('forminput2').value,
        vh: document.getElementById('forminput3').value,
        reg: 0,
        cant: 1
    };

    paginaActual = 1;
    buscarExperiencias(filtros, 0, cantidadPaginas);
    filtrosActuales = filtros;
});

function buscarExperiencias(filtrosObj = {}, reg, cant) {
    const params = new URLSearchParams();

    for (const key in filtrosObj) {
        const valor = filtrosObj[key];
        if (valor !== undefined && valor !== null && valor !== '') {
            params.append(key, valor);
        }
    }

    params.append('reg', reg);
    params.append('cant', cant);

    const url = `./api/experiencias?${params.toString()}`;

    fetch(url)
    .then(response => {
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        let html = '';

        if (data.RESULTADO === 'OK') {
            if (data.FILAS.length > 0) {
                data.FILAS.forEach(exp => {
                    html += 
                    `<div class="articulo">
                        <header>
                            <a href="experiencia.html?id=${exp.id}">
                                <div class="tituloarticle" data-text="${exp.titulo}">
                                    <p class="overflow">${exp.titulo}</p>
                                </div>
                            </a>
                        </header>
                        <a class="imagenarticle" href="experiencia.html?id=${exp.id}">
                            <img class="fotoarticulo" src="fotos/${exp.foto}" width="290" height="260" alt="${exp.titulo}">
                        </a>
                        <footer class="footerarticle">
                            <p><i class="icon-calendar"></i>${exp.fechaCreacion}</p>
                            <p><i class="icon-comment"></i>${exp.nComentarios}</p>
                            <p><i class="icon-star-filled"></i>${exp.valoracion}</p>
                        </footer>
                    </div>`;
                });

                document.querySelector('#sectionarticle').innerHTML = html;

                totalExperiencias = data.TOTAL_COINCIDENCIAS;
                let totalPaginas = Math.ceil(totalExperiencias / cant);

                actualizarPaginacion(totalPaginas);
            } else {
                document.querySelector('#sectionarticle').innerHTML = '';
                document.querySelector('#menuflechas').style.display = 'none';
            }
        }
    })
    .catch(error => {
        console.error('Error al cargar:', error);
    });
}

function actualizarPaginacion(totalPaginas) {
    let paginationContainer = document.querySelector('#menuflechas');
    paginationContainer.innerHTML = '';

    let btnPrimera = document.createElement('button');
    btnPrimera.textContent = '<<';
    btnPrimera.disabled = (paginaActual === 1);
    btnPrimera.addEventListener('click', () => irPagina(1));
    paginationContainer.appendChild(btnPrimera);

    let btnAnterior = document.createElement('button');
    btnAnterior.textContent = '<';
    btnAnterior.disabled = (paginaActual === 1);
    btnAnterior.addEventListener('click', () => irPagina(paginaActual - 1));
    paginationContainer.appendChild(btnAnterior);

    let paginaActualDisplay = document.createElement('span');
    paginaActualDisplay.textContent = `${paginaActual}`;
    paginationContainer.appendChild(paginaActualDisplay);

    let btnSiguiente = document.createElement('button');
    btnSiguiente.textContent = '>';
    btnSiguiente.disabled = (paginaActual === totalPaginas);
    btnSiguiente.addEventListener('click', () => irPagina(paginaActual + 1));
    paginationContainer.appendChild(btnSiguiente);

    let btnUltima = document.createElement('button');
    btnUltima.textContent = '>>';
    btnUltima.disabled = (paginaActual === totalPaginas);
    btnUltima.addEventListener('click', () => irPagina(totalPaginas));
    paginationContainer.appendChild(btnUltima);

    document.querySelector('#menuflechas').style.display = 'flex';
}

function irPagina(pagina) {
    paginaActual = pagina;
    let reg = (paginaActual - 1) * cantidadPaginas;
    buscarExperiencias(filtrosActuales, reg, cantidadPaginas);
}
