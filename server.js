const express = require('express');
const path = require('path');
const generateUniqueId = require('generate-unique-id');  // npm package to generate unique id
const notes = require('./db/db.json');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));


app.get('/notes', (req, res) => {
    console.info(`GET /api/notes`);
    res.sendFile(path.join(__dirname,'/public/notes.html'))
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});


