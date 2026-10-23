/* =========================================
   THEME TOGGLE
   ========================================= */
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');

try {
    if (localStorage.getItem('kiet-portfolio-theme') === 'light') {
        root.dataset.theme = 'light';
    }
} catch (_) {
    // The page still works if browser storage is unavailable.
}

function updateThemeButton() {
    const isLight = root.dataset.theme === 'light';
    themeButton.textContent = isLight ? '☾' : '☀';
    themeButton.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
}

updateThemeButton();
themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    updateThemeButton();
    try { localStorage.setItem('kiet-portfolio-theme', root.dataset.theme); } catch (_) { }
});

/* =========================================
   MOBILE MENU
   ========================================= */
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

function closeMenu() {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
}

menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

navigation.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
});

/* =========================================
   PROJECT FILTERS
   ========================================= */
const filterButtons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        filterButtons.forEach(item => {
            const active = item === button;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-pressed', String(active));
        });

        cards.forEach(card => {
            const categories = card.dataset.category.split(' ');
            card.hidden = filter !== 'all' && !categories.includes(filter);
        });
    });
});

/* =========================================
   PROJECT CASE STUDIES
   ========================================= */
const projectDetails = {
    fcinema: {
        title: 'FCinema — Cinema Management System',
        eyebrow: 'ACADEMIC TEAM PROJECT · 2026',
        summary: 'A web-based cinema management project developed with a seven-member student team. My work focused on movie discovery and the home page experience.',
        contributions: [
            'Developed a database-driven Home page with a dynamic movie carousel.',
            'Displayed Now Showing and Coming Soon movie sections.',
            'Worked with the MVC-based Controller, Service, and Repository structure to display movie information.',
            'Collaborated with team members on interface consistency and navigation.'
        ],
        technologies: ['Java', 'JSP / Servlets', 'SQL Server', 'HTML / CSS', 'JavaScript', 'MVC'],
        note: 'The source repository belongs to the team and is currently private. Public links and actual screenshots will be added only with team approval.'
    },
    student: {
        title: 'Student Management Application',
        eyebrow: 'ACADEMIC PRACTICE · 2026',
        summary: 'A desktop application exercise built while learning the foundations of C#/.NET and Windows Presentation Foundation (WPF).',
        contributions: [
            'Built a student management interface using WPF and XAML.',
            'Practiced Add, Update, Delete, and Search operations for student records.',
            'Explored basic data binding and MVVM-style organization.'
        ],
        technologies: ['C#/.NET (Basic)', 'WPF', 'XAML', 'MVVM basics'],
        note: 'This is a learning project; C#/.NET is an area I am still developing.'
    },
    pacman: {
        title: 'Pac-Man Game',
        eyebrow: 'ACADEMIC TEAM PROJECT · 2026',
        summary: 'An academic Java game project exploring object-oriented program structure and interface flow.',
        contributions: [
            'Studied and contributed to MVC-oriented organization of the game.',
            'Worked with the project team on interface and gameplay-related elements.',
            'Practiced separating game logic from display components.'
        ],
        technologies: ['Java', 'OOP', 'MVC'],
        note: 'The illustration on the project card is a concept graphic, not an actual game screenshot.'
    }
};

const dialog = document.querySelector('#project-dialog');
const dialogClose = dialog.querySelector('.dialog-close');

document.querySelectorAll('[data-project]').forEach(button => {
    button.addEventListener('click', () => {
        const project = projectDetails[button.dataset.project];
        if (!project) return;

        dialog.querySelector('#dialog-eyebrow').textContent = project.eyebrow;
        dialog.querySelector('#dialog-title').textContent = project.title;
        dialog.querySelector('#dialog-lead').textContent = project.summary;
        dialog.querySelector('#dialog-note').textContent = project.note;

        const list = dialog.querySelector('#dialog-contributions');
        const tech = dialog.querySelector('#dialog-tech');
        list.replaceChildren();
        tech.replaceChildren();

        project.contributions.forEach(contribution => {
            const item = document.createElement('li');
            item.textContent = contribution;
            list.appendChild(item);
        });
        project.technologies.forEach(technology => {
            const tag = document.createElement('span');
            tag.textContent = technology;
            tech.appendChild(tag);
        });

        if (typeof dialog.showModal === 'function') dialog.showModal();
    });
});

dialogClose.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
});

/* =========================================
   FOOTER
   ========================================= */
document.querySelector('#year').textContent = String(new Date().getFullYear());

/* =========================================
   CONTACT FORM
   ========================================= */

const contactForm = document.querySelector('#contact-form');

if (contactForm) {

    const formStatus = document.querySelector('#contact-form-status');

    const submitButton = contactForm.querySelector('.contact-submit');

    const originalButton = submitButton.innerHTML;


    // Show validation errors
    contactForm.addEventListener('invalid', () => {

        formStatus.textContent =
            'Please complete all required fields correctly.';

        formStatus.classList.add('is-error');

    }, true);


    // Submit Form
    contactForm.addEventListener('submit', async function (event) {

        event.preventDefault();


        const formData = new FormData(contactForm);


        // Spam protection
        if (String(formData.get('_honey') || '').trim()) {
            return;
        }


        // Loading state
        submitButton.disabled = true;

        submitButton.classList.add('is-loading');

        submitButton.textContent = 'Sending';

        formStatus.textContent = 'Sending your message...';

        formStatus.classList.remove('is-error');


        // Request timeout
        const controller = new AbortController();

        const timeoutId = setTimeout(() => {

            controller.abort();

        }, 15000);


        try {

            const endpoint = contactForm.action.replace(

                'https://formsubmit.co/',

                'https://formsubmit.co/ajax/'

            );


            const response = await fetch(endpoint, {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json',

                    'Accept': 'application/json'

                },

                body: JSON.stringify(
                    Object.fromEntries(formData.entries())
                ),

                signal: controller.signal

            });


            const result = await response.json();


            // Check response
            if (
                !response.ok ||
                result.success === false ||
                result.success === 'false'
            ) {

                throw new Error(
                    result.message || 'FormSubmit rejected the message.'
                );

            }


            // Success
            formStatus.textContent =
                'Your message has been submitted successfully!';


            contactForm.reset();

        } catch (error) {

            console.error('Contact Form Error:', error);

            formStatus.classList.add('is-error');


            if (error.name === 'AbortError') {

                formStatus.textContent =
                    'Request timed out. Please try again.';

            } else {

                formStatus.textContent =
                    error.message || 'Unable to send message.';

            }

        } finally {

            clearTimeout(timeoutId);


            // Restore button
            submitButton.disabled = false;

            submitButton.classList.remove('is-loading');

            submitButton.innerHTML = originalButton;

        }

    });

}