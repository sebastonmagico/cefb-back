var express = require('express');
var router = express.Router();
var fbConnector = require('./../../firebaseConnector');

// User/create
router.post('/api/v1/user/create', function(req, res){
    return fbConnector.firebaseAuth.createUserWithEmailAndPassword(req.body.user, req.body.pass).then(function(user){
            user.sendEmailVerification().then(function(data){
                return res.send(user);
            }, function(error){
                return res.status(400).send(error);
            });
        },
        function(error){
            return res.status(400).send(error);
        });
});


// User/Login
router.post('/api/v1/user/login', function(req, res){

    return fbConnector.firebaseAuth.signInWithEmailAndPassword(req.body.user, req.body.pass).then(function(user){
        var data = {
            userID: user.uid,
            userData: user.providerData,
            emailVerified: user.emailVerified
        };
        return fbConnector.firebaseSDKServerAuth.createCustomToken(user.uid).then(function(value){
            data.token = value;
            return res.send(data);
        });

    }, function(error){
        return res.status(401).send(error);
    })
});


/**
 * User/verify_email
 */
router.post('/api/v1/user/verify_email/', function(req, res){

    return fbConnector.firebaseAuth.signInWithCustomToken(req.token).then(function(user){
        return user.sendEmailVerification().then(function(data){
            return res.send(data);
        }, function(error){
            return res.status(401).send(error)
        })
    }, function(error){
        return res.status(401).send(error);
    })

});

/**
 * User/reset_password
 */
router.get('/api/v1/user/reset_password/:email', function(req, res){
    var email = req.params.email;
    return fbConnector.firebaseAuth.sendPasswordResetEmail(email).then(function(data){
        return res.send(data);
    }, function(error){
        return res.status(400).send(error);
    })
});


module.exports = router;