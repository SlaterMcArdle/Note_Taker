const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/api/notes', (req,res) => {
    console.log('GET REQUEST');
    res.json(JSON.parse(fs.readFileSync('./db/db.json')));
});

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

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));