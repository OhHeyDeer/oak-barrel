const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3333;
const db = require('./db');

const connection = require('./dbController');

app.use(express.static('../client/dist'));
app.use(express.json());
app.use(cors());

// Request for all users
app.get('/users', (req, res) => {
    console.log('Getting All Users');
    connection.getAll(req, res)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(404).send(err));
})

// Request for a username
app.get('/users/:name', (req,res) => {
    connection.getOne(req, res)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err));
});

app.put('/users/update', (req, res) => {
    connection.updateOne(req, res)
    .then(data => res.status(201).send(data))
    .catch(err => res.status(401).send(err));
})

// Add a new user to the db
app.post('/users/add', (req, res) => {
    connection.addUser(req, res)
        .then(data => res.status(201).send(data))
        .catch(err => res.status(401).send(err));
})

app.listen(PORT, () => {
    console.log(`Now Drinking on port ${PORT}`);
});