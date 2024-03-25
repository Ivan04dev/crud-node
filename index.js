const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prueba'
});

// Establecer la conexión a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Configurar middleware para manejar datos del formulario
app.use(express.urlencoded({ extended: true }));

// Ruta para servir el formulario HTML para crear un usuario
app.get('/usuarios/nuevo', (req, res) => {
    res.sendFile(__dirname + '/formulario.html');
});

// Ruta para crear un nuevo usuario
app.post('/usuarios', (req, res) => {
    const { nombre, email, password } = req.body;
    const nuevoUsuario = { nombre, email, password };

    connection.query('INSERT INTO usuarios SET ?', nuevoUsuario, (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta de inserción:', err);
            res.status(500).send('Error al crear el usuario');
            return;
        }
        console.log('Nuevo usuario creado con éxito. ID:', result.insertId);
        // res.redirect('/usuarios');
        res.redirect('/usuarios/nuevo');
    });
});



// Ruta para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM usuarios', (err, rows) => {
        if (err) {
            console.error('Error al ejecutar la consulta de selección:', err);
            res.status(500).send('Error al recuperar los usuarios');
            return;
        }
        res.json(rows); // Enviar los registros como respuesta en formato JSON
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
