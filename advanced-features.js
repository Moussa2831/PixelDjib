// ==================== EFFET MATRIX RAIN ====================
class MatrixRain {
    constructor() {
        this.container = document.getElementById('matrixRain');
        if (!this.container) {
            console.warn('⚠️ Element #matrixRain non trouvé');
            return;
        }
        
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.columns = Math.floor(window.innerWidth / 20);
        this.drops = [];
        this.animationId = null;
        this.intervalId = null;
        
        this.init();
    }
    
    init() {
        // Initialiser les gouttes
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
        
        this.createRain();
        this.animate();
    }
    
    createRain() {
        // Vider le container d'abord
        this.container.innerHTML = '';
        
        for (let i = 0; i < this.columns; i++) {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.style.left = i * 20 + 'px';
            char.style.position = 'absolute';
            char.style.color = '#00ff00';
            char.style.fontSize = '14px';
            char.style.fontFamily = 'monospace';
            char.textContent = this.chars[Math.floor(Math.random() * this.chars.length)];
            char.style.animationDuration = (Math.random() * 3 + 2) + 's';
            char.style.animationDelay = Math.random() * 2 + 's';
            this.container.appendChild(char);
        }
    }
    
    animate() {
        this.intervalId = setInterval(() => {
            const chars = this.container.querySelectorAll('.matrix-char');
            chars.forEach(char => {
                if (Math.random() > 0.95) {
                    char.textContent = this.chars[Math.floor(Math.random() * this.chars.length)];
                }
            });
        }, 100);
    }
    
    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.animationId) {
            clearTimeout(this.animationId);
        }
    }
}

// ==================== SYSTÈME DE THÈME DYNAMIQUE ====================
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
    }
    
    createThemeToggle() {
        // Vérifier si le bouton existe déjà
        if (document.querySelector('.theme-toggle')) {
            return;
        }
        
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.innerHTML = '<i class="fas fa-moon"></i>';
        toggle.setAttribute('aria-label', 'Changer de thème');
        toggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        // Ajouter le bouton au body
        document.body.appendChild(toggle);
        
        // Effet hover
        toggle.addEventListener('mouseenter', () => {
            toggle.style.transform = 'scale(1.1)';
            toggle.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
        });
        
        toggle.addEventListener('mouseleave', () => {
            toggle.style.transform = 'scale(1)';
            toggle.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });
        
        toggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        const toggle = document.querySelector('.theme-toggle i');
        if (toggle) {
            toggle.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        // Appliquer les styles du thème
        if (theme === 'dark') {
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#ffffff';
            
            // Appliquer aux cartes
            const cards = document.querySelectorAll('.service-card, .project-card');
            cards.forEach(card => {
                card.style.backgroundColor = '#2d2d2d';
                card.style.borderColor = '#404040';
                card.style.color = '#ffffff';
            });
            
            // Appliquer à la navbar
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
            }
        } else {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            
            // Restaurer les cartes
            const cards = document.querySelectorAll('.service-card, .project-card');
            cards.forEach(card => {
                card.style.backgroundColor = '';
                card.style.borderColor = '';
                card.style.color = '';
            });
            
            // Restaurer la navbar
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.backgroundColor = '';
            }
        }
        
        // Animer la transition
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
}

// ==================== GESTIONNAIRE DE PERFORMANCE ====================
class PerformanceManager {
    constructor() {
        this.isLowPerformance = this.detectLowPerformance();
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.monitoringActive = false;
        this.init();
    }
    
    detectLowPerformance() {
        try {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
            const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
            const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
            
            return slowConnection || lowMemory || lowCores;
        } catch (error) {
            console.warn('Erreur détection performance:', error);
            return false;
        }
    }
    
    init() {
        if (this.isLowPerformance) {
            this.optimizeForLowPerformance();
        }
        
        this.monitorPerformance();
    }
    
    optimizeForLowPerformance() {
        // Réduire les animations
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        
        // Désactiver certains effets
        const heavyEffects = document.querySelectorAll('.morphing-shapes, .matrix-rain, .floating-icons');
        heavyEffects.forEach(effect => {
            effect.style.display = 'none';
        });
        
        // Réduire le nombre de particules
        document.documentElement.style.setProperty('--particle-count', '10');
        
        console.log('🔧 Mode performance optimisée activé');
    }
    
    monitorPerformance() {
        if (this.monitoringActive) return;
        this.monitoringActive = true;
        
        const checkFPS = () => {
            this.frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - this.lastTime >= 1000) {
                const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                
                if (fps < 30 && !this.isLowPerformance) {
                    console.warn('⚠️ FPS faible détecté, activation du mode performance');
                    this.optimizeForLowPerformance();
                    this.isLowPerformance = true;
                }
                
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
            
            if (this.monitoringActive) {
                requestAnimationFrame(checkFPS);
            }
        };
        
        requestAnimationFrame(checkFPS);
    }
    
    stopMonitoring() {
        this.monitoringActive = false;
    }
}

// ==================== SYSTÈME DE RACCOURCIS CLAVIER ====================
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = {
            'KeyH': () => this.scrollToSection('hero'),
            'KeyS': () => this.scrollToSection('services'),
            'KeyP': () => this.scrollToSection('projects'),
            'KeyC': () => this.scrollToSection('contact'),
            'KeyT': () => window.themeManager?.toggleTheme(),
            'Escape': () => this.closeModals(),
            'KeyN': () => this.showNotificationDemo()
        };
        
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.createHelpModal();
    }
    
    handleKeydown(e) {
        // Ignorer si l'utilisateur tape dans un input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Vérifier si Ctrl/Cmd est pressé
        if (e.ctrlKey || e.metaKey) {
            const shortcut = this.shortcuts[e.code];
            if (shortcut) {
                e.preventDefault();
                shortcut();
            }
        }
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId) || document.querySelector(`.${sectionId}`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            if (window.notifications) {
                window.notifications.show(`Navigation vers ${sectionId}`, 'info', 2000);
            }
        }
    }
    
    closeModals() {
        const modals = document.querySelectorAll('.image-modal, .help-modal, .feedback-modal');
        modals.forEach(modal => {
            if (modal.classList.contains('modal-open')) {
                modal.classList.remove('modal-open');
                setTimeout(() => modal.remove(), 300);
            }
        });
    }
    
    showNotificationDemo() {
        const messages = [
            'Raccourci clavier activé ! 🎉',
            'Vous maîtrisez les raccourcis ! 💪',
            'Navigation rapide activée ! ⚡'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        if (window.notifications) {
            window.notifications.show(randomMessage, 'success');
        } else {
            console.log(randomMessage);
        }
    }
    
    createHelpModal() {
        // Vérifier si le bouton existe déjà
        if (document.querySelector('.help-button')) {
            return;
        }
        
        const helpButton = document.createElement('button');
        helpButton.className = 'help-button';
        helpButton.innerHTML = '<i class="fas fa-question"></i>';
        helpButton.setAttribute('aria-label', 'Aide et raccourcis');
        helpButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(helpButton);
        
        // Effet hover
        helpButton.addEventListener('mouseenter', () => {
            helpButton.style.transform = 'scale(1.1)';
        });
        
        helpButton.addEventListener('mouseleave', () => {
            helpButton.style.transform = 'scale(1)';
        });
        
        helpButton.addEventListener('click', () => {
            this.showHelpModal();
        });
    }
    
    showHelpModal() {
        // Fermer les modales existantes
        this.closeModals();
        
        const modal = document.createElement('div');
        modal.className = 'help-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="modal-backdrop" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            "></div>
            <div class="modal-content" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            ">
                <div class="help-content">
                                        <h3 style="margin: 0 0 20px 0; color: #333; text-align: center;">Raccourcis Clavier</h3>
                    <div class="shortcuts-list" style="display: flex; flex-direction: column; gap: 15px;">
                        <div class="shortcut-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                            <kbd style="background: #e9ecef; padding: 5px 10px; border-radius: 5px; font-family: monospace; border: 1px solid #dee2e6;">Ctrl + H</kbd>
                            <span style="color: #666;">Aller à l'accueil</span>
                        </div>
                        <div class="shortcut-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                            <kbd style="background: #e9ecef; padding: 5px 10px; border-radius: 5px; font-family: monospace; border: 1px solid #dee2e6;">Ctrl + S</kbd>
                            <span style="color: #666;">Aller aux services</span>
                        </div>
                        <div class="shortcut-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                            <kbd style="background: #e9ecef; padding: 5px 10px; border-radius: 5px; font-family: monospace; border: 1px solid #dee2e6;">Ctrl + P</kbd>
                            <span style="color: #666;">Aller aux projets</span>
                        </div>
                        <div class="shortcut-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                            <kbd style="background: #e9ecef; padding: 5px 10px; border-radius: 5px; font-family: monospace; border: 1px solid #dee2e6;">Ctrl + C</kbd>
                            <span style="color: #666;">Aller au contact</span>
                        </div>
                        <div class="shortcut-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                            <kbd style="background: #e9ecef; padding: 5px 10px; border-radius: 5px; font-family: monospace; border: 1px solid #dee2e6;">Ctrl + T</kbd>
                            <span style="color: #666;">Changer de thème</span>
                        </div>
                        <div class="shortcut-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                            <kbd style="background: #e9ecef; padding: 5px 10px; border-radius: 5px; font-family: monospace; border: 1px solid #dee2e6;">Escape</kbd>
                            <span style="color: #666;">Fermer les modales</span>
                        </div>
                    </div>
                </div>
                <button class="modal-close" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #999;
                    transition: color 0.3s ease;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('modal-open');
            modal.style.opacity = '1';
        }, 10);
        
        // Fermeture
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        // Hover effect pour le bouton close
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = '#333';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = '#999';
        });
    }
}

// ==================== SYSTÈME DE SAUVEGARDE DES PRÉFÉRENCES ====================
class PreferencesManager {
    constructor() {
        this.preferences = this.loadPreferences();
        this.init();
    }
    
    loadPreferences() {
        try {
            const saved = localStorage.getItem('userPreferences');
            return saved ? JSON.parse(saved) : {
                animations: true,
                particles: true,
                sound: false,
                reducedMotion: false
            };
        } catch (error) {
            console.warn('Erreur chargement préférences:', error);
            return {
                animations: true,
                particles: true,
                sound: false,
                reducedMotion: false
            };
        }
    }
    
    savePreferences() {
        try {
            localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
        } catch (error) {
            console.warn('Erreur sauvegarde préférences:', error);
        }
    }
    
    init() {
        this.applyPreferences();
        this.createPreferencesPanel();
    }
    
    applyPreferences() {
        if (!this.preferences.animations) {
            document.documentElement.style.setProperty('--animation-duration', '0s');
        }
        
        if (!this.preferences.particles) {
            const particles = document.querySelectorAll('.morphing-shapes, .floating-icons');
            particles.forEach(p => p.style.display = 'none');
        }
        
        if (this.preferences.reducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        }
    }
    
    createPreferencesPanel() {
        // Vérifier si le panel existe déjà
        if (document.querySelector('.preferences-panel')) {
            return;
        }
        
        const panel = document.createElement('div');
        panel.className = 'preferences-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            right: -300px;
            transform: translateY(-50%);
            width: 300px;
            background: white;
            border-radius: 15px 0 0 15px;
            box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
            transition: right 0.3s ease;
            z-index: 1000;
            overflow: hidden;
        `;
        
        panel.innerHTML = `
            <button class="preferences-toggle" style="
                position: absolute;
                left: -50px;
                top: 50%;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 10px 0 0 10px;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-cog"></i>
            </button>
            <div class="preferences-content" style="padding: 20px;">
                <h4 style="margin: 0 0 20px 0; color: #333; text-align: center;">Préférences</h4>
                <label class="preference-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; cursor: pointer;">
                    <span style="color: #666;">Animations</span>
                    <input type="checkbox" id="pref-animations" ${this.preferences.animations ? 'checked' : ''} style="cursor: pointer;">
                </label>
                <label class="preference-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; cursor: pointer;">
                    <span style="color: #666;">Particules</span>
                    <input type="checkbox" id="pref-particles" ${this.preferences.particles ? 'checked' : ''} style="cursor: pointer;">
                </label>
                <label class="preference-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; cursor: pointer;">
                    <span style="color: #666;">Sons</span>
                    <input type="checkbox" id="pref-sound" ${this.preferences.sound ? 'checked' : ''} style="cursor: pointer;">
                </label>
                <label class="preference-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; cursor: pointer;">
                    <span style="color: #666;">Mouvement réduit</span>
                    <input type="checkbox" id="pref-reduced-motion" ${this.preferences.reducedMotion ? 'checked' : ''} style="cursor: pointer;">
                </label>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Gestion des événements
        const toggle = panel.querySelector('.preferences-toggle');
        let isOpen = false;
        
        toggle.addEventListener('click', () => {
            isOpen = !isOpen;
            panel.style.right = isOpen ? '0px' : '-300px';
            toggle.style.transform = `translateY(-50%) rotate(${isOpen ? '180deg' : '0deg'})`;
        });
        
        // Gestion des changements de préférences
        const checkboxes = panel.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const pref = e.target.id.replace('pref-', '');
                this.preferences[pref] = e.target.checked;
                this.savePreferences();
                this.applyPreferences();
                
                if (window.notifications) {
                    window.notifications.show(
                        `Préférence "${pref}" ${e.target.checked ? 'activée' : 'désactivée'}`,
                        'info'
                    );
                } else {
                    console.log(`Préférence "${pref}" ${e.target.checked ? 'activée' : 'désactivée'}`);
                }
            });
        });
    }
}

// ==================== SYSTÈME DE CACHE INTELLIGENT ====================
class SmartCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 50;
        this.init();
    }
    
    init() {
        this.preloadCriticalImages();
    }
    
    preloadCriticalImages() {
        const criticalImages = [
            'assets/images/hero-bg.jpg',
            'assets/images/logo.png'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.onload = () => {
                this.cache.set(src, img);
                console.log(`✅ Image préchargée: ${src}`);
            };
            img.onerror = () => {
                console.warn(`⚠️ Erreur préchargement: ${src}`);
            };
            img.src = src;
        });
    }
    
    get(key) {
        return this.cache.get(key);
    }
    
    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
    
    clear() {
        this.cache.clear();
    }
}

// ==================== ANALYTICS ET TRACKING ====================
class Analytics {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
        this.init();
    }
    
    init() {
        this.trackPageView();
        this.trackUserInteractions();
        this.trackPerformance();
    }
    
    trackPageView() {
        this.logEvent('page_view', {
            url: window.location.href,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });
    }
    
    trackUserInteractions() {
        // Tracking des clics sur les boutons
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, a')) {
                this.logEvent('button_click', {
                    element: e.target.tagName,
                    text: e.target.textContent.trim(),
                    timestamp: Date.now()
                });
            }
        });
        
        // Tracking du scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent % 25 === 0) {
                    this.logEvent('scroll_milestone', {
                        percent: scrollPercent,
                        timestamp: Date.now()
                    });
                }
            }, 100);
        });
    }
    
    trackPerformance() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                try {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    this.logEvent('performance', {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        timestamp: Date.now()
                    });
                } catch (error) {
                    console.warn('Erreur tracking performance:', error);
                }
            }, 0);
        });
    }
    
    logEvent(eventName, data) {
        const event = {
            name: eventName,
            data: data,
            sessionTime: Date.now() - this.sessionStart
        };
        
        this.events.push(event);
        
        // En mode développement, log dans la console
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('📊 Analytics Event:', event);
        }
        
        // Limiter le nombre d'événements stockés
        if (this.events.length > 100) {
            this.events.shift();
        }
    }
    
       getSessionSummary() {
        return {
            sessionDuration: Date.now() - this.sessionStart,
            totalEvents: this.events.length,
            events: this.events
        };
    }
}

// ==================== SYSTÈME DE FEEDBACK UTILISATEUR ====================
class FeedbackSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.createFeedbackButton();
        this.trackUserSatisfaction();
    }
    
    createFeedbackButton() {
        // Vérifier si le bouton existe déjà
        if (document.querySelector('.feedback-button')) {
            return;
        }
        
        const button = document.createElement('button');
        button.className = 'feedback-button';
        button.innerHTML = '<i class="fas fa-comment"></i>';
        button.setAttribute('aria-label', 'Donner un feedback');
        button.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(button);
        
        // Effet hover
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', () => {
            this.showFeedbackModal();
        });
    }
    
    showFeedbackModal() {
        const modal = document.createElement('div');
        modal.className = 'feedback-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="modal-backdrop" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            "></div>
            <div class="modal-content" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            ">
                <div class="feedback-content">
                    <h3 style="margin: 0 0 20px 0; color: #333; text-align: center;">Votre avis nous intéresse !</h3>
                    <div class="rating-section" style="margin-bottom: 20px;">
                        <p style="margin: 0 0 15px 0; color: #666; text-align: center;">Comment évaluez-vous votre expérience ?</p>
                        <div class="star-rating" style="display: flex; justify-content: center; gap: 5px;">
                            <i class="fas fa-star" data-rating="1" style="font-size: 2rem; color: #ddd; cursor: pointer; transition: color 0.3s ease;"></i>
                            <i class="fas fa-star" data-rating="2" style="font-size: 2rem; color: #ddd; cursor: pointer; transition: color 0.3s ease;"></i>
                            <i class="fas fa-star" data-rating="3" style="font-size: 2rem; color: #ddd; cursor: pointer; transition: color 0.3s ease;"></i>
                            <i class="fas fa-star" data-rating="4" style="font-size: 2rem; color: #ddd; cursor: pointer; transition: color 0.3s ease;"></i>
                            <i class="fas fa-star" data-rating="5" style="font-size: 2rem; color: #ddd; cursor: pointer; transition: color 0.3s ease;"></i>
                        </div>
                    </div>
                    <div class="feedback-form">
                        <textarea placeholder="Partagez vos commentaires (optionnel)..." rows="4" style="
                            width: 100%;
                            padding: 15px;
                            border: 2px solid #e9ecef;
                            border-radius: 10px;
                            font-family: inherit;
                            font-size: 14px;
                            resize: vertical;
                            margin-bottom: 20px;
                            box-sizing: border-box;
                        "></textarea>
                        <div class="feedback-actions" style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button class="btn-secondary" id="feedback-cancel" style="
                                padding: 10px 20px;
                                border: 2px solid #6c757d;
                                background: transparent;
                                color: #6c757d;
                                border-radius: 8px;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            ">Annuler</button>
                            <button class="btn-primary" id="feedback-submit" style="
                                padding: 10px 20px;
                                border: none;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                border-radius: 8px;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            ">Envoyer</button>
                        </div>
                    </div>
                </div>
                <button class="modal-close" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #999;
                    transition: color 0.3s ease;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('modal-open');
            modal.style.opacity = '1';
        }, 10);
        
        this.setupFeedbackHandlers(modal);
    }
    
    setupFeedbackHandlers(modal) {
        let selectedRating = 0;
        
        // Gestion des étoiles
        const stars = modal.querySelectorAll('.star-rating i');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                selectedRating = index + 1;
                this.updateStarDisplay(stars, selectedRating);
            });
            
            star.addEventListener('mouseenter', () => {
                this.updateStarDisplay(stars, index + 1);
            });
        });
        
        modal.querySelector('.star-rating').addEventListener('mouseleave', () => {
            this.updateStarDisplay(stars, selectedRating);
        });
        
        // Gestion des boutons
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('#feedback-cancel').addEventListener('click', closeModal);
        modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        modal.querySelector('#feedback-submit').addEventListener('click', () => {
            const comment = modal.querySelector('textarea').value;
            this.submitFeedback(selectedRating, comment);
            closeModal();
        });
        
        // Effets hover pour les boutons
        const cancelBtn = modal.querySelector('#feedback-cancel');
        const submitBtn = modal.querySelector('#feedback-submit');
        
        cancelBtn.addEventListener('mouseenter', () => {
            cancelBtn.style.background = '#6c757d';
            cancelBtn.style.color = 'white';
        });
        
        cancelBtn.addEventListener('mouseleave', () => {
            cancelBtn.style.background = 'transparent';
            cancelBtn.style.color = '#6c757d';
        });
        
        submitBtn.addEventListener('mouseenter', () => {
            submitBtn.style.transform = 'translateY(-2px)';
            submitBtn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
        
        submitBtn.addEventListener('mouseleave', () => {
            submitBtn.style.transform = 'translateY(0)';
            submitBtn.style.boxShadow = 'none';
        });
    }
    
    updateStarDisplay(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#ffc107';
            } else {
                star.style.color = '#ddd';
            }
        });
    }
    
    submitFeedback(rating, comment) {
        const feedback = {
            rating: rating,
            comment: comment,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        try {
            // Sauvegarder localement
            const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
            existingFeedback.push(feedback);
            localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));
            
            // Analytics
            if (window.analytics) {
                window.analytics.logEvent('feedback_submitted', feedback);
            }
            
            // Notification de remerciement
            if (window.notifications) {
                window.notifications.show('Merci pour votre feedback ! 🙏', 'success', 3000);
            } else {
                console.log('Merci pour votre feedback ! 🙏');
            }
            
            console.log('📝 Feedback reçu:', feedback);
        } catch (error) {
            console.error('Erreur sauvegarde feedback:', error);
        }
    }
    
    trackUserSatisfaction() {
        // Détecter les signes de frustration (clics rapides, etc.)
        let rapidClicks = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastClickTime < 500) {
                rapidClicks++;
                if (rapidClicks >= 5) {
                    this.showQuickFeedback();
                    rapidClicks = 0;
                }
            } else {
                rapidClicks = 0;
            }
            lastClickTime = now;
        });
    }
    
    showQuickFeedback() {
        if (window.notifications) {
            const notification = window.notifications.show(
                'Vous semblez rencontrer des difficultés. Souhaitez-vous nous faire un retour ?',
                'info',
                5000
            );
            
            // Ajouter un bouton dans la notification
            if (notification) {
                const button = document.createElement('button');
                button.textContent = 'Donner un feedback';
                button.style.cssText = `
                    margin-top: 10px;
                    padding: 5px 10px;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    cursor: pointer;
                `;
                button.addEventListener('click', () => {
                    this.showFeedbackModal();
                    notification.remove();
                });
                notification.appendChild(button);
            }
        } else {
            console.log('Vous semblez rencontrer des difficultés. Souhaitez-vous nous faire un retour ?');
        }
    }
}

// ==================== INITIALISATION SÉCURISÉE ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser avec gestion d'erreurs
    setTimeout(() => {
        try {
            console.log('🚀 Initialisation des fonctionnalités avancées...');
            
            // Gestionnaires principaux
            window.themeManager = new ThemeManager();
            window.performanceManager = new PerformanceManager();
            window.keyboardShortcuts = new KeyboardShortcuts();
            window.preferencesManager = new PreferencesManager();
            
            // Systèmes avancés
            window.smartCache = new SmartCache();
            window.analytics = new Analytics();
            window.feedbackSystem = new FeedbackSystem();
            
            // Effets visuels (seulement si les performances le permettent)
            if (!window.performanceManager.isLowPerformance) {
                window.matrixRain = new MatrixRain();
            }
            
            console.log('✅ Toutes les fonctionnalités avancées sont chargées !');
            console.log('💡 Fonctionnalités disponibles:');
            console.log('   - Système de thèmes (bouton en haut à droite)');
            console.log('   - Raccourcis clavier (bouton aide en bas à droite)');
            console.log('   - Gestion des performances automatique');
            console.log('   - Préférences utilisateur (bouton à droite)');
            console.log('   - Système de feedback (bouton orange en bas à droite)');
            console.log('   - Analytics intégrés');
            console.log('   - Cache intelligent');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
        }
    }, 1000);
});

// ==================== GESTIONNAIRE D'ERREURS GLOBAL ====================
window.addEventListener('error', (e) => {
    console.error('❌ Erreur détectée:', e.error);
    
    // Notification d'erreur pour le développement
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        if (window.notifications) {
            window.notifications.show(`Erreur: ${e.error.message}`, 'error', 5000);
        }
    }
});

// ==================== GESTIONNAIRE DE VISIBILITÉ DE LA PAGE ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause des animations coûteuses quand la page n'est pas visible
        document.documentElement.classList.add('page-hidden');
        console.log('⏸️ Page cachée - animations en pause');
    } else {
               // Reprendre les animations
        document.documentElement.classList.remove('page-hidden');
        console.log('▶️ Page visible - animations reprises');
    }
});

// ==================== GESTIONNAIRE DE REDIMENSIONNEMENT ====================
window.addEventListener('resize', () => {
    // Recalculer les dimensions pour Matrix Rain
    if (window.matrixRain) {
        const newColumns = Math.floor(window.innerWidth / 20);
        if (newColumns !== window.matrixRain.columns) {
            window.matrixRain.columns = newColumns;
            window.matrixRain.drops = [];
            window.matrixRain.init();
        }
    }
    
    // Mettre à jour les analytics
    if (window.analytics) {
        window.analytics.logEvent('window_resize', {
            newViewport: `${window.innerWidth}x${window.innerHeight}`,
            timestamp: Date.now()
        });
    }
});

// ==================== SYSTÈME DE NOTIFICATION SIMPLE ====================
class SimpleNotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        this.createContainer();
    }
    
    createContainer() {
        if (this.container) return;
        
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10001;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }
    
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.cssText = `
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transform: translateY(-20px);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: auto;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        notification.textContent = message;
        this.container.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Suppression automatique
        setTimeout(() => {
            notification.style.transform = 'translateY(-20px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
        
        return notification;
    }
}

// ==================== SYSTÈME DE DÉTECTION DE CONNEXION ====================
class ConnectionMonitor {
    constructor() {
        this.isOnline = navigator.onLine;
        this.init();
    }
    
    init() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.handleConnectionChange('online');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.handleConnectionChange('offline');
        });
        
        // Vérification périodique
        setInterval(() => {
            this.checkConnection();
        }, 30000); // Toutes les 30 secondes
    }
    
    handleConnectionChange(status) {
        if (window.notifications) {
            const message = status === 'online' 
                ? 'Connexion rétablie ! 🌐' 
                : 'Connexion perdue ! 📡';
            const type = status === 'online' ? 'success' : 'warning';
            
            window.notifications.show(message, type, 3000);
        }
        
        if (window.analytics) {
            window.analytics.logEvent('connection_change', {
                status: status,
                timestamp: Date.now()
            });
        }
        
        console.log(`🌐 Connexion: ${status}`);
    }
    
    checkConnection() {
        // Test de ping simple
        fetch('/favicon.ico', { 
            method: 'HEAD',
            cache: 'no-cache'
        })
        .then(() => {
            if (!this.isOnline) {
                this.isOnline = true;
                this.handleConnectionChange('online');
            }
        })
        .catch(() => {
            if (this.isOnline) {
                this.isOnline = false;
                this.handleConnectionChange('offline');
            }
        });
    }
}

// ==================== SYSTÈME DE SAUVEGARDE AUTOMATIQUE ====================
class AutoSave {
    constructor() {
        this.data = {};
        this.saveInterval = 30000; // 30 secondes
        this.init();
    }
    
    init() {
        this.loadData();
        this.startAutoSave();
        this.trackFormInputs();
    }
    
    loadData() {
        try {
            const saved = localStorage.getItem('autoSaveData');
            this.data = saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.warn('Erreur chargement auto-save:', error);
            this.data = {};
        }
    }
    
    saveData() {
        try {
            localStorage.setItem('autoSaveData', JSON.stringify(this.data));
            console.log('💾 Données sauvegardées automatiquement');
        } catch (error) {
            console.warn('Erreur sauvegarde auto-save:', error);
        }
    }
    
    startAutoSave() {
        setInterval(() => {
            this.saveData();
        }, this.saveInterval);
    }
    
    trackFormInputs() {
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const key = e.target.id || e.target.name || `input_${Date.now()}`;
                this.data[key] = e.target.value;
            }
        });
    }
    
    restoreFormData() {
        Object.keys(this.data).forEach(key => {
            const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
            if (element && element.value === '') {
                element.value = this.data[key];
            }
        });
    }
}

// ==================== INITIALISATION DES SYSTÈMES COMPLÉMENTAIRES ====================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            // Initialiser le système de notifications si pas déjà présent
            if (!window.notifications) {
                window.notifications = new SimpleNotificationSystem();
            }
            
            // Systèmes de monitoring
            window.connectionMonitor = new ConnectionMonitor();
            window.autoSave = new AutoSave();
            
            // Restaurer les données de formulaire
            setTimeout(() => {
                window.autoSave.restoreFormData();
            }, 500);
            
            console.log('🔧 Systèmes complémentaires initialisés');
            
        } catch (error) {
            console.error('❌ Erreur systèmes complémentaires:', error);
        }
    }, 2000);
});

// ==================== NETTOYAGE AVANT FERMETURE ====================
window.addEventListener('beforeunload', (e) => {
    try {
        // Sauvegarder les données importantes
        if (window.analytics) {
            const summary = window.analytics.getSessionSummary();
            localStorage.setItem('lastSessionSummary', JSON.stringify(summary));
        }
        
        // Sauvegarder les données auto-save
        if (window.autoSave) {
            window.autoSave.saveData();
        }
        
        // Arrêter les animations
        if (window.matrixRain) {
            window.matrixRain.destroy();
        }
        
        if (window.performanceManager) {
            window.performanceManager.stopMonitoring();
        }
        
        // Nettoyer le cache
        if (window.smartCache) {
            window.smartCache.clear();
        }
        
        // Nettoyer les timers globaux
        if (window.loadingTimeout) {
            clearTimeout(window.loadingTimeout);
        }
        if (window.particleInterval) {
            clearInterval(window.particleInterval);
        }
        
        console.log('🧹 Nettoyage effectué avant fermeture');
        
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
    }
});

// ==================== UTILITAIRES GLOBAUX ====================
window.PixelDjibUtils = {
    // Fonction pour déboguer
    debug: () => {
        console.log('🔍 État des systèmes PixelDjib:');
        console.log('Theme Manager:', window.themeManager ? '✅' : '❌');
        console.log('Performance Manager:', window.performanceManager ? '✅' : '❌');
        console.log('Keyboard Shortcuts:', window.keyboardShortcuts ? '✅' : '❌');
        console.log('Preferences Manager:', window.preferencesManager ? '✅' : '❌');
        console.log('Matrix Rain:', window.matrixRain ? '✅' : '❌');
        console.log('Smart Cache:', window.smartCache ? '✅' : '❌');
        console.log('Analytics:', window.analytics ? '✅' : '❌');
        console.log('Feedback System:', window.feedbackSystem ? '✅' : '❌');
        console.log('Notifications:', window.notifications ? '✅' : '❌');
        console.log('Connection Monitor:', window.connectionMonitor ? '✅' : '❌');
        console.log('Auto Save:', window.autoSave ? '✅' : '❌');
    },
    
    // Fonction pour réinitialiser
    reset: () => {
        localStorage.removeItem('theme');
        localStorage.removeItem('userPreferences');
        localStorage.removeItem('userFeedback');
        localStorage.removeItem('autoSaveData');
        localStorage.removeItem('lastSessionSummary');
        location.reload();
    },
    
    // Fonction pour exporter les données
    exportData: () => {
        const data = {
            theme: localStorage.getItem('theme'),
            preferences: localStorage.getItem('userPreferences'),
            feedback: localStorage.getItem('userFeedback'),
            autoSave: localStorage.getItem('autoSaveData'),
            sessionSummary: localStorage.getItem('lastSessionSummary')
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pixeldjib-data.json';
        a.click();
        URL.revokeObjectURL(url);
    }
};

// ==================== MESSAGE DE BIENVENUE ====================
console.log(`
🎯 PixelDjib Technologie - Système Avancé v2.0
═══════════════════════════════════════════════

✨ Fonctionnalités actives:
   🎨 Système de thèmes dynamique
   ⌨️  Raccourcis clavier intelligents
   ⚡ Gestion automatique des performances
   🎛️  Panneau de préférences utilisateur
   💬 Système de feedback intégré
   📊 Analytics et tracking
   💾 Cache intelligent
   🌐 Monitoring de connexion
   💾 Sauvegarde automatique

🔧 Commandes de débogage:
   PixelDjibUtils.debug() - État des systèmes
   PixelDjibUtils.reset() - Réinitialiser
   PixelDjibUtils.exportData() - Exporter les données

🚀 Tous les systèmes sont opérationnels !
`);
