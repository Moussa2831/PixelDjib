// ==================== VARIABLES GLOBALES ====================
let lastScrollTop = 0;
let ticking = false;
let loadingTimeout = null;
let particleInterval = null;

// ==================== NAVIGATION MOBILE ====================
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }
    
    init() {
        if (!this.hamburger || !this.navMenu) {
            console.warn('⚠️ Éléments de navigation non trouvés');
            return;
        }
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Toggle menu mobile
        this.hamburger.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // Fermer le menu lors du clic sur un lien
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Fermer le menu lors du clic en dehors
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Animation du hamburger
        this.animateHamburger();
        
        // Empêcher le scroll du body quand le menu est ouvert
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
        this.animateHamburger();
    }
    
    animateHamburger() {
        const spans = this.hamburger.querySelectorAll('span');
        if (spans.length < 3) return;
        
        if (this.hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
}

// ==================== NAVBAR AVEC EFFET DE SCROLL ====================
class NavbarScrollEffect {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }
    
    init() {
        if (!this.navbar) {
            console.warn('⚠️ Navbar non trouvée');
            return;
        }
        
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                this.updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Effet de masquage/affichage
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll vers le bas - cacher la navbar
            this.navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scroll vers le haut - montrer la navbar
            this.navbar.style.transform = 'translateY(0)';
        }
        
        // Effet de transparence
        if (scrollTop > 50) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.backdropFilter = 'blur(20px)';
            this.navbar.style.boxShadow = '0 2px 30px rgba(0,0,0,0.1)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            this.navbar.style.backdropFilter = 'blur(10px)';
            this.navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    }
}

// ==================== SMOOTH SCROLLING ====================
class SmoothScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e));
        });
    }
    
    handleClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Compensation pour la navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// ==================== ANIMATIONS DE SCROLL ====================
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        this.createObserver();
        this.setupElements();
    }
    
    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);
    }
    
    setupElements() {
        // Attendre que le DOM soit complètement chargé
        setTimeout(() => {
            const animatedElements = document.querySelectorAll(
                '.service-card, .project-card, .about-text, .contact-item, .section-title'
            );
            
            animatedElements.forEach((el, index) => {
                el.classList.add('fade-in');
                el.style.opacity = '0';
                el.style.transform = 'translateY(50px)';
                el.style.transition = `all 0.6s ease ${index * 0.1}s`;
                this.observer.observe(el);
            });
        }, 100);
    }
    
    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.classList.add('visible');
    }
}

// ==================== EFFET DE FRAPPE (TYPEWRITER) ====================
class TypeWriter {
    constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isActive = true;
    }
    
    start() {
        if (this.element && this.isActive) {
            this.type();
        }
    }
    
    type() {
        if (!this.isActive) return;
        
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
    
    stop() {
        this.isActive = false;
    }
}

// ==================== ANIMATIONS DE COMPTEUR ====================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat h3');
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const target = parseInt(text.replace(/\D/g, ''));
        
        if (isNaN(target)) return;
        
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
                this.celebrateCounter(element);
            }
        };
        
        updateCounter();
    }
    
    celebrateCounter(element) {
        element.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }
}

// ==================== SYSTÈME DE NOTIFICATIONS ====================
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
    }
    
    createContainer() {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        return container;
    }
    
    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${icons[type]}"></i>
                <span>${message}</span>
                <button class="close-notification" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-left: auto;
                ">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            margin-bottom: 10px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        this.container.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Fermeture manuelle
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            this.hide(notification);
        });
        
        // Fermeture automatique
        setTimeout(() => {
            this.hide(notification);
        }, duration);
        
        return notification;
    }
    
    hide(notification) {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }
}

// ==================== GESTION DU FORMULAIRE DE CONTACT ====================
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }
    
    init() {
        if (!this.form) {
            console.warn('⚠️ Formulaire de contact non trouvé');
            return;
        }
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            return;
        }
        
        this.submitForm(formData);
    }
    
    getFormData() {
        const inputs = this.form.querySelectorAll('input, textarea');
        const data = {};
        
        inputs.forEach(input => {
            if (input.type === 'text' && !data.name) {
                data.name = input.value.trim();
            } else if (input.type === 'email') {
                data.email = input.value.trim();
            } else if (input.type === 'text' && data.name) {
                data.subject = input.value.trim();
            } else if (input.tagName === 'TEXTAREA') {
                data.message = input.value.trim();
            }
        });
        
        return data;
    }
    
    validateForm(data) {
        const errors = [];
        
        if (!data.name) errors.push('Le nom est requis');
        if (!data.email) errors.push('L\'email est requis');
        if (!data.subject) errors.push('Le sujet est requis');
        if (!data.message) errors.push('Le message est requis');
        
              if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Email invalide');
        }
        
        if (errors.length > 0) {
            this.showErrors(errors);
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showErrors(errors) {
        errors.forEach(error => {
            if (window.notifications) {
                window.notifications.show(error, 'error', 3000);
            } else {
                console.error('❌', error);
            }
        });
        
        // Animation des champs invalides
        this.animateInvalidFields();
    }
    
    animateInvalidFields() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#e74c3c';
                input.style.animation = 'shake 0.5s ease-in-out';
                
                setTimeout(() => {
                    input.style.animation = '';
                    input.style.borderColor = '';
                }, 500);
            }
        });
    }
    
    submitForm(data) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Animation de soumission
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulation d'envoi (remplacer par vraie logique d'envoi)
        setTimeout(() => {
            this.handleSubmitSuccess(submitBtn, originalText);
            console.log('📧 Données du formulaire:', data);
        }, 2000);
    }
    
    handleSubmitSuccess(submitBtn, originalText) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
        submitBtn.style.background = '#27ae60';
        
        if (window.notifications) {
            window.notifications.show('Votre message a été envoyé avec succès !', 'success');
        }
        
        // Effet de confettis
        this.createConfetti();
        
        // Reset du formulaire
        setTimeout(() => {
            this.form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }
    
    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#ffd89b', '#19547b'];
        const confettiCount = 30;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                z-index: 10000;
                pointer-events: none;
                animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
                transform: rotate(${Math.random() * 360}deg);
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    }
}

// ==================== ÉCRAN DE CHARGEMENT ====================
class LoadingScreen {
    constructor() {
        this.createLoader();
    }
    
    createLoader() {
        // Vérifier si le loader existe déjà
        if (document.querySelector('.loading-screen')) {
            return;
        }
        
        const loader = document.createElement('div');
        loader.className = 'loading-screen';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            transition: opacity 0.5s ease;
        `;
        
        loader.innerHTML = `
            <div style="text-align: center; color: white;">
                <h2 style="margin: 0 0 20px 0; font-size: 2rem;">PixelDjib <span style="color: #ffd89b;">Technologie</span></h2>
                <div class="spinner" style="
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px auto;
                "></div>
                <p style="margin: 0; opacity: 0.8;">Chargement en cours...</p>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        // Supprimer le loader après le chargement
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                    }
                }, 500);
            }, 1000);
        });
    }
}

// ==================== EFFET PARALLAX ====================
class ParallaxEffect {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.setupElements();
        this.bindEvents();
    }
    
    setupElements() {
        // Icônes flottantes
        const floatingIcons = document.querySelectorAll('.floating-icons i');
        floatingIcons.forEach((icon, index) => {
            this.elements.push({
                element: icon,
                speed: 0.2 + (index * 0.1),
                direction: index % 2 === 0 ? 1 : -1
            });
        });
    }
    
    bindEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateParallax() {
        const scrollTop = window.pageYOffset;
        
        this.elements.forEach(item => {
            const { element, speed, direction } = item;
            const yPos = scrollTop * speed * direction;
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
}

// ==================== MODAL D'IMAGES ====================
class ImageModal {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.project-image img, .about-image img')) {
                this.openModal(e.target.src, e.target.alt);
            }
        });
    }
    
    openModal(imageSrc, imageAlt) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="position: relative; max-width: 90%; max-height: 90%;">
                <img src="${imageSrc}" alt="${imageAlt}" style="
                    max-width: 100%;
                    max-height: 100%;
                    border-radius: 10px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                ">
                <button class="modal-close" style="
                    position: absolute;
                    top: -40px;
                    right: -40px;
                    background: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    font-size: 1.2rem;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animation d'ouverture
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // Fermeture
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Fermeture avec Escape
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
    }
}

// ==================== ANIMATIONS DES ICÔNES DE SERVICE ====================
class ServiceIconAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        const serviceIcons = document.querySelectorAll('.service-icon');
        
        serviceIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.animation = 'bounce 0.6s ease-in-out';
            });
            
            icon.addEventListener('animationend', () => {
                icon.style.animation = '';
            });
        });
    }
}

// ==================== SYSTÈME DE FILTRAGE DES PROJETS ====================
class ProjectFilter {
    constructor() {
        this.projects = document.querySelectorAll('.project-card');
        this.init();
    }
    
    init() {
        // Cette fonction peut être étendue pour ajouter des filtres
        console.log(`📁 ${this.projects.length} projets trouvés`);
    }
    
    filterProjects(category) {
        this.projects.forEach(project => {
            if (category === 'all' || project.dataset.category === category) {
                project.style.display = 'block';
                project.style.animation = 'fadeInUp 0.5s ease';
            } else {
                project.style.display = 'none';
            }
        });
    }
}

// ==================== GESTION DES PERFORMANCES ====================
class PerformanceOptimizer {
    constructor() {
        this.isLowPerformance = this.detectLowPerformance();
        this.init();
    }
    
    detectLowPerformance() {
        // Détecter les appareils moins puissants
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
        const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        
        return isMobile || lowCores || lowMemory;
    }
    
    init() {
        if (this.isLowPerformance) {
            this.optimizeForLowPerformance();
        }
    }
    
    optimizeForLowPerformance() {
        // Réduire les animations
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        
        // Désactiver certains effets
        const heavyEffects = document.querySelectorAll('.floating-icons');
        heavyEffects.forEach(effect => {
            effect.style.display = 'none';
        });
        
        console.log('🔧 Mode performance optimisée activé');
    }
}

// ==================== INITIALISATION PRINCIPALE ====================
class App {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            console.log('🚀 Initialisation de PixelDjib Technologie...');
            
            // Écran de chargement
            this.components.loadingScreen = new LoadingScreen();
            
            // Optimisation des performances
            this.components.performanceOptimizer = new PerformanceOptimizer();
            
            // Navigation
            this.components.mobileNavigation = new MobileNavigation();
            this.components.navbarScrollEffect = new NavbarScrollEffect();
            this.components.smoothScrolling = new SmoothScrolling();
            
            // Animations
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.counterAnimation = new CounterAnimation();
            this.components.parallaxEffect = new ParallaxEffect();
            this.components.serviceIconAnimations = new ServiceIconAnimations();
            
            // Fonctionnalités
            this.components.notificationSystem = new NotificationSystem();
            this.components.contactForm = new ContactForm();
            this.components.imageModal = new ImageModal();
            this.components.projectFilter = new ProjectFilter();
            
            // Rendre le système de notifications global
            window.notifications = this.components.notificationSystem;
            
            // Initialiser l'effet de frappe après un délai
            setTimeout(() => {
                this.initTypeWriter();
            }, 1500);
            
            console.log('✅ Toutes les fonctionnalités de base sont chargées !');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
        }
    }
    
    initTypeWriter() {
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) {
            const texts = [
                'PixelDjib Technologie',
                'Innovation & Excellence',
                'Solutions Digitales',
                'PixelDjib Technologie'
            ];
            
            const originalText = heroTitle.textContent;
            this.components.typeWriter = new TypeWriter(heroTitle, texts, 100, 50, 3000);
            this.components.typeWriter.start();
        }
    }
    
    // Méthode pour nettoyer les composants
    destroy() {
        try {
            // Arrêter le typewriter
            if (this.components.typeWriter) {
                this.components.typeWriter.stop();
            }
            
            // Nettoyer les timers globaux
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
            }
            if (particleInterval) {
                clearInterval(particleInterval);
            }
            
            console.log('🧹 Nettoyage des composants effectué');
        } catch (error) {
            console.error('❌ Erreur lors du nettoyage:', error);
        }
    }
}

// ==================== STYLES CSS DYNAMIQUES ====================
function addDynamicStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
        /* Animations pour les notifications */
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        /* Animation de secousse pour les erreurs */
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        /* Animation de pulsation */
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        /* Animation de rotation pour le spinner */
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Animation de chute pour les confettis */
        @keyframes confetti-fall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        /* Animation de rebond */
        @keyframes bounce {
            0%, 20%, 60%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-20px);
            }
            80% {
                transform: translateY(-10px);
            }
        }
        
        /* Animation de fondu */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Styles pour les éléments cachés en mode performance */
        .page-hidden * {
            animation-play-state: paused !important;
        }
        
        /* Styles pour les éléments fade-in */
        .fade-in {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.6s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Styles pour le menu mobile */
        .hamburger span {
            transition: all 0.3s ease;
        }
        
        /* Styles pour la navbar */
        .navbar {
            transition: all 0.3s ease;
        }
        
        /* Styles responsifs pour les notifications */
        @media (max-width: 768px) {
            .notification-container {
                right: 10px;
                left: 10px;
            }
            
            .notification {
                max-width: none;
            }
        }
        
        /* Styles pour les modales d'images */
        .image-modal img {
            transition: transform 0.3s ease;
        }
        
        .image-modal img:hover {
            transform: scale(1.02);
        }
        
        /* Amélioration de l'accessibilité */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        /* Styles pour les focus */
        button:focus,
        a:focus,
        input:focus,
        textarea:focus {
            outline: 2px solid #667eea;
            outline-offset: 2px;
        }
        
        /* Amélioration du contraste */
        .notification {
            font-weight: 500;
        }
        
        /* Styles pour les états de chargement */
        .loading-state {
            pointer-events: none;
            opacity: 0.7;
        }
        
        /* Animation pour les cartes au survol */
        .service-card,
        .project-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .service-card:hover,
        .project-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
    `;
    
    document.head.appendChild(styles);
}

// ==================== UTILITAIRES GLOBAUX ====================
window.PixelDjibCore = {
    // Fonction de débogage
    debug: () => {
        console.log('🔍 État des composants PixelDjib Core:');
        if (window.pixelDjibApp) {
            Object.keys(window.pixelDjibApp.components).forEach(key => {
                console.log(`${key}:`, window.pixelDjibApp.components[key] ? '✅' : '❌');
            });
        }
    },
    
    // Fonction pour recharger les animations
    reloadAnimations: () => {
        if (window.pixelDjibApp && window.pixelDjibApp.components.scrollAnimations) {
            window.pixelDjibApp.components.scrollAnimations = new ScrollAnimations();
            console.log('🔄 Animations rechargées');
        }
    },
    
    // Fonction pour afficher une notification
    notify: (message, type = 'info') => {
        if (window.notifications) {
            window.notifications.show(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    },
    
    // Fonction pour obtenir les statistiques de performance
    getPerformanceStats: () => {
        if (performance && performance.getEntriesByType) {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
                domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
                firstPaint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0),
                timestamp: Date.now()
            };
        }
        return null;
    }
};

// ==================== GESTION DES ERREURS GLOBALES ====================
window.addEventListener('error', (e) => {
    console.error('❌ Erreur JavaScript détectée:', e.error);
    
    // En mode développement, afficher une notification
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        if (window.notifications) {
            window.notifications.show(`Erreur: ${e.error.message}`, 'error', 5000);
        }
    }
});

// ==================== GESTION DES PROMESSES REJETÉES ====================
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promesse rejetée non gérée:', e.reason);
    
    // En mode développement
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        if (window.notifications) {
            window.notifications.show('Erreur de promesse détectée', 'warning', 3000);
        }
    }
});

// ==================== NETTOYAGE AVANT FERMETURE ====================
window.addEventListener('beforeunload', () => {
    if (window.pixelDjibApp) {
        window.pixelDjibApp.destroy();
    }
});

// ==================== GESTION DE LA VISIBILITÉ DE LA PAGE ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Mettre en pause les animations coûteuses
        document.documentElement.classList.add('page-hidden');
        console.log('⏸️ Page cachée - optimisation activée');
    } else {
        // Reprendre les animations
        document.documentElement.classList.remove('page-hidden');
        console.log('▶️ Page visible - animations reprises');
    }
});

// ==================== INITIALISATION AUTOMATIQUE ====================
// Ajouter les styles dynamiques
addDynamicStyles();

// Initialiser l'application
window.pixelDjibApp = new App();

// ==================== EASTER EGG - KONAMI CODE ====================
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Effet arc-en-ciel
    document.body.style.animation = 'rainbow 2s infinite';
    
    // Notification spéciale
    if (window.notifications) {
        window.notifications.show('🎉 Code Konami activé ! Easter egg découvert !', 'success', 5000);
    }
    
    // Confettis
    if (window.pixelDjibApp && window.pixelDjibApp.components.contactForm) {
        window.pixelDjibApp.components.contactForm.createConfetti();
    }
    
    // Retour à la normale
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10000);
    
    console.log('🎮 Easter egg activé ! Bravo !');
}

// ==================== AJOUT DE L'ANIMATION RAINBOW POUR L'EASTER EGG ====================
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// ==================== MESSAGE DE BIENVENUE ====================
console.log(`
🎯 PixelDjib Technologie - Script Principal v1.0
═══════════════════════════════════════════════

✨ Fonctionnalités chargées:
   📱 Navigation mobile responsive
   🎨 Animations de scroll avancées
   📧 Formulaire de contact intelligent
   🖼️  Modal d'images avec zoom
   📊 Compteurs animés
   🎭 Effet parallax
   🔔 Système de notifications
   ⚡ Optimisation des performances
   🎮 Easter egg (code Konami)

🔧 Commandes de débogage:
   PixelDjibCore.debug() - État des composants
   PixelDjibCore.notify(message, type) - Notification
   PixelDjibCore.getPerformanceStats() - Statistiques

🚀 Système principal opérationnel !
`);

// Export pour utilisation avec des modules (optionnel)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, PixelDjibCore: window.PixelDjibCore };
}
