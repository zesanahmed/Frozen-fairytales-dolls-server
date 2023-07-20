const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware 
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uj4yqjv.mongodb.net/?retryWrites=true&w=majority`;

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



        const dollsCollection = client.db('fairyDB').collection('dolls');
        const toysCollection = client.db('fairyDB').collection('toys');



        app.get('/toys', async (req, res) => {
            const result = await toysCollection.find().toArray();
            res.send(result);
        })

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const toy = await toysCollection.findOne(query);
            res.send(toy);
        });

        app.get('/addedToys', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { sellerEmail: req.query.email }
            }
            const result = await toysCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/toys', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await toysCollection.insertOne(user);
            res.send(result)
        })


        //  reading category data
        app.get('/dolls', async (req, res) => {
            console.log(req.query.category);
            let query = {};
            if (req.query?.category) {
                query = { category: req.query.category }
            }
            const result = await dollsCollection.find(query).toArray();
            res.send(result);
        });


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
    res.send('frozen fairy is flying');
})

app.listen(port, () => {
    console.log(`frozen fairy is running on the port: ${port}`);
})








