/**
 * Tiny API wrapper. All backend URLs live here.
 * Supports both HTTP-only cookies AND Bearer token fallback so cross-domain
 * deployments (e.g. Cloudflare Pages/Workers + Render) never fail with 401 Unauthorized.
 */
const rawApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const BASE = rawApiUrl ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`) : '/api';

const TOKEN_KEY = 'hw_admin_token';

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

function clearProductsCache() {
  try {
    localStorage.removeItem('hw_products_cache');
    localStorage.removeItem('hw_products_cache_v2');
    localStorage.removeItem('hw_products_cache_v3');
  } catch {}
}

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = { 'X-Requested-With': 'harwest-admin' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  let payload;
  if (form) payload = form;
  else if (body) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(BASE + path, { method, headers, body: payload, credentials: 'include' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
  return data;
}

export const api = {
  // --- Health / Status ---
  health: () => request('/health'),

  // --- Website Visits & Analytics ---
  recordVisit: (path = '/', isNewVisit = false) => {
    let tz = '';
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {}
    return request('/analytics/visit', {
      method: 'POST',
      body: { path, tz, isNewVisit: Boolean(isNewVisit) },
    });
  },
  getAnalyticsSummary: () => request('/analytics/summary'),
  resetAnalytics: () => request('/analytics/reset', { method: 'DELETE' }),

  // --- Auth ---
  login: async (email, password) => {
    const data = await request('/auth/login', { method: 'POST', body: { email, password } });
    if (data?.token) setToken(data.token);
    return data;
  },
  logout: async () => {
    try {
      return await request('/auth/logout', { method: 'POST' });
    } finally {
      setToken('');
    }
  },
  me: () => request('/auth/me'),
  changePassword: async (currentPassword, newPassword) => {
    const data = await request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } });
    if (data?.token) setToken(data.token);
    return data;
  },

  // --- Media & Branding Overrides ---
  getMedia: () => request('/media'),
  setMedia: (key, url) => request(`/media/${encodeURIComponent(key)}`, { method: 'PUT', body: { url } }),
  resetMedia: (key) => request(`/media/${encodeURIComponent(key)}`, { method: 'DELETE' }),
  upload: (file, onProgress) =>
    new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('file', file);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', BASE + '/media/upload');
      xhr.withCredentials = true;
      xhr.setRequestHeader('X-Requested-With', 'harwest-admin');
      const token = getToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        let data = {};
        try { data = JSON.parse(xhr.responseText); } catch { /* ignore */ }
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(Object.assign(new Error(data.error || 'Upload failed'), { status: xhr.status }));
      };
      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(form);
    }),

  // --- Enquiries (Contact Form Submissions) ---
  submitEnquiry: (data) => request('/enquiries', { method: 'POST', body: data }),
  getEnquiries: (status) => request(status ? `/enquiries?status=${status}` : '/enquiries'),
  updateEnquiryStatus: (id, status) => request(`/enquiries/${id}`, { method: 'PATCH', body: { status } }),
  deleteEnquiry: (id) => request(`/enquiries/${id}`, { method: 'DELETE' }),

  // --- Products (fixed catalogue: public fetch + admin detail updates only) ---
  getProducts: () => request('/products'),
  getAllProducts: () => request('/products/all'),
  updateProduct: async (id, data) => {
    const res = await request(`/products/${id}`, { method: 'PUT', body: data });
    clearProductsCache();
    return res;
  },

  // --- Infrastructure (Pollachi Facilities Gallery: Admin CRUD + Public Fetch) ---
  getInfrastructure: () => request('/infrastructure'),
  getAllInfrastructure: () => request('/infrastructure/all'),
  createInfrastructure: (data) => request('/infrastructure', { method: 'POST', body: data }),
  updateInfrastructure: (id, data) => request(`/infrastructure/${id}`, { method: 'PUT', body: data }),
  deleteInfrastructure: (id) => request(`/infrastructure/${id}`, { method: 'DELETE' }),

  // --- Blog Posts (Admin CRUD + Public Fetch) ---
  getBlogs: (category, search) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    const qs = params.toString();
    return request(qs ? `/blogs?${qs}` : '/blogs');
  },
  getBlogBySlug: (slug) => request(`/blogs/${slug}`),
  createBlog: (data) => request('/blogs', { method: 'POST', body: data }),
  updateBlog: (id, data) => request(`/blogs/${id}`, { method: 'PUT', body: data }),
  deleteBlog: (id) => request(`/blogs/${id}`, { method: 'DELETE' }),

  // --- FAQs (Admin CRUD + Public Fetch) ---
  getFaqs: () => request('/faqs'),
  createFaq: (data) => request('/faqs', { method: 'POST', body: data }),
  updateFaq: (id, data) => request(`/faqs/${id}`, { method: 'PUT', body: data }),
  deleteFaq: (id) => request(`/faqs/${id}`, { method: 'DELETE' }),
};
