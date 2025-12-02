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

mongoose.connect(process.env.MONGODB_URI, { dbName: 'AF'})
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro na conexão:', err.mensage))

const movimentacoesSchema = new mongoose.Schema({
    data: { type: String, required: true},
    valor: { type: Number, required: true},
    tipo: { type: String, required: true, trim: true},
}, { collection: 'Movimentacoes', timestamps: true });
const Movimentacao = mongoose.model('AF', movimentacoesSchema, 'Movimentacoes');

app.get('/', (req, res) => res.json({ msg: 'API rodando' }));

app.post('/movimentacao', async (req, res) => {
    const movimentacao = await Movimentacao.create(req. body);
    res.status(201).json(movimentacao);
})

app.get('/movimentacoes', async (req, res) => {
    const movimentacoes = await Movimentacao.find();
    res.json(movimentacoes);
})

app.listen(process.env.PORT, () => 
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
)

app.put('/movimentacoes/:id', async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido'});
        }
        const movimentacao = await Movimentacao.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true, overwrite: true}

        );
        if (!movimentacao) return res.status(404).json({ error: 'Movimentação não encontrdada' });
        res.json(movimentacao);
    } catch(err) {
        res.status(400).json({ error: err.message});
    }
});

app.delete('/movimentacoes/:id', async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido'});
        }
        const movimentacao = await Movimentacao.findByIdAndDelete(req.params.id);
        if (!movimentacao) return res.status(404).json({ error: 'Movimentação não encontrada' });
        res.json({ ok: true});
    } catch {
        res.status(500).json({ error: err.message});
    }
});

app.get('/movimentacoes/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'Id inválido'});
        }
        const movimentacao = await Aluno.findById(req.params.id);
        if (!movimentacao) return res.status(404).json({ error: 'Movimentação não encontrada' });
        res.json({ ok: true});
    } catch {
        res.status(500).json({ error: err.message});
    }
});