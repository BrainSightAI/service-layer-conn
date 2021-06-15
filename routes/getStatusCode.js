require('dotenv').config()
const express = require('express')
const router = express.Router()
const { ServiceBusClient } = require("@azure/service-bus");

// connection string to your Service Bus namespace
const connectionString = "Endpoint=sb://dataservice.servicebus.windows.net/;SharedAccessKeyName=receive-status;SharedAccessKey=88WspeKpSRa8+NppEM6W1lb8ekVpWfRgshlK+2BqQR8=;EntityPath=statuscode"

// name of the queue
const queueName = "statuscode"

 async function main(req,res) {

  const sbClient = new ServiceBusClient(connectionString);
	// If receiving from a subscription you can use the acceptSession(topic, subscription, sessionId) overload

  let sessionId= req.body.sessionId;

  console.log(`Creating session receiver for session '${sessionId}'`);
  const receiver = await sbClient.acceptSession(queueName, sessionId);

  const subscribePromise = new Promise((_, reject) => {
    const processMessage = async (message) => {
      console.log(`Received: ${message.sessionId} - ${message.body} `);
      res.status(200).json(message.body);
    };
    const processError = async (args) => {

      console.log(`>>>>> Error from error source ${args.errorSource} occurred: `, args.error);
      console.log(args.error.code);
      if(args.error.code =="SessionLockLost"){
        console.log("Connection Error");
        main(req,res);
      }
      reject(args.error);
    };

    receiver.subscribe({
      processMessage,
      processError
    });
  });

  try {
    await Promise.race([subscribePromise]).then(m=>{
      receiver.close();
    });
  } catch (err) {
    // `err` was already logged part of `processError` above.
     receiver.close();
  }
  
}

router.get('/',(req,res,next)=>{
    // call the main function
    main(req,res).catch((err) => {
        console.log("Error occurred: ", err);
        if(err.condition=="amqp:connection:forced"){
          console.log("connection error");
        }
    });
})

module.exports = router