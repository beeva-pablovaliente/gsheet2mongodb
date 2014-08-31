var gs = require('edit-google-spreadsheet');
var creds = require('./creds.json');
var norm = require('./normalizeChars.js')

var fieldNames = ['timestamp', 'username', 'location', 'attendance', 'lastName', 'firstName', 'dob', 'knowledgeLevel', 'knowledgeTecs', 'workExperience', 'emailBeeva', 'emailBbva', 'doi'];

console.log(norm.normalize('holaáéíóú éí_'));

gs.load({
	    debug: true,
	    spreadsheetId: creds.spreadSheetId, //Nombre de la hoja de calculo
	    //worksheetId: 'o67dbkn', //Nombre de la 
	    worksheetName: creds.workSheetName,
	    // Choose from 1 of the 3 authentication methods:
	    //    1. Username and Password
	    //username: 'my-name@google.email.com',
	    //password: 'my-5uper-t0p-secret-password',
	    // OR 2. OAuth
	    //oauth : {
	    //  email: 'my-name@google.email.com',
	    //  keyFile: 'my-private-key.pem'
	    //},
	    // OR 3. Token
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

	        console.dir(rows);
	        console.dir(info);
	    });
	});