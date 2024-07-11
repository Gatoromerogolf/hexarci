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




async function generarPDF() {
    const datos = await obtenerDatos();
    console.log(datos);
    // const datosRpta = await cambiarDatos(datos);
    await cambiarDatos(datos);
    console.log(datos);

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

async function cambiarDatos(datos) {
  datos.forEach(fila => {
    // Verificar si el Numero es igual al valor buscado
    if (fila.tipo === 1) {
        // Agregar el campo Referencia
        busca1SiNo();
        fila.respta = "SI";
    } else {
      if (fila.tipo === 2) {
        busca2Por(fila);

      } else {
        if (fila.tipo === 3) {
          busca3Nume();
          fila.respta = fila.tipo
        } else {
          if (fila.tipo === 4) {
            busca4Check()
            fila.respta = "texto encadenado"
          }
          else {
            busca5Varios()
            fila.respta = "4 o más"
          }
        }
      }
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


// // leer la respuesta para ese CUIT - capitulo - seccion
// //  busca-respuesta-full

// const preguntas = await obtenerDatos(); // recupera todas las preguntas

// console.log(preguntas)

// const respuestas = await 



