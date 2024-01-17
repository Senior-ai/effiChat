import express from 'express';

const app = express(); //express init

app.get('/', (req, res) => {
    res.send('test');
});

export default app;