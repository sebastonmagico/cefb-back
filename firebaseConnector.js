'use strict';

var firebase = require('firebase');
var admin = require('firebase-admin');
var utils = require('./utils');
var serviceAccount = require("./YOUR_FIREBASE_CREDENTIALS.json");

var projectID = 'cefb-library-bbdd';
var bucketName = projectID + '.appspot.com';

var gcloud = require('gcloud')({
    projectId: projectID,
    keyFilename: serviceAccount
});
var gcs = gcloud.storage();
var bucket = gcs.bucket(bucketName);



var clientConfig = {
    apiKey: "YOUR_FIREBASE_APIKEY",
    authDomain: "YOUR_FIREBASE_AUTHDOMAIN",
    databaseURL: "YOUR_FIREBASE_DATABASEURL",
    storageBucket: "YOUR_FIREBASE_STORAGEBUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGINGSENDERID"
};

var firebaseConnector = firebase.initializeApp(clientConfig);
var firebaseSDKServer = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: ""
});

var firebaseAuth = firebase.auth();
var firebaseDB = firebase.database();
var firebaseSDKServerAuth = firebaseSDKServer.auth();
var firebaseSDKServerDB = firebaseSDKServer.database();

module.exports = (function() {
    var fb = {
        firebaseAuth: firebase.auth(),
        firebaseDB: firebase.database(),
        firebaseSDKServerAuth: firebaseSDKServer.auth(),
        firebaseSDKServerDB: firebaseSDKServer.database()
    };
    return fb;
})();