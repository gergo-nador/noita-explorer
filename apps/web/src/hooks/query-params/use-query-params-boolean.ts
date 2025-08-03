import { useSearchParams } from 'react-router-dom';
import { Dispatch, useRef } from 'react';

export const useQueryParamsBoolean = ({
  key,
  defaultValue,
}: {
  key: string;
  defaultValue?: boolean;
}): [boolean, Dispatch<boolean>] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRenderRef = useRef(true);

  const queryParamValue = searchParams.get(key) === '1';

  const setQueryParamValue = (value: boolean) =>
    setSearchParams((state) => {
      state.set(key, value ? '1' : '0');
      return state;
    });

  if (isFirstRenderRef.current) {
    isFirstRenderRef.current = false;
    if (defaultValue) {
      setQueryParamValue(defaultValue);
    }
  }

  return [queryParamValue, setQueryParamValue];
};
