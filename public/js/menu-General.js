let tablaMenuA = [];

let tablaMenuEs = [
  ["A.",
    // "MA-1.html",
    "Menu-A.html",
    "Gobierno Corporativo",
    ,
    ,
  ],
  ["B.",
    "Menu-ape-rie.html",
    "Apetito de Riesgo",
    ,
    ,
  ],
  ["C.",
    "rie-mer.html",
    "Riesgos de Mercado",
    ,
    ,
  ],
  ["D.",
    "Menu-procesos.html",
    "Riesgos de Procesos",
    ,
    ,
  ],
  ["E.",
    "pos-fin.html",
    "Situación Financiera",
    ,
    ,
  ],
  ["F.",
    "cal-res.html",
    "Calidad de los Resultados",
    ,
    ,
  ],
  ["",
    "resumenGeneral2.html",
    "Resumen General:",
    ,
    ,
  ],
]

let tablaMenuIn = [
  ["A.",
    "Menu-A-en.html",
    "Corporate governance",
    ,
    ,
  ],
  ["B.",
    "Menu-ape-rie-en.html",
    "Risk appetite",
    ,
    ,
  ],
  ["C.",
    "rie-mer-en.html",
    "Market risks",
    ,
    ,
  ],
  ["D.",
    "Menu-procesos-en.html",
    "Process risks",
    ,
    ,
  ],
  ["E.",
    "pos-fin.html",
    "Financial situation",
    ,
    ,
  ],
  ["F.",
    "cal-res-en.html",
    "Quality of results",
    ,
    ,
  ],

  ["",
    "##",
    "General Summary:",
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

tablaMenuA[0][3] = JSON.parse(localStorage.getItem('maximo-A'));
tablaMenuA[0][4] = JSON.parse(localStorage.getItem('valores-A'));
tablaMenuA[0][5] = JSON.parse(localStorage.getItem('porciento-A'));

tablaMenuA[1][3] = JSON.parse(localStorage.getItem('maximo-B'));
tablaMenuA[1][4] = JSON.parse(localStorage.getItem('valores-B'));
tablaMenuA[1][5] = JSON.parse(localStorage.getItem('porciento-B'));

tablaMenuA[2][3] = JSON.parse(localStorage.getItem('maximo-C'));
tablaMenuA[2][4] = JSON.parse(localStorage.getItem('valores-C'));
tablaMenuA[2][5] = JSON.parse(localStorage.getItem('porciento-C'));

tablaMenuA[3][3] = JSON.parse(localStorage.getItem('maximo-D'));
tablaMenuA[3][4] = JSON.parse(localStorage.getItem('valores-D'));
tablaMenuA[3][5] = JSON.parse(localStorage.getItem('porciento-D'));

tablaMenuA[4][3] = JSON.parse(localStorage.getItem('maximo-E'));
tablaMenuA[4][4] = JSON.parse(localStorage.getItem('valores-E'));
tablaMenuA[4][5] = JSON.parse(localStorage.getItem('porciento-E'));

tablaMenuA[5][3] = JSON.parse(localStorage.getItem('maximo-F'));
tablaMenuA[5][4] = JSON.parse(localStorage.getItem('valores-F'));
tablaMenuA[5][5] = JSON.parse(localStorage.getItem('porciento-F'));

for (i = 0; i < tablaMenuA.length - 1; i++) {
  tablaMenuA[6][3] += tablaMenuA[i][3];
  tablaMenuA[6][4] += tablaMenuA[i][4];
}

// if (tablaMenuA[6][4] !== 0) {
if (tablaMenuA[6][4] > 0) {
    tablaMenuA[6][5] = ((tablaMenuA[i][4] / tablaMenuA[6][3]) * 100).toFixed(2)} else
    {tablaMenuA [6] [3]= 0;
      tablaMenuA [6] [4] = 0;
      tablaMenuA [6] [5] = 0;}


//  llena la matriz 
//let lineaDatosFd = document.getElementById("lineaMenu");
//let lineaDatosFd = document.getElementById("tablaIndice");
let tablaIndice = document.getElementById("tablaIndice");

for (i = 0; i < tablaMenuA.length; i++) {
  //lineaDatosFd = tablaIndice.insertRow();
  let lineaDatosFd = tablaIndice.insertRow();  

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