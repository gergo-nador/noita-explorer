import { createContext } from 'react';

interface DocumentTitleContextType {
  setPreTitle: (preTitle: string | undefined) => void;
}

export const DocumentTitleContext = createContext<DocumentTitleContextType>({
  setPreTitle: () => {},
});
