/* ============================================
   FASHION LARISSA CRÉATION - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. HEADER SCROLL EFFECT
    const header = document.getElementById('main-header');
    
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // 2. MOBILE MENU TOGGLE
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (menuToggle && mobileOverlay) {
        const toggleMenu = () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', toggleMenu);
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileOverlay.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        mobileOverlay.addEventListener('click', (e) => {
            if (e.target === mobileOverlay) {
                toggleMenu();
            }
        });
    }

    // 3. REVEAL ANIMATIONS ON SCROLL
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. 3D TILT EFFECT FOR CARDS
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    if (window.matchMedia('(hover: hover)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // 5. PORTFOLIO FILTERS
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            portfolioItems.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.classList.add('hidden');
                    item.style.opacity = '0';
                }
            });
        });
    });

    // 6. LIGHTBOX GALLERY
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let visibleImages = [];

    const openLightbox = (index) => {
        visibleImages = Array.from(document.querySelectorAll('.portfolio-item:not(.hidden)'));
        if (visibleImages.length === 0) return;
        
        currentImageIndex = index;
        const item = visibleImages[currentImageIndex];
        const img = item.querySelector('img');
        const title = item.querySelector('.portfolio-title');
        const category = item.querySelector('.portfolio-category');
        
        if (img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        }
        
        if (title) lightboxTitle.textContent = title.textContent;
        if (category) lightboxCategory.textContent = category.textContent;
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightboxFn = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const showImage = (index) => {
        if (index < 0) index = visibleImages.length - 1;
        if (index >= visibleImages.length) index = 0;
        
        currentImageIndex = index;
        const item = visibleImages[currentImageIndex];
        const img = item.querySelector('img');
        const title = item.querySelector('.portfolio-title');
        const category = item.querySelector('.portfolio-category');
        
        if (img) {
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxImg.style.opacity = '1';
            }, 200);
        }
        
        if (title) lightboxTitle.textContent = title.textContent;
        if (category) lightboxCategory.textContent = category.textContent;
    };

    document.querySelectorAll('.portfolio-item').forEach((item) => {
        const btn = item.querySelector('.portfolio-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                visibleImages = Array.from(document.querySelectorAll('.portfolio-item:not(.hidden)'));
                const visibleIndex = visibleImages.indexOf(item);
                if (visibleIndex !== -1) openLightbox(visibleIndex);
            });
        }
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightboxFn);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => showImage(currentImageIndex - 1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => showImage(currentImageIndex + 1));
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightboxFn();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightboxFn();
        if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
    });

    // 7. BEFORE/AFTER SLIDER
    const sliders = document.querySelectorAll('.comparison-slider');
    
    sliders.forEach(slider => {
        const handle = slider.querySelector('.comp-handle');
        const beforeImage = slider.querySelector('.comp-before');
        let isDragging = false;

        const updateSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;
            
            position = Math.max(0, Math.min(100, position));
            
            if (beforeImage) {
                beforeImage.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            }
            if (handle) {
                handle.style.left = `${position}%`;
                handle.setAttribute('aria-valuenow', Math.round(position));
            }
        };

        if (handle) {
            handle.addEventListener('mousedown', () => { isDragging = true; });
            handle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });

            handle.addEventListener('keydown', (e) => {
                const currentVal = parseInt(handle.getAttribute('aria-valuenow') || '50', 10);
                let newVal = currentVal;
                
                if (e.key === 'ArrowLeft') newVal -= 5;
                if (e.key === 'ArrowRight') newVal += 5;
                if (e.key === 'Home') newVal = 0;
                if (e.key === 'End') newVal = 100;
                
                if (newVal !== currentVal) {
                    e.preventDefault();
                    const rect = slider.getBoundingClientRect();
                    const x = rect.left + (rect.width * (newVal / 100));
                    updateSlider(x);
                }
            });
        }

        document.addEventListener('mouseup', () => { isDragging = false; });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            updateSlider(e.clientX);
        });

        document.addEventListener('touchend', () => { isDragging = false; });
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientX);
        }, { passive: true });

        slider.addEventListener('click', (e) => {
            if (e.target !== handle) {
                updateSlider(e.clientX);
            }
        });
    });

    // 8. CURRENT YEAR IN FOOTER
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 9. SMOOTH SCROLL FOR ANCHOR LINKS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});