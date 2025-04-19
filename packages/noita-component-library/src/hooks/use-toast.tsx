import { noiToast } from '../noi-toast';

export const useToast = () => {
  const toast = noiToast;

  return {
    error: (text: string) => toast.error(text),
    info: (text: string) => toast.info(text),
    warning: (text: string) => toast.warning(text),
    success: (text: string) => toast.success(text),
  };
};
