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

var	fn = require('../functions.js'),
		hash = fn.hash,
		crypto = require('crypto');

exports.model = {

    properties : ['user', 'user_set', 'domain', 'domain_set', 'pass'],

    cast : {},

    indexes : ['user', 'domain'],

    setters : {
    	user : function(v){
    		this.user_set = v.length>0;
    		return hash(v);
    	},
    	domain : function(v){
    		if(this.user_set!==true){
    			throw "When working with an encrypted password set user before setting domain";
    		}
    		this.domain_set = v.length>0;
    		return hashDomain(this.user, v);
    	},
    	pass : function(v){ //[user_pass, domain_pass]
			this.checkCipherRequirements(v);
    		
    		var key = hash(v[0]+'|'+this.user+'|'+this.domain);
    		
			var e = crypto.createCipher('aes-256-cbc', key);
			var enc = e.update(v[1], 'utf8', 'hex');
			return enc+e.final('hex');
    	}
    },

    getters : {},

    methods : {
    	checkCipherRequirements : function(v){
			this.checkDecipherRequirements();
    		if(typeof v != 'object'){
    			throw "When working with an encrypted password pass an array of user_pass & domain_pass";
    		}
    		if(typeof v[0] != 'string'){
    			throw "When working with an encrypted password you must pass the user_pass as the first parameter";
    		}
    		if(typeof v[1] != 'string'){
    			throw "When working with an encrypted password you must pass the domain_pass as the second parameter";
    		}
    	},
    	checkDecipherRequirements : function(){
    		if(this.domain_set!==true){
    			throw "When working with an encrypted password set domain before setting or getting password";
    		}
    	},
    	getPass : function(user_pass){
			this.checkDecipherRequirements();
    		
    		var key = hash(user_pass+'|'+this.user+'|'+this.domain);
    		
			var d = crypto.createDecipher('aes-256-cbc', key);
			var dec = d.update(this.pass, 'hex', 'utf8');
			return dec+d.final('utf8');
    	}
    },

    static : {
    	hashDomain : hashDomain,
    	get : function(db, user, domain, cb){
    		var user = hash(user);
    		var domain = hashDomain(user, domain);
    		
    		db.Pass.find({user: user, domain: domain}).first(cb);
    	}
    }

}

function hashDomain(user, domain){
	return hash(user+'|'+domain);
}