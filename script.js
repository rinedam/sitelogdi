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
        if (window.scrollY > 100) {
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
        const prefix = counter.getAttribute('data-prefix') || '';
        let count = 0;
        const duration = 2000; // Duração total da animação em milissegundos
        const frames = 60; // Frames por segundo
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

    // Mapa Interativo do Brasil
    // Carregar o SVG do mapa
    fetch('mapa-brasil.svg')
        .then(response => response.text())
        .then(svgData => {
            // Adicionar IDs aos estados que não têm
            svgData = adicionarIdsAosEstados(svgData);
            
            // Inserir o SVG modificado no DOM
            document.getElementById('brazil-map').innerHTML = svgData;
            
            // Configurar os estados após carregar o SVG
            setTimeout(configurarEstados, 100);
        })
        .catch(error => console.error('Erro ao carregar o mapa:', error));

    // Função para adicionar IDs aos estados que não têm
    function adicionarIdsAosEstados(svgData) {
        // Lista de estados e suas siglas
        const estados = [
            { id: "AC", nome: "Acre" },
            { id: "AL", nome: "Alagoas" },
            { id: "AM", nome: "Amazonas" },
            { id: "AP", nome: "Amapá" },
            { id: "BA", nome: "Bahia" },
            { id: "CE", nome: "Ceará" },
            { id: "DF", nome: "Distrito Federal" },
            { id: "ES", nome: "Espírito Santo" },
            { id: "GO", nome: "Goiás" },
            { id: "MA", nome: "Maranhão" },
            { id: "MG", nome: "Minas Gerais" },
            { id: "MS", nome: "Mato Grosso do Sul" },
            { id: "MT", nome: "Mato Grosso" },
            { id: "PA", nome: "Pará" },
            { id: "PB", nome: "Paraíba" },
            { id: "PE", nome: "Pernambuco" },
            { id: "PI", nome: "Piauí" },
            { id: "PR", nome: "Paraná" },
            { id: "RJ", nome: "Rio de Janeiro" },
            { id: "RN", nome: "Rio Grande do Norte" },
            { id: "RO", nome: "Rondônia" },
            { id: "RR", nome: "Roraima" },
            { id: "RS", nome: "Rio Grande do Sul" },
            { id: "SC", nome: "Santa Catarina" },
            { id: "SE", nome: "Sergipe" },
            { id: "SP", nome: "São Paulo" },
            { id: "TO", nome: "Tocantins" }
        ];
        
        // Verificar quais estados já têm ID no SVG
        const estadosComId = [];
        const regex = /id="([A-Z]{2})"/g;
        let match;
        
        while ((match = regex.exec(svgData)) !== null) {
            estadosComId.push(match[1]);
        }
        
        // Contar os elementos polygon com classe "state"
        const polygonsCount = (svgData.match(/<polygon class="state"/g) || []).length;
        
        // Se já temos todos os estados com ID, retornar o SVG original
        if (estadosComId.length >= estados.length) {
            return svgData;
        }
        
        // Adicionar IDs aos estados que não têm
        let index = 0;
        for (const estado of estados) {
            if (!estadosComId.includes(estado.id)) {
                // Encontrar o próximo polygon sem ID
                const pattern = new RegExp(`<polygon class="state"([^>]*)>`, 'g');
                let count = 0;
                
                svgData = svgData.replace(pattern, function(match) {
                    if (count < index) {
                        count++;
                        return match;
                    }
                    
                    if (count === index) {
                        count++;
                        index++;
                        return `<polygon id="${estado.id}" class="state"$1>`;
                    }
                    
                    return match;
                });
            }
        }
        
        return svgData;
    }

    // Dados dos estados com entrega
    const estadosComEntrega = {
        "AC": false,
        "AL": true,
        "AM": false,
        "AP": false,
        "BA": true,
        "CE": true,
        "DF": true,
        "ES": true,
        "GO": true,
        "MA": true,
        "MG": true,
        "MS": true,
        "MT": true,
        "PA": true,
        "PB": true,
        "PE": true,
        "PI": true,
        "PR": true,
        "RJ": true,
        "RN": true,
        "RO": false,
        "RR": false,
        "RS": true,
        "SC": true,
        "SE": true,
        "SP": true,
        "TO": true
    };

    // Dados de prazo de entrega para capital e interior
    const prazoEntrega = {
        "PA": { capital: "09 a 10 dias úteis", interior: "13 a 15 dias úteis" },
        "MA": { capital: "09 a 10 dias úteis", interior: "13 a 15 dias úteis" },
        "PI": { capital: "09 a 10 dias", interior: "13 a 15 dias" },
        "CE": { capital: "09 a 10 dias úteis", interior: "11 a 13 dias úteis" },
        "RN": { capital: "09 a 10 dias úteis", interior: "11 a 13 dias" },
        "PB": { capital: "08 a 09 dias úteis", interior: "09 a 12 dias" },
        "PE": { capital: "08 a 09 dias úteis", interior: "10 a 12 dias" },
        "AL": { capital: "08 a 09 dias úteis", interior: "10 a 12 dias" },
        "SE": { capital: "07 a 08 dias úteis", interior: "10 a 12 dias" },
        "BA": { capital: "07 a 08 dias úteis", interior: "10 a 12 dias" },
        "TO": { capital: "08 a 09 dias úteis", interior: "10 a 12 dias" },
        "GO": { capital: "04 a 05 dias úteis", interior: "05 a 07 dias" },
        "DF": { capital: "04 a 06 dias úteis", interior: "05 a 07 dias" },
        "ES": { capital: "04 a 06 dias úteis", interior: "05 a 07 dias" },
        "MG": { capital: "03 a 04 dias úteis", interior: "05 a 07 dias" },
        "RS": { capital: "03 a 04 dias úteis", interior: "04 a 06 dias" },
        "MT": { capital: "04 a 05 dias úteis", interior: "06 a 08 dias" },
        "MS": { capital: "03 a 04 dias úteis", interior: "05 a 07 dias" },
        "PR": { capital: "02 a 03 dias úteis", interior: "03 a 05 dias" },
        "SC": { capital: "02 a 03 dias úteis", interior: "03 a 05 dias" },
        "RJ": { capital: "02 a 03 dias úteis", interior: "03 a 04 dias" },
        "SP": { capital: "01 a 02 dias úteis", interior: "02 a 03 dias" }
    };

    // Nomes completos dos estados
    const nomeEstados = {
        "AC": "ACRE",
        "AL": "ALAGOAS",
        "AM": "AMAZONAS",
        "AP": "AMAPÁ",
        "BA": "BAHIA",
        "CE": "CEARÁ",
        "DF": "DISTRITO FEDERAL",
        "ES": "ESPÍRITO SANTO",
        "GO": "GOIÁS",
        "MA": "MARANHÃO",
        "MG": "MINAS GERAIS",
        "MS": "MATO GROSSO DO SUL",
        "MT": "MATO GROSSO",
        "PA": "PARÁ",
        "PB": "PARAÍBA",
        "PE": "PERNAMBUCO",
        "PI": "PIAUÍ",
        "PR": "PARANÁ",
        "RJ": "RIO DE JANEIRO",
        "RN": "RIO GRANDE DO NORTE",
        "RO": "RONDÔNIA",
        "RR": "RORAIMA",
        "RS": "RIO GRANDE DO SUL",
        "SC": "SANTA CATARINA",
        "SE": "SERGIPE",
        "SP": "SÃO PAULO",
        "TO": "TOCANTINS"
    };

    // Função para configurar os estados no mapa
    function configurarEstados() {
        // Selecionar todos os elementos de estado no SVG
        const estados = document.querySelectorAll('.state');
        
        // Configurar cada estado
        estados.forEach(estado => {
            const sigla = estado.id.toUpperCase();
            
            // Remover classes existentes primeiro
            estado.classList.remove('com-entrega', 'sem-entrega');
            
            // Aplicar classe com base na disponibilidade de entrega
            if (estadosComEntrega[sigla]) {
                estado.classList.add('com-entrega');
            } else {
                estado.classList.add('sem-entrega');
            }
            
            // Remover qualquer estilo inline que possa estar afetando o hover
            estado.removeAttribute('style');
            
            // Adicionar evento de clique
            estado.addEventListener('click', function(e) {
                e.preventDefault(); // Prevenir comportamento padrão
                mostrarInformacoesEstado(sigla);
            });
        });
    }

    document.addEventListener('click', function(event) {
        const mapContainer = document.querySelector('.brazil-map');
        const clickedElement = event.target;
        const isState = clickedElement.classList.contains('state');
        const isSvg = clickedElement.tagName === 'svg' || clickedElement.tagName === 'SVG';
        
        // Se o clique foi em um estado, não fazemos nada aqui
        if (isState) {
            return;
        }

        // Se o clique foi fora do mapa OU no SVG do mapa (mas não em um estado)
        if (!mapContainer.contains(clickedElement) || isSvg || clickedElement === mapContainer) {
            // Remove a classe de seleção de todos os estados
            const estados = document.querySelectorAll('.state');
            estados.forEach(estado => {
                estado.classList.remove('estado-selecionado');
        });

        // Limpa as informações de entrega
        const stateInfoTitle = document.querySelector('.state-name');
        const deliveryInfo = document.getElementById('deliveryInfo');
        
        if (stateInfoTitle) {
            stateInfoTitle.textContent = 'Selecione um estado no mapa para ver os prazos';
        }
        
        if (deliveryInfo) {
            deliveryInfo.innerHTML = `
                <div class="delivery-item text-center">
                    <p>Selecione um estado para ver as informações de entrega.</p>
                </div>`;
        }
    }
});

    // Função para mostrar informações do estado selecionado
    function mostrarInformacoesEstado(sigla) {
        const stateInfoTitle = document.querySelector('.state-name');
        const deliveryInfo = document.getElementById('deliveryInfo');
        
        // Remover classe de seleção de todos os estados
        document.querySelectorAll('.state').forEach(el => {
            el.classList.remove('estado-selecionado');
            el.removeAttribute('style');
        });
        
        // Adicionar classe de seleção ao estado clicado
        const estadoSelecionado = document.getElementById(sigla);
        if (estadoSelecionado) {
            estadoSelecionado.classList.add('estado-selecionado');
        }
        
        // Atualizar o título com o nome do estado
        stateInfoTitle.textContent = nomeEstados[sigla];
        
        // Limpar informações anteriores (incluindo a mensagem padrão)
        deliveryInfo.innerHTML = '';
        
        // Verificar se o estado tem entrega
        if (estadosComEntrega[sigla]) {
            // Mostrar informações de prazo de entrega
            const prazo = prazoEntrega[sigla];
            
            // Criar elemento para prazo da capital
            const capitalElement = document.createElement('div');
            capitalElement.className = 'delivery-item';
            capitalElement.innerHTML = `
                <h5>${sigla === 'PA' ? 'BELÉM (E REGIÃO)' : sigla === 'DF' ? 'BRASÍLIA' : 'CAPITAL'}</h5>
                <p><i class="fas fa-clock me-2"></i>${prazo.capital}</p>
            `;
            deliveryInfo.appendChild(capitalElement);
            
            // Criar elemento para prazo do interior (exceto para PA que só tem capital)
            if (sigla !== 'PA') {
                const interiorElement = document.createElement('div');
                interiorElement.className = 'delivery-item';
                interiorElement.innerHTML = `
                    <h5>INTERIOR</h5>
                    <p><i class="fas fa-clock me-2"></i>${prazo.interior}</p>
                `;
                deliveryInfo.appendChild(interiorElement);
            }
            
            // Animar os novos elementos
            const deliveryItems = deliveryInfo.querySelectorAll('.delivery-item');
            deliveryItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease-out';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100 * index);
            });
        } else {
            // Mostrar mensagem de não entrega
            const noDeliveryElement = document.createElement('div');
            noDeliveryElement.className = 'no-delivery-message';
            noDeliveryElement.textContent = 'Não realizamos entrega neste estado';
            deliveryInfo.appendChild(noDeliveryElement);
            
            // Animar o elemento
            noDeliveryElement.style.opacity = '0';
            noDeliveryElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                noDeliveryElement.style.transition = 'all 0.3s ease-out';
                noDeliveryElement.style.opacity = '1';
                noDeliveryElement.style.transform = 'translateY(0)';
            }, 100);
        }
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

    // Rastreador Rápido
    const trackerForm = document.getElementById('trackerForm');
    const trackingStatus = document.getElementById('trackingStatus');
    
    if (trackerForm) {
        trackerForm.addEventListener('submit', function(e) {
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
            
            // Simular rastreamento (em produção, isso seria uma chamada de API real)
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i>';
                
                // Mostrar resultado do rastreamento
                if (trackingStatus) {
                    trackingStatus.classList.remove('d-none');
                    
                    // Gerar um status aleatório para demonstração
                    const statusOptions = [
                        { status: 'Em trânsito', location: 'Centro de Distribuição - São Paulo' },
                        { status: 'Saiu para entrega', location: 'Unidade local - Destino' },
                        { status: 'Aguardando retirada', location: 'Ponto de coleta - Destino' },
                        { status: 'Em processamento', location: 'Centro de Triagem' }
                    ];
                    
                    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
                    
                    trackingStatus.querySelector('.tracking-status').textContent = randomStatus.status;
                    trackingStatus.querySelector('.tracking-location').textContent = randomStatus.location;
                }
                
                setTimeout(() => {
                    button.innerHTML = originalIcon;
                    button.disabled = false;
                    input.disabled = false;
                }, 3000);
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
});
