// ===================================
// 2030 Modern UI - Enhanced Interactions
// ===================================

// ===================================
// Parallax Scroll Effect
// ===================================
function initParallax() {
    const parallaxBg = document.getElementById('parallaxBg');
    const parallaxSpeed = 0.2; // Adjust this value for slower/faster parallax (0-1)

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const yPos = -(scrolled * parallaxSpeed);

        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${yPos}px)`;
        }
    });
}

// ===================================
// Magnetic Hover Effect on CTA Buttons
// ===================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.cta-button');

    buttons.forEach(button => {
        let magneticStrength = 0.3; // How much the button follows the cursor (0-1)
        let magneticRadius = 100; // Pixel radius for magnetic effect

        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const buttonCenterX = rect.left + rect.width / 2;
            const buttonCenterY = rect.top + rect.height / 2;

            const distanceX = e.clientX - buttonCenterX;
            const distanceY = e.clientY - buttonCenterY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < magneticRadius) {
                const moveX = distanceX * magneticStrength;
                const moveY = distanceY * magneticStrength;

                button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
            }
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// ===================================
// 3D Tilt Effect on Feature Cards
// ===================================
function init3DTiltCards() {
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        let tiltStrength = 15; // Degrees of tilt

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * tiltStrength;
            const rotateY = ((centerX - x) / centerX) * tiltStrength;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-12px)
                scale(1.02)
            `;

            // Add subtle glow that follows the cursor
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            card.style.background = `
                radial-gradient(circle at ${glowX}% ${glowY}%,
                    rgba(255, 255, 255, 0.45) 0%,
                    rgba(255, 255, 255, 0.25) 100%)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.background = '';
        });
    });
}

// ===================================
// Testimonials Slider
// ===================================
class TestimonialsSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.slider-dot');
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds

        this.init();
    }

    init() {
        // Show first slide
        this.showSlide(0);

        // Add click handlers to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Start autoplay
        this.startAutoplay();

        // Pause on hover
        const sliderContainer = document.querySelector('.testimonials-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => this.pauseAutoplay());
            sliderContainer.addEventListener('mouseleave', () => this.startAutoplay());
        }

        // Touch/swipe support
        this.initTouchSupport();
    }

    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Remove active class from all dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current slide
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }

        // Activate current dot
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }

        this.currentSlide = index;
    }

    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoplay();
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }

    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
    }

    startAutoplay() {
        this.pauseAutoplay(); // Clear any existing interval
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.startAutoplay();
    }

    initTouchSupport() {
        const track = document.getElementById('testimonialsTrack');
        if (!track) return;

        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped left - next slide
                    this.nextSlide();
                } else {
                    // Swiped right - prev slide
                    this.prevSlide();
                }
                this.resetAutoplay();
            }
        };

        this.handleSwipe = handleSwipe;
    }
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Don't prevent default if it's just "#"
            if (href === '#' || href === '#get-started') {
                e.preventDefault();

                // For demo purposes, scroll to features section
                // You can change this to scroll to your actual form
                const targetSection = document.getElementById('features');
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===================================
// Scroll-Triggered Reveal Animations
// ===================================
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing after reveal
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements that should reveal on scroll
    const revealElements = document.querySelectorAll(
        '.feature-card, .section-title, .section-subtitle, .testimonial-card'
    );

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// ===================================
// Scroll Indicator Hide on Scroll
// ===================================
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// ===================================
// Dynamic Cursor Glow Effect
// ===================================
function initCursorGlow() {
    // Create cursor glow element
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    cursorGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(22, 115, 255, 0.15) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
    `;
    document.body.appendChild(cursorGlow);

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth follow animation
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';

        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Show glow on specific elements
    const glowElements = document.querySelectorAll('.feature-card, .cta-button, .testimonial-card');
    glowElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '1';
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    });
}

// ===================================
// CTA Button Ripple Effect (Enhanced)
// ===================================
function initButtonEffects() {
    const buttons = document.querySelectorAll('.cta-button');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
            `;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// Parallax Mouse Move Effect
// ===================================
function initParallaxElements() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const parallaxElements = heroContent.querySelectorAll('.hero-logo, .hero-headline, .hero-subheadline');

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        parallaxElements.forEach((el, index) => {
            const depth = (index + 1) * 10;
            const x = moveX * depth;
            const y = moveY * depth;

            el.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ===================================
// Performance Optimization
// ===================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll events
const optimizedScroll = throttle(() => {
    // Any scroll-based operations that don't need to run on every frame
}, 100);

window.addEventListener('scroll', optimizedScroll);

// ===================================
// Initialize Everything on DOM Load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing 2030 Modern UI...');

    // Core functionality
    initParallax();
    new TestimonialsSlider();
    initSmoothScroll();

    // Enhanced interactions
    initMagneticButtons();
    init3DTiltCards();
    initScrollReveal();
    initScrollIndicator();
    initButtonEffects();
    initParallaxElements();

    // Optional: Cursor glow (disable on mobile for performance)
    if (window.innerWidth > 768) {
        initCursorGlow();
    }

    // Add loaded class for any additional animations
    document.body.classList.add('loaded');

    console.log('✨ 2030 Modern UI Loaded Successfully!');
});

// ===================================
// Handle Window Resize
// ===================================
let resizeTimer;
window.addEventListener('resize', debounce(() => {
    // Reinitialize any size-dependent features
    console.log('Window resized - layout adjusted');

    // Disable cursor glow on mobile
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {
        if (window.innerWidth <= 768) {
            cursorGlow.style.display = 'none';
        } else {
            cursorGlow.style.display = 'block';
        }
    }
}, 250));

// ===================================
// Keyboard Navigation Support
// ===================================
document.addEventListener('keydown', (e) => {
    // Add keyboard navigation for testimonials slider
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    // Only work if slider is in view
    const rect = slider.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInView) {
        if (e.key === 'ArrowLeft') {
            const prevDot = document.querySelector('.slider-dot.active')?.previousElementSibling;
            if (prevDot) prevDot.click();
        } else if (e.key === 'ArrowRight') {
            const nextDot = document.querySelector('.slider-dot.active')?.nextElementSibling;
            if (nextDot) nextDot.click();
        }
    }
});

// ===================================
// Analytics Event Tracking (optional)
// ===================================
function trackEvent(eventName, eventData = {}) {
    // You can integrate with Google Analytics, Mixpanel, etc.
    console.log('Event:', eventName, eventData);

    // Example: Google Analytics 4
    if (window.gtag) {
        window.gtag('event', eventName, eventData);
    }
}

// Track CTA clicks
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', () => {
        trackEvent('cta_click', {
            button_text: button.textContent.trim(),
            button_location: button.classList.contains('primary-cta') ? 'hero' : 'footer'
        });
    });
});

// Track feature card interactions
document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        const featureTitle = card.querySelector('.feature-title')?.textContent;
        trackEvent('feature_hover', {
            feature_name: featureTitle,
            feature_index: index
        });
    });
});

// ===================================
// Easter Egg: Konami Code
// ===================================
(function() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Easter egg activated!
                document.body.style.animation = 'rainbow 2s linear infinite';
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes rainbow {
                        0% { filter: hue-rotate(0deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);

                setTimeout(() => {
                    document.body.style.animation = '';
                }, 5000);

                konamiIndex = 0;
                console.log('🎉 Easter egg activated!');
            }
        } else {
            konamiIndex = 0;
        }
    });
})();
