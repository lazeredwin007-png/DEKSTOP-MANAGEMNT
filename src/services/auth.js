/**
 * Pixel ITAM - Authentication & Session Service
 * Manages secure login, credentials validation (admin/admin), session persistence, and logout flow.
 */

window.PixelAuth = (function () {
  const AUTH_KEY = 'pixel_itam_authenticated';
  const USER_KEY = 'pixel_itam_user';

  function isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === 'true' || sessionStorage.getItem(AUTH_KEY) === 'true';
  }

  function getCurrentUser() {
    return localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY) || 'admin';
  }

  function init() {
    const isAuth = isAuthenticated();
    const loginView = document.getElementById('loginView');
    const appContainer = document.getElementById('portalAppContainer');

    if (isAuth) {
      if (loginView) loginView.classList.add('hidden');
      if (appContainer) appContainer.classList.remove('hidden');
    } else {
      if (loginView) loginView.classList.remove('hidden');
      if (appContainer) appContainer.classList.add('hidden');
    }

    // Bind login form submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLoginSubmit);
    }

    // Auto-focus username if login visible
    if (!isAuth) {
      setTimeout(() => {
        const userInput = document.getElementById('loginUsername');
        if (userInput) userInput.focus();
      }, 200);
    }
  }

  function handleLoginSubmit(e) {
    if (e) e.preventDefault();
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const rememberMeInput = document.getElementById('loginRememberMe');
    const errorAlert = document.getElementById('loginErrorAlert');
    const errorMessage = document.getElementById('loginErrorMessage');
    const submitBtn = document.getElementById('loginSubmitBtn');

    const username = (usernameInput ? usernameInput.value : '').trim();
    const password = (passwordInput ? passwordInput.value : '').trim();
    const rememberMe = rememberMeInput ? rememberMeInput.checked : true;

    // Validate credentials: admin / admin
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      if (errorAlert) errorAlert.classList.add('hidden');
      
      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Signing In...</span>
        `;
      }

      setTimeout(() => {
        if (rememberMe) {
          localStorage.setItem(AUTH_KEY, 'true');
          localStorage.setItem(USER_KEY, username);
        } else {
          sessionStorage.setItem(AUTH_KEY, 'true');
          sessionStorage.setItem(USER_KEY, username);
        }

        const loginView = document.getElementById('loginView');
        const appContainer = document.getElementById('portalAppContainer');

        if (loginView) {
          loginView.classList.add('opacity-0', 'transition-opacity', 'duration-300');
          setTimeout(() => {
            loginView.classList.add('hidden');
            loginView.classList.remove('opacity-0');
            if (appContainer) {
              appContainer.classList.remove('hidden');
              appContainer.classList.add('animate-fade-in');
            }
            if (window.PixelApp && window.PixelApp.init) {
              window.PixelApp.init();
            }
            if (window.PixelApp && window.PixelApp.showToast) {
              window.PixelApp.showToast("Welcome back! Signed in as System Administrator.", "success");
            }
          }, 300);
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i data-lucide="log-in" class="w-4 h-4"></i><span>Sign In</span>`;
          if (window.lucide) window.lucide.createIcons();
        }
      }, 500);

    } else {
      if (errorAlert && errorMessage) {
        errorMessage.textContent = "Invalid username or password. Default credentials are admin / admin.";
        errorAlert.classList.remove('hidden');
        if (passwordInput) passwordInput.value = '';
        if (passwordInput) passwordInput.focus();
      }
    }
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(USER_KEY);

    const loginView = document.getElementById('loginView');
    const appContainer = document.getElementById('portalAppContainer');
    const passwordInput = document.getElementById('loginPassword');
    const errorAlert = document.getElementById('loginErrorAlert');

    if (errorAlert) errorAlert.classList.add('hidden');
    if (passwordInput) passwordInput.value = '';

    if (appContainer) appContainer.classList.add('hidden');
    if (loginView) {
      loginView.classList.remove('hidden');
      loginView.classList.add('animate-fade-in');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById('loginPassword');
    const icon = document.getElementById('passwordToggleIcon');
    if (!passwordInput) return;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      if (icon) icon.setAttribute('data-lucide', 'eye-off');
    } else {
      passwordInput.type = 'password';
      if (icon) icon.setAttribute('data-lucide', 'eye');
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function showForgotHint(e) {
    if (e) e.preventDefault();
    alert("IT Administrator Credentials:\nUsername: admin\nPassword: admin\n\nFor enterprise password resets, please contact IT Security Operations.");
  }

  function quickFillDemo() {
    const userInput = document.getElementById('loginUsername');
    const passInput = document.getElementById('loginPassword');
    if (userInput) userInput.value = 'admin';
    if (passInput) passInput.value = 'admin';
  }

  return {
    init: init,
    isAuthenticated: isAuthenticated,
    getCurrentUser: getCurrentUser,
    handleLoginSubmit: handleLoginSubmit,
    logout: logout,
    togglePasswordVisibility: togglePasswordVisibility,
    showForgotHint: showForgotHint,
    quickFillDemo: quickFillDemo
  };
})();
