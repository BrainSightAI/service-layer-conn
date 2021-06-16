require('dotenv').config()
const express = require('express')
const router = express.Router()
const multer = require('multer')
const { ServiceBusClient } = require("@azure/service-bus");
const fs = require('fs')
const authenticate = require('../middleware/zipfunction/zip')

var dir = "zipyfy";
var dicomdir = "diacomfolder"
var subDirectory = "zipyfy/zip";
var subDirectory = "zipyfy/zip";
var sub2Directory = "zipyfy/unzip";

if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true });
    fs.mkdirSync(dir);
    fs.mkdirSync(subDirectory);
    fs.mkdirSync(sub2Directory);


    if (!fs.existsSync(dicomdir)) {
        fs.mkdirSync(dicomdir)
    }
}

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "zipyfy/zip");
    },
    filename: function(req, file, cb) {
        cb(
            null,
            (file.originalname)
        );
    },
});
var compressfilesupload = multer({ storage: storage });
router.post('/', compressfilesupload.array("file", 100), authenticate, (req, res) => {

    const data = JSON.parse(req.body.body);
    // const patientid = data.patientId;
    const patientReport = {
        _id: data._id,
        patientId: data.patientId,
        userId: data.userId,
        patient: data.patient,
        fileLocation: data.fileLocation
    }

    // connection string to your Service Bus namespace
    const connectionString = "Endpoint=sb://dataservice.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XNTSVIGcAsGCv+RQVWHgCOP3y85TB2iVro3/NlYD2CA="

    // name of the topic
    const topicName = "topic_temp"

    const messages = [{ body: patientReport }]

    async function main() {
        // create a Service Bus client using the connection string to the Service Bus namespace
        // const sbClient = new ServiceBusClient(connectionString);

        // createSender() can also be used to create a sender for a topic.
        // const sender = sbClient.createSender(topicName);
        // Send the last created batch of messages to the topic
        // await sender.sendMessages(messages);

        console.log(`Sent a messages to the topic: ${topicName}`);

        // Close the sender
        await sender.close(); {
            await sbClient.close();
        }
    }
    // call the main function
    main().catch((err) => {
        console.log("Error occurred: ", err);
        process.exit(1);
    });
    //   return patientReport
    res.status(200).json(patientReport);

})
module.exports = router