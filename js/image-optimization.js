// Optimización de carga de imágenes
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer para lazy loading más eficiente
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Crear una nueva imagen para cargar
                    const newImg = new Image();
                    newImg.onload = function() {
                        img.src = this.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                    };
                    
                    // Comenzar la carga
                    newImg.src = img.dataset.src || img.src;
                    observer.unobserve(img);
                }
            });
        }, {
            // Cargar imágenes cuando están al 20% de aparecer en pantalla
            rootMargin: '20% 0px',
            threshold: 0.01
        });

        // Observar todas las imágenes con lazy loading
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    // Precargar imágenes del portfolio cuando se hace hover
    const portfolioLinks = document.querySelectorAll('a[href*=".html"]');
    portfolioLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const href = this.getAttribute('href');
            if (href && href.includes('.html')) {
                // Precargar la página
                const linkElement = document.createElement('link');
                linkElement.rel = 'prefetch';
                linkElement.href = href;
                document.head.appendChild(linkElement);
            }
        });
    });

    // Optimizar el scroll para lazy loading
    let ticking = false;
    function updateImages() {
        // Forzar actualización de imágenes visibles
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100) {
                img.loading = 'eager';
            }
        });
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateImages);
            ticking = true;
        }
    });
});

// Comprimir calidad de imágenes en dispositivos móviles
function optimizeForDevice() {
    if (window.innerWidth <= 768) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Añadir parámetros de optimización si el servidor lo soporta
            if (img.src && !img.src.includes('?')) {
                img.style.imageRendering = 'auto';
                img.style.filter = 'contrast(1.1)'; // Mejorar percepción visual
            }
        });
    }
}

// Ejecutar optimización al cargar y redimensionar
window.addEventListener('load', optimizeForDevice);
window.addEventListener('resize', optimizeForDevice);
