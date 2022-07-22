#!/usr/bin/perl
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
