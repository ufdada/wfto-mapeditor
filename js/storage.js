function dataStorage() {
	this.remainingSpace = 5000000;
	this.hasStorageSupport = function() {
		try {
			if (!('localStorage' in window) || typeof window['localStorage'] == "undefined") {
				return false;
			} else {
				return true;
			}
		} catch (e) {
			return false;
		}
	};
	this.localStorage = this.hasStorageSupport();
	if (this.localStorage) {
		for (var key in localStorage) {
			var item = localStorage.getItem(key);
			if (item) {
				this.remainingSpace -= key.length + item.length;
			}
		}
	}

    this.setItem = function(name,value,days) {
		if (this.localStorage) {
			this.remainingSpace -= name in localStorage ? 0 : name.length + value.toString().length;
			localStorage.setItem(name, value);
			return;
		}
		var expires = "";

        if (days != -1) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        document.cookie = name+"="+value+expires+"; path=/";
    };

    this.getItem = function(name) {
		var returnValue = null;
		if (this.localStorage) {
			returnValue = localStorage.getItem(name);
		}
		var nameEQ = name + "=";
		var cookies = document.cookie.split(';');
		for(var i=0;i < cookies.length;i++) {
			var cookie = cookies[i];
			while (cookie.charAt(0)==' ') {
				cookie = cookie.substring(1, cookie.length);
			}
			if (cookie.indexOf(nameEQ) === 0) {
				returnValue = cookie.substring(nameEQ.length, cookie.length);
			}
		}

		switch(returnValue) {
			case "null":
			case "undefined":
			case "false":
			case "true":
				returnValue = JSON.parse(returnValue);
				break;
		}
		return returnValue;
    };

    this.removeItem = function(name) {
		if (this.localStorage) {
			this.remainingSpace += name in localStorage ? name.length + this.getItem(name).length : 0;
			localStorage.removeItem(name);
			return;
		}
        this.setItem(name,"",-1);
    };

	this.clear = function() {
		if (this.localStorage) {
			localStorage.clear();
			this.remainingSpace = 5000000;
			return;
		}
		var cookies = document.cookie.split(";");

		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf("=");
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			this.setItem(name,"",-1);
		}
	};
}