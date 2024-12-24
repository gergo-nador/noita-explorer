const trim = ({
  text,
  fromEnd,
  fromStart,
}: {
  text: string;
  fromStart?: string;
  fromEnd?: string;
}): string => {
  if (text === undefined) {
    throw new Error('input text is undefined');
  }

  if (fromStart !== undefined && text.startsWith(fromStart)) {
    text = text.substring(fromStart.length);
  }

  if (fromEnd !== undefined && text.endsWith(fromEnd)) {
    text = text.substring(0, text.length - fromEnd.length);
  }

  return text;
};

export const stringHelpers = {
  trim: trim,
};
