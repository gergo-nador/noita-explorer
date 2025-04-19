import toast from 'react-hot-toast/headless';
import { Icon } from './components/icons/icon';

const iconSize = 20;

export const noiToast = {
  error: (text: string) =>
    toast.error(text, {
      icon: <Icon type={'error'} width={iconSize} height={iconSize} />,
    }),
  info: (text: string) =>
    toast.custom(text, {
      icon: <Icon type={'info'} width={iconSize} height={iconSize} />,
    }),
  warning: (text: string) =>
    toast.custom(text, {
      icon: <Icon type={'warning'} width={iconSize} height={iconSize} />,
    }),
  success: (text: string) =>
    toast.success(text, {
      icon: <Icon type={'check'} width={iconSize} height={iconSize} />,
    }),
};
