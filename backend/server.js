const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

let items = [
    { id: '1', name: 'Item One' },
    { id: '2', name: 'Item Two' }
];
let nextId = 3; 

const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.get('/api/items', async (req, res) => {
    console.log('GET /api/items received');
    await simulateDelay(1000); 
    res.json(items);
});

app.post('/api/items', async (req, res) => {
    console.log('POST /api/items received', req.body);
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    const newItem = { id: String(nextId++), name };
    items.push(newItem);
    await simulateDelay(700); 
    res.status(201).json(newItem);
});

app.delete('/api/items/:id', async (req, res) => {
    console.log('DELETE /api/items/:id received', req.params.id);
    const { id } = req.params;
    const initialLength = items.length;
    items = items.filter(item => item.id !== id);
    if (items.length < initialLength) {
        await simulateDelay(500); 
        res.status(200).json({ message: `Item ${id } deleted` });
    } else {
    res.status(404).json({ message: 'Item not found' });
}
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});