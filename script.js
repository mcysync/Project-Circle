/* ==========================================================================
   MATERIAL 3 EXPRESSIVE - PROJECT CIRCLE mcysync
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Premium Grand Launch Sequence
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    }, 1600);

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

    // 3. Sticky App Bar Blur Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3.5. Mobile 3-Dots Dropdown Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDropdown = document.getElementById('mobile-dropdown');
    
    if (mobileMenuBtn && mobileDropdown) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!mobileDropdown.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileDropdown.classList.remove('active');
            }
        });
        
        const dropLinks = mobileDropdown.querySelectorAll('.dropdown-link');
        dropLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDropdown.classList.remove('active');
            });
        });
    }

    // 4. Scroll Animations
    const observerOptions = { root: null, rootMargin: '50px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.m3-animate').forEach(el => observer.observe(el));

    // 5. Material Carousel Logic (Restored Spring & Shift Animations)
    function setupCarousel(trackId, prevBtnClass, nextBtnClass, isCenterMode = false) {
        const track = document.getElementById(trackId);
        if (!track) return;

        const wrapper = track.closest('.m3-carousel-wrapper, .m3-showcase-wrapper');
        const prevBtn = wrapper.querySelector(prevBtnClass);
        const nextBtn = wrapper.querySelector(nextBtnClass);
        const items = Array.from(track.children);

        function handleScrollAction(btn, direction) {
            // Apply Spring Button Click Anim
            btn.classList.remove('btn-press-anim');
            void btn.offsetWidth; // Force Reflow
            btn.classList.add('btn-press-anim');

            // Apply Container Squish/Shift Anim
            track.classList.add('track-shifting');
            
            setTimeout(() => {
                const rawWidth = items[0] ? items[0].offsetWidth : (isCenterMode ? 320 : 350);
                const itemWidth = rawWidth + 24; 
                track.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });

                setTimeout(() => {
                    track.classList.remove('track-shifting');
                }, 400); // Remove shift class when scroll settles
            }, 100);
        }

        if(prevBtn) prevBtn.addEventListener('click', () => handleScrollAction(prevBtn, -1));
        if(nextBtn) nextBtn.addEventListener('click', () => handleScrollAction(nextBtn, 1));

        // Center Mode Active Scaling 
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

            track.addEventListener('scroll', () => requestAnimationFrame(updateActiveItem));
            setTimeout(updateActiveItem, 100);
            setTimeout(updateActiveItem, 800); 
            window.addEventListener('resize', updateActiveItem);
        }

        // Mouse Drag to Scroll 
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.scrollBehavior = 'auto'; 
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
            const walk = (x - startX) * 2; 
            track.scrollLeft = scrollLeft - walk;
        });
    }

    setupCarousel('featuresTrack', '.carousel-prev', '.carousel-next', false);
    setupCarousel('screenshotsTrack', '.showcase-prev', '.showcase-next', true);

    // 6. Dynamic OTA Download Links Logic
    const ANDROID_VERSION = '16.2'; // Update this when bumping the Android version
    const OTA_BASE_URL = 'https://raw.githubusercontent.com/ProjectCiRCLE-ROM/OTA';

    async function fetchDownloadUrl(device, isGapps = false) {
        const fileSuffix = isGapps ? '_gms' : '';
        const url = `${OTA_BASE_URL}/${ANDROID_VERSION}/json/${device}${fileSuffix}.json`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) return null; // JSON doesn't exist yet (404)
            
            const data = await response.json();
            // Check if response array exists and has at least one entry
            if (data && data.response && data.response.length > 0) {
                return data.response[0].url;
            }
        } catch (error) {
            console.error(`Error fetching OTA data for ${device}:`, error);
        }
        return null;
    }

    const deviceCards = document.querySelectorAll('.m3-device-card');
    
    deviceCards.forEach(async (card) => {
        // Extract the device codename from the <h3> tag inside the card
        const deviceCodename = card.querySelector('h3').textContent.trim().toLowerCase();
        
        // Fetch both Vanilla and GApps links concurrently
        const [vanillaUrl, gappsUrl] = await Promise.all([
            fetchDownloadUrl(deviceCodename, false),
            fetchDownloadUrl(deviceCodename, true)
        ]);
        
        // If either link is found, update the UI
        if (vanillaUrl || gappsUrl) {
            // Hide the "Coming Soon" label
            const statusLabel = card.querySelector('.status-soon');
            if (statusLabel) statusLabel.style.display = 'none';
            
            // Create a container for the download buttons
            const linksContainer = document.createElement('div');
            linksContainer.className = 'device-links m3-animate m3-fade-slide-up in-view';
            
            // Inject Vanilla Button
            if (vanillaUrl) {
                linksContainer.innerHTML += `
                    <a href="${vanillaUrl}" class="device-dl-btn m-ripple" target="_blank" rel="noopener noreferrer">
                        Vanilla
                    </a>`;
            }
            
            // Inject GApps Button
            if (gappsUrl) {
                linksContainer.innerHTML += `
                    <a href="${gappsUrl}" class="device-dl-btn gms-btn m-ripple" target="_blank" rel="noopener noreferrer">
                        GApps
                    </a>`;
            }
            
            // Append buttons to the card
            card.querySelector('.device-info').appendChild(linksContainer);
            
            // Re-bind the ripple effect to the dynamically created buttons
            const newRipples = linksContainer.querySelectorAll('.m-ripple');
            newRipples.forEach(elem => {
                elem.addEventListener('mousedown', createRipple);
                elem.addEventListener('touchstart', createRipple, { passive: true });
            });
        }
    });

});