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
        let page = parseInt(req.query.page) || 1;
        let docPerPage = 5
        let skip = (page - 1) * docPerPage;
        let limit = docPerPage;

        let pipeline = [
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    docs    : "$data",
                    page : "${page}",
                }
            }
        ];

        let result = await person.aggregate(pipeline).exec();
        res.send(result);
    } catch (error) {
        console.error('Error fetching data', error);
        res.status(500).send('Error retrieving person');
    }
});




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
