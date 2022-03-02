// Import npm modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// set the listening port and instantiate express
const PORT = process.env.PORT || 3001;
const app = express();

// Set express to handle both json and url encoded queries
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set express to serve static assets from the public diretory
app.use(express.static('public'));

// return a json array of saved notes
app.get('/api/notes', (req,res) => {
    console.log('GET REQUEST');
    res.json(JSON.parse(fs.readFileSync('./db/db.json')));
});

// update the array of saved notes with a new note
app.post('/api/notes', (req,res) => {
    console.log("POST REQUEST");
    // console.log(req);
    let noteObject = {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text
    };
    let db = JSON.parse(fs.readFileSync('./db/db.json'));
    db.push(noteObject);
    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
        if (err) {
            res.status(500).json(err);
        } else {
            const response = {
                status: 'success',
                body: db,
            }; 
            console.log(response);
            res.status(201).json(response);
        }
    });
});

// delete a specific note by way of its id
app.delete('/api/notes/:id', (req,res) => {
    console.log('DELETE REQUEST');
    let db = JSON.parse(fs.readFileSync('./db/db.json'));
    let id = req.params.id;
    console.log(id);
    const found = db.findIndex((note) => note.id == id);
    console.log(found);
    if (found > -1) {
        const note = db[found];
        db.splice(found, 1);
        fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json({
                    status: 'success!',
                    removed: note
                });
            }
        });
    } else {
        res.status(500).json({
            status: 'Failure! ID not found.',
            removed: 'nothing'
        });
    }
});

// serve the notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// serve the index anding page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// start listening on the set port
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));