const db       = require('../database/IDatabase');
const database = new db( "/database.json" );
const express  = require('express');
const session  = require('express-session');
const router   = express.Router();



// GET
router.get("/get", (req, res) => {

    res.send(database.getAllUsers());
})


router.get('/username_exists', (req, res) => {
    console.log(req.query);

    if (!req.query.username)
        res.status(400).send("Missing username");

    if (database.getUserByUsername(req.query.username)){
        res.status(200).send(true);
    }else{
        res.status(200).send(false);
    }
})


// ADD
router.post('/add', (req, res) => {

    let data = req.body;

    console.table(data);

    if (!data) { 
        res.sendStatus(400) 
        return;
    };

    req.session.username = data.username;

    console.log(ssn);

    database.add(data);

    res.sendStatus(201);
})


// UPDATE
router.put('/update', (req, res) => {

    let data = req.body;

    if (!data) { 
        res.sendStatus(400) 
        return;
    };

    console.log("Updating coin");
    console.table(data);

    database.update(data);

    res.send("Update success");
})


// DELETE
router.delete('/delete', (req, res) => {

    let currencyApiName = req.body.currencyApiName;

    if (!currencyApiName) { 
        res.sendStatus(400) 
        return;
    };

    console.log("Deleting coin");
    console.table(currencyApiName);

    database.delete(currencyApiName);

    res.send("Delete Success");
})

module.exports = router