document.addEventListener("DOMContentLoaded", function () {

    const login = document.getElementById("usuarioinput");
    const textoInformativo = document.getElementById("logintext");


    function mostrarMensaje(mensaje, color) {
 
        const mensajeElemento = document.createElement('div');
        mensajeElemento.textContent = mensaje;
        mensajeElemento.style.color = color;

        textoInformativo.innerHTML = ""; 
        textoInformativo.appendChild(mensajeElemento); 
    }

    login.addEventListener("blur", function() {
        const loginValue = login.value.trim();

        if (loginValue === "") {
            textoInformativo.innerHTML = ""; 
            return;
        }

        fetch(`api/usuarios/${encodeURIComponent(loginValue)}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.DISPONIBLE) {
                    mostrarMensaje("¡Login Disponible!", "green"); 
                } else {
                    mostrarMensaje("Login No Disponible", "red"); 
                }
            })
            .catch(error => {
                console.error("Error en la petición:", error);
                mostrarMensaje("Error al verificar el login.", "red"); 
            });
    });
});

