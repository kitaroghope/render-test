const express = require('express');


const app = express();

app.get('/', (res, req)=>{
    req.send('am alive and kicking')
})

app.listen(3000, ()=>{
    console.log('server is up');
})