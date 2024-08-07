const express = require('express');
const router = express.Router();
const Person = require('../models/Person');


router.post('/', async(req,res)=>{
    try{
        const data = req.body;
        const newPerson = new Person(data);
        const response = await newPerson.save();
        console.log('Data saved');
        res.status(200).json(response);
    }
    catch(error){
        console.error('error saving data', error);
        res.status(500).send('Error saving person');
    }
});



router.get('/', async(req, res) => {
    try{
        const data = await Person.find();
        console.log('Data fetched successfully');
        res.status(200).json(data);
    }
    catch(error){
        console.error('Error fetching data');
        res.status(500).send('Error retrieving person');
    }
})

router.put('/:id', async (req, res) =>{
    try{
        perosnId = req.params.id;
        const updatedPerson = await Person.findByIdAndUpdate(perosnId, req.body, {
            new: true,
            runValidators: true
        });
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
        const personId = req.params.id;
        const response = await Person.findOneAndDelete(personId);
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