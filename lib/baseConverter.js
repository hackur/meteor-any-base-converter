/**
 * Created by matan on 10/22/15.
 */

var ACTUAL_MAX_SAFE_INTEGER = 9007199254740990; //MAX_SAFE - 1
/**
 * Util class, provides tool to convert integer 'numbers' from any string representable base to another.
 *
 * Base Definition:
 * Bases are represented as a string, which contains all the possible 'digits' in said base.
 * The value any 'digit' is determine by it index in the string.
 * You can use the provided base or define your own.
 */
class BaseConverter {
  /**
   * Converts a given 'number' in the given base to a decimal Number
   * @param {String} source A 'number' in a given base to convert.
   * @param {String} sourceBase Representing the base of the source number
   * @returns {Number} Decimal base Number
   * @throws {BaseConversionError} Thrown in case the source 'number' contains a 'digit' that is not found in the sourceBase
   */
  static toNumber(source, sourceBase) {
    let sourceBaseSize = sourceBase.length;
    let result = 0;

    let charValue;
    for (let i = 0; i < source.length; i++) {
      charValue = sourceBase.indexOf(source.charAt(i));
      if (charValue === -1) {
        throw new BaseConversionError(`Symbol '${source.charAt(i)}' is not defined in source base '${sourceBase}'`);
      }

      result = (result * sourceBaseSize) + charValue;
    }

    return result
  }

  /**
   * Converts a given decimal Number to any targetBase provided.
   * @param {Number} number Decimal Number to convert. Number must be smaller then Number.MAX_SAFE_INTEGER
   * @param {String} targetBase Representing the base to convert to
   * @returns {String} string representation of the decimal Number in the provided base
   * @throws {BaseConversionError} Thrown in case the given number exceeds Number.MAX_SAFE_INTEGER
   */
  static fromNumber(number, targetBase) {
    if(number > ACTUAL_MAX_SAFE_INTEGER) throw new BaseConversionError(`The number ${number} exceeds JavaScript max safe integer, could not convert`);

    let targetBaseSize = targetBase.length;

    let remainder = number % targetBaseSize;
    let result = targetBase.charAt(remainder);
    let value = Math.floor(number / targetBaseSize);

    while (value) {
      remainder = value % targetBaseSize;
      value = Math.floor(value / targetBaseSize);
      result = targetBase.charAt(remainder) + result;
    }

    return result;
  }

  /**
   * Converts a 'number' in a given base to a 'number in a different given base
   * @param {String} source String representation of a number in the sourceBase
   * @param {String} sourceBase Representing the base of the source 'number'
   * @param {String} targetBase Representing the base to convert to
   * @returns {String} string representation of the 'number' in the provided base
   * @throws {BaseConversionError} Thrown in case the source 'number' contains a 'digit' that is not found in the sourceBase
   * @throws {BaseConversionError} Thrown in case the given source in decimal form exceeds Number.MAX_SAFE_INTEGER
   */
  static convert(source, sourceBase, targetBase) {
    return BaseConverter.fromNumber(BaseConverter.toNumber(source, sourceBase), targetBase);
  }

  /**
   * Creates a function that converts one constant base to the another constant base
   * @param {String} sourceBase Representing the base of the source 'number'
   * @param {String} targetBase Representing the base to convert to
   * @returns {Function} Converts a given string source from the sourceBase to the targetBase
   */
  static baseConverter(sourceBase, targetBase) {
    return function(source){
      return BaseConverter.convert(source, sourceBase, targetBase);
    }
  }
}

BaseConverter.BASE2 = '01';
BaseConverter.BASE8 = '01234567';
BaseConverter.BASE10 = '0123456789';
BaseConverter.BASE16 = '0123456789abcdef';
BaseConverter.BASE32 = '0123456789abcdefghijklmnopqrstuvwxyz';
BaseConverter.BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

BaseConverter.BASE26 = 'abcdefghijklmnopqrstuvwxyz';
BaseConverter.BASE52 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

this.BaseConverter = BaseConverter;