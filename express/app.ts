import express from 'express';

const app = express();

app.get('/', (req, res) => res.end('works'));

export default app;
