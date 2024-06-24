document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Realiza la solicitud al servidor para validar las credenciales
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            // Login exitoso, redirige a presentacion.html
            window.location.href = '../src/presentacion.html';
        } else {
            // Mostrar mensaje de error si las credenciales son inválidas
            console.error('Credenciales inválidas');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
});

// window.location.href = "../src/presentacion.html"; 

/*
//importar librerias:::::::::::::::::::::::::::::::::::::::::::
const express = require('express');
const mysql = require('mysql2');

//objetos para llamar metodos de express::::::::::::::::::::::
const app = express();

//configuraciones :::::::::::::::::::::::::::::::::::::::::::::
// aca se indica que se utiliza un motor para ver las pantillas
app.set('view engine', 'ejs')
app.use(express.json()); // asi reconoce los objetos que vienen de las paginas
app.use(express.urlencoded({extended: false})); // para que no analice lo que recibe....

app.get('/', (req, res) => {
    res.render('login .ejs')
  })

const username = document.getElementById("username");
const clave = document.getElementById("clave");
const login = document.getElementById("login");

login.addEventListener('click', (e) => {
    e.preventDefault()
    const data = {
        username: username.value,
        password: clave.value
    }
    console.log(data)

    window.location.href = "../contenido/presentacion.html"; 
});

//     if(JSON.parse(localStorage.getItem('idioma')) == 2){
//         window.location.href = "../public/contenido/Menu-General-en.html";
//     }  else {
//         window.location.href = "../public/contenido/Menu-General.html";
//     }
// })*/
