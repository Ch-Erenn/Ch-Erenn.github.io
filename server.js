const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
/*const corsOptions = {
    origin: 'https://haerien.github.io',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};*/
//app.use(cors(corsOptions));

const PORT = 3000;

// MongoDB Connection
const mongoURI = 'mongodb+srv://admin:admin@cluster0.1e9ebol.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'api';
let db;

MongoClient.connect(mongoURI, {serverSelectionTimeoutMS: 5000})
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Endpoint to store QoS parameters
app.post('/api', (req, res) => {
  const qosData = req.body; // Data sent from the client
  // Store data in MongoDB
  db.collection('qosData').insertOne(qosData, (err, result) => {
    if (err) return res.status(500).send('Error storing QoS parameters');
    res.status(200).send('QoS parameters stored successfully');
  });
});

// Endpoint to retrieve QoS data
app.get('/api', (req, res) => {
  // Retrieve data from MongoDB
  db.collection('qosData').find({}).toArray((err, result) => {
    if (err) return res.status(500).send('Error retrieving QoS data');
    res.status(200).json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


