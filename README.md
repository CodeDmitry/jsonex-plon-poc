# jsonex-plon-poc
A proof of concept of JsonEx, providing isomorphism between javascript objects and strings, enabling portable modules.

JavaScript and Perl two uniquely powerful languages that can take a deeply nested object from their object model that even contains functions(or subroutines in perl), convert it to a string, evaluate it, convert it to a string, evaluate it, convert it to a string, evaluate it, add three properties, convert it to a string, evaluate it, put it into an array, turn that array to a string, evaluate it, turn it into a string, evaluate it, add it into another object, turn it into a string, and put int back into a file. 

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


Perl Object Notation example(PLON):

```perl
use Data::Dumper;
use strict;
use warnings;

$Data::Dumper::Deparse = 1; # <- allow stringification of coderefs.
$Data::Dumper::Terse = 1; # <- do not include $VAR= in deparse
$Data::Dumper::Purity = 1; # <- fills in references?
$Data::Dumper::Indent = 1; # <- indents our dumper of structures.

my $myObject = {
    aNumber1 => 2,
    aString => 'Hello, World!',
    aBoolean => 1,
    aNull => undef,
    aFunction => sub {
        my $a = $_[0];
        return sub {
            my $b = $_[0];
            return sub {
                my $c = $_[0];
                return $a + $b + $c;
            }
        }
    },
    anArray => [1, 'Hey', 0, undef, sub {
        my $a = $_[0];
        return sub {
            my $b = $_[0];
            return sub {
                my $c = $_[0];
                return $a * ($b + $c);
            }
        }
    }],
    aSubObject => {
        aNumber2 => 0,
        aString2 => 'Bye',
        aBoolean => 0,
        aNull => undef,
        aFunction => sub {
            my $a = $_[0];
            return sub {
                my $b = $_[0];
                return sub {
                    my $c = $_[0];
                    return $a - ($b + $c);
                }
            }
        },
        anArray => [9, 'one', 1, undef, sub { 
            return 'A result from a function'; 
        }, [1, 2, 3, 4, 5]]
    }
};

# | working as expected(reminder, brackets are allowed to be implicit in Perl).
print Dumper eval Dumper eval Dumper $myObject;
```

I've heard Lisp can do this as well but it's needlessly complicated, as Lisp tends to pretend Dictionaries(Objects/Associative Lists/Maps) are the spawn of satan, and makes them as difficult to use and hides them as far away from beginners as it can.

**Why**

The reason why is because everyone is obsessed with portable modules, and it's already here, no need to pollute the namespace with packages that cannot be removed after they're imported, just create a simple extended json file(such as myModuleLoadedFromFile), and load that file as a string, evaluate it into a module, then use it, pretend myModuleLoadedFromFile was the result of evaluating the object loaded from file:

```js
// | pretend the right hand of this expression is loaded from file and evald:
var myModuleLoadedFromFile = ({
    createGreeterClass: function CreateBoxClass() {
        // | the constructor
        function Greeter(x) {
            this.x = x;
        };
        // | the method(s)
        Greeter.prototype = {
            greet: function() {
                try {
                    console.log("Hello, World!");
                } catch (e) {
                    try {
                        WScript.Echo("Hello, World");
                    } catch (e) {
                        // | we do not know our context, it has no 
                        // | console.log nor WScript.Echo.
                        // | lets return a function which can be called
                        // | with a function that accepts a string
                        // | and prints a result, or does something 
                        // | else with it.
                        return function(howToWrite) {
                            return howToWrite("Hello, World!");
                        }
                    }
                }
            }
        };
        return Greeter;
    }
});

var Greeter = myModuleLoadedFromFile.createGreeterClass();
var greeter = new Greeter;
greeter.greet();
```

or in perl:

```perl
# | pretend the right hand side of this expression was loaded from file and eval'd
my $myModuleLoadedFromFile = {
    createGreeterClass => sub {   
        # constructor
        my $Greeter_create = sub {
            my $x = $_[1];
            $self->{x} = $x;
        };
        $Greeter_greet = sub {
            print "Hi\n";
        };
        
        return {
            create => $Greeter_create,
            greet => $Greeter_greet
        };
    }
};

my $Greeter = $myModuleLoadedFromFile->{createGreeterClass}->();
my $greeter = $Greeter->{create};
$Greeter->{greet}->($greeter);
```

Sadly Perl's type system is based on globally visible packages, meaning theres cannot be two objects with the same type name but 
different type implementation. This also means that without arcane magic, this approach does not allow "named type" construction,
and does not allow "methods" to be attached to objects in an OOP style. There are workarounds involving ties, or custom dynamic
dispatch implementations, involving doing your own prototype chain plumbing that javascript has. In theory Perl has Sub::Prototype module
as mentioned in this thread https://stackoverflow.com/questions/49490635/how-to-set-the-prototype-of-an-anonymous-perl-function which enables 
JavaScriptlike behavior, but I have not yet looked into it.

That said, it is still conceptually much simpler, and more flexible(allowing stringification/evaluation/extension) than Perl packages are.

