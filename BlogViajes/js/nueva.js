contador = 0;

function categorias() {
    fetch("api/categorias")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      data.FILAS.forEach(categoria => {
      const datalist = document.getElementById('datalist');
        const option = document.createElement('option');
        option.value = categoria.nombre;
        datalist.appendChild(option);
      });
    })
    .catch(error => console.error('Error al obtener categorías:', error));

    window.addEventListener('DOMContentLoaded', (event) => {
      const boton = document.getElementById('boton-categoria');
      const catInput = document.getElementById('titulo1');
      boton.addEventListener('click', (event) => {
          event.preventDefault();
          if (!catInput || catInput.value.trim() === '') {
            return;
          }
          const datalist = document.getElementById('datalist');
          const option = document.createElement('option');
          option.value = catInput.value;
          datalist.appendChild(option);
          addCategory(catInput.value);
          catInput.value = '';
      });
    });
}

function addCategory(input) {
    const catAsignadas = document.getElementById('cat_asignadas');

    const catIndividual = document.createElement('p');
    catIndividual.classList.add('cat_individual');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('icon');
    const icon = document.createElement('i');
    icon.classList.add('icon-tag');
    iconSpan.appendChild(icon);
    
    const strong = document.createElement('strong');
    strong.textContent = input;
    const boton = document.createElement('button');
    boton.textContent = 'x';
    strong.appendChild(boton);

    catIndividual.appendChild(iconSpan);
    catIndividual.appendChild(strong);

    catAsignadas.appendChild(catIndividual);

    boton.addEventListener('click', () => {
        catAsignadas.removeChild(catIndividual);
      });
}

window.addEventListener('DOMContentLoaded', (event) => {
  const boton_fotos = document.getElementById('btn_fotos');
  boton_fotos.addEventListener('click', (event) => {
    contador++
    if(contador >= 4) {
      return;
    }
    event.preventDefault();

    const contenedor = document.createElement('div');
    contenedor.className = 'foto_individual';

    const label = document.createElement('label');

    const imagen = document.createElement('img');
    imagen.src = 'images/uploadimage.jpeg';
    imagen.alt = 'foto exp';
    label.appendChild(imagen);

    const inputFile = document.createElement('input');
    const uniqueId = `file-input-${contador}`;
    inputFile.type = 'file';
    inputFile.id = uniqueId;
    inputFile.name = 'fotos[]';
    inputFile.accept = 'image/*';
    inputFile.style.display = 'none';
    label.setAttribute('for', uniqueId);

    inputFile.addEventListener('change', () => {
      const file = inputFile.files[0];
      if (file) {
        const sizeKB = file.size / 1024;
        console.log(sizeKB);
        if (sizeKB > 200) {
          mensajeModal("Error al Cargar la Foto", "La foto supera los 200Kb");
          inputFile.value = '';
          imagen.src = 'images/uploadimage.jpeg';
          imagen.alt = 'foto exp';
          return;
        }

        const objectURL = URL.createObjectURL(file);
        imagen.src = objectURL;
      }
    });

    const textarea = document.createElement('textarea');
    textarea.classList.add('fotos_textarea');
    textarea.name = 'descripciones[]';
    textarea.maxLength = 200;
    textarea.required = true;

    contenedor.appendChild(label);
    contenedor.appendChild(inputFile);
    contenedor.appendChild(textarea);

    document.querySelector('.cat_fotos').appendChild(contenedor);   
  
  });

  const botonMenos = document.getElementById('btn_fotos2');
  botonMenos.addEventListener('click', () => {
    const fotos = document.querySelectorAll('.cat_fotos .foto_individual');
    if (fotos.length > 0) {
      const ultimaFoto = fotos[fotos.length - 1];
      ultimaFoto.remove();
      contador--;
    }
  });

  const botonEnviar = document.getElementById('b2');
  botonEnviar.addEventListener('click', () => {
    const fotos = document.querySelectorAll('.cat_fotos .foto_individual');
    if(fotos.length == 0) {
      mensajeModal("Inserte una Foto","Porfavor, inserte al menos una foto y no deje ningun campo vacio")
      return;
    } 
    for (const foto of fotos) {
      const imagen = foto.querySelector('img');
      if (imagen && imagen.src.includes('images/uploadimage.jpeg')) {
        mensajeModal("Inserte una Foto", "Por favor, inserte al menos una foto válida y no deje ningún campo vacío");
        return;
      }
      const desc = foto.querySelector('.fotos_textarea')
      if(!desc || desc.value.trim() === "") {
        mensajeModal("Inserte Descripcion de Foto", "Por favor, inserte una descripción apropiada para la foto");
        return;
      }
    }
    const token = sessionStorage.getItem("token");
    const login = sessionStorage.getItem("login");

    const formData = new FormData();

    const titulo = document.getElementById("titulo").value;
    const texto = document.getElementById("descripcion").value;
    const tiempo = document.getElementById("horas").value;
    const categorias = Array.from(document.querySelectorAll('#cat_asignadas .cat_individual strong')).map(el => el.childNodes[0].nodeValue.trim());      
    categorias.forEach(cat => {
      formData.append('categorias[]', cat);
    });
    
      fotos.forEach(fot => {
        const fileInput = fot.querySelector('input[type="file"]');
        const descripcion = fot.querySelector('textarea');
      
        if (fileInput && fileInput.files.length > 0) {
          formData.append('fotos[]', fileInput.files[0]);
        }
      
        if (descripcion) {
          formData.append('descripciones[]', descripcion.value);
        }
      });

    formData.append('titulo', titulo);
    formData.append('texto', texto);
    formData.append('tiempo', tiempo);

    fetch("api/experiencias", {
        method: "POST",
        headers: {"Authorization": `${login}:${token}`},
        body: formData
    })
    .then(response => {
      if(!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }
      return response.json()
    })
    .then(data => {
      mensajeModal("Experiencia Guardada Correctamente", `"${data.TITULO}"`, "index.html")
    })
    .catch(error => {
      console.error('Error al cargar:', error);
    });

  })
});


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

categorias();
