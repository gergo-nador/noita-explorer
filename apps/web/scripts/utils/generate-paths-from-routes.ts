import { NoitaRouteObject } from '../../src/routes/router.types';
import { arrayHelpers, stringHelpers } from '@noita-explorer/tools';

interface GeneratePathOptions {
  filterBy?: (route: NoitaRouteObject) => boolean;
}

interface GeneratePathReturn {
  path: string;
  route: NoitaRouteObject;
}

export function generatePathsFromRoutes(
  routes: NoitaRouteObject[],
  options?: GeneratePathOptions,
): GeneratePathReturn[] {
  const paths = generatePathsFromRoutesInternal({
    routes,
    prefix: '',
    options,
  }).map((generatedPath) => {
    return {
      ...generatedPath,
      path: stringHelpers.trim({ text: generatedPath.path, fromEnd: '/' }),
    };
  });

  return arrayHelpers.uniqueBy(paths, (path) => path.path);
}

function generatePathsFromRoutesInternal({
  routes,
  prefix,
  options,
}: {
  routes: NoitaRouteObject[];
  prefix: string;
  options?: GeneratePathOptions;
}): GeneratePathReturn[] {
  let results: GeneratePathReturn[] = [];

  const hasSlash = prefix?.endsWith('/');
  if (!hasSlash) {
    prefix += '/';
  }

  for (const route of routes) {
    if (route.path === undefined) {
      continue;
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

    if (typeof options?.filterBy === 'function') {
      const shouldKeep = options.filterBy(route);
      if (!shouldKeep) {
        continue;
      }
    }

    // only push current url if it's a leaf node
    const routeResults = subPrefixes.map(
      (path): GeneratePathReturn => ({ path: path, route }),
    );
    results = results.concat(routeResults);
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
