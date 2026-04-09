// Professional Navigation & Layout Scripts
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const viewSections = document.querySelectorAll('.view-section');

    const switchSection = (targetId) => {
        // Remove active class from all buttons and sections
        navButtons.forEach(btn => btn.classList.remove('active'));
        viewSections.forEach(sec => sec.classList.remove('active'));

        // Add active class to corresponding button
        const activeBtn = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Add active class to target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Re-trigger CSS animations gracefully
            const elementsToAnimate = targetSection.querySelectorAll('.fade-in-up');
            elementsToAnimate.forEach(el => {
                el.style.animation = 'none';
                void el.offsetWidth; // trigger reflow
                el.style.animation = null; 
            });
        }
    };

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            switchSection(targetId);
        });
    });
});
