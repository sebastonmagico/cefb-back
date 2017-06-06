var express = require('express');
var router = express.Router();
var utils = require('./../../utils');
var fbConnector = require('./../../firebaseConnector');
var gCloudConnector = require('gcloud');

/**
 * SAVE DATA
 */
router.post('/api/v1/books/save_data/', function(req, res){
    var random = utils.randomNumber();
    var dataToSend = {
        name: req.body.name + random,
        author: req.body.author + random,
        editor: req.body.editor + random,
        pub_date: req.body.pub_date + random,
        pages: req.body.pages + random,
        isbn: req.body.isbn + random,
        info: req.body.info + random,
        cdu: req.body.cdu + random,
        publication: req.body.publication + random,
        photo: req.body.photo + random
    };
    var valid = utils.validateUserData(dataToSend);
    if(valid){
        return fbConnector.firebaseAuth.signInWithCustomToken(req.headers.usertoken).then(function(){
            var db = fbConnector.firebaseSDKServerDB.ref('books');

            db.push(dataToSend, function(error){
                if(error){
                    return res.status(401).send(error);
                }
                return res.status(200).send('');
            });

        }, function(error){
            return res.status(401).send(error);
        });
    }
    else{
        return res.status(400).send(valid);
    }
});

/**
 * GET DATA
 */
router.get('/api/v1/books/get/', function(req, res){
    return fbConnector.firebaseAuth.signInWithCustomToken(req.headers.usertoken).then(function(data){

        var db = fbConnector.firebaseSDKServerDB.ref('books');
        var finalData = {};
        var sort = 'name';

        db.orderByChild(sort).on("child_added", function(snapshot) {
            finalData[snapshot.key] = snapshot.val();
        });

        db.on("value", function(snapshot) {
            return res.send(finalData);
        }, function (error) {
            return res.status(405).send(error);
        });

    }, function(error){
        return res.status(401).send(error);
    });
});

/**
 * FIND BY PARAMS
 */
router.post('/api/v1/books/find_by/', function(req, res){

    var db = fbConnector.firebaseSDKServerDB.ref('books');
    var finalData = {};
    var sort = 'name';
    var params = req.body.filters;

    db.orderByChild(sort).on("child_added", function(snapshot) {
        for (var key in params){
            if (utils.filter(snapshot.val(), {name: key, value: params[key]}) && !finalData[snapshot.key]){
                finalData[snapshot.key] = snapshot.val();
            }
        }
    });

    db.on("value", function(snapshot) {
        return res.send(finalData);
    }, function (error) {
        return res.status(405).send(error);
    });

});

/**
 * UPDATE DATA
 */
router.put('/api/v1/books/update/', function(req, res){
    var dataToSend = {
        name: req.body.name,
        author: req.body.author,
        editor: req.body.editor,
        pub_date: req.body.pub_date,
        pages: req.body.pages,
        isbn: req.body.isbn,
        info: req.body.info,
        cdu: req.body.cdu,
        publication: req.body.publication,
        photo: req.body.photo
    };
    var valid = utils.validateUserData(dataToSend);
    if(valid){
        return fbConnector.firebaseAuth.signInWithCustomToken(req.headers.usertoken).then(function(){
            var db = fbConnector.firebaseSDKServerDB.ref('books');
            db.child(req.body.book_id).update(dataToSend, function(error){
                if(error){
                    return res.status(405).send(error);
                }
                return res.status(200).send('');
            });

        }, function(error){
            return res.status(401).send(error);
        });
    }
    else{
        return res.status(400).send('invalid data');
    }
});

/**
 * DELETE DATA
 */
router.delete('/api/v1/books/delete/:book_id', function(req, res){
    var db = fbConnector.firebaseSDKServerDB.ref('books');
    var bookID = req.params.book_id;

    return fbConnector.firebaseAuth.signInWithCustomToken(req.headers.usertoken).then(function(){
        return db.child(bookID).remove(function(error){
            if(error){
                return res.status(405).send(error);
            }
            return res.send('');
        });
    }, function(error){
        return res.status(401).send(error);
    });

});

//@TODO: FINISH THIS METHOD
router.post('/api/v1/books/upload_image/', function(req, res){
    return fbConnector.firebaseAuth.signInWithCustomToken(req.headers.usertoken).then(function(){

    }, function(error){
        return res.status(401).send(error);
    });
});

module.exports = router;