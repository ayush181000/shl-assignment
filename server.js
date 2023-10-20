const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { OpenAI } = require("openai");

const shl = require('./model');

require('dotenv').config();

const openai = new OpenAI({
    api_key: process.env.OPENAI_API_KEY
});

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));;

app.get('/', async (req, res) => {
    try {

        // console.log(req.query);

        let query = {};

        if (req.query.smartSearch) {
            const completion = await openai.completions.create({
                prompt: `Turn this search query into a json search query which can be executed directly in mongodb: ${req.query.smartSearch}. Always give response in a correct json format and do not add anything before and after it.Use only frontend, backend, technologies, infrastructure,name as object keys if required. Treat all the keys as comma seperated values in a string.`,
                model: "gpt-3.5-turbo-instruct",
                max_tokens: 200
            });
            console.log(completion.choices[0])

            try {
                query = JSON.parse(completion.choices[0].text);
            } catch (error) {
                console.log(error)
            }

        }

        if (req.query.projectTitle || query.name) {
            query.name = { $regex: req.query.projectTitle || query.name, $options: 'i' }
        }

        if (req.query.projectTechnologies || query.technologies) {
            query.technologies = { $regex: req.query.projectTechnologies || query.technologies, $options: 'i' }
        }

        if (req.query.technicalSkillsetFrontend || query.frontend) {
            query.frontend = { $regex: req.query.technicalSkillsetFrontend || query.frontend, $options: 'i' }
        }

        if (req.query.technicalSkillsetBackend || query.backend) {
            query.backend = { $regex: req.query.technicalSkillsetBackend || query.backend, $options: 'i' }
        }

        if (req.query.technicalSkillsetDatabases || query.databases) {
            query.databases = { $regex: req.query.technicalSkillsetDatabases || query.databases, $options: 'i' }
        }

        if (req.query.technicalSkillsetInfrastructre || query.infrastructre) {
            query.infrastructre = { $regex: req.query.technicalSkillsetInfrastructre || query.infrastructre, $options: 'i' }
        }

        if (req.query.otherInformationAvailability || query.availability) {
            query.availability = { $regex: req.query.otherInformationAvailability || query.availability, $options: 'i' }
        }

        console.log(query)
        const jsonData = await shl.find(query);

        return res.status(200).json({ data: jsonData });
    } catch (error) {
        console.log(error.message);
        return res.status(400).send(error);
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