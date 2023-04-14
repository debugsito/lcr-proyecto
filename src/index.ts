import RedisClientSingleton from './redisClient';
import AWS from "aws-sdk";
import config from "./config";

AWS.config.update({ region: config.dynamodb.region, });

const lambda = new AWS.Lambda();

const functionName = "lcrFunction";
const handler = "handler";

async function main() {
  const redisClient = RedisClientSingleton.getInstance();
  await redisClient.connect();

  const data = await redisClient.getListData('mi_lista');
  console.log("listas",data);
  await redisClient.disconnect();
  //verificar si la función existe
  for (const row of data) {
    let result_function = await invokeFunction(row);
    if(result_function!==false){
      let respuesta = JSON.parse(<string>result_function.Payload);
      console.log('respuesta:', respuesta);
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

main().catch(err => console.error(err));
