import useSWR from 'swr';
import { useSession } from '../context/session';
import { ErrorProps, ListItem, Order, QueryParams, ShippingAndProductsInfo } from '../types';
import $ from 'jquery';
// import cron from 'jquery-cron';
// import Script from 'next/script'

async function fetcher(url: string, query: string) {
    const res = await fetch(`${url}?${query}`);

    // If the status code is not in the range 200-299, throw an error
    if (!res.ok) {
        const { message } = await res.json();
        const error: ErrorProps = new Error(message || 'An error occurred while fetching the data.');
        error.status = res.status; // e.g. 500
        throw error;
    }

    return res.json();
}

// Reusable SWR hooks
// https://swr.vercel.app/
export function useProducts() {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();
    // Request is deduped and cached; Can be shared across components
    const { data, error } = useSWR(context ? ['/api/products', params] : null, fetcher);

    return {
        summary: data,
        isLoading: !data && !error,
        error,
    };
}

export function useProductList(query?: QueryParams) {
    const { context } = useSession();
    const params = new URLSearchParams({ ...query, context }).toString();

    // Use an array to send multiple arguments to fetcher
    const { data, error, mutate: mutateList } = useSWR(context ? ['/api/products/list', params] : null, fetcher);

    return {
        list: data?.data,
        meta: data?.meta,
        isLoading: !data && !error,
        error,
        mutateList,
    };
}

export function useProductListAll(query?: QueryParams) {
    const { context } = useSession();
    const params = new URLSearchParams({ ...query, context }).toString();

    // Use an array to send multiple arguments to fetcher
    const { data, error, mutate: mutateList } = useSWR(context ? ['/api/import-products', params] : null, fetcher);
    // if (typeof window === "undefined") {
    //     console.log('window === "undefined"')
    // } else {
    //     console.log('window !== "undefined"')
    //     console.log('$',  $);
    //     console.log('my-custom-id', $('#my-custom-id'));
    //     console.log('my-custom-id-home', $('#my-custom-id-home'));
    // }

    if (typeof document === "undefined") {
        console.log('document === "undefined"')
    } else {
        console.log('document', $(document));
        // console.log('cron', cron);
        console.log('document !== "undefined"');
        console.log('$',  $);
        console.log('my-custom-id', $('#my-custom-id'));
        $(document).ready(function() {
           console.log('ready' )
            console.log('ready - my-custom-id', $('#my-custom-id'));
            // $('#my-custom-id').cron();
            // $('#selector').cron(); // apply cron with default options
        });
    }

    // console.log('data.accessToken', data.accessToken);
    // console.log('query', query);
    // console.log('context', context);
    // console.log('params', params);
    // console.log('process.env CLIENT_ID', process.env.CLIENT_ID);
    // console.log('process.env CLIENT_SECRET:', process.env.CLIENT_SECRET);
    // console.log('process.env AUTH_CALLBACK:', process.env.AUTH_CALLBACK);
    return {
        list: data?.data,
        meta: data?.data?.meta,
        isLoading: !data?.data && !error,
        error,
        mutateList,
        data: data
    };
}

export function useProductInfo(pid: number, list: ListItem[]) {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();
    const product = list.find(item => item.id === pid);
    // Conditionally fetch product if it doesn't exist in the list (e.g. deep linking)
    const { data, error } = useSWR(!product && context ? [`/api/products/${pid}`, params] : null, fetcher);

    return {
        product: product ?? data,
        isLoading: product ? false : (!data && !error),
        error,
    };
}

export const useOrder = (orderId: number) => {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();
    const shouldFetch = context && orderId !== undefined;

    // Conditionally fetch orderId is defined
    const { data, error } = useSWR<Order, ErrorProps>(shouldFetch ? [`/api/orders/${orderId}`, params] : null, fetcher);

    return {
        order: data,
        isLoading: !data && !error,
        error,
    };
}

export const useShippingAndProductsInfo = (orderId: number) => {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();
    const shouldFetch = context && orderId !== undefined;

    // Shipping addresses and products are not included in the order data and need to be fetched separately
    const { data, error } = useSWR<ShippingAndProductsInfo, ErrorProps>(
        shouldFetch ? [`/api/orders/${orderId}/shipping_products`, params] : null, fetcher
    );

    return {
        order: data,
        isLoading: !data && !error,
        error,
    };
}
