const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_KEY}@cluster0.cm8vu8j.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toysCollection = client.db('ToysDB').collection('toys')

    app.post('/addToy', async(req, res) => {
        const body = req.body;
        const result = await toysCollection.insertOne(body);
        res.send(result)
        console.log(result);
    })

    app.get('/allToys', async(req, res) => {
        const result = await toysCollection.find().toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Car Doctor Server Running')
});

app.listen(port, () => {
    console.log(`Car Doctor Server Is Running On Port: ${port}`)
})


