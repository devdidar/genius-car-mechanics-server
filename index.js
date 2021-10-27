const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9very.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // GET API
        app.get('/services',async(req,res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // GET SINGLE API
        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const singleService = await servicesCollection.findOne(query)
            res.json(singleService)
        })

        // POST API
        app.post('/services',async(req,res)=>{

            const service = req.body;
            console.log('hitting the post',service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        // DELETE API
        app.delete('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const deleteService = await servicesCollection.deleteOne(query);
            console.log(deleteService)
            res.json(deleteService)
        })
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/',(req,res)=>{
  res.send('Genius car mechanics server running')
})

app.listen(port,()=>{
    console.log(`port listening on ${port}`);
})