const express = require('express');
const path = require('path');
const generateUniqueId = require('generate-unique-id');  // npm package to generate unique id
let notes = require('./db/db.json');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));


app.get('/notes', (req, res) => {
    console.info(`GET /api/notes`);
    res.sendFile(path.join(__dirname,'/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    console.log('got to /api/notes');
    res.status(200).json(notes);
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.post('/api/notes', (req, res) => {
    console.log('Reached post for /api/notes');

    const {title, text} = req.body;

    if (title && text){
        const newNote = {
            title,
            text,
            id: generateUniqueId({
                length: 24,
                useLetters: false,
            })
        };

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if(err){
                console.error(err);
            } else{
                const parsedNotes = JSON.parse(data); // use parsedNotes
                parsedNotes.push(newNote);
                notes.push(newNote);
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                        ? console.error(writeErr)
                        :res.status(200).json(notes)

                );
            }
        });
        
    }
});

app.delete('/api/notes/:id', (req, res) => {

    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if(err){
            console.error(err);
        } else {
            let parsedNotes = JSON.parse(data);
            parsedNotes = parsedNotes.filter(note => note.id != req.params.id);
            notes = parsedNotes;
            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                    writeErr
                    ? console.error(writeErr)
                    :res.status(200).json(notes)
            )
        }
    });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
