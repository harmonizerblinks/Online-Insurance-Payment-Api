const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// initialize the app
const app = express();

global.appRoot = path.resolve(__dirname);

const PORT = process.env.PORT || 5000;

// Configuring the database
const Config = require('./config/mongodb.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mongo configuration
mongoose.set('useCreateIndex', true)

// Connecting to the database
mongoose.connect(Config.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully connected to MongoDB.");
    }).catch(err => {
        console.log('Could not connect to MongoDB.');
        process.exit();
    });

// defining the Middleware
app.use(cors());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
// Set the static folder
app.use('/public', express.static(path.join(__dirname, '../public')))
    // Bodyparser Middleware
app.use(bodyParser.json());
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// console.log('working')

// require('./config/authguard.config.js')(passport);
require('./routes/auth.routes.js')(app);
require('./routes/users.routes.js')(app);
require('./routes/country.routes.js')(app);
require('./routes/region.routes.js')(app);
require('./routes/location.routes.js')(app);
require('./routes/brand.routes.js')(app);
require('./routes/bus.routes.js')(app);
require('./routes/busfee.routes.js')(app);
require('./routes/driver.routes.js')(app);
require('./routes/rent.routes.js')(app);
require('./routes/schedule.routes.js')(app);
require('./routes/station.routes.js')(app);
require('./routes/tour.routes.js')(app);
require('./routes/booking.routes.js')(app);
require('./routes/saving.routes.js')(app);

// Api Documentation Setup
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'E-Commerce Api',
            description: 'Complete E-Commerce and Inventory Api',
            contact: {
                name: 'Harmony Alabi',
            },
            servers: ["http://localhost:" + PORT]
        },
    },
    apis: ["./routes/*.routes.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.post('/upload', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "video") is used to retrieve the uploaded file
    let file = req.files.video;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('/public/' + file.name, function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

// Handler for 404 - Resource Not Found
app.use((req, res, next) => {
    res.status(404).send({ message: 'We think you are lost!' });
})

// Handler for Error 500
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({ message: 'Internal Server error!' });
    // res.sendFile(path.join(__dirname, '../public/500.html'))
})

// Create a Server
var server = app.listen(PORT, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)

});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
    socket.on('message', function(msg) {
        io.emit('message', msg);
    });
});