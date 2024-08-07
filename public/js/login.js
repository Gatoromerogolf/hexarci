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
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login exitoso') {
            // Guardar datos en localStorage
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('ingresado', data.user.ingresado); 
            localStorage.setItem('nombre', data.user.firstName);
            localStorage.setItem('apellido', data.user.lastName);
            localStorage.setItem('CUIT', data.user.CUIT);
            localStorage.setItem('empresa', data.user.empresa);
            
// Para almacenar y recuperar un objeto completo en localStorage:
// const user = { username: 'john_doe', firstName: 'John', lastName: 'Doe' };
// localStorage.setItem('user', JSON.stringify(user));

// Recuperar el objeto
// const storedUser = JSON.parse(localStorage.getItem('user'));
// console.log(storedUser.username); // "john_doe"

            if (data.user.ingresado == 1) {
                window.location.href = '../src/continuacion.html';
               } else {
                window.location.href = '../src/Presentacion.html';
            }
        } else {
            console.error('Credenciales inválidas');
        }
    })
    .catch(error => {
        alert("usuario o clave invalidos");
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
