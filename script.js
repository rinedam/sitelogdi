// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Particles Background
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffffff'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        }
    },
    retina_detect: true
});

// Header Scroll Effect
const header = document.querySelector('.header-transparent');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

const startCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / speed;

    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => startCounter(counter), 1);
    } else {
        counter.innerText = target;
    }
};

// Initialize counters when they come into view
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// Bases Slider
const basesSwiper = new Swiper('.bases-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    breakpoints: {
        640: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Back to Top Button
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }
});

// Form Submission with Animation
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
    button.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check me-2"></i>Mensagem Enviada!';
        button.classList.add('btn-success');

        setTimeout(() => {
            this.reset();
            button.innerHTML = originalText;
            button.classList.remove('btn-success');
            button.disabled = false;
        }, 2000);
    }, 1500);
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Section Animation
gsap.from('.hero h1', {
    duration: 1,
    y: 100,
    opacity: 0,
    ease: 'power4.out'
});

gsap.from('.hero p', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.3
});

gsap.from('.hero-buttons', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.6
});

// Scroll Animations
gsap.utils.toArray('.solution-card').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
    });
});

// Newsletter Form
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input');
    const button = this.querySelector('button');
    const originalIcon = button.innerHTML;

    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    input.disabled = true;

    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            this.reset();
            button.innerHTML = originalIcon;
            button.disabled = false;
            input.disabled = false;
        }, 2000);
    }, 1500);
});