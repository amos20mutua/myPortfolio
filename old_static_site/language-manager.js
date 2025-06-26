class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        this.init();
    }

    init() {
        const languageSelector = document.getElementById('languageSelector');
        if (languageSelector) {
            languageSelector.value = this.currentLanguage;
            languageSelector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
        this.applyLanguage(this.currentLanguage);
    }

    changeLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('preferredLanguage', language);
        this.applyLanguage(language);
    }

    applyLanguage(language) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[language] && translations[language][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[language][key];
                } else {
                    element.textContent = translations[language][key];
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = language;

        // Dispatch event for custom handlers
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language } 
        }));
    }
} 