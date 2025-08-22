/*// Scroll progress indicator
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = scrollTop / (docHeight - winHeight);
    const scrolled = scrollPercent * 100;
    
    const indicator = document.getElementById('scrollIndicator');
    if (indicator) {
        indicator.style.width = scrolled + '%';
    }
});*/

// Fonction throttle pour optimiser les performances
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Scroll progress indicator optimisé
const updateScrollProgress = throttle(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = scrollTop / (docHeight - winHeight);
    const scrolled = Math.min(Math.max(scrollPercent * 100, 0), 100);
    
    const indicator = document.getElementById('scrollIndicator');
    if (indicator) {
        // Utilisation de transform au lieu de width pour de meilleures performances
        indicator.style.transform = `scaleX(${scrolled / 100})`;
    }
}, 16); // 60fps

window.addEventListener('scroll', updateScrollProgress, { passive: true });


// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Duplication automatique des témoignages pour animation infinie
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('testimonials-track');
    if (track) {
        const originalContent = track.innerHTML;
        track.innerHTML = originalContent + originalContent; // Duplication automatique
    }
});



document.addEventListener('DOMContentLoaded', function() {
    const projectCard = document.querySelector('.project-card[data-href]');
    
    projectCard.addEventListener('click', function(e) {
        // Empêcher la navigation si on clique sur les liens GitHub/App Store
        if (!e.target.closest('.project-links')) {
            window.location.href = this.dataset.href;
        }
    });
});


function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const headerOffset = 0; // Ajustez selon la hauteur de votre header
        const elementPosition = contactSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        // Version avec animation personnalisée très lente
        const startPosition = window.pageYOffset;
        const distance = offsetPosition - startPosition;
        const duration = 3500; // 3.5 secondes (très lent)
        let startTime = null;

        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Fonction d'easing très douce
            const easeProgress = easeInOutQuart(progress);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }

        // Fonction d'easing très douce
        function easeInOutQuart(t) {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        }

        requestAnimationFrame(animateScroll);
    }
}

// ===== PROJETS MOBILE SLIDER =====
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.projects-track');
    const dots = document.querySelectorAll('.projects-mobile-dots .dot');
    const cards = document.querySelectorAll('.project-mobile-card');
    
    if (!track || !dots.length) return;
    
    let currentSlide = 0;
    const totalSlides = cards.length;
    
    function goToSlide(slideIndex) {
        if (slideIndex >= totalSlides) slideIndex = 0;
        if (slideIndex < 0) slideIndex = totalSlides - 1;
        
        
        track.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        // Mettre à jour les dots
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[slideIndex]) {
            dots[slideIndex].classList.add('active');
        }
        
        currentSlide = slideIndex;
    }
    
    // Navigation par dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Navigation tactile (swipe)
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        track.style.transition = 'none';
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const currentTransform = -currentSlide * 100;
        const newTransform = currentTransform + (diff / track.offsetWidth) * 100;
        track.style.transform = `translateX(${newTransform}%)`;
    });
    
    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const diff = currentX - startX;
        const threshold = 50;
        
        if (diff > threshold) {
            goToSlide(currentSlide - 1);
        } else if (diff < -threshold) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(currentSlide);
        }
    });
    
    // Clics sur les cartes
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const href = this.dataset.href;
            if (href) {
                window.open(href, '_blank');
            }
        });
    });
    
    // Auto-slide (optionnel)
    /*
    setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000);
    */
});






