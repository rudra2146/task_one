const express = require('express');
const router = express.Router();
const person = require('../models/person');

router.post('/', async (req, res) => {
    try {
        let existingPerson = await person.findOne({ email: req.body.email });
        if (existingPerson) {
            return res.status(400).json( 'Email already exists');
        }

        let newPerson = new person(req.body);
        let response = await newPerson.save();
        
        res.status(201).json(response);
    } catch (error) {
        console.error('Error saving data', error);
        res.status(500).send('Error saving person');
    }
});



router.get('/', async (req, res) => {
    try {
        let match = {};

        if (req.query.first_name) {
            match.first_name = new RegExp(req.query.first_name, 'i'); 
        }

        let page = parseInt(req.query.page) || 1;
        let docPerPage = parseInt(req.query.limit) || 5;
        let skip = (page - 1) * docPerPage;
        let limit = docPerPage;
        let pipeline = [
            { $match: match }, 
            {
                $facet: {
                    docs: [
                        { $skip: skip },
                        { $limit: docPerPage },
                        { $project: { _id: 1, first_name: 1, last_name: 1, email: 1, password: 1, phone_numer: 1 ,__v:1} },
                    ],
                }
            },
            {
                $project: {
                    docs: 1,
                    "Total Pages": { $literal: docPerPage }
                }
            }
        ];

        
        let result = await person.aggregate(pipeline).exec();

        if (!result[0].docs.length) {
            return res.status(404).json("No documents found");
        }

        res.status(200).json(result[0]); 
    } catch (error) {
        console.error('Error fetching data', error);
        res.status(500).send('Error retrieving person');
    }
});

module.exports = router;





router.put('/:id', async (req, res) => {
    try {
        let personId = req.params.id;
        let updatedPerson = await person.findByIdAndUpdate(personId, req.body, {
            new: true,
            runValidators: true
        }).lean();

        if (!updatedPerson) {
            return res.status(404).send('Person not found');
        }

        console.log('Data updated successfully');
        res.status(200).json(updatedPerson);
    } catch (error) {
        console.error('Error updating data', error);
        res.status(500).send('Error updating person');
    }
});




router.delete('/:id', async (req, res) => {
    try {
        let personId = req.params.id;
        let response = await person.findByIdAndDelete(personId).lean();

        if (!response) {
            return res.status(404).send('Person not found');
        }

        console.log('Data deleted successfully');
        res.status(200).json('Person deleted');
    } catch (error) {
        console.error('Error deleting data', error);
        res.status(500).send('Error deleting person');
    }
});

module.exports = router;
