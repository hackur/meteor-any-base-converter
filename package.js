/**
 * Created by matan on 10/22/15.
 */
Package.describe({
  name: 'bookmd:any-base-converter',
  version: '0.1.1',
  summary: 'Convert from any string representable base (redix) to another',
  git: 'https://github.com/bookmd/meteor-any-base-converter'
});

Package.onUse(function (api) {
  api.use([
    'ecmascript@0.1.0'
  ]);

  api.addFiles([
    'lib/baseConversionError.js',
    'lib/baseConverter.js'
  ]);
});

Package.onTest(function (api) {
  api.use([
    'ecmascript',
    'bookmd:any-base-converter@0.0.1',
    'sanjo:jasmine@0.16.4'
  ]);

  api.addFiles([
    'tests/lib/baseConverter.js'
  ]);
});