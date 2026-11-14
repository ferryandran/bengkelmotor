/* ============================================================
   PEROT MOTOR — Data Layer (PHP + MySQL backend)
   ============================================================
   Backend ada di folder /api (PHP). Database MySQL (schema.sql).
   Konfigurasi koneksi DB: api/config.php (DB_HOST, DB_NAME, DB_USER, DB_PASS).
   Jalankan lokal: php -S localhost:8000  (lalu buka http://localhost:8000)
   Deploy: upload semua file ke hosting PHP (cPanel, dll.), buat DB MySQL, import schema.sql.
   ============================================================ */

(function () {
  const API = 'api';

  async function request(url, options) {
    const res = await fetch(url, Object.assign({ headers: { 'Content-Type': 'application/json' } }, options || {}));
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || ('HTTP ' + res.status));
    }
    const ct = res.headers.get('content-type') || '';
    if (ct.indexOf('application/json') !== -1) return res.json();
    return null;
  }

  window.PEROT_DB = {
    isFirebase: function () { return false; },
    isPhp: function () { return true; },
    mode: function () { return 'php'; },

    // ---------- BOOKINGS ----------
    async saveBooking(data) {
      const payload = Object.assign({}, data);
      if (!payload.status) payload.status = 'Menunggu';
      if (!payload.createdAt) payload.createdAt = new Date().toISOString();
      // backend sets created_at itself; keep field harmless
      const res = await request(API + '/bookings.php', { method: 'POST', body: JSON.stringify(payload) });
      return res && res.id ? res.id : Date.now();
    },

    listenBookings(callback) {
      let stopped = false;
      const emit = async function () {
        if (stopped) return;
        try {
          const list = await request(API + '/bookings.php', { method: 'GET' });
          if (!stopped) callback(Array.isArray(list) ? list : []);
        } catch (e) {
          console.error('listenBookings error', e);
          if (!stopped) callback([]);
        }
      };
      emit();
      const interval = setInterval(emit, 2000);
      return function () { stopped = true; clearInterval(interval); };
    },

    async updateBookingStatus(id, status) {
      await request(API + '/bookings.php?id=' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify({ status: status }) });
    },

    async deleteBooking(id) {
      await request(API + '/bookings.php?id=' + encodeURIComponent(id), { method: 'DELETE' });
    },

    // ---------- SPAREPARTS ----------
    async saveSparepart(data) {
      const res = await request(API + '/spareparts.php', { method: 'POST', body: JSON.stringify(data) });
      return res && res.id ? res.id : Date.now();
    },

    listenSpareparts(callback) {
      let stopped = false;
      const emit = async function () {
        if (stopped) return;
        try {
          const list = await request(API + '/spareparts.php', { method: 'GET' });
          if (!stopped) callback(Array.isArray(list) ? list : []);
        } catch (e) {
          console.error('listenSpareparts error', e);
          if (!stopped) callback([]);
        }
      };
      emit();
      const interval = setInterval(emit, 2000);
      return function () { stopped = true; clearInterval(interval); };
    },

    async deleteSparepart(id) {
      await request(API + '/spareparts.php?id=' + encodeURIComponent(id), { method: 'DELETE' });
    }
  };

  window.PEROT_USE_PHP = true;
})();
