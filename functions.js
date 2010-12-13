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

var crypto = require('crypto');

String.prototype.ucFirst = function () {
    return this.substr(0,1).toUpperCase()+this.substr(1);
};

String.prototype.chomp = function () {
    return this.substr(0).replace(/(\n|\r)+$/, '');
};

exports.hash = function(v){
	var hash = crypto.createHash('sha512');
	hash.update(v);
	return hash.digest('base64');
}