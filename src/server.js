const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const configViewEngine = require('./config/viewEngine');
const routes = require('./routes');
const sessionStore = require('./config/redisStorage')(session);
const methodOverride = require('method-override');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public/')));
app.use(methodOverride('_method'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: false,
    },
    store: sessionStore,
}));

configViewEngine(app);
routes(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
