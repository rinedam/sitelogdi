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

    // Efeito do cabeçalho ao rolar a página
    let lastScrollTop = 0;
    const header = document.querySelector('.header-transparent');
    
    function updateHeader() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
            header.style.transition = 'transform 0.3s ease-in-out';
        } else {
            header.style.transform = 'translateY(0)';
            if (currentScroll > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
        
        lastScrollTop = currentScroll;
    }
    
    window.addEventListener('scroll', updateHeader);
    
    document.addEventListener('mousemove', (e) => {
        // Exibe o cabeçalho quando o mouse está próximo ao topo da página
        if (e.clientY <= 100) { 
            header.style.transform = 'translateY(0)';
            if (window.scrollY > 100) {
                header.classList.add('header-scrolled');
            }
        }
    });

    // Inicia a biblioteca AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 50
    });

    // Animação de contador
    const counters = document.querySelectorAll('.counter');
    
    function startCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const prefix = counter.getAttribute('data-prefix') || '';
        let count = 0;
        const duration = 2000; // Duração total da animação em milissegundos
        const frames = 60; // Quadros por segundo para a animação
        const increment = target / (duration / (1000 / frames));

        const updateCount = () => {
            if (count < target) {
                count = Math.min(count + increment, target);
                counter.innerText = prefix + Math.floor(count);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = prefix + target;
            }
        };

        updateCount();
    }

    // Observador para iniciar a animação do contador quando visível
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

    // Carrega o mapa do Brasil em SVG e o insere na página
    fetch('mapa-brasil.svg')
        .then(response => response.text())
        .then(svgData => {
            const mapContainer = document.getElementById('brazil-map');
            const pointsContainer = document.getElementById('location-points');

            mapContainer.innerHTML = svgData;
            mapContainer.appendChild(pointsContainer);

            configurarEstados();
        })
        .catch(error => console.error('Erro ao carregar o mapa:', error));
        
    // Dados dos estados que possuem entrega
    const estadosComEntrega = {
        "AC": false, "AL": true, "AM": false, "AP": false, "BA": true, "CE": true,
        "DF": true, "ES": true, "GO": true, "MA": true, "MG": true, "MS": true,
        "MT": true, "PA": true, "PB": true, "PE": true, "PI": true, "PR": true,
        "RJ": true, "RN": true, "RO": false, "RR": false, "RS": true, "SC": true,
        "SE": true, "SP": true, "TO": true
    };

    // Prazos de entrega para cada estado
    const prazoEntrega = {
        "PA": { capital: "09 a 11 dias úteis", interior: "13 a 15 dias úteis" },
        "MA": { capital: "09 a 10 dias úteis", interior: "15 a 18 dias úteis" },
        "PI": { capital: "09 a 10 dias úteis", interior: "11 a 13 dias úteis" },
        "CE": { capital: "09 a 10 dias úteis", interior: "11 a 13 dias úteis" },
        "RN": { capital: "09 a 10 dias úteis", interior: "11 a 13 dias úteis" },
        "PB": { capital: "09 a 10 dias úteis", interior: "13 a 15 dias úteis" },
        "PE": { capital: "09 a 10 dias úteis", interior: "11 a 13 dias úteis" },
        "AL": { capital: "09 a 10 dias úteis", interior: "10 a 12 dias úteis" },
        "SE": { capital: "09 a 10 dias úteis", interior: "12 a 14 dias úteis" },
        "BA": { capital: "09 a 10 dias úteis", interior: "13 a 15 dias úteis" },
        "TO": { capital: "09 a 10 dias úteis", interior: "15 a 17 dias úteis" },
        "GO": { capital: "04 a 06 dias úteis", interior: "09 a 10 dias úteis" },
        "DF": { capital: "04 a 06 dias úteis", interior: "05 a 07 dias úteis" },
        "ES": { capital: "04 a 06 dias úteis", interior: "06 a 08 dias úteis" },
        "MG": { capital: "07 a 08 dias úteis", interior: "15 a 17 dias úteis" },
        "RS": { capital: "05 a 06 dias úteis", interior: "06 a 08 dias úteis" },
        "MT": { capital: "07 a 08 dias úteis", interior: "10 a 12 dias úteis" },
        "MS": { capital: "07 a 08 dias úteis", interior: "09 a 11 dias úteis" },
        "PR": { capital: "02 a 04 dias úteis", interior: "08 a 10 dias úteis" },
        "SC": { capital: "02 a 03 dias úteis", interior: "04 a 06 dias úteis" },
        "RJ": { capital: "04 a 05 dias úteis", interior: "05 a 07 dias úteis" },
        "SP": { capital: "04 a 05 dias úteis", interior: "09 a 11 dias úteis" }
    };

    // Nomes completos dos estados
    const nomeEstados = {
        "AC": "ACRE", "AL": "ALAGOAS", "AM": "AMAZONAS", "AP": "AMAPÁ", "BA": "BAHIA",
        "CE": "CEARÁ", "DF": "DISTRITO FEDERAL", "ES": "ESPÍRITO SANTO", "GO": "GOIÁS",
        "MA": "MARANHÃO", "MG": "MINAS GERAIS", "MS": "MATO GROSSO DO SUL", "MT": "MATO GROSSO",
        "PA": "PARÁ", "PB": "PARAÍBA", "PE": "PERNAMBUCO", "PI": "PIAUÍ", "PR": "PARANÁ",
        "RJ": "RIO DE JANEIRO", "RN": "RIO GRANDE DO NORTE", "RO": "RONDÔNIA", "RR": "RORAIMA",
        "RS": "RIO GRANDE DO SUL", "SC": "SANTA CATARINA", "SE": "SERGIPE", "SP": "SÃO PAULO", "TO": "TOCANTINS"
    };

    // Configura as classes e eventos de clique para cada estado no mapa SVG
    function configurarEstados() {
        const elementos = document.querySelectorAll('.state');
        
        elementos.forEach(elemento => {
            const sigla = elemento.id ? elemento.id.toUpperCase() : null;
            
            // Se o elemento não for um estado válido, adiciona uma classe e o ignora
            if (!sigla || !nomeEstados[sigla]) {
                elemento.classList.add('area-nao-estado');
                return; 
            }
            
            elemento.classList.remove('com-entrega', 'sem-entrega');
            
            if (estadosComEntrega[sigla]) {
                elemento.classList.add('com-entrega');
            } else {
                elemento.classList.add('sem-entrega');
            }
            
            elemento.removeAttribute('style');
            
            elemento.addEventListener('click', function() {
                mostrarInformacoesEstado(sigla);
                
                const stateSelect = document.getElementById('stateSelect');
                if (stateSelect) {
                    stateSelect.value = sigla;
                }
            });
        });

        // Configura o evento de mudança no <select> de estados
        const stateSelect = document.getElementById('stateSelect');
        if (stateSelect) {
            stateSelect.addEventListener('change', function(e) {
                const selectedState = e.target.value;
                if (selectedState) {
                    document.querySelectorAll('.state').forEach(estado => {
                        estado.classList.remove('estado-selecionado');
                    });

                    const estadoSelecionado = document.getElementById(selectedState);
                    if (estadoSelecionado) {
                        estadoSelecionado.classList.add('estado-selecionado');
                    }

                    mostrarInformacoesEstado(selectedState);
                }
            });
        }
    }

    // Exibe as informações de entrega para o estado selecionado
    function mostrarInformacoesEstado(sigla) {
        const stateInfoTitle = document.querySelector('.state-name');
        const deliveryInfo = document.getElementById('deliveryInfo');
        
        document.querySelectorAll('.state').forEach(estado => {
            estado.classList.remove('estado-selecionado');
        });
        
        const estadoSelecionado = document.getElementById(sigla);
        if (estadoSelecionado) {
            estadoSelecionado.classList.add('estado-selecionado');
        }
        
        stateInfoTitle.textContent = nomeEstados[sigla];
        deliveryInfo.innerHTML = '';
        
        if (estadosComEntrega[sigla]) {
            const prazo = prazoEntrega[sigla];
            if (prazo) {
                deliveryInfo.innerHTML = `
                    <div class="delivery-item">
                        <h5>Capital</h5>
                        <p><i class="fas fa-clock"></i> ${prazo.capital}</p>
                    </div>
                    <div class="delivery-item">
                        <h5>Interior</h5>
                        <p><i class="fas fa-clock"></i> ${prazo.interior}</p>
                    </div>
                `;
            }
        } else {
            deliveryInfo.innerHTML = `
                <div class="delivery-item text-center">
                    <p class="no-delivery-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <span>Não realizamos entregas neste estado.</span>
                    </p>
                </div>
            `;
        }

        // Mostra informações extras para estados específicos (com bases)
        const estadosComInfo = ['PR', 'SP', 'SC', 'BA'];
        const stateExtraInfo = document.getElementById('stateExtraInfo');
        const allStateDetails = document.querySelectorAll('.state-details');
        
        if (estadosComInfo.includes(sigla)) {
            stateExtraInfo.classList.remove('d-none');
            allStateDetails.forEach(detail => detail.style.display = 'none'); // Esconde todos
            
            const stateDetails = document.getElementById(`${sigla}-details`); // Mostra o correto
            if (stateDetails) {
                stateDetails.style.display = 'block';
            }
        } else {
            stateExtraInfo.classList.add('d-none');
        }
    }

    // Rolagem suave para links âncora
    document.querySelectorAll('a[href^="#"], a[href^="http"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Verifica se o link é uma âncora interna
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
    
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    // Fecha o menu mobile (se estiver aberto) antes de rolar
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        document.querySelector('.navbar-toggler').click();
                    }
                    
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });

    // Botão "Voltar ao Topo"
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

    // Validação e envio do formulário de contato
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
                const button = this.querySelector('button[type="submit"]');
                const originalText = button.innerHTML;
                
                // Mostra um feedback de carregamento no botão
                button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
                button.disabled = true;
                
                // Simula o envio do formulário (substituir pela lógica de envio real)
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check me-2"></i>Mensagem Enviada!';
                    button.classList.add('btn-success');
                    
                    // Reseta o formulário após o sucesso
                    setTimeout(() => {
                        this.reset();
                        button.innerHTML = originalText;
                        button.classList.remove('btn-success');
                        button.disabled = false;
                    }, 2000);
                }, 1500);
            }
        });
        
        // Feedback de validação em tempo real ao sair do campo
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

    // Efeito de hover nos cards de solução
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

    // Atualiza o link ativo na barra de navegação conforme a rolagem da página
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
    updateNavActiveState(); // Garante o estado ativo no carregamento da página

    // Animação do botão do menu mobile
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    // Garante que a página carregue no topo
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Slideshow da seção principal
    function initHeroSlideshow() {
        const slides = document.querySelectorAll('.hero-slideshow .slide');
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            });
            
            slides[index].classList.add('active');
            slides[index].style.opacity = '1';
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        if (slides.length > 0) {
            showSlide(0);
            setInterval(nextSlide, 3000);
        }
    }

    initHeroSlideshow();
});

// Carrossel de imagens para a seção de Logística
document.addEventListener('DOMContentLoaded', function() {
    const logisticaCarousel = document.querySelector('.logistica-carousel');
    const carouselInner = document.querySelector('.logistica-carousel-inner');
    const prevBtn = document.querySelector('.logistica-carousel-prev');
    const nextBtn = document.querySelector('.logistica-carousel-next');
    
    if (!logisticaCarousel || !carouselInner || !prevBtn || !nextBtn) {
        return;
    }
    
    let currentIndex = 0;
    const slides = carouselInner.querySelectorAll('.logistica-carousel-item');
    const totalSlides = slides.length;
    
    // Cria os indicadores de slide dinamicamente
    const indicatorsContainer = document.querySelector('.logistica-carousel-indicators');
    indicatorsContainer.innerHTML = ''; 
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'logistica-carousel-indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
        });
        indicatorsContainer.appendChild(indicator);
    }
    
    if (totalSlides === 0) {
        return;
    }
    
    updateCarousel();
    
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    });
    
    function updateCarousel() {
        const slides = carouselInner.querySelectorAll('.logistica-carousel-item');
        
        slides.forEach((slide) => {
            slide.classList.remove('active');
            slide.style.display = 'none';
            slide.style.animation = 'none';
        });
        
        slides[currentIndex].classList.add('active');
        slides[currentIndex].style.display = 'block';
        slides[currentIndex].style.animation = 'fadeIn 0.5s ease-in-out';
        
        document.querySelectorAll('.logistica-carousel-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Suporte a swipe em dispositivos móveis
    let touchStartX = 0;
    carouselInner.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
    carouselInner.addEventListener('touchend', (e) => {
        if (e.changedTouches[0].screenX < touchStartX) nextBtn.click();
        else if (e.changedTouches[0].screenX > touchStartX) prevBtn.click();
    });

    // Autoplay do carrossel
    let autoplayInterval;
    const startAutoplay = () => { autoplayInterval = setInterval(() => nextBtn.click(), 5000); };
    const stopAutoplay = () => { clearInterval(autoplayInterval); };

    startAutoplay();
    logisticaCarousel.addEventListener('mouseenter', stopAutoplay);
    logisticaCarousel.addEventListener('touchstart', stopAutoplay);
    logisticaCarousel.addEventListener('mouseleave', startAutoplay);
});

// Configura os seletores de bases de cada estado
function setupBaseSelectors() {
    function setupSelect(selectId, stateId) {
        const select = document.getElementById(selectId);
        if (select) {
            select.addEventListener('change', function() {
                document.querySelectorAll(`#${stateId}-details .base-info`).forEach(info => {
                    info.classList.add('d-none');
                });
                
                const selectedBase = this.value;
                if (selectedBase) {
                    const baseInfo = document.getElementById(`${selectedBase}-info`);
                    if (baseInfo) {
                        baseInfo.classList.remove('d-none');
                    }
                }
            });
        }
    }

    // Configura os selects para cada estado com bases
    setupSelect('prBaseSelect', 'PR');
    setupSelect('spBaseSelect', 'SP');
    setupSelect('scBaseSelect', 'SC');
    setupSelect('baBaseSelect', 'BA');
}

document.addEventListener('DOMContentLoaded', setupBaseSelectors);