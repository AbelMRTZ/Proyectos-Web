const pass1 = document.getElementById("contraseñainput");
const pass2 = document.getElementById("contraseñainput2");
const textoInformativo2 = document.getElementById("passtext");
const button = document.getElementById("submit-btn");


function mostrarMensaje(mensaje, color) {
    textoInformativo2.innerHTML = ""; 
  
    const mensajeElemento = document.createElement('div');
    mensajeElemento.textContent = mensaje;
    mensajeElemento.style.color = color;
  
    textoInformativo2.appendChild(mensajeElemento);
}

function passcheck() {

    if (pass1.value.trim() === "" && pass2.value.trim() === "") {
        textoInformativo2.innerHTML = "";  
        return;
    }

   
    if (pass1.value !== pass2.value) {
        mostrarMensaje("Las contraseñas no coinciden", "red"); 
        button.disabled = true;  
    } else {
        mostrarMensaje("Las contraseñas coinciden", "green");  
        button.disabled = false;  
    }
}


pass1.addEventListener("input", passcheck);
pass2.addEventListener("input", passcheck);


