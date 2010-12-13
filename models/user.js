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

var hash = require('../functions.js').hash;

exports.model = {

    properties : ['id', 'pass', 'salt'],

    cast : {},

    indexes : ['id'],

    setters : {
    	id : hash,
    	pass : function(v){
    		this.salt = hash(new Date() + Math.random().toString());
    		return this.hashPassword(v);
    	}
    },

    getters : {},

    methods : {
    	hashPassword : function(pass){
    		return hash(this.id+'|'+pass+'|'+this.salt);
    	},
    	checkPassword : function(pass){
    		return this.hashPassword(pass) == this.pass;
    	}
    },

    static : {
    	get : function(db, id, cb){
    		db.User.find({id: hash(id)}).first(cb);
    	}
    }

}