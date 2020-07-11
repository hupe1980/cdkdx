import banLambdaRuntimes from './ban-lambda-runtimes';
import constructCtor from './construct-ctor';
import filenameMatchRegex from './filename-match-regex';
import noStaticImport from './no-static-import';
import constructPropsStructName from './construct-props-struct-name';
import publicStaticPropertyAllCaps from './public-static-property-all-caps';
import stackPropsStructName from './stack-props-struct-name';

export default {
  'ban-lambda-runtimes': banLambdaRuntimes,
  'construct-ctor': constructCtor,
  'filename-match-regex': filenameMatchRegex,
  'no-static-import': noStaticImport,
  'construct-props-struct-name': constructPropsStructName,
  'public-static-property-all-caps': publicStaticPropertyAllCaps,
  'stack-props-struct-name': stackPropsStructName,
};
