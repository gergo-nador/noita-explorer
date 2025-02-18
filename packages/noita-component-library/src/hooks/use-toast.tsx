import toast from 'react-hot-toast/headless';
import { Icon } from '../components/icons/icon';

export const useToast = () => {
  const size = 20;
  return {
    error: (text: string) =>
      toast.error(text, {
        icon: <Icon type={'error'} width={size} height={size} />,
      }),
    info: (text: string) =>
      toast.custom(text, {
        icon: <Icon type={'info'} width={size} height={size} />,
      }),
    warning: (text: string) =>
      toast.custom(text, {
        icon: <Icon type={'warning'} width={size} height={size} />,
      }),
    success: (text: string) =>
      toast.success(text, {
        icon: <Icon type={'check'} width={size} height={size} />,
      }),
  };
};
