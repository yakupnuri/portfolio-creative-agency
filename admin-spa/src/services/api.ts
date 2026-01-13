export const apiService = {
  async get(endpoint: string) {
    const url = `/api${endpoint}`;
    console.log('API GET:', url);
    const r = await fetch(url, { credentials: 'include' });
    console.log('API GET response:', { url, status: r.status, ok: r.ok });
    if (!r.ok) {
      const errorText = await r.text();
      console.error('API GET error:', { url, status: r.status, body: errorText });
      throw new Error(`api_error (status: ${r.status})`);
    }
    return r.json();
  },
  async post(endpoint: string, body: any) {
    const url = `/api${endpoint}`;
    console.log('API POST:', url, body);
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });
    console.log('API POST response:', { url, status: r.status, ok: r.ok });
    if (!r.ok) {
      const errorText = await r.text();
      console.error('API POST error:', { url, status: r.status, body: errorText });
      throw new Error(`api_error (status: ${r.status})`);
    }
    return r.json();
  },
  async patch(endpoint: string, body: any) {
    const url = `/api${endpoint}`;
    console.log('API PATCH:', url, body);
    const r = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });
    console.log('API PATCH response:', { url, status: r.status, ok: r.ok });
    if (!r.ok) {
      const errorText = await r.text();
      console.error('API PATCH error:', { url, status: r.status, body: errorText });
      throw new Error(`api_error (status: ${r.status})`);
    }
    return r.json();
  },
  async delete(endpoint: string) {
    const url = `/api${endpoint}`;
    console.log('API DELETE:', url);
    const r = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    console.log('API DELETE response:', { url, status: r.status, ok: r.ok });
    if (!r.ok) {
      const errorText = await r.text();
      console.error('API DELETE error:', { url, status: r.status, body: errorText });
      throw new Error(`api_error (status: ${r.status})`);
    }
    return r.json();
  }
};
