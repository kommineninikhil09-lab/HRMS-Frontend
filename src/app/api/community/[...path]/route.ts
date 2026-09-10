import { createBackendProxyRoute } from '@/lib/api/proxy';

// Browser → /api/community/... → proxyToBackend() → NestJS /community/...
export const { GET, POST, PUT, DELETE } = createBackendProxyRoute('community');
