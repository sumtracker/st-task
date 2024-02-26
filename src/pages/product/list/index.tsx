import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import FilterContactInput from "./components/filtercontact.input";
import Heading from "../../../components/heading/basic.heading";
import Pagination from "../../../components/pagination/basic.pagination";
import ProductsTable from "./components/products.table";
import ResultString from "../../../components/content/result.content";
import { PAGINATION_LIMIT, FIXED_LIST_PARAMS } from "../../../constants/app.constants";
import { PaginateDataType, UrlType } from "../../../interface/common";
import { getQueryFromUrl } from "../../../utils/common.utils";
import { listProducts } from "../../../services/products";

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
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    // Parsing the search params and loading the products
    const params: Record<string, string> = {};
    searchParams.forEach((value: string, key: string) => {
      params[key] = value;
    });
    if (Object.keys(params).length === 0) {
      loadProducts();
    } else {
      loadProducts(params);
    }
  };

  const loadProducts = async (queryParams?: Record<string, any>) => {
    let query = queryParams || {};
    setLoding(true);
    try {
      const res = await listProducts({
        query: { ...FIXED_LIST_PARAMS, ...query },
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

  const handleNext = (next: UrlType) => {
    if (next === null) {
      return;
    }
    let query = getQueryFromUrl(next);
    const { contact, limit, offset, pagination } = query;
    setSearchParams({
      contact: contact ? contact : "",
      limit: limit,
      offset: offset,
      pagination: pagination,
    });
    loadProducts(query);
  };

  const handlePrev = (prev: UrlType) => {
    if (prev === null) {
      return;
    }
    let query = getQueryFromUrl(prev);
    const { contact, limit, offset, pagination } = query;
    setSearchParams({
      contact: contact ? contact : "",
      limit: limit,
      offset: offset ? offset : "",
      pagination: pagination,
    });
    loadProducts(query);
  };
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
          <FilterContactInput loadProducts={loadProducts} />
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
              <ResultString loading={loading} pagination={pagination} pageString={"product"} />
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
