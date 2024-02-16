import { FC, useEffect, useState } from "react";
import ResultString from "../../../components/content/result.content";
import Heading from "../../../components/heading/basic.heading";
import Pagination from "../../../components/pagination/basic.pagination";
import { PAGINATION_LIMIT } from "../../../constants/app.constants";
import { PaginateDataType, UrlType } from "../../../interface/common";
import { listProducts } from "../../../services/products";
import { getQueryFromUrl } from "../../../utils/common.utils";
import ProductsTable from "./components/products.table";
import ProductSearch from "../../../components/ProductSearch/ProductSearch";
import { useLocation } from "react-router-dom";

const fixedListParams = {
    paginate: true
}

const ProductList: FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginateDataType>({
        next: null,
        prev: null,
        count: null,
        resultsCount: 0,
        offset: null,
        hasOffset: true,
        limit: PAGINATION_LIMIT
    });
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const contactId = searchParams.get('contact');

    useEffect(() => {
        if (!contactId)
            loadProducts();
    }, []);

    //code if api provided for getting search params from cotact id
    // useEffect(() => {
    //     //parse the URL query parameters
    //     const searchParams = new URLSearchParams(location.search);
    //     const contactId = searchParams.get('contact');
    //     const paginate = searchParams.get('paginate') === 'True';
    //     const limit = searchParams.get('limit');
    //     const offset = searchParams.get('offset');

    //     //if there is a contact in the URL, convert it to a search term
    //     if (contactId) {
    //         //there is no api provided to get the value of search value(searchTerm) from the contact id
    //         //if it was given i could use it to showcase and save the value in searchTerm and call the onSelect to show the products 
    //         setSearchTerm(contactId);//need searchTerm here
    //     }

    //     // Load contacts if needed
    //     if (!searchTerm) {
    //         loadContacts();
    //     }
    // }, [location.search]);

    const loadProducts = async (queryParams?: Record<string, any>) => {
        let query = queryParams || {};
        setLoading(true);
        try {
            const res = await listProducts({
                query: { ...fixedListParams, ...query }
            });

            setProducts(res.data.results);
            setPagination(prev => ({
                ...prev,
                next: res.data.next,
                prev: res.data.previous,
                count: res.data.count,
                resultsCount: res.data.results.length,
                offset: query?.offset ? Number(query.offset) : null,
                }
            ));            
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    const handleNext = (next: UrlType) => {
        if (next === null) {
            return;
        }
        let query = getQueryFromUrl(next);
        loadProducts(query);
    }

    const handlePrev = (prev: UrlType) => {
        if (prev === null) {
            return;
        }
        let query = getQueryFromUrl(prev);
        loadProducts(query);
    }

    return (
        <>
            <div style={{ marginBottom: '1rem' }}>
                <Heading
                    titleLevel={2}
                >
                    Products
                </Heading>
            </div>
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '0.5rem',
                }}
            >
                <ProductSearch loadProducts={loadProducts} setProducts={setProducts} setPagination={setPagination} pagination={pagination} contactId={contactId}/>
                <div style={{ marginBottom: '1rem' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <ResultString
                                loading={loading}
                                pagination={pagination}
                                pageString={'product'}
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
                <div style={{ marginBottom: '1rem' }}>
                    <ProductsTable
                        list={products}
                        loading={loading}
                    />
                </div>
                <div>
                    <Pagination
                        next={pagination.next}
                        prev={pagination.prev}
                    />
                </div>
            </div>
        </>)
}

export default ProductList;