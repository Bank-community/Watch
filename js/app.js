/* 
   =========================================
   SHHUTUP™ — PREMIUM UI ENGINE v2.0
   Apple-Level Smooth Interactions
   =========================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // ====================================
    // 1. CINEMATIC PRELOADER
    // ====================================
    const preloader = document.getElementById('preloader');
    const preloadLogo = document.getElementById('preload-logo');
    const preloadCounter = document.getElementById('preload-counter');
    const preloadBar = document.getElementById('preload-bar');

    function initPreloader() {
        if (!preloader) return;

        // Stagger letter animation
        if (preloadLogo) {
            const text = preloadLogo.textContent;
            preloadLogo.innerHTML = '';
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char;
                span.style.animationDelay = `${0.1 + i * 0.08}s`;
                preloadLogo.appendChild(span);
            });
        }

        // Check session storage for repeat visits
        if (sessionStorage.getItem('shhutup_loader_seen')) {
            preloader.style.display = 'none';
            document.body.style.overflowY = 'auto';
            return;
        }

        document.body.style.overflowY = 'hidden';

        // Animated counter
        let progress = 0;
        const counterInterval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(counterInterval);

                setTimeout(() => {
                    preloader.classList.add('done');
                    document.body.style.overflowY = 'auto';
                    sessionStorage.setItem('shhutup_loader_seen', 'true');

                    // Remove from DOM after animation
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 1500);
                }, 400);
            }

            if (preloadCounter) preloadCounter.textContent = `${Math.round(progress)}%`;
            if (preloadBar) preloadBar.style.width = `${progress}%`;
        }, 80);
    }

    initPreloader();


    // ====================================
    // 2. SMART NAVBAR (Direction-aware)
    // ====================================
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;
    let ticking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;

        // Add scrolled class for glass effect
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Direction-aware hide/show (only on scroll > 300px)
        if (currentScrollY > 300) {
            if (currentScrollY > lastScrollY + 5) {
                navbar.classList.add('nav-hidden');
            } else if (currentScrollY < lastScrollY - 5) {
                navbar.classList.remove('nav-hidden');
            }
        } else {
            navbar.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });


    // ====================================
    // 3. MOBILE MENU
    // ====================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('[data-menu-link]');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isActive = mobileMenu.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                hamburgerBtn.classList.add('active');
                mobileMenu.classList.add('active');
                document.body.style.overflowY = 'hidden';
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        function closeMobileMenu() {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflowY = 'auto';
        }
    }


    // ====================================
    // 4. SMOOTH SCROLL (Custom)
    // ====================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const navHeight = navbar ? navbar.offsetHeight : 72;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });


    // ====================================
    // 5. SCROLL-TRIGGERED REVEAL ANIMATIONS
    // ====================================
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }


    // ====================================
    // 6. HERO PARALLAX & MOUSE GLOW
    // ====================================
    const mouseGlow = document.getElementById('mouse-glow');
    const heroContainer = document.getElementById('hero-3d-container');
    const watchWrapper = document.getElementById('hero-watch-wrapper');

    if (window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Interactive 3D Watch Tilt
            if (heroContainer && watchWrapper) {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 35;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 35;
                watchWrapper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            }
        });

        // Smooth lerp for mouse glow
        function animateGlow() {
            if (mouseGlow) {
                glowX += (mouseX - glowX) * 0.08;
                glowY += (mouseY - glowY) * 0.08;
                mouseGlow.style.left = glowX + 'px';
                mouseGlow.style.top = glowY + 'px';
                mouseGlow.style.opacity = '1';
                mouseGlow.style.transform = `translate(-50%, -50%)`;
            }
            requestAnimationFrame(animateGlow);
        }
        animateGlow();

        // Reset watch position
        if (heroContainer && watchWrapper) {
            heroContainer.addEventListener('mouseleave', () => {
                watchWrapper.style.transform = `rotateY(0deg) rotateX(0deg)`;
                watchWrapper.style.transition = `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`;
            });
            heroContainer.addEventListener('mouseenter', () => {
                watchWrapper.style.transition = `transform 0.1s ease-out`;
            });
        }
    }


    // ====================================
    // 7. FAQ ACCORDION (Smooth Transitions)
    // ====================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        // Measure content height for smooth transition
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = '0';
                }
            });

            // Toggle clicked item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
            }
        });
    });


    // ====================================
    // 8. SEARCH OVERLAY
    // ====================================
    const searchToggle = document.getElementById('search-toggle-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchClose = document.getElementById('search-close');

    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.toggle('active');
            if (searchOverlay.classList.contains('active') && searchInput) {
                setTimeout(() => searchInput.focus(), 300);
            }
        });

        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
                if (searchInput) searchInput.value = '';
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                if (searchInput) searchInput.value = '';
            }
        });
    }


    // ====================================
    // 9. BACK TO TOP BUTTON
    // ====================================
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ====================================
    // 10. SOCIAL PROOF TOAST
    // ====================================
    const toast = document.getElementById('recent-order-toast');
    const toastProductName = document.getElementById('toast-product-name');

    const toastProducts = [
        'Chronograph Blue Eclipse',
        'Midnight Stealth Carbon',
        'Royal Gold Heritage',
        'Sapphire Azure Diver',
        'Carbon Fiber Black Ops'
    ];
    const toastCities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur'];
    const toastTimes = ['1 minute ago', '2 minutes ago', '3 minutes ago', '5 minutes ago', 'just now'];

    function showToast() {
        if (!toast || !toastProductName) return;

        const product = toastProducts[Math.floor(Math.random() * toastProducts.length)];
        const city = toastCities[Math.floor(Math.random() * toastCities.length)];
        const time = toastTimes[Math.floor(Math.random() * toastTimes.length)];

        toastProductName.textContent = product;
        const timeEl = toast.querySelector('.toast-time');
        if (timeEl) timeEl.textContent = `${time} from ${city}`;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
    }

    // Show toast every 20-40 seconds
    setTimeout(() => {
        showToast();
        setInterval(showToast, Math.random() * 20000 + 20000);
    }, 8000);


    // ====================================
    // 11. LIVE VISITOR COUNTER
    // ====================================
    const liveVisitors = document.getElementById('live-visitors');

    if (liveVisitors) {
        let currentCount = parseInt(liveVisitors.textContent) || 42;

        setInterval(() => {
            const change = Math.random() > 0.5 ? 1 : -1;
            currentCount = Math.max(28, Math.min(65, currentCount + change));
            liveVisitors.textContent = currentCount;
        }, 4000);
    }


    // ====================================
    // 12. REVIEWS DRAG SCROLL
    // ====================================
    const reviewsContainer = document.getElementById('reviews-carousel');

    if (reviewsContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        reviewsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - reviewsContainer.offsetLeft;
            scrollLeft = reviewsContainer.scrollLeft;
        });

        reviewsContainer.addEventListener('mouseleave', () => { isDown = false; });
        reviewsContainer.addEventListener('mouseup', () => { isDown = false; });

        reviewsContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - reviewsContainer.offsetLeft;
            const walk = (x - startX) * 1.5;
            reviewsContainer.scrollLeft = scrollLeft - walk;
        });
    }


    // ====================================
    // 13. NEWSLETTER FORM
    // ====================================
    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const btn = newsletterForm.querySelector('button');
            
                                if (input && input.value) {
                        const originalText = btn.textContent;
                        const userEmail = input.value;
                        
                        // Email ko localStorage me save karein whatsapp ke liye
                        localStorage.setItem('shhutup_user_email', userEmail);
                        // Firebase ko trigger karne ke liye event dispatch karein
                        window.dispatchEvent(new CustomEvent('newsletter-subscribe', { detail: { email: userEmail } }));

                        btn.textContent = '✓ SUBSCRIBED';
                        btn.style.background = 'var(--success)';
                        input.value = '';

                        setTimeout(() => {

                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }


    // ====================================
    // 14. COLLECTION TAB FILTERING
    // ====================================
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Dispatch custom event for landing.js to handle filtering
            const filterValue = btn.getAttribute('data-filter');
            window.dispatchEvent(new CustomEvent('collection-filter', { detail: { filter: filterValue } }));
        });
    });

});