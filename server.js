const express = require('express')
const reportRouter = require('./routes/reportRouter')
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express()


app.use(cors())

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/report', reportRouter)


var port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Started listening on ${port}`)
})