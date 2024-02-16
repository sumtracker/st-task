export type UrlType = string | null;

interface PaginationUIInterface {
  next: UrlType;
  prev: UrlType;
  onPrevClick?: (prev: UrlType) => void;
  onNextClick?: (next: UrlType) => void;
}

interface ResultStringInterface {
  pagination: PaginateDataType;
  loading: boolean;
  pageString?: string;
}

interface Contact {
  value: string;
  label: string;
  id: number;
}

interface ProductSearchprops {
  loadProducts: () => void,
  setProducts: (result: any[]) => void,
  setPagination: (result: any) => void,
  pagination: PaginateDataType,
  contactId?: string | null
}

type PaginateDataType = {
  next: UrlType;
  prev: UrlType;
  count: number | null;
  count: number | null;
  resultsCount: number;
  limit: number | null;
  hasOffset: boolean;
  offset: number | null;
};
