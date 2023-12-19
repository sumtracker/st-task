//* Packages Imports */
import { useCallback, useEffect, useRef, useState } from "react";
import { AutoComplete, Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

//* Services Imports */
import { listProducts } from "../../services/products";
import { listContacts } from "../../services/contacts";
import { debounce } from "../../middleware/debounce";

//* Types Imports */
import {
  ContactsType,
  ProductsType,
  SearchInputProps,
} from "../../interface/common";

const SearchInput = ({
  handleSearch,
  contacts,
  setProducts,
  setContacts,
  handleReset,
  setSelectedContactId,
}: SearchInputProps) => {
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const inputRef = useRef<null | HTMLInputElement | any>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const renderOption = (contact: ContactsType) => {
    // Check if company_name is not empty or ""
    if (contact.company_name && contact.company_name.trim() !== "") {
      return {
        value: contact.company_name,
        label: <div key={contact.id}>{contact.company_name}</div>,
      };
    }
    return null;
  };

  const debouncedHandleSearch = useCallback(
    debounce((term: string) => handleSearch(term), 300),
    [handleSearch]
  );

  const onSearchChange = (value: string) => {
    debouncedHandleSearch(value);
  };

  //* Select Contact Handler from Search Dropdown
  const onSelect = async (value: string) => {
    const selectedContact = contacts.find(
      (contact: ContactsType) => contact.company_name === value
    );

    if (selectedContact) {
      setSelectedContactId(selectedContact.id);

      await listProducts({
        query: { contact: selectedContact.id, paginate: true },
      }).then((res: { data: { results: ProductsType[] } }) => {
        setProducts(res.data.results);
      });
    }
  };

  //* Load all contacts Handler using Observer
  const loadMoreContacts = async () => {
    if (loadingMore || !contacts.length || !inputRef.current) return;

    setLoadingMore(true);

    try {
      const res = await listContacts({
        query: {
          limit: 25, // Set your desired limit
          offset: contacts.length,
        },
      });

      const newContacts = res.data.results;

      setContacts((prevContacts: ContactsType[]) => {
        const contactSet = new Set([...prevContacts, ...newContacts]);
        return [...(contactSet as unknown as ContactsType[])];
      });

      if (res.data.next) {
        inputRef.current.blur(); // Blur to close the dropdown temporarily
        inputRef.current.focus(); // Refocus to open the dropdown with updated options
        observerRef.current?.observe(inputRef.current as Element);
      } else {
        setHasMore(false);
        // If there is no next URL, stop observing
        observerRef.current?.unobserve(inputRef.current as Element);
      }
    } catch (error) {
      console.error("Error fetching more contacts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  //* Observer for Dropdown changes
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMoreContacts();
          }
        });
      },
      { threshold: 0.5 } // Adjust threshold as needed
    );

    if (inputRef.current && inputRef.current instanceof Element) {
      observerRef.current.observe(inputRef.current);
    }

    return () => {
      if (
        observerRef.current &&
        inputRef.current &&
        inputRef.current instanceof Element
      ) {
        observerRef.current.unobserve(inputRef.current);
      }
    };
  }, [contacts, inputRef, observerRef]);

  return (
    <Space style={{ padding: "10px 0px" }}>
      <AutoComplete
        style={{ width: 400 }}
        onSearch={onSearchChange}
        options={
          contacts
            .map((contact: ContactsType) => renderOption(contact))
            .filter(Boolean) as unknown as ContactsType[]
        }
        placeholder="Search by Name/SKU"
        onSelect={onSelect}
        onDropdownVisibleChange={(visible) => {
          if (visible && hasMore) {
            loadMoreContacts();
          }
        }}
        notFoundContent={loadingMore ? "Loading..." : null}
        filterOption={false}
        dropdownRender={(menu) => (
          <div>
            {menu}
            {loadingMore && (
              <div style={{ textAlign: "center" }}>Loading...</div>
            )}
          </div>
        )}
        ref={inputRef}
      >
        <Input suffix={<SearchOutlined style={{ color: "#ccc" }} />} />
      </AutoComplete>
      <Button onClick={handleReset}>Reset</Button>
    </Space>
  );
};

export default SearchInput;
