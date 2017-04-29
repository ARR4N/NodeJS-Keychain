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

var foundInputs = false;

var inputs = document.getElementsByTagName('input');
for(var i in inputs){
	try {
		if(inputs[i].type.toLowerCase()=='password'){
			if(!foundInputs){
				chrome.extension.sendRequest({action: 'show'}, res => {});
			}
			foundInputs = true;
		}
	}
	catch(e){}
}

function handle(req, sender, cb){
	if(typeof req.action != 'undefined' && req.action == 'store'){
		for(var i in inputs){
			try {
				if(inputs[i].type.toLowerCase()=='password'){
					inputs[i].value = req.pass;
				}
			}
			catch(e){}
		}
	}
}

chrome.extension.onRequest.addListener(handle);