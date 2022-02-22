const authRouter = require('./auth.route');
const siteRouter = require('./site.route');
const userRouter = require('./user.route');

module.exports = function routes(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api', siteRouter);
}