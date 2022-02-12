import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { bigCommerceSDK } from '../scripts/bcSdk';
import $ from 'jquery';
const SessionContext = createContext({ context: '' });

const SessionProvider = ({ children }) => {
    const { query } = useRouter();
    const [context, setContext] = useState('');

    useEffect(() => {
        if (query.context) {
            setContext(query.context.toString());
            // Keeps app in sync with BC (e.g. heatbeat, user logout, etc)
            bigCommerceSDK(query.context);
            console.log('$(h2)', $('h2'));
            console.log('$(document)', $(document))
            $(document).ready(function() {
                // $('#selector')
                console.log('1Hi !');
                console.log('1$(h2)', $('h2'));
                console.log('1my-custom-id-home', $('#my-custom-id-home'))
            });
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
