import banLambdaRuntimes from './ban-lambda-runtimes';
import constructCtor from './construct-ctor';
import filenameMatchRegex from './filename-match-regex';
import noStaticImport from './no-static-import';
import propsStructName from './props-struct-name';
import publicStaticPropertyAllCaps from './public-static-property-all-caps';

export default {
  'ban-lambda-runtimes': banLambdaRuntimes,
  'construct-ctor': constructCtor,
  'filename-match-regex': filenameMatchRegex,
  'no-static-import': noStaticImport,
  'props-struct-name': propsStructName,
  'public-static-property-all-caps': publicStaticPropertyAllCaps,
};
