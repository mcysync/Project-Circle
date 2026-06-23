/* =========================================================
   PROJECT CIRCLE - MATERIAL 3 EXPRESSIVE JS LOGIC
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initRipple();
    initScrollReveal();
    initVideoSwap();
    initCarousel();
    initScreenshotsParallax();
    initScrollProgress();
    initNavbarBlur();
});

// --- 1. Material 3 Ripple Effect ---
function initRipple() {
    const rippleElements = document.querySelectorAll('.ripple');
    rippleElements.forEach(el => {
        el.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const circle = document.createElement('span');
            circle.classList.add('ripple-circle');
            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;

            // Dynamic size based on element bounds
            const radius = Math.max(rect.width, rect.height);
            circle.style.width = circle.style.height = `${radius}px`;
            circle.style.marginTop = circle.style.marginLeft = `-${radius/2}px`;

            this.appendChild(circle);

            setTimeout(() => {
                circle.remove();
            }, 600);
        });
    });
}

// --- 2. Expressive Scroll Reveals ---
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed for better performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => observer.observe(reveal));
}

// --- 3. Dynamic Video Source Swap (Performance & Responsiveness) ---
function initVideoSwap() {
    const video = document.getElementById('bg-video');
    const source = video.querySelector('source');
    
    const checkViewport = () => {
        const isMobile = window.innerWidth <= 768;
        const targetSrc = isMobile ? 'assets/bg-mobile.mp4' : 'assets/bg.mp4';
        
        // Only swap if source is different to prevent reloading loop
        if (!source.src.endsWith(targetSrc)) {
            source.src = targetSrc;
            video.load();
        }
    };

    // Initial check
    checkViewport();
    
    // Listen for resize
    window.addEventListener('resize', () => {
        // Debounce resize check
        clearTimeout(window.videoResizeTimer);
        window.videoResizeTimer = setTimeout(checkViewport, 250);
    });
}

// --- 4. Features Carousel Controls ---
function initCarousel() {
    const track = document.getElementById('features-track');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');

    if(!track || !btnNext || !btnPrev) return;

    btnNext.addEventListener('click', () => {
        track.scrollBy({ left: 350, behavior: 'smooth' });
    });

    btnPrev.addEventListener('click', () => {
        track.scrollBy({ left: -350, behavior: 'smooth' });
    });
}

// --- 5. Advanced Stacked Screenshot Parallax ---
function initScreenshotsParallax() {
    const showcase = document.getElementById('showcase');
    const layers = document.querySelectorAll('.screenshot-layer');
    if (!showcase || layers.length === 0) return;

    // Initial static stacking
    layers.forEach((layer, index) => {
        layer.style.zIndex = layers.length - index;
    });

    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const rect = showcase.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculate progress of the scroll through the section (0 to 1)
            // Starts when top hits top of viewport, ends when bottom hits bottom of viewport
            let progress = -rect.top / (rect.height - viewportHeight);
            progress = Math.max(0, Math.min(1, progress));

            layers.forEach((layer, index) => {
                // Determine how much this specific layer should be affected based on its index
                // Lower index (front) moves out faster.
                const offsetThreshold = index * (1 / layers.length);
                
                // Gradually shifting left logic
                let shiftProgress = Math.max(0, progress - offsetThreshold) * (layers.length);
                shiftProgress = Math.min(1, shiftProgress); // cap at 1

                // Expressive transforms
                const translateX = shiftProgress * -120; // Shift left up to 120vw
                const rotateY = shiftProgress * -15; // Slight 3D rotation
                const scale = 1 - (index * 0.05) + (shiftProgress * 0.1); // Background layers scale up slightly as front leaves
                const opacity = 1 - Math.pow(shiftProgress, 3); // Fade out at the very end of its journey

                layer.style.transform = `
                    translateX(${translateX}vw) 
                    rotateY(${rotateY}deg) 
                    scale(${scale})
                    translateY(${index * 10}px)
                `;
                layer.style.opacity = opacity;
                
                // Drop shadow depth increases as they spread
                layer.style.boxShadow = `0px ${10 + shiftProgress*20}px ${20 + shiftProgress*30}px rgba(0,0,0,${0.3 - shiftProgress*0.1})`;
            });
        });
    }, { passive: true });
}

// --- 6. Scroll Progress Indicator ---
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + "%";
        });
    }, { passive: true });
}

// --- 7. Navbar M3 Elevation on Scroll ---
function initNavbarBlur() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}