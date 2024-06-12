
((self) => {
    // <editor-fold defaultstate="collapsed" desc="Default Functions. Click on the + sign on the left to edit the code."> 
    self.isNullable = function ($this) {
        return $this === null || $this === undefined;
    };

    self.isDate = function ($this) {
        if (!$this)
            return false;

        if (isNumber($this)) {
            if (String($this).length !== 13) {
                return false;
            }
            $this = new Date($this);
        }
        if (isString($this)) {
            $this = Dates.parse($this);
        }

        if (!$this)
            return false;
        if (isObject($this) && 'seconds' in $this && 'nanoseconds' in $this) {
            $this = Dates.parse($this);
        }
        return $this instanceof Date;
    };

    self.isString = function ($this) {
        return $this instanceof String || typeof $this === 'string';
    };

    self.isNumber = function ($this) {
        return $this instanceof Number || typeof $this === 'number';
    };

    self.isBoolean = function ($this) {
        return $this instanceof Boolean || typeof $this === 'boolean';
    };

    self.isObject = function ($this) {
        return $this instanceof Object || typeof $this === 'object';
    };

    self.isFunction = function ($this) {
        return $this instanceof Function || typeof $this === 'function';
    };

    self.isArray = function ($this) {
        return Array.isArray($this);
    };

    self.isBinary = function ($this) {
        return /^\[object\s(?:Blob|ArrayBuffer|.+Array)\]$/.test(Object.prototype.toString.call($this));
    };

    self.isArrayBuffer = function ($this) {
        return /^\[object\s(?:ArrayBuffer|.+Array)\]$/.test(Object.prototype.toString.call($this));
    };

    self.isBlob = function ($this) {
        return /^\[object\s(?:Blob|.+Array)\]$/.test(Object.prototype.toString.call($this));
    };

    self.isDataURI = function ($this) {
        const dataUriRegex = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
        return dataUriRegex.test(Object.prototype.toString.call($this));
    };

    self.forEach = function (self, param, callback, doneCallback) {
        if (param && isFunction(param)) {
            doneCallback = callback;
            callback = param;
            param = null;
        }
        let lastInx, len = 0;
        for (let n in self) {
            let val = self[n];

            if (val !== undefined && val !== null && ((param && param.includeFunction && isFunction(val)) || !isFunction(val))) {
                lastInx = n;
                len++;
                let value = callback.call(val, n, val);
                if (value !== undefined && value !== null && isBoolean(value) && !value) {
                    break;
                }
            }
        }
        if (doneCallback) {
            doneCallback(lastInx, len);
        }
        return self;
    };

    self.jsonObjectString = function (self, param) {
        function getName(name) {
            if (name.contains('.') || name.contains(':') || name.contains('-')) {
                return '"' + name + '":';
            } else {
                return name + ':';
            }
        }
        let source = '{';
        if (self.nodeName) {
            if (self.nodeName() === 'form') {
                self.find('textarea, select, input:not(button)').each(function (n) {
                    let $this = $(this);
                    if (($this.attr('name') !== undefined && $.trim($this.attr('name')).length > 0) ||
                            ($this.attr('id') !== undefined && $.trim($this.attr('id')).length > 0)) {
                        if ($this.attr('type') === 'radio') {
                            if ($this.data('checked') === true) {
                                source += getName($this.attr('name') || $this.attr('id'));
                                source += '"' + $this.val() + '",';
                            }
                        } else if ($this.attr('type') === 'checkbox') {
                            try {
                                source += getName($this.attr('name') || $this.attr('id'));
                                source += '"' + $this.prop('checked') + '",';
                            } catch (e) {
                                if ($this.data('checked')) {
                                    source += getName($this.attr('name') || $this.attr('id'));
                                    source += '"' + $this.data('checked') + '",';
                                } else {
                                    source += getName($this.attr('name') || $this.attr('id'));
                                    source += '"' + false + '",';
                                }
                            }
                        } else {
                            if (($this.val() !== undefined || $this.val() !== null) && $.trim($this.val()).length > 0) {
                                let val = $this.val();
                                if (val.contains('\\')) {
                                    val = val.replace('\\', '/');
                                }
                                source += getName($this.attr('name') || $this.attr('id'));
                                if ($this.attr('object-type') === undefined) {
                                    source += '"' + val + '",';
                                } else {
                                    if ($this.attr('object-type') === 'entity') {
                                        if ($this.attr('has-data') === 'true') {
                                            source += $this.find('option:selected').data('record') + ',';
                                        }
                                    } else {
                                        source += val + ',';
                                    }
                                }
                            }
                        }
                    }
                });
            }
        } else {
            forEach(self, param, function (self, n, array) {
                source += getName(n);
                if (isString(self)) {
                    source += '"' + self + '",';
                } else if (isNumber(self) || isBoolean(self)) {
                    source += self + ',';
                } else if (isFunction(self) && param && param.includeFunction) {
                    source += self.toString() + ',';
                } else if (isArray(self)) {
                    source += self.jsonArrayString(param) + ',';
                } else if (isObject(self)) {
                    source += jsonObjectString(self, param) + ',';
                }
            });
        }

        if (self !== null && source !== "{") {
            source = source.substring(0, source.length - 1);
        }
        source += '}';
        return source;
    };

    self.toNoneNullObject = function (obj) {
        const o = {};
        Object.keys(obj).filter(k => !!obj[k]).forEach(k => {
            o[k] = obj[k];
        });
        return !Object.keys(o).isEmpty() ? o : null;
    };
    self.isGetter = function (obj, prop) {
        const res = Object.getOwnPropertyDescriptor(obj, prop);
        return res && !!res['get'];
    };
    self.isSetter = function (obj, prop) {
        const res = Object.getOwnPropertyDescriptor(obj, prop);
        return res && !!res['set'];
    };
//</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="Object Functions. Click on the + sign on the left to edit the code.">
    Object.values = Object.values || function (o) {
        return Object.keys(o).map(function (k) {
            return o[k];
        });
    };

    const stringToPath = function (path) {
        // If the path isn't a string, return it
        if (isArray(path))
            return [...path];

        // Create new array
        const output = [];

        // Split to an array with dot notation
        path.split('.').forEach(function (item) {
            // Split to an array with bracket notation
            item.split(/\[([^}]+)\]/g).forEach(function (key) {
                // Push to the new array
                if (key.length > 0) {
                    output.push(key);
                }
            });
        });

        return output;
    };

    Object.setValueByPath = function (obj, __path, value) {
        // Get the path as an array
        let path = stringToPath(__path);
        let current = obj;
        while (path.length - 1) {
            let n = path.shift();
            if (!(n in current)) {
                current[n] = {};
            }
            current = current[n];
        }
        current[path[0]] = value;
    };

    Object.getPathByValue = function (obj, value) {
        const path = [];
        let found = false;

        function search(haystack) {
            for (let key in haystack) {
                path.push(key);
                if (JSON.stringify(haystack[key]) === JSON.stringify(value)) {
                    found = true;
                    break;
                }
                if ((!isFile(obj[key]) && !isBlob(obj[key]) && !isDate(obj[key])) && isObject(haystack[key])) {
                    search(haystack[key]);
                    if (found)
                        break;
                }
                path.pop();
            }
        }

        search(obj);
        return path;
        /*
         Or alternately if you want to keep mixed return
         return found ? path : false;
         */
    };

    Object.getPathsByKey = function (obj, pathKey) {
        const pathsImpl = function (obj, root = [], result = {}) {
            const ok = Object.keys(obj);
            return ok.reduce((res, key) => {
                const path = root.concat(key);
                if (isFile(obj[key]) || isBlob(obj[key]) || isDate(obj[key])) {
                    res[obj[key]] = [path];
                } else if (isObject(obj[key]) && obj[key] !== null) {
                    pathsImpl(obj[key], path, res);
                } else if (res[obj[key]] === 0 || res[obj[key]]) {
                    res[obj[key]].push(path);
                } else {
                    res[obj[key]] = [path];
                }
//                typeof obj[key] === "object" && obj[key] !== null
//                        ? pathsImpl(obj[key], path, res)
//                        : res[obj[key]] === 0 || res[obj[key]]
//                        ? res[obj[key]].push(path)
//                        : (res[obj[key]] = [path]);
                return res;
            }, result);
        };
        const res = pathsImpl(obj);
        if (res !== null) {
            let paths = Object.values(res)
                .reduce((a1, a2) => [...a1, ...a2], [])
                .filter((v) => v.contains(pathKey));

            const paths_res = [];
            paths.forEach((path_array) => {
                let last;
                let path_array_copy = [...path_array];
                while ((last = path_array_copy.pop()) !== pathKey) {
                    if (path_array_copy.isEmpty()) {
                        break;
                    }
                }
                if (last === pathKey) {
                    path_array_copy = [...path_array_copy, pathKey];
                } else {
                    path_array_copy = path_array_copy.isEmpty() ? [] : [...path_array_copy, pathKey];
                }
                paths_res.push(path_array_copy);
            });

            const paths_res_copy = [];
            paths_res.forEach((v) => {
                if (!paths_res_copy.map((n) => JSON.stringify(n)).contains(JSON.stringify(v))) {
                    paths_res_copy.push(v);
                }
            });
            return paths_res_copy;
        } else {
            return [];
        }
    };

    Object.getValueByPath = function (obj, __path, def) {
        if(isNullable(obj)) return null;
        // Get the path as an array
        let path = stringToPath(__path);
        let current = obj;
        while (path.length - 1) {
            let n = path.shift();

            if (!(n in current)) {
                return def;
            }
            current = current[n];
        }

        const key = path[0];
        if (key in current) {
            return current[key];
        }
        return def;

//    // For each item in the path, dig into the object
//    for (let i = 0; i < path.length; i++) {
//        let n = path[i];
//        // If the item isn't found, return the default (or null)
//        if (!(n in current)) {
//            return def;
//        }
//        // Otherwise, update the current  value
//        current = current[n];
//    }
//
//    return current;
    };

    Object.diff = function (o1, o2) {
        const mut = (o, [k, v]) => ((o[k] = v), o);

        const diff1 = (left = {}, right = {}, rel = "left") => {
            let noLeft = left === null || left === undefined;
            let noRight = right === null || right === undefined;
            if (noLeft && noRight) {
                return {};
            } else if (noLeft && !noRight) {
                return {[rel]: null, right};
            }

            return Object.keys(left)
                .map((k) => {
                    const v = left[k];
                    if ((!isFile(v) && !isBlob(v) && !isDate(v)) &&
                        right !== null &&
                        (!isFile(right[k]) && !isBlob(right[k]) && !isDate(right[k])) &&
                        (isObject(v) && isObject(right[k]))) {
                        return [k, diff1(v, right[k], rel)];
                    }

                    if (right !== null && right[k] !== v) {
                        return [k, {[rel]: v}];
                    }
                    return [k, {}];
                })
                .filter(([k, v]) => !Object.keys(v).isEmpty())
                .reduce(mut, isArray(left) && isArray(right) ? [] : {});
        };

        const merge = (left = {}, right = {}) => {
            return Object.keys(right)
                .map((k) => {
                    const v = right[k];
                    if (((!isFile(v) && !isBlob(v) && !isDate(v))) &&
                        ((!isFile(left[k]) && !isBlob(left[k]) && !isDate(left[k]))) &&
                        (isObject(v) && isObject(left[k]))) {
                        return [k, merge(left[k], v)];
                    }
                    return [k, v];
                })
                .reduce(mut, left);
        };

        const diff = (x = {}, y = {}) =>
            merge(diff1(x, y, "left"), diff1(y, x, "right"));

        return diff(o1, o2);
    };
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="String Functions. Click on the + sign on the left to edit the code."> 
    String.prototype.foreach = function (callback, doneCallback) {
        let self = this;
        let lastInx, len = 0;
        for (let n = 0; n < self.length; n++) {
            let val = self[n];
            lastInx = n;
            len++;
            let value = callback.call(val, parseInt(n), val);
            if (value !== undefined && value !== null && value instanceof Boolean && !value) {
                break;
            }
        }
        if (doneCallback) {
            doneCallback(lastInx, len);
        }
        return self;
    };

    String.prototype.toCapitalCase = function () {
        let self = this;
        return self.split(' ').map(w => w.toTitleCase()).join(' ');
    };

    String.prototype.toTitleCase = function () {
        let self = this;
        let c = self.charAt(0).toUpperCase();
        self = c + self.substring(1, self.length);
        return self;
    };

    String.prototype.toSentenceCase = function () {
        let self = this;
        let c = self.charAt(0).toUpperCase();
        self = c + self.substring(1, self.length).toLowerCase();
        return self;
    };

    String.prototype.isEmpty = function () {
        return this.trimLeft().trimRight().replaceAll(' ', '').length === 0;
    };

    String.prototype.isNotEmpty = function () {
        return !this.isEmpty();
    };

    String.prototype.startsWith = function (str) {
        if (str === undefined || str === null) {
            return false;
        }
        let self = this;
        if (!self.contains(str)) {
            return false;
        }

        let len = str.length;
        return (str === self.substring(0, len));
    };

    String.prototype.endsWith = function (str) {
        if (str === undefined || str === null) {
            return false;
        }
        let self = this;
        if (!self.contains(str)) {
            return false;
        }

        let len = str.length;
        return (str === self.substring(self.length - len, self.length));
    };

    String.prototype.contains = function (str) {
        if (str === undefined || str === null) {
            return false;
        }
        let self = this;
        return (self.indexOf(str) > -1);
    };

    String.prototype.trimLeft = function () {
        let self = this;
        let head = 0;

        while (/[\s\uFEFF\u00A0]/.test(self[head])) {
            head++;
        }

        return self.slice(head, self.length);
    };

    String.prototype.trimRight = function () {
        let self = this;
        let tail = self.length;

        while (/[\s\uFEFF\u00A0]/.test(self[tail - 1])) {
            tail--;
        }

        return self.slice(0, tail);
    };

    String.prototype.replaceAll = function (searchValue, value) {
        if ((searchValue === undefined || searchValue === null) || (value === undefined || value === null)) {
            return this;
        }

        let self = this.trimLeft().trimRight();

        for (let n = 0; n < self.length; n++) {
            if (self.charAt(n) === searchValue) {
                self = self.replace(searchValue, value);
            }
        }

        return self;
    };

    String.prototype.noSpace = function () {
        return this.replaceAll(' ', '');
    };

    String.prototype.filterToEnglishCharactors = function () {
        let self = this;
        for (let n = 0; n < self.length; n++) {
            if (!((self.charCodeAt(n) >= 97 && self.charCodeAt(n) <= 122) || (self.charCodeAt(n) >= 65 && self.charCodeAt(n) <= 90))) {
                self = self.replace(self.charAt(n), '_');
            }
        }
        return self;
    };

    String.prototype.reverse = function () {
        let self = '';
        for (let n = this.length - 1; n >= 0; n--) {
            self += this[n];
        }
        return self;
    };

    String.prototype.isCreditCardNumber = function () {
        if (this.isEmpty()) {
            return false;
        }
        let self = this.replaceAll(' ', '');

        for (let n = 0; n < self.length; n++) {
            if ((self.substring(n, n + 1) < "0") || (self.substring(n, n + 1) > "9")) {
                return false;
            }
        }

        let no_digit = self.length;
        let oddoeven = no_digit & 1;
        let sum = 0;
        for (let count = 0; count < no_digit; count++) {
            let digit = parseInt(self.charAt(count));
            if (!((count & 1) ^ oddoeven)) {
                digit *= 2;
                if (digit > 9)
                    digit -= 9;
            }

            sum += digit;
        }

        if (sum === 0) {
            return false;
        }
        if (sum % 10 === 0) {
            return true;
        }
        return true;
    };

    String.prototype.isEmailAddress = function () {
        if (this.isEmpty()) {
            return false;
        }
        let self = this.replaceAll(' ', '');

        // TLD checking turned off by default
        let checkTLD = 0;
        let knownDomsPat = /^(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum)$/;
        let emailPat = /^(.+)@(.+)$/;
        let specialChars = "\\(\\)><@,;:\\\\\\\"\\.\\[\\]";
        let validChars = "[^\\s" + specialChars + "]";
        let quotedUser = "(\"[^\"]*\")";
        let ipDomainPat = /^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
        let atom = validChars + '+';
        let word = "(" + atom + "|" + quotedUser + ")";
        let userPat = new RegExp("^" + word + "(\\." + word + ")*$");
        let domainPat = new RegExp("^" + atom + "(\\." + atom + ")*$");
        let matchArray = self.match(emailPat);
        if (matchArray === null) {
            return false;
        }
        let user = matchArray[1];
        let domain = matchArray[2];
        for (let i = 0; i < user.length; i++) {
            if (user.charCodeAt(i) > 127) {
                return false;
            }
        }
        for (let i = 0; i < domain.length; i++) {
            if (domain.charCodeAt(i) > 127) {
                return false;
            }
        }
        if (user.match(userPat) === null) {
            return false;
        }
        let IPArray = domain.match(ipDomainPat);
        if (IPArray !== null) {
            for (let i = 1; i <= 4; i++) {
                if (IPArray[i] > 255) {
                    return false;
                }
            }
            return true;
        }
        let atomPat = new RegExp("^" + atom + "$");
        let domArr = domain.split(".");
        let len = domArr.length;
        for (let i = 0; i < len; i++) {
            if (domArr[i].search(atomPat) === -1) {
                return false;
            }
        }
        if (checkTLD && domArr[domArr.length - 1].length !== 2 &&
                domArr[domArr.length - 1].search(knownDomsPat) === -1) {
            return false;
        }
        if (len < 2) {
            return false;
        }
        return true;
    };

    String.prototype.isPhoneNumber = function (cb) {
        if (this.isEmpty()) {
            return false;
        }
        let self = this.replaceAll(' ', '');

        let reg = /^([()0-9+-\s])+$/;
        if (!reg.test(self)) {
            return false;
        }

        if (self.contains('(') && !self.startsWith('(')) {
            return false;
        }
        if (self.contains('+') && !self.contains('(') && !self.startsWith('+')) {
            return false;
        }

        function checkCharCount(c) {
            if (self.contains(c)) {
                let count = 0;
                self.foreach(function (n, $this) {
                    if (c === $this) {
                        count++;
                    }
                });
                return count > 1;
            }
            return false;
        }

        if (checkCharCount('+')) {
            return false;
        }
        if (checkCharCount('(')) {
            return false;
        }
        if (checkCharCount(')')) {
            return false;
        }

        if ((self.contains('(') && !self.contains(')')) || !self.contains('(') && self.contains(')')) {
            return false;
        } else {
            if (self.indexOf('(') > self.indexOf(')')) {
                return false;
            }
            if (self.indexOf('(') + 1 === self.indexOf(')')) {
                return false;
            }
        }
        console.log(self)

        return cb.call(self, self);
    };

    String.prototype.isNumeric = function () {
        if (this.isEmpty()) {
            return false;
        }
        let self = this.replaceAll(' ', '');

        let validChars = "1234567890.";
        let pos = (self.trim().charAt(0) === '+' || self.trim().charAt(0) === '-') ? 1 : 0;
        let found = true;
        let dots = 0;
        self.foreach(function (n, $this) {
            if ($this === '.') {
                dots++;
            } else {
                if (pos <= n && !validChars.contains($this)) {
                    found = false;
                }
            }
        });
        return dots <= 1 && found;
    };

    String.prototype.isAlphaNumeric = function () {
        if (this.isEmpty()) {
            return false;
        }
        let self = this.replaceAll(' ', '');

        let validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", validNums = "1234567890";
        let charFound = false, numFound = false;
        self.foreach(function (n, $this) {
            if (validChars.contains($this)) {
                charFound = true;
            } else if (validNums.contains($this)) {
                numFound = true;
            }
            if (charFound && numFound) {
                //found;
            }
        });
        return (charFound && numFound);
    };
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="Number Functions. Click on the + sign on the left to edit the code."> 
    Number.prototype.foreach = function (callback, doneCallback) {
        let self = this;
        let str = self.toString();
        str.foreach(function (n, $this) {
            let value = callback.call(new Number($this), parseInt(n), new Number($this));
            if (value !== undefined && value !== null && isBoolean(value) && !value) {
                return false;
            }
        }, doneCallback);
        return self;
    };

    Number.prototype.foreachNumber = function (start, callback) {
        if (!callback) {
            callback = start;
            start = undefined;
        }
        let self = this;
        for (let n = start || 0; n <= self; n++) {
            let value = callback.call(n, n);
            if (value !== undefined && value !== null && isBoolean(value) && !value) {
                return false;
            }
        }
        return self;
    };

    Number.prototype.toSplittedNumber = function () {
        let str = this.toString().split('.');
        let val = '';
        let i = 1;
        for (let n = str[0].length; n > 0; n--) {
            val += i % 3 === 0 ? str[0][n - 1] + ',' : str[0][n - 1];
            i++;
        }
        if (val.endsWith(',')) {
            val = val.substring(0, val.length - 1);
        }
        val = val.reverse();
        if (str.length === 2) {
            val = val + '.' + str[1];
        }

        return val;
    };

    Number.prototype.toCurrency = function () {
        let val = this.toSplittedNumber();
        let str = val.split('.');
        if (str.length === 2 && (str[1].length === 1)) {
            val = val + '0';
        } else if (str.length === 1) {
            val = val + '.00';
        }

        return arguments.length > 0 ? (arguments[0] + '' + val) : val;
    };

    Number.prototype.toCurrencyNoCents = function () {
        let val = this.toSplittedNumber();
        let str = val.split('.');
        if (str.length === 2) {
            val = str[0];
        }

        return arguments.length > 0 ? (arguments[0] + '' + val) : val;
    };
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="Array Functions. Click on the + sign on the left to edit the code.">
    Array.prototype.getValue = function (key) {
        let self = this;
        let val = null;
        self.forEach(function ($this, n, array) {
            if ($this[key]) {
                val = $this[key];
                return false;
            }
        });
        return val;
    };

    Array.prototype.getEntry = function (key) {
        let self = this;
        let obj = null;
        self.forEach(function ($this, n, array) {
            if ($this[key]) {
                obj = $this;
                return false;
            }
        });
        return obj;
    };

    Array.prototype.getFirstElement = function () {
        return this[0];
    };

    Array.prototype.getLastElement = function () {
        return this[this.length - 1];
    };

    Array.prototype.find = Array.prototype.find || function (test) {
        if (test === undefined || test === null) {
            return null;
        }
        let self = this;
        for (let n = 0; n < self.length; n++) {
            if (test(self[n], n)) {
                return self[n];
            }
        }
        return null;
    };

    Array.prototype.splitAt = function (chunkLen) {
        if (chunkLen === undefined || chunkLen === null) {
            return this;
        }
        let self = this;
        let newList = [];

        let idx = 0;
        let list = [];
        for (let n = 1; n <= self.length; n++) {
            let item = self[n - 1];
            if (item) {
                if (n % chunkLen !== 0) {
                    list.push(item);
                } else {
                    list.push(item);
                    newList[idx++] = list;
                    list = [];
                }
            }
        }
        if (!list.isEmpty())
            newList[idx] = list;
        return newList;
    };

    Array.prototype.isEmpty = function () {
        return this.length === 0;
    };

    Array.prototype.isNotEmpty = function () {
        return !this.isEmpty();
    };

    Array.prototype.indexOf = Array.prototype.indexOf || function (elt) {
        if (elt === undefined || elt === null) {
            return -1;
        }
        let self = this;
        let len = self.length;

        let from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in self && self[from] === elt)
                return from;
        }
        return -1;
    };

    Array.prototype.indexOfWithPredicate = function (test) {
        if (test === undefined || test === null) {
            return -1;
        }
        let self = this;
        let n = self.length - 1;

        do {
            if (test(self[n], n))
                return n;
            n--;
        } while (n >= 0)

        return -1;
    };

    Array.prototype.contains = function (val) {
        if (val === undefined || val === null) {
            return false;
        }
        let self = this;
        for (let n = 0; n < self.length; n++) {
            if (self[n] === val) {
                return true;
            }
        }
        return false;
    };

    Array.prototype.containsAll = function (val) {
        if (val === undefined || val === null) {
            return false;
        }
        let self = this;
        if (isArray(val)) {
            if (val.isEmpty()) {
                return false;
            }
            let found = true;

            for (let n = 0; n < val.length; n++) {
                if (!self.contains(val[n])) {
                    return false;
                }
            }
            return found;
        } else {
            for (let n = 0; n < self.length; n++) {
                if (self[n] === val) {
                    return true;
                }
            }
        }
        return false;
    };

    Array.prototype.remove = function (val) {
//        console.log('rem2-test1', val.id)
        if (val === undefined || val === null) {
            return false;
        }
//        console.log('rem2-test2', val.id)
        let self = this;
        let found = false;
        if (isArray(val)) {
            for (let n = 0; n < val.length; n++) {
                if (!(found = self.remove(val[n]))) {
                    break;
                }
            }
        } else {
//            console.log('rem2-test3', val.id)
            for (let n = 0; n < self.length; n++) {
//                console.log('rem2-test' + (4 + n), val.id)
                if (self[n] === val) {
//                    console.log('rem2-', n, val.id)
                    found = self.splice(n, 1);
                    break;
                }
            }
        }
        return found;
    };

    Array.prototype.removeFirst = function () {
        return this.splice(0, 1)[0];
    };
    Array.prototype.removeLast = function () {
        return this.splice(this.length - 1, 1)[0];
    };
    Array.prototype.removeAt = function (idx) {
        if (idx === undefined || idx === null || !isNumber(idx)) {
            return false;
        }
        return this.splice(idx, 1);
    };
    Array.prototype.removeIf = function (test) {
        if (test === undefined || test === null) {
            return false;
        }
        let self = this;
        for (let n = 0; n < self.length; n++) {
            if (test(self[n], n)) {
                return self.splice(n, 1);
            }
        }
        return false;
    };
    Array.prototype.removeAllIf = function (test) {
        if (test === undefined || test === null) {
            return false;
        }
        const self = this;
        const removed = [];
        for (let n = 0; n < self.length; n++) {
            const val = self[n];
            if (test(val, n)) {
                removed.push(val);
                self.splice(n, 1);
            }
        }
        return removed;
    };
    Array.prototype.replace = function (val, supplier) {
        if (supplier === undefined || supplier === null) {
            return null;
        }
        let self = this;
        for (let n = 0; n < self.length; n++) {
            if (self[n] === val) {
                self[n] = supplier(self[n]);
                return self[n];
            }
        }
        return null;
    };

    Array.prototype.replaceIf = function (val, test) {
        if (test === undefined || test === null) {
            return null;
        }
        let self = this;
        for (let n = 0; n < self.length; n++) {
            if (test(self[n])) {
                self[n] = val;
                return self[n];
            }
        }
        return null;
    };

    Array.prototype.clear = function () {
        let self = this;
        self.splice(0, self.length);
    };

    Array.prototype.pushFirst = function (val) {
        this.insertAt(0, val);
    };

    Array.prototype.pushAllFirst = function (val) {
        let n = val.length - 1;

        do {
            this.insertAt(0, val[n]);
            n--;
        } while (n >= 0);

    };

    Array.prototype.insertAt = function (index, val) {
        if (val === undefined || val === null) {
            return this;
        }
        let self = this;
        if (self.isEmpty()) {
            self.push(val);
        } else {
            self.splice(index, 0, val);
        }
    };

    Array.prototype.pushAll = function (val) {
        if (val === undefined || val === null) {
            return this;
        }
        let self = this;
        if (isArray(val)) {
            if (!val.isEmpty()) {
                for (let n = 0; n < val.length; n++) {
                    let $this;
                    if (!self.contains($this = val[n])) {
                        self.push($this);
                    }
                }
            }
        } else {
            self.push(val);
        }
        return self;
    };

    Array.prototype.spliceAll = function (index, n, val) {
        if (!val || !isArray(val)) {
            return this;
        }
        return this.splice.apply(this, val.unshift(index, n));
    };

    Array.prototype.retainAll = function (val, test) {
        if (val === undefined || val === null) {
            return this;
        }
        let self = this;
        if (isArray(val)) {
            if (!val.isEmpty()) {
                for (let n = 0; n < self.length; n++) {
                    let $this;
                    if (test !== undefined && test !== null) {
                        if (test($this = self[n])) {
                            self.remove($this);
                        }
                    } else {
                        if (!val.contains($this = self[n])) {
                            self.remove($this);
                        }
                    }
                }
                self.pushAll(val);
            }
        } else {
            self.push(val);
        }
        return self;
    };

    Array.prototype.every = Array.prototype.every || function (test) {
        if (test === undefined || test === null) {
            throw new Error('argument is required in every function');
        }
        let self = this;
        if (self.isEmpty()) {
            return false;
        }
        for (let n = 0; n < self.length; n++) {
            if (!test(self[n], n)) {
                return false;
            }
        }
        return true;
    };
    Array.prototype.anyMatch = Array.prototype.some = Array.prototype.some || function (test) {
        if (test === undefined || test === null) {
            throw new Error('argument is required in anyMatch function');
        }
        let self = this;
        if (self.isEmpty()) {
            return false;
        }
        for (let n = 0; n < self.length; n++) {
            if (test(self[n], n)) {
                return true;
            }
        }
        return false;
    };
    Array.prototype.noneMatch = function (test) {
        if (test === undefined || test === null) {
            throw new Error('argument is required in noneMatch function');
        }
        let self = this;
        if (self.isEmpty()) {
            return true;
        }
        for (let n = 0; n < self.length; n++) {
            if (test(self[n], n)) {
                return false;
            }
        }
        return true;
    };
    Array.prototype.allMatch = function (test) {
        if (test === undefined || test === null) {
            throw new Error('argument is required in allMatch function');
        }
        let self = this;
        if (self.isEmpty()) {
            return false;
        }
        for (let n = 0; n < self.length; n++) {
            if (!test(self[n], n)) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.groupBy = function (prop) {
        const accumulate = (acc, key, val) => {
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(val);
        };

        if (isFunction(prop)) {
            const supplier = prop;
            const acc = {};
            this.forEach(v => {
                const key = supplier(v);
                if (isArray(key)) {
                    key.forEach(key => {
                        accumulate(acc, key, v);
                    });
                } else {
                    accumulate(acc, key, v);
                }
            });
            return acc;
        } else {
            const props = prop.split('.');
            return this.reduce((acc, obj) => {
                if (props.length === 1) {
                    const key = obj[prop];
                    accumulate(acc, key, obj);
                } else {
                    const prop1 = props[0];
                    if (prop1 in obj) {
                        const prop2 = props[1];
                        const obj2 = obj[prop1];
                        if (prop2 in obj2) {
                            const key = obj2[prop2];
                            accumulate(acc, key, obj);
                        }
                    }
                }
                return acc;
            }, {});
        }
    };

    Array.prototype.sortBy = function (prop, dir) {
        this.sort((a, b) => {
            const v1 = Object.getValueByPath(a, prop);
            const v2 = Object.getValueByPath(b, prop);
            if (v1 === v2 || (isNullable(v1) && isNullable(v2))) {
                return 0;
            }

            if (v1 > v2)
                return dir === 'desc' ? -1 : 1;
            if (v1 < v2)
                return dir === 'desc' ? 1 : -1;
            return 0;
        });
    };

    Array.prototype.distinct = function (test) {
        let array;
        if (isFunction(test)) {
            array = this.filter(test);
        } else if (isString(test)) {
            const key = test;
            array = this.filter(function (value, index, self) {
                return self.indexOfWithPredicate((v, n) => v[key] === value[key]) === index;
            });
        } else {
            array = this.filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });
        }
        return Array.from(new Set(array.map(JSON.stringify))).map(JSON.parse);
    };

    Array.prototype.min = function (supplier) {
        if(supplier) {
            return Math.min(...this.map(supplier));
        }
        return Math.min(...this);
    };

    Array.prototype.max = function (supplier) {
        if(supplier) {
            return Math.max(...this.map(supplier));
        }
        return Math.max(...this);
    };

    Array.range = function (min, max, step = 1){
        return Array.from({length: (max - min) / step + 1}, (_, n) => min + (n * step));
    };

    Array.prototype.fromArgs = Array.prototype.fromArguments = function (...args) {
        return args;
    };

    Array.fromArgs = Array.fromArguments = function (...args) {
        return args;
    };

    Array.prototype.toObject = function () {
        return {...this};
    };

    Array.prototype.jsonArrayString = function (param) {
        let self = this;
        let source = '[';
        self.forEach(function (self, n, array) {
            if (isString(self)) {
                source += '"' + self + '",';
            } else if (isNumber(self) || isBoolean(self)) {
                source += self + ',';
            } else if (isFunction(self) && param && param.includeFunction) {
                source += self.toString() + ',';
            } else if (isArray(self)) {
                source += self.jsonArrayString(param) + ',';
            } else if (isObject(self)) {
                source += jsonObjectString(self, param) + ',';
            }
        });

        if (self !== null && source !== "[") {
            source = source.substring(0, source.length - 1);
        }
        source += ']';
        return source;
    };
    //</editor-fold>
})(typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this);
