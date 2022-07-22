# | added for the contrast to jsonex.pl
use strict;
use warnings;
use Data::Dumper;
$Data::Dumper::Deparse = 1;
$Data::Dumper::Purity = 1;
$Data::Dumper::Indent = 1;
$Data::Dumper::Terse = 1;

# | Turns the given argument into a string.
sub stringify {
    return Dumper $_[0];
}

# Turns the given argument string into an object of the perl typesystem.
sub plonex_parse {
    return eval $_[0];
}
