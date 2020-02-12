
// load .env
require('dotenv').config();

// load dependencies
const { workflow, task } = require('zenaton');

// define tasks
task("FindPersonByEmail", require("./tasks/findPersonByEmail"));
task("FindOrganizationByName", require("./tasks/findOrganizationByName"));
task("AddNote", require("./tasks/addNote"));
task("CreateDeal", require("./tasks/createDeal"));
task("CreateOrganization", require("./tasks/createOrganization"));
task("CreatePerson", require("./tasks/createPerson"));
task("PostMessage", require("./tasks/postMessage"));

// define workflows
workflow("PipedriveSync", require("./workflows/PipedriveSync"));
