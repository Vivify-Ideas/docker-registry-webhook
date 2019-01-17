const express = require('express')

const app = express();

app.get('/', (req, res) => res.end('works'))


module.exports = app