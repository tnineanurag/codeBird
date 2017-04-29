var registerUser = require('./models/users');
var jwt    = require('jsonwebtoken');



module.exports = {
  configure: function(app) {

     app.post('/register/', function(req, res) {
      registerUser.register(req, res);
    });
     app.post('/login/', function(req, res) {
      registerUser.login(req, res);
    });


    app.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.param('token') || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }

});


  }
};