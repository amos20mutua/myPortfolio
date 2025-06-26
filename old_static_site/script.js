// Language translations
const translations = {
    en: {
        greeting: "Hello, I'm",
        role: "Web Developer",
        description: "Fourth-year BBIT student at KCA University, specializing in web development. Founder of AffordablePicks, connecting rural communities with essential products and professional representation services.",
        viewProjects: "View Projects",
        contactMe: "Contact Me"
    },
    sw: {
        greeting: "Habari, Mimi ni",
        role: "Mtengenezaji wa Tovuti",
        description: "Mwanafunzi wa mwaka wa nne wa BBIT katika Chuo Kikuu cha KCA, ninayejishughulisha na utengenezaji wa tovuti. Mwanzilishi wa AffordablePicks, kuunganisha jamii za vijijini na bidhaa muhimu na huduma za uwakilishi wa kitaalamu.",
        viewProjects: "Tazama Miradi",
        contactMe: "Wasiliana Nami"
    },
    es: {
        greeting: "Hola, Soy",
        role: "Desarrollador Web",
        description: "Estudiante de cuarto año de BBIT en la Universidad KCA, especializado en desarrollo web. Fundador de AffordablePicks, conectando comunidades rurales con productos esenciales y servicios de representación profesional.",
        viewProjects: "Ver Proyectos",
        contactMe: "Contáctame"
    }
};

// Language switcher logic removed

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    const cvButton = document.querySelector('.btn-cv');
    if (cvButton) {
        cvButton.addEventListener('click', function(e) {
            // Add loading state
            this.classList.add('loading');
            // Remove loading state after download starts
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        });
    }
});

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simple client-side validation
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');
        if (!nameField || !emailField || !messageField) return;
        const name = nameField.value.trim();
        const email = emailField.value.trim();
        const message = messageField.value.trim();
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }
        // Show success message
        const formSuccess = document.getElementById('formSuccess');
        if (formSuccess) {
            formSuccess.style.display = 'block';
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        }
        this.reset();
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}); 