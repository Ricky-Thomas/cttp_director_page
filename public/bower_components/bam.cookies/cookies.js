define([], function() {

    var cookieNameRx = new RegExp("[A-Za-z0-9_-]+"), DELIM = ';', STRING = 'string', DATE = 'date', BOOL = 'boolean', OBJECT='object', VALUE='value',
        KEYS = ['name','expires','path','domain','secure'], VAL_TYPES = new RegExp("number|string|boolean"), COOKIE_RX = new RegExp("([A-Za-z0-9_-|@\\.]+)=([^;]*)","ig"),
        encode = encodeURIComponent,
        decode = decodeURIComponent;

    var exports = {};

    /**
     *  Set a cookie
     *	@name - <String> Cookie name
     *	@value - <String|Number|Boolean> Cookie value
     *	-- or --
     *	@obj - <object> structure that contains cookie options
     *	{ name: 'foo', value:'val', domain:'.mydomain.com', path:'/', expires: Date(), secure:false}
     */
    exports.set = function(/*name, value | obj*/) {
        var cookieStr = [], param, args = $.makeArray(arguments), opt = (args.length === 2 && $.type(args[0])===STRING)?{name:args[0],value:args[1]}:args[0];
        if($.type(opt)===OBJECT) {
            $.each(KEYS, function(i, key) {
                param = (key in opt)?opt[key]:null;
                if(key === KEYS[2] && !param) { param = "/"; }
                if(param!==null) {
                    switch(key) {
                        //Name/value check
                        case KEYS[0]: if($.type(param)===STRING && cookieNameRx.test(param) && VAL_TYPES.test($.type(opt[VALUE]||null))) {
                            cookieStr.push(param+'='+encode(opt[VALUE]));
                        } else { return false; } break;
                        //Expires check
                        case KEYS[1]: if($.type(param)===DATE) {
                            cookieStr.push(key+'='+param.toGMTString());
                        } break;
                        //Path check
                        case KEYS[2]: if($.type(param)===STRING) {
                            cookieStr.push(key+'='+(param || "/"));
                        } break;
                        //Secure flag check
                        case KEYS[4]: if($.type(param)===BOOL && !!param) {
                            cookieStr.push(key);
                        } break;
                        default: if($.type(param)===STRING && param) {
                            cookieStr.push(key+'='+param);
                        }
                    }
                }
            });
        }
        if(cookieStr.length) {
            document.cookie = cookieStr.join(DELIM);
        }
    };
    /**
     *	Sets multiple cookies in bulk
     *	Accepts a collection of Cookie objects (look at set(obj) function)
     *  @arguments - <Arguments> comma delimeted list of cookie objects
     *	-- or --
     *	@arguments - <Array> Array of cookie objects
     */
    exports.setBulk = function(/* Arguments | Array */) {
        var args = $.makeArray(arguments), cookies = args.length && $.isArray(args[0])?args[0]:args, c = cookies.length;
        if(c) {
            while(c--) {
                this.set(cookies[c]);
            }
        }
    };


    /**
     *  Returns a Cookie value or null is fnot found
     *  @name - <String> Cookie name
     */
    exports.get = function(name) {
        return this.getAll()[name]||null;
    };


    /**
     *  Returns an object with key/value pairs for each cookie
     */
    exports.getAll =function(/* */) {
        var cookies = {};
        decode(document.cookie).replace(COOKIE_RX, function() {
            cookies[arguments[1]]=arguments[2];
        });
        return cookies;
    };


    /**
     *	Removes a Cookie
     *	@name - <String> Cookie name
     *	-- or --
     *	@obj - <object> Cookie object with more granular domain or path details
     *	Note: Expiration and value will be overrwritten
     */
    exports.remove = function(/* name | obj*/) {
        var args = $.makeArray(arguments), base = { expires: new Date(), value:-1 };
        base.expires.setTime(base.expires-1);
        if(args.length) {
            switch($.type(args[0])) {
                case STRING: base.name = args[0]; break;
                case OBJECT: base = $.extend(args[0], base); break;
                default: return false;
            }
            this.set(base);
        }
    };


    /**
     *  Removes several cookies in bulk
     *	Accepts an arguments list or an array of cookie names or objects
     *	Cookie object format is the same as in set(obj) function
     */
    exports.removeBulk = function(/* Arguments | Array */) {
        var args = $.makeArray(arguments), cookies = args.length && $.isArray(args[0])?args[0]:args, c = cookies.length;
        if(c) {
            while(c--) {
                this.remove(cookies[c]);
            }
        }
    };

    return exports;

});