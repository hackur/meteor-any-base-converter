# meteor-any-base-converter
Arbitrary base conversion for Meteor

* [Dependencies](#dependencies)
* [Install](#install)
* [Base Representation](#base-representation)
* [Functions](#functions)
  * [convert](#convert)
  * [baseConverter](#baseconverter)
  * [fromNumber](#fromnumber)
  * [toNumber](#tonumber)
* [Limitation](#limitation)

## Dependencies
* [`ecmascript`](https://atmospherejs.com/meteor/ecmascript)

## Install
`meteor add bookmd:any-base-converter`

## Usage
This package allows you to perform base conversion similar to the javascript `Number.toString(n)` function.
While toString() only supports predefined bases from 2-36, this package supports any custom base definition representable by a string.

## Base Representation
A base is defined by a string made out of all the allowed 'digits' ordered by value.

For example, here are the package predefined bases:
```javascript
BaseConverter.BASE2 = '01';
BaseConverter.BASE8 = '01234567';
BaseConverter.BASE10 = '0123456789';
BaseConverter.BASE16 = '0123456789abcdef';
BaseConverter.BASE36 = '0123456789abcdefghijklmnopqrstuvwxyz';
BaseConverter.BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

BaseConverter.BASE26 = 'abcdefghijklmnopqrstuvwxyz';
BaseConverter.BASE52 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
```

Take for example BASE16, the string is composed out of the standard 'digits' for the Hexadecimal base, the index of every character
defines its value. For example 'a' in base 16 is at index 10, so its value (in decimal base) is 10.

These predefined bases or for fast usage of standard bases, you can use them or define your own custom bases.

## Functions
### convert
Use the convert method to convert a source 'number' from any base to any other base.

Using this function you'll need to provide the 'number' you wish to convert, the base definition of that 'number',
and the base definition of the base you wish to convert to.

For example:
```javascript
BaseConverter.convert('ff', BaseConverter.BASE16, BaseConverter.BASE8) // returns: '377'
BaseConverter.convert('35', '01245', BaseConverter.BASE2) // returns: '10111'
BaseConverter.convert('hello', BaseConverter.BASE26, BaseConverter.BASE10) // returns: '8029422'
```
Note that the value returned is always a string, even if the target base is the decimal base.

convert will throw a `BaseConversionError` in case the 'number' passed for conversion contains a character which is
not present in the source base definition.

For example:
```javascript
BaseConverter.convert('396', '01234567', '0123456789abcdef'); // BASE8 to BASE16
  // BaseConversionError: Symbol '9' is not defined in source base '01234567'
```

Note, the function might also throw an exception for very large numbers, this is by design, see Limition to understand
why.

### baseConverter
If you perform a lot of conversion from one specific base to another in multiple places in your code,
you should consider using the `baseConvertor` function.

baseConvertor takes two base definition and returns a function that then takes only the 'number' to convert.
This way you can use this conversion function anywhere in your code, while the conversion definition is stated once,
and can be easily changed later.

Example:
```javascript
var binaryToHex = BaseConverter.baseConverter(BaseConverter.BASE2, BaseConverter.BASE16)
binaryToHex('101101') // returns: '2d'
binaryToHex('11100101') // returns: 'e5'
```
You can of course pass in custom bases instead of the predefined bases.

Note that the return function throws the same exceptions as the 'convert' function, i.e for a 'number' which includes
a character not defined in the in the source-base definition, or for very large 'numbers'.

### fromNumber
If your source number is in the decimal base and you don't want to convert your Number into String before performing
the base-conversion you can use the fromNumber function.

This function takes an actual number (i.e javascript Number) and a target base definition, and converts the number
(treated as in decimal base) to the given target base.

For example:
```javascript
BaseConverter.fromNumber(255, BaseConverter.BASE16) // returns: 'ff'
BaseConverter.fromNumber(321, '01234') // returns: '2241'
```
Note that the function always returns a string.

The function throws an `Base Conversion Error` for numbers exceeding javascript `Number.MAX_SAFE_INTEGER`.
For explanation on this subject, see Limitation.

Notice that the conversion does not support floating point number, only integers. Any passed number is treaded  as
integer, passing a floating point will result in an incorrect result.
(If you need this type of conversion feel free to contribute)

### toNumber
If you want to convert a 'number' from any base to the decimal base and to receive a number, you can use the toNumber function.
It is even (very) slightly more efficient.

The toNumber function revice a source 'number' and the base definition of that 'number', and converts it to the decimal
base, returning a number (i.e javascript 'Number').

For example:
```javascript
BaseConverter.toNumber('hello', BaseConverter.BASE26) // returns: 3276872
BaseConverter.toNumber('123123' '0123') // returns: 1755
```

toNumber will throw a `BaseConversionError` in case the 'number' passed for conversion contains a character which is
not present in the source base definition.

For example:
```javascript
BaseConverter.fromNumber('396', '01234567');
  // BaseConversionError: Symbol '9' is not defined in source base '01234567'
```

## Limitation
Conversion is limited by javascript `Number.MAX_SAFE_INTEGER`, currently set to 9007199254740991.
Any 'number' (in decimal base or otherwise) with a value greater OR EQUAL to said constant will result in an exception.

For example the number '9007199254740992' in decimal base will throw an exception, same as
'FfGNdXsE8' in Base-62. In fact, they have the same value.

Note that the exception thrown will contain the number in DECIMAL form, so when if you whant to handle
the expetion based in it's message be sure to use a ReEx and not the passed 'number'.
