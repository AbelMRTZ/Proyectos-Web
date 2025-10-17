document.getElementById("regForm").addEventListener("submit", async function(event) {

    event.preventDefault(); 

    const login = document.getElementById("usuarioinput").value;
    const pwd = document.getElementById("contraseñainput").value;
    const pwd2 = document.getElementById("contraseñainput2").value;
    const email = document.getElementById("contraseñainput3").value;

    const formData = new FormData();
    formData.append('login', login);
    formData.append('pwd', pwd);
    formData.append('pwd2', pwd2);
    formData.append('email', email);

    fetch("api/usuarios/registro", {
        method: "POST",
        body: formData
    })
    
    .then(response => {
        if(response.ok) {
            return response.json().then(data => {
                mensajeModal("¡Registro Correcto!", "Bienvenido a Vibras Travel", "login.html");
            });
            
        }else {
            return response.text().then(text => {
                mensajeModal("Error", "Intentalo de Nuevo");
            });
        }
    })
});


function mensajeModal(titulo, mensaje, url) {

    const modal = document.createElement("div"); 
    modal.classList.add("modal"); 
    modal.innerHTML = `
        <div class="modal-content">
            ${url ? '<button class="close-btn">x</button>' : ''}
            <p><strong>${titulo}</strong></p>
            <p>${mensaje}</p>
        </div>
    `;
    document.body.appendChild(modal); 
    modal.classList.add("active"); 

    if(url) {
        const closeBtn = modal.querySelector(".close-btn");
        closeBtn.onclick = function() {
            modal.style.display = "none";
            window.location.href = url;
        }
    }
}