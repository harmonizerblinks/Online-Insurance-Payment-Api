let express = require('express')
let app = express()
let path = require('path')
let bodyParser = require('body-parser')

const dbConfig = require('./config/mongodb.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
    .then(() => {
        console.log("Successfully connected to MongoDB.");
    }).catch(err => {
        console.log('Could not connect to MongoDB.');
        process.exit();
    });
// mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("Successfully connected to MongoDB.");
//     }).catch(err => {
//         console.log('Could not connect to MongoDB.');
//         process.exit();
//     }).pass;


require('./routes/customers.routes.js')(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
// app.use(fileUpload()); // configure fileupload

app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
    next()
})

// app.use(express.static('public'))

// Handler for 404 - Resource Not Found
app.use((req, res, next) => {
    res.status(404).send('We think you are lost!')
})

// Handler for Error 500
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({ message: 'Internal Server error!' });
    // res.sendFile(path.join(__dirname, '../public/500.html'))
})

const PORT = process.env.PORT || 3000
    // app.listen(PORT, () => console.info(`Server has started on ${PORT}`))
    // Create a Server
var server = app.listen(PORT, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)
})