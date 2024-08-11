/*const mongoose = require('mongoose');

let connections = {};

const getConnection = (dbName) => {
    if (connections[dbName]) {
        return connections[dbName];
    }

   

    const connection = mongoose.createConnection(`${process.env.DB_URI_P1}${dbName}${process.env.DB_URI_P2}`);
    connections[dbName] = connection;
    return connection;
}

module.exports = { getConnection, connections };
*/
const mongoose = require('mongoose');
const redis = require('redis');

const redisClient = redis.createClient();
redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('ready', () => console.log('Redis is ready'));

const connections = {};

const getConnection = async (dbName) => {
  if (connections[dbName]) return connections[dbName];

  const existingConnectionURI = await redisClient.get(dbName);
  if (existingConnectionURI) {
    connections[dbName] = mongoose.createConnection(existingConnectionURI);
  } else {
    const connectionURI = `${process.env.DB_URI_P1}${dbName}${process.env.DB_URI_P2}`;
    connections[dbName] = mongoose.createConnection(connectionURI);
    await redisClient.set(dbName, connectionURI);
  }

  return connections[dbName];
};

const initializeConnections = async () => {
  const keys = await redisClient.keys('*');
  await Promise.all(keys.map(async (dbName) => {
    await getConnection(dbName);
  }));
};

module.exports = { getConnection, connections, initializeConnections, redisClient };

/*
const mongoose = require('mongoose');
const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis client error', err);
});

redisClient.connect();  // Use connect() to ensure the client is ready before using it

const connections = {};

const getConnection = async (dbName) => {
  if (connections[dbName]) {
    return connections[dbName];
  }

  const existingConnectionURI = await redisClient.get(dbName);
  if (existingConnectionURI) {
    connections[dbName] = mongoose.createConnection(existingConnectionURI);
    return connections[dbName];
  }

  const connectionURI = `${process.env.DB_URI_P1}${dbName}${process.env.DB_URI_P2}`;
  const connection = mongoose.createConnection(connectionURI);
  connections[dbName] = connection;
  await redisClient.set(dbName, connectionURI);

  return connection;
};

module.exports = { getConnection, connections };
*/