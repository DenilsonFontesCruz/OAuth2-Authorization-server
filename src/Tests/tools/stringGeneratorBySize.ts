export const stringGeneratorBySize = (
  size: number,
  start: string = '',
  end: string = '',
): string => {
  const fakeText = 'X'.repeat(size);
  return `${start}${fakeText}${end}`;
};
