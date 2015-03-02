function dataStorage() {
	this.hasStorageSupport = function() {
		try {
			if (!'localStorage' in window || typeof window['localStorage'] == "undefined") {
				return false;
			} else {
				return true;
			}
		} catch (e) {
			return false;
		}
	}
	this.localStorage = this.hasStorageSupport();
	
    this.setItem = function(name,value,days) {
		if (this.localStorage) {
			localStorage.setItem(name, value);
			return;
		}
        if (days != -1) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        } else {
            var expires = "";
        }
        document.cookie = name+"="+value+expires+"; path=/";
    };
	
    this.getItem = function(name) {
		var returnValue = null;
		if (this.localStorage) {
			returnValue = localStorage.getItem(name);
		}
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) {
				returnValue = c.substring(nameEQ.length, c.length);
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
			return;
		}
        this.setItem(name,"",-1);
    }
	
	this.clear = function() {
		if (this.localStorage) {
			localStorage.clear();
			return;
		}
		var cookies = document.cookie.split(";");

		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf("=");
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			this.setItem(name,"",-1);
		}
	}
}