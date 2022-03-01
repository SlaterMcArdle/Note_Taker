const express = require('express');
const fs = require('fs');
const path = require('path');

let notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/api/notes', (req,res) => {
    res.json(notes);
});

app.post('/api/notes', (req,res) => {
    // console.log(req);
    let noteObject = {
        title: req.body.title,
        text: req.body.text
    };
    // console.log(noteObject);
    let db = JSON.parse(fs.readFileSync('./db/db.json'));
    if(Array.isArray(db)) {
        db.push(noteObject);
    } else {
        db = [noteObject];
    }
    fs.writeFileSync('./db/db.json', db, (err) => {
        err ? console.error(err) : console.log('write success!');
    });
});

app.delete('/api/notes', (req,res) => {

});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));