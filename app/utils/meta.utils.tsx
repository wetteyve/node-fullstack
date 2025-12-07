import { Suspense, use } from 'react';
import { type MetaDescriptor } from 'react-router';

export const DEFAULT_TITLE = 'Node Fullstack';

type MetaMatch = {
  id: string;
  pathname: string;
  params: Record<string, string | undefined>;
  data?: any;
  loaderData?: any;
  handle?: unknown;
};

const stringKey = <K extends string>(descriptor: MetaDescriptor, key: K): descriptor is MetaDescriptor & Record<K, string> =>
  key in descriptor && typeof descriptor[key as keyof MetaDescriptor] === 'string';

export const findMetaInMatches = (matches: readonly MetaMatch[]): MetaDescriptor[] | Promise<MetaDescriptor[]> => {
  const reversed = [...matches].reverse().filter((match): match is MetaMatch => match !== undefined);

  for (const match of reversed) {
    const meta = match.data?.meta;
    if (meta) {
      // Handle promise-based meta
      if (meta instanceof Promise) {
        return meta
          .then((resolved) => (resolved.length > 0 ? resolved : findMetaInMatches(reversed.slice(reversed.indexOf(match) + 1))))
          .catch(() => findMetaInMatches(reversed.slice(reversed.indexOf(match) + 1)));
      }

      // Handle synchronous meta
      if (Array.isArray(meta) && meta.length > 0) {
        return meta;
      }
    }
  }

  return getGlobalMetaTags();
};

export const getGlobalMetaTags = (title: string = DEFAULT_TITLE): MetaDescriptor[] => [{ title }, { property: 'og:title', content: title }];

export const Meta = ({ descriptors }: { descriptors: MetaDescriptor[] }) => (
  <>
    {descriptors.map((descriptor, index) => {
      if (stringKey(descriptor, 'title')) {
        return <title key={index}>{descriptor.title as string}</title>;
      }
      if (stringKey(descriptor, 'charSet')) {
        return <meta key={descriptor.charSet} charSet={descriptor.charSet} />;
      }
      if (stringKey(descriptor, 'name')) {
        return <meta {...descriptor} key={descriptor.name} />;
      }
      if (stringKey(descriptor, 'property')) {
        return <meta {...descriptor} key={descriptor.property} />;
      }
      return <meta {...descriptor} key={index} />;
    })}
  </>
);

export const SuspendedMetaTags = ({ descriptors }: { descriptors: MetaDescriptor[] | Promise<MetaDescriptor[]> }) => {
  const resolvedDescriptors = descriptors instanceof Promise ? use(descriptors) : descriptors;
  return <Meta descriptors={resolvedDescriptors} />;
};

export const MetaTags = ({ descriptors }: { descriptors: MetaDescriptor[] | Promise<MetaDescriptor[]> }) => (
  <Suspense fallback={<Meta descriptors={getGlobalMetaTags()} />}>
    <SuspendedMetaTags descriptors={descriptors} />
  </Suspense>
);
