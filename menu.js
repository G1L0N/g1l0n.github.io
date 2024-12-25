function updateLeaderboard() {
    const leaderboard = document.querySelector('.leaderboard');
    leaderboard.innerHTML = '';

    const allPlayers = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const data = JSON.parse(localStorage.getItem(key));
        
        if (data && data.name !== 'Аноним' && data.maxScore !== 0) {
            allPlayers.push({ name: data.name, maxScore: data.maxScore });
        }
    }

    allPlayers.sort((a, b) => b.maxScore - a.maxScore);

    allPlayers.slice(0, 5).forEach((player, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${player.name} - ${player.maxScore} очков`;
        leaderboard.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    if (!username) {
        window.location.href = 'index.html';
        return null;
    }
    const userData = JSON.parse(localStorage.getItem(username));
    if (!userData) {
        window.location.href = 'index.html';
        return null;
    }
    const enabledButtons = document.querySelectorAll('.button.enabled');
    const easyPlayButton = enabledButtons[0];
    const exitButton = enabledButtons[1];
    const proceedButtons = document.querySelectorAll('.button.proceed');
    const mediumPlayButton = proceedButtons[0];
    const hardPlayButton = proceedButtons[1];
    mediumPlayButton.disabled = true;
    hardPlayButton.disabled = true;

    if (userData.maxDifficulty === 'medium') {
        mediumPlayButton.disabled = false;
        mediumPlayButton.classList.add('enabled');
    }
    if (userData.maxDifficulty === 'hard') {
        mediumPlayButton.disabled = false;
        mediumPlayButton.classList.add('enabled');
        hardPlayButton.disabled = false;
        hardPlayButton.classList.add('enabled');
    }

    exitButton.addEventListener('click', () => {
        window.location.href = 'index.html';
        return null;
    });
    easyPlayButton.addEventListener('click', () => {
        window.location.href = `game.html?username=${encodeURIComponent(username)}&difficulty=easy`;

    });
    mediumPlayButton.addEventListener('click', () => {
        window.location.href = `game.html?username=${encodeURIComponent(username)}&difficulty=medium`;

    });
    hardPlayButton.addEventListener('click', () => {
        window.location.href = `game.html?username=${encodeURIComponent(username)}&difficulty=hard`;

    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            exitButton.click();
        }
    });

    const usernameDisplay = document.getElementById('username-display');
    const maxScoreDisplay = document.getElementById('max-score');
    usernameDisplay.textContent = `Имя: ${username}`;
    maxScoreDisplay.textContent = `Рекорд очков: ${userData.maxScore}`;
    updateLeaderboard();
});