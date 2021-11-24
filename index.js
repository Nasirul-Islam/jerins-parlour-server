const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.la6rz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("jerinsparlour");
        const servicesCollection = database.collection("services");
        const reviewCollection = database.collection("reviews");

        // post api for services
        app.post("/services", async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        });
        // get api for services
        app.get("/services", async (req, res) => {
            const result = await servicesCollection.find({}).toArray();
            res.json(result);
        });
        // post api for review
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        });
        // get api for review
        app.get("/reviews", async (req, res) => {
            const result = await reviewCollection.find({}).toArray();
            res.json(result);
        });
        //
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



// open api
app.get('/', (req, res) => {
    res.send('Hello jerin parlore')
})
// runing port
app.listen(port, () => {
    console.log(`jerin parlore at port: ${port}`)
})