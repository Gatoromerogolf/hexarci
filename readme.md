Creación del proyecto.

- Crear directorio
- npm  init -y (instala el package json)
- npm install express, mysql2, body-parser, dotenv, 
- npm install --save-dev nodemon
- npm install ejs
- npm install express-ejs-layouts

Crear a estructura de carpetas:
public, src, config, 

y archivos  .env  y el .gitignore

las carpetas contienen: 
public: index.html
src: controllers, models, middlewares, utils, services, app.js
config: config.js, database.js

Archivos básicos:
.env
port=3000
MONGO_URI=mongodb://localhost:27017/mydatabase

en src/app.js se configura el Express y se utilizan los paquetes instalados


Iniciar el servidor en modo desarrollo:
npm run dev

en modo producción:
npm start


no anduvo lo del EJS

Como instalar la aplicación en un servidor remoto:
Sí, tienes razón en que debes ejecutar `app.js` para iniciar tu servidor Express antes de acceder a él desde tu navegador. En tu entorno local, esto normalmente se hace usando un comando como `node src/app.js` o `npm start` si tienes definido un script de inicio en tu `package.json`.

### 1. Ejecución Local
Para ejecutar tu aplicación localmente:

1. **Inicia el servidor**:
   - Abre una terminal en el directorio raíz de tu proyecto.
   - Ejecuta `node src/app.js` o `npm start`.

2. **Accede a la aplicación**:
   - Abre un navegador web.
   - Navega a `http://localhost:3000` (o el puerto que hayas configurado).

### 2. Implementación en un Servidor Web

Para ejecutar tu aplicación en un servidor web, necesitas realizar algunos pasos adicionales. Normalmente, usarías un servicio de hosting de aplicaciones Node.js, como Heroku, AWS Elastic Beanstalk, DigitalOcean, o una configuración de servidor manual con Nginx y PM2, por ejemplo.

### Implementación en un Servidor Web (Ejemplo con Heroku)

Vamos a ver un ejemplo de cómo podrías implementar tu aplicación en Heroku:

1. **Instalar Heroku CLI**:
   - [Instala Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

2. **Inicializar el Proyecto en Heroku**:
   - Inicia sesión en Heroku: `heroku login`.
   - Desde tu terminal, navega a la carpeta raíz de tu proyecto y ejecuta: `heroku create`.

3. **Configurar el Proyecto**:
   - Asegúrate de que tu `package.json` tenga un script `start`:
     ```json
     "scripts": {
       "start": "node src/app.js"
     }
     ```
   - También asegúrate de que tu `package.json` especifique la versión de Node.js:
     ```json
     "engines": {
       "node": "14.x"
     }
     ```

4. **Agregar el código al repositorio de Heroku**:
   - Inicializa un repositorio Git si aún no lo tienes: `git init`.
   - Agrega tus archivos y haz commit: `git add .` y `git commit -m "Initial commit"`.
   - Configura Heroku como un remote: `heroku git:remote -a your-heroku-app-name`.
   - Despliega tu aplicación: `git push heroku master`.

5. **Configurar Variables de Entorno en Heroku**:
   - Puedes configurar variables de entorno como las credenciales de la base de datos usando: `heroku config:set VARIABLE_NAME=value`.

6. **Accede a tu Aplicación**:
   - Heroku te proporcionará una URL donde tu aplicación estará disponible.

### Ejemplo de Configuración para un Servidor Manual

Si decides implementar tu aplicación en un servidor manualmente (como un VPS), puedes usar Nginx para servir tu aplicación y PM2 para gestionarla.

1. **Instala Node.js, Nginx, y PM2**:
   - SSH en tu servidor.
   - Instala Node.js.
   - Instala Nginx.
   - Instala PM2 globalmente: `npm install pm2 -g`.

2. **Sube tu Código al Servidor**:
   - Puedes usar `scp` o cualquier otro método para transferir tu proyecto al servidor.

3. **Configura Nginx**:
   - Edita la configuración de Nginx para que redirija las solicitudes a tu aplicación Node.js.

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   - Guarda la configuración y reinicia Nginx: `sudo systemctl restart nginx`.

4. **Ejecuta tu Aplicación con PM2**:
   - Navega a tu proyecto en el servidor.
   - Ejecuta `pm2 start src/app.js`.
   - Guarda la configuración de PM2 para que tu aplicación se inicie al reiniciar el servidor: `pm2 save` y `pm2 startup`.

Con esta configuración, tu aplicación estará corriendo en tu servidor y servida a través de Nginx. Las solicitudes a `your-domain.com` serán redirigidas a tu aplicación Node.js que está ejecutándose en el puerto 3000. PM2 se encargará de gestionar el proceso de la aplicación, asegurándose de que se reinicie en caso de falla y se inicie automáticamente al arrancar el servidor.


Esta debería ser la estructura de directorios y archivos:
my-project/
│
├── public/                   # Archivos estáticos
│   ├── css/                  # Archivos CSS
│   ├── js/                   # Archivos JavaScript
│   ├── images/               # Imágenes
│   ├── index.html            # Página principal
│   ├── login.html            # Página de login
│   └── ...                   # Más páginas HTML
│
├── src/                      # Código fuente del servidor
│   ├── controllers/          # Controladores para manejar la lógica de negocio
│   ├── models/               # Modelos de base de datos
│   ├── routes/               # Definición de rutas
│   ├── services/             # Servicios auxiliares
│   ├── middlewares/          # Middlewares personalizados
│   ├── utils/                # Utilidades varias
│   └── app.js                # Configuración y arranque de la aplicación
│
├── config/
│   ├── config.js
│   ├── database.js
│   └── ...
│
├── test/                     # Archivos de prueba
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md


FUNCIONAMIENTO DEL LOGIN....
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



hAY QUE CAMBIAR EL LINK A  LOGIN.HTML  para que utilice la ruta definida en tu servidor Express. Dado que configuraste una ruta en tu app.js para servir login.html a través de /login, el enlace debería apuntar a esa ruta en lugar de a login.html directamente. Esto garantiza que todas las rutas sean manejadas correctamente por el servidor y te permite aprovechar cualquier lógica adicional que hayas configurado en tu servidor.

:::::::::::::::::::::::::::::::::::::::::::::::::::

Instalación de la aplicación.

En AWS EC2 o DigitalOcean

1.Conéctate al servidor mediante SSH.
2.Crea un directorio para tu aplicación, por ejemplo, /var/www/my-app.

3.Sube todos los archivos del proyecto a este directorio.
4-Ve al directorio de tu aplicación:

cd /var/www/my-app

5.Instala las dependencias:

npm install

6. Inicia tu aplicación con PM2 o una herramienta similar:
pm2 start app.js

bash
Copiar código
npm install
Inicia tu aplicación con PM2 o una herramienta similar:
bash

pm2 start app.js --name "my-app"
pm2 startup
pm2 save


cd /var/www/my-app
Instala las dependencias:
bash
Copiar código
npm install
Inicia tu aplicación con PM2 o una herramienta similar:
bash
Copiar código
pm2 start app.js
4. Permisos y Seguridad
Asegúrate de que los archivos y directorios tienen los permisos correctos para que el servidor web y Node.js puedan acceder a ellos. Puedes ajustar los permisos usando chmod en sistemas Unix:

bash
Copiar código
chmod -R 755 /var/www/my-app
5. Variables de Entorno
Configura las variables de entorno necesarias en el servidor para que tu aplicación pueda acceder a la base de datos y otros recursos. En muchos proveedores de hosting, esto se puede hacer a través del panel de control o mediante la configuración de archivos .env.

6. Scripts de Inicio y Gestión de Procesos
Usa scripts de inicio y herramientas de gestión de procesos como PM2 para asegurarte de que tu aplicación se reinicia automáticamente en caso de fallo y se ejecuta en segundo plano.

Ejemplo de configuración con PM2:

pm2 start app.js --name "my-app"
pm2 startup
pm2 save

Resumen
app.js debe estar en la raíz de tu proyecto.
Sube toda la estructura del proyecto al servidor manteniendo la jerarquía de archivos.
Usa herramientas de gestión de procesos como PM2 para ejecutar tu aplicación en segundo plano.
Configura las variables de entorno y permisos adecuados en tu servidor.







