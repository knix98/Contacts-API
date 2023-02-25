const express = require("express");

const router = express.Router();

const createContactController = require("../controllers/createContact");
const getContactController = require("../controllers/getContact");
const updateContactController = require("../controllers/updateContact");
const deleteContactController = require("../controllers/deleteContact");

router.post("/createContact", createContactController.createContact);
router.get("/getContact", getContactController.getContact);
router.post("/updateContact", updateContactController.updateContact);
router.post("/deleteContact", deleteContactController.deleteContact);

module.exports = router;
