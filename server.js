import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

mongoose.connect(process.env.MONGODB_URI, { dbName: 'Aula'})
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro na conexão:', err.mensage))

const alunoSchema = new mongoose.Schema({
    nome: { type: String, required: true, trim: true, minlength: 2},
    idade: { type: Number, required: true, min: 0, max: 120},
    curso: { type: String, required: true, trim: true},
    notas: { type: [Number], default: [], validate: v => v.every(n => n >=0 && n <= 10)}
}, { collection: 'Alunos', timestamps: true });
const Aluno = mongoose.model('Aluno', alunoSchema, 'Alunos');

app.get('/', (req, res) => res.json({ msg: 'API rodando' }));

app.post('/aluno', async (req, res) => {
    const aluno = await Aluno.create(req. body);
    res.status(201).json(aluno);
})

app.get('alunos', async (req, res) => {
    const alunos = await Aluno.find();
    res.json(alunos);
})

app.listen(process.env.PORT, () => 
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
)

app.put('/alunos/:id', async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido'});
        }
        const aluno = await Aluno.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true, overwrite: true}

        );
        if (!aluno) return res.status(404).json({ error: 'Aluno não encontrdado' });
        res.json(aluno);
    } catch(err) {
        res.status(400).json({ error: err.message});
    }
});

app.delete('/alunos/:id', async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido'});
        }
        const aluno = await Aluno.findByIdAndDelete(req.params.id);
        if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
        res.json({ ok: true});
    } catch {
        res.status(500).json({ error: err.message});
    }
});

app.get('/alunos/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'Id inválido'});
        }
        const aluno = await Aluno.findById(req.params.id);
        if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
        res.json({ ok: true});
    } catch {
        res.status(500).json({ error: err.message});
    }
});