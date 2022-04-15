const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const siteRouter = require('./site.route');
const oauth2Router = require('./oauth2.route');
const roomRouter = require('./room.route');

module.exports = function routes(app) {
    app.use('/api/v2/user', userRouter);
    app.use('/api/v2/auth', authRouter);
    app.use('/api/v2/oauth2', oauth2Router);
    app.use('/api/v2/room', roomRouter);
    app.use('/api/v2', siteRouter);
}
