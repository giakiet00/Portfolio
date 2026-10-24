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

/* =========================================
   LANGUAGE TRANSLATION
   ========================================= */

const languageButton = document.querySelector('.language-toggle');

const languageCode = document.querySelector('.language-code');

const languageStorageKey = 'kiet-portfolio-language';

let currentLanguage = 'en';


/* =========================================
   VIETNAMESE CONTENT
   ========================================= */

const translationGroups = [

    /* Navigation */

    {
        selector: '.skip-link',
        vi: ['Đi đến nội dung']
    },

    {
        selector: '.site-nav a',
        vi: [
            'Giới thiệu',
            'Kỹ năng',
            'Dự án',
            'Liên hệ'
        ]
    },


    /* Hero */

    {
        selector: '.hero-badge-code > span:last-child',
        vi: [
            'Yêu thích<br>Công nghệ'
        ]
    },

    {
        selector: '.hero-badge-location > span:last-child',
        vi: [
            'Cần Thơ,<br>Việt Nam'
        ]
    },

    {
        selector: '.hero-intro-copy .eyebrow',
        vi: [
            '<span class="status-dot"></span> SINH VIÊN KỸ THUẬT PHẦN MỀM · ĐẠI HỌC FPT'
        ]
    },

    {
        selector: '.hero-intro-copy h1',
        vi: [
            'Xin chào, mình là <span class="text-gradient">Gia Kiệt.</span>'
        ]
    },

    {
        selector: '.hero-role',
        vi: [
            'Định hướng Thực tập sinh Phát triển Phần mềm'
        ]
    },

    {
        selector: '.hero-intro-copy .hero-description',
        vi: [
            `Mình là <strong>Nguyễn Hoàng Gia Kiệt</strong>,
            sinh viên ngành Kỹ thuật Phần mềm tại Đại học FPT.

            Mình yêu thích việc phát triển các ứng dụng thực tế,
            tìm hiểu cách hệ thống hoạt động và biến ý tưởng
            thành những giải pháp hữu ích.

            Thông qua các dự án học tập sử dụng
            <strong>Java, OOP, MVC và SQL Server</strong>,
            mình không ngừng cải thiện kiến thức chuyên môn,
            khả năng giải quyết vấn đề và kỹ năng làm việc nhóm.`
        ]
    },

    {
        selector: '.hero-actions a[href="#projects"]',
        vi: [
            'Khám phá dự án <span aria-hidden="true">↗</span>'
        ]
    },

    {
        selector: '.hero-actions .button-cv',
        vi: [
            'Tải CV <span aria-hidden="true">↓</span>'
        ]
    },

    {
        selector: '.hero-actions a[href="#contact"]',
        vi: [
            'Liên hệ với tôi <span aria-hidden="true">→</span>'
        ]
    },

    {
        selector: '.hero-social-label',
        vi: [
            'Kết nối với tôi'
        ]
    },

    {
        selector: '.hero-meta > span:last-child',
        vi: [
            '<span class="meta-icon">◇</span> Sẵn sàng cho cơ hội thực tập'
        ]
    },


    /* Statistics */

    {
        selector: '.stats-row > div > span',
        vi: [
            'Dự án tiêu biểu',
            'Thành viên nhóm FCinema',
            'Bắt đầu học Kỹ thuật Phần mềm'
        ]
    },

    {
        selector: '.stats-row > p',
        vi: [
            'Học hỏi thông qua thực hành, hợp tác nhóm và không ngừng cải thiện bản thân.'
        ]
    },


    /* About */

    {
        selector: '.about-section .section-kicker',
        vi: [
            '01 / GIỚI THIỆU'
        ]
    },

    {
        selector: '.about-section h2',
        vi: [
            'Một người luôn yêu thích <span>khám phá và giải quyết vấn đề.</span>'
        ]
    },

    {
        selector: '.about-content > p',
        vi: [

            `Mình là <strong>Nguyễn Hoàng Gia Kiệt</strong>,
            sinh viên ngành Kỹ thuật Phần mềm tại
            <strong>Đại học FPT – Cơ sở Cần Thơ</strong>.

            Mình đã có kinh nghiệm thực hành thông qua
            các dự án học tập về phát triển web bằng Java,
            SQL Server và kiến thức nền tảng về C#/.NET.`,

            `Mình đặc biệt quan tâm đến cách giao diện người dùng,
            xử lý nghiệp vụ và cơ sở dữ liệu phối hợp với nhau.

            Mình đề cao <strong>tư duy phân tích, làm việc nhóm,
            giao tiếp rõ ràng</strong> và luôn cố gắng tìm hiểu
            nguyên nhân của vấn đề khi sửa lỗi.`

        ]
    },

    {
        selector: '.about-pill-row span',
        vi: [
            'Giải quyết vấn đề',
            'Làm việc nhóm',
            'Tư duy phân tích',
            'Nghiên cứu với AI'
        ]
    },


    /* Skills */

    {
        selector: '.skills-section .section-kicker',
        vi: [
            '02 / KỸ NĂNG'
        ]
    },

    {
        selector: '.skills-section h2',
        vi: [
            'Những kỹ năng mình <span>đang phát triển.</span>'
        ]
    },

    {
        selector: '.skills-grid .skill-card h3',
        vi: [
            'Lập trình nền tảng',
            'Phát triển Web',
            'Dữ liệu và công cụ',
            'Đang tìm hiểu'
        ]
    },

    {
        selector: '.skills-grid .skill-card > p',
        vi: [

            'Kiến thức nền tảng Java, lập trình hướng đối tượng và kiến trúc MVC.',

            'Xây dựng giao diện và phát triển ứng dụng web sử dụng Java.',

            'Làm việc với cơ sở dữ liệu quan hệ, quản lý phiên bản và môi trường phát triển.',

            'Tiếp tục học C#/.NET WPF và ứng dụng AI để hỗ trợ nghiên cứu, tìm hiểu và gỡ lỗi.'

        ]
    },


    /* Projects */

    {
        selector: '.projects-section .section-kicker',
        vi: [
            '03 / DỰ ÁN TIÊU BIỂU'
        ]
    },

    {
        selector: '.projects-section h2',
        vi: [
            'Dự án và <span>kinh nghiệm thực hành.</span>'
        ]
    },


    /* FCinema Preview */

    {
        selector: '.preview-cinema .preview-top > span:last-child',
        vi: [
            'Phim · Suất chiếu · Đặt vé'
        ]
    },

    {
        selector: '.preview-cinema .mini-label',
        vi: [
            'ĐẶT VÉ XEM PHIM'
        ]
    },

    {
        selector: '.preview-cinema .movie-copy strong',
        vi: [
            'Chọn phim.<br>Đặt ghế.'
        ]
    },

    {
        selector: '.preview-cinema .mini-button',
        vi: [
            'Đặt vé ngay ↗'
        ]
    },


    /* Student Management Preview */

    {
        selector: '.preview-students .app-title',
        vi: [
            '<span class="app-logo">S</span> Quản lý sinh viên <span class="app-dots">•••</span>'
        ]
    },

    {
        selector: '.preview-students .app-search',
        vi: [
            '⌕ &nbsp; Tìm kiếm sinh viên...'
        ]
    },

    {
        selector: '.preview-students .app-table > div:first-child b',
        vi: [
            'Mã SV',
            'Họ tên',
            'Trạng thái'
        ]
    },

    {
        selector: '.preview-students .app-table i',
        vi: [
            'Đang học',
            'Đang học',
            'Đang học'
        ]
    },

    {
        selector: '.preview-students .app-actions span',
        vi: [
            '+ Thêm',
            'Cập nhật',
            'Xóa'
        ]
    },


    /* Project Details */

    {
        selector: '.project-card .project-topline > span:first-child',
        vi: [
            '01 / DỰ ÁN NHÓM',
            '02 / DỰ ÁN HỌC TẬP',
            '03 / DỰ ÁN NHÓM'
        ]
    },

    {
        selector: '.project-card .project-info > p',
        vi: [

            `Website đặt vé xem phim được phát triển bởi nhóm 7 thành viên.
            Mình xây dựng trang Home lấy dữ liệu từ cơ sở dữ liệu,
            hiển thị danh sách phim, carousel và hỗ trợ chuyển
            đến chức năng đặt vé theo suất chiếu.`,

            `Ứng dụng quản lý sinh viên trên WPF với các chức năng
            Thêm, Sửa, Xóa và Tìm kiếm, được xây dựng trong
            quá trình học C#/.NET và XAML.`,

            `Dự án game Pac-Man bằng Java, tập trung vào
            lập trình hướng đối tượng, mô hình MVC
            và cách tổ chức giao diện trò chơi.`

        ]
    },

    {
        selector: '.project-actions button[data-project]',
        vi: [
            'Xem chi tiết <span aria-hidden="true">↗</span>',
            'Xem chi tiết <span aria-hidden="true">↗</span>',
            'Xem chi tiết <span aria-hidden="true">↗</span>'
        ]
    },

    {
        selector: '.project-actions a.source-link',
        vi: [
            'Xem mã nguồn <span aria-hidden="true">↗</span>',
            'Xem mã nguồn <span aria-hidden="true">↗</span>',
            'Xem mã nguồn <span aria-hidden="true">↗</span>'
        ]
    },


    /* Contact */

    {
        selector: '.contact-section .section-kicker',
        vi: [
            '04 / LIÊN HỆ'
        ]
    },

    {
        selector: '.contact-section h2',
        vi: [
            'Bạn có cơ hội hợp tác <span>muốn chia sẻ?</span>'
        ]
    },

    {
        selector: '.contact-content > p:not(.section-kicker)',
        vi: [
            `Mình đang tìm kiếm cơ hội để học hỏi,
            đóng góp và phát triển với vai trò lập trình viên.

            Rất mong nhận được thông tin từ bạn!`
        ]
    },

    {
        selector: '.contact-field label',
        vi: [
            'Họ và tên',
            'Email của bạn',
            'Nội dung'
        ]
    },

    {
        selector: '.contact-privacy',
        vi: [
            'Tin nhắn được xử lý qua FormSubmit để gửi đến email của tôi.'
        ]
    },

    {
        selector: '.contact-buttons button',
        vi: [
            'Sao chép địa chỉ email'
        ]
    },

    {
        selector: '.contact-buttons a',
        vi: [
            'GitHub của tôi <span aria-hidden="true">↗</span>'
        ]
    },


    /* Project Dialog */

    {
        selector: '.dialog-detail h3',
        vi: [
            'Đóng góp của mình',
            'Công nghệ sử dụng'
        ]
    },


    /* Footer */

    {
        selector: '.site-footer a',
        vi: [
            'Trở về đầu trang ↑'
        ]
    }

];


/* =========================================
   SAVE ORIGINAL ENGLISH CONTENT
   ========================================= */

const languageBindings = [];

translationGroups.forEach(group => {

    const elements = document.querySelectorAll(group.selector);

    elements.forEach((element, index) => {

        const vietnamese = group.vi[index];

        if (vietnamese === undefined) {
            return;
        }

        languageBindings.push({

            element: element,

            english: element.innerHTML,

            vietnamese: vietnamese

        });

    });

});


/* =========================================
   PROJECT DETAILS - VIETNAMESE
   ========================================= */

const projectDetailsVi = {

    fcinema: {

        title: 'FCinema — Hệ thống quản lý rạp và đặt vé xem phim',

        eyebrow: 'DỰ ÁN NHÓM · 2026',

        summary:
            'Website quản lý rạp và đặt vé xem phim được phát triển bởi nhóm 7 sinh viên. Mình tập trung vào trang Home và chức năng khám phá phim.',

        contributions: [

            'Xây dựng trang Home lấy dữ liệu từ cơ sở dữ liệu.',

            'Hiển thị carousel phim và danh sách phim đang chiếu, sắp chiếu.',

            'Làm việc với mô hình MVC gồm Controller, Service và Repository.',

            'Phối hợp với các thành viên để thống nhất giao diện và điều hướng.'

        ],

        technologies: [
            'Java',
            'JSP / Servlets',
            'SQL Server',
            'HTML / CSS',
            'JavaScript',
            'MVC'
        ],

        note:
            'Đây là dự án học tập được thực hiện theo nhóm.'

    },


    student: {

        title: 'Ứng dụng quản lý sinh viên',

        eyebrow: 'DỰ ÁN HỌC TẬP · 2026',

        summary:
            'Ứng dụng desktop được xây dựng trong quá trình học C#/.NET, WPF và XAML.',

        contributions: [

            'Xây dựng giao diện quản lý sinh viên bằng WPF và XAML.',

            'Thực hành các chức năng Thêm, Sửa, Xóa và Tìm kiếm.',

            'Tìm hiểu Data Binding và cách tổ chức chương trình theo MVVM.'

        ],

        technologies: [
            'C#/.NET (Cơ bản)',
            'WPF',
            'XAML',
            'MVVM'
        ],

        note:
            'Đây là dự án học tập. Mình vẫn đang tiếp tục cải thiện kiến thức C#/.NET.'

    },


    pacman: {

        title: 'Trò chơi Pac-Man',

        eyebrow: 'DỰ ÁN NHÓM · 2026',

        summary:
            'Dự án game Pac-Man bằng Java nhằm thực hành lập trình hướng đối tượng và tổ chức chương trình.',

        contributions: [

            'Tìm hiểu và đóng góp vào cách tổ chức chương trình theo MVC.',

            'Phối hợp với nhóm phát triển các thành phần giao diện và trò chơi.',

            'Thực hành tách biệt phần xử lý logic và hiển thị.'

        ],

        technologies: [
            'Java',
            'OOP',
            'MVC'
        ],

        note:
            'Dự án được thực hiện trong quá trình học tập.'

    }

};


/* =========================================
   RENDER PROJECT DIALOG
   ========================================= */

function renderTranslatedProject(projectKey) {

    const projectDialog = document.querySelector('#project-dialog');

    if (!projectDialog || !projectKey) {
        return;
    }

    const selectedProjects =
        currentLanguage === 'vi'
            ? projectDetailsVi
            : projectDetails;

    const project = selectedProjects[projectKey];

    if (!project) {
        return;
    }

    projectDialog.querySelector('#dialog-eyebrow').textContent =
        project.eyebrow;

    projectDialog.querySelector('#dialog-title').textContent =
        project.title;

    projectDialog.querySelector('#dialog-lead').textContent =
        project.summary;

    projectDialog.querySelector('#dialog-note').textContent =
        project.note;


    /* Contributions */

    const contributionsList =
        projectDialog.querySelector('#dialog-contributions');

    contributionsList.replaceChildren();

    project.contributions.forEach(contribution => {

        const item = document.createElement('li');

        item.textContent = contribution;

        contributionsList.appendChild(item);

    });


    /* Technologies */

    const technologyList =
        projectDialog.querySelector('#dialog-tech');

    technologyList.replaceChildren();

    project.technologies.forEach(technology => {

        const tag = document.createElement('span');

        tag.textContent = technology;

        technologyList.appendChild(tag);

    });

}


/* =========================================
   TRANSLATE FORM STATUS
   ========================================= */

const formStatusTranslations = {

    'Please complete all required fields correctly.':
        'Vui lòng điền đầy đủ và chính xác các trường bắt buộc.',

    'Sending your message...':
        'Đang gửi tin nhắn của bạn...',

    'Your message has been submitted successfully!':
        'Tin nhắn của bạn đã được gửi thành công!',

    'Request timed out. Please try again.':
        'Yêu cầu quá thời gian chờ. Vui lòng thử lại.',

    'Unable to send message.':
        'Không thể gửi tin nhắn. Vui lòng thử lại.',

    'FormSubmit rejected the message.':
        'Hệ thống chưa chấp nhận tin nhắn.'

};

const translatedFormStatus =
    document.querySelector('#contact-form-status');

function updateFormStatusLanguage() {

    if (!translatedFormStatus) {
        return;
    }

    const message = translatedFormStatus.textContent.trim();

    if (!message) {
        return;
    }


    /* English to Vietnamese */

    if (currentLanguage === 'vi') {

        const translated = formStatusTranslations[message];

        if (translated) {
            translatedFormStatus.textContent = translated;
        }

        return;
    }


    /* Vietnamese to English */

    const original = Object.entries(formStatusTranslations)
        .find(([, vietnamese]) => vietnamese === message);

    if (original) {
        translatedFormStatus.textContent = original[0];
    }

}

if (translatedFormStatus) {

    const formStatusObserver = new MutationObserver(() => {

        updateFormStatusLanguage();

    });

    formStatusObserver.observe(translatedFormStatus, {

        childList: true,

        characterData: true,

        subtree: true

    });

}


/* =========================================
   TRANSLATE SEND BUTTON
   ========================================= */

const translatedSendButton =
    document.querySelector('.contact-submit');

const englishSendButtonHTML = translatedSendButton
    ? translatedSendButton.innerHTML
    : '';

const vietnameseSendButtonHTML =
    'Gửi tin nhắn <span aria-hidden="true">↗</span>';


function updateSendButtonLanguage() {

    if (!translatedSendButton) {
        return;
    }

    const isLoading =
        translatedSendButton.classList.contains('is-loading');


    /* While Sending */

    if (isLoading) {

        const desiredText =
            currentLanguage === 'vi'
                ? 'Đang gửi...'
                : 'Sending';

        if (translatedSendButton.textContent.trim() !== desiredText) {
            translatedSendButton.textContent = desiredText;
        }

        return;
    }


    /* Normal State */

    const expectedText =
        currentLanguage === 'vi'
            ? 'Gửi tin nhắn'
            : 'Send Message';

    if (!translatedSendButton.textContent.includes(expectedText)) {

        translatedSendButton.innerHTML =
            currentLanguage === 'vi'
                ? vietnameseSendButtonHTML
                : englishSendButtonHTML;

    }

}

if (translatedSendButton) {

    const sendButtonObserver = new MutationObserver(() => {

        updateSendButtonLanguage();

    });

    sendButtonObserver.observe(translatedSendButton, {

        childList: true,

        characterData: true,

        subtree: true,

        attributes: true,

        attributeFilter: ['class']

    });

}


/* =========================================
   UPDATE LANGUAGE
   ========================================= */

function updateLanguage(language) {

    currentLanguage = language;


    /* Update HTML Language */

    document.documentElement.lang = language;


    /* Update Language Button */

    if (languageCode) {

        languageCode.textContent =
            language === 'vi' ? 'VI' : 'EN';

    }

    if (languageButton) {

        languageButton.setAttribute(

            'aria-label',

            language === 'vi'
                ? 'Chuyển sang tiếng Anh'
                : 'Switch to Vietnamese'

        );

        languageButton.title =
            language === 'vi'
                ? 'Chuyển sang tiếng Anh'
                : 'Switch to Vietnamese';

    }


    /* Update Page Title */

    document.title =
        language === 'vi'
            ? 'Gia Kiệt | Portfolio Lập trình viên'
            : 'Gia Kiet | Software Developer Portfolio';


    /* Update Visible Content */

    languageBindings.forEach(binding => {

        binding.element.innerHTML =
            language === 'vi'
                ? binding.vietnamese
                : binding.english;

    });


    /* Update Form Placeholders */

    const nameInput = document.querySelector('#contact-name');

    const emailInput = document.querySelector('#contact-email');

    const messageInput = document.querySelector('#contact-message');

    if (nameInput) {

        nameInput.placeholder =
            language === 'vi'
                ? 'Nhập họ và tên của bạn'
                : 'Your full name';

    }

    if (emailInput) {

        emailInput.placeholder =
            language === 'vi'
                ? 'email@example.com'
                : 'you@example.com';

    }

    if (messageInput) {

        messageInput.placeholder =
            language === 'vi'
                ? 'Hãy chia sẻ cơ hội hợp tác hoặc dự án của bạn...'
                : 'Tell me about your opportunity or project...';

    }


    /* Update Accessibility Labels */

    const closeDialogButton =
        document.querySelector('.dialog-close');

    if (closeDialogButton) {

        closeDialogButton.setAttribute(

            'aria-label',

            language === 'vi'
                ? 'Đóng chi tiết dự án'
                : 'Close project details'

        );

    }

    const themeToggleButton =
        document.querySelector('.theme-toggle');

    if (themeToggleButton) {

        const isLight =
            document.documentElement.dataset.theme === 'light';

        themeToggleButton.setAttribute(

            'aria-label',

            language === 'vi'
                ? (isLight ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng')
                : (isLight ? 'Switch to dark mode' : 'Switch to light mode')

        );

    }


    /* Update Contact Form */

    updateFormStatusLanguage();

    updateSendButtonLanguage();


    /* Update Open Project Dialog */

    const projectDialog =
        document.querySelector('#project-dialog');

    if (
        projectDialog &&
        projectDialog.open &&
        projectDialog.dataset.activeProject
    ) {

        renderTranslatedProject(
            projectDialog.dataset.activeProject
        );

    }


    /* Save Language */

    try {

        localStorage.setItem(languageStorageKey, language);

    } catch (error) {

        console.warn('Language preference could not be saved.');

    }

}


/* =========================================
   LANGUAGE BUTTON EVENT
   ========================================= */

if (languageButton) {

    languageButton.addEventListener('click', () => {

        const nextLanguage =
            currentLanguage === 'en' ? 'vi' : 'en';

        updateLanguage(nextLanguage);

    });

}


/* =========================================
   PROJECT DIALOG LANGUAGE EVENT
   ========================================= */

document.querySelectorAll('[data-project]').forEach(button => {

    button.addEventListener('click', () => {

        const projectKey = button.dataset.project;

        const projectDialog =
            document.querySelector('#project-dialog');

        if (projectDialog) {

            projectDialog.dataset.activeProject = projectKey;

        }

        if (currentLanguage === 'vi') {

            renderTranslatedProject(projectKey);

        }

    });

});


/* =========================================
   KEEP THEME LABEL TRANSLATED
   ========================================= */

const translatedThemeButton =
    document.querySelector('.theme-toggle');

if (translatedThemeButton) {

    translatedThemeButton.addEventListener('click', () => {

        const isLight =
            document.documentElement.dataset.theme === 'light';

        translatedThemeButton.setAttribute(

            'aria-label',

            currentLanguage === 'vi'
                ? (isLight ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng')
                : (isLight ? 'Switch to dark mode' : 'Switch to light mode')

        );

    });

}


/* =========================================
   LOAD SAVED LANGUAGE
   ========================================= */

try {

    const savedLanguage =
        localStorage.getItem(languageStorageKey);

    if (savedLanguage === 'vi') {

        currentLanguage = 'vi';

    }

} catch (error) {

    currentLanguage = 'en';

}


/* =========================================
   INITIALIZE LANGUAGE
   ========================================= */

updateLanguage(currentLanguage);