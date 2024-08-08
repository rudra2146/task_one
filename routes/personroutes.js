
const express = require('express');
const router = express.Router();
const person = require('../models/person');


router.post('/', async(req,res)=>{
    try{
        let data = req.body;
        let newPerson = new person(data);
        let response = await newPerson.save();
        console.log('Data saved');
        res.status(201).json(response);
    }
    catch(error){
        console.error('error saving data', error);
        res.status(500).send('Error saving person');
    }
});



router.get('/', async(req, res) => {
    try{
        let data = await person.find().lean();
        console.log('Data fetched successfully');
        res.status(200).json(data);
    }
    catch(error){
        console.error('Error fetching data',error);
        res.status(500).send('Error retrieving person');
    }
})

router.put('/:id', async (req, res) =>{
    try{
        let personId = req.params.id;
        let updatedPerson = await person.findByIdAndUpdate(personId, req.body, {
            new: true,
            runValidators: true
        }).lean();
        if(!updatedPerson){
            return res.status(404).send('Person not found');
        }
        console.log('Data updated successfully');
        res.status(200).json(updatedPerson);
    }
    catch(error){
        console.error('Error updating data', error);
        res.status(500).send('Error updating person');
    }
})


router.delete('/:id', async(req, res) => {
    try{
        let personId = req.params.id;
        let response = await person.findByIdAndDelete(personId).lean();
        if(!response){
            return res.status(404).send('Person not found');
        }
        console.log('Data deleted successfully');
        res.status(200).json('Person deleted');
    }
    catch(error){
        console.error('Error deleting data', error);
        res.status(500).send('Error deleting person');
    }
})

module.exports = router;


