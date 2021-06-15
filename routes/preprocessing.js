require('dotenv').config()
const express = require('express')
const router = express.Router()
const axios = require('axios');
const { response } = require('express');

router.get('/:patientID',(req,res)=>{
    const status=req.params.patientID+"-Success";
    res.status(200).json({msg:status});
})

router.get('/test',(req,res)=>{
    axios.post("http://localhost:5000/preprocessing",{patientID:req.body.patientID}).then(response=>{
        //res.status(200).json(response);
        console.log(response);
    })
})

module.exports = router