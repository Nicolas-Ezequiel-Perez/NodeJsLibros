import mongoose from 'mongoose';

const libroSchema = new mongoose.Schema(
    {
        titulo : String,
        autor : String,
        genero : String,
        fechaDePublicacion : String
    }
)

export default mongoose.model('Libro', libroSchema);