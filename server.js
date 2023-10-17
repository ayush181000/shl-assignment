const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const shl = require('./model');

require('dotenv').config();

const app = express();
// app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: '*' }));;

app.get('/', async (req, res) => {
    try {

        console.log(req.query);

        const query = {};

        if (req.query.projectTechnologies) {
            query.projectTechnologies = { $regex: req.query.projectTechnologies, $options: 'i' }
        }

        if (req.query.technicalSkillsetFrontend) {
            query.technicalSkillsetFrontend = { $regex: req.query.technicalSkillsetFrontend, $options: 'i' }
        }

        if (req.query.technicalSkillsetBackend) {
            query.technicalSkillsetBackend = { $regex: req.query.technicalSkillsetBackend, $options: 'i' }
        }

        if (req.query.technicalSkillsetDatabases) {
            query.technicalSkillsetDatabases = { $regex: req.query.technicalSkillsetDatabases, $options: 'i' }
        }

        if (req.query.technicalSkillsetInfrastructre) {
            query.technicalSkillsetInfrastructre = { $regex: req.query.technicalSkillsetInfrastructre, $options: 'i' }
        }

        if (req.query.otherInformationAvailability) {
            query.otherInformationAvailability = { $regex: req.query.otherInformationAvailability, $options: 'i' }
        }

        const data = await shl.find(query);

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }

})

const PORT = process.env.PORT || 4000;

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('DB connection established')
        app.listen(PORT, () => {
            console.log(`Server is listening on ${PORT}`);
        });
    })
    .catch((err) => {
        console.log('database connection failed. Server not started');
        console.error(err);
    });

