### Inserción de registros en MySQL :::::::::::::::::no se usa:::::::::::::::
app.post('/insertar', (req, res) => {
    tabla  a15 


### Inserción de respuestas  opcion 2 :::::::::::::::::::::::::::::::::::::
app.post('*/insertar2*', (req, res) => {    
    **tabla: respuestas**
    inserta: `'INSERT INTO respuestas (CUIT, usuario, capitulo, seccion, score, respuesta)`

###  PARA RECUPERAR DATOS JSON DE MYSQL ::::::::::::::::no se usa::::::::::
app.get('*/obtenerRespuestas*', (req, res) => {
    **tabla: respuestas**
    recupera por un dato en particular; `'SELECT * FROM respuestas WHERE id = 5'`

### Ruta para obtener todos las respuestas de la tabla ::::::::::::::::::::
app.get('*/respuestas*', (req, res) => {
        **tabla: respuestas**
        recupera: todas: `'SELECT * FROM respuestas'`;

### Ruta para saber si existe respuesta para la seccion ::::::::::::::::::::
app.get('*/busca-respuesta*', (req, res) => {
        **tabla: respuestas**
        recupera: por CUIT, capitulo y sección: `'SELECT * FROM respuestas WHERE cuit = ? AND capitulo = ? AND seccion = ?'`;

### Ruta para obtener todos los registros de la tabla secciones ::::::::::::::::::::
app.get('*/secciones*', (req, res) => {
        **tabla: secciones**
        recupera todo: `'SELECT * FROM secciones WHERE seccion = ?'`;

### Ruta para obtener los registros de la tabla capitulos ::::::::::::::::::::
app.get('*/capitulos*', (req, res) => {
        **tabla: capitulos**
        recupera por un ID en particular: `'SELECT * FROM capitulos WHERE ID = ?'`;

### Ruta para obtener los totales de la tabla totalcapitulos ::::::::::::::::::::
app.get('*/totalCapitulos*', (req, res) => {
        **tabla: capitulos**
        recupera para un CUIT y capitulo: `'SELECT * FROM totalcapitulos WHERE CUIT = ? AND capitulo = ?'`;

### Ruta para actualizar la tabla capitulos con los totales (opcion 2).:::::
app.post('*/total-Capitulo*', (req, res) => {    
        **tabla: totalcapitulos**
        guarda todo: `INSERT INTO totalcapitulos (CUIT, capitulo, maximo, score, porcentaje)`


### Rutas de la API  :::::::::::::::::::::::::::::::::::::::::
app.use('/api', routes);

### Ruta para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

### Ruta para servir el archivo login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

### Endpoint para validar credenciales :::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
        tabla: users

### Ruta protegida que requiere autenticación :::::::::::::::::::::::::::::::::::::::::.
app.get('/protected', (req, res) => {
    if (req.session.user) {

### Captura todas las otras rutas para mostrar un 404 :::::::::::::::::::::::::::::::::
app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
});    