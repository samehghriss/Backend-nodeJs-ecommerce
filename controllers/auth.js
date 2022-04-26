const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler.js');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check

exports.signup = (req, res) => {
    console.log('req.body', req.body);
    // creates a new user
    const user = new User(req.body);
    // save created user to database
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'Email already exists'
            });
        }
        user.salt = undefined
        user.hashed_password = undefined
        res.json({
            user
        });
    });
}


exports.signin = (req, res) => {
    // find the user based on email
    // console.log('req.body contents => ',req.body.password);
    const { email, password } = req.body
    User.findOne({ email }, (err, user) => {
        // if user not found then give json response with error message
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup",
            });
        }

        // if user is found make sure the email and password match

        // create authentic method in user model

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password do not match",
            });
        }

        // if user is authenticated then generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        //once we have our token, we want to persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { maxAge: 600000 }); // user sign out after 600000 miliseconds(10 mins)

        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({ message: "Signout success"});
}

// this method looks for the token in the headers, that the signined user has, if it does not find the token, it does not allow the user to access other routes that can only be accessed by signined user. 
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ['HS256']
});




exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
  });


  exports.isAuth = (req, res, next) => {
      let user = req.profile && req.auth && req.profile._id == req.auth._id;
      if(!user){
          return res.status(403).json({
              error: "access denied"
          });
      }
      next();
  };
  exports.isAdmin = (req, res, next) => {
      if (req.profile.role ==0 ){
          return res.status(403).json({
              error: "Admin ressourse ! Access denied"
          });
      }
      next();

  };