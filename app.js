const express = require('express');
const fileUpload = require('express-fileupload');
const mongo = require('./mongoDBApi');
const ejs = require('ejs');
const app = express();

// testing mongodb
// mongo.insertDocument('test',{"name":"kitamirike","age":6},getResults)
// mongo.createListing({"_id":7,"name":"kita","age":6},"my_db","names yo")
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

// Home route
app.get('/', (req, res) => {
  res.render('home')
});

// properties route
app.get('/properties', (req, res) => {
  res.render('properties')
});

// advertise route
app.get('/advertise', (req, res) => {
  res.render('advertise')
});

// about us route
app.get('/aboutUs', (req, res) => {
  res.render('about')
});

app.get('/contactUs', (req, res) => {
  res.render('contact')
});

// Upload route
app.post('/upload', (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  const imageFile = req.files.image;
  const savePath = `public/images/${imageFile.name}`;

  imageFile.mv(savePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(`File ${imageFile.name} uploaded successfully.`);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
