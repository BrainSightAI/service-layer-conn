const express = require('express')
const sendData = require('./routes/sendData')
const getStatusCode = require('./routes/getStatusCode')
const preprocessing = require('./routes/preprocessing')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()


app.use(cors())

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/sendData', sendData);
app.use('/getStatusCode', getStatusCode);
app.use('/preprocessing', preprocessing);


var port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Started listening on ${port}`)
})