const express = require('express');
const userModel = require('../models/User');
const app = express();

// Get user
app.get('/user', async (req, res) => {
    const user = await userModel.find({});
    try{
        console.log(user[0].name)
        res.status(200).send(user);
    }catch(err){
        res.status(500).send(err);
    }
})

// Create user
app.post('/user', async(req, res) => {
    console.log(req.body)
    const user = new userModel(req.body);
    try{
        await user.save((err) => {
            if(err){
                res.send(err);
            }else{
                res.send(user);
            }
        });
    }catch(err){
        res.status(500).send(err);
    }
})

module.exports = app
