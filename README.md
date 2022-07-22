# jsonex-poc
proof of concept of JsonEx, providing isomorphism between javascript objects and strings, enabling portable modules.

javascript and perl two uniquely powerful languages that can take a deeply nested object from their object model that even contains functions(or subroutines in perl), convert it to a string, evaluate it, convert it to a string, evaluate it, convert it to a string, evaluate it, add three properties, convert it to a string, evaluate it, put it into an array, turn that array to a string, evaluate it, turn it into a string, evaluate it, add it into another object, turn it into a string, and put int back into a file. 

In essence, this allows a "living module", as files can be read in as objects, functions can be added/removed, stringified, and put back into the file. 

In practice it looks like this(Perl can do this without any user code with Data::Dumper, whereas javascript needs custom code such as jsonex to enable the behavior below to be possible, but it's still better than Python, Lua, Ruby, etc which are incapable of doing the below):

```js
log(jsonex_stringify(jsonex_parse(jsonex_stringify(jsonex_parse(jsonex_stringify(jsonex_parse(jsonex_stringify(
{
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
))))))));

// | testing both jscript and node
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
```
