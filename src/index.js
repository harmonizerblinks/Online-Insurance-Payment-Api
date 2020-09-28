const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuring the database
const Config = require('./config/mongodb.config.js');

// initialize the app
const app = express();

global.appRoot = path.resolve(__dirname);

const PORT = process.env.PORT || 5000;

// Creating a Server
let server = http.createServer(app);

let io = socketIO(server);

// makes db connection global
mongoose.Promise = global.Promise;

// mongo configuration
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.set('useFindAndModify', false);

// Connecting to the database
mongoose.connect(Config.url)
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
app.use(bodyParser.json({ limit: '1000kb' }));

// Helmet
app.use(helmet());
// Rate Limiting
const limit = rateLimit({
    max: 100, // max requests
    windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout 
    message: 'Too many requests' // message to send
});
app.use('/routeName', limit); // Setting limiter on specific route
// Body Parser
app.use(express.json({ limit: '10000kb' })); // Body limit is 10

// Data Sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());
// Data Sanitization against XSS attacks
app.use(xss());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// console.log('working')

// require('./config/authguard.config.js')(passport);
require('./routes/auth.routes.js')(app);
require('./routes/users.routes.js')(app);
require('./routes/package.routes.js')(app);
require('./routes/insurance.routes.js')(app);
require('./routes/gallery.routes.js')(app);
require('./routes/app.routes.js')(app);

// Api Documentation Setup
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Troski Ticketing',
            description: 'Troski Ticketing Platform',
            contact: {
                name: 'Harmony Alabi',
            },
            servers: ["http://localhost:" + PORT]
        },
    },
    apis: ["./routes/gallery.routes.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Handler for 404 - Resource Not Found
app.use((req, res, next) => {
    res.status(404).send({ message: 'We think you are lost!' });
})

// Handler for Error 500
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({ message: 'Internal Server error!' });
    // res.sendFile(path.join(__dirname, '../public/500.html'))
});


io.on('connection', (socket) => {
    console.info('a new user has connected')
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });
    socket.on('booked', (msg) => {
        io.emit(msg._id, msg);
    });
    socket.on('disconnect', (socket) => {
        console.info('a user has disconnected');
    });
});


// Start Server using environment port
server.listen(PORT, () => {
    console.info('Server is running on ' + PORT)
});

// var server = app.listen(PORT, function() {

//     var host = server.address().address
//     var port = server.address().port

//     console.log("App listening at http://%s:%s", host, port)

// });

// var io = require('socket.io')(server);

// io.on('connection', function(socket) {
//     socket.on('message', function(msg) {
//         io.emit('message', msg);
//     });
// });-0