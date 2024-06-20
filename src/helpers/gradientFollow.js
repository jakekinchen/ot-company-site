export function enableGradientFollowByName(className) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            element.style.setProperty('--x', `${xPercent}%`);
            element.style.setProperty('--y', `${yPercent}%`);
        });

        element.addEventListener('mouseleave', () => {
            element.style.setProperty('--x', '50%');
            element.style.setProperty('--y', '50%');
        });
    });
}
export function enableGradientFollowById(id) {
    document.addEventListener('DOMContentLoaded', () => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('mousemove', (event) => {
                const rect = element.getBoundingClientRect();
                const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
                const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
                element.style.setProperty('--x', `${xPercent}%`);
                element.style.setProperty('--y', `${yPercent}%`);
            });

            element.addEventListener('mouseleave', () => {
                element.style.setProperty('--x', '50%');
                element.style.setProperty('--y', '50%');
            });
        }
    });
}

