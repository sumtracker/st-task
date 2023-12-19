//* Packages Imports */
import { FC, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

//* Components Imports */
import ProductsTable from "./components/products.table";
import SearchInput from "../../../components/content/search.content";
import ResultString from "../../../components/content/result.content";
import Heading from "../../../components/heading/basic.heading";
import Pagination from "../../../components/pagination/basic.pagination";

//* Services Imports */
import { PAGINATION_LIMIT } from "../../../constants/app.constants";
import { listProducts } from "../../../services/products";
import { listContacts } from "../../../services/contacts";
import { getQueryFromUrl } from "../../../utils/common.utils";

//* Interface Imports */
import {
  ContactsType,
  PaginateDataType,
  ProductsType,
  UrlType,
} from "../../../interface/common";

const fixedListParams = {
  paginate: true,
};

const ProductList: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [products, setProducts] = useState<ProductsType[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(
    null
  );
  const [contacts, setContacts] = useState<ContactsType[]>([]);
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

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    loadProducts();
  };

  // Fetch products Handler
  const loadProducts = async (queryParams?: Record<string, any>) => {
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

  // Next Page Navigation Handler
  const handleNext = (next: UrlType) => {
    if (next === null) {
      return;
    }
    let query = getQueryFromUrl(next);
    loadProducts(query);

    const updatedUrl = `${pathname}?${new URLSearchParams({
      ...query,
      contact: selectedContactId as unknown as string,
    }).toString()}`;
    navigate(updatedUrl);
  };

  // Previous Page Navigation Handler
  const handlePrev = (prev: UrlType) => {
    if (prev === null) {
      return;
    }
    let query = getQueryFromUrl(prev);
    loadProducts(query);

    // Append query parameters to the URL
    const updatedUrl = `${pathname}?${new URLSearchParams(query).toString()}`;
    navigate(updatedUrl);
  };

  // Search for Contacts Handler
  const handleSearch = async (value: string) => {
    try {
      const res = await listContacts({
        query: { search: value, ...fixedListParams },
      });

      setContacts(res.data.results);
      setPagination((prev) => {
        return {
          ...prev,
          next: res.data.next,
          prev: res.data.previous,
          count: res.data.count,
          resultsCount: res.data.results.length,
          offset: null, // Resetting offset for search results
        };
      });

      const updatedUrl = `${pathname}?${new URLSearchParams({
        contact: selectedContactId !== null ? selectedContactId.toString() : "",
        search: value,
        ...(fixedListParams as unknown as URLSearchParams),
      }).toString()}`;
      navigate(updatedUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    // Clear query parameters
    const updatedUrl = window.location.pathname;
    window.history.pushState({}, "", updatedUrl);
    setSelectedContactId(null);
    loadProducts();
    
  };

  // Initial call to fetch the contacts data
  useEffect(() => {
    handleSearch("");
  }, [selectedContactId]);

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
          <div>
            <SearchInput
              handleSearch={handleSearch}
              contacts={contacts}
              setProducts={setProducts}
              handleReset={handleReset}
              setContacts={setContacts}
              setSelectedContactId={setSelectedContactId}
            />
          </div>
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
