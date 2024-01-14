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
import TypeaheadUI from "./typeahead.ui";

type Typehead = {
  loadContacts: (
    token: any,
    queryParams?: Record<string, any>
  ) => Promise<void>;
  contacts: any[];
  loading: boolean;
  contactPagination: ContactsPaginationType;
  loadProducts: (queryParams?: Record<string, any>) => Promise<void>;
  queryParams: URLSearchParams;
};

const Typehead: FC<Typehead> = ({
  loadContacts,
  contacts,
  loading,
  contactPagination,
  loadProducts,
  queryParams,
}) => {
  const [query, setQuery] = useState<string | undefined>(""); // value of search box
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const cancelTokenSource = axios.CancelToken.source();
  const containerRef = useRef(null);
  const [contactsList, setContactsList] = useState<any>([]);
  const [contactsListPagination, setContactsListPagination] = useState<any>({
    next: null,
    prev: null,
  });
  const navigate = useNavigate();
  const location = useLocation();

  // function to set serach query
  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setQuery(query);
  };

  const handleFetchContacts = async (query: any) => {
    await loadContacts(cancelTokenSource.token, query);
  };

  const handleFocus = (focus: boolean) => {
    setInputFocused(focus);
    if (focus) handleFetchContacts(query ? { search: query } : null); // get all the contact when focused to input element
  };

  const handlefetchMore = async () => {
    console.log("object");
    try {
      const query = getQueryFromUrl(contactsListPagination.next);
      const res = await listContacts({
        query: { ...query },
        cancelToken: null,
      });
      console.log(res);
      setContactsList([...contactsList, ...res.data.results]);
      setContactsListPagination({
        next: res.data.next,
        prev: res.data.prev,
      });
      // setHasMore(!!res.data.next);
    } catch (err) {
      console.error(err);
    }
  };

  // Callback for the Intersection Observer
  const handleIntersection = (entries: any) => {
    const target = entries[0];
    console.log(target.isIntersecting, contactsListPagination.next);

    if (target.isIntersecting && contactsListPagination.next) {
      // Load more data when the target becomes visible
      handlefetchMore();
    }
  };

  // Set up Intersection Observer when the component mounts
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Trigger callback when 10% of the target is in view
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [contactsListPagination]);

  useEffect(() => {
    // debounce the search API call for 600ms
    const debouceFunc = setTimeout(() => {
      handleFetchContacts(query ? { search: query } : null);
    }, 600);

    return () => {
      clearTimeout(debouceFunc); // clear the previous timeout so that can create new fresh timeout
      cancelTokenSource.cancel(); // cancel the previous API call before sending new API call if previous one is not resolved yet
    };
  }, [query]);

  useEffect(() => {
    setContactsList(contacts);
    setContactsListPagination({ ...contactPagination });
  }, [contacts, contactPagination]);

  const handleContactSelect = (e: MouseEvent) => {
    e.stopPropagation();
    const contact = e.target as HTMLElement;
    const { contactid, value } = contact.dataset;
    if (contactid) {
      queryParams.set("contact", contactid);
      queryParams.set("limit", PAGINATION_LIMIT.toString());
      queryParams.set("offset", "0");
      queryParams.set("paginate", "true");
      loadProducts(getObjectFromURlParams(queryParams));
      setQuery(value);
      //   setInputFocused(false);
      navigate({
        pathname: location.pathname,
        search: queryParams.toString(),
      });
    }
  };

  const handleReset = () => {
    navigate({ pathname: location.pathname });
    loadProducts();
  };

  useEffect(() => {
    const contactWrapper = document.getElementById("contact-wrapper");
    if (contactWrapper) {
      contactWrapper.addEventListener("mousedown", handleContactSelect);
    }
    return () =>
      contactWrapper?.removeEventListener("mousedown", handleContactSelect);
  }, []);

  return (
    <TypeaheadUI
      query={query}
      handleQueryChange={handleQueryChange}
      handleFocus={handleFocus}
      handleReset={handleReset}
      inputFocused={inputFocused}
      contactsList={contactsList}
      contactsListPagination={contactsListPagination}
      containerRef={containerRef}
      loading={loading}
    />
  );
};

export default Typehead;
