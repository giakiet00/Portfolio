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
   PROJECT CASE STUDIES
   ========================================= */
const projectDetails = {
    fcinema: {
        title: 'FCinema — Cinema Ticket Booking System',
        eyebrow: 'ACADEMIC TEAM PROJECT · 2026',
        summary: 'A cinema ticket booking website developed by a seven-member student team. My contribution focused on the Home page and entry points to showtime-based ticket booking.',
        contributions: [
            'Developed a database-driven Home page with a dynamic movie carousel and quick-booking options.',
            'Displayed Now Showing and Coming Soon movie sections.',
            'Worked with the MVC-based Controller, Service, and Repository structure to display movie information.',
            'Collaborated with team members on interface consistency and navigation.'
        ],
        technologies: ['Java', 'JSP / Servlets', 'SQL Server', 'HTML / CSS', 'JavaScript', 'MVC'],
        note: 'The team repository is public and linked from the project card. Contributions described here refer to my work on the team project.'
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
   CONTACT EMAIL
   ========================================= */
const copyEmailButton = document.querySelector('[data-copy-email]');
if (copyEmailButton) {
    copyEmailButton.addEventListener('click', async () => {
        const email = copyEmailButton.dataset.copyEmail;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(email);
            } else {
                const field = document.createElement('textarea');
                field.value = email;
                field.style.position = 'fixed';
                field.style.opacity = '0';
                document.body.appendChild(field);
                field.select();
                const copied = document.execCommand('copy');
                field.remove();
                if (!copied) throw new Error('Copy failed');
            }
            copyEmailButton.textContent = 'Email copied ✓';
        } catch (_) {
            copyEmailButton.textContent = email;
        }
        window.setTimeout(() => {
            copyEmailButton.textContent = 'Copy email address';
        }, 3500);
    });
}
