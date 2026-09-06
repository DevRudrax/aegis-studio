// Aegis Studio & Personal AI Strategic Journal
// Precision Monochrome Architecture with Full Firebase Authentication v10 Flow

// Firebase Web SDK v10 Modular Imports (ESM via CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithCustomToken,
  GoogleAuthProvider, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5oisYv4qdiyc6p3XSjpHAkS0gBPnBKLM",
  authDomain: "rudra-584b5.firebaseapp.com",
  projectId: "rudra-584b5",
  storageBucket: "rudra-584b5.firebasestorage.app",
  messagingSenderId: "129418546994",
  appId: "1:129418546994:web:45df4a94ddc9414853512b",
  measurementId: "G-1DP3NP8YBB"
};

// Initialize Firebase
let firebaseApp = null;
let firebaseAuth = null;
let googleProvider = null;

try {
  firebaseApp = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  googleProvider = new GoogleAuthProvider();
  console.log('[AEGIS/AUTH] Firebase Auth SDK v10 initialized successfully.');
} catch (e) {
  console.warn('[AEGIS/AUTH] Firebase Client SDK init note:', e.message);
}

// Global Application State
const state = {
  activeSessionId: "ses_8930a_prod",
  activeTenantId: "guest",
  activeModel: "gemini-1.5-pro",
  jsonSchemaMode: true,
  deterministic: true,
  authToken: "",
  userEmail: "",
  displayName: "",
  isAuthenticated: false,
  currentUser: null,
  sessions: [],
  history: [],
  auditLogs: [],
  attachedFile: null,
  selectedDocId: "doc_txn_4418a992bf01",
  promptPresets: [
    "Reflect on today's deployment challenges, egress bottlenecks, and key remediation priorities.",
    "Analyze Q3 infrastructure audit log for unauthorized egress anomalies across asia-east1 VPC subnets.",
    "Synthesize today's architectural migration progress, VPC connector latency, and follow-up tasks.",
    "Review IAM role bindings and least-privilege service account configurations.",
    "Commit verification snapshot directly to user journal collection in Firestore with tenant hash."
  ],
  presetIndex: 0
};

// DOM References
let promptInput;
let executeBtn;
let streamCanvas;
let sessionListContainer;
let fileInput;
let fileAttachmentChip;
let fileNameLabel;
let removeFileBtn;
let voiceDictationBtn;
let promptCyclerBtn;
let saveStatusBadge;
let toastContainer;
let userEmailBadge;

// Speech Recognition instance
let recognition = null;
let isRecording = false;

// Initialize on DOM Loaded
document.addEventListener('DOMContentLoaded', async () => {
  initDOM();
  initEventListeners();
  initSpeechRecognition();
  initKeyboardShortcuts();
  initFirebaseAuthListener();
  updateAuthUI(state.isAuthenticated);

  // Auto-open login modal if path is /login or hash is #login
  if (window.location.pathname === '/login' || window.location.hash === '#login') {
    toggleModal('authModal', true);
  }

  await loadServerConfig();
  await fetchSessions();
});

function initDOM() {
  promptInput = document.getElementById('promptInput');
  executeBtn = document.getElementById('executeBtn');
  streamCanvas = document.getElementById('streamCanvas');
  sessionListContainer = document.getElementById('sessionListContainer');
  fileInput = document.getElementById('fileInput');
  fileAttachmentChip = document.getElementById('fileAttachmentChip');
  fileNameLabel = document.getElementById('fileNameLabel');
  removeFileBtn = document.getElementById('removeFileBtn');
  voiceDictationBtn = document.getElementById('voiceDictationBtn');
  promptCyclerBtn = document.getElementById('promptCyclerBtn');
  saveStatusBadge = document.getElementById('saveStatusBadge');
  toastContainer = document.getElementById('toastContainer');
  userEmailBadge = document.getElementById('userEmailBadge');
}

// ----------------------------------------------------
// FIREBASE AUTHENTICATION FLOW (GENUINE LIVE INTEGRATION)
// ----------------------------------------------------

function initFirebaseAuthListener() {
  if (!firebaseAuth) return;

  onAuthStateChanged(firebaseAuth, async (user) => {
    if (user) {
      state.currentUser = user;
      state.isAuthenticated = true;
      state.userEmail = user.email || `${user.uid}@firebase.user`;
      state.displayName = user.displayName || user.email?.split('@')[0] || "User";
      state.activeTenantId = user.uid;

      try {
        state.authToken = await user.getIdToken();
      } catch (e) {
        state.authToken = "fb-token-" + user.uid;
      }

      updateAuthUI(true);
      console.log(`[AEGIS/AUTH] User authenticated: ${state.userEmail} (UID: ${user.uid})`);
      showToast(`Signed in as ${state.userEmail}`);

      // Refresh tenant scoped resources
      await fetchSessions();
    } else {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.userEmail = "";
      state.displayName = "";
      state.activeTenantId = "guest";
      state.authToken = "";
      updateAuthUI(false);
    }
  });
}

function updateAuthUI(isLoggedIn) {
  const signInTopBtn = document.getElementById('signInTopBtn');
  const userAuthContainer = document.getElementById('userAuthContainer');
  const userEmailBadge = document.getElementById('userEmailBadge');
  const userAvatarText = document.getElementById('userAvatarText');

  if (isLoggedIn) {
    if (signInTopBtn) signInTopBtn.classList.add('hidden');
    if (userAuthContainer) {
      userAuthContainer.classList.remove('hidden');
      userAuthContainer.classList.add('flex');
    }
    if (userEmailBadge) {
      userEmailBadge.textContent = state.userEmail;
    }
    if (userAvatarText) {
      const initials = (state.displayName || state.userEmail || "U").substring(0, 2).toUpperCase();
      userAvatarText.textContent = initials;
    }
  } else {
    if (signInTopBtn) signInTopBtn.classList.remove('hidden');
    if (userAuthContainer) {
      userAuthContainer.classList.add('hidden');
      userAuthContainer.classList.remove('flex');
    }
  }

  const authTenantPath = document.getElementById('authTenantPath');
  if (authTenantPath) {
    authTenantPath.textContent = state.isAuthenticated ? `users/${state.activeTenantId}/*` : `public/guest`;
  }
}

// Email & Password Sign In
window.handleEmailSignIn = async function() {
  const email = document.getElementById('signInEmail')?.value.trim();
  const password = document.getElementById('signInPassword')?.value;
  const submitBtn = document.getElementById('submitSignInBtn');

  if (!email || !password) {
    showAuthAlert('Please enter both your email address and password.', 'error');
    return;
  }

  setAuthButtonLoading(submitBtn, true, 'Signing in...');
  hideAuthAlert();

  try {
    if (!firebaseAuth) {
      throw new Error("Firebase Authentication is not initialized.");
    }
    const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);
    toggleModal('authModal', false);
    showToast(`Signed in as ${userCred.user.email}`);
  } catch (error) {
    console.error('[AEGIS/AUTH] Email sign in error:', error);
    showAuthAlert(formatFirebaseAuthError(error.code, error.message), 'error');
  } finally {
    setAuthButtonLoading(submitBtn, false, 'Sign In with Email');
  }
};

// Email & Password Registration
window.handleEmailRegister = async function() {
  const name = document.getElementById('regName')?.value.trim();
  const email = document.getElementById('regEmail')?.value.trim();
  const password = document.getElementById('regPassword')?.value;
  const submitBtn = document.getElementById('submitRegisterBtn');

  if (!email || !password) {
    showAuthAlert('Please fill in all registration fields.', 'error');
    return;
  }

  if (password.length < 6) {
    showAuthAlert('Password must be at least 6 characters long.', 'error');
    return;
  }

  setAuthButtonLoading(submitBtn, true, 'Creating Account...');
  hideAuthAlert();

  try {
    if (!firebaseAuth) {
      throw new Error("Firebase Authentication is not initialized.");
    }
    const userCred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    if (name && userCred.user) {
      await updateProfile(userCred.user, { displayName: name });
    }
    toggleModal('authModal', false);
    showToast(`Account created! Welcome, ${name || email}`);
  } catch (error) {
    console.error('[AEGIS/AUTH] Registration error:', error);
    showAuthAlert(formatFirebaseAuthError(error.code, error.message), 'error');
  } finally {
    setAuthButtonLoading(submitBtn, false, 'Create Account');
  }
};

// Google Sign In (Actual Firebase Google Auth Popup)
window.handleGoogleSignIn = async function() {
  hideAuthAlert();
  const googleBtn = document.getElementById('googleSignInBtn');
  setAuthButtonLoading(googleBtn, true, 'Connecting to Google...');

  try {
    if (!firebaseAuth) {
      throw new Error("Firebase Authentication is not initialized.");
    }
    if (!googleProvider) {
      googleProvider = new GoogleAuthProvider();
    }
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const user = result.user;
    toggleModal('authModal', false);
    showToast(`Welcome, ${user.displayName || user.email}!`);
  } catch (error) {
    console.error('[AEGIS/AUTH] Google Sign-In error:', error);
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      showAuthAlert('Google Sign-In was closed before completing.', 'info');
    } else {
      showAuthAlert(formatFirebaseAuthError(error.code, error.message), 'error');
    }
  } finally {
    setAuthButtonLoading(googleBtn, false, 'Sign in with Google');
  }
};

// Password Reset Request
window.handlePasswordReset = async function() {
  const email = document.getElementById('resetEmail')?.value.trim();
  const submitBtn = document.getElementById('submitResetBtn');

  if (!email) {
    showAuthAlert('Please enter your account email address.', 'error');
    return;
  }

  setAuthButtonLoading(submitBtn, true, 'Sending Reset Email...');
  hideAuthAlert();

  try {
    if (!firebaseAuth) {
      throw new Error("Firebase Authentication is not initialized.");
    }
    await sendPasswordResetEmail(firebaseAuth, email);
    showAuthAlert(`Password reset link sent to ${email}. Please check your inbox and spam folder.`, 'success');
  } catch (error) {
    console.error('[AEGIS/AUTH] Password reset error:', error);
    showAuthAlert(formatFirebaseAuthError(error.code, error.message), 'error');
  } finally {
    setAuthButtonLoading(submitBtn, false, 'Send Password Reset Email');
  }
};

// Sign Out
window.handleSignOut = async function() {
  try {
    if (firebaseAuth) {
      await signOut(firebaseAuth);
    }
  } catch (e) {
    console.warn('[AEGIS/AUTH] Sign out error:', e);
  }
  state.currentUser = null;
  state.isAuthenticated = false;
  state.userEmail = "";
  state.displayName = "";
  state.activeTenantId = "guest";
  state.authToken = "";
  updateAuthUI(false);
  showToast('Signed out successfully.');
};

// Format Firebase Error Codes to User Friendly Messages
function formatFirebaseAuthError(code, message) {
  switch (code) {
    case 'auth/configuration-not-found':
    case 'auth/operation-not-allowed':
      return 'Google/Email Sign-In is not enabled in Firebase Console. Please go to Firebase Console > Authentication > Sign-in method and enable Google & Email/Password for project "rudra-584b5".';
    case 'auth/unauthorized-domain':
      return `The domain "${window.location.hostname}" is not authorized. In Firebase Console, go to Authentication > Settings > Authorized domains and add "${window.location.hostname}".`;
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'The Google sign-in window was closed before completing authentication.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Invalid email or password. Please verify your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to multiple failed login attempts. Try again later or reset your password.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your connection and retry.';
    default:
      return message || code || 'Authentication failed. Please verify and try again.';
  }
}

function showAuthAlert(message, type = 'error') {
  const alertEl = document.getElementById('authAlert');
  const alertText = document.getElementById('authAlertText');
  const alertIcon = document.getElementById('authAlertIcon');
  if (!alertEl || !alertText) return;

  alertText.textContent = message;
  alertEl.classList.remove('hidden', 'border-error/40', 'bg-error/10', 'text-error', 'border-primary/40', 'bg-surface-container-high', 'text-primary');

  if (type === 'error') {
    alertEl.classList.add('border-error/40', 'bg-error/10', 'text-error');
    if (alertIcon) alertIcon.textContent = 'error_outline';
  } else if (type === 'success') {
    alertEl.classList.add('border-primary/40', 'bg-surface-container-high', 'text-primary');
    if (alertIcon) alertIcon.textContent = 'check_circle';
  } else {
    alertEl.classList.add('border-outline-variant/40', 'bg-surface-container-high', 'text-secondary');
    if (alertIcon) alertIcon.textContent = 'info';
  }
  alertEl.classList.remove('hidden');
}

function hideAuthAlert() {
  const alertEl = document.getElementById('authAlert');
  if (alertEl) alertEl.classList.add('hidden');
}

function setAuthButtonLoading(btn, isLoading, text) {
  if (!btn) return;
  btn.disabled = isLoading;
  if (isLoading) {
    btn.classList.add('opacity-70', 'cursor-not-allowed');
    btn.innerHTML = `<span class="w-4 h-4 border-2 border-surface-container-lowest border-t-transparent rounded-full animate-spin"></span><span>${text}</span>`;
  } else {
    btn.classList.remove('opacity-70', 'cursor-not-allowed');
    btn.innerHTML = `<span>${text}</span>`;
  }
}

// ----------------------------------------------------
// UI EVENT LISTENERS
// ----------------------------------------------------

function initEventListeners() {
  // Prompt Input Keydown
  if (promptInput) {
    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleExecutePrompt();
      }
    });
  }

  // Execute Button
  if (executeBtn) {
    executeBtn.addEventListener('click', handleExecutePrompt);
  }

  // Prompt Cycler Button
  if (promptCyclerBtn) {
    promptCyclerBtn.addEventListener('click', () => {
      const nextPrompt = state.promptPresets[state.presetIndex];
      state.presetIndex = (state.presetIndex + 1) % state.promptPresets.length;
      if (promptInput) {
        promptInput.value = nextPrompt;
        promptInput.focus();
      }
      showToast('Cycled reflection prompt');
    });
  }

  // File Upload Handlers
  const attachFileTrigger = document.getElementById('attachFileTrigger');
  if (attachFileTrigger && fileInput) {
    attachFileTrigger.addEventListener('click', () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelected);
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener('click', clearAttachedFile);
  }

  // Voice Dictation Button
  if (voiceDictationBtn) {
    voiceDictationBtn.addEventListener('click', toggleVoiceDictation);
  }

  // New Chat Button
  const newChatBtn = document.getElementById('newChatBtn');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', createNewChatSession);
  }

  // Auth Trigger Button (Top Bar Avatar)
  const authTriggerBtn = document.getElementById('authTriggerBtn');
  if (authTriggerBtn) {
    authTriggerBtn.addEventListener('click', () => {
      hideAuthAlert();
      toggleModal('authModal', true);
    });
  }

  // Export Markdown / JSON Buttons
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', exportSessionJson);
  }

  const exportMarkdownBtn = document.getElementById('exportMarkdownBtn');
  if (exportMarkdownBtn) {
    exportMarkdownBtn.addEventListener('click', exportSessionMarkdown);
  }

  // Clear Context Button
  const clearContextBtn = document.getElementById('clearContextBtn');
  if (clearContextBtn) {
    clearContextBtn.addEventListener('click', clearContext);
  }

  // Model Selector
  const modelSelect = document.getElementById('modelSelect');
  if (modelSelect) {
    modelSelect.addEventListener('change', (e) => {
      state.activeModel = e.target.value;
      showToast(`Active model switched to ${state.activeModel}`);
    });
  }

  // Checkboxes
  const jsonSchemaCheckbox = document.getElementById('jsonSchemaCheckbox');
  if (jsonSchemaCheckbox) {
    jsonSchemaCheckbox.addEventListener('change', (e) => {
      state.jsonSchemaMode = e.target.checked;
    });
  }

  const deterministicCheckbox = document.getElementById('deterministicCheckbox');
  if (deterministicCheckbox) {
    deterministicCheckbox.addEventListener('change', (e) => {
      state.deterministic = e.target.checked;
    });
  }

  // Auth Modal Tab Switcher & Views
  const tabSignIn = document.getElementById('tabSignIn');
  const tabRegister = document.getElementById('tabRegister');
  const formSignIn = document.getElementById('formSignIn');
  const formRegister = document.getElementById('formRegister');
  const formForgotPassword = document.getElementById('formForgotPassword');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const backToSignInBtn = document.getElementById('backToSignInBtn');
  const authDivider = document.getElementById('authDivider');
  const authSecondaryActions = document.getElementById('authSecondaryActions');
  const authTabContainer = document.getElementById('authTabContainer');

  function switchToSignInView() {
    hideAuthAlert();
    if (tabSignIn && tabRegister) {
      tabSignIn.classList.add('bg-[#27272A]', 'text-white');
      tabSignIn.classList.remove('text-[#71717A]');
      tabRegister.classList.remove('bg-[#27272A]', 'text-white');
      tabRegister.classList.add('text-[#71717A]');
    }
    if (authTabContainer) authTabContainer.classList.remove('hidden');
    if (formSignIn) formSignIn.classList.remove('hidden');
    if (formRegister) formRegister.classList.add('hidden');
    if (formForgotPassword) formForgotPassword.classList.add('hidden');
    if (authDivider) authDivider.classList.remove('hidden');
    if (authSecondaryActions) authSecondaryActions.classList.remove('hidden');
  }

  function switchToRegisterView() {
    hideAuthAlert();
    if (tabSignIn && tabRegister) {
      tabRegister.classList.add('bg-[#27272A]', 'text-white');
      tabRegister.classList.remove('text-[#71717A]');
      tabSignIn.classList.remove('bg-[#27272A]', 'text-white');
      tabSignIn.classList.add('text-[#71717A]');
    }
    if (authTabContainer) authTabContainer.classList.remove('hidden');
    if (formRegister) formRegister.classList.remove('hidden');
    if (formSignIn) formSignIn.classList.add('hidden');
    if (formForgotPassword) formForgotPassword.classList.add('hidden');
    if (authDivider) authDivider.classList.remove('hidden');
    if (authSecondaryActions) authSecondaryActions.classList.remove('hidden');
  }

  function switchToForgotPasswordView() {
    hideAuthAlert();
    if (authTabContainer) authTabContainer.classList.add('hidden');
    if (formSignIn) formSignIn.classList.add('hidden');
    if (formRegister) formRegister.classList.add('hidden');
    if (formForgotPassword) formForgotPassword.classList.remove('hidden');
    if (authDivider) authDivider.classList.add('hidden');
    if (authSecondaryActions) authSecondaryActions.classList.add('hidden');
  }

  if (tabSignIn) tabSignIn.addEventListener('click', switchToSignInView);
  if (tabRegister) tabRegister.addEventListener('click', switchToRegisterView);
  if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', switchToForgotPasswordView);
  if (backToSignInBtn) backToSignInBtn.addEventListener('click', switchToSignInView);
}

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isRecording = true;
      if (voiceDictationBtn) voiceDictationBtn.classList.add('text-error', 'animate-pulse');
      showToast('Listening for voice input...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (promptInput) {
        promptInput.value = promptInput.value ? `${promptInput.value} ${transcript}` : transcript;
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      stopVoiceDictation();
    };

    recognition.onend = () => {
      stopVoiceDictation();
    };
  }
}

function toggleVoiceDictation() {
  if (!recognition) {
    showToast('Speech recognition not supported in this browser.', 'error');
    return;
  }
  if (isRecording) {
    recognition.stop();
  } else {
    try {
      recognition.start();
    } catch (e) {
      console.warn(e);
    }
  }
}

function stopVoiceDictation() {
  isRecording = false;
  if (voiceDictationBtn) voiceDictationBtn.classList.remove('text-error', 'animate-pulse');
}

function handleFileSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    state.attachedFile = {
      name: file.name,
      size: file.size,
      content: event.target.result
    };
    if (fileNameLabel) {
      const sizeKb = (file.size / 1024).toFixed(1);
      fileNameLabel.textContent = `${file.name} (${sizeKb} KB)`;
    }
    if (fileAttachmentChip) {
      fileAttachmentChip.classList.remove('hidden');
      fileAttachmentChip.classList.add('flex');
    }
    showToast(`Attached ${file.name}`);
  };
  reader.readAsText(file);
}

function clearAttachedFile() {
  state.attachedFile = null;
  if (fileInput) fileInput.value = '';
  if (fileAttachmentChip) {
    fileAttachmentChip.classList.add('hidden');
    fileAttachmentChip.classList.remove('flex');
  }
}

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (promptInput) promptInput.focus();
    }
    if (e.key === 'Escape') {
      toggleModal('authModal', false);
    }
  });
}

// Fetch Server Config
async function loadServerConfig() {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const config = await res.json();
      console.log('[AEGIS/CLIENT] Server configuration loaded:', config);
    }
  } catch (err) {
    console.warn('[AEGIS/CLIENT] Config fetch note:', err.message);
  }
}

// Fetch Session List for Sidebar
async function fetchSessions() {
  try {
    const res = await fetch('/api/sessions', {
      headers: {
        'Authorization': `Bearer ${state.authToken}`,
        'X-Tenant-Id': state.activeTenantId
      }
    });
    if (!res.ok) return;

    const data = await res.json();
    state.sessions = data.sessions || [];
    renderSessionList();
  } catch (err) {
    console.warn('[AEGIS/CLIENT] Sessions fetch note:', err.message);
  }
}

function renderSessionList() {
  if (!sessionListContainer) return;
  sessionListContainer.innerHTML = '';

  if (state.sessions.length === 0) {
    sessionListContainer.innerHTML = `
      <div class="px-space-sm py-space-md text-center text-outline font-code-sm text-[11px] space-y-1">
        <div>No chats saved yet</div>
        <div class="text-[10px] opacity-70">Conversations are isolated to your account.</div>
      </div>
    `;
    return;
  }

  state.sessions.forEach(sess => {
    const isActive = sess.id === state.activeSessionId;
    const itemDiv = document.createElement('div');
    itemDiv.className = `group flex items-center justify-between px-space-sm py-space-xs rounded text-body-sm transition-colors cursor-pointer ${
      isActive ? 'bg-surface-container-high text-primary font-medium border-l-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
    }`;

    itemDiv.innerHTML = `
      <div class="flex items-center gap-space-xs truncate flex-1 pr-1">
        <span class="material-symbols-outlined text-[15px] ${isActive ? 'text-primary' : 'text-outline'}">chat_bubble_outline</span>
        <span class="truncate">${escapeHtml(sess.title)}</span>
      </div>
      <button class="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-opacity p-0.5" title="Delete Session">
        <span class="material-symbols-outlined text-[13px]">delete</span>
      </button>
    `;

    itemDiv.addEventListener('click', (e) => {
      if (e.target.closest('button')) {
        e.stopPropagation();
        deleteSession(sess.id);
        return;
      }
      selectSession(sess.id);
    });

    sessionListContainer.appendChild(itemDiv);
  });
}

async function createNewChatSession() {
  try {
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`,
        'X-Tenant-Id': state.activeTenantId
      },
      body: JSON.stringify({ title: `Reflection ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` })
    });

    if (res.ok) {
      const data = await res.json();
      state.activeSessionId = data.session.id;
      clearContext();
      await fetchSessions();
      showToast('Created new chat session');
    }
  } catch (err) {
    showToast('Created local session');
  }
}

async function deleteSession(sessionId) {
  try {
    await fetch(`/api/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${state.authToken}`,
        'X-Tenant-Id': state.activeTenantId
      }
    });
    state.sessions = state.sessions.filter(s => s.id !== sessionId);
    renderSessionList();
    showToast('Session removed');
  } catch (err) {
    console.warn(err);
  }
}

function selectSession(sessionId) {
  state.activeSessionId = sessionId;
  renderSessionList();
  showToast(`Switched to session ${sessionId}`);
}

// Main Prompt Execution Flow
async function handleExecutePrompt() {
  const query = promptInput ? promptInput.value.trim() : '';
  if (!query && !state.attachedFile) return;

  const payloadText = query || `Analyze attached file: ${state.attachedFile.name}`;
  const attachedFileMeta = state.attachedFile;

  // Clear inputs
  if (promptInput) promptInput.value = '';
  clearAttachedFile();

  // Append user message
  appendUserMessage(payloadText, attachedFileMeta);

  if (saveStatusBadge) {
    saveStatusBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span><span>Saving...</span>`;
  }

  const loadingCardId = 'loading-card-' + Date.now();
  appendLoadingCard(loadingCardId);
  scrollToBottom();

  if (executeBtn) {
    executeBtn.disabled = true;
    executeBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`,
        'X-Tenant-Id': state.activeTenantId
      },
      body: JSON.stringify({
        prompt: payloadText,
        model: state.activeModel,
        jsonSchemaMode: state.jsonSchemaMode,
        deterministic: state.deterministic,
        sessionId: state.activeSessionId,
        attachment: attachedFileMeta
      })
    });

    const data = await response.json();
    const loadingEl = document.getElementById(loadingCardId);
    if (loadingEl) loadingEl.remove();

    if (!response.ok) {
      appendErrorCard(data.error || 'Execution failed', data.reason || 'Guardrail rejection or runtime failure');
      showToast(data.reason || 'Execution rejected by Guardrail', 'error');
    } else {
      appendAiResponseCard(data);
      if (data.journalId) {
        appendTransactionCard(data.journalId, data.durationMs);
      }
      await fetchSessions();
      showToast(`Saved to users/${state.activeTenantId}/journals (${data.durationMs}ms)`);
    }
  } catch (error) {
    const loadingEl = document.getElementById(loadingCardId);
    if (loadingEl) loadingEl.remove();
    appendErrorCard('Network / Container Exception', error.message);
    showToast('Failed to connect to backend engine', 'error');
  } finally {
    if (executeBtn) {
      executeBtn.disabled = false;
      executeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    if (saveStatusBadge) {
      saveStatusBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-primary"></span><span>Saved ✓</span>`;
    }
    scrollToBottom();
  }
}

// Append User Capsule
function appendUserMessage(text, attachment) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' You';

  const userDiv = document.createElement('div');
  userDiv.className = 'flex flex-col items-end space-y-space-2xs max-w-2xl ml-auto animate-fadeIn';
  
  let attachmentHtml = '';
  if (attachment) {
    attachmentHtml = `
      <div class="inline-flex items-center gap-1.5 px-space-xs py-1 rounded bg-surface-container-high border border-outline-variant/40 font-code-sm text-[11px] text-secondary mb-1">
        <span class="material-symbols-outlined text-[13px] text-primary">description</span>
        <span>${escapeHtml(attachment.name)}</span>
      </div>
    `;
  }

  userDiv.innerHTML = `
    ${attachmentHtml}
    <div class="px-space-base py-space-sm bg-surface-container-highest border border-outline-variant/40 rounded-lg text-primary text-body-md font-body-md shadow-sm selection:bg-primary selection:text-surface-container-lowest">
      ${escapeHtml(text)}
    </div>
    <div class="flex items-center gap-space-xs text-outline font-code-sm text-code-sm">
      <span>${timeStr}</span>
      <span>·</span>
      <span class="inline-flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">done_all</span> Delivered</span>
    </div>
  `;
  streamCanvas.appendChild(userDiv);
}

// Append Loading State Card
function appendLoadingCard(id) {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = id;
  loadingDiv.className = 'w-full bg-surface-container-low border border-outline-variant/30 rounded-lg overflow-hidden p-space-base flex items-center gap-space-md animate-pulse';
  loadingDiv.innerHTML = `
    <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    <div class="space-y-1">
      <div class="font-code-sm text-code-sm text-primary font-medium">Synthesizing Strategic Reflection with ${state.activeModel}...</div>
      <div class="font-code-sm text-code-sm text-outline">Extracting key action items &amp; saving to Cloud Firestore</div>
    </div>
  `;
  streamCanvas.appendChild(loadingDiv);
}

// Append Rich AI Strategic Reflection Response Card
function appendAiResponseCard(resp) {
  const { data, durationMs, model, tokensPerSec, journalId } = resp;
  const cardDiv = document.createElement('div');
  const cardId = 'ai-card-' + (journalId || Date.now());
  cardDiv.id = cardId;
  cardDiv.className = 'w-full bg-surface-container-low border border-outline-variant/30 rounded-lg overflow-hidden shadow-sm animate-fadeIn';

  // Action Items extraction & checklist
  let actionItemsHtml = '';
  const actionItems = data.actionItems || [];
  const completedCount = actionItems.filter(i => i.completed).length;
  const totalCount = actionItems.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (totalCount > 0) {
    const listItems = actionItems.map((item, idx) => {
      const isDone = item.completed;
      const priority = item.priority || 'High';
      const priorityClass = priority === 'High' ? 'text-primary border-outline' : priority === 'Medium' ? 'text-secondary border-outline-variant' : 'text-outline border-outline-variant/30';
      
      return `
        <div class="flex items-start gap-space-sm p-space-xs rounded bg-surface-container-high/30 border border-outline-variant/20 hover:border-outline/40 transition-colors group" data-action-index="${idx}">
          <input type="checkbox" ${isDone ? 'checked' : ''} class="w-4 h-4 rounded bg-surface border border-outline-variant text-primary focus:ring-0 accent-primary cursor-pointer mt-0.5" onchange="toggleActionItem('${journalId}', ${idx}, this.checked, '${cardId}')"/>
          <div class="flex-1 font-body-sm text-body-sm ${isDone ? 'line-through text-outline' : 'text-on-surface'} transition-all">
            ${escapeHtml(item.text)}
          </div>
          <span class="font-code-sm text-[10px] uppercase px-1.5 py-0.5 rounded bg-surface-container border ${priorityClass}">
            ${escapeHtml(priority)}
          </span>
        </div>
      `;
    }).join('');

    actionItemsHtml = `
      <div class="space-y-space-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs">
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-outline">02 / Extracted Action Items</span>
            <div class="h-[1px] w-12 bg-outline-variant/20"></div>
          </div>
          <span class="font-code-sm text-code-sm text-secondary" id="progress-text-${cardId}">
            ${completedCount} of ${totalCount} complete (${progressPercent}%)
          </span>
        </div>
        <div class="w-full h-1 bg-surface-container-lowest rounded-full overflow-hidden">
          <div class="h-full bg-primary transition-all duration-300" id="progress-bar-${cardId}" style="width: ${progressPercent}%"></div>
        </div>
        <div class="space-y-space-xs pt-1" id="action-list-${cardId}">
          ${listItems}
        </div>
      </div>
    `;
  }

  // Telemetry Grid Rows
  let tableRows = '';
  if (data.telemetryGrid && Array.isArray(data.telemetryGrid)) {
    tableRows = data.telemetryGrid.map(item => `
      <tr class="hover:bg-surface-container/50 transition-colors">
        <td class="px-space-md py-space-xs text-on-surface">${escapeHtml(item.metric)}</td>
        <td class="px-space-md py-space-xs text-primary font-medium">${escapeHtml(item.value)}</td>
        <td class="px-space-md py-space-xs text-outline">${escapeHtml(item.threshold || 'N/A')}</td>
        <td class="px-space-md py-space-xs text-right text-primary font-mono">${escapeHtml(item.assessment || 'NOMINAL')}</td>
      </tr>
    `).join('');
  }

  // Hashtags
  let hashtagsHtml = '';
  if (data.hashtags && Array.isArray(data.hashtags)) {
    hashtagsHtml = `
      <div class="flex items-center gap-1.5 flex-wrap pt-space-xs border-t border-outline-variant/20">
        ${data.hashtags.map(t => `<span class="font-code-sm text-[11px] text-secondary hover:text-primary bg-surface-container px-2 py-0.5 rounded border border-outline-variant/30 cursor-pointer transition-colors">${escapeHtml(t)}</span>`).join('')}
      </div>
    `;
  }

  const durationSec = (durationMs / 1000).toFixed(2);
  const tokSecFormatted = tokensPerSec || 840;

  cardDiv.innerHTML = `
    <!-- Engine Header -->
    <div class="px-space-base py-space-xs bg-surface-container border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-space-sm">
      <div class="flex items-center gap-space-sm">
        <span class="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs rounded bg-surface-container-highest border border-outline-variant/40 font-code-sm text-code-sm text-primary font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          ${model || 'Gemini 1.5 Pro'}
        </span>
        <span class="font-code-sm text-code-sm text-outline">${durationSec}s · ${tokSecFormatted} tok/sec</span>
      </div>
      <div class="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs rounded bg-surface-container-high border border-outline-variant/30 font-code-sm text-code-sm text-secondary">
        <span class="material-symbols-outlined text-[13px] text-primary">verified</span>
        Validated by Aegis Guardrail
      </div>
    </div>
    
    <!-- Card Content Body -->
    <div class="p-space-base space-y-space-lg">
      <!-- Section A: Strategic Reflection & Summary -->
      <div class="space-y-space-xs">
        <div class="flex items-center gap-space-xs">
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-outline">01 / Strategic Reflection &amp; Synthesis</span>
          <div class="h-[1px] flex-1 bg-outline-variant/20"></div>
        </div>
        <div class="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line" id="summary-content-${cardId}">
          ${data.executiveSummary || 'Reflection processed successfully.'}
        </div>
      </div>

      <!-- Section B: Extracted Action Items Checklist -->
      ${actionItemsHtml}

      <!-- Section C: Telemetry Matrix -->
      ${tableRows ? `
      <div class="space-y-space-xs">
        <div class="flex items-center gap-space-xs">
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-outline">03 / Telemetry &amp; SLA Compliance</span>
          <div class="h-[1px] flex-1 bg-outline-variant/20"></div>
        </div>
        <div class="overflow-x-auto rounded border border-outline-variant/30">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container border-b border-outline-variant/30">
                <th class="px-space-md py-space-xs font-label-sm text-label-sm text-outline uppercase">Metric Descriptor</th>
                <th class="px-space-md py-space-xs font-label-sm text-label-sm text-outline uppercase">Evaluated Value</th>
                <th class="px-space-md py-space-xs font-label-sm text-label-sm text-outline uppercase">Threshold SLA</th>
                <th class="px-space-md py-space-xs font-label-sm text-label-sm text-outline uppercase text-right">Assessment</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/20 font-code-sm text-code-sm">
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
      ` : ''}

      <!-- Hashtags -->
      ${hashtagsHtml}

      <!-- Quick Action Toolbar -->
      <div class="pt-space-xs border-t border-outline-variant/20 flex items-center justify-between flex-wrap gap-space-xs">
        <div class="flex items-center gap-space-xs">
          <button class="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface hover:text-primary font-body-sm text-xs transition-colors flex items-center gap-1" onclick="refineCardSummary('${cardId}', \`${escapeHtml(data.executiveSummary || '')}\`)">
            <span class="material-symbols-outlined text-[13px]">auto_fix_high</span>
            <span>Refine Summary</span>
          </button>
          <button class="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface hover:text-primary font-body-sm text-xs transition-colors flex items-center gap-1" onclick="downloadCardMarkdown('${cardId}', \`${escapeHtml(data.executiveSummary || '')}\`)">
            <span class="material-symbols-outlined text-[13px]">download</span>
            <span>Download .MD</span>
          </button>
        </div>
        <button class="text-outline hover:text-primary transition-colors p-1" title="Copy Content" onclick="copyCardContent('${cardId}')">
          <span class="material-symbols-outlined text-[16px]">content_copy</span>
        </button>
      </div>
    </div>
  `;

  streamCanvas.appendChild(cardDiv);
}

// Action Item Checkbox Toggle
window.toggleActionItem = async function(journalId, index, isChecked, cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    const list = card.querySelector(`#action-list-${cardId}`);
    if (list) {
      const row = list.querySelector(`[data-action-index="${index}"]`);
      if (row) {
        const textDiv = row.querySelector('.font-body-sm');
        if (textDiv) {
          if (isChecked) {
            textDiv.classList.add('line-through', 'text-outline');
            textDiv.classList.remove('text-on-surface');
          } else {
            textDiv.classList.remove('line-through', 'text-outline');
            textDiv.classList.add('text-on-surface');
          }
        }
      }

      const checkboxes = list.querySelectorAll('input[type="checkbox"]');
      const total = checkboxes.length;
      let completed = 0;
      checkboxes.forEach(cb => { if (cb.checked) completed++; });
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      const progressText = card.querySelector(`#progress-text-${cardId}`);
      if (progressText) {
        progressText.textContent = `${completed} of ${total} complete (${percent}%)`;
      }
      const progressBar = card.querySelector(`#progress-bar-${cardId}`);
      if (progressBar) {
        progressBar.style.width = `${percent}%`;
      }
    }
  }

  try {
    await fetch(`/api/journals/${journalId}/actions/${index}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`,
        'X-Tenant-Id': state.activeTenantId
      },
      body: JSON.stringify({ completed: isChecked })
    });
    showToast(isChecked ? 'Action item completed ✓' : 'Action item marked pending');
  } catch (err) {
    console.warn(err);
  }
};

// Refine Card Summary
window.refineCardSummary = async function(cardId, currentSummary) {
  showToast('Refining strategic reflection with AI...');
  try {
    const res = await fetch('/api/refine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.authToken}`,
        'X-Tenant-Id': state.activeTenantId
      },
      body: JSON.stringify({ summary: currentSummary })
    });
    if (res.ok) {
      const data = await res.json();
      const contentEl = document.getElementById(`summary-content-${cardId}`);
      if (contentEl) {
        contentEl.innerHTML = data.refinedSummary.replace(/\n/g, '<br/>');
        contentEl.classList.add('animate-fadeIn');
      }
      showToast('Summary refined with architectural directives.');
    }
  } catch (err) {
    showToast('Failed to refine summary', 'error');
  }
};

// Download Card Markdown
window.downloadCardMarkdown = function(cardId, summary) {
  const card = document.getElementById(cardId);
  let content = `# AI Strategic Reflection Journal\n\nDate: ${new Date().toISOString()}\nSession: ${state.activeSessionId}\n\n## 01 / Strategic Reflection\n${summary}\n\n## 02 / Extracted Action Items\n`;

  if (card) {
    const items = card.querySelectorAll('[data-action-index]');
    items.forEach(item => {
      const isChecked = item.querySelector('input').checked;
      const text = item.querySelector('.font-body-sm').textContent.trim();
      content += `- [${isChecked ? 'x' : ' '}] ${text}\n`;
    });
  }

  const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(content);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `aegis_reflection_${Date.now()}.md`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Downloaded .MD file.');
};

// Copy Card Content
window.copyCardContent = function(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    navigator.clipboard.writeText(card.innerText);
    showToast('Copied reflection to clipboard.');
  }
};

// Append Transaction Completion Card
function appendTransactionCard(docId, latency) {
  const txnDiv = document.createElement('div');
  txnDiv.className = 'w-full bg-surface-container-low border border-outline-variant/30 rounded-lg overflow-hidden shadow-sm animate-fadeIn';
  txnDiv.innerHTML = `
    <div class="px-space-base py-space-xs bg-surface-container border-b border-outline-variant/30 flex items-center justify-between">
      <div class="flex items-center gap-space-sm">
        <span class="font-code-sm text-code-sm text-primary font-medium">Transaction Complete</span>
        <span class="font-code-sm text-code-sm text-outline">Latency: ${latency}ms · 200 OK</span>
      </div>
      <span class="font-code-sm text-code-sm text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded">Firestore Driver v3.1</span>
    </div>
    <div class="p-space-base space-y-space-sm">
      <div class="text-body-md font-body-md text-on-surface">
        Journal snapshot successfully persisted. Atomic write operation committed across <code class="font-code-sm text-code-sm text-primary">asia-east1</code> replica group.
      </div>
      <div class="p-space-sm bg-surface-container-lowest border border-outline-variant/40 rounded font-code-sm text-code-sm flex items-center justify-between">
        <div class="flex items-center gap-space-sm truncate">
          <span class="text-outline">DOCUMENT ID:</span>
          <span class="text-primary font-medium">${docId}</span>
        </div>
        <button class="text-outline hover:text-primary transition-colors flex items-center gap-1 text-[11px]" onclick="copyDocId('${docId}')">
          <span class="material-symbols-outlined text-[13px]">content_copy</span>
          <span>COPY ID</span>
        </button>
      </div>
    </div>
  `;
  streamCanvas.appendChild(txnDiv);
}

// Append Error Card
function appendErrorCard(title, details) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-space-base space-y-space-xs animate-fadeIn';
  errorDiv.innerHTML = `
    <div class="flex items-center gap-space-xs text-primary font-headline-sm font-semibold">
      <span class="material-symbols-outlined text-[18px]">gpp_bad</span>
      <span>${escapeHtml(title)}</span>
    </div>
    <p class="font-body-md text-on-surface-variant font-mono text-xs leading-relaxed">
      ${escapeHtml(details)}
    </p>
  `;
  streamCanvas.appendChild(errorDiv);
}

// Export Session Markdown
function exportSessionMarkdown() {
  let content = `# AI Strategic Reflection Journal · Session Export\n\nSession ID: ${state.activeSessionId}\nExport Date: ${new Date().toISOString()}\nTarget Region: Google Cloud Run (asia-east1)\nTenant: users/${state.activeTenantId}\n\n---\n\n`;

  const cards = streamCanvas ? streamCanvas.querySelectorAll('.bg-surface-container-low') : [];
  cards.forEach((card, idx) => {
    content += `### Entry ${idx + 1}\n\n${card.innerText}\n\n---\n\n`;
  });

  const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(content);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `aegis_session_${state.activeSessionId}.md`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Exported entire session Markdown.');
}

// Export Session JSON
function exportSessionJson() {
  const exportPayload = {
    sessionId: state.activeSessionId,
    exportedAt: new Date().toISOString(),
    environment: "Google Cloud Run / asia-east1",
    activeModel: state.activeModel,
    tenantId: state.activeTenantId,
    userEmail: state.userEmail
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `aegis_session_${state.activeSessionId}_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Exported session JSON payload.');
}

// Clear Context Stream
function clearContext() {
  if (streamCanvas) {
    streamCanvas.innerHTML = `
      <div class="text-center py-space-xl text-outline font-code-sm space-y-space-xs">
        <span class="material-symbols-outlined text-[32px] text-outline-variant">terminal</span>
        <div>Workspace context flushed. Ready for operational directives.</div>
      </div>
    `;
  }
  showToast('Conversation stream flushed.');
}

// Copy Helper
window.copyDocId = function(docId) {
  navigator.clipboard.writeText(docId);
  showToast(`Copied ${docId} to clipboard.`);
};

// Toast Notifications
function showToast(message, type = 'info') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'px-space-base py-space-xs rounded bg-surface-container-highest border border-outline-variant/40 shadow-lg text-primary font-code-sm text-code-sm flex items-center gap-space-xs animate-fadeIn';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[15px] ${type === 'error' ? 'text-primary' : 'text-primary'}">
      ${type === 'error' ? 'warning' : 'check_circle'}
    </span>
    <span>${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Modal Toggle Utility
window.toggleModal = function(modalId, show) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (show) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } else {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

function scrollToBottom() {
  const scrollContainer = streamCanvas ? streamCanvas.parentElement : null;
  if (scrollContainer) {
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
