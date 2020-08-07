import banLambdaRuntimes from './ban-lambda-runtimes';
import bandReservedWords from './ban-reserved-words';
import constructCtor from './construct-ctor';
import filenameMatchRegex from './filename-match-regex';
import noStaticImport from './no-static-import';
import constructPropsStructName from './construct-props-struct-name';
import publicStaticPropertyAllCaps from './public-static-property-all-caps';
import stackPropsStructName from './stack-props-struct-name';
import preferTypeOnlyImports from './prefer-type-only-imports';

export default {
  'ban-lambda-runtimes': banLambdaRuntimes,
  'ban-reserved-words': bandReservedWords,
  'construct-ctor': constructCtor,
  'filename-match-regex': filenameMatchRegex,
  'no-static-import': noStaticImport,
  'construct-props-struct-name': constructPropsStructName,
  'public-static-property-all-caps': publicStaticPropertyAllCaps,
  'stack-props-struct-name': stackPropsStructName,
  'prefer-type-only-imports': preferTypeOnlyImports,
};
