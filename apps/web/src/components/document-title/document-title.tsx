import React, { useEffect, useState } from 'react';
import { DocumentTitleContext } from './document-title-context.ts';

export const DocumentTitle = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const [preTitle, setPreTitle] = useState<string>();

  useEffect(() => {
    const oldTitle = document.title;
    document.title = preTitle ? `${preTitle} - ${title}` : title;

    return () => {
      document.title = oldTitle;
    };
  }, [title, preTitle]);

  return (
    <DocumentTitleContext.Provider
      value={{ setPreTitle: (title) => setPreTitle(title) }}
    >
      {children}
    </DocumentTitleContext.Provider>
  );
};
