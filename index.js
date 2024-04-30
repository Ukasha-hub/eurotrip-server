const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express= require('express');
const cors= require('cors');
const app= express();
const port= process.env.PORT || 5000;
require('dotenv').config();

//middleware

app.use(cors());
app.use(express.json());

//tourismDB

//qwQlgz2ykmmcMo6j




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijq2qvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const touristSpotCollection= client.db('touristSpotDB').collection('touristSpot');

    const countriesCollection= client.db('touristSpotDB').collection('countries');

    app.get('/touristSpot', async(req,res)=>{
      const cursor= touristSpotCollection.find()
      const result= await cursor.toArray()
      res.send(result)
    })

    app.get('/touristSpot/:id', async(req, res)=>{
      const id= req.params.id
      
      const query= {_id: new ObjectId(id)}
      const result =await touristSpotCollection.findOne(query)
      res.send(result)

    })

    app.get('/countries', async(req,res)=>{
      const cursor= countriesCollection.find()
      const result= await cursor.toArray()
      res.send(result)
    })


    app.get('/countries/:id', async(req, res)=>{
      const id= req.params.id
      
      const query= {_id: new ObjectId(id)}
      const result =await countriesCollection.findOne(query)
      res.send(result)

    })
    
    app.post('/touristSpot', async(req,res)=>{
      const newSpot= req.body;
      console.log(newSpot)
      const result =await touristSpotCollection.insertOne(newSpot)
      res.send(result)
    })

    app.put('/touristSpot/:id', async(req, res)=>{
  
        const id= req.params.id
      
        console.log('Received ID:', id); 
      
      const filter= {_id: new ObjectId(id)}
      
      const options= {upsert:true}
      const updateSpot= req.body
      const Spot={
        $set:{
           photo: updateSpot.photo,
           spot: updateSpot.spot,
           country: updateSpot.country,
           location: updateSpot.location,
           description: updateSpot.description,
           cost: updateSpot.cost,
           seasonality: updateSpot.seasonality,
           time: updateSpot.time,
           visitor: updateSpot.visitor,
           email: updateSpot.email,
           name: updateSpot.name
           
           
        }
      }
      
      const result= await touristSpotCollection.updateOne(filter, Spot, options)
      
      res.send(result)
     
      

   

    })

    

    app.delete('/touristSpot/:id', async(req,res)=>{
      const id= String(req.params.id)
      

      const query= {_id: new ObjectId(id)}
      
      const result= await touristSpotCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('Start')
})

app.listen(port,()=>{
    console.log(`server running port: ${port}`)
})

//