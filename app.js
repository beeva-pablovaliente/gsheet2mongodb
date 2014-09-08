//Requireds
var gs = require('edit-google-spreadsheet');
    MongoClient = require('mongodb').MongoClient,
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    http = require('http'),
    swig = require('swig'),
    path = require('path'),
    restify = require('restify');

var session = require('express-session');

var creds = require('./creds.json');
var norm = require('./normalizeChars.js');

//Vars
var port = 8081;

// Register our templating engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

//Set the directory for the views
app.set('views', __dirname + '/public/views');

// Populates req.session
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'keyboard cat'
}));

//Public resources
app.use(express.static(path.join(__dirname + '/public')));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies

// To disable Swig's cache, do the following:
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.route('/').get(function(req, res){
    req.session.views = req.session.views || 0;

    console.log(++req.session.views);

    res.render('index', {clientId : creds.clientId, redirectUri: creds.redirectUri});
});

app.route('/oauth2callback').get(function(req, res){
    //Request for token

    var resRoute = res;
    //Extract code parameter from the Query
    console.log('Code Obtained: ' + req.query.code);

    // Creates a String client
    var client = restify.createStringClient({
        url: 'https://accounts.google.com',
        headers : {
            accept : 'application/json'
        }
    });

    var postBody = {
        code : req.query.code,
        client_id : creds.clientId,
        client_secret : creds.clientSecret,
        redirect_uri : creds.redirectUri,
        grant_type : "authorization_code"
    };

    client.post('/o/oauth2/token', postBody, function(err, req, res, data) {

        var rend = {token : null};

        if (err) {
            console.error(err);
            rend = {error : {}};
            rend['error']['statusCode'] = err.statusCode;
            rend['error']['message'] = err.message;
        }else{
            console.log('%d -> %j', res.statusCode, res.headers);
            console.log('%s', data);

            if (res.statusCode == 200 && res.headers['content-type'].indexOf('application/json') >= 0){
                rend['token'] = JSON.parse(data).access_token;
            }
        }

        resRoute.render('index', rend);
    });
});

app.route('/mongodb').post(function(req, res){

    var resRoute = res;

    gs.load({
	    debug: true,
	    spreadsheetId: creds.spreadSheetId, //ID de la hoja de calculo
	    worksheetName: creds.workSheetName, //Nombre la de hoja

	    accessToken : {
	      type: 'Bearer',
	      token: req.body.token //creds.token
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
                var docs = [];

                var countCloseDb = numRows - 1;

                for (i = 2; i <= numRows; i++) {//Skip the first row
                    //For each Row, we build a document
                    var doc = {};
                    for (c = 1; c <= colLength; c++) {
                        var nameCol = rows[1][c]; //Extract the name from the first column always
                        var valueCol = rows[i][c];

                        doc[norm.normalize(nameCol)] = valueCol;
                    }
                    //docs.push(doc);

                    //Key to reference the document to update
                    var docToUpsert = {};
                    docToUpsert[creds.upsertKey] = doc[creds.upsertKey];

                    db.collection(creds.collectionName).findAndModify(docToUpsert ,[['_id','asc']], {"$set" : doc}, {"upsert":true}, function(err, doc){

                        if (!err){
                            docs.push(doc);
                            console.dir("Document: " + JSON.stringify(doc));
                        }

                        countCloseDb--;
                        if (countCloseDb == 0){
                            db.close();

                            resRoute.send(docs);
                        }
                    });
                }

                //Insert into mongodb
                /*db.collection(creds.collectionName).insert(docs, function(err, inserted) {
                    if(err) throw err;

                    console.dir("Successfully inserted: " + JSON.stringify(inserted));

                    return db.close();

                    resRoute.send(inserted);
                });*/

            });
	    });
	});
});

//Start Express Server
var server = http.createServer(app);
server.listen(port, function(){
    console.log('Listening on port %d', server.address().port);
});