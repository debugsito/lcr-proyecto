import RedisClientSingleton from './redisClient';
import AWS from "aws-sdk";
import config from "./config";

AWS.config.update({ region: config.dynamodb.region, });
const lambda = new AWS.Lambda({ region: config.dynamodb.region, });
const dynamodb = new AWS.DynamoDB();
const sqs = new AWS.SQS();
const eventbridge = new AWS.EventBridge();

const functionName = "lcrFunction";
const handler = "handler";

async function main() {
  const redisClient = RedisClientSingleton.getInstance();
  await redisClient.connect();
  // await createTable();
  // return 0;
  // await createSQS();
  // await createEventBridge();
  // await crearDisparador();

  const data = await redisClient.getListData('mi_lista');
  console.log("listas",data);
  await redisClient.disconnect();
  //verificar si la función existe
  for (const row of data) {
    let result_function = await invokeFunction(row);
    if(result_function!==false){
      let respuesta = JSON.parse(<string>result_function.Payload);
      console.log(respuesta)
      await sendEvent(row,<string>result_function.Payload);
    }
  }


}

async function invokeFunction(payload: string) {
  try {
    const params = {
      FunctionName: functionName,
      InvocationType: "RequestResponse", // tipo de invocación
      LogType: "Tail",
      Payload: JSON.stringify({data: payload}) // carga útil de la invocación
    };

    return await lambda.invoke(params).promise()
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function crearDisparador(){
  const params = {
    FunctionName: 'saveEventsDynamo',
    BatchSize: 10,
    EventSourceArn: 'arn:aws:sqs:us-east-2:042773476994:colaLCR',
  };

  lambda.createEventSourceMapping(params, (err, data) => {
    if (err) {
      console.log('Error creating event source mapping:', err);
    } else {
      console.log('Event source mapping created successfully:', data);
    }
  });
}

async function sendEvent(input:string,output:string){
  const params = {
    Entries: [
      {
        Source: 'lcrFunction',
        DetailType: 'newGame',
        Detail: JSON.stringify({
          // id: 'miId',
          timestamp: Date.now(),
          input,
          output,
        }),
      },
    ],
  };

  eventbridge.putEvents(params, (err, data) => {
    if (err) {
      console.log('Error putting events:', err);
    } else {
      console.log('Events put successfully:', data);
    }
  });
}
async function createEventBridge(){
  const params = {
    Name: 'ruleLCR',
    EventPattern: JSON.stringify({
      detailType: ['miTipoDeDetalle'],
    }),
    State: 'ENABLED',
  };

  // @ts-ignore
  eventbridge.putRule(params, (err, data) => {
    if (err) {
      console.log('Error creating rule:', err);
    } else {
      console.log('Rule created successfully:', data.RuleArn);
    }
  });
}
async function createSQS(){
  const params = {
    QueueName: 'colaLCR',
  };

  sqs.createQueue(params, (err, data) => {
    if (err) {
      console.log('Error creating queue:', err);
    } else {
      console.log('Queue created successfully:', data.QueueUrl);
    }
  });
}
async function createTable(){
  const params = {
    TableName: 'miTabla',
    KeySchema: [
      { AttributeName: 'input', KeyType: 'HASH' },
      { AttributeName: 'output', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'input', AttributeType: 'S' },
      { AttributeName: 'output', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  dynamodb.createTable(params, (err, data) => {
    if (err) {
      console.log('Error creating table:', err);
    } else {
      console.log('Table created successfully:', data);
    }
  });
}

main().catch(err => console.error(err));
