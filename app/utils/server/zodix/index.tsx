import { parseParams, parseParamsSafe, parseQuery, parseQuerySafe, parseForm, parseFormSafe } from '#app/utils/server/zodix/parsers';
import { BoolAsString, CheckboxAsString, IntAsString, NumAsString } from '#app/utils/server/zodix/schemas';

export {
  parseParams,
  parseParamsSafe,
  parseQuery,
  parseQuerySafe,
  parseForm,
  parseFormSafe,
  BoolAsString,
  CheckboxAsString,
  IntAsString,
  NumAsString,
};

export const zx = {
  parseParams,
  parseParamsSafe,
  parseQuery,
  parseQuerySafe,
  parseForm,
  parseFormSafe,
  BoolAsString,
  CheckboxAsString,
  IntAsString,
  NumAsString,
};
