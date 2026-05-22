// ================================================
// AYUSHMAN PATIENT MGMT — auth.js
// ================================================

(function () {

  const _auth = window._fbAuth;

  const _db = window._fbDb;

  // ============================================
  // REGISTER
  // ============================================

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

      await _db.collection("users")
        .doc(cred.user.uid)
        .set({

          uid: cred.user.uid,

          name,

          email: email.toLowerCase().trim(),

          phone,

          clinic,

          city,

          specialisation,

          createdAt:
            firebase.firestore.FieldValue.serverTimestamp()
        });

      return {
        ok: true
      };

    } catch (e) {

      const MAP = {

        "auth/email-already-in-use":
          "Email already registered.",

        "auth/weak-password":
          "Password must be minimum 6 characters.",

        "auth/invalid-email":
          "Invalid email address.",

        "auth/network-request-failed":
          "Network error."
      };

      return {
        ok: false,
        error: MAP[e.code] || e.message
      };
    }
  }

  // ============================================
  // LOGIN
  // ============================================

  async function loginUser(email, password) {

    try {

      await _auth.signInWithEmailAndPassword(
        email.trim().toLowerCase(),
        password
      );

      return {
        ok: true
      };

    } catch (e) {

      const MAP = {

        "auth/user-not-found":
          "User not found.",

        "auth/wrong-password":
          "Wrong password.",

        "auth/invalid-credential":
          "Invalid email or password.",

        "auth/network-request-failed":
          "Network problem."
      };

      return {
        ok: false,
        error: MAP[e.code] || "Login failed."
      };
    }
  }

  // ============================================
  // LOGOUT
  // ============================================

  async function logout() {

    await _auth.signOut();

    window.location.href = "login.html";
  }

  // ============================================
  // REQUIRE AUTH
  // ============================================

  function requireAuth(callback) {

    _auth.onAuthStateChanged(async (user) => {

      if (!user) {

        window.location.href = "login.html";

        return;
      }

      const snap =
        await _db.collection("users")
          .doc(user.uid)
          .get();

      const profile =
        snap.exists ? snap.data() : {};

      callback({
        uid: user.uid,
        email: user.email,
        ...profile
      });
    });
  }

  // ============================================
  // REQUIRE GUEST
  // ============================================

  function requireGuest() {

    _auth.onAuthStateChanged((user) => {

      if (user) {

        window.location.href = "index.html";

      } else {

        document.body.style.opacity = "1";
      }
    });
  }

  // ============================================
  // EXPORT
  // ============================================

  window.Auth = {

    registerUser,

    loginUser,

    logout,

    requireAuth,

    requireGuest
  };

})();
