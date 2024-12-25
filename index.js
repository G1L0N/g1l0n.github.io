document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('username');
    const submitButton = document.querySelector('.button.proceed');
    const anonymousButton = document.querySelector('.button.left');
    submitButton.disabled = true;
    
    input.addEventListener('input', () => {
        if (input.value.trim() === '') {
            submitButton.disabled = true;
            submitButton.classList.remove('enabled');
        } else {
            submitButton.disabled = false;
            submitButton.classList.add('enabled');
        }
    });

    submitButton.addEventListener('click', () => {
        const username = input.value.trim();

        if (!localStorage.getItem(username)) {
            const user = {
                name: username,
                maxDifficulty: 'easy',
                maxScore: 0
            };
            localStorage.setItem(username, JSON.stringify(user));
        }
        window.location.href = `menu.html?username=${encodeURIComponent(username)}`;
    });
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            submitButton.click();
        }
    });

    anonymousButton.addEventListener('click', () => {
        if (confirm("При анонимной игре ваш результат не будет учтён в рейтинге. Вы уверены, что хотите играть анонимно?")) {
            const username = 'Аноним';
            if (!localStorage.getItem(username)) {
                const user = {
                    name: username,
                    maxDifficulty: 'hard',
                    maxScore: 0
                };
                localStorage.setItem(username, JSON.stringify(user));
            }
            window.location.href = `menu.html?username=${encodeURIComponent(username)}`;
        }
    });

});
