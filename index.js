const express = require('express')
const cors = require('cors');
const app = express()
const port =process.env.PORT || 5000;

//middlewire
app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Coffee meaking server is running')
})

app.listen(port,()=>{
    console.log('The coffee Maker Server run at port',port)
})