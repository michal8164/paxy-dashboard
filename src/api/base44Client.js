import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = import.meta.env.VITE_USE_MOCK === 'true'
    ? (await import('./mockClient')).createMockClient()
    : createClient({
        appId,
        token,
        functionsVersion,
        serverUrl: '',
        requiresAuth: false,
        appBaseUrl
    });
