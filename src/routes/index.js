const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const siteRouter = require('./site.route');

module.exports = function routes(app) {
    app.use('/api/v2/user', userRouter);
    app.use('/api/v2/auth', authRouter);
    app.use('/api/v2', siteRouter);
}
