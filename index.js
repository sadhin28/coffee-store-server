const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//middlewire
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Coffee meaking server is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@user-management-system.h2w7at6.mongodb.net/?retryWrites=true&w=majority&appName=user-management-system`;

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
        const coffeecollection = client.db('CoffeeDB').collection('coffee')

      
        //get  coffee by id  for update operation 
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeecollection.findOne(query)
            res.send(result)
        })

        // Update Coffee by id
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    category: updatedCoffee.category,
                    chef: updatedCoffee.chef,
                    details: updatedCoffee.details,
                    name: updatedCoffee.name,
                    photo: updatedCoffee.photo,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste
                }
            }
            const result = await coffeecollection.updateOne(filter, coffee, options);
            res.send(result);
        })
        //=============end update coffee===========
        
        //==============Get all coffee=============
          app.get('/coffee', async (req, res) => {
            const cursor = coffeecollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        //=============start post or add coffee============
        app.post('/coffee', async (req, res) => {
            const newcoffee = req.body;
            console.log(newcoffee)
            res.send(newcoffee);
            const result = await coffeecollection.insertOne(newcoffee);
            res.send(result)
        })

        // ==================Delete operation
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeecollection.deleteOne(query)
            res.send(result)
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




app.listen(port, () => {
    console.log('The coffee Maker Server run at port', port)
})
console.log(process.env.DB_PASS)