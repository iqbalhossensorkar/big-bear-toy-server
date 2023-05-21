const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const toysCategoryCollection = client.db('ToysDB').collection('categoryWise')

        app.get('/categoryWise/:text', async (req, res) => {
            if (req.params.text == "teddy bear" || req.params.text == "shock monkey" || req.params.text == "zhuzhu pet") {

                const result = await toysCategoryCollection.find({ status: req.params.text }).toArray();
                return res.send(result);
            }

            const result = await toysCategoryCollection.find().toArray();
            res.send(result);
        })
        app.get('/toyDetail', async (req, res) => {
            const result = await toysCategoryCollection.find().toArray();
            res.send(result);
        })

        app.get('/toyDetail/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            // console.log(query);
            const result = await toysCategoryCollection.findOne(query)
            res.send(result);
        })

        app.post('/addToy', async (req, res) => {
            const body = req.body;
            const result = await toysCollection.insertOne(body);
            res.send(result)
            // console.log(result);
        })

        app.get('/allToys', async (req, res) => {
            const result = await toysCollection.find().sort({ price: 1 }).limit(20).toArray();
            res.send(result);
        })

        app.get('/myToys/:email', async (req, res) => {
            // console.log(req.params.email);
            const result = await toysCollection.find({ sellerEmail: req.params.email }).sort({ price: 1 }).toArray();
            // console.log(result);
            res.send(result)
        })

        app.patch('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateToys = req.body;
            const updateDoc = {
                $set: {
                    status: updateToys.status
                }
            }
            const result = await toysCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.put('/updateToy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateToys = req.body;
            const options = {upsert: true}
            const updateDoc = {
                $set: {
                    toyName: updateToys.toyName,
                    photoURL: updateToys.photoURL,
                    sellerName: updateToys.sellerName,
                    sellerEmail: updateToys.sellerEmail,
                    price: updateToys.price,
                    quantity: updateToys.quantity,
                    subCategory: updateToys.subCategory,
                    rating: updateToys.rating,
                    message: updateToys.message
                }
            }
            const result = await toysCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query)
            console.log(result);
            res.send(result);
        })

        app.get('/toySearchByTitle/:text', async (req, res) => {
            const result = await toysCollection.find({
                $or: [
                    { toyName: req.params.text }
                ]
            }).toArray();
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
    res.send('Big Bear Server Running')
});

app.listen(port, () => {
    console.log(`Big Bear Server Is Running On Port: ${port}`)
})


