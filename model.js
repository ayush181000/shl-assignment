const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    projectTitle: String,
    projectTechnologies: String,
    technicalSkillsetFrontend: String,
    technicalSkillsetBackend: String,
    technicalSkillsetDatabases: String,
    technicalSkillsetInfrastructre: String,
    otherInformationAvailability: String,
});

module.exports = mongoose.model("shl", schema);
