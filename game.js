const options = {
    1: [
        '1bear1.jpg', '1bear2.jpg', 
        '1cat1.jpg', '1cat2.jpg', 
        '1wolf1.jpg', '1wolf2.jpg'
    ],
    2: [
        '2cow1.jpg', '2cow2.jpg', 
        '2horse1.jpg', '2horse2.jpg', 
        '2pig1.jpg', '2pig2.jpg'
    ],
    3: [
        '3ele1.jpg', '3ele2.jpg', 
        '3rhino1.jpg', '3rhino2.jpg'
    ],
    4: [
        '4croc1.jpg', '4croc2.jpg', 
        '4gorilla1.jpg', '4gorilla2.jpg', 
        '4rac1.jpg', '4rac2.jpg'
    ],
    5: [
        '5duck1.jpg', '5duck2.jpg', 
        '5hen1.jpg', '5hen2.jpg', 
        '5kang1.jpg', '5kang2.jpg', 
        '5trex1.jpg', '5trex2.jpg'
    ],
    6: [
        '6frog1.jpg', '6frog2.jpg', 
        '6lemur1.jpg', '6lemur2.jpg'
    ],
    7: [
        '7human1.jpg', '7human2.jpg', 
        '7rabbit1.jpg', '7rabbit2.jpg'
    ]
};
const masks = ['bricks.png', 'circle.png', 'half.png', 'line.png'];
const maskIds = ['answer1mask', 'answer2mask', 'answer3mask', 'answer4mask'];
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const difficulty = urlParams.get('difficulty');
let rightAnswer;
let Score = 0;
let answeredGroups = [];
let timerElement = document.getElementById('timer');
let remainingTime;
let timerInterval;
let userData;


function updateTimer() {
    if (remainingTime > 0) {
        remainingTime--;
        timerElement.textContent = `Время: ${Math.floor(remainingTime / 60)}:${remainingTime % 60 < 10 ? '0' : ''}${remainingTime % 60}`;
    } else {
        clearInterval(timerInterval);
        endGame(true);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function endGame(isTimerEnded) {
    document.querySelectorAll('#question-image, .answers, .buttons').forEach(element => {
        element.style.display = 'none';
    });

    if (isTimerEnded) {
        document.querySelector('.question-info').textContent = 'Время закончилось! ';
    } else {
        document.querySelector('.question-info').textContent = '';
    }

    switch(difficulty) {
        case 'easy':{
            document.querySelector('.question-info').textContent += 'Вы ответили правильно на ' + Score / 10 + ' из 5 вопросов.';
            document.querySelector('#question-text').textContent = 'Вы набрали ' + Score + ' баллов - один правильный ответ на лёгком уровне даёт 10 баллов.';
            if (Score > 40) document.querySelector('#question-text').textContent += ' Так как вы набрали более 40 баллов, вам разблокирован средний уровень!';
            break;
        }
        case 'medium': {
            document.querySelector('.question-info').textContent += 'Вы ответили правильно на ' + Score / 15 + ' из 5 вопросов.';
            document.querySelector('#question-text').textContent = 'Вы набрали ' + Score + ' баллов - один правильный ответ на среднем уровне даёт 15 баллов.';
            if (Score > 60) document.querySelector('#question-text').textContent += ' Так как вы набрали более 60 баллов, вам разблокирован сложный уровень!';
            break;
        }
        case 'hard':{
            document.querySelector('.question-info').textContent += 'Вы ответили правильно на ' + Score / 20 + ' из 5 вопросов.';
            document.querySelector('#question-text').textContent = 'Вы набрали ' + Score + ' баллов - один правильный ответ на сложном уровне даёт 20 баллов.';
            break;
        }
    }

    if (Score > userData.maxScore) {
        userData.maxScore = Score;
        if (Score > 40 && username !== 'Аноним') {
            if (Score > 60) {
            userData.maxDifficulty = 'hard';
            } else {
            userData.maxDifficulty = 'medium';
            }
        }
        localStorage.setItem(username, JSON.stringify(userData));
    }

    setTimeout(() => { //Можно переработать
        window.location.href = `menu.html?username=${encodeURIComponent(username)}`;
    }, 8000);
}

function getAnimalName(imageName) {
    const animalName = imageName.replace(/\d+/g, '');
    switch (animalName) {
        case 'bear': return 'Медведь';
        case 'cat': return 'Кот';
        case 'wolf': return 'Волк';
        case 'cow': return 'Корова';
        case 'horse': return 'Лошадь';
        case 'pig': return 'Свинья';
        case 'ele': return 'Слон';
        case 'rhino': return 'Носорог';
        case 'croc': return 'Крокодил';
        case 'gorilla': return 'Горилла';
        case 'rac': return 'Енот';
        case 'duck': return 'Утка';
        case 'hen': return 'Курица';
        case 'kang': return 'Кенгуру';
        case 'trex': return 'Тираннозавр';
        case 'frog': return 'Лягушка';
        case 'lemur': return 'Лемур';
        case 'human': return 'Человек';
        case 'rabbit': return 'Кролик';
        default: return 'Ошибка: Неизвестное животное';
    }    
}

function generateQuestion() {
    maskIds.forEach(maskId => {
        document.getElementById(maskId).src = '';
    }); 

    const groupNumbers = Object.keys(options);
    let randomGroup = groupNumbers[Math.floor(Math.random() * groupNumbers.length)];
    while (answeredGroups.includes(randomGroup)){
        randomGroup = groupNumbers[Math.floor(Math.random() * groupNumbers.length)];
    }

    const randomQuestionImage = options[randomGroup][Math.floor(Math.random() * options[randomGroup].length)]; // Картинка-вопрос
    let answerImages = [];
    const answerImage = randomQuestionImage.endsWith("1.jpg") // Картинка-ответ
    ? randomQuestionImage.replace(/1\.jpg$/, '2.jpg')
    : randomQuestionImage.replace(/2\.jpg$/, '1.jpg');
    answerImages.push(answerImage);
    answeredGroups.push(randomGroup);

    const shuffledMasks = shuffleArray(masks);
    const shuffledMaskIds = shuffleArray(maskIds);

    switch(difficulty) {
        case 'easy':{ // 3 варианта ответа из разных других групп
            let remainingGroups = groupNumbers.filter(group => group !== randomGroup);
            while (answerImages.length < 4) {
                const randomOtherGroup = remainingGroups[Math.floor(Math.random() * remainingGroups.length)];
                const randomImage = options[randomOtherGroup][Math.floor(Math.random() * options[randomOtherGroup].length)];
                answerImages.push(randomImage);
                remainingGroups = remainingGroups.filter(group => group !== randomOtherGroup);
            }
            break;
        }
        case 'medium': { // 2 варианта из этой же группы, 2 маски
            while (answerImages.length < 3) {
                const randomImage = options[randomGroup][Math.floor(Math.random() * options[randomGroup].length)];
                if (!answerImages.includes(randomImage) && randomImage !== randomQuestionImage) {
                    answerImages.push(randomImage);
                }
            }
            let remainingGroups = groupNumbers.filter(group => group !== randomGroup);
            const randomOtherGroup = remainingGroups[Math.floor(Math.random() * remainingGroups.length)];
            const randomImage = options[randomOtherGroup][Math.floor(Math.random() * options[randomOtherGroup].length)];
            answerImages.push(randomImage);

            document.getElementById(shuffledMaskIds[0]).src = `masks/${shuffledMasks[0]}`;
            document.getElementById(shuffledMaskIds[1]).src = `masks/${shuffledMasks[1]}`;
            break;
        }
        case 'hard':{ // Максимально из этой же группы, 4 маски
            if (options[randomGroup].length > 4){
                while (answerImages.length < 4) {
                    const randomImage = options[randomGroup][Math.floor(Math.random() * options[randomGroup].length)];
                    if (!answerImages.includes(randomImage) && randomImage !== randomQuestionImage) {
                        answerImages.push(randomImage);
                    }
                }
            } else {
                while (answerImages.length < 3) {
                    const randomImage = options[randomGroup][Math.floor(Math.random() * options[randomGroup].length)];
                    if (!answerImages.includes(randomImage) && randomImage !== randomQuestionImage) {
                        answerImages.push(randomImage);
                    }
                }
                let remainingGroups = groupNumbers.filter(group => group !== randomGroup);
                const randomOtherGroup = remainingGroups[Math.floor(Math.random() * remainingGroups.length)];
                const randomImage = options[randomOtherGroup][Math.floor(Math.random() * options[randomOtherGroup].length)];
                answerImages.push(randomImage);
            }
            document.getElementById(shuffledMaskIds[0]).src = `masks/${shuffledMasks[0]}`;
            document.getElementById(shuffledMaskIds[1]).src = `masks/${shuffledMasks[1]}`;
            document.getElementById(shuffledMaskIds[2]).src = `masks/${shuffledMasks[2]}`;
            document.getElementById(shuffledMaskIds[3]).src = `masks/${shuffledMasks[3]}`;
            break;
        }
    }

    answerImages = shuffleArray(answerImages);
    document.getElementById('question-image').src = `footprints/${answerImage}`;
    rightAnswer = document.getElementById('question-image').src;
    document.getElementById('question-image').src = `footprints/${randomQuestionImage}`;
    document.getElementById('answer1img').src = `footprints/${answerImages[0]}`;
    document.getElementById('answer2img').src = `footprints/${answerImages[1]}`;
    document.getElementById('answer3img').src = `footprints/${answerImages[2]}`;
    document.getElementById('answer4img').src = `footprints/${answerImages[3]}`;

    const images = document.querySelectorAll('.answers img');
    images.forEach(img => {
        const randomAngle = Math.floor(Math.random() * 360);
        img.style.transform = `rotate(${randomAngle}deg)`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const finishButton = document.querySelector('.button.left');
    const nextButton = document.querySelector('.button.proceed');
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    const radioLabels = document.querySelectorAll('label[for]');
    const messageContainer = document.getElementById('message-container');
    nextButton.disabled = true;

    if (!username || !difficulty) {
        window.location.href = 'index.html';
        return null;
    }
    userData = JSON.parse(localStorage.getItem(username));
    if (!userData) {
        window.location.href = 'index.html';
        return null;
    }
    let currentQuestion = 1;
    let isAnswered = false;
    document.getElementById('current-question').textContent = currentQuestion;

    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            if (!isAnswered) {
                nextButton.disabled = false;
                nextButton.classList.add('enabled');
            }
        });
    });

    radioLabels.forEach(label => {      // Увеличиваем прозрачность маски при dblclick на вариант ответа
        label.addEventListener('dblclick', () => {
            const maskElement = document.getElementById(label.getAttribute('for') + 'mask');
            let currentOpacity = parseFloat(window.getComputedStyle(maskElement).opacity);
            const newOpacity = Math.max(currentOpacity - 0.015, 0);
            maskElement.style.opacity = newOpacity;
        });
    });

    nextButton.addEventListener('click', () => {
        let selectedRadio = Array.from(radioButtons).find(radio => radio.checked);
        selectedRadio.checked = false;
        const imgElement = document.querySelector(`label[for="${selectedRadio.id}"] img`);
        if (imgElement.src === rightAnswer) {
            switch(difficulty) {
                case 'easy':
                    Score += 10;
                    break;
                case 'medium':
                    Score += 15;
                    break;
                case 'hard':
                    Score += 20;
                    break;
            }
        }

        window.scrollTo(0, 0);
        messageContainer.textContent = 'Животное: ' + getAnimalName(rightAnswer.split('/').pop().split('.')[0]);
        messageContainer.style.display = 'block';
        nextButton.disabled = true;
        nextButton.classList.remove('enabled');
        isAnswered = true;
        currentQuestion++;
        setTimeout(() => {
            messageContainer.style.display = 'none';
            if (currentQuestion > 5) {
                endGame(false);
                return null;
            }
            radioLabels.forEach(label => {
                const maskElement = document.getElementById(label.getAttribute('for') + 'mask');
                maskElement.style.opacity = '1';
            });
            document.getElementById('current-question').textContent = currentQuestion;
            isAnswered = false;
            selectedRadio = Array.from(radioButtons).find(radio => radio.checked);
            if (selectedRadio) selectedRadio.checked = false;
            generateQuestion();
        }, 3000);
    });

    finishButton.addEventListener('click', () => {
        if (confirm("Весь прогресс будет утерян. Вы уверены, что хотите завершить игру?")) {
            window.location.href = `menu.html?username=${encodeURIComponent(username)}`;
            return null;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            finishButton.click();
        }
    });

    timerElement = document.getElementById('timer');
    switch(difficulty) {
        case 'easy':
            remainingTime = 300; // Время в секундах
            break;
        case 'medium':
            remainingTime = 120;
            break;
        case 'hard':
            remainingTime = 60;
            break;
    }
    remainingTime++;
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

    generateQuestion();
});
