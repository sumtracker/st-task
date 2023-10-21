import React, { useState } from "react";
import { AutoComplete, Button, Input } from "antd";
import type { SelectProps } from "antd/es/select";
import { listContacts } from "../../../../services/contacts";
import { useSearchParams } from "react-router-dom";

export interface ContactInfo {
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
}

const searchResult = async (q: string) => {
  const query: Record<string, any> = {
    paginate: true,
  };
  if (q) query["search"] = q;

  const response = await listContacts({
    query: query,
  });

  if (!response.data || !response.data.results) return [];

  return response.data.results.map((data: ContactInfo) => {
    return {
      value: `${data.id}:${data.company_name}`,
      label: (
        <div
          key={data.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {data.company_name}
        </div>
      ),
    };
  });
};

const ContactFilter: React.FC<{
  loadProducts: (queryParams?: Record<string, any>) => Promise<void>;
}> = ({ loadProducts }) => {
  const [input, setInput] = useState<string>();
  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = async (value: string) => {
    const data = await searchResult(value);
    setOptions(data || []);
  };

  const onSelect = (value: string) => {
    const [id, company_name] = value.split(":");
    setInput(company_name);
    setSearchParams({ contact: id });

    loadProducts({ contact: id });
  };

  const handleReset = async () => {
    setSearchParams({});
    setInput("");
    await loadProducts();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <AutoComplete
        style={{ width: 500 }}
        allowClear
        options={options}
        onSelect={onSelect}
        onSearch={handleSearch}
        onFocus={() => handleSearch("")}
        onClear={() => setInput("")}
        size="large"
        value={input}
      >
        <Input
          size="large"
          placeholder="Search by Name/SKU"
          value={input}
          onChange={({ target }) => setInput(target.value)}
        />
      </AutoComplete>

      <Button style={{ height: 37 }} onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
};

export default ContactFilter;
