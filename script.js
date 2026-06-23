/* ==========================================================================
   MATERIAL 3 EXPRESSIVE - PROJECT CIRCLE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Premium Launch Sequence
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    }, 1200);

    // 2. Ripple Effect Logic
    const rippleElements = document.querySelectorAll('.m-ripple');
    rippleElements.forEach(elem => {
        elem.addEventListener('mousedown', createRipple);
        elem.addEventListener('touchstart', createRipple, { passive: true });
    });

    function createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        
        const circle = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        let clientX = e.clientX || (e.touches && e.touches[0].clientX);
        let clientY = e.clientY || (e.touches && e.touches[0].clientY);

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${clientX - rect.left - radius}px`;
        circle.style.top = `${clientY - rect.top - radius}px`;
        circle.classList.add('ripple-span');

        const ripple = button.querySelector('.ripple-span');
        if (ripple) ripple.remove();

        button.appendChild(circle);
    }

    // 3. Sticky App Bar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.m3-animate').forEach(el => observer.observe(el));

    // 5. Advanced Material Carousel Logic (Drag & Scroll Snap)
    function setupCarousel(trackId, prevBtnClass, nextBtnClass, isCenterMode = false) {
        const track = document.getElementById(trackId);
        if (!track) return;

        const prevBtn = track.parentElement.querySelector(prevBtnClass);
        const nextBtn = track.parentElement.querySelector(nextBtnClass);
        const items = Array.from(track.children);

        // Arrow Navigation
        if(prevBtn) prevBtn.addEventListener('click', () => scrollTrack(-1));
        if(nextBtn) nextBtn.addEventListener('click', () => scrollTrack(1));

        function scrollTrack(direction) {
            const itemWidth = items[0].getBoundingClientRect().width + 24; // width + gap
            track.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
        }

        // Center Mode Scaling (for Screenshots)
        if (isCenterMode) {
            const updateActiveItem = () => {
                const trackCenter = track.getBoundingClientRect().left + (track.clientWidth / 2);
                let closestItem = null;
                let closestDistance = Infinity;

                items.forEach(item => {
                    const itemCenter = item.getBoundingClientRect().left + (item.clientWidth / 2);
                    const distance = Math.abs(trackCenter - itemCenter);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestItem = item;
                    }
                });

                items.forEach(item => item.classList.remove('active'));
                if (closestItem) closestItem.classList.add('active');
            };

            track.addEventListener('scroll', () => {
                requestAnimationFrame(updateActiveItem);
            });
            
            // Initialize first item
            setTimeout(updateActiveItem, 100);
            window.addEventListener('resize', updateActiveItem);
        }

        // Mouse Drag to Scroll implementation
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.scrollBehavior = 'auto'; // Disable smooth snap during drag
            track.style.cursor = 'grabbing';
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });
        
        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.scrollBehavior = 'smooth';
            track.style.cursor = '';
        });
        
        track.addEventListener('mouseup', () => {
            isDown = false;
            track.style.scrollBehavior = 'smooth';
            track.style.cursor = '';
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            track.scrollLeft = scrollLeft - walk;
        });
    }

    // Initialize Carousels
    setupCarousel('featuresTrack', '.carousel-prev', '.carousel-next', false);
    setupCarousel('screenshotsTrack', '.showcase-prev', '.showcase-next', true);

});