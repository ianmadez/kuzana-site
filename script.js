document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    const targetBtn = document.getElementById('hero-cta');
    const heroSection = document.querySelector('.hero-section');

    if (!canvas || !targetBtn || !heroSection) return;

    const ctx = canvas.getContext('2d');
    let mousePos = { x: null, y: null };
    let animationFrameId;

    const updateCanvasSize = () => {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    };

    const handleMouseMove = (e) => {
        // Stop tracking if scrolling down the page
        if (e.clientY > heroSection.offsetHeight) return;
        mousePos = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", updateCanvasSize);
    window.addEventListener("mousemove", handleMouseMove);
    updateCanvasSize();

    const drawArrow = () => {
        // Disable arrow drawing on mobile devices (screen width < 768px)
        if (window.innerWidth < 768) return;

        const x0 = mousePos.x;
        const y0 = mousePos.y;

        if (x0 === null || y0 === null) return;

        const rect = targetBtn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const a = Math.atan2(cy - y0, cx - x0);
        const x1 = cx - Math.cos(a) * (rect.width / 2 + 12);
        const y1 = cy - Math.sin(a) * (rect.height / 2 + 12);

        const midX = (x0 + x1) / 2;
        const midY = (y0 + y1) / 2;
        const offset = Math.min(200, Math.hypot(x1 - x0, y1 - y0) * 0.5);
        const t = Math.max(-1, Math.min(1, (y0 - y1) / 200));
        const controlX = midX;
        const controlY = midY + offset * t;

        const r = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
        const opacity = Math.min(1.0, (r - Math.max(rect.width, rect.height) / 2) / 500);

        // White arrow to pop against the colored gradient
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 2.5;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(controlX, controlY, x1, y1);
        ctx.setLineDash([10, 8]);
        ctx.stroke();
        ctx.restore();

        const angle = Math.atan2(y1 - controlY, x1 - controlX);
        const headLength = 12;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(
            x1 - headLength * Math.cos(angle - Math.PI / 6),
            y1 - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(x1, y1);
        ctx.lineTo(
            x1 - headLength * Math.cos(angle + Math.PI / 6),
            y1 - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
    };

    const animateLoop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawArrow();
        animationFrameId = requestAnimationFrame(animateLoop);
    };

    animateLoop();

    window.addEventListener('unload', () => {
        window.removeEventListener("resize", updateCanvasSize);
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(animationFrameId);
    });
});

// --- Mobile Hamburger Menu Logic ---
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        // Toggle the menu visibility
        navLinks.classList.toggle('active');

        // Swap the Font Awesome icon between bars and an X
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set up the Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the visible class to trigger the CSS transition
                entry.target.classList.add('is-visible');
                
                // Stop observing once it has animated so it doesn't repeat 
                // every time they scroll up and down
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // 2. Grab all elements with the 'fade-up' class and watch them
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
});