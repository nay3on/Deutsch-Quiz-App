let userNickname = 'User';
let currentSettings = { nickname: 'User', volume: 1.0 };
let leaderboardData = {};
let currentTheme = 'fruit';

function loadLeaderboardData() {
    const storedData = localStorage.getItem('leaderboardData');
    if (storedData) {
        leaderboardData = JSON.parse(storedData);
    }
}

function saveLeaderboardData() {
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
}

function toggleMenu() {
    var menu = document.getElementById('menu');
    var menuButton = document.getElementById('menuButton');
    var menuButtonImage = menuButton.getElementsByTagName('img')[0];

    menu.classList.toggle('show');

    if (menu.classList.contains('show')) {
        menuButtonImage.src = 'source/menu-close-button.png';
    } else {
        menuButtonImage.src = 'source/menu-open-button.png';
    }
}

function toggleSubMenu(subMenuId) {
    var subMenu = document.getElementById(subMenuId);

    if (subMenu.style.display === 'flex') {
        subMenu.style.animation = 'slideUp 0.5s forwards';
        setTimeout(() => {
            subMenu.style.display = 'none';
        }, 300);
    } else {
        subMenu.style.animation = 'slideDown 0.5s forwards';
        subMenu.style.display = 'flex';
    }
}

function changeMenuItemText() {
    const menuItems = document.querySelectorAll('.main .menu .menu-item');

    menuItems.forEach(item => {
        const originalText = item.textContent.trim();
        let hoverText = '';

        switch (originalText) {
            case 'Thema 🗂️':
                hoverText = '주제 🗂️';
                break;
            case 'Rangliste 🏆':
                hoverText = '랭킹 🏆';
                break;
            case 'Einstellungen ⚙️':
                hoverText = '설정 ⚙️';
                break;
            case 'Über mich 👩🏻‍💻':
                hoverText = '소개 👩🏻‍💻';
                break;
            default:
                hoverText = originalText;
        }

        item.addEventListener('mouseover', () => {
            item.textContent = hoverText;
        });

        item.addEventListener('mouseout', () => {
            item.textContent = originalText;
        });
    });
}

function resetLeaderboardData() {
    leaderboardData = {};
    saveLeaderboardData();
    populateLeaderboard();
}

document.addEventListener('DOMContentLoaded', (event) => {
    var profileModal = document.getElementById('profileModal');
    var profileForm = document.getElementById('profileForm');
    var profileImagePlaceholder = document.getElementById('profileImagePlaceholder');
    var profileImageInput = document.getElementById('profileImageInput');
    var menuProfile = document.getElementById('menuProfile');
    var nicknameDisplay = document.getElementById('nicknameDisplay');
    var bubbleTop = document.getElementById('bubbleTop');
    var bubbleBottom = document.getElementById('bubbleBottom');
    var submitButton = document.getElementById('submitButton');
    var restartButton = document.getElementById('restartButton');
    var uploadedImage = '';
    var defaultNickname = 'User';
    var userNickname = defaultNickname;
    var menu4 = document.getElementById('menu4');
    var menu3 = document.getElementById('menu3');
    var settingsModal = document.getElementById('settingsModal');
    var rankingModal = document.getElementById('rankingModal');
    var menu2 = document.getElementById('menu2');
    var initialSettings = { nickname: defaultNickname, volume: 1.0 };
    var currentSettings = { ...initialSettings };
    var resetButton = document.getElementById('resetLeaderboardButton');

    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('정말로 기록을 초기화하시겠습니까?')) {
                resetLeaderboardData();
            }
        });
    }

    loadLeaderboardData();

    if (menu2) {
        menu2.addEventListener('click', function(event) {
            event.preventDefault();
            openrankingModal();
        });
    }

    if (menu3) {
        menu3.addEventListener('click', function(event) {
            event.preventDefault();
            openSettingsModal();
        });
    }

    if (menu4) {
        menu4.addEventListener('click', function(event) {
            event.preventDefault();
            openAboutModal();
        });
    }

    document.getElementById('sub-menu-theme-fruit').addEventListener('click', function() {
        currentTheme = 'fruit';
        restartGame();
        closeMenuIfOpen();
    });

    document.getElementById('sub-menu-theme-vegetable').addEventListener('click', function() {
        currentTheme = 'vegetable';
        restartGame();
        closeMenuIfOpen();
    });

    profileModal.style.display = "block";
    document.body.classList.add('modal-open');

    profileImagePlaceholder.addEventListener('click', function() {
        profileImageInput.click();
    });

    profileImageInput.addEventListener('change', function() {
        var file = profileImageInput.files[0];
        var reader = new FileReader();

        reader.onloadend = function() {
            uploadedImage = reader.result;
            profileImagePlaceholder.querySelector('img').src = uploadedImage;
        }

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var nicknameInput = document.getElementById('nicknameInput');
        var nickname = nicknameInput.value || defaultNickname;
        nicknameDisplay.textContent = nickname;
        userNickname = nickname;
        bubbleTop.innerHTML = `Willkommen, ${nickname}!&nbsp; Wählen Sie die richtige Antwort📝`;

        if (uploadedImage) {
            menuProfile.querySelector('img').src = uploadedImage;
        }

        closeModalAndFlipCards();
    });

    document.querySelectorAll('.close').forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeModalAndFlipCards();
        });
    });

    assignRandomWordsAndImages();

    var choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleChoiceSelection(button);
            closeMenuIfOpen();
        });
    });

    submitButton.addEventListener('click', function() {
        var correctAnswersCount = checkAnswers();
        hideSubmitButton();
        disableChoiceButtons();
        displayResults(correctAnswersCount);
        closeMenuIfOpen();
    });

    restartButton.addEventListener('click', function() {
        restartGame();
        closeMenuIfOpen();
    });

    changeMenuItemText();
});

function closeModal() {
    var profileModal = document.getElementById('profileModal');
    profileModal.style.display = "none";
    document.body.classList.remove('modal-open');
    var nicknameDisplay = document.getElementById('nicknameDisplay');
    nicknameDisplay.textContent = 'User';
    playBackgroundMusic();
    showSpeechBubbles('Willkommen, User!&nbsp; Wählen Sie die richtige Antwort📝', '알맞은 단어를 고르세요');
}

function flipCard(card) {
    if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        card.removeAttribute('onclick');
    }
}

function closeModalAndFlipCards() {
    var profileModal = document.getElementById('profileModal');
    profileModal.style.display = "none";
    document.body.classList.remove('modal-open');
    var cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
        setTimeout(() => {
            flipCard(card);
        }, index * 500);
    });
    playBackgroundMusic();
    showSpeechBubbles('Willkommen, ' + userNickname + '!&nbsp; Wählen Sie die richtige Antwort📝', '알맞은 단어를 고르세요');
}

function playBackgroundMusic() {
    var backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.play();
}

function showSpeechBubbles(topText, bottomText) {
    var bubbleTop = document.getElementById('bubbleTop');
    var bubbleBottom = document.getElementById('bubbleBottom');
    bubbleTop.innerHTML = topText;
    bubbleBottom.innerHTML = bottomText;

    bubbleTop.style.display = 'flex';

    setTimeout(() => {
        bubbleTop.style.opacity = 1;
    }, 10);

    setTimeout(() => {
        bubbleBottom.style.display = 'flex';
        setTimeout(() => {
            bubbleBottom.style.opacity = 1;
        }, 10);
    }, 1000);
}

const wordMaps = {
    fruit: {
        "딸기": ["딸기.png", "Erdbeere"],
        "바나나": ["바나나.png", "Banane"],
        "수박": ["수박.png", "Wassermelone"],
        "사과": ["사과.png", "Apfel"],
        "포도": ["포도.png", "Traube"],
        "체리": ["체리.png", "Kirsche"],
        "라즈베리": ["라즈베리.png", "Himbeere"],
        "파인애플": ["파인애플.png", "Ananas"],
        "블루베리": ["블루베리.png", "Blaubeere"],
        "감": ["감.png", "Kaki"]
    },
    vegetable: {
        "호박": ["호박.png", "Kürbis"],
        "토마토": ["토마토.png", "Tomate"],
        "파프리카": ["파프리카.png", "Paprika"],
        "당근": ["당근.png", "Möhre"],
        "브로콜리": ["브로콜리.png", "Brokkoli"],
        "가지": ["가지.png", "Aubergine"],
        "양파": ["양파.png", "Zwiebel"],
        "마늘": ["마늘.png", "Knoblauch"],
        "양상추": ["양상추.png", "Kopfsalat"],
        "오이": ["오이.png", "Gurke"]
    }
};

function assignRandomWordsAndImages() {
    var wordMap = wordMaps[currentTheme];
    var words = Object.keys(wordMap);
    var shuffledWords = words.sort(() => 0.5 - Math.random()).slice(0, 5);

    var cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
        var word = shuffledWords[index];
        var imageBox = card.querySelector('.image-box');
        var textBox = card.querySelector('.text-box');
        var buttons = card.querySelectorAll('.choice-word');

        textBox.textContent = word;

        var img = document.createElement('img');
        img.src = `source/${wordMap[word][0]}`;
        img.alt = word;
        img.classList.add('image-box-img');
        imageBox.appendChild(img);

        var correctChoice = wordMap[word][1];
        var otherChoices = Object.values(wordMap).map(item => item[1]).filter(choice => choice !== correctChoice);
        var randomChoices = otherChoices.sort(() => 0.5 - Math.random()).slice(0, 3);
        var allChoices = [...randomChoices, correctChoice].sort(() => 0.5 - Math.random());

        buttons.forEach((button, idx) => {
            button.textContent = allChoices[idx];
        });
    });
}

function handleChoiceSelection(button) {
    var card = button.closest('.card');
    var choiceButtons = card.querySelectorAll('.choice-button');

    choiceButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.style.backgroundColor = '#f0f0f0';
    });

    button.classList.add('selected');
    button.style.backgroundColor = '#e0e0e0';

    checkAllCardsSelected();
}

function checkAllCardsSelected() {
    var cards = document.querySelectorAll('.card');
    var allSelected = true;

    cards.forEach(card => {
        if (!card.querySelector('.choice-button.selected')) {
            allSelected = false;
        }
    });

    var submitButton = document.getElementById('submitButton');
    if (allSelected) {
        submitButton.style.display = 'flex';
        setTimeout(() => {
            submitButton.style.opacity = 1;
        }, 10);
    } else {
        submitButton.style.opacity = 0;
        setTimeout(() => {
            submitButton.style.display = 'none';
        }, 500);
    }
}

function checkAnswers() {
    var wordMap = wordMaps[currentTheme];

    var cards = document.querySelectorAll('.card');
    var allCorrect = true;
    var correctAnswersCount = 0;

    cards.forEach(card => {
        var word = card.querySelector('.text-box').textContent;
        var correctChoice = wordMap[word][1];
        var selectedButton = card.querySelector('.choice-button.selected .choice-word');
        
        if (selectedButton) {
            var selectedText = selectedButton.textContent;

            var choiceButtons = card.querySelectorAll('.choice-button');
            choiceButtons.forEach(button => {
                var choiceText = button.querySelector('.choice-word').textContent;
                var choiceNum = button.querySelector('.choice-num');
                
                if (choiceText === selectedText) {
                    if (selectedText === correctChoice) {
                        button.style.backgroundColor = 'rgba(88, 165, 113, 0.9)';
                        choiceNum.style.color = 'white';
                        button.querySelector('.choice-word').style.color = 'white';
                        button.querySelector('.choice-word').style.textShadow = '-1px 0px #58A571, 0px 1px #58A571, 1px 0px #58A571, 0px -1px #58A571';
                        choiceNum.style.borderColor = 'white';
                        correctAnswersCount++;
                    } else {
                        button.style.backgroundColor = 'rgba(208, 72, 72, 0.6)';
                        allCorrect = false;
                    }
                } else if (choiceText === correctChoice) {
                    button.style.backgroundColor = 'rgba(88, 165, 113, 0.9)';
                    choiceNum.style.color = 'white';
                    button.querySelector('.choice-word').style.color = 'white';
                    button.querySelector('.choice-word').style.textShadow = '-1px 0px #58A571, 0px 1px #58A571, 1px 0px #58A571, 0px -1px #58A571';
                    choiceNum.style.borderColor = 'white';
                }
            });
        } else {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        triggerConfetti();
    }

    updateLeaderboard(document.getElementById('nicknameDisplay').textContent, correctAnswersCount);

    showRestartButton();
    return correctAnswersCount;
}

function showRestartButton() {
    var restartButton = document.getElementById('restartButton');
    restartButton.style.display = 'flex';
    setTimeout(() => {
        restartButton.style.opacity = 1;
    }, 10);
}

function triggerConfetti() {
    var duration = 800;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function hideSubmitButton() {
    var submitButton = document.getElementById('submitButton');
    submitButton.style.opacity = 0;
    setTimeout(() => {
        submitButton.style.display = 'none';
    }, 500);
}

function disableChoiceButtons() {
    var choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach(button => {
        button.style.pointerEvents = 'none';
    });
}

function enableChoiceButtons() {
    var choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach(button => {
        button.style.pointerEvents = 'auto';
    });
}

function restartGame() {
    var restartButton = document.getElementById('restartButton');
    restartButton.style.opacity = 0;
    setTimeout(() => {
        restartButton.style.display = 'none';
    }, 500);

    var cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped');
        card.querySelector('.image-box').innerHTML = '';
        card.querySelector('.text-box').textContent = '';
        var choiceButtons = card.querySelectorAll('.choice-button');
        choiceButtons.forEach(button => {
            button.classList.remove('selected');
            button.style.backgroundColor = '#f0f0f0';
            var choiceNum = button.querySelector('.choice-num');
            choiceNum.style.color = '#3D3A33';
            choiceNum.style.border = '1px solid #3D3A33';
            var choiceWord = button.querySelector('.choice-word');
            choiceWord.style.color = 'black';
            choiceWord.style.textShadow = 'none';
        });
    });

    enableChoiceButtons();
    var choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!button.classList.contains('selected')) {
                button.style.backgroundColor = '#e0e0e0';
            }
        });
        button.addEventListener('mouseleave', function() {
            if (!button.classList.contains('selected')) {
                button.style.backgroundColor = '#f0f0f0';
            }
        });
        button.addEventListener('click', function() {
            handleChoiceSelection(button);
        });
    });

    setTimeout(() => {
        assignRandomWordsAndImages();
        cards.forEach((card, index) => {
            setTimeout(() => {
                flipCard(card);
            }, index * 500);
        });
    }, 500);

    showSpeechBubbles('Weiter so! Wählen Sie die richtige Antwort📝', '알맞은 단어를 고르세요');
}

function displayResults(correctAnswersCount) {
    var bubbleTop = document.getElementById('bubbleTop');
    var bubbleBottom = document.getElementById('bubbleBottom');
    var nickname = document.getElementById('nicknameDisplay').textContent || 'User';
    
    bubbleTop.innerHTML = `Gut gemacht, ${nickname}!`;
    bubbleBottom.innerHTML = `Das ist dein Ergebnis: ${correctAnswersCount}/5`;
}

function openAboutModal() {
    var aboutModal = document.getElementById('aboutModal');
    aboutModal.style.display = "block";
    document.body.classList.add('modal-open');
}

function closeAboutModal() {
    var aboutModal = document.getElementById('aboutModal');
    aboutModal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

function closeMenuIfOpen() {
    var menu = document.getElementById('menu');
    var menuButtonImage = document.getElementById('menuButton').getElementsByTagName('img')[0];

    if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        menuButtonImage.src = 'source/menu-open-button.png';
    }
}

function openSettingsModal() {
    var settingsModal = document.getElementById('settingsModal');
    var nicknameInput = document.getElementById('settingsNicknameInput');
    var volumeControl = document.getElementById('volumeControl');

    nicknameInput.value = userNickname;
    volumeControl.value = currentSettings.volume;

    settingsModal.style.display = 'block';
    document.body.classList.add('modal-open');
}

function closeSettingsModal() {
    var settingsModal = document.getElementById('settingsModal');
    settingsModal.style.display = 'none';
    document.body.classList.remove('modal-open');

    var nicknameInput = document.getElementById('settingsNicknameInput');
    var volumeControl = document.getElementById('volumeControl');

    nicknameInput.value = userNickname;
    volumeControl.value = currentSettings.volume;
}

function saveSettings() {
    var nicknameInput = document.getElementById('settingsNicknameInput').value;
    var volumeControl = document.getElementById('volumeControl').value;

    currentSettings.nickname = nicknameInput;
    currentSettings.volume = volumeControl;

    document.getElementById('nicknameDisplay').textContent = nicknameInput;
    var backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.volume = volumeControl;

    userNickname = nicknameInput;

    closeSettingsModal();
}

function openrankingModal() {
    var rankingModal = document.getElementById('rankingModal');
    var leaderboard = document.getElementById('leaderboard');

    populateLeaderboard();

    rankingModal.style.display = 'block';
    document.body.classList.add('modal-open');
}

function closerankingModal() {
    var rankingModal = document.getElementById('rankingModal');
    rankingModal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

function populateLeaderboard() {
    var leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '';

    var sortedLeaderboard = Object.entries(leaderboardData).sort((a, b) => b[1] - a[1]);

    sortedLeaderboard.forEach(([nickname, score], index) => {
        var listItem = document.createElement('div');
        listItem.className = 'leaderboard-item';

        let medal = '';
        if (index === 0) medal = '🥇';
        else if (index === 1) medal = '🥈';
        else if (index === 2) medal = '🥉';

        listItem.textContent = `[${index + 1}] ${nickname} ${medal}: ${score} points`;
        leaderboard.appendChild(listItem);
    });
}

function updateLeaderboard(nickname, correctAnswersCount) {
    if (leaderboardData[nickname]) {
        leaderboardData[nickname] += correctAnswersCount;
    } else {
        leaderboardData[nickname] = correctAnswersCount;
    }
    saveLeaderboardData();
}