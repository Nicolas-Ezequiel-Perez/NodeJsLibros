import express from 'express'
import {config} from 'dotenv'
import mongoose from 'mongoose'
import librosRoutes from './rutas/libro.routes.js'
import bodyParser from 'body-parser'

config()

// usamos express para los middleware
const app = express()
// esto hace que express use el middleware o algo asi
app.use(bodyParser.json())

// no se porque se pasa el db name como un objeto
mongoose.connect(process.env.MONGO_URL, {dbName : process.env.MONGO_DB_NAME})
const db = mongoose.connection;

app.use('/libros', librosRoutes)

// aca por alguna razon no usa env-var
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`)
})