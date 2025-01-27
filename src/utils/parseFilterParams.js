const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) {
    return undefined;
  }
  return ['personal', 'home', 'work'].includes(contactType)
    ? contactType
    : undefined;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;
  console.log('Parsed filterParams:', { type, isFavourite });

  return {
    contactType: parseContactType(type),
    isFavourite:
      isFavourite === 'true'
        ? true
        : isFavourite === 'false'
        ? false
        : undefined,
  };
};
