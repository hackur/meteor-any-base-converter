/**
 * Created by matan on 10/22/15.
 */
describe('BaseConverter', function () {
  beforeAll(function () {
    this.evenBase = '02468';
    this.oddBase = '13579';
    this.reverse32 = 'zyxwvutsrqponmlkjihgfedcba9876543210';
  });

  describe('toNumber', function () {
    it('Check error for base-source mismatch', function () {
      expect(() => BaseConverter.toNumber('1a3fe2k9', BaseConverter.BASE16)).toThrowError(BaseConversionError,
        "Symbol 'k' is not defined in source base '0123456789abcdef'");
    });

    it('Check standard bases conversion', function () {
      let b2 = {args: ['001001110011101', BaseConverter.BASE2], result: 5021};
      let b8 = {args: ['273514561', BaseConverter.BASE8], result: 49191281};
      let b10 = {args: ['3619210471831', BaseConverter.BASE10], result: 3619210471831};
      let b16 = {args: ['59819d71528', BaseConverter.BASE16], result: 6150826693928};
      let b32 = {args: ['378asjd2k19', BaseConverter.BASE32], result: 11702809658485484};
      let b62 = {args: ['21shJK2jA1', BaseConverter.BASE62], result: 27392125917331572};

      let b26 = {args: ['mncaoiejkdl', BaseConverter.BASE26], result: 1765010771661161};
      let b52 = {args: ['saKAgl', BaseConverter.BASE52], result: 6848805091};

      [b2, b8, b10, b16, b32, b62, b26, b52].forEach(testCase =>
        expect(BaseConverter.toNumber(...testCase.args)).toEqual(testCase.result));
    });

    it('Check custom convertion', function () {
      let even = {args: ['286206', this.evenBase], result: 6028};
      let odd = {args: ['971535', this.oddBase], result: 14432};
      let reverse32 = {args: ['dzpy81a', this.reverse32], result: 47906090449};

      [even, odd, reverse32].forEach(testCase =>
        expect(BaseConverter.toNumber(...testCase.args)).toEqual(testCase.result));
    });
  });

  describe('fromNumber', function () {
    it('Check error for too big source number', function () {
      expect(() => BaseConverter.fromNumber(9007199254740992, BaseConverter.BASE10))
        .toThrowError(BaseConversionError, 'The number 9007199254740992 exceeds JavaScript max safe integer, could not convert');
    });

    it('Check standard base conversion', function () {
      let b2 = {args: [5021, BaseConverter.BASE2], result: '1001110011101'};
      let b8 = {args: [49191281, BaseConverter.BASE8], result: '273514561'};
      let b10 = {args: [3619210471831, BaseConverter.BASE10], result: '3619210471831'};
      let b16 = {args: [6150826693928, BaseConverter.BASE16], result: '59819d71528'};
      let b32 = {args: [117028485484, BaseConverter.BASE32], result: '1hrfqlbg'};
      let b62 = {args: [27392117331572, BaseConverter.BASE62], result: '7MfIMNbC'};

      let b26 = {args: [1765010771661161, BaseConverter.BASE26], result: 'mncaoiejkdl'};
      let b52 = {args: [6848805091, BaseConverter.BASE52], result: 'saKAgl'};

      [b2, b8, b10, b16, b32, b62, b26, b52].forEach(testCase =>
        expect(BaseConverter.fromNumber(...testCase.args)).toEqual(testCase.result));
    });

    it('Check custom bases conversion', function () {
      let even = {args: [6028, this.evenBase], result: '286206'};
      let odd = {args: [14432, this.oddBase], result: '971535'};
      let reverse32 = {args: [47906090449, this.reverse32], result: 'dzpy81a'};

      [even, odd, reverse32].forEach(testCase =>
        expect(BaseConverter.fromNumber(...testCase.args)).toEqual(testCase.result));
    })
  });

  describe('Syntax Sugar', function () {

    beforeAll(function () {
      let b2ToB8 = {args: ['100110110101', BaseConverter.BASE2, BaseConverter.BASE8], result: '4665'};
      let b8ToB10 = {args: ['312567', BaseConverter.BASE8, BaseConverter.BASE10], result: '103799'};
      let b10ToB16 = {args: ['138735', BaseConverter.BASE10, BaseConverter.BASE16], result: '21def'};
      let b16ToB32 = {args: ['39fea', BaseConverter.BASE16, BaseConverter.BASE32], result: '53ai'};
      let b32ToB62 = {args: ['9gfi2', BaseConverter.BASE32, BaseConverter.BASE62], result: '14DVw'};
      let b62ToB2 = {args: ['6f2GaZ2', BaseConverter.BASE62, BaseConverter.BASE2], result: '101001010001110110010110101110101100000'};

      this.standardCases = [b2ToB8, b8ToB10, b10ToB16, b16ToB32, b32ToB62, b62ToB2];

      let evenToOdd = {args: ['86248', this.evenBase, this.oddBase], result: '97359'};
      let evenToRevrese32 = {args: ['86248', this.evenBase, this.reverse32], result: 'xr1'};
      let oddToEven = {args: ['97359', this.oddBase, this.evenBase], result: '86248'};
      let oddToReverse32 = {args: ['79135', this.oddBase, this.reverse32], result: 'y5t'};
      let reverse32ToEven = {args: ['5gl3a', this.reverse32, this.evenBase], result: '202224808060'};
      let reverse32ToOdd = {args: ['2c9e3', this.reverse32, this.evenBase], result: '206866208200'};

      this.customCases = [evenToOdd, evenToRevrese32, oddToEven, oddToReverse32, reverse32ToEven, reverse32ToOdd];
    });

    describe('convert', function () {
      it('Check error thrown in case of base-source mismatch', function () {
        expect(() => BaseConverter.convert("123a321", BaseConverter.BASE10, BaseConverter.BASE16))
          .toThrowError(BaseConversionError, "Symbol 'a' is not defined in source base '0123456789'");
      });

      it('Check error thrown in case of conversion exceeds max safe int', function () {
        expect(() => BaseConverter.convert("ZLKJADKLASKKMAkjsakl12231", BaseConverter.BASE62, BaseConverter.BASE52))
          .toThrowError(BaseConversionError, /The number [.0-9+e]* exceeds JavaScript max safe integer, could not convert/);
      });

      it('Check conversion of standard bases', function () {
        this.standardCases.forEach(testCase =>
          expect(BaseConverter.convert(...testCase.args)).toEqual(testCase.result));
      });

      it('Check conversion of custom bases', function () {
        this.customCases.forEach(testCase =>
          expect(BaseConverter.convert(...testCase.args)).toEqual(testCase.result));
      });
    });

    describe('baseConverter', function () {
      it('Check error thrown for base-source mismatch', function () {
        var converter = BaseConverter.baseConverter(BaseConverter.BASE2, BaseConverter.BASE10);
        expect(() => converter('1001511')).toThrowError(BaseConversionError,
          "Symbol '5' is not defined in source base '01'");
      });

      it('Check error thrown for conversion exceeds max safe int', function () {
        var converter = BaseConverter.baseConverter(BaseConverter.BASE62, BaseConverter.BASE10);
        expect(() => converter('NSAJKNLKDSAJJJSALada13123')).toThrowError(BaseConversionError,
          /The number [.0-9+e]* exceeds JavaScript max safe integer, could not convert/)
      });

      it('Check standard base converters', function () {
        for (testCase of this.standardCases){
          let converter = BaseConverter.baseConverter(testCase.args[1], testCase.args[2]);
          expect(converter(testCase.args[0])).toEqual(testCase.result);
        }
      });

      it('Check custom base converters', function () {
        for (testCase of this.customCases){
          let converter = BaseConverter.baseConverter(testCase.args[1], testCase.args[2]);
          expect(converter(testCase.args[0])).toEqual(testCase.result);
        }
      });
    })
  });
});