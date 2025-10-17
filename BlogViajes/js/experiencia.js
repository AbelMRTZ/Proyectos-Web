let paginaActual = 1;
let totalFotos = 0;
let cantidadPaginas = 1;

let comentariosPorPagina = 3;
let mostrarTodos = false;

const url = new URLSearchParams(window.location.search);
const expID = url.get('id');
console.log("La id:", expID);

function ValidarPagina() {
    fetch("./api/experiencias")
    .then(response => {
        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const experiencia = data.FILAS.find(exp => exp.id == expID);
        if(!experiencia) {
            window.location.href = "index.html";
        } else {
            console.log("ID encontrada");
        }
    }) 
    .catch(error => {
        console.error('Error al validar la página:', error);
    });
}

function ContenidoPagina() {
    fetch(`api/experiencias/${encodeURIComponent(expID)}`)
    .then(response => {
        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);

        const experienciaActual = data.FILAS[0];
        if (!experienciaActual) {
            console.error("No se encontró la experiencia.");
            return;
        }

        const titulo = document.querySelector('.h1principal h2');
        titulo.textContent = experienciaActual.titulo;

        const autor = document.querySelector('#js_autor');
        autor.textContent = experienciaActual.login;

        const valoracion = document.querySelector('#js_valoracion');
        valoracion.textContent = experienciaActual.valoracion;

        const fecha = document.querySelector('#js_fecha');
        fecha.textContent = experienciaActual.fechaCreacion;

        const comentario = document.querySelector('#js_comentario');
        comentario.textContent = experienciaActual.nComentarios;

        const duracion = document.querySelector('#js_duracion');
        duracion.textContent = experienciaActual.tiempo;

        const texto = document.querySelector('#js_texto');
        texto.textContent = experienciaActual.texto;
    })
    .catch(error => {
        console.error('Error al cargar el contenido:', error);
    });

    cargarFotos(paginaActual);
    cargarCategorias();
    cargarComentarios();
    cargarFormularioComentarios();
}

function cargarFotos(pagina) {
    let reg = (pagina - 1) * cantidadPaginas;
    fetch(`api/experiencias/${encodeURIComponent(expID)}/fotos?reg=${reg}&cant=${cantidadPaginas}`)
    .then(response => {
        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        let html = '';

        if (data.RESULTADO === 'OK') {
            if (data.FILAS.length > 0) {
                let foto = data.FILAS[0];
                console.log("La id de la foto es", foto.id);
                html += 
                `
                <h2>Fotos</h2>
                <a href="fotos/${foto.archivo}">
                    <img src="fotos/${foto.archivo}" alt="foto exp" id="foto">
                </a>
                <p id="descripcionfoto"><strong>${foto.descripcion}</strong></p>
                `;
            }
            document.querySelector('#js_carrusel > div').innerHTML = html;

            totalFotos = data.TOTAL_COINCIDENCIAS;
            let totalPaginas = Math.ceil(totalFotos / cantidadPaginas);

            actualizarPaginacion(totalPaginas);
        }
    })
    .catch(error => {
        console.error('Error al cargar fotos:', error);
    });
}

function actualizarPaginacion(totalPaginas) {
    let paginationContainer = document.querySelector('#botones-foto');
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
}

function irPagina(pagina) {
    paginaActual = pagina;
    cargarFotos(paginaActual);
}

function cargarCategorias() {
    fetch(`api/experiencias/${encodeURIComponent(expID)}/categorias`)
    .then(response => {
        if(!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const categorias = document.getElementById('js_categoria');

        data.FILAS.forEach((cat, index) => {
            const newCat = document.createElement('a');
            newCat.classList.add('a_category');
            newCat.href = `buscar.html?c=${cat.nombre}`;
            newCat.textContent = cat.nombre;

            categorias.appendChild(newCat);

            if (index < data.FILAS.length - 1) {
                categorias.appendChild(document.createTextNode(', '));
            }
        })
    }) .catch(error => {
        console.error('Error al cargar:', error);
    });
}

function cargarComentarios() {
    fetch(`api/experiencias/${encodeURIComponent(expID)}/comentarios`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const comentarios = document.getElementById('js_coments');
            comentarios.innerHTML = '';

            const tituloComent = document.createElement('h2');
            tituloComent.textContent = `Comentarios (${data.FILAS.length})`;
            comentarios.appendChild(tituloComent);

            const mostrarComentarios = mostrarTodos ? data.FILAS : data.FILAS.slice(0, comentariosPorPagina);

            mostrarComentarios.forEach(com => {
                const comentIndividual = document.createElement('div');
                comentIndividual.classList.add('comentario');

                const autorC = document.createElement('p');
                autorC.classList.add('autor');

                const autorS = document.createElement('strong');
                autorS.textContent = `${com.login} | ${com.valoracion}★`;
                autorC.appendChild(autorS);

                const comentarioC = document.createElement('p');
                comentarioC.classList.add('comentarios');
                comentarioC.textContent = com.texto;

                const fechaC = document.createElement('p');
                fechaC.classList.add('fecha');

                const iconSpan = document.createElement('span');
                iconSpan.classList.add('icon');

                const icon = document.createElement('i');
                icon.classList.add('icon-calendar');

                iconSpan.appendChild(icon);
                fechaC.appendChild(iconSpan);

                const fechaSpan = document.createElement('span');
                fechaSpan.textContent = formatearFecha(com.fechaHora);
                fechaC.appendChild(fechaSpan);

                comentIndividual.appendChild(autorC);
                comentIndividual.appendChild(comentarioC);
                comentIndividual.appendChild(fechaC);

                comentarios.appendChild(comentIndividual);
            });

            const botones = document.createElement('div');
            botones.classList.add('botones-comentarios');

            if (!mostrarTodos) {
                const mostrarTodoBtn = document.createElement('button');
                mostrarTodoBtn.textContent = 'Mostrar mas';
                mostrarTodoBtn.addEventListener('click', () => {
                    mostrarTodos = true;
                    cargarComentarios();
                });
                botones.appendChild(mostrarTodoBtn);
            } else {
                const mostrarMenosBtn = document.createElement('button');
                mostrarMenosBtn.textContent = 'Mostrar menos';
                mostrarMenosBtn.addEventListener('click', () => {
                    mostrarTodos = false;
                    cargarComentarios();
                });
                botones.appendChild(mostrarMenosBtn);
            }

            comentarios.appendChild(botones);
        })
        .catch(error => {
            console.error('Error al cargar comentarios:', error);
        });
}

function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr.replace(' ', 'T'));

    const dia = fecha.getDate();
    const año = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');

    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const mes = meses[fecha.getMonth()];

    return `${dia} de ${mes} de ${año}, a las ${horas}:${minutos}`;
}

function cargarFormularioComentarios() {
    document.addEventListener('DOMContentLoaded', function() {
        const token = sessionStorage.getItem('token');
        const login = sessionStorage.getItem('login');
        const mensajeLogin = document.getElementById('js_dejar_comentario');

        if(!token) {
            const a_login = document.createElement('a');
            a_login.href = 'login.html';

            const p_login = document.createElement('p');
            p_login.id = 'aviso_comentario';
            p_login.textContent = '¡Para poder dejar un comentario tienes que hacer LOGIN!'

            a_login.appendChild(p_login);
            mensajeLogin.appendChild(a_login);
        } else {
            fetch('comentario-formulario.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el formulario');
                }
                return response.text();
            })
            .then(html => {
                mensajeLogin.innerHTML = html;

                const botonComentario = document.getElementById('boton_cForm')
                botonComentario.addEventListener('click', function(event){
                    event.preventDefault(); 

                    const texto = document.getElementById("caja_comentario").value;
                    const valoracion = document.getElementById("valoracion_comentario").value;
                    const textoInformativo = document.getElementById("form_js");

                    if (!texto.trim() || !valoracion.trim()) {
                        mostrarMensaje("Porfavor complete todos los campos", "red", textoInformativo);
                        return;
                    }

                    const formData = new FormData();
                    formData.append('texto', texto);
                    formData.append('valoracion', valoracion);

                    fetch(`api/experiencias/${encodeURIComponent(expID)}/comentarios`, {
                        method: "POST",
                        headers: {"Authorization": `${login}:${token}`},
                        body: formData
                    })
                    .then(response => {
                        if(!response.ok) {
                            throw new Error(`Error ${response.status}: ${text}`);
                        }
                        response.json();
                    })
                    .then(data=> {
                        ContenidoPagina();
                        document.getElementById('caja_comentario').value = '';
                        document.getElementById('valoracion_comentario').value = '';
                        mensajeModal("Comentario Enviado con Exito", "Su Comentario ha sido subido correctamente");
                    })
                    .catch(error => {
                        console.error('Error al cargar comentarios:', error);
                    });
                })
            })
            .catch(error => {
                console.error('Error al cargar comentarios:', error);
            });
        }
    });
}

function mensajeModal(titulo, mensaje, url) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-btn">x</button>
            <p><strong>${titulo}</strong></p>
            <p>${mensaje}</p>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.add("active");

    const closeBtn = modal.querySelector(".close-btn");
    closeBtn.onclick = function() {
        modal.style.display = "none";
        if (url) {
            window.location.href = url;
        }
    };
}

function mostrarMensaje(mensaje, color, textoInformativo) {
    const mensajeElemento = document.createElement('div');
    mensajeElemento.textContent = mensaje;
    mensajeElemento.style.color = color;
    textoInformativo.innerHTML = "";
    textoInformativo.appendChild(mensajeElemento);
}

ValidarPagina();
ContenidoPagina();
