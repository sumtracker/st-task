export const getQueryFromUrl = (url: string) => {
  const urlObj = new URL(url);
  const query: Record<string, any> = {};
  urlObj.searchParams.forEach(function (val, key) {
    query[key] = val;
  });

  return query;
};

export const getObjectFromURlParams = (searchParams: URLSearchParams) => {
  const obj: Record<string, any> = {};
  searchParams.forEach((value: any, key: any) => {
    obj[key] = value;
  });
  return obj;
};

export const getUrlSearchParamsFromObject = (obj: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      searchParams.set(key, obj[key] || 0);
    }
  }
  return searchParams;
};

export const pluralize = (num: number, word: string, plural = word + "s") =>
  [1, -1].includes(Number(num)) ? word : plural;
