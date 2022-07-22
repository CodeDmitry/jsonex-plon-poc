# jsonex-poc
proof of concept of JsonEx, providing isomorphism between javascript objects and strings, enabling portable modules.

javascript and perl two uniquely powerful languages that can take a deeply nested object from their object model that even contains functions(or subroutines in perl), convert it to a string, evaluate it, convert it to a string, evaluate it, convert it to a string, evaluate it, add three properties, convert it to a string, evaluate it, put it into an array, turn that array to a string, evaluate it, turn it into a string, evaluate it, add it into another object, turn it into a string, and put int back into a file. 

In essence, this allows a "living module", as files can be read in as objects, functions can be added/removed, stringified, and put back into the file. 

In practice it looks like this:

jsonex_parse(jsonex_stringify(jsonex_parse(jsonex_stringify(jsonex_parse(jsonex_stringify(
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
}
))))))
