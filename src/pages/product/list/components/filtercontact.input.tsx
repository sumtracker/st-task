/**
 * @author Prakhar Richhariya <prakharrichhariya@gmail.com>
 * @description Filter contact input
 */
import React, { useEffect, useState } from "react";
import { Input, AutoComplete, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

import { FIXED_LIST_PARAMS } from "../../../../constants/app.constants";
import { listContacts } from "../../../../services/contacts";
import { UrlType } from "../../../../interface/common";
import { getQueryFromUrl } from "../../../../utils/common.utils";

interface FilterContactInputProps {
  loadProducts: (queryParams?: Record<string, any>) => Promise<void>;
}

const fetchResults = async (
  setData: React.Dispatch<React.SetStateAction<ContactNS.IOptions[]>>,
  setNextURL: React.Dispatch<React.SetStateAction<UrlType | null>>,
  value?: string,
  nextURL?: UrlType,
) => {
  let params = {};
  if (value) {
    // Setting the search parameter
    params = { ...params, search: value };
  }
  if (nextURL) {
    let query = getQueryFromUrl(nextURL);
    const { limit, offset, pagination } = query;
    // Setting the limit, pagination and offset for the next request
    params = { ...params, limit: limit, offset: offset, pagination: pagination };
  }
  const contact = await listContacts({
    // Fetching the contacts
    query: { ...FIXED_LIST_PARAMS, ...params },
  });

  if (!contact.data.results) {
    // Resetting the data when no results are found
    setData([]);
  } else {
    // Mapping the contacts to the options
    const newContacts = contact.data.results.map((contactItem: ContactNS.IContact) => ({
      value: contactItem.id.toString(),
      label: contactItem.company_name,
      key: contactItem.id.toString(),
    }));
    setData((prevData) => {
      const existingKeys = new Set(prevData.map((item) => item.key));
      // Filtering out the new contacts that are already present in the existing data
      const filteredNewContacts = newContacts.filter(
        (newContact: ContactNS.IOptions) => !existingKeys.has(newContact.key),
      );
      // Returning the new data
      return [...prevData, ...filteredNewContacts];
    });
  }
  // Setting the next URL
  setNextURL(contact.data.next);
};

const FilterContactInput: React.FC<FilterContactInputProps> = (props) => {
  const { loadProducts } = props;
  const [data, setData] = useState<ContactNS.IOptions[]>([]);
  const [value, setValue] = useState<string>();
  const [nextURL, setNextURL] = useState<UrlType>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Fetching the initial data
    fetchResults(setData, setNextURL, value);
  }, [value]);

  const handleSearch = (newValue: string) => {
    // Fetching the results when the user types in the search input
    fetchResults(setData, setNextURL, newValue);
  };

  const handleSelect = (selectedValue: string, option: ContactNS.IOptions) => {
    // Setting the search parameter and loading the products
    setSearchParams({ contact: selectedValue, limit: "25", offset: "", pagination: "true", ...searchParams });
    setValue(option.label);
    loadProducts({ contact: selectedValue });
  };

  const handleScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    // Fetching the next results when the user scrolls to the bottom
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      fetchResults(setData, setNextURL, value, nextURL);
    }
  };

  const handleReset = () => {
    // Resetting the search parameter and loading the products
    setValue("");
    setSearchParams({});
    loadProducts();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Setting the input value
    setValue(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
      <AutoComplete
        showSearch
        placeholder={"Search by Name/SKU"}
        suffixIcon={<SearchOutlined />}
        filterOption={true}
        optionFilterProp='label'
        onSearch={handleSearch}
        onSelect={handleSelect}
        options={data}
        onPopupScroll={handleScroll}
        value={value}
        style={{ width: "400px" }}
        dropdownMatchSelectWidth={true}
      >
        <Input onChange={handleInputChange} value={value} />
      </AutoComplete>
      <Button onClick={handleReset}>Reset</Button>
    </div>
  );
};

export default FilterContactInput;
