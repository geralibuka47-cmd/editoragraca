/**
 * Editora Graça — Firebase Global Initialization (Legacy/Global Wrapper)
 */
import app, { auth, db, storage } from './firebase-config.js';

// No further logic needed as firebase-config already handles window exports.
console.log("Firebase global environment ready.");
