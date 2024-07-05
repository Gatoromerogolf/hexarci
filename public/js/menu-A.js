let tablaMenuA = [];

const CUIT = localStorage.getItem('CUIT'); // El CUIT que quieres validar

// lee la tabla de secciones.
// fetch('http://localhost:3000/registros')
fetch('/secciones')
  .then(res => res.json()) // res es objeto de respta de la solic fetch
                // res.json() convierte el cuerpo de la respta a JSON y devuelve una promesa
  .then(data => { // data contiene el objeto JSON cuando se cumple la promesa de res.json
    let currentIndex = 0;
    
    const validateAndProceed = () => {
      if (currentIndex >= data.length) {
        console.log('No hay más registros para procesar.');
        return;
      }

      const registro = data[currentIndex];
      console.log("ID:", registro.id);
      console.log("Capítulo:", registro.capitulo);
      console.log("Sección:", registro.seccion);
      console.log("Sección Romano:", registro.seccionromano);
      console.log("Descripción:", registro.descripcion);
      console.log("Página:", registro.pagina);
      console.log("-------------------");

      // Realiza la validación aquí
      buscaRespuesta(CUIT, registro.capitulo, registro.seccion)
        .then(existe => {
          if (existe) {
            const elemento = [
              registro.seccionromano,
              registro.descripción,
              null,
              respuesta.score
            ];
            tablaMenuEs.push(elemento)
            currentIndex++;
            validateAndProceed(); // Continúa con el siguiente registro
          } else {
            const elemento = [
              registro.seccionromano,
              registro.descripción,
              registro.pagina,
              respuesta.score
            ];
            tablaMenuEs.push(elemento)
            console.log('encontro uno no terminado')
            return;
          }
        })
        .catch(error => console.error('Error al validar el registro:', error));
    };

    validateAndProceed();
  })
  .catch(error => console.error('Error al obtener los registros:', error));

// Función para ver si la seccion tiene respuestas (si se completo)
function buscaRespuesta(cuit, capitulo, seccion) {
  return fetch(`/busca-respuesta?cuit=${cuit}&capitulo=${capitulo}&seccion=${seccion}`)
    .then(response => response.json())
    .then(data => data.existe)
    .catch(error => {
      console.error('Error al validar el registro:', error);
      return false;
    });
}

// Función principal para procesar registros y llenar la tabla
async function procesarRegistros(cuit) {
  const registros = await obtenerRegistros();

  for (let i = 0; i < registros.length; i++) {
    const registro = registros[i];
    console.log("Procesando registro:", registro);

    const esValido = await validarRegistro(cuit, registro.capitulo, registro.seccion);

    if (!esValido) {
      console.log('La validación falló. Ciclo terminado.');
      break;
    }

    const elemento = [
      `Capítulo ${registro.capitulo} Sección ${registro.seccion}`,
      `MA-${registro.capitulo}.html`,
      registro.descripcion,
      null, // Primer valor adicional (puedes ajustarlo según sea necesario)
      null  // Segundo valor adicional (puedes ajustarlo según sea necesario)
    ];

    tablaMenuEs.push(elemento);
  }

  console.log('Tabla final:', tablaMenuEs);
}

// Llamar a la función principal con el CUIT deseado
procesarRegistros('12345678901');

/*
Explicación:
Inicializar la tabla: Comenzamos con una tabla vacía tablaMenuEs = [].

Obtener registros: Usamos la función obtenerRegistros para obtener los registros de la API.

Validar el registro: La función validarRegistro comprueba si existe un registro en la tabla "respuestas" con los valores proporcionados.

Procesar registros: En la función procesarRegistros, procesamos cada registro uno por uno:

Para cada registro, imprimimos sus datos en la consola.
Validamos el registro con la función validarRegistro.
Si la validación falla, imprimimos un mensaje y terminamos el ciclo.
Si la validación es exitosa, creamos un nuevo elemento con los valores necesarios y lo agregamos a la tabla tablaMenuEs.
Llamar a la función principal: Finalmente, llamamos a la función procesarRegistros con el CUIT deseado.

Este ejemplo demuestra cómo puedes construir dinámicamente la tabla tablaMenuEs mientras procesas y validas registros, y cómo puedes terminar el llenado de la tabla según los resultados de la validación.
*/

/*
Backend:

Creamos una ruta /validar-respuesta que recibe cuit, capitulo y seccion como parámetros de consulta.
La ruta verifica si existe un registro en el array respuestas con los valores proporcionados y devuelve un objeto JSON con el resultado.
Frontend:

Primero obtenemos los registros con una llamada a fetch como antes.
Definimos la función validarRegistro que hace una solicitud a la nueva ruta /validar-respuesta con los parámetros necesarios.
En la función validateAndProceed, llamamos a validarRegistro para cada registro y, según el resultado, continuamos con el siguiente o terminamos el ciclo.

/*En este código, la función validateAndProceed se encarga de iterar sobre los registros y realizar la validación. Si la validación es exitosa (isValid es true), la función incrementa el índice (currentIndex) y se llama a sí misma para proceder con el siguiente registro. Si la validación falla, el ciclo se termina y se imprime un mensaje. La función realizarValidacion es un ejemplo de una función de validación que puedes adaptar a tus necesidades específicas.
*/

/* 
LECTURA DE UN REGISTRO EN MYSQL
del lado del cliente.
function leerRegistro() {
      const id = document.getElementById('idInput').value; // TOMA EL VALOR DE LA PAGINA WEB
      fetch(`/api/registro/${id}/${cuit}/${codigo}`)  // LE PASA PARAMETROs  ${id} ${cuit} ${codigo}
        .then(response => response.json()) // convierte la respuesta a json
        .then(data => { // toma los datos convertidos para trabajar
          document.getElementById('resultado').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

del lado del servidor
// Define una ruta para leer un registro
app.get('/api/registro/:id/:cuit/:codigo', (req, res) => { // :id, cuit, codigo son datos variables
  const { id, cuit, codigo } = req.params;  // toma datos variables de parametros del requerimiento 
  const parametros = [id, cuit, codigo, item, renglon];  // los agrupa en una constante
  const query = 'SELECT * FROM tabla WHERE id = ? AND cuit = ? AND codigo = ?';
  connection.query(query, parametros, (err, results) => {
    if (err) throw err;
    res.json(results[0]); // Enviar el primer (y único) resultado como JSON
  });
});





let tablaMenuEs = [
  ["I.",
    // "MA-1.html",
    "MA-1.html",
    "La composición y responsabilidad del Directorio",
    ,
    ,
  ],
  ["II.",
    "MA-2.html",
    "Estructura organizacional",
    ,
    ,
  ],
  ["III.",
    "MA-3.html",
    "El Directorio y su articulación con las Gerencias",
    ,
    ,
  ],
  ["IV.",
    "MA-4.html",
    "Comités del Directorio",
    ,
    ,
  ],
  ["V.",
    "MA-5.html",
    "Comité de Auditoría",
    ,
    ,
  ],
  ["VI.",
    "MA-6.html",
    "Información para el Directorio",
    ,
    ,
  ],
  ["VII.",
    "MA-7.html",
    "Estrategia",
    ,
    ,
  ],
  ["VIII.",
    "MA-8.html",
    "Gestión de Riesgos",
    ,
    ,
  ],
  ["IX.",
    "MA-9.html",
    "Cumplimiento y control",
    ,
    ,
  ],
  ["X.",
    "MA-10.html",
    "Funcionamiento",
    ,
    ,
  ],
  ["XI.",
    "MA-11.html",
    "El Directorio y las Gerencias",
    ,
    ,
  ],
  ["XII.",
    "MA-12.html",
    "Cultura y conducta empresarial",
    ,
    ,
  ],
  ["XIII.",
    "MA-13.html",
    "Sucesiones",
    ,
    ,
  ],
  ["XIV.",
    "MA-14.html",
    "Presidente del Directorio",
    ,
    ,
  ],
  ["XV.",
    "MA-15.html",
    "Secretaría del Directorio",
    ,
    ,
  ],
  ["",
    "##",
    "Calificación general:",
    ,
    ,
  ],
]

let tablaMenuIn = [
  ["I.",
    "MA-1-en.html",
    "Composition and responsibilities of the Board",
    ,
    ,
  ],
  ["II.",
    "MA-2-en.html",
    "Organizational structure",
    ,
    ,
  ],
  ["III.",
    "MA-3-en.html",
    "The Board of Directors and its coordination with Management",
    ,
    ,
  ],
  ["IV.",
    "MA-4-en.html",
    "Board Committees",
    ,
    ,
  ],
  ["V.",
    "MA-5-en.html",
    "Audit Committee responsibilities",
    ,
    ,
  ],
  ["VI.",
    "MA-6-en.html",
    "Information for the Board",
    ,
    ,
  ],
  ["VII.",
    "MA-7-en.html",
    "Strategy",
    ,
    ,
  ],
  ["VIII.",
    "MA-8-en.html",
    "Risk Management",
    ,
    ,
  ],
  ["IX.",
    "MA-9-en.html",
    "Compliance and Control",
    ,
    ,
  ],
  ["X.",
    "MA-10-en.html",
    "Board Operation",
    ,
    ,
  ],
  ["XI.",
    "MA-11-en.html",
    "Board and Management Interaction",
    ,
    ,
  ],
  ["XII.",
    "MA-12-en.html",
    "Business culture and conduct",
    ,
    ,
  ],
  ["XIII.",
    "MA-13-en.html",
    "Succession Planning",
    ,
    ,
  ],
  ["XIV.",
    "MA-14-en.html",
    "Chairman of the Board",
    ,
    ,
  ],
  ["XV.",
    "MA-15-en.html",
    "Board Secretary",
    ,
    ,
  ],
  ["",
    "##",
    "General evaluation:",
    ,
    ,
  ],
]

// ajusta idioma

if(JSON.parse(localStorage.getItem('idioma')) == 2){
    tablaMenuA = tablaMenuIn;
}  else {
    tablaMenuA = tablaMenuEs;
}


// Recuperar el valor de LocalStorage
// let valorMaximo = JSON.parse(localStorage.getItem('maximo'));
// let valores = JSON.parse(localStorage.getItem('valores'));
// let valorPuntos = JSON.parse(localStorage.getItem('nuevoValor'));

for (i = 0; i < tablaMenuA.length; i++) {
  tablaMenuA[i][3] = 0;
  tablaMenuA[i][4] = 0;
  tablaMenuA[i][5] = 0;
}

tablaMenuA[0][3] = JSON.parse(localStorage.getItem('maximo'));
tablaMenuA[0][4] = JSON.parse(localStorage.getItem('valores'));
tablaMenuA[0][5] = JSON.parse(localStorage.getItem('porciento'));

tablaMenuA[1][3] = JSON.parse(localStorage.getItem('maximo-2'));
tablaMenuA[1][4] = JSON.parse(localStorage.getItem('valores-2'));
tablaMenuA[1][5] = JSON.parse(localStorage.getItem('porciento-2'));

tablaMenuA[2][3] = JSON.parse(localStorage.getItem('maximo-3'));
tablaMenuA[2][4] = JSON.parse(localStorage.getItem('valores-3'));
tablaMenuA[2][5] = JSON.parse(localStorage.getItem('porciento-3'));

tablaMenuA[3][3] = JSON.parse(localStorage.getItem('maximo-4'));
tablaMenuA[3][4] = JSON.parse(localStorage.getItem('valores-4'));
tablaMenuA[3][5] = JSON.parse(localStorage.getItem('porciento-4'));

tablaMenuA[4][3] = JSON.parse(localStorage.getItem('maximo-5'));
tablaMenuA[4][4] = JSON.parse(localStorage.getItem('valores-5'));
tablaMenuA[4][5] = JSON.parse(localStorage.getItem('porciento-5'));

tablaMenuA[5][3] = JSON.parse(localStorage.getItem('maximo-6'));
tablaMenuA[5][4] = JSON.parse(localStorage.getItem('valores-6'));
tablaMenuA[5][5] = JSON.parse(localStorage.getItem('porciento-6'));

tablaMenuA[6][3] = JSON.parse(localStorage.getItem('maximo-7'));
tablaMenuA[6][4] = JSON.parse(localStorage.getItem('valores-7'));
tablaMenuA[6][5] = JSON.parse(localStorage.getItem('porciento-7'));

tablaMenuA[7][3] = JSON.parse(localStorage.getItem('maximo-8'));
tablaMenuA[7][4] = JSON.parse(localStorage.getItem('valores-8'));
tablaMenuA[7][5] = JSON.parse(localStorage.getItem('porciento-8'));

tablaMenuA[8][3] = JSON.parse(localStorage.getItem('maximo-9'));
tablaMenuA[8][4] = JSON.parse(localStorage.getItem('valores-9'));
tablaMenuA[8][5] = JSON.parse(localStorage.getItem('porciento-9'));

tablaMenuA[9][3] = JSON.parse(localStorage.getItem('maximo-10'));
tablaMenuA[9][4] = JSON.parse(localStorage.getItem('valores-10'));
tablaMenuA[9][5] = JSON.parse(localStorage.getItem('porciento-10'));

tablaMenuA[10][3] = JSON.parse(localStorage.getItem('maximo-11'));
tablaMenuA[10][4] = JSON.parse(localStorage.getItem('valores-11'));
tablaMenuA[10][5] = JSON.parse(localStorage.getItem('porciento-11'));

tablaMenuA[11][3] = JSON.parse(localStorage.getItem('maximo-12'));
tablaMenuA[11][4] = JSON.parse(localStorage.getItem('valores-12'));
tablaMenuA[11][5] = JSON.parse(localStorage.getItem('porciento-12'));

tablaMenuA[12][3] = JSON.parse(localStorage.getItem('maximo-13'));
tablaMenuA[12][4] = JSON.parse(localStorage.getItem('valores-13'));
tablaMenuA[12][5] = JSON.parse(localStorage.getItem('porciento-13'));

tablaMenuA[13][3] = JSON.parse(localStorage.getItem('maximo-14'));
tablaMenuA[13][4] = JSON.parse(localStorage.getItem('valores-14'));
tablaMenuA[13][5] = JSON.parse(localStorage.getItem('porciento-14'));

tablaMenuA[14][3] = JSON.parse(localStorage.getItem('maximo-15'));
tablaMenuA[14][4] = JSON.parse(localStorage.getItem('valores-15'));
tablaMenuA[14][5] = JSON.parse(localStorage.getItem('porciento-15'));

for (i = 0; i < tablaMenuA.length - 1; i++) {
  tablaMenuA[15][3] += tablaMenuA[i][3];
  tablaMenuA[15][4] += tablaMenuA[i][4];
}

if (tablaMenuA[15][4] !== 0) {
  tablaMenuA[15][5] = ((tablaMenuA[i][4] / tablaMenuA[15][3]) * 100).toFixed(2)
}

// console.log(`puntos: ${valorRecuperado} y el maximo: ${valorMaximo} y el de funcion 2 ${valorFuncion2}`);

//  llena la matriz 
let lineaDatosFd = document.getElementById("lineaMenu");

for (i = 0; i < tablaMenuA.length; i++) {
  lineaDatosFd = tablaIndice.insertRow();

  let celdaNombre = lineaDatosFd.insertCell(-1);
  celdaNombre.textContent = tablaMenuA[i][0];

  // Crear la segunda celda (columna) como un enlace:
  // un elemento <a> con el valor de tablaMenuA[i][1]
  // como su atributo href, y luego lo agregamos como hijo de la celda de enlace (celdaEnlace). 

  const celdaEnlace = lineaDatosFd.insertCell(-1);
  const enlace = document.createElement('a'); // Crear un elemento <a>
  enlace.href = tablaMenuA[i][1]; // Establecer el atributo href con el valor correspondiente
  enlace.textContent = tablaMenuA[i][2]; // Establecer el texto del enlace con el tercer elemento de la tabla
  enlace.style.textDecoration = 'none';
    // Agregar el enlace como hijo de la celda
  if (i == tablaMenuA.length-1){
    enlace.style.fontSize = '18px'; // Cambiar el tamaño de la fuente
    enlace.style.fontWeight = 'bold'; // Hacer el texto en negrita
    enlace.style.color='black';

    celdaEnlace.style.textAlign = 'center'; // Centrar el contenido horizontalmente
    celdaEnlace.style.display = 'flex';
    celdaEnlace.style.justifyContent = 'center';
    celdaEnlace.style.alignItems = 'center';
  }  
  celdaEnlace.appendChild(enlace); 
  

  celdaMaximo = lineaDatosFd.insertCell(-1);
  if (tablaMenuA[i][3] === 0) {
    tablaMenuA[i][3] = ""
  }
  celdaMaximo.textContent = tablaMenuA[i][3];
  celdaMaximo.classList.add('ajustado-derecha');

  celdaPuntos = lineaDatosFd.insertCell(-1);
  if (tablaMenuA[i][4] === 0) {
    tablaMenuA[i][4] = ""
  }
  celdaPuntos.textContent = tablaMenuA[i][4];
  celdaPuntos.classList.add('ajustado-derecha');

  celdaPorciento = lineaDatosFd.insertCell(-1);
  if (tablaMenuA[i][5] === 0) {
    tablaMenuA[i][5] = ""
  }
  celdaPorciento.textContent = tablaMenuA[i][5];
  celdaPorciento.classList.add('ajustado-derecha');
}

localStorage.setItem("maximo-A", JSON.stringify(tablaMenuA[15][3]));
localStorage.setItem("valores-A", JSON.stringify(tablaMenuA[15][4]));
localStorage.setItem("porciento-A", JSON.stringify(tablaMenuA[15][5]));


if (tablaMenuA[14][4] > 0) {document.getElementById("botonSiguiente").style.display = "block";}



/*

// Inicializar la tabla vacía
let tablaMenuEs = [];

// Función para simular la obtención de registros
function obtenerRegistros() {
  return fetch('http://localhost:3000/registros')
    .then(response => response.json())
    .catch(error => {
      console.error('Error al obtener los registros:', error);
      return [];
    });
}

// Función para validar el registro
function validarRegistro(cuit, capitulo, seccion) {
  return fetch(`http://localhost:3000/validar-respuesta?cuit=${cuit}&capitulo=${capitulo}&seccion=${seccion}`)
    .then(response => response.json())
    .then(data => data.existe)
    .catch(error => {
      console.error('Error al validar el registro:', error);
      return false;
    });
}

// Función principal para procesar registros y llenar la tabla
async function procesarRegistros(cuit) {
  const registros = await obtenerRegistros();

  for (let i = 0; i < registros.length; i++) {
    const registro = registros[i];
    console.log("Procesando registro:", registro);

    const esValido = await validarRegistro(cuit, registro.capitulo, registro.seccion);

    if (!esValido) {
      console.log('La validación falló. Ciclo terminado.');
      break;
    }

    const elemento = [
      `Capítulo ${registro.capitulo} Sección ${registro.seccion}`,
      `MA-${registro.capitulo}.html`,
      registro.descripcion,
      null, // Primer valor adicional (puedes ajustarlo según sea necesario)
      null  // Segundo valor adicional (puedes ajustarlo según sea necesario)
    ];

    tablaMenuEs.push(elemento);
  }

  console.log('Tabla final:', tablaMenuEs);
}

// Llamar a la función principal con el CUIT deseado
procesarRegistros('12345678901');*/