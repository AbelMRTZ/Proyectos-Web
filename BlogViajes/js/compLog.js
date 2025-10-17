document.addEventListener("DOMContentLoaded", function() {
    
    const token = sessionStorage.getItem("token");
    const login = sessionStorage.getItem("login");

    console.log("El Token: ", token);
    console.log("El login: ", login);
    console.log(sessionStorage);

    if (token && (window.location.pathname.includes("login.html") || window.location.pathname.includes("registro.html"))) {
        window.location.href = "index.html";
        return;  
    }

    if (!token && (window.location.pathname.includes("logout.html") || window.location.pathname.includes("nueva.html"))) {
        window.location.href = "index.html";
        return; 
    }

    if(!token) {
        showNavItem("nav-index");
        showNavItem("nav-login");
        showNavItem("nav-buscar");
        showNavItem("nav-registro");
        hideNavItem("nav-logout");
        hideNavItem("nav-nueva");
    } else {
        showNavItem("nav-index");
        showNavItem("nav-buscar");
        showNavItem("nav-logout");
        showNavItem("nav-nueva");
        hideNavItem("nav-registro");
        hideNavItem("nav-login");

        document.getElementById("log-user").textContent = `(${login})`
    }
});

function hideNavItem(navId) {
    const navItem = document.getElementById(navId);
    if (navItem) {
        navItem.style.display = "none"; 
    }
}

function showNavItem(navId) {
    const navItem = document.getElementById(navId);
    if (navItem) {
        navItem.style.display = "flex"; 
    }
}