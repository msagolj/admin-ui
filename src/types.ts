export interface RequestDetails {
  url: string;
  method: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: any;
}

export const ADMIN_API_BASE = 'https://admin.hlx.page';
