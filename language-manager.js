class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        this.init();
    }

    init() {
        console.log('Initializing Language Manager...');
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
        console.log(`Changing language to: ${language}`);
        this.currentLanguage = language;
        localStorage.setItem('preferredLanguage', language);
        this.applyLanguage(language);
    }

    applyLanguage(language) {
        console.log(`Applying language: ${language}`);
        const elements = document.querySelectorAll('[data-translate]');
        console.log(`Found ${elements.length} translatable elements`);
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            console.log(`Translating element with key: ${key}`);
            
            if (translations[language] && translations[language][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[language][key];
                } else {
                    element.textContent = translations[language][key];
                }
                console.log(`Successfully translated: ${key}`);
            } else {
                console.warn(`Missing translation for key: ${key} in language: ${language}`);
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