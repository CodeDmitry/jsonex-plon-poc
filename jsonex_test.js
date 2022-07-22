// | the test is a success if the structure below can be converted to string, evald, converted to string, evald, then converted to string again, 
// | without any loss of data nor errors.
var myObject = {
    aNumber1: 2,
    aString: 'Hello, World!',
    aBoolean: true,
    aNull: null,
    aFunction: function(a) {
        return new function(b) {
            return new function(c) {
                return a + b + c;
            }
        }
    },
    anArray: [1, 'Hey', false, null, function(a) {
        return function(b) {
            return function(c) {
                return a * (b + c);
            }
        }
    }],
    aSubObject: {
        aNumber2: 0,
        aString2: 'Bye',
        aBoolean: false,
        aNull: null,
        aFunction: function(a) {
            return function(b) {
                return function(c) {
                    return a - (b + c);
                }
            }
        },
        anArray: [9, 'one', true, null, function() { 
            return 'A result from a function'; 
        }, [1, 2, 3, 4, 5]]
    }
};

function JsonEx_toString(self) {
    // | cache typeof, as it is used multiple times.
    var T = typeof(self);

    // | null is the only allowed type is allowed not to have a constructor,
    // | and as such, must be checked first.
    if (self === null) {
        return 'null';
    } 
    
    // | the only type allowed to not have a constructor is null,
    // | which we have checked already.
    try {
        self.constructor;
    } catch (e) {
        log("e: " + self);
        throw new TypeError('JsonEx_toString passed a non null constructorless object.');
    }
    
    // | handle the rest of the primitives.
    if (T === 'string') {
        return '"' + self.toString().replace("\n", "\\n") + '"';
    } else if (T === 'number' || T === 'boolean') {
        return self.toString();
    } else if (T === 'function') {
        var s = self.toString();
        // | we are restrictive about the functions we allow,
        // | as lambdas are not portable.
        if (s.indexOf('=>') !== -1) {
            throw new TypeError('ES6 lambdas are not allowed in JsonEx as they are not portable.');
        } 
        return s;
    } 

    // | In some versions of javascript(JScript), an array is only
    // | checkable by checking x instanceof Array, it has no Function.prototype.name.
    if (self instanceof Array) {
        var parts = [];
        var L = self.length;
        var result = '[';
             
        for (var i = 0; i < L; ++i) {
            parts.push(JsonEx_toString(self[i]));
        }
        
        result += parts.join(', ') + ']';
        return result;
    } 
    
    // | object will be wrapped in () as well, for compatibility with JScript.
    if (self.constructor === Object) {
        var keys = [];
        var values = [];
        // | we cannot tell the number of keys, as it is not portable.
        var nkeys = 0; 
        var result = '({';
        
        for (var key in self) {
            ++nkeys;
            keys.push(key);
            values.push(JsonEx_toString(self[key]));
        }
        if (nkeys == 0) {
            return '({})';
        } else {
            result += JsonEx_toString(keys[0]) + ': ' + values[0];
        }
        
        for (var i = 1; i < nkeys; ++i) {        
            result += ', ' + JsonEx_toString(keys[i]) + ': ' + values[i];
        }
        
        result += '})';
        return result;
    }
                
    throw new TypeError('Unsupported type passed to JsonEx_toString.');
}

function log(s) {
    try {
        WScript.echo(s);
    } catch (e) {
        try {
            console.log(s);
        } catch (e) {
            throw e;
        }
    }
}

// | some simple tests.
try {
    log("test1: " + JsonEx_toString(eval(JsonEx_toString({a: 2, b: function(){}}))));
    log("test2: " + JsonEx_toString(eval(JsonEx_toString([1, function(){}]))));
} catch (e) {
    log("error: " + e.message);
}

// | sime simpler tests.
log("test3: " + JsonEx_toString(eval(JsonEx_toString(eval(JsonEx_toString(eval('({"a": 3, b: function(){}})')))))));
log("test4: " + JsonEx_toString(eval(JsonEx_toString(eval(JsonEx_toString(eval('[1, function(){}, 3, 4]')))))));

// | the final test, with the big object.
try {
    log("test5: " + JsonEx_toString(eval(JsonEx_toString(eval(JsonEx_toString(myObject))))));
} catch (e) {
    log(e.message);
}
