import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { ContactsPaginationType } from "../../interface/common";
import axios from "axios";
import { listContacts } from "../../services/contacts";
import {
  getObjectFromURlParams,
  getQueryFromUrl,
} from "../../utils/common.utils";
import { useLocation, useNavigate } from "react-router-dom";
import { PAGINATION_LIMIT } from "../../constants/app.constants";
import { Input, List } from "antd";
import "./typehead.style.css";
import TypeheadlistScroll from "./typeheadlist.scroll";
const { Search } = Input;
type TypeheadProps = {
  onLoad: (token: any, queryParams?: Record<string, any>) => Promise<void>;
  data: any[];
  isLoading: boolean;
  pagination: ContactsPaginationType;
  onLoadProducts: (queryParams?: Record<string, any>) => Promise<void>;
  searchParams: URLSearchParams;
};

const TypeaheadView: FC<TypeheadProps> = ({
  onLoad,
  data,
  isLoading,
  pagination,
  onLoadProducts,
  searchParams,
}) => {
  const [query, setQuery] = useState<string | undefined>("");
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const cancelTokenSource = axios.CancelToken.source();
  const [dataList, setDataList] = useState<any>([]);
  const [paginationData, setPaginationData] = useState<any>({
    next: null,
    prev: null,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
  };

  const fetchData = async (query: any) => {
    await onLoad(cancelTokenSource.token, query);
  };

  const handleFocus = (focus: boolean) => {
    setInputFocused(focus);
    if (focus) fetchData(query ? { search: query } : null);
  };

  const fetchMoreData = async () => {
    try {
      const query = getQueryFromUrl(paginationData.next);
      const res = await listContacts({
        query: { ...query },
        cancelToken: null,
      });
      console.log(res);
      setDataList([...dataList, ...res.data.results]);
      setPaginationData({
        next: res.data.next,
        prev: res.data.prev,
      });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchData(query ? { search: query } : null);
    }, 600);

    return () => {
      clearTimeout(debounceTimer);
      cancelTokenSource.cancel();
    };
  }, [query]);

  useEffect(() => {
    setDataList(data);
    setPaginationData({ ...pagination });
  }, [data, pagination]);

  const handleSelect = (e: MouseEvent) => {
    e.stopPropagation();
    const contact = e.target as HTMLElement;
    const { contactid, value } = contact.dataset;
    if (contactid) {
      const paramsObject = {
        contact: contactid,
        limit: PAGINATION_LIMIT.toString(),
        offset: "0",
        paginate: "true",
      };

      const newSearchParams = new URLSearchParams();
      for (const [key, val] of Object.entries(paramsObject)) {
        newSearchParams.set(key, val);
      }

      onLoadProducts(getObjectFromURlParams(searchParams));
      setQuery(value);
      //   setInputFocused(false);
      navigate({
        pathname: location.pathname,
        search: searchParams.toString(),
      });
    }
  };

  const handleReset = () => {
    navigate({ pathname: location.pathname });
    setQuery("");
    onLoadProducts();
  };

  return (
    <div
      style={{
        width: "35%",
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 9 / 10,
        }}
      >
        <Search
          placeholder="Search contact by name"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => handleFocus(true)}
          onBlur={() => handleFocus(false)}
        />

        {inputFocused ? (
          <TypeheadlistScroll
            onSelectItem={handleSelect}
            hasMoreData={paginationData.next}
            onLoadMore={fetchMoreData}
          >
            <List
              dataSource={dataList}
              renderItem={(item: any) => {
                if (item.company_name)
                  return (
                    <List.Item
                      key={item.id}
                      data-contactid={item.id}
                      data-value={item.company_name}
                    >
                      {item.company_name}
                    </List.Item>
                  );
              }}
              loading={isLoading}
              locale={{ emptyText: "No Data" }}
              id="contacts-list"
            ></List>
          </TypeheadlistScroll>
        ) : null}
      </div>
      <div
        style={{
          outline: "none",
          height: "31.6px",
          backgroundColor: "transparent",
          border: "1px solid #d9d9d9",
          borderRadius: "6px",
          color: "#252525",
          cursor: "pointer",
          padding: "5px 15px",
          flex: 1 / 10,
          textAlign: "center",
        }}
        onClick={handleReset}
      >
        <span>Reset</span>
      </div>
    </div>
  );
};

export default TypeaheadView;
