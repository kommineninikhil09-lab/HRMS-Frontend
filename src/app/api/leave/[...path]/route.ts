import { createBackendProxyRoute } from '@/lib/api/proxy';

// Browser → /api/leave/... → proxyToBackend() → NestJS /leave/...
export const { GET, POST, PUT } = createBackendProxyRoute('leave');
