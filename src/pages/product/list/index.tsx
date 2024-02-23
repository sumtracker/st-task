import { FC, useEffect, useState } from "react";
import ResultString from "../../../components/content/result.content";
import Heading from "../../../components/heading/basic.heading";
import Pagination from "../../../components/pagination/basic.pagination";
import { PAGINATION_LIMIT } from "../../../constants/app.constants";
import {
  ContactsPaginationType,
  PaginateDataType,
  UrlType,
} from "../../../interface/common";
import { listProducts } from "../../../services/products";
import { getQueryFromUrl, getUrlSearchParamsFromObject } from "../../../utils/common.utils";
import ProductsTable from "./components/products.table";
import Typehead from "../../../components/typeahead/typeaheadview";
import { listContacts } from "../../../services/contacts";
import { useLocation, useNavigate } from "react-router-dom";

const fixedListParams = {
  paginate: true,
};

const ProductList: FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoding] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginateDataType>({
    next: null,
    prev: null,
    count: null,
    resultsCount: 0,
    offset: null,
    hasOffset: true,
    limit: PAGINATION_LIMIT,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState(
    new URLSearchParams(location.search)
  );

  const [contacts, setContacts] = useState<any[]>([]);
  const [contactLoading, setContactLoading] = useState<boolean>(false);
  const [contactPagination, setContactPagination] =
    useState<ContactsPaginationType>({
      next: null,
      prev: null,
    });

  const init = async (queryParams: any) => {
    loadProducts(queryParams);
  };

  const loadProducts = async (queryParams?: Record<string, any>) => {
    console.log(queryParams);
    let query = queryParams || {};
    setLoding(true);
    try {
      const res = await listProducts({
        query: { ...fixedListParams, ...query },
      });

      setProducts(res.data.results);
      setPagination((prev) => {
        return {
          ...prev,
          next: res.data.next,
          prev: res.data.previous,
          count: res.data.count,
          resultsCount: res.data.results.length,
          offset: query?.offset ? Number(query.offset) : null,
        };
      });
    } catch (err) {
      console.log(err);
    }
    setLoding(false);
  };

  const loadContacts = async (
    token: any,
    queryParams?: Record<string, any>
  ) => {
    let query = queryParams || {};
    setContactLoading(true);
    try {
      const res = await listContacts({
        cancelToken: token,
        query: { ...fixedListParams, ...query },
      });
      setContacts(res.data.results);
      console.log(res.data);
      setContactPagination({
        next: res.data.next,
        prev: res.data.prev,
      });
    } catch (err) {
      console.log(err);
    }
    setContactLoading(false);
  };

  const handleNavigate = (queryParams: any) => {
    navigate({
      pathname: location.pathname,
      search: getUrlSearchParamsFromObject(queryParams).toString(),
    });
  };

  const handleNext = (next: UrlType) => {
    if (next === null) {
      return;
    }
    let query = getQueryFromUrl(next);
    console.log(query);
    loadProducts(query);
    handleNavigate(query);
  };

  const handlePrev = (prev: UrlType) => {
    if (prev === null) {
      return;
    }
    let query = getQueryFromUrl(prev);
    loadProducts(query);
    handleNavigate(query);
  };
  useEffect(() => {
    // Access and parse query parameters
    const contactParam = queryParams.get("contact");
    const paginateParam = queryParams.get("paginate");
    const limitParam = queryParams.get("limit");
    const offsetParam = queryParams.get("offset");

    init({
      contact: contactParam,
      paginate: paginateParam,
      limit: limitParam,
      offset: offsetParam,
    });
  }, [queryParams]);
  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <Heading titleLevel={2}>Products</Heading>
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: "0.5rem",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <Typehead
            onLoad={loadContacts}
            data={contacts}
            isLoading={contactLoading}
            pagination={contactPagination}
            onLoadProducts={loadProducts}
            searchParams={queryParams}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <ResultString
                loading={loading}
                pagination={pagination}
                pageString={"product"}
              />
            </div>
            <div>
              <Pagination
                next={pagination.next}
                prev={pagination.prev}
                onNextClick={handleNext}
                onPrevClick={handlePrev}
              />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <ProductsTable list={products} loading={loading} />
        </div>
        <div>
          <Pagination next={pagination.next} prev={pagination.prev} />
        </div>
      </div>
    </>
  );
};

export default ProductList;
