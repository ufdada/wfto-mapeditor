function dataStorage() {
	this.maxSpace = 5000000;
	this.remainingSpace = 0;
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

	this.calculateSpace = function() {
		if (this.localStorage) {
			this.remainingSpace = this.maxSpace;
			for (var key in localStorage) {
				var item = localStorage.getItem(key);
				if (item) {
					this.remainingSpace -= key.length + item.length;
				}
			}
		}
	};

    this.setItem = function(name,value,days) {
		if (this.localStorage) {
			localStorage.setItem(name, value);
			this.calculateSpace();
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
			localStorage.removeItem(name);
			this.calculateSpace();
			return;
		}
        this.setItem(name,"",-1);
    };

	this.clear = function() {
		if (this.localStorage) {
			localStorage.clear();
			this.calculateSpace();
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

	this.localStorage = this.hasStorageSupport();
	this.calculateSpace();
}