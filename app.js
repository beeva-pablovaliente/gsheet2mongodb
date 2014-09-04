//Requireds
var gs = require('edit-google-spreadsheet');
var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var http = require('http');
var swig = require('swig'), path = require('path');

var creds = require('./creds.json');
var norm = require('./normalizeChars.js');

//Vars
var port = 8081;

// Register our templating engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

//Public resources
app.use(express.static(path.join(__dirname + '/public')));

// To disable Swig's cache, do the following:
app.set('view cache', false);
swig.setDefaults({ cache: false });

//Start Express Server
var server = http.createServer(app);
server.listen(port, function(){
    console.log('Listening on port %d', server.address().port);
});

/*
gs.load({
	    debug: true,
	    spreadsheetId: creds.spreadSheetId, //ID de la hoja de calculo
	    worksheetName: creds.workSheetName, //Nombre la de hoja

	    accessToken : {
	      type: 'Bearer',
	      token: creds.token
	    }
	}, 
	function sheetReady(err, spreadsheet) {
	    //use speadsheet!
	    if (err) { throw err; }

	    //console.dir(spreadsheet.raw);

	    spreadsheet.receive(function(err, rows, info) {
	        if (err) { throw err; }

	        //console.dir(rows);
	        //console.dir(info);

            MongoClient.connect(creds.dbUrl, function(err, db) {

                if(err) throw err;

                //Calculate the number of rows returned: The first row will have the name of the columns
                var numRows = Object.keys(rows).length;
                var i = 1;

                //Calulate the number of columns from the first row
                var colLength = Object.keys(rows[1]).length;
                var c = 1;

                //Documents Array
                var docs = new Array();

                for (i = 2; i <= numRows; i++) {//Skip the first row
                    //For each Row, we build a document
                    var doc = {};
                    for (c = 1; c <= colLength; c++) {
                        var nameCol = rows[1][c]; //Extract the name from the first column always
                        var valueCol = rows[i][c];

                        doc[norm.normalize(nameCol)] = valueCol;
                    }
                    docs.push(doc);
                }

                //Insert into mongodb
                db.collection(creds.collectionName).insert(docs, function(err, inserted) {
                    if(err) throw err;

                    console.dir("Successfully inserted: " + JSON.stringify(inserted));

                    return db.close();
                });

            });
	    });
	});
*/