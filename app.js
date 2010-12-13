/*

Copyright 2010 Arran Schlosberg (http://arranschlosberg.com);

This file is part of NodeJS-Keychain (https://github.com/aschlosberg/NodeJS-Keychain).

    NodeJS-Keychain is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    NodeJS-Keychain is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with NodeJS-Keychain.  If not, see <http://www.gnu.org/licenses/>.

*/

var	express = require('express'),
		app = express.createServer(),
		mongoose = require('mongoose').Mongoose,
		db = mongoose.connect('mongodb://localhost/password')
		fn = require('./functions.js'),
		hash = fn.hash;

//Add Mongoose models and make them available through db.Model-name
var models = ['user', 'pass'];
var modelJs = [];

for(var m in models){
	modelJs[m] = require('./models/'+models[m]+'.js').model;
	var name = models[m].ucFirst();
	mongoose.model(name,  modelJs[m]);
	db[name] = db.model(name);
}

app.get('/', function(req, res){
	if(!defined(req.param('user')) || !defined(req.param('pass')) || !defined(req.param('domain'))){
		login(req, res);
	}
	else {
		getPass(req, res);
	}
});

function defined(val){
	return typeof val != 'undefined';
}

function login(req, res, msg){
	if(!msg){
		msg = 'Please provide parameters user, pass & domain';
	}
	res.send({action: 'login', msg: msg});
}

function getPass(req, res){
	var user = req.param('user');
	var pass = req.param('pass');
	var domain = req.param('domain');
	
	//Finds and returns the first record with the user_id provided - using the return value when nothing is found throws errors so that is used as a check for no user found
	db.User.get(db, user, function(u){
		try {
			if(!u.checkPassword(pass)) throw 0; //will also throw if u is null/undefined
			
			//Same idea as db.User.get
			db.Pass.get(db, user, domain, function(p){
				try {
					sendPass(req, res, p.getPass(pass));
				}
				catch(e){
					try {
						var p = new db.Pass();
						p.user = user;
						p.domain = domain;
						
						var domain_pass = hash(new Date() + Math.random().toString() + user + pass + domain);
						
						p.pass = [pass, domain_pass];
						
						p.save(function(){
							sendPass(req, res, domain_pass);
						});
					}
					catch(e){
						login(req, res, 'Error while creating new password: '+e);
					}
				}
			});
		}
		catch(e){
			login(req, res, 'Incorrect username / password');
		}
	});
}

function sendPass(req, res, pass){
	res.send({action: 'pass', pass: pass});
}

app.listen(80);
console.log('Express server started on port %s', app.address().port);