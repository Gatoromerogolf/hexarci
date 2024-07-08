let tablaMenuEs = [];
let tablaMenuA = [];
let primeraVez = 0;
// const CUIT = localStorage.getItem('CUIT'); // El CUIT que quieres validar
// console.log ('CUIT , CUIT')

// lee la tabla de secciones.
// fetch('http://localhost:3000/registros')

// Función para obtener los datos de la base de datos
async function obtenerSecciones(indice) {

  let linkPagina = "##";
  try {
    // Realizar la solicitud fetch
    const response = await fetch(`/secciones?indice=${indice}`);

    if (response.ok) {
      // Obtener los datos en formato JSON
      const seccionRec = await response.json(); //registro seccion recibido
      if (seccionRec.length > 0) {
        const primerSeccion = seccionRec[0];
        console.log (primerSeccion)
        console.log (primerSeccion.max4)
        // leo la tabla de respuestas para saber si se completó
        const CUIT = localStorage.getItem('CUIT');
        const capitulo = "A";
        const seccion = primerSeccion.seccion;

        // localStorage.setItem("3o4Direct", JSON.stringify(respuestas[0]));
        const direc34 = localStorage.getItem(direct3o4);
        const maximo = direc34 === '1' ? primerSeccion.max3 : primerSeccion.max4;

        const respuesta = await buscaRespuesta(CUIT, capitulo, seccion);
        if (respuesta.exists){
          // si lo encuentra, llena la tabla sin pasar el link
          console.log (`Encontro registro ${seccion} en obtenerSecciones`)
          // const registro = await response.json()

          const elemento = [
            `${primerSeccion.seccionromano}`,
            `##`,
            `${primerSeccion.descripcion}`,
            maximo,
            respuesta.score,
            (respuesta.score / primerSeccion.max4 * 100).toFixed(2)
          ];
          tablaMenuEs.push(elemento);
        }
          else{
            console.log (`no hay respuesta para seccion ${seccion}`);
            const elemento = [
              `${primerSeccion.seccionromano}`,
              '##', 
              `${primerSeccion.descripcion}`,
              null,
              null,
            ];
              if (primeraVez == 0) {
                elemento[1] = `${primerSeccion.pagina}`
                primeraVez = 1;
              }

              tablaMenuEs.push(elemento);

            // return true; // marca para terminar el ciclo
        }
      }
    } else {
      console.error('Error al obtener los datos');
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
  }
  return false;
}


(async function() {
  try {
    // Inicializar la tabla de secciones
    // let tablaMenuEs = [];    
  
  for (let indice = 1; indice < 16; indice++) {
    const shouldTerminate = await obtenerSecciones(indice);
    if (shouldTerminate) break;
  }

  // Una vez que se han obtenido todos los datos, actualizar el HTML

  elemento = [
    null,
    `##`,
    "Calificación general:",
    null,
    null,
  ];
  tablaMenuEs.push(elemento);


  actualizarHTML(tablaMenuEs);
} catch (error) {
  console.error('Error en la función autoinvocada:', error);  
}
})();

async function buscaRespuesta(CUIT, capitulo, seccion) {
  // console.log (`los 3 valores ${CUIT}, ${capitulo}, ${seccion}`)
  try {
    const response = await fetch(`/busca-respuesta?CUIT=${CUIT}&capitulo=${capitulo}&seccion=${seccion}`);
    if (response.ok) {
      const result = await response.json();
      if (result.exists) {
        return { exists: true, score: result.score };
      }
    } else {
      console.error(`Sin respuesta para seccion ${seccion} en buscaRespuesta`);
    }
  } catch (error) {
    console.error('Error al realizar la solicitud en buscaRespuesta:', error);
  }
  return { exists: false };
}

// if(JSON.parse(localStorage.getItem('idioma')) == 2){
//   tablaMenuA = tablaMenuIn;
// }  else {
//   tablaMenuA = tablaMenuEs;
// }

// Función para actualizar el HTML con los datos de la tabla
function actualizarHTML(tablaMenuEs) {
  console.log (tablaMenuEs)

  tablaMenuA = tablaMenuEs;


  // for (i = 0; i < tablaMenuA.length - 1; i++) {
  //   tablaMenuA[15][3] += tablaMenuA[i][3];
  //   tablaMenuA[15][4] += tablaMenuA[i][4];
  // }

  // if (tablaMenuA[15][4] !== 0) {
  //   tablaMenuA[15][5] = ((tablaMenuA[i][4] / tablaMenuA[15][3]) * 100).toFixed(2)
  // }

  // console.log(`puntos: ${valorRecuperado} y el maximo: ${valorMaximo} y el de funcion 2 ${valorFuncion2}`);

  //  llena la matriz 
  let lineaDatosFd = document.getElementById("lineaMenu");

  // alert(`El valor de tablaMenuEs.length es: ${tablaMenuEs.length}`);
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

  // localStorage.setItem("maximo-A", JSON.stringify(tablaMenuA[15][3]));
  // localStorage.setItem("valores-A", JSON.stringify(tablaMenuA[15][4]));
  // localStorage.setItem("porciento-A", JSON.stringify(tablaMenuA[15][5]));


  if (tablaMenuA[14][4] > 0) {document.getElementById("botonSiguiente").style.display = "block";}

}
