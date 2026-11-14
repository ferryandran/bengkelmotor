/* ============================================================
   PEROT MOTOR — Data Layer (Firebase Firestore + localStorage fallback)
   ============================================================
   CARA AKTIFKAN DATABASE (agar booking pelanggan masuk ke admin di perangkat lain):
   1. Buat project di https://console.firebase.google.com
   2. Aktifkan Firestore Database (mode test dulu)
   3. Project settings -> Web app -> copy firebaseConfig
   4. Tempel di bawah (ganti nilai "YOUR_...")
   5. (Opsional) Atur Security Rules & Firebase Auth untuk admin
   Jika config masih placeholder, aplikasi otomatis pakai localStorage (mode demo, satu perangkat).
   ============================================================ */

window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

(function () {
  let db = null;
  let useFirebase = false;

  function init() {
    try {
      if (typeof firebase === 'undefined') return false;
      const cfg = window.FIREBASE_CONFIG;
      if (!cfg || !cfg.apiKey || cfg.apiKey === 'YOUR_API_KEY') return false;
      if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(cfg);
      db = firebase.firestore();
      useFirebase = true;
      console.log('[PEROT] Mode: Firebase Firestore (real-time, multi-device)');
      return true;
    } catch (e) {
      console.warn('[PEROT] Firebase gagal, fallback localStorage:', e);
      useFirebase = false;
      return false;
    }
  }

  init();

  window.PEROT_DB = {
    isFirebase: function () { return useFirebase; },

    // ---------- BOOKINGS ----------
    async saveBooking(data) {
      const payload = Object.assign({}, data);
      if (!payload.createdAt) payload.createdAt = new Date().toISOString();
      if (!payload.status) payload.status = 'Menunggu';
      if (useFirebase) {
        const ref = await db.collection('bookings').add(payload);
        return ref.id;
      }
      if (!payload.id) payload.id = Date.now();
      const list = JSON.parse(localStorage.getItem('perot_bookings') || '[]');
      list.push(payload);
      localStorage.setItem('perot_bookings', JSON.stringify(list));
      try { localStorage.setItem('perot_bookings__ping', String(Date.now())); } catch (e) {}
      return payload.id;
    },

    listenBookings(callback) {
      if (useFirebase) {
        return db.collection('bookings').orderBy('createdAt', 'desc').onSnapshot(
          function (snap) {
            const list = snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
            callback(list);
          },
          function (err) { console.error('listenBookings error', err); callback([]); }
        );
      }
      const emit = function () { callback(JSON.parse(localStorage.getItem('perot_bookings') || '[]')); };
      emit();
      const handler = function (e) {
        if (e.key === 'perot_bookings' || e.key === 'perot_bookings__ping') emit();
      };
      window.addEventListener('storage', handler);
      const interval = setInterval(emit, 2000);
      return function () { window.removeEventListener('storage', handler); clearInterval(interval); };
    },

    async updateBookingStatus(id, status) {
      if (useFirebase) {
        await db.collection('bookings').doc(String(id)).update({ status: status });
        return;
      }
      const list = JSON.parse(localStorage.getItem('perot_bookings') || '[]');
      const b = list.find(function (x) { return String(x.id) === String(id); });
      if (b) b.status = status;
      localStorage.setItem('perot_bookings', JSON.stringify(list));
      try { localStorage.setItem('perot_bookings__ping', String(Date.now())); } catch (e) {}
    },

    async deleteBooking(id) {
      if (useFirebase) {
        await db.collection('bookings').doc(String(id)).delete();
        return;
      }
      const list = JSON.parse(localStorage.getItem('perot_bookings') || '[]').filter(function (x) { return String(x.id) !== String(id); });
      localStorage.setItem('perot_bookings', JSON.stringify(list));
      try { localStorage.setItem('perot_bookings__ping', String(Date.now())); } catch (e) {}
    },

    // ---------- SPAREPARTS ----------
    async saveSparepart(data) {
      const payload = Object.assign({}, data);
      if (useFirebase) {
        const ref = await db.collection('spareparts').add(payload);
        return ref.id;
      }
      if (!payload.id) payload.id = Date.now();
      const list = JSON.parse(localStorage.getItem('perot_spareparts') || '[]');
      list.push(payload);
      localStorage.setItem('perot_spareparts', JSON.stringify(list));
      try { localStorage.setItem('perot_spareparts__ping', String(Date.now())); } catch (e) {}
      return payload.id;
    },

    listenSpareparts(callback) {
      if (useFirebase) {
        return db.collection('spareparts').orderBy('nama').onSnapshot(
          function (snap) {
            const list = snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
            callback(list);
          },
          function (err) { console.error('listenSpareparts error', err); callback([]); }
        );
      }
      const emit = function () { callback(JSON.parse(localStorage.getItem('perot_spareparts') || '[]')); };
      emit();
      const handler = function (e) {
        if (e.key === 'perot_spareparts' || e.key === 'perot_spareparts__ping') emit();
      };
      window.addEventListener('storage', handler);
      const interval = setInterval(emit, 2000);
      return function () { window.removeEventListener('storage', handler); clearInterval(interval); };
    },

    async deleteSparepart(id) {
      if (useFirebase) {
        await db.collection('spareparts').doc(String(id)).delete();
        return;
      }
      const list = JSON.parse(localStorage.getItem('perot_spareparts') || '[]').filter(function (x) { return String(x.id) !== String(id); });
      localStorage.setItem('perot_spareparts', JSON.stringify(list));
      try { localStorage.setItem('perot_spareparts__ping', String(Date.now())); } catch (e) {}
    }
  };

  window.PEROT_USE_FIREBASE = useFirebase;
})();
