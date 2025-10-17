
document.getElementById("nav-logout").addEventListener("click", function(event)  {
    event.preventDefault();

    const token = sessionStorage.getItem("token");
    const login = sessionStorage.getItem("login");

    fetch("api/usuarios/logout", {
        method: "POST",
        headers: {"Authorization": `${login}:${token}`}
    })

    .then(response => {
        if(response.ok) {
            return response.json().then(data =>{
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('login');
                window.location.href = "index.html";
                console.log("Cosa Mala mi gente");
            })
        } else {
            return response.json().then(text => {
                throw new Error(`Error ${response.status}: ${text}`);
            })
        }
    }) .catch(error => {
        console.log("Error en la petición:", error);
    })

});
