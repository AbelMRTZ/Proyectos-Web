document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const login = document.getElementById("usuarioinput").value;
    const pwd = document.getElementById("contraseñainput").value;

    const formData = new URLSearchParams();
    formData.append('login', login);
    formData.append('pwd', pwd);

    fetch("api/usuarios/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(`RESULTADO: ${data.RESULTADO}, CODIGO: ${data.CODIGO}, DESCRIPCION: ${data.DESCRIPCION}`);
            });
        } else {
            return response.json().then(data => {
                if (data.LOGIN && data.TOKEN) {
                    sessionStorage.setItem("token", data.TOKEN);
                    sessionStorage.setItem("login", data.LOGIN);

                    const storedToken = sessionStorage.getItem("token");
                    console.log("Token guardado en sessionStorage: ", storedToken);

                    if (storedToken === data.TOKEN) {
                        console.log("El token ha sido guardado correctamente.");
                    } else {
                        console.log("Error: El token no se guardó correctamente.");
                    }

                    mensajeModal("¡Login Correcto!", "Bienvenido de nuevo", "index.html");
                } else {
                    throw new Error("Error con el Token o Login");
                }
            });
        }
    })
    .catch(error => {
        mensajeModal("Error en el Login", "Compruebe el error e intente de nuevo");
        document.getElementById("usuarioinput").focus();
        console.error(error.message);
    });

});

// FUNCION DEL MODAL
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
