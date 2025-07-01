import { useQueryParamsString } from './use-query-params-string.ts';
import { Dispatch, useState } from 'react';

interface Props<T> {
  key: string;
  queryParamValueSelector: (value: T) => string;
  findValueBasedOnQueryParam: (value: string) => T | undefined;
  enabled?: boolean;
}

export const useStateWithQueryParamsString = <T>({
  key,
  queryParamValueSelector,
  findValueBasedOnQueryParam,
  enabled = true,
}: Props<T>): [T | undefined, Dispatch<T | undefined>] => {
  const [queryParam, setQueryParam] = useQueryParamsString(key);
  const [state, setState] = useState<{
    value: T | undefined;
    lastQueryParamLookup: string | undefined;
  }>({ value: undefined, lastQueryParamLookup: undefined });

  const setValueCallback = (value: T | undefined) => {
    setState({ value: value, lastQueryParamLookup: undefined });

    if (value) {
      const queryParamValue = queryParamValueSelector(value);
      setQueryParam(queryParamValue);
    } else {
      setQueryParam(undefined);
    }
  };

  // if query param present but state is empty, find the state
  if (
    enabled &&
    queryParam &&
    !state.value &&
    state.lastQueryParamLookup !== queryParam
  ) {
    const value = findValueBasedOnQueryParam(queryParam);
    setState({ value: value, lastQueryParamLookup: queryParam });
  }

  // check if the query param aligns with the currently selected item
  if (
    enabled &&
    state.value &&
    queryParam &&
    queryParam !== queryParamValueSelector(state.value)
  ) {
    const value = findValueBasedOnQueryParam(queryParam);
    setState({ value: value, lastQueryParamLookup: queryParam });
  }

  return [state.value, setValueCallback];
};
