const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var canvas; 
var ctx;
var height = 400;
var width = 400;
    var data = [
    [1, 2],
    [2, 1],
    [2, 4], 
    [1, 3],
    [2, 2],
    [3, 1],
    [1, 1],

    [7, 3],
    [8, 2],
    [6, 4],
    [7, 4],
    [8, 1],
    [9, 2],

    [10, 8],
    [9, 10],
    [7, 8],
    [7, 9],
    [8, 11],
    [9, 9],
];
var means = [];
var assignments = [];
var dataExtremes;
var dataRange;
var drawDelay = 2000;

exports.testCloudFunction = functions.https.onRequest((req, res) => {
    res.send("Quan test Firebase Cloud Function");
    dataExtremes = getDataExtremes(data);
  });

  