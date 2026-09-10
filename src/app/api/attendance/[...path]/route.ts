import { createBackendProxyRoute } from '@/lib/api/proxy';

// Browser → /api/attendance/... → proxyToBackend() → NestJS /attendance/...
export const { GET, POST } = createBackendProxyRoute('attendance');
