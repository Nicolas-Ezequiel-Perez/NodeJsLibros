import express from 'express'
import Libro from '../modelos/libro.model.js'

export const router = express.Router()

//middleware
const getLibro = async (req, res, next) => {
    let libro;
    const { id } = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message : 'El id del libro no es valido.'
        })
    }

    try {
        libro = await Libro.findById(id);
        if(!libro) {
            return res.status(404).json({
                message : 'El libro no fue encontrado.'
            })
        } 
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }

    res.libro = libro;
    next();
    // el next no entendi que hace pero dijo que reconfigura el libro
}

// obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const libros = await Libro.find();
        // no entendi para que es este log
        console.log('GET ALL', libros)
        if(libros.length === 0) {
            res.status(204).json({})
        }
        res.json(libros)
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
})

// crear un nuevo libro
router.post('/', async(req, res) => {
    const {titulo, autor, genero, fechaDePublicacion} = req?.body
    // el ? es por si req es nulo
    if(!titulo || !autor || !genero || !fechaDePublicacion) {
        return res.status(400).json({
            message : 'Los campos titulo, autor, genero y fecha de publicacion son obligatorios.'
        })
    }

    const libro = new Libro ({
        titulo,
        autor,
        genero,
        fechaDePublicacion
    })

    try {
        const libroNuevo = await libro.save()
        console.log(libroNuevo)
        res.status(201).json(libroNuevo)
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
})

// get individual
router.get('/:id', getLibro, async(req, res) => {
    res.json(res.libro);
})

// put
router.put('/:id', getLibro, async(req, res) => {
    try {
        const libro = res.libro

        libro.titulo = req.body.titulo || libro.titulo;
        libro.autor = req.body.autor || libro.autor;
        libro.genero = req.body.genero || libro.genero;
        libro.fechaDePublicacion = req.body.fechaDePublicacion || libro.fechaDePublicacion;

        const libroActualizado = await libro.save()
        res.json(libroActualizado)
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
})

// patch
router.patch('/:id', getLibro, async(req, res) => {
    if(!req.body.titulo && !req.body.autor && !req.body.genero && !req.body.fechaDePublicacion){
        res.status(400).json({
            message : "Alguno de los campos debe ser enviado."
        })
    }

    try {
        const libro = res.libro

        libro.titulo = req.body.titulo || libro.titulo;
        libro.autor = req.body.autor || libro.autor;
        libro.genero = req.body.genero || libro.genero;
        libro.fechaDePublicacion = req.body.fechaDePublicacion || libro.fechaDePublicacion;

        const libroActualizado = await libro.save()
        res.json(libroActualizado)
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
})

// delete
router.delete('/:id', getLibro, async(req, res) => {
    try {
        const libro = res.libro;
        await libro.deleteOne({
            _id : libro._id
        });
        res.json({
            message : `El libro ${res.libro.titulo} fue eliminado correctamente.`
        })
    } catch(error) {
        res.status(500).json({
            message : error.message
        })
    }
})

export default router