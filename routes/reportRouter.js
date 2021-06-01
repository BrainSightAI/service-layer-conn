require('dotenv').config()
const express = require('express')
const router = express.Router()
const multer = require('multer')
const { ServiceBusClient } = require("@azure/service-bus");
const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage;

const yourCustomLogic = (req, file) => {
    return Date.now().toString() + "." + file.originalname.toLowerCase().split(" ").join("-")
}
const resolveBlobName = (req, file) => {
    return new Promise((resolve, reject) => {
        const blobName = yourCustomLogic(req, file);
        resolve(blobName);
    });
};
const azureStorage = new MulterAzureStorage({
    connectionString: 'DefaultEndpointsProtocol=https;AccountName=vuestorage1;AccountKey=w8hTY+1EWs9ox+NhL2JrM9cl6P129UqVNKmfaRubgveU06VlaIVODdhn1157QyO2nDoeM6stfDcG9UuBGWhGaQ==;EndpointSuffix=core.windows.net',
    accessKey: 'w8hTY+1EWs9ox+NhL2JrM9cl6P129UqVNKmfaRubgveU06VlaIVODdhn1157QyO2nDoeM6stfDcG9UuBGWhGaQ==',
    accountName: 'vuestorage1',
    containerName: 'vue-js-mri',
    blobName: resolveBlobName,
    containerAccessLevel: 'blob',
    urlExpirationTime: 60
});

const upload = multer({
    storage: azureStorage
});
// router.post('/', (req, res) => {
//     if (!req.body.patientId) {
//         return res.status(400).json({ message: "Bad request" })
//     }


router.post('/', upload.single('fileLocation'), (req, res) => {
    if (!req.body.patientId) {
        return res.status(400).json({ message: "Bad request" })
    }

    let filePath;
    const url = "https://vuestorage1.z13.web.core.windows.net/";
    if (req.file) {
        filePath = url + req.file.originalname;
    } else {
        filePath = req.body.fileLocation;
    }




    const patientReport = {
        _id: req.body._id,
        patientId: req.body.patientId,
        userId: req.body.userId,
        patient: req.body.patient,
        fileLocation: req.body.fileLocation
    }

    // connection string to your Service Bus namespace
    const connectionString = "Endpoint=sb://dataservice.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XNTSVIGcAsGCv+RQVWHgCOP3y85TB2iVro3/NlYD2CA="

    // name of the topic
    const topicName = "topic_temp"

    const messages = [{ body: patientReport }]

    async function main() {
        // create a Service Bus client using the connection string to the Service Bus namespace
        const sbClient = new ServiceBusClient(connectionString);

        // createSender() can also be used to create a sender for a topic.
        const sender = sbClient.createSender(topicName);
        // Send the last created batch of messages to the topic
        await sender.sendMessages(messages);

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
    res.status(200);

})
module.exports = router