export const stringGeneratorBySize = (
  size: number,
  start: string = '',
  end: string = '',
) => {
  const fakeText = 'X'.repeat(size);
  return `${start}${fakeText}${end}`;
};
