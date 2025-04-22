document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function() {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Header Effect
    const header = document.querySelector('.header-transparent');
    const hero = document.querySelector('.hero');
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
    
    // Initialize header state
    updateHeader();
    
    // Update header on scroll
    window.addEventListener('scroll', updateHeader);

    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 50
    });

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    
    function startCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.innerText);
        const increment = Math.ceil(target / 50);
        
        if (count < target) {
            counter.innerText = count + increment;
            setTimeout(() => startCounter(counter), 30);
        } else {
            counter.innerText = target;
        }
    }

    // Use Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counter.innerText = '0';
        counterObserver.observe(counter);
    });

    // Estados e Prazos
    const stateSelect = document.getElementById('stateSelect');
    const stateInfo = document.getElementById('stateInfo');
    
    const stateData = {
        PA: {
            name: 'PARÁ',
            deliveries: [
                { city: 'BELÉM (E REGIÃO)', time: '09 a 10 dias úteis' }
            ]
        },
        MA: {
            name: 'MARANHÃO',
            deliveries: [
                { city: 'SÃO LUIS', time: '09 a 10 dias úteis' },
                { city: 'INTERIOR', time: '13 a 15 dias úteis' }
            ]
        },
        PI: {
            name: 'PIAUÍ',
            deliveries: [
                { city: 'TERESINA', time: '09 a 10 dias' },
                { city: 'INTERIOR', time: '13 a 15 dias' }
            ]
        },
        CE: {
            name: 'CEARÁ',
            deliveries: [
                { city: 'FORTALEZA', time: '09 a 10 dias úteis' },
                { city: 'INTERIOR', time: '11 a 13 dias úteis' }
            ]
        },
        RN: {
            name: 'RIO GRANDE DO NORTE',
            deliveries: [
                { city: 'NATAL', time: '09 a 10 dias úteis' },
                { city: 'INTERIOR', time: '11 a 13 dias' }
            ]
        },
        PB: {
            name: 'PARAÍBA',
            deliveries: [
                { city: 'JOÃO PESSOA', time: '08 a 09 dias úteis' },
                { city: 'INTERIOR', time: '09 a 12 dias' }
            ]
        },
        PE: {
            name: 'PERNAMBUCO',
            deliveries: [
                { city: 'RECIFE', time: '08 a 09 dias úteis' },
                { city: 'INTERIOR', time: '10 a 12 dias' }
            ]
        },
        AL: {
            name: 'ALAGOAS',
            deliveries: [
                { city: 'MACEIÓ', time: '08 a 09 dias úteis' },
                { city: 'INTERIOR', time: '10 a 12 dias' }
            ]
        },
        SE: {
            name: 'SERGIPE',
            deliveries: [
                { city: 'ARACAJU', time: '07 a 08 dias úteis' },
                { city: 'INTERIOR', time: '10 a 12 dias' }
            ]
        },
        BA: {
            name: 'BAHIA',
            deliveries: [
                { city: 'SALVADOR', time: '07 a 08 dias úteis' },
                { city: 'INTERIOR', time: '10 a 12 dias' }
            ]
        },
        TO: {
            name: 'TOCANTINS',
            deliveries: [
                { city: 'PALMAS', time: '08 a 09 dias úteis' },
                { city: 'INTERIOR', time: '10 a 12 dias' }
            ]
        },
        GO: {
            name: 'GOIÁS',
            deliveries: [
                { city: 'GOIÂNIA', time: '04 a 05 dias úteis' },
                { city: 'INTERIOR', time: '05 a 07 dias' }
            ]
        },
        DF: {
            name: 'DISTRITO FEDERAL',
            deliveries: [
                { city: 'BRASÍLIA', time: '04 a 06 dias úteis' },
                { city: 'INTERIOR', time: '05 a 07 dias' }
            ]
        },
        ES: {
            name: 'ESPÍRITO SANTO',
            deliveries: [
                { city: 'VITÓRIA', time: '04 a 06 dias úteis' },
                { city: 'INTERIOR', time: '05 a 07 dias' }
            ]
        },
        MG: {
            name: 'MINAS GERAIS',
            deliveries: [
                { city: 'BELO HORIZONTE', time: '03 a 04 dias úteis' },
                { city: 'INTERIOR', time: '05 a 07 dias' }
            ]
        },
        RS: {
            name: 'RIO GRANDE DO SUL',
            deliveries: [
                { city: 'PORTO ALEGRE', time: '03 a 04 dias úteis' },
                { city: 'INTERIOR', time: '04 a 06 dias' }
            ]
        }
    };

    if (stateSelect) {
        stateSelect.addEventListener('change', function() {
            const selectedState = this.value;
            const state = stateData[selectedState];
            
            if (state) {
                const deliveryHTML = state.deliveries.map(delivery => `
                    <div class="delivery-item">
                        <h5>${delivery.city}</h5>
                        <p><i class="fas fa-clock me-2"></i>${delivery.time}</p>
                    </div>
                `).join('');

                stateInfo.querySelector('.state-name').textContent = state.name;
                stateInfo.querySelector('.delivery-info').innerHTML = deliveryHTML;
                
                // Animate the new content
                const deliveryItems = stateInfo.querySelectorAll('.delivery-item');
                deliveryItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        item.style.transition = 'all 0.3s ease-out';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100 * index);
                });
            }
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"], a[href^="http"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Verifica se o link é uma âncora interna
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault(); // Impede a ação padrão apenas para âncoras internas
    
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        document.querySelector('.navbar-toggler').click();
                    }
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
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
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            let isValid = true;
            const formElements = this.elements;
            
            for (let i = 0; i < formElements.length; i++) {
                if (formElements[i].type !== 'submit' && formElements[i].hasAttribute('required')) {
                    if (!formElements[i].value.trim()) {
                        isValid = false;
                        formElements[i].classList.add('is-invalid');
                    } else {
                        formElements[i].classList.remove('is-invalid');
                    }
                }
            }
            
            if (isValid) {
                // Show loading state
                const button = this.querySelector('button[type="submit"]');
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
                button.disabled = true;
                
                // Simulate form submission (replace with actual form submission in production)
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check me-2"></i>Mensagem Enviada!';
                    button.classList.add('btn-success');
                    
                    // Reset form after success
                    setTimeout(() => {
                        this.reset();
                        button.innerHTML = originalText;
                        button.classList.remove('btn-success');
                        button.disabled = false;
                    }, 2000);
                }, 1500);
            }
        });
        
        // Real-time validation feedback
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid') && this.value.trim()) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = this.querySelector('input');
            const button = this.querySelector('button');
            const originalIcon = button.innerHTML;
            
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                return;
            }
            
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
            input.disabled = true;
            
            // Simulate form submission
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
    }

    // Solution Cards Hover Effect
    const solutionCards = document.querySelectorAll('.solution-card');
    
    solutionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.hover-content').style.opacity = '1';
            this.querySelector('.hover-content').style.transform = 'scale(1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.hover-content').style.opacity = '0';
            this.querySelector('.hover-content').style.transform = 'scale(0.8)';
        });
    });

    // Navbar Active Link Update on Scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateNavActiveState() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateNavActiveState);
    
    // Initialize active state
    updateNavActiveState();

    // Mobile Menu Toggle Animation
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < heroSection.offsetHeight) {
                heroSection.style.backgroundPosition = `center ${scrollPosition * 0.4}px`;
            }
        });
    }

    // Add scroll reveal animation to features
    const featureCards = document.querySelectorAll('.feature-card');
    
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, 150 * index);
                featureObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    featureCards.forEach(card => {
        card.classList.add('feature-animation');
        featureObserver.observe(card);
    });
});
