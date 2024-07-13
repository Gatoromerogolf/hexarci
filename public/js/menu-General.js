let tablaMenuA = [];
let tablaMenuEs = [];
let primeraVez = 0;
let pagina = '';
const CUIT = localStorage.getItem('CUIT');
const capitulo = "A";
respuestas = [];


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

procesarCapitulos();

// Función principal que controla la secuencia
async function procesarCapitulos() {
  for (let i = 1; i < 7; i++) {
    await leeCapitulos(i); // Espera a que cada llamada se complete antes de proceder
  }
  console.log('Proceso completado:', tablaMenuEs);
  completarHtml(); // Llama a completarHtml después de procesar todos los capítulos
}

// ::::::::::::::::::::::------------------------------------------
async function leeCapitulos(indice) {
  try {
    const respuesta = await fetch(`/capitulos?indice=${indice}`);
    if (!respuesta.ok) {
      console.log (`Error en lectura de capitulos`);
      return;
    }
    const capitulos = await respuesta.json();
    if (capitulos.length > 0) {
      const capLeido = capitulos [0];
      const capitulo = capLeido.letra;
      const nombre = capLeido.nombre;
      pagina = capLeido.paginaCap;
      try {
        const data = await obtenerTotalCapitulos(CUIT, capitulo)
        if (data && data.length > 0) {
          const { CUIT, capitulo, maximo, score, porcentaje } = data[0]; // Desestructura los valores
          const elemento = [
            capitulo,
            '##', nombre, maximo, score, porcentaje
          ];
          tablaMenuEs.push(elemento);
        }
          else {    // Si no hay totales, maneja el caso especial
            const elemento = [
              capitulo, '##', nombre, null, null, null,
            ];
            if (primeraVez == 0) {
              elemento[1] = pagina;
              primeraVez = 1;
            }
            tablaMenuEs.push(elemento);
          }              
      }
      catch(error) {
        console.error('Error al obtener los datos:', error);
      };
    }
      } catch (error) {
      console.error('Error en la solicitud:', error);
  }
}

// ::::::::::::::::::::::------------------------------------------
async function obtenerTotalCapitulos(CUIT, capitulo) {
  try {
    const response = await fetch(`/totalCapitulos?CUIT=${CUIT}&capitulo=${capitulo}`);

    if (response.ok) {
      const data = await response.json();
      console.log('Datos obtenidos:', data);
      return data; // Devuelve los datos obtenidos si la respuesta es exitosa
    } else {
            // Si la respuesta no es exitosa, retorna null
      console.error('Error en la respuesta:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return null;
  }
}

// ::::::::::::::::::::::------------------------------------------
function completarHtml() {

  let totmaximo = 0;
  let totcalif = 0;
  let totporcien = 0;
  let numeroConPunto = 0;

  //  Agrega a la tabla un ultimo registro de Resumen General
  const elemento = [
    null, null, 'Resumen General:', null, null, null
  ];
  tablaMenuEs.push(elemento);

  tablaMenuA = tablaMenuEs;
  console.table(tablaMenuA);

  let tablaIndice = document.getElementById("tablaIndiceCapitulos");
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
    if (tablaMenuA[i][3] > 0) {
        numeroConPunto = formatearNumero(tablaMenuA[i][3]);
      }
      else {
        numeroConPunto = ''
      }
    celdaMaximo.textContent = numeroConPunto;
    celdaMaximo.classList.add('ajustado-derecha');
    totmaximo += tablaMenuA[i][3];

    celdaPuntos = lineaDatosFd.insertCell(-1);
    if (tablaMenuA[i][4] === 0) {
      tablaMenuA[i][4] = ""
    }
    if (tablaMenuA[i][4] > 0) {
      numeroConPunto = formatearNumero(tablaMenuA[i][4]);
    }
    else {
      numeroConPunto = ''
    }
    celdaPuntos.textContent = numeroConPunto;
    celdaPuntos.classList.add('ajustado-derecha');
    // totcalif = totcalif.toFixed(2);
    totcalif += Number(tablaMenuA[i][4]);

    celdaPorciento = lineaDatosFd.insertCell(-1);
    if (tablaMenuA[i][5] === 0) {
      tablaMenuA[i][5] = ""
    }
    celdaPorciento.textContent = tablaMenuA[i][5];
    celdaPorciento.classList.add('ajustado-derecha');

    celdaPDF = lineaDatosFd.insertCell(-1);
    if (tablaMenuA[i][5] > 0) {
      // Crear el elemento <img>
      const imgPdf = document.createElement('img');
      
      // Establecer los atributos de la imagen
      imgPdf.src = '../img/pdf (1).png';
      imgPdf.width = 20;
      imgPdf.style.display = 'block';
      imgPdf.style.margin = '0 auto';
      
      // Agregar la imagen a la celda
      celdaPDF.appendChild(imgPdf);
      // Agregar el event listener para el clic
      imgPdf.addEventListener('click', function() {
          generarPDF()
      });
    }
     else {
      celdaPDF.textContent = '';
    }

    if (i == tablaMenuA.length-1){
      const numeroFormateadoMx = formatearNumero(totmaximo);
      celdaMaximo.textContent = numeroFormateadoMx;

      totcalif = totcalif.toFixed(2);      

      const numeroFormateado = formatearNumero(totcalif);
      celdaPuntos.textContent = numeroFormateado;

      celdaPorciento.style.fontWeight = 'bold'; // Hacer el texto en negrita
      celdaPorciento.textContent = ((totcalif / totmaximo)*100).toFixed(2);

      if (!totcalif > 0) {
        celdaMaximo.textContent = '';
        celdaPuntos.textContent = '';
        celdaPorciento.textContent = '';
      }
    }
}}

// ::::::::::::::::::::::------------------------------------------
function formatearNumero(numero) {
  let partes = numero.toString().split('.');
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return partes.join(',');
}


//  ARMADO DEL PDF -
//      Leer todas las preguntas del capítulo
//      leer todas las respuestas del capitulo
//      convertir los codigos de respuesta
//      generar PDF

// recuperarPreguntas();
recuperarRespuestas(CUIT, capitulo);
cambiarDatos();
generarPDF();

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function recuperarPreguntas() {
  try {
    const response = await fetch('/preguntas');
    if (response.ok) {
      const result = await response.json();
      // Devolver directamente los datos recibidos
      return result;
    } else {
      console.error('Error al obtener los datos:', response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    return [];
  }
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function obtenerDatos() {
  try {
    const response = await fetch('/preguntas');
    if (response.ok) {
      const result = await response.json();
      // Devolver directamente los datos recibidos
      return result;
    } else {
      console.error('Error al obtener los datos:', response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    return [];
  }
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function recuperarRespuestas(CUIT, capitulo){
  respuestas = await obtenerRespuestas(CUIT, capitulo);
  console.log('Respuestas obtenidas -recuperarRespuestas: ', respuestas) // Verifica el valor de 'respuestas'
  respuestas.forEach((respuesta, index) => {
    console.log(`Registro ${index + 1}:`, respuesta);
});}
// ---------------------------------------------------------

// leo las respuestas del CUIT para el capítulo
async function obtenerRespuestas(CUIT, capitulo) {
  try {
    const response = await fetch(`/busca-respuesta-capitulo?CUIT=${CUIT}&capitulo=${capitulo}`);
    if (response.ok) {
      const result = await response.json();
      console.log ('muestro result - obtenerRespuestas:  ', result); // Verifica el resultado completo
      return result.records || []; // Devuelve los registros o un arreglo vacío
    } else {
      console.error(`Sin respuesta para capitulo ${capitulo} en obtenerRespuestas`);
    }
  } catch (error) {
    console.error('Error al realizar la solicitud en obtenerRespuestas:', error);
  }
  return [];
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function cambiarDatos(datos) {
  // lee tablas textos de respuestas
  const resultado = await leerTextoRespuestas();

  if (!resultado || resultado.length === 0) {
    console.error('leerTextoRespuestas no devolvió resultados válidos');
    return;
  }

  const textoRpta = resultado[0].textos;
  console.log ('xxxxxasdasdasx' , textoRpta);
  console.log ('xxMMMMMwesdasx' , textoRpta[0]); 

  const textoCheck = await leerTextoCheck();
  // console.log ('async function cambiarDatos(datos): ' , textoRpta)
  // console.log ('async function ..txtocheck): ' , textoCheck)

  datos.forEach(fila => {
    // fila.Numero es el numero de pregunta, o sea, el indice del array de respuesta.
    // la respuesta que corresponde es cuit-capitulo-seccion
    const respuesta = respuestas.find(respuesta => respuesta.seccion === fila.Seccion);

    // Encuentra el registro en resultado donde pregunta es igual a fila.tipo
    const otrarpta = resultado.find(item => item.pregunta === fila.tipo)
    console.log ('SDFSDSDFSDFSDFS' , otrarpta);     
    console.log ('xxMMMMMwesdasx  segunda parte' , textoRpta[0]); 

    // Asegúrate de que respuesta y arrayRespuesta existan antes de acceder a ellas
    // if (respuesta) {
      const arrayRespuesta = respuesta.respuesta;
      fila.nroRpt = arrayRespuesta[fila.Numero - 1];
    // } else {
    //   console.error(`No se encontró una respuesta para la sección ${fila.Seccion}`);
    //   return;
    // }

    switch (fila.tipo) {
      case 1:
        fila.respta = arrayRespuesta[fila.Numero - 1] == 1 ? "SI" : "NO";
        break;
      case 2:
        busca2Por(fila);
        break;
      case 3:
        fila.respta = arrayRespuesta[fila.Numero - 1];
        break;
      case 4:
        busca4Check();
        fila.respta = "texto encadenado";
        break;
      }

    if (fila.tipo > 40 && fila.tipo < 50) {
          fila.respta = "No sabemos";}

    if (fila.tipo > 50 && fila.tipo < 60) {
          fila.respta = "entre 50 y 60"
          // const textoRpta = resultado[fila.tipo].textos;
          // alert ('algo sale :', textoRpta)
    }
  }) 
}

async function busca1SiNo(){

}

async function busca2Por(fila) {
  switch (fila.tipo) {
      case 1:
          fila.respta = "No";
          break;
      case 2:
          fila.respta = "50%";
          break;
      case 3:
          fila.respta = "75%";
          break;
      default:
          fila.respta = "100%";
          break;
  }
}

async function busca3Nume(){
}

async function busca4Check(){
}

async function busca5Varios(){
}

async function leerTextoRespuestas () {
  try {
    const response = await fetch(`/textorespuestas`);
    // console.log ('lectura tabla texto respuestas: ' , response)
    if (response.ok) {
      const result = await response.json();
      // console.log ('muestro result - obtenertextoRespuestas:  ', result); // Verifica el resultado completo
      return result || []; // Devuelve los registros o un arreglo vacío
    } else {
      console.error(`Sin respuesta para capitulo ${capitulo} en obtenerRespuestas`);
    }
  } catch (error) {
    console.error('Error al realizar la solicitud en leerTextoRespuestas ', error);
  }
  return [];
}

async function leerTextoCheck () {
  try {
    const response = await fetch(`/textocheck`);
    // console.log ('lectura tabla texto respuestas: ' , response)
    if (response.ok) {
      const result = await response.json();
      // console.log ('muestro result - obtenertextoRespuestas:  ', result); // Verifica el resultado completo
      return result || []; // Devuelve los registros o un arreglo vacío
    } else {
      console.error(`Sin respuesta para async function leerTextoCheck ()`);
    }
  } catch (error) {
    console.error('Error al realizar la solicitud en leerTextoCheck ', error);
  }
  return [];
}



async function generarPDF() {
  // const datos = await obtenerDatos();
    const datos = await recuperarPreguntas();
  console.log(datos);
  // const datosRpta = await cambiarDatos(datos);
  await cambiarDatos(datos);
  // console.log(datos);

  // Inicializar jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Agregar título
  const CUIT = localStorage.getItem('CUIT');
  const usuario = localStorage.getItem('nombre');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#007bff'); // Color azul brillante

  doc.text(`------------------- Informe de Datos para CUIT: ${CUIT},   Usuario: ${usuario} \n \n GOBIERNO CORPORATIVO`, 10, 10);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#0000ff'); // Color azul brillante
  doc.text(`\n\n C: Capitulo, S: Sección, Nro: Número`, 10, 20);

  const columnas = [
    { title: "C", dataKey: "Capitulo" },
    { title: "S", dataKey: "seccionRomano" },
    { title: "N", dataKey: "Numero" },
    { title: "Afirmacion", dataKey: "Descrip" },
    { title: "TR", dataKey: "tipo" },
    { title: "NR", dataKey: "nroRpt" },
    { title: "Respuesta", dataKey: "respta" },      
  ];

    // Configurar estilos de columna para autoTable
  const columnStyles = {
    Capitulo: { cellWidth: 10 }, // Establecer el ancho de la columna 
    seccionRomano: { cellWidth: 10 },  // Establecer el ancho de la 
    Numero: { cellWidth: 10 }, // Establecer el ancho de la columna 
    Descrip: { cellWidth: 20 },  // Establecer el ancho de la columna 
    tipo: { cellWidth: 5 },  // Establecer el ancho de la columna 
    respta: { cellWidth: 20 },  // Establecer el ancho de la columna 
  };

    // Función para mapear y transformar datos
  // const transformarDatos = datos.map(row => ({
  //   ...row,
  //   tipo: row.tipo === 1 ? "SI" : row.tipo // Reemplazar 1 por "SI" y 0 por "NO"
  // }));
  //Función transformarDatos: Se utiliza map para iterar sobre los datos (datos) y crear una nueva estructura de datos (transformarDatos). En esta nueva estructura, se mapean los valores de cada fila (row). Para el campo tipo, se realiza una condición (row.tipo === 1 ? "SI" : "NO") para asignar "SI" si row.tipo es 1 y "NO" si es 0.

  //Uso de transformarDatos en autoTable: En lugar de pasar directamente datos al body de autoTable, ahora se pasa transformarDatos. Esto asegura que los valores transformados (con "SI" o "NO" en lugar de 1 o 0 en el campo tipo) se impriman en la tabla.

  // Agregar tabla de datos con ajuste de texto
  doc.autoTable({
    startY: 30,
    head: [columnas.map(col => col.title)],
    body: datos.map(row => columnas.map(col => row[col.dataKey])),
    columnStyles: columnStyles, // Aplicar estilos de columna
    styles: { overflow: 'linebreak' } // Ajuste de texto
});

  // Guardar el PDF :  doc.save('informe.pdf');
  // Convertir el PDF a un Blob
  const pdfBlob = doc.output('blob');

  // Crear un URL para el Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Mostrar el PDF en un iframe (en la misma página)
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100vh';
  iframe.src = pdfUrl;
  // document.body.appendChild(iframe);
  window.open(pdfUrl);
}
