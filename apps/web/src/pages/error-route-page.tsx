import { Flex } from '../components/flex.tsx';
import { Button, Card } from '@noita-explorer/noita-component-library';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { diffChars } from 'diff';
import { arrayHelpers } from '@noita-explorer/tools';
import { useMemo } from 'react';
import { StringKeyDictionaryComposite } from '@noita-explorer/model';
import { pages } from '../routes/pages.ts';

export const ErrorRoutePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPathName = location.pathname;

  const potentialPath = useMemo(() => {
    const paths = getAllPaths(pages);

    const noDiffPercentage = paths.map((path) => {
      const diffResult = diffChars(path, currentPathName);
      const noDiff = diffResult.filter((d) => !d.added && !d.removed);
      const noDiffValue = arrayHelpers.sumBy(noDiff, (d) => d.count);
      const largerString =
        path.length > currentPathName.length ? path : currentPathName;

      const noDiffPercentage = 1 - noDiffValue / largerString.length;
      return { path, noDiffPercentage };
    });

    const potential = arrayHelpers.minBy(
      noDiffPercentage,
      (t) => t.noDiffPercentage,
    );

    // suggested path has to match at least 60%
    if (potential.value > 0.4) {
      return undefined;
    }

    return potential.item?.path;
  }, [currentPathName]);

  return (
    <Flex column center style={{ padding: 10 }}>
      <Card>
        <h1>404 - Uhhh ohhh, it looks like this page does not exist</h1>
        <div>The page {currentPathName} does not exist.</div>
        {potentialPath && (
          <>
            <br />
            <Flex gap={8}>
              <span>Did you mean to go to</span>
              <Link to={potentialPath} style={{ color: 'white' }}>
                <Button>{potentialPath}</Button>
              </Link>
              <span>?</span>
            </Flex>
          </>
        )}
        <br />
        <div>
          <Button onClick={() => navigate(pages.main)}>
            Click here to go to main page
          </Button>
        </div>
      </Card>
    </Flex>
  );
};

const getAllPaths = (
  pathObj: StringKeyDictionaryComposite<string>,
  paths?: string[],
) => {
  paths ??= [];

  if (typeof pathObj !== 'object') {
    return paths;
  }

  for (const key in pathObj) {
    const val = pathObj[key];
    if (typeof val === 'string') {
      paths.push(val);
    } else if (typeof val === 'object') {
      getAllPaths(val, paths);
    }
  }

  return paths;
};
