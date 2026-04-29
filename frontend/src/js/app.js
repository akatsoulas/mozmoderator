/* global bootstrap */

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

function toggleContactInfo() {
    const checkbox = document.getElementById('id_is_anonymous');
    const container = document.querySelector('.contact-info-container');
    if (!checkbox || !container) {
        return;
    }
    container.style.display = checkbox.checked ? '' : 'none';
}

function init() {
    document.querySelectorAll('.vote').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const questionId = btn.id;
            const response = await fetch(`/q/${questionId}/upvote`, {
                headers: { Accept: 'application/json' },
            });
            if (!response.ok) {
                return;
            }
            const data = await response.json();
            const counter = btn.previousElementSibling;
            if (counter) {
                counter.textContent = data.current_vote_count;
            }
            btn.classList.toggle('btn-light');
            btn.classList.toggle('btn-dark');
        });
    });

    const pageSelect = document.getElementById('page-select');
    if (pageSelect) {
        pageSelect.addEventListener('change', (event) => {
            window.location = event.target.value;
        });
    }

    const questionForm = document.getElementById('question-form');
    document.querySelectorAll('.reply-button').forEach((btn) => {
        btn.addEventListener('click', () => {
            const answerForm = document.getElementById('answer-form');
            if (questionForm && answerForm) {
                answerForm.setAttribute(
                    'action',
                    `${questionForm.getAttribute('action')}q/${btn.id}/reply`,
                );
            }
        });
    });

    const moderateForm = document.getElementById('moderate-form');
    document.querySelectorAll('.moderate-button').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (moderateForm) {
                moderateForm.setAttribute(
                    'action',
                    `${moderateForm.getAttribute('action')}${btn.id}/rejected`,
                );
            }
        });
    });

    const anonymousCheckbox = document.getElementById('id_is_anonymous');
    if (anonymousCheckbox) {
        anonymousCheckbox.addEventListener('click', toggleContactInfo);
        toggleContactInfo();
    }

    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const form = document.getElementById('logout_form');
            if (form) {
                form.submit();
            }
        });
    }

    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            new bootstrap.Tooltip(el);
        }
    });

    document.querySelectorAll('select.tom-select').forEach((el) => {
        if (typeof window.TomSelect === 'undefined') {
            return;
        }
        new window.TomSelect(el, {
            plugins: ['remove_button'],
            valueField: 'id',
            labelField: 'text',
            searchField: ['text'],
            preload: 'focus',
            load(query, callback) {
                const url = `${el.dataset.autocompleteUrl}?q=${encodeURIComponent(query)}`;
                fetch(url, { credentials: 'same-origin' })
                    .then((r) => (r.ok ? r.json() : { results: [] }))
                    .then((data) => callback(data.results))
                    .catch(() => callback());
            },
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export { getCookie };
