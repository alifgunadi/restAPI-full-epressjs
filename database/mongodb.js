const util = require('util');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0';
const client = new MongoClient(url);

async function connectToMongo() {
  try {
    await client.connect();
    console.log(util.inspect(client, { showHidden: false, depth: null }));
  } catch (error) {
    console.error(error);
  }
};

const database = connectToMongo();
module.exports = database;
