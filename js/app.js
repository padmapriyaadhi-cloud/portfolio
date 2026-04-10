document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-container');
    const navButtons = document.querySelectorAll('.nav-btn');

    // --- CONSTELLATION ANIMATION ---
    const initConstellation = () => {
        const canvas = document.getElementById('constellation-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 70;
        const connectionDistance = 150;
        const mouse = { x: null, y: null, radius: 150 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Particles will need reset if screen size changes drastically
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.baseSize = this.size;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

                // Mouse interaction for glow/attraction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    this.size = this.baseSize * 2;
                } else {
                    this.size = this.baseSize;
                }
            }
            draw() {
                ctx.fillStyle = 'rgba(56, 189, 248, 0.7)'; // Match --primary
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connections
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 - (distance / connectionDistance)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };

        resize();
        animate();
    };

    // --- 3D FLOATING CRYSTALS ---
    const initCrystals = () => {
        const container = document.getElementById('crystals-container');
        if (!container) return;
        const crystalCount = 8;
        const crystals = [];

        for (let i = 0; i < crystalCount; i++) {
            const crystal = document.createElement('div');
            crystal.className = 'crystal floating-element';
            
            // Random positioning
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 60 + 40;
            const delay = Math.random() * 20;
            const duration = Math.random() * 10 + 10;
            
            crystal.style.left = `${x}%`;
            crystal.style.top = `${y}%`;
            crystal.style.width = `${size}px`;
            crystal.style.height = `${size}px`;
            crystal.style.animationDelay = `-${delay}s`;
            crystal.style.animationDuration = `${duration}s`;
            crystal.style.opacity = Math.random() * 0.3 + 0.1;
            
            container.appendChild(crystal);
            crystals.push({
                el: crystal,
                x: x,
                y: y,
                speed: Math.random() * 0.05 + 0.02
            });
        }

        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            crystals.forEach(c => {
                const moveX = mouseX * c.speed * 500;
                const moveY = mouseY * c.speed * 500;
                c.el.style.transform = `translate(${moveX}px, ${moveY}px) perspective(1000px) rotateY(${mouseX * 20}deg)`;
            });

            // Perspective grid reaction
            const grid = document.querySelector('.perspective-grid');
            if (grid) {
                grid.style.transform = `perspective(800px) rotateX(60deg) rotateZ(${mouseX * 10}deg) translateX(${mouseX * -50}px)`;
            }
        });
    };

    // --- PORTAL TRANSITION EFFECT ---
    const triggerPortalTransition = () => {
        const portal = document.getElementById('portal-flash');
        if (!portal) return;

        // Removing boom animation as requested, keep simple interaction logic if needed in future
    };

    // --- MOUSE PARTICLES ---
    const initMouseParticles = () => {
        const particleCount = 12;
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'floating-particle';
            document.body.appendChild(p);
            particles.push({
                el: p,
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                targetX: 0, targetY: 0,
                speed: 0.05 + (i * 0.02)
            });
        }

        window.addEventListener('mousemove', (e) => {
            particles.forEach(p => {
                p.targetX = e.clientX;
                p.targetY = e.clientY;
            });
        });

        const animateParticles = () => {
            particles.forEach(p => {
                p.x += (p.targetX - p.x) * p.speed;
                p.y += (p.targetY - p.y) * p.speed;
                p.el.style.left = `${p.x}px`;
                p.el.style.top = `${p.y}px`;
                p.el.style.transform = `scale(${1 - (p.speed * 3)})`;
            });
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    };

    // --- PAGE LOADING ---
    const loadPage = async (page, index = 0, initial = false) => {
        try {
            // Apply dark mode theme always (or manage as needed)
            document.body.classList.remove('light-mode');

            if (!initial) triggerPortalTransition();
            
            // Clean up transition state immediately
            mainContent.classList.remove('vortex-out', 'vortex-in');
            mainContent.style.opacity = '0';
            
            // Fetch the page content with cache busting
            try {
                const response = await fetch(`pages/${page}.html?t=${new Date().getTime()}`, { cache: 'no-cache' });
                
                if (response.ok) {
                    const html = await response.text();
                    
                    // Delay slightly for smooth swap
                    setTimeout(() => {
                        mainContent.innerHTML = html;


                        // Ensure visibility and finalize transitions
                        requestAnimationFrame(() => {
                            mainContent.style.opacity = '1';
                            window.scrollTo(0, 0);
                            initDynamicEffects();
                        });
                    }, initial ? 0 : 400);
                } else {
                    // Fallback visual for missing or failed sections
                    mainContent.classList.remove('vortex-out');
                    mainContent.innerHTML = `
                        <div class="glass" style="padding: 4rem; text-align: center; border-radius: 20px; margin: 2rem;">
                            <h2 style="font-size: 2rem; color: #fff; margin-bottom: 1rem;">🚧 Section Under Construction</h2>
                            <p class="text-muted" style="font-size: 1.1rem;">The <strong>${page}</strong> module is currently being finalized. Stay tuned!</p>
                        </div>`;
                    mainContent.style.opacity = '1';
                }
            } catch (fetchErr) {
                console.error('Network error loading page:', fetchErr);
                mainContent.classList.remove('vortex-out');
                mainContent.innerHTML = `
                    <div class="glass" style="padding: 4rem; text-align: center; border-radius: 20px; margin: 2rem;">
                        <h2 style="font-size: 2rem; color: #fff; margin-bottom: 1rem;">❌ Oops! Something went wrong</h2>
                        <p class="text-muted" style="font-size: 1.1rem;">Could not connect to the server to load the ${page} content.</p>
                    </div>`;
                mainContent.style.opacity = '1';
            }
        } catch (error) {
            console.error('Process error loading page:', error);
            mainContent.classList.remove('vortex-out');
            mainContent.style.opacity = '1';
        }
    };

    // --- 3D INTERACTIVE EFFECTS ---
    const initDynamicEffects = () => {
        // Exclude elements with 'static-card' to keep them stable
        const boxes = document.querySelectorAll('.exp-box:not(.static-card), .about-card-3d:not(.static-card)');
        
        boxes.forEach(box => {
            box.addEventListener('mousemove', (e) => {
                const rect = box.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Mouse tracking for shine/glow
                box.style.setProperty('--mouse-x', `${x}px`);
                box.style.setProperty('--mouse-y', `${y}px`);
                box.style.setProperty('--shine-x', `${x}px`);
                box.style.setProperty('--shine-y', `${y}px`);

                // 3D Tilt calculation
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (centerY - y) / 12; // Balanced intensity
                const rotateY = (x - centerX) / 18;

                box.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
                
                // Add depth to specific inner elements for parallax
                const depthElements = box.querySelectorAll(':scope > div, :scope > p, :scope > img, :scope > h3, :scope > .exp-icon');
                depthElements.forEach(el => {
                    el.style.transform = 'translateZ(60px)';
                    el.style.transition = 'transform 0.1s ease';
                });
            });

            box.addEventListener('mouseleave', () => {
                box.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0) scale(1)';
                const depthElements = box.querySelectorAll(':scope > div, :scope > p, :scope > img, :scope > h3, :scope > .exp-icon');
                depthElements.forEach(el => {
                    el.style.transform = 'translateZ(0)';
                });
            });
        });
    };

    // Nav Menu Event Listeners
    navButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            if (btn.hasAttribute('href')) return;
            e.preventDefault();
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            if (target) loadPage(target, index);
        });
    });

    // Initializations
    initConstellation();
    initCrystals();
    initMouseParticles();
    loadPage('home', 0, true);
});

// Global Function for Skills Tab navigation (Required due to innerHTML string parsing dropping scripts)
window.showSkillTab = function(tabId, btnElement) {
    document.querySelectorAll('.skill-content-panel').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.skill-tab-btn').forEach(btn => {
        btn.style.background = 'transparent';
        btn.style.color = '#fff';
        btn.classList.remove('active');
    });
    
    document.getElementById('tab-' + tabId).style.display = 'block';
    if(btnElement) {
        btnElement.style.background = 'var(--primary)';
        btnElement.style.color = '#000';
        btnElement.classList.add('active');
    }
};

// Global Functions for Java Modal
window.openJavaModal = function() {
    const modal = document.getElementById('javaModal');
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        if (modal.children[0]) modal.children[0].style.transform = 'translateY(0)';
    }, 10);
};

window.closeJavaModal = function() {
    const modal = document.getElementById('javaModal');
    if (!modal) return;
    modal.style.opacity = '0';
    if (modal.children[0]) modal.children[0].style.transform = 'translateY(-20px)';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
};

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('javaModal');
    if (event.target === modal) {
        window.closeJavaModal();
    }
});
