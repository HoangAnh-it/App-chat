const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const io = require('socket.io');
require('dotenv').config();
require('./config/passport')(passport);

const app = express();
const server = http.createServer(app);
const configViewEngine = require('./config/viewEngine');
const routes = require('./routes');
const sessionStore = require('./config/redisStorage')(session);
const chanel = require('./routes/channel');

// ---------------------- >>> ERROR: PayloadTooLargeError: request entity too large -------------------

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
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
app.use(passport.initialize());
app.use(passport.session());
// app.use(helmet({
//     contentSecurityPolicy: false,
// }));
app.use(cors());

configViewEngine(app);
routes(app);
chanel(io(server));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`>> Listening on port ${PORT}`));
