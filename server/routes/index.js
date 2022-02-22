const userRouter = require('./user.route');
const siteRouter = require('./site.route');

module.exports = function routes(app) {
    app.use('/user', userRouter);
    app.use('/', siteRouter);
}