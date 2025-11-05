function trimMetadata(base64: string) {
  const split = base64.split(';base64,');
  return split.length > 1 ? split[split.length - 1] : base64;
}

function appendMetadata(base64: string, type = 'image/png') {
  if (base64.startsWith('data:')) return base64;
  return `data:${type};base64,${base64}`;
}

export const base64Helpers = { trimMetadata, appendMetadata };
