const SiteController = {
    //[GET] /register
    register: (req, res) => {
        res.render('site/registerForm');
    },

    // [GET] /login
    login: (req, res) => {
        res.render('site/loginForm');
    },
};

module.exports = SiteController;
