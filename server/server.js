const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const handlebars = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const methodOverride = require('method-override');

const routes = require('./routes');
const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@my-cluster.rrdfw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const db = require('./config/connectDb');
db.connectMongoDb(URL);

const createStoreRedis = require('./config/redisStorage');
const chatting = require('./controllers/MessageController');

// config views for handlebars
const hbs = handlebars.create({ extname: '.hbs' });
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client/public/')));

app.use(express.urlencoded({ limit: '10mb', extended: true, }));
app.use(express.json({ limit: '10mb', }));
app.use(methodOverride('_method'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: createStoreRedis(session),
}));

routes(app);
chatting(server);

server.listen(3000, () => console.log('Listening on port 3000'));


// const uuid = require('uuid');
// const bytes = uuid.parse('6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b');
// console.log(bytes);

// console.log(uuid.stringify(bytes));