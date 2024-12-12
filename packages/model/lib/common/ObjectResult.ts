export type ObjectResult<TData, TError = unknown> =
  | SuccessResult<TData>
  | ErrorResult<TError>;

export interface SuccessResult<TData> {
  isSuccess: true;
  isError: false;
  data: TData;
}

export interface ErrorResult<TAdditionalData> {
  isSuccess: false;
  isError: true;
  message: string;
  additionalData?: TAdditionalData;
}

export function createSuccessResult<TData>({
  data,
}: {
  data: TData;
}): SuccessResult<TData> {
  return {
    isSuccess: true,
    isError: false,
    data: data,
  };
}

export function createErrorResult<TAdditionalData = unknown>({
  message,
  additionalData,
}: {
  message: string;
  additionalData?: TAdditionalData;
}): ErrorResult<TAdditionalData> {
  return {
    isSuccess: false,
    isError: true,
    message,
    additionalData,
  };
}
