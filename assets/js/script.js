/* assets/js/script.js */

// Your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB3pc8-6adWZyKSpDdPfLpkQ2x-InY2AiA",
    authDomain: "kabirooo.firebaseapp.com",
    projectId: "kabirooo",
    storageBucket: "kabirooo.firebasestorage.app",
    messagingSenderId: "836620668420",
    appId: "1:836620668420:web:435a365d163da113de2f51"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// Multi-language Dictionary
const translations = {
    en: {
        academy_name: "Shaharier Academy",
        logout: "Logout",
        welcome: "Welcome to Shaharier Academy",
        description: "Excellence in education and guiding the future of Bangladesh.",
        contact_us: "Contact Information",
        phone: "Phone:",
        location: "Location:",
        wa_link: "WhatsApp",
        login_title: "Login to Your Account",
        register_title: "Create an Account",
        login_btn: "Login",
        register_btn: "Sign Up",
        no_account: "Don't have an account?",
        have_account: "Already have an account?",
        create_one: "Create Account",
        login_here: "Login Here",
        or: "OR",
        login_google: "Continue with Google",
        login_apple: "Continue with Apple"
    },
    bn: {
        academy_name: "শাহরিয়ার একাডেমি",
        logout: "লগআউট",
        welcome: "শাহরিয়ার একাডেমিতে স্বাগতম",
        description: "শিক্ষায় শ্রেষ্ঠত্ব এবং বাংলাদেশের ভবিষ্যত গঠনে নিবেদিত।",
        contact_us: "যোগাযোগের তথ্য",
        phone: "ফোন:",
        location: "ঠিকানা:",
        wa_link: "হোয়াটসঅ্যাপ",
        login_title: "আপনার অ্যাকাউন্টে লগইন করুন",
        register_title: "একটি অ্যাকাউন্ট তৈরি করুন",
        login_btn: "লগইন",
        register_btn: "নিবন্ধন করুন",
        no_account: "অ্যাকাউন্ট নেই?",
        have_account: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
        create_one: "অ্যাকাউন্ট তৈরি করুন",
        login_here: "এখানে লগইন করুন",
        or: "অথবা",
        login_google: "গুগল দিয়ে চালিয়ে যান",
        login_apple: "অ্যাপল দিয়ে চালিয়ে যান"
    }
};

// --- Theme & Language Logic ---
const themeToggles = document.querySelectorAll('#theme-toggle');
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggles.forEach(toggle => {
        const icon = toggle.querySelector('i');
        if(icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    });
}
setTheme(localStorage.getItem('theme') || 'light');
themeToggles.forEach(t => t.addEventListener('click', () => setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')));

function updatePageText(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(translations[lang] && translations[lang][key]) {
            const icon = el.querySelector('i');
            if (icon) {
                el.innerHTML = '';
                el.appendChild(icon);
                el.appendChild(document.createTextNode(' ' + translations[lang][key]));
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });
}
function changeLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
    updatePageText(lang);
}
const langSwitchers = document.querySelectorAll('.language-switcher');
let currentLang = localStorage.getItem('preferredLanguage') || 'en';
langSwitchers.forEach(switcher => {
    switcher.value = currentLang;
    switcher.addEventListener('change', (e) => {
        currentLang = e.target.value;
        langSwitchers.forEach(s => s.value = currentLang);
        changeLanguage(currentLang);
    });
});
changeLanguage(currentLang);

// --- Navigation & Auth State ---
const currentPage = window.location.pathname.split("/").pop();
const isIndexPage = currentPage === 'index.html' || currentPage === '';
const isInfoPage = currentPage === 'info.html';

auth.onAuthStateChanged(user => {
    if (user) {
        if (isIndexPage) {
            window.location.href = 'info.html'; // Redirect to dashboard
        }
    } else {
        if (isInfoPage) {
            window.location.href = 'index.html'; // Kick out to login
        }
    }
});

// Logout Button Logic
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        auth.signOut();
    });
}

// --- Login Page Specific Logic ---
if (isIndexPage) {
    const errorMsg = document.getElementById('error-message');
    const emailForm = document.getElementById('email-auth-form');
    const toggleLink = document.getElementById('toggle-link');
    const authTitle = document.getElementById('auth-title');
    const togglePrompt = document.getElementById('toggle-prompt');
    const submitBtnText = document.getElementById('submit-btn-text');
    
    let isLoginMode = true;

    // Toggle Login / Register UI
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        if(isLoginMode) {
            authTitle.setAttribute('data-i18n', 'login_title');
            submitBtnText.setAttribute('data-i18n', 'login_btn');
            togglePrompt.setAttribute('data-i18n', 'no_account');
            toggleLink.setAttribute('data-i18n', 'create_one');
        } else {
            authTitle.setAttribute('data-i18n', 'register_title');
            submitBtnText.setAttribute('data-i18n', 'register_btn');
            togglePrompt.setAttribute('data-i18n', 'have_account');
            toggleLink.setAttribute('data-i18n', 'login_here');
        }
        updatePageText(currentLang);
        errorMsg.textContent = '';
    });

    // Form Submit (Email)
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const authAction = isLoginMode ? 
            auth.signInWithEmailAndPassword(email, password) : 
            auth.createUserWithEmailAndPassword(email, password);

        authAction.then(() => {
            window.location.href = 'info.html';
        }).catch(error => {
            errorMsg.textContent = error.message;
        });
    });

    // Social Auth Buttons (Google)
    document.getElementById('google-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(() => {
                window.location.href = 'info.html';
            })
            .catch(err => {
                errorMsg.textContent = err.message;
            });
    });

    // Social Auth Buttons (Apple)
    document.getElementById('apple-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = new firebase.auth.OAuthProvider('apple.com');
        auth.signInWithPopup(provider)
            .then(() => {
                window.location.href = 'info.html';
            })
            .catch(err => {
                errorMsg.textContent = err.message;
            });
    });
}