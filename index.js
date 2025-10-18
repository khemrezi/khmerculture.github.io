class KhmerCultureSite {
    constructor() {
        this.currentSection = null;
        this.tooltip = document.getElementById('tooltip');
        this.progressBar = document.getElementById('progressBar');
        this.backToTopBtn = document.getElementById('backToTop');
        this.readingTime = document.getElementById('readingTime');
        
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupProgressBar();
        this.setupBackToTop();
        this.setupTooltips();
        this.setupContentInteractions();
        this.setupSectionAnimations();
        this.setupActiveNavigation();
        this.calculateReadingTime();
        this.setupKeyboardNavigation();
        this.setupFunFacts();
        this.addWelcomeAnimation();
    }

    // Smooth scrolling with active state management
    setupSmoothScrolling() {
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Update active button
                    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Smooth scroll with offset for sticky nav
                    const offsetTop = targetSection.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    this.currentSection = targetId.substring(1);
                }
            });
        });
    }

    // Reading progress indicator
    setupProgressBar() {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            this.progressBar.style.width = scrolled + '%';
        });
    }

    // Back to top functionality
    setupBackToTop() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.backToTopBtn.classList.add('visible');
            } else {
                this.backToTopBtn.classList.remove('visible');
            }
        });

        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Interactive tooltips
    setupTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltipText = element.getAttribute('data-tooltip');
                this.showTooltip(e, tooltipText);
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            element.addEventListener('mousemove', (e) => {
                this.updateTooltipPosition(e);
            });
        });
    }

    showTooltip(e, text) {
        this.tooltip.textContent = text;
        this.tooltip.classList.add('visible');
        this.updateTooltipPosition(e);
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    updateTooltipPosition(e) {
        const tooltipRect = this.tooltip.getBoundingClientRect();
        let left = e.pageX + 10;
        let top = e.pageY - tooltipRect.height - 10;

        // Keep tooltip within viewport
        if (left + tooltipRect.width > window.innerWidth) {
            left = e.pageX - tooltipRect.width - 10;
        }
        if (top < window.pageYOffset) {
            top = e.pageY + 10;
        }

        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = top + 'px';
    }

    // Expandable content items
    setupContentInteractions() {
        document.querySelectorAll('.content-item').forEach(item => {
            item.addEventListener('click', () => {
                const extraContent = item.querySelector('.extra-content');
                const isExpanded = item.classList.contains('expanded');

                // Close all other expanded items
                document.querySelectorAll('.content-item.expanded').forEach(expandedItem => {
                    if (expandedItem !== item) {
                        expandedItem.classList.remove('expanded');
                        expandedItem.querySelector('.extra-content').style.display = 'none';
                    }
                });

                // Toggle current item
                if (isExpanded) {
                    item.classList.remove('expanded');
                    extraContent.style.display = 'none';
                } else {
                    item.classList.add('expanded');
                    extraContent.style.display = 'block';
                }
            });
        });

        // Cultural symbols interaction
        document.querySelectorAll('.symbol').forEach(symbol => {
            symbol.addEventListener('click', () => {
                const symbolText = symbol.querySelector('.symbol-text').textContent;
                this.showCulturalInfo(symbolText);
            });
        });
    }

    showCulturalInfo(symbolName) {
        const info = {
            'Angkor Wat': 'Built in the early 12th century, Angkor Wat represents the pinnacle of Khmer architecture and Hindu-Buddhist art.',
            'Apsara Dance': 'This classical dance form depicts celestial nymphs and requires years of training to master the intricate hand gestures.',
            'Shadow Puppets': 'Sbek Thom puppets are made from single pieces of leather and can be over a meter tall, requiring great skill to manipulate.',
            'Khmer Cuisine': 'Khmer cooking emphasizes fresh ingredients, aromatic herbs, and the balance of sweet, sour, salty, and bitter flavors.'
        };

        if (info[symbolName]) {
            this.createInfoModal(symbolName, info[symbolName]);
        }
    }

    createInfoModal(title, content) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            margin: 20px;
            text-align: center;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        modalContent.innerHTML = `
            <h3 style="color: #000000; margin-bottom: 20px; font-size: 1.8rem;">${title}</h3>
            <p style="color: #000000; line-height: 1.6; margin-bottom: 20px;">${content}</p>
            <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Close</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);

        // Close functionality
        const closeBtn = modalContent.querySelector('button');
        const closeModal = () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => document.body.removeChild(modal), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Section animations on scroll
    setupSectionAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Update active navigation
                    const sectionId = entry.target.id;
                    if (sectionId) {
                        document.querySelectorAll('.nav-btn').forEach(btn => {
                            btn.classList.remove('active');
                            if (btn.getAttribute('data-section') === sectionId) {
                                btn.classList.add('active');
                            }
                        });
                    }
                }
            });
        }, observerOptions);

        // Initially hide sections for animation
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    // Active navigation based on scroll position
    setupActiveNavigation() {
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('.section');
            const scrollPos = window.pageYOffset + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.id;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-btn').forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.getAttribute('data-section') === sectionId) {
                            btn.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    // Calculate and display reading time
    calculateReadingTime() {
        const text = document.body.innerText;
        const wordsPerMinute = 200;
        const wordCount = text.split(/\s+/).length;
        const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
        
        this.readingTime.innerHTML = `📖 Estimated reading time: ${readingTimeMinutes} minutes`;
    }

    // Keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' && e.ctrlKey) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (e.key === 'ArrowDown' && e.ctrlKey) {
                e.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        });
    }

    // Fun facts reveal
    setupFunFacts() {
        document.querySelectorAll('.section-title').forEach(title => {
            title.addEventListener('click', () => {
                const section = title.closest('.section');
                const funFact = section.querySelector('.fun-fact');
                
                if (funFact && !funFact.classList.contains('visible')) {
                    funFact.classList.add('visible');
                }
            });
        });
    }

    // Welcome animation
    addWelcomeAnimation() {
        const title = document.getElementById('mainTitle');
        const letters = title.textContent.split('');
        title.innerHTML = '';
        
        letters.forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `all 0.5s ease ${index * 0.1}s`;
            title.appendChild(span);
        });

        // Animate letters in
        setTimeout(() => {
            title.querySelectorAll('span').forEach(span => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });
        }, 500);
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KhmerCultureSite();
    
    // Add some interactive console messages for developers
    console.log('🏛️ Welcome to the Khmer Culture Heritage website!');
    console.log('🎨 This site showcases the rich traditions of Cambodia');
    console.log('💡 Try clicking on content items to expand them!');
    console.log('⌨️ Use Ctrl+↑ to go to top, Ctrl+↓ to go to bottom');
});

// Add some fun Easter eggs
let clickCount = 0;
document.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 50) {
        console.log('🎉 Wow! You\'ve clicked 50 times! You must really love Khmer culture!');
    }
});

// Konami code Easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});