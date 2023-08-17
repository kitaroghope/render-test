const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload');
const mongo = require('./mongoDBApi');
const ejs = require('ejs');
const fs = require('fs');
// const bodyParser = require('body-parser')
const { error } = require('console');
const { stringify } = require('querystring');

const app = express();
app.use(cors())
var properties = {};
var bookings = {"2023":[['2023-08-01', '2023-09-01'],['2023-09-20', '2023-11-02']]};
var workers = [];
var Auth = {
  "addHouse":`/${generateRandomString(10)}`,
  "addWorker":`/${generateRandomString(10)}`,
  "manage": `/${generateRandomString(10)}`
}
var locations = [];
function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

async function getHouses(){
  locations = await mongo.listTables('houses');
  for(var loc in locations){
    console.log(locations[loc])
    var res = await mongo.readRows({},"houses",locations[loc]);
    if(res == null || res == [] || res == ""){
      console.log("with null: "+res)
      continue;
    }
    else{
      console.log("without null"+res);
      properties[locations[loc]]=res;
    }
  }
}
async function getBookings(){
  var res = await mongo.readRows({},"bookings","booked");
  if(res == null || res == [] || res ==""){
    console.log("No bokkings");
  }
  else{
    res.forEach(r => {
      if(bookings.hasOwnProperty(r.houseID)){
        bookings[r.houseID].push([r.sDate,r.eDate,r.status]);
      }
      else{
        bookings[r.houseID] = [r.sDate,r.eDate,r.status];
      }
    });
  }
}
async function getWorkers(){
  const res = await mongo.readRows({},"people","users");
  if(res == ""){
    return
  }
  workers = res;
}
function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

getHouses();
getWorkers();
// app.use(bodyParser.json())
// testing mongodb

// mongo.insertDocument('test',{"name":"kitamirike","age":6},getResults)
async function addData(data, dbName, tName){
  if(!data.hasOwnProperty('_id')){
    // console.log('Yello')
    var id = await mongo.autoInc(tName);
    if(typeof id === 'object'){
      console.log("you cant")
      return id;
    }
    data["_id"] = id;
  }
  // error comes as an object
  mongo.createListing(data,dbName,tName)
  return id;
}
// async function getData(query, dbName, tName){
//   var res = await mongo.readRows(query, dbName, tName)
//   return res;
// }
// addData({"name":"kita","age":6},"kita","kiki")
// mongo.createListings()
// http server
app.engine('ejs',ejs.renderFile)
app.set('view engine','ejs')

const http = require('http').createServer(app);
// const io = require('socket.io')(http);

// Set up static folder with all assets mostly images
app.use(express.static('./public'));


// Set up file upload middleware
app.use(fileUpload());

//Handling all socket routes
// io.on('connection', (socket) => {
//   console.log('a user connected');

//   socket.on('login', ({ username, password }) => {
//     console.log(`user ${username} logged in with password ${password}`);
//     socket.emit('loggedIn', username);
//   });

//   socket.on('logout', (username) => {
//     console.log(`user ${username} logged out`);
//     socket.emit('loggedOut', username);
//   });

//   socket.on('signup', ({ username, password }) => {
//     console.log(`user ${username} signed up with password ${password}`);
//     socket.emit('signedUp', username);
//   });

//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });
async function mergeD(d,d1){
  try {
    if(d1.obj){
      if(d1.keys == "arr"){
        if(eval(d1.obj).hasOwnProperty(d1.key)){
          eval(d1.obj)[d1.key].push(d)
        }
        else{
          eval(d1.obj)[d1.key] = [d]
        }
        console.log(eval(d1.obj)[d1.key])
      }
    }
    else if(d1.arr){
      eval(d1.arr).push(d)
    }
    return "success";
  } catch (err) {
    return err.message;
  }
}


// Home route
app.get('/', async (req, res) => {

  // if(typeof properties['Entebbe']==='undefined' || properties['Entebbe'] == []){
    // res.send
  // }
  // else{
    res.render('home',{houses:properties["Entebbe"]})
    console.log("locations "+properties)
  // }
});

// properties route
app.get('/properties', (req, res) => {
  res.render('properties',{properties:properties})
});

// advertise route
app.get('/advertise', (req, res) => {
  res.render('advertise')
});
// bookings
app.post('/bookings',async(req, res)=>{
  try {
    res.json({book:bookings});
  } catch (error) {
    res.status(500)
  }
})

var pass = "administrator";
// about us route
app.get('/aboutUs', (req, res) => {
  res.render('about',{workers:workers})
});
// add worker
app.post('/admin',(req, res)=>{
  const result = JSON.parse(req.body.data);
  if(result.pass === pass){
    if(typeof Auth[result.url] === 'undefined'){
      res.json({url:result.url})
    }
    else{
      res.json({url: Auth[result.url]})
    }
  }
  else{
    res.json({err:'Sorry your not authorised!'})
  }
});
app.post('/about/addworker',async (req,res)=>{// ``
  const result = JSON.parse(req.body.data);
  var dbName = result.dbName;
  var tName = result.tbName;
  const check = await addData(result, dbName, tName);

  if (typeof check === 'object') {
    res.status(500).send({ success: false, message: 'Error adding data' });
  } else {
    workers.push(result)
    res.status(200).send("success");
    // res.end("<script>window.location.href = '/properties';</script>");
  }
})

app.get('/contactUs', (req, res) => {
  res.render('contact')
});

// Upload route
app.post('/upload/:folderName', (req, res) => {
  if (!req.files || !req.params.folderName) {
    return res.status(400).send('No files were uploaded or folderName was not specified.');
  }

  const imageFile = req.files.image;
  const folderName = req.params.folderName;
  const savePath = `public/images/${folderName}`;
  const imagePath = `${savePath}/${imageFile.name}`;

  if (!fs.existsSync(savePath)) {
    try {
      fs.mkdirSync(savePath, { recursive: true });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('There was an error when uploading.');
    }
  }

  imageFile.mv(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('There was an error when uploading.');
    }

    res.send(`File ${imageFile.name} uploaded successfully.`);
  });
});

// app.get('/newHouse',(req, res)=>{
//   try {
//     res.render('addHouse',{locations : locations});
//   } catch (err) {
//     res.render('error',{err:err})
//   }
// });
// app.get('/addWorker',(req,res)=>{
//   try {
//     res.render('addWorker')
//   } catch (err) {
//     res.render('error',{err:err})
//   }
// })
// handle all routes
app.get('/:url',(req, res, next)=>{
  try {
    if(`/${req.params.url}` === Auth.addHouse){
      Auth.addHouse = `/${generateRandomString(10)}`
      res.render('addHouse',{locations : locations});
    }
    else if(`/${req.params.url}` === Auth.addWorker){
      Auth.addWorker = `/${generateRandomString(10)}`
      res.render('addWorker');
    }
    else if(`/${req.params.url}` === Auth.manage){
      Auth.manage = `/${generateRandomString(10)}`
      res.render('manage');
    }
    else{
      res.render('error',{err: "Your not Authorised to view this page"})
    }
    next();
  } catch (err) {
    res.render('error', {err:err.message})
    next();
  }
})

// load house
app.get('/properties/:loc/:house/:id',(req, res)=>{
  try {
    var local = req.params.loc;
    var hou = req.params.id;
    if(typeof properties[local] === 'undefined' || typeof properties[local][hou] === 'undefined') {
      res.render('error');
    } 
    else {
      res.render('house',{house:properties[local][hou]})
    }
  } catch (err) {
    res.render('error',{err:err.message})
    // res.status(500).json({err:err.message})
  }
})

// add data location
app.post('/addData1/:location', async (req,res)=>{
  try {
    const d = JSON.parse(req.body.data)
    const d1 = JSON.parse(req.body.data1)

    status1 = await mongo.createTable("houses",d.d);
    if(status1){
      // console.log(status1)
      res.json({status:status1});
    }
    else{
      await mergeD(d.d,d1);
      res.json({status :'Location was added successfully'})
    }
  } catch (err) {
    res.json({status:err.message})
  }
});


// add data to mongoDB
app.post('/addData/:dName', async (req, res) => {
  try {
    const result = JSON.parse(req.body.data);
    const result1 = JSON.parse(req.body.data1);
    
    const check = await addData(result, result1.dbName, result1.tbName);
    
    if (typeof check === 'object') {
      res.status(500).json({ success: false, err: 'Error adding data' });
    } else {
      await mergeD(result,result1);
      res.status(200).json({url:result1.url});
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({err:err.message});
  }
});
// delete 

// send data to db
app.get('/newHouse/:data',async (req,res)=>{
  var create = await addData(data, "Houses", data.location);
  if(typeof create === 'object'){
    return res.status(500).send('There was an error while adding the new House.');
  }
  else{
    res.status(200).send("<script>window.location.href = '/properties';</script>");
    // res.end("");
  }
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
