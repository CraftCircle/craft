export const removeEmpty = (args: Record<string, any>): Record<string, any> => {
  let notEmptyArgs = Object.entries(args || {})
    .filter(([_, v]) => v !== null && v !== undefined)
    .map(([k, v]) => [k, typeof v === "object" ? removeEmpty(v) : v]);

  return Object.fromEntries(notEmptyArgs);
};
