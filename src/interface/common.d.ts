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

type SizeType = "md" | "lg" | "xl" | "xxxl";

interface ProductInterface {
  image: {
    src: string;
    fallBackSize?: SizeType;
    size?: SizeType;
    fitSize?: boolean;
    hide?: boolean;
    preview?: boolean;
  };
  content: NameSkuContentInterface;
  block?: boolean;
  wrapperClassName?: string;
  align?: "center" | "start" | "end";
  wrap?: boolean;
}


 interface NameSkuContentInterface {
  name: string;
  sku: string;
  variantName: string;
}

type SearchInputProps = {
  handleSearch: (value: string) => void;
  contacts: ContactsType[];
  setContacts: React.Dispatch<SetStateAction<ContactsType[]>>;
  setProducts: React.Dispatch<SetStateAction<ProductsType[]>>;
  handleReset: () => void;
  setSelectedContactId: React.Dispatch<SetStateAction<number | null>>;
};

interface ProductTable {
  list: any[];
  loading?: boolean;
}

type TableRecord = {
  key: React.Key;
  product: {
    sku: string;
    name: string;
    variantName: string;
  };
};


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

interface HeadingInterface {
  children: ReactNode;
  wrapperStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  titleLevel?: 1 | 2 | 3 | 4 | 5;
  titleClassName?: string;
  warapperClassName?: string;
}

type ContactsType = {
  id: number;
  created: string;
  updated: string;
  code: string;
  first_name: string;
  last_name: string;
  company_name: string;
  payment_terms: string;
  notes: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  currency: string;
};

type ProductsType = {
  id: number;
  tax_id: number | null;
  tax: number | null;
  created: string;
  updated: string;
  name: string;
  sku: string;
  variant_name: string;
  barcode: string;
  categories: string[];
  tags: string[];
  image_url: string;
  uom: string;
  notes: string;
  tracking_type: number;
  bundle_type: string;
  is_archived: boolean;
  cost: string;
  lead_time: number | null;
  close_at_quantity: number;
  in_stock: number;
  booked: number;
  incoming: number;
  client: number;
  available: number;
};
