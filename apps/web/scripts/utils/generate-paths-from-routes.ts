import { NoitaRouteObject } from '../../src/routes/router.types';
import { arrayHelpers, stringHelpers } from '@noita-explorer/tools';

interface GeneratePathOptions {
  filterBy?: (route: NoitaRouteObject) => boolean;
}

export function generatePathsFromRoutes(
  routes: NoitaRouteObject[],
  options?: GeneratePathOptions,
) {
  const paths = generatePathsFromRoutesInternal({
    routes,
    prefix: '',
    options,
  }).map((path) => stringHelpers.trim({ text: path, fromEnd: '/' }));

  return arrayHelpers.unique(paths);
}

function generatePathsFromRoutesInternal({
  routes,
  prefix,
  options,
}: {
  routes: NoitaRouteObject[];
  prefix: string;
  options?: GeneratePathOptions;
}) {
  let results: string[] = [];

  const hasSlash = prefix?.endsWith('/');
  if (!hasSlash) {
    prefix += '/';
  }

  for (const route of routes) {
    if (route.path === undefined) {
      continue;
    }

    if (typeof options?.filterBy === 'function') {
      const shouldKeep = options.filterBy(route);
      if (!shouldKeep) {
        continue;
      }
    }

    let subPrefixes: string[] = [];

    if (route.path.startsWith(':')) {
      subPrefixes = getDynamicParamPrefixes(route, prefix);
    } else {
      const subPrefix = prefix + route.path;
      subPrefixes.push(subPrefix);
    }

    if (route.children) {
      for (const subPrefix of subPrefixes) {
        const subResults = generatePathsFromRoutesInternal({
          routes: route.children,
          prefix: subPrefix,
          options,
        });
        results = results.concat(subResults);
      }
    }

    // only push current url if it's a leaf node
    results = results.concat(subPrefixes);
  }

  return results;
}

function getDynamicParamPrefixes(
  route: NoitaRouteObject,
  prefix: string,
): string[] {
  if (typeof route.getAllDynamicParams !== 'function') {
    throw new Error(
      'For dynamic routes route.getAllDynamicParams must be a function',
    );
  }

  const params = route.getAllDynamicParams();

  return params.map((param) => prefix + param);
}
