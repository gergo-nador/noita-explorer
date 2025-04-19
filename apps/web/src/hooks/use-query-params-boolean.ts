import { useSearchParams } from 'react-router-dom';
import { Dispatch } from 'react';

export const useQueryParamsBoolean = (
  key: string,
): [boolean, Dispatch<boolean>] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParamValue = searchParams.get(key) === '1';
  const setQueryParamValue = (value: boolean) =>
    setSearchParams((state) => {
      state.set(key, value ? '1' : '0');
      return state;
    });

  return [queryParamValue, setQueryParamValue];
};
