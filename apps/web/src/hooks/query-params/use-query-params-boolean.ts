import { useSearchParams } from 'react-router-dom';
import { Dispatch, useEffect } from 'react';

export const useQueryParamsBoolean = ({
  key,
  defaultValue,
}: {
  key: string;
  defaultValue?: boolean;
}): [boolean, Dispatch<boolean>] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParamValue = searchParams.get(key) === '1';

  const setQueryParamValue = (value: boolean) =>
    setSearchParams((state) => {
      state.set(key, value ? '1' : '0');
      return state;
    });

  useEffect(() => {
    if (defaultValue) {
      setQueryParamValue(defaultValue);
    }
  }, []);

  return [queryParamValue, setQueryParamValue];
};
