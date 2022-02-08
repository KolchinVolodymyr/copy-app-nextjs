import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export default async function importProducts(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash);
        console.log("sdsdsdsdsd")
        const { data , token} = await bigcommerce.get('/catalog/products?include=variants');
        res.status(201).json({data, token:'xzxzxzxzx'});
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
