const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

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
        const ordersCollection = database.collection("orders");
        const usersCollection = database.collection("users");

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
        // delete api for services
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });
        // post api for review
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        });
        // get api for review
        app.get("/reviews", async (req, res) => {
            const result = await reviewCollection.find({}).toArray();
            res.json(result);
        });
        //post api for orders
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });
        // get api for orders
        app.get("/orders", async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.json(result);
        });
        // get api for single order
        app.get("/userOrders", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await ordersCollection.find(query).toArray();
            res.json(result);
        });
        //delete api for orders
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })
        // put/update api for orders
        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "approved"
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });
        // post api for users
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
        // get api for users
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isadmin = false
            if (user?.status === 'admin') {
                isadmin = true
            }
            res.json({ admin: isadmin });
        });
        // put/upsert api for users
        app.put("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user?.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        // put/update api for users
        app.put("/adminUsers", async (req, res) => {
            const email = req.body.email;
            const filter = { email: email };
            const updateDoc = {
                $set: {
                    status: "admin"
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
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