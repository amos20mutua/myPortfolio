// Language translations
const translations = {
    en: {
        // Home page
        greeting: "Hello, I'm",
        role: "Web Developer",
        description: "Fourth-year BBIT student at KCA University, specializing in web development. Founder of AffordablePicks, connecting rural communities with essential products and professional representation services.",
        viewProjects: "View Projects",
        contactMe: "Contact Me",
        
        // Projects page
        projectsTitle: "My Projects",
        projectsSubtitle: "Showcasing my journey in web development and entrepreneurship",
        affordablePicksTitle: "AffordablePicks",
        affordablePicksDesc: "E-commerce platform revolutionizing rural commerce",
        viewLive: "View Live Site",
        viewCode: "View Code",
        
        // Contact page
        contactTitle: "Let's Connect",
        contactSubtitle: "Open for collaborations and exciting opportunities",
        partnerships: "Business Partnerships",
        partnershipsDesc: "Join forces with AffordablePicks",
        development: "Web Development",
        developmentDesc: "Creating innovative digital solutions",
        networking: "Professional Networking",
        networkingDesc: "Building meaningful connections",
        downloadCV: "Download CV"
    },
    sw: {
        // Add Swahili translations
        greeting: "Habari, Mimi ni",
        role: "Mtengenezaji wa Tovuti",
        // ... add all other Swahili translations
    },
    es: {
        // Add Spanish translations
        greeting: "Hola, Soy",
        role: "Desarrollador Web",
        // ... add all other Spanish translations
    }
};

// Function to change language
function changeLanguage(language) {
    // Update text content for elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    // Update placeholders for inputs
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[language][key]) {
            element.placeholder = translations[language][key];
        }
    });

    // Save language preference
    localStorage.setItem('preferredLanguage', language);
}

// Initialize language selector
function initializeLanguage() {
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        // Get saved language or default to English
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
        
        // Set selector to saved language
        languageSelector.value = savedLanguage;
        
        // Apply saved language
        changeLanguage(savedLanguage);
        
        // Add change event listener
        languageSelector.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLanguage); 