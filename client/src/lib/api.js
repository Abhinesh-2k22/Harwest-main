/**
 * Tiny API wrapper. All backend URLs live here.
 * In development, Vite proxies /api to http://localhost:5000.
 * In production on Vercel, VITE_API_URL or same-domain proxy can be used.
 */
const rawApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const BASE = rawApiUrl ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`) : '/api';

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = { 'X-Requested-With': 'harwest-admin' };
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

  // --- Auth ---
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),

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
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: data }),

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
