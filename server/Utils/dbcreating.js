const {MongoClient}= require('mongodb');
const asyncHandler=require('express-async-handler');

const createDatabase=asyncHandler(async(dbName)=>{
    const dbUri=`${process.env.DB_URI_P1}${dbName}${process.env.DB_URI_P2}`;
    const client=new MongoClient(dbUri);
    await client.connect();
    const database = client.db(dbName);
    await client.close();
    return database;
});

module.exports={createDatabase}