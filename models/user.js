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