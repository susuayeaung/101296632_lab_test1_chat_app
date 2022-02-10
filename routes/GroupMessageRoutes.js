const express = require('express');
const groupMessageModel = require('../models/GroupMessage');
const app = express();

// Get group message
app.get('/groupMessage', async(req, res) => {
    const groupMessage = await groupMessageModel.find({});
    try{
        console.log(groupMessage[0].name)
        res.status(200).send(groupMessage);
    }catch(err){
        res.status(500).send(err);
    }
})

// Create group message
app.post('/groupMessage', async(req, res) => {
    console.log(req.body)
    const groupMessage = new groupMessageModel(req.body);
    try{
        await groupMessage.save((err) => {
            if(err){
                res.send(err)
            }else{
                res.send(groupMessage);
            }
        })
    }catch(err){
        res.status(500).send(err);
    }
})

module.exports = app
