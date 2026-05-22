// ================================================
// AYUSHMAN PATIENT MGMT — auth.js
// ================================================

(function () {

  const _auth = window._fbAuth;
  const _db = window._fbDb;

  // ─────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────

  async function registerUser({
    name,
    email,
    password,
    phone,
    clinic,
    city,
    specialisation
  }) {

    try {

      const cred =
        await _auth.createUserWithEmailAndPassword(
          email.trim(),
          password
        );

      await _db.collection('users')
        .doc(cred.user.uid)
        .set({
          uid: cred.user.uid,
          name,
          email: email.toLowerCase().trim(),
          phone,
          clinic,
          city,
          specialisation,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      return { ok: true };

    } catch (e) {

      const MAP = {
        'auth/email-already-in-use':
          'Email already registered.',

        'auth/weak-password':
          'Password should be minimum 6 characters.',

        'auth/invalid-email':
          'Invalid email address.',

        'auth/network-request-failed':
          'Internet connection problem.'
      };

      return {
        ok: false,
        error: MAP[e.code] || e.message
      };
    }
  }

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────

  async function loginUser(email, password) {

    try {

      await _auth.signInWithEmailAndPassword(
        email.trim().toLowerCase(),
        password
      );

      return { ok: true };

    } catch (e) {

      const MAP = {

        'auth/user-not-found':
          'No user found.',

        'auth/wrong-password':
          'Wrong password.',

        'auth/invalid-credential':
          'Invalid email or password.',

        'auth/invalid-email':
          'Invalid email address.',

        'auth/too-many-requests':
          'Too many attempts. Try later.',

        'auth/network-request-failed':
          'Internet connection error.'
      };

      return {
        ok: false,
        error: MAP[e.code] || 'Login failed.'
      };
    }
  }

  // ─────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────

  async function logout() {

    await _auth.signOut();

    window.location.href = "login.html";
  }

  // ─────────────────────────────────────────────
  // GET CURRENT USER
  // ─────────────────────────────────────────────

  function getSession() {
    return _auth.currentUser;
  }

  // ─────────────────────────────────────────────
  // GET USER PROFILE
  // ─────────────────────────────────────────────

  async function getUserProfile(uid) {

    try {

      const snap =
        await _db.collection('users')
          .doc(uid)
          .get();

      if (snap.exists) {
        return snap.data();
      }

      return null;

    } catch (err) {

      return null;
    }
  }

  // ─────────────────────────────────────────────
  // REQUIRE LOGIN
  // ─────────────────────────────────────────────

  function requireAuth(callback) {

    _auth.onAuthStateChanged(async (user) => {

      if (!user) {

        window.location.href = "login.html";
        return;
      }

      const profile =
        await getUserProfile(user.uid);

      callback({
        uid: user.uid,
        email: user.email,
        ...profile
      });
    });
  }

  // ─────────────────────────────────────────────
  // REQUIRE GUEST
  // ─────────────────────────────────────────────

  function requireGuest() {

    _auth.onAuthStateChanged((user) => {

      if (user) {

        window.location.href = "index.html";
      }
    });
  }

  // ─────────────────────────────────────────────
  // EXPORT GLOBAL
  // ─────────────────────────────────────────────

  window.Auth = {
    registerUser,
    loginUser,
    logout,
    requireAuth,
    requireGuest,
    getSession,
    getUserProfile
  };

})();
