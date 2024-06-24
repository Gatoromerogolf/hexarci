Explicación
Estructura del Proyecto:

    Coloca todos los archivos HTML, CSS y JavaScript en la carpeta public.

Configuración de app.js:

    Se configura el servidor para servir archivos estáticos desde el directorio public.
    Se define una ruta GET para servir el archivo login.html.
    Se define un endpoint POST para manejar la validación de las credenciales enviadas desde el formulario de login.

Archivo login.html:

    Un formulario HTML simple que envía las credenciales de usuario y contraseña al servidor para su validación.

Archivo login.js:

    Maneja el envío del formulario de manera asíncrona usando fetch y muestra el resultado de la validación en la página.
    
Con esta configuración, cuando un usuario visita http://localhost:3000/login, verá el formulario de login. Al enviar el formulario, las credenciales se enviarán al servidor para su validación y se mostrará un mensaje en la página dependiendo del resultado.