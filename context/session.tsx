import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { bigCommerceSDK } from '../scripts/bcSdk';
import $ from 'jquery';
const SessionContext = createContext({ context: '' });

const SessionProvider = ({ children }) => {
    const { query } = useRouter();
    const [context, setContext] = useState('');
    // console.log('3$(h2)', $('h2'));

    if (typeof window === "undefined") {
        console.log('window === "undefined"')
    } else  {
        console.log('window !== "undefined"')
    }

    if (typeof document === "undefined") {
        console.log('document === "undefined"')
    } else  {
        console.log('document !== "undefined"')
    }
    useEffect(() => {
        if (query.context) {
            setContext(query.context.toString());
            // Keeps app in sync with BC (e.g. heatbeat, user logout, etc)
            bigCommerceSDK(query.context);
            console.log('1$(h2)', $('h2'));
            console.log('1$(document)', $(document)[0])
            $(document).ready(function() {
                // $('#selector')
                console.log('1Hi !');
                console.log('1$(h2)', $('h2'));
                console.log('1my-custom-id-home', $('#my-custom-id-home'))
            });

            if (typeof document === "undefined") {
                console.log('22document === "undefined"')
            } else  {
                console.log('22document !== "undefined"')
            }
        }
    }, [query.context]);

    return (
        <SessionContext.Provider value={{ context }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

export default SessionProvider;
