import { logError } from './logger.js';


export const fetch = async (uri: string, options?: {}): Promise<any> => {
    // Optional to log errors elsewhere such as a backend service or a cloud service
    
    try {
        const res = await fetch(uri, options);
        
        if (!res.ok) {
            const error = new Error(`HTTP error! status: ${res.status}`);
            await logError(error, 'request-service');
            throw error;
        }

        return await res.json();
    } catch (error) {
        await logError(error, 'request-service');
        throw error; 
    }
}