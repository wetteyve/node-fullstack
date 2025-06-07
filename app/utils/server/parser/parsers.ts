import { z, type output, type SafeParseReturnType, type ZodObject, type ZodRawShape, type ZodTypeAny } from 'zod';

type Options<Parser = SearchParamsParser> = {
  /** Custom error message for when the validation fails. */
  message?: string;
  /** Status code for thrown request when validation fails. */
  status?: number;
  /** Custom URLSearchParams parsing function. */
  parser?: Parser;
};

/**
 * Type assertion function avoids problems with some bundlers when
 * using `instanceof` to check the type of a `schema` param.
 */
const isZodType = (input: ZodRawShape | ZodTypeAny): input is ZodTypeAny => typeof input.parse === 'function';

/**
 * Generic return type for parseX functions.
 */
type ParsedData<T extends ZodRawShape | ZodTypeAny> = T extends ZodTypeAny
  ? output<T>
  : T extends ZodRawShape
    ? output<ZodObject<T>>
    : never;

/**
 * Generic return type for parseXSafe functions.
 */
export type SafeParsedData<T extends ZodRawShape | ZodTypeAny> = T extends ZodTypeAny
  ? SafeParseReturnType<z.infer<T>, ParsedData<T>>
  : T extends ZodRawShape
    ? SafeParseReturnType<ZodObject<T>, ParsedData<T>>
    : never;

/**
 * Parse and validate URLSearchParams or a Request. Doesn't throw if validation fails.
 * @param request - A Request or URLSearchParams
 * @param schema - A Zod object shape or object schema to validate.
 * @returns {SafeParseReturnType} - An object with the parsed data or a ZodError.
 */
export const parseQuerySafe = <T extends ZodRawShape | ZodTypeAny>(
  request: Request | URLSearchParams,
  schema: T,
  options?: Options
): SafeParsedData<T> => {
  const searchParams = isURLSearchParams(request) ? request : getSearchParamsFromRequest(request as Request);
  const params = parseSearchParams(searchParams as URLSearchParams, options?.parser);
  const finalSchema = isZodType(schema) ? schema : z.object(schema);
  return finalSchema.safeParse(params) as SafeParsedData<T>;
};

/**
 * Parse and validate FormData from a Request. Doesn't throw if validation fails.
 * @param request - A Request or FormData
 * @param schema - A Zod object shape or object schema to validate.
 * @returns {SafeParseReturnType} - An object with the parsed data or a ZodError.
 */
export const parseFormSafe = async <T extends ZodRawShape | ZodTypeAny, Parser extends SearchParamsParser<never>>(
  request: Request | FormData,
  schema: T,
  options?: Options<Parser>
): Promise<SafeParsedData<T>> => {
  const formData = isFormData(request) ? request : await request.clone().formData();
  const data = await parseFormData(formData, options?.parser);
  const finalSchema = isZodType(schema) ? schema : z.object(schema);
  return finalSchema.safeParseAsync(data) as Promise<SafeParsedData<T>>;
};

/**
 * The data returned from parsing a URLSearchParams object.
 */
type ParsedSearchParams = Record<string, string | string[]>;

/**
 * Function signature to allow for custom URLSearchParams parsing.
 */
type SearchParamsParser<T = ParsedSearchParams> = (searchParams: URLSearchParams) => T;

/**
 * Check if an object entry value is an instance of Object
 */
const isObjectEntry = ([, value]: [string, FormDataEntryValue]) => value instanceof Object;

/**
 * Get the form data from a request as an object.
 */
const parseFormData = (formData: FormData, customParser?: SearchParamsParser) => {
  const objectEntries = [...formData.entries()].filter(isObjectEntry);
  objectEntries.forEach(([key, value]) => {
    formData.set(key, JSON.stringify(value));
  });
  // Context on `as any` usage: https://github.com/microsoft/TypeScript/issues/30584
  return parseSearchParams(new URLSearchParams(formData as never), customParser);
};

/**
 * Get the URLSearchParams as an object.
 */
const parseSearchParams = (searchParams: URLSearchParams, customParser?: SearchParamsParser): ParsedSearchParams => {
  const parser = customParser || parseSearchParamsDefault;
  return parser(searchParams);
};

/**
 * The default parser for URLSearchParams.
 * Get the search params as an object. Create arrays for duplicate keys.
 */
const parseSearchParamsDefault: SearchParamsParser = (searchParams) => {
  const values: ParsedSearchParams = {};
  for (const [key, value] of searchParams) {
    const currentVal = values[key];
    if (currentVal && Array.isArray(currentVal)) {
      currentVal.push(value);
    } else if (currentVal) {
      values[key] = [currentVal, value];
    } else {
      values[key] = value;
    }
  }
  return values;
};

/**
 * Get the search params from a request.
 */
const getSearchParamsFromRequest = (request: Request): URLSearchParams => {
  const url = new URL(request.url);
  return url.searchParams;
};

/**
 * Check if value is an instance of FormData.
 * This is a workaround for `instanceof` to support multiple platforms.
 */
const isFormData = (value: unknown): value is FormData => getObjectTypeName(value) === 'FormData';

/**
 * Check if value is an instance of URLSearchParams.
 * This is a workaround for `instanceof` to support multiple platforms.
 */
const isURLSearchParams = (value: unknown): value is FormData => getObjectTypeName(value) === 'URLSearchParams';

const getObjectTypeName = (value: unknown): string => toString.call(value).slice(8, -1);
