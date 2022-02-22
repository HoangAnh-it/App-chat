const authRouter = require('./auth.route');
const siteRouter = require('./site.route');

module.exports = function routes(app) {
    app.use('/api/auth', authRouter);
    app.use('/api', siteRouter);
}