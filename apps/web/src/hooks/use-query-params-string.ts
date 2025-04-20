import { useSearchParams } from 'react-router-dom';
import { Dispatch } from 'react';

export const useQueryParamsString = (
  key: string,
): [string | undefined, Dispatch<string | undefined>] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParamValue = searchParams.get(key);

  const setQueryParamValue = (value: string | undefined) =>
    setSearchParams((state) => {
      if (value) {
        state.set(key, value);
      } else {
        state.delete(key);
      }

      return state;
    });

  return [queryParamValue ? queryParamValue : undefined, setQueryParamValue];
};
