let tablaMenuA = [];
let tablaMenuEs = [];
let primeraVez = 0;
let pagina = '';

// Función principal que controla la secuencia
async function procesarCapitulos() {
  for (let i = 1; i < 7; i++) {
    await leeCapitulos(i); // Espera a que cada llamada se complete antes de proceder
  }
  console.log('Proceso completado:', tablaMenuEs);
  completarHtml(); // Llama a completarHtml después de procesar todos los capítulos
}

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
      const CUIT = localStorage.getItem('CUIT');
      const capitulo = capLeido.letra;
      const nombre = capLeido.nombre;
      pagina = capLeido.paginaCap;

      try {
        const data = await obtenerTotalCapitulos(CUIT, capitulo)
      // .then(data => {
        // console.log (`datos recibidos desde la funcion: ${JSON.stringify(data)}`)
        // let pagina = ''; // Declara pagina fuera del bloque if-else

        if (data && data.length > 0) {
          const { CUIT, capitulo, maximo, score, porcentaje } = data[0]; // Desestructura los valores
          // console.log (`cuit: ${CUIT}, capitulo: ${capitulo}, maximo: ${maximo}, score: ${score}, porcentaje: ${porcentaje}`)

          const elemento = [
            capitulo,
            '##',
            nombre,
            maximo,
            score,
            porcentaje
          ];
          tablaMenuEs.push(elemento);
          // console.log (`elemento con totales: ${elemento}`)

          }
          else {
          // Si no hay totales, maneja el caso especial
            const elemento = [
              capitulo,
              '##',
              nombre,
              null,
              null,
              null,
            ];
            if (primeraVez == 0) {
              elemento[1] = pagina;
              primeraVez = 1;
            }
            tablaMenuEs.push(elemento);
            // console.log (`elemento por no tener total: ${elemento}`)
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

// procesarCapitulos();


function completarHtml() {

  let totmaximo = 0;
  let totcalif = 0;
  let totporcien = 0;
  let numeroConPunto = 0;

  const elemento = [
    null,
    null,
    'Resumen General:',
    null,
    null,
    null
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
    // celdaMaximo.textContent = tablaMenuA[i][3];
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
        // Acción a ejecutar cuando se haga clic en la imagen
        alert('Con "Aceptar" genera informe con los resultados en otra pestaña');
        generarPDF()
        // Aquí puedes poner cualquier código que desees ejecutar al hacer clic en la imagen
    });
    }
     else {
      celdaPDF.textContent = '';
    }

    if (i == tablaMenuA.length-1){
      // let formattedmaximo = Number(totmaximo).toLocaleString('es-ES'); // 'es-ES' para formato español (punto decimal y coma de mil)
      // celdaMaximo.textContent = formattedmaximo;
      const numeroFormateadoMx = formatearNumero(totmaximo);
      celdaMaximo.textContent = numeroFormateadoMx;

      // let formattedcalif = totcalif.toLocaleString('es-ES'); // 'es-ES' para 
      // celdaPuntos.textContent = formattedcalif;
      totcalif = totcalif.toFixed(2);      
      // let formattedcalif = totcalif.toLocaleString('es-ES'); // 'es-ES' para 
      // celdaPuntos.textContent = totcalif;
      // celdaPuntos.textContent = formattedcalif;

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

function formatearNumero(numero) {
  let partes = numero.toString().split('.');
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return partes.join(',');
}

procesarCapitulos();



/*
//  crear un evento para que cuando haga click en la pagina, corra estas funciones.

Luego, usa jsPDF para crear el PDF a partir de los datos obtenidos:

async function generarPDF() {
    const datos = await obtenerDatos();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Agregar título
    doc.setFontSize(18);
    doc.text('Informe de Datos', 10, 10);

    // Agregar tabla de datos
    let inicioY = 20;
    datos.forEach((fila, index) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${JSON.stringify(fila)}`, 10, inicioY);
        inicioY += 10;
    });

    // Guardar el PDF
    doc.save('informe.pdf');
}

// Llamar a la función para generar el PDF
// generarPDF();

// Mejora: Formatear la Tabla de Datos
// Para una mejor presentación de los datos, puedes formatear la tabla de manera más sofisticada. Aquí tienes un ejemplo más avanzado usando autoTable de jsPDF:*/

async function generarPDF() {
    const datos = await obtenerDatos();

    // Inicializar jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

      // Extraer CUIT y usuario del primer registro
    const { CUIT, usuario } = datos[0];

    // Agregar título
    doc.setFontSize(18);
    doc.text(`Informe de Datos para CUIT: ${CUIT} Usuario: ${usuario}`, 10, 10);

        // Configurar columnas para autoTable
    const columnas = [
      { title: "ID", dataKey: "ID" },
      // { title: "CUIT", dataKey: "CUIT" },
      // { title: "Usuario", dataKey: "usuario" },
      { title: "Capítulo", dataKey: "capitulo" },
      { title: "Sección", dataKey: "seccion" },
      { title: "Score", dataKey: "score" },
      { title: "Respuesta", dataKey: "respuesta" },
      // { title: "Fecha de Registro", dataKey: "fecharegistro" }
    ];
    // Agregar tabla de datos

    doc.autoTable({
      startY: 20,
      head: [columnas.map(col => col.title)],
      body: datos.map(row => columnas.map(col => row[col.dataKey]))
  });

    // Guardar el PDF
    // doc.save('informe.pdf');
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


// async function obtenerDatos() {
//   // Simulación de una llamada a una API o consulta a base de datos
//   return [
//       { ID: 1, CUIT: '20123456789', usuario: 'Usuario1', capitulo: 'A1', seccion: '01', score: 10, respuesta: '{"respuesta": "valor"}', fecharegistro: '2024-07-10 10:00:00' },
//       { ID: 2, CUIT: '20987654321', usuario: 'Usuario2', capitulo: 'B2', seccion: '02', score: 20, respuesta: '{"respuesta": "valor"}', fecharegistro: '2024-07-11 11:00:00' }
//       // Más registros...
//   ];
// }

async function obtenerDatos() {
  try {
    const response = await fetch('/respuestas');
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

/*
// Llamar a la función para generar el PDF
generarPDF();

Resumen
Estos pasos te permiten obtener datos de una base de datos MySQL, enviarlos al frontend y generar un informe en PDF usando jsPDF. Ajusta el código según tus necesidades específicas y el formato de tus datos.
*/
