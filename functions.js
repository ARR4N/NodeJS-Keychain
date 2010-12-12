String.prototype.ucFirst = function () {
    return this.substr(0,1).toUpperCase()+this.substr(1);
};

String.prototype.chomp = function () {
    return this.substr(0).replace(/(\n|\r)+$/, '');
};

String.prototype.isUid = function () {
	try{
		return this.substr(0).match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/).length>0;
	}
	catch(e){
		return false;
	}
};

Math.between = function(val, min, max){
	return Math.min(max, Math.max(min, val));
}

Math.range = Math.between;

Math.atLeastInt = function(a, b){
	return Math.max(parseInt(a), parseInt(b)); //considered having val, min as parameters but this way order doesn't matter
}

var crypto = require('crypto');
exports.hash = function(v){
	var hash = crypto.createHash('sha512');
	hash.update(v);
	return hash.digest('base64');
}

exports.encodePass = function(user, pass, domainPass){
	return user.length+':'+pass.length+':'+user+pass+domainPass;
}

exports.decodePass = function(str){
	var parts = str.match(/^(\d+):(\d+):(.+)$/);
	
	var userLen = parseInt(parts[1]);
	var passLen = parseInt(parts[2]);
	
	var user = parts[3].substr(0, userLen);
	var pass = parts[3].substr(userLen, passLen);
	var domainPass = parts[3].substr(userLen+passLen);
	
	return [user, pass, domainPass];
}