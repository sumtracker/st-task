import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { listContacts } from '../../services/contact';
import { listProducts } from '../../services/products';
import { useNavigate } from 'react-router-dom';
import { AutoComplete } from 'antd';
import { Contact, PaginateDataType, ProductSearchprops } from '../../interface/common';


const ProductSearch = (props: ProductSearchprops) => {
  const { loadProducts, setProducts, setPagination, pagination, contactId } = props
  const [options, setOptions] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMoreContacts, setLoadingMoreContacts] = useState<boolean>(false);
  const [idMapping, setIdMapping] = useState<Record<string, number>>({});
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!contactId) {
      if (searchTerm !== '') {
        loadContacts();
      } else {
        //to fetch all contacts if no search term
        loadContacts();
      }
    } else {
      onSelect(contactId)
    }

  }, [searchTerm]);

  const loadContacts = async (url?: string) => {
    if (loadingMoreContacts) return; //to prevent multiple concurrent loads
    setLoadingMoreContacts(true);
    try {
      const res = await (url ? axios.get(url) : listContacts({ query: { search: searchTerm } }));
      const newContacts: Contact[] = res.data.results.map((contact: any) => ({
        value: contact.company_name,
        label: contact.company_name,
        id: contact.id,
      }));

      if (url) {
        setOptions(prevOptions => [...prevOptions, ...newContacts]);
      } else {
        setOptions(newContacts);
      }
      const newIdMapping = newContacts.reduce((acc, contact) => {
        acc[contact.label] = contact.id;
        return acc;
      }, url ? { ...idMapping } : {});

      setIdMapping(newIdMapping);
      setNextPageUrl(res.data.next); // Update the URL for the next set of contacts
    } catch (err) {
      console.error(err);
    }
    setLoadingMoreContacts(false);
  };

  const onSelect = async (value: string) => {
    setLoading(true);
    try {
      let contactUniqueId;
      if (contactId) {
        contactUniqueId = contactId;//exact page of the table is loaded when the user pastes the url of the app in the browser in a new tab
      } else {
        contactUniqueId = idMapping[value];
      }
      if (contactUniqueId) {
        const encodedContactId = encodeURIComponent(contactUniqueId);
        const queryParams = { contact: encodedContactId, paginate: 'True' };
        const response = await listProducts({ query: queryParams });
        setProducts(response.data.results);
        setPagination((prev: PaginateDataType) => ({
          ...prev,
          next: response.data.next,
          prev: response.data.previous,
          count: response.data.count,
          resultsCount: response.data.results.length,
        }
        ));
        const queryParamsUrl = new URLSearchParams({
          paginate: 'True',
          limit: String(pagination.limit),
          offset: String(pagination.offset),
          contact: encodedContactId
        }).toString();
        navigate(`/products?${queryParamsUrl}`);
      } else {
        console.error("No ID found for selected value:", value);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const resetSearch = () => {
    setSearchTerm('');
    setOptions([]);
    loadProducts();
    navigate('/products');
  };
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    if (isBottom && nextPageUrl) {
      loadContacts(nextPageUrl);
    }
  };
  return (
    <div style={{ display: 'flex', gap: '10px' }}>

      <AutoComplete
        dropdownMatchSelectWidth={252}
        style={{ width: 300 }}
        options={options.map(option => ({ value: option.label }))}
        size="large"
        onSelect={onSelect}
        onSearch={value => setSearchTerm(value)}
        placeholder="Search by Name/SKU"
        value={searchTerm}
        onPopupScroll={handleScroll} //added this line to handle scroll
      />
      <button onClick={resetSearch}>Reset</button>
    </div>
  )
}

export default ProductSearch