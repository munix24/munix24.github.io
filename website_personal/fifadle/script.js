let countries = [];

const clueTypes = [
    { key: 'continent', label: 'Continent', icon: '🌍' },
    { key: 'colors', label: 'Colors', icon: '🎨' },
    { key: 'capital', label: 'Capital', icon: '🏛️' },
    { key: 'star', label: 'Star', icon: '⭐' },
    { key: 'fifaRank', label: 'Rank', icon: '📈' },
    { key: 'nickname', label: 'Nickname', icon: '🗣️' },
    { key: 'history', label: 'WC History', icon: '🏆' },
    { key: 'fact', label: 'Fact', icon: '💡' },
    { key: 'flag', label: 'Flag', icon: '🏁' }
];

let currentCountry;
let currentClue = 0;
const maxClues = 6;
let lastResultEmoji = "";
let clueResults = [];
let clueOrder = [];
// State to track collapsed continents in the side panel
let collapsedContinents = new Set();
// Try to load from the new key, fallback to the old key for migration, default to empty array
let correctCountries = JSON.parse(localStorage.getItem('fifadle_correct_list')) || [];
let totalClues = JSON.parse(localStorage.getItem('fifadle_total_clues')) || 0;
let bestAverage = parseFloat(localStorage.getItem('fifadle_best_average')) || 0;
let winCount = parseInt(localStorage.getItem('fifadle_win_count')) || 0;
let bestAccuracy = parseFloat(localStorage.getItem('fifadle_best_accuracy')) || 0;
let isRoundOver = false;
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const clueContainer = document.getElementById('clue-container');
const clueText = document.getElementById('clue-text');
const scoreText = document.getElementById('score-text');
const scoreIndicator = document.querySelector('.score-indicator');
const winCountText = document.getElementById('win-count-text');
const accuracyText = document.getElementById('accuracy-text');
const avgText = document.getElementById('avg-text');
const bestAvgText = document.getElementById('best-avg-text');
const bestAccuracyText = document.getElementById('best-accuracy-text');
const totalCluesText = document.getElementById('total-clues-text');
const guessInput = document.getElementById('guess-input');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const shareBtn = document.getElementById('share-btn');
const skipBtn = document.getElementById('skip-btn');
const newGameBtn = document.getElementById('new-game-btn');
const datalist = document.getElementById('countries-list');
const sidePanel = document.getElementById('side-panel');
const closePanelBtn = document.getElementById('close-panel');
function initGame() {
    let savedCurrentCountryName = localStorage.getItem('fifadle_saved_current_country_name');
    let savedCurrentClueIndex = localStorage.getItem('fifadle_saved_current_clue_index');
    let savedClueResults = localStorage.getItem('fifadle_clue_results');
    let savedClueOrder = localStorage.getItem('fifadle_clue_order');

    if (savedCurrentCountryName && savedCurrentClueIndex !== null && savedClueOrder) {
        currentCountry = countries.find(c => c.name === savedCurrentCountryName);
        currentClue = parseInt(savedCurrentClueIndex);
        clueResults = savedClueResults ? JSON.parse(savedClueResults) : new Array(maxClues).fill(null);
        clueOrder = JSON.parse(savedClueOrder);
        totalClues = JSON.parse(localStorage.getItem('fifadle_total_clues')) || 0;
    } else {
        currentClue = 0;
        clueResults = new Array(maxClues).fill(null);
        clueResults[0] = 'initial';
        clueOrder = getShuffledClueOrder();
        const availableCountries = countries.filter(c => !correctCountries.includes(c.name));
        currentCountry = availableCountries.length > 0 
            ? availableCountries[Math.floor(Math.random() * availableCountries.length)]
            : countries[Math.floor(Math.random() * countries.length)];
        collapsedContinents.clear();
    }

    // Always save the current state after initGame (whether loaded or new)
    localStorage.setItem('fifadle_saved_current_country_name', currentCountry.name);
    localStorage.setItem('fifadle_saved_current_clue_index', currentClue.toString());
    localStorage.setItem('fifadle_clue_results', JSON.stringify(clueResults));
    localStorage.setItem('fifadle_clue_order', JSON.stringify(clueOrder));

    // Auto-collapse completed continents on load
    const continents = [...new Set(countries.map(c => c.continent))];
    continents.forEach(cont => {
        const allGuessed = countries.filter(c => c.continent === cont).every(c => correctCountries.includes(c.name));
        if (allGuessed) collapsedContinents.add(cont);
    });
    
    messageDiv.className = 'pulsing';
    messageDiv.innerText = '???';
    guessInput.value = '';
    isRoundOver = false;
    guessInput.readOnly = isMobile; // Disable typing on mobile to encourage using the datalist
    guessInput.disabled = false;
    guessInput.style.display = 'inline-block';
    submitBtn.style.display = isMobile ? 'none' : 'inline-block';
    skipBtn.style.display = 'inline-block';
    playAgainBtn.style.display = 'none';
    if (newGameBtn) newGameBtn.style.display = 'none';

    const isComplete = correctCountries.length >= countries.length;
    if (isComplete) {
        triggerCompletionAnimation();
    } else {
        scoreIndicator.classList.remove('complete');

        // only proceed with clue rendering if game is not already complete, otherwise just show the completion state
        renderClues();
    }
    
    updateCluesUI();
    updateScoreUI();               
    updateSidePanelList();
}

function getShuffledClueOrder() {
    const order = Array.from({length: clueTypes.length}, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order.slice(0, maxClues);
}

function renderClues() {
    clueContainer.innerHTML = '';
    for (let i = 0; i < maxClues; i++) {
        const div = document.createElement('div');
        // add base class
        div.className = `clue-item `;
        // add revealed class if clue is revealed
        div.className += `${i <= currentClue ? 'revealed' : ''} `;

        // status should be already set to 'correct' / 'incorrect' / 'skipped' 
        const status = clueResults[i];
        // default to initial - no class if not revealed or game is over
        const statusClass = status || (i <= currentClue ? (isRoundOver ? '' : 'initial') : '');  
        div.className += `${statusClass}`;
        
        const clue = clueTypes[clueOrder[i]];

        const icon = i <= currentClue ? clue.icon : '🔒';
        const iconHtml = icon ? `<span class="clue-icon">${icon}</span>` : '';
        
        let content;
        let label;
        if (i <= currentClue) {
            label = clue.label ? `${clue.label}: ` : '';
            content = `${currentCountry[clue.key]}`;
        } else {
            label = `Clue ${i + 1}: `;
            content = `Locked`;
        }
            
        div.innerHTML = `${iconHtml}<div><strong>${label}</strong>${content}</div>`;
        clueContainer.appendChild(div);
    }
}

function updateCluesUI() {
    clueText.innerText = `Clue ${currentClue + 1} / ${maxClues}`;
    if (totalCluesText) {
        totalCluesText.innerText = `Clues Used: ${totalClues}`;
    }
}

function updateScoreUI() {
    scoreText.innerText = `Country: ${correctCountries.length} / ${countries.length}`;
    
    if (winCountText) winCountText.innerText = `Wins: ${winCount}`;

    if (accuracyText) {
        const played = correctCountries.length;
        const accuracy = played > 0 ? (winCount / played) * 100 : 0;
        accuracyText.innerText = `Accuracy: ${accuracy.toFixed(1)}%`;

        // Accuracy color coding
        accuracyText.classList.remove('acc-elite', 'acc-great', 'acc-good', 'acc-average', 'acc-poor', 'acc-bad');
        if (played > 0) {
            if (accuracy >= 100) accuracyText.classList.add('acc-elite');
            else if (accuracy >= 90) accuracyText.classList.add('acc-great');
            else if (accuracy >= 80) accuracyText.classList.add('acc-good');
            else if (accuracy >= 70) accuracyText.classList.add('acc-average');
            else if (accuracy >= 60) accuracyText.classList.add('acc-poor');
            else accuracyText.classList.add('acc-bad');
        }
    }

    if (avgText) {
        const avgNum = correctCountries.length > 0 ? (totalClues / correctCountries.length) : totalClues;
        avgText.innerText = `Avg Clues: ${avgNum > 0 ? avgNum.toFixed(1) : "0.0"}`;

        // Dynamic color for Avg Rounds based on performance
        avgText.classList.remove('avg-elite', 'avg-great', 'avg-good', 'avg-average', 'avg-poor', 'avg-bad', 'avg-terrible');
        if (avgNum > 0) {
            if (avgNum <= 1.0) avgText.classList.add('avg-elite');
            else if (avgNum <= 2.0) avgText.classList.add('avg-great');
            else if (avgNum <= 3.0) avgText.classList.add('avg-good');
            else if (avgNum <= 4.0) avgText.classList.add('avg-average');
            else if (avgNum <= 5.0) avgText.classList.add('avg-poor');
            else if (avgNum < 6.0) avgText.classList.add('avg-bad');
            else avgText.classList.add('avg-terrible');
        }
    }
    if (bestAvgText) {
        bestAvgText.innerText = `Best Avg: ${bestAverage > 0 ? bestAverage.toFixed(1) : "-"}`;
    }
    if (bestAccuracyText) {
        bestAccuracyText.innerText = `Best Acc: ${bestAccuracy > 0 ? bestAccuracy.toFixed(1) + "%" : "-"}`;
    }
}

function updateSidePanelList(filterText = '') {
    const sideList = document.getElementById('side-country-list');
    if (!sideList) return;

    // Update the header count to show countries remaining
    const headerH3 = document.querySelector('.side-panel-header h3');
    if (headerH3) {
        headerH3.innerText = `${countries.length - correctCountries.length} / ${countries.length}`;
    }

    sideList.innerHTML = '';
    
    const lowerFilter = filterText.toLowerCase();
    
    // Determine if the 'continent' clue has been revealed in the current round
    const continentClueIdx = clueTypes.findIndex(ct => ct.key === 'continent');
    const isContinentRevealed = currentCountry && clueOrder.slice(0, currentClue + 1).includes(continentClueIdx);

    let filtered = [...countries].filter(c => c.name.toLowerCase().includes(lowerFilter) || c.continent.toLowerCase().includes(lowerFilter));

    // Filter to target continent if the clue is revealed
    if (isContinentRevealed) {
        filtered = filtered.filter(c => c.continent === currentCountry.continent);
    }

    // Group countries by continent
    const grouped = filtered.reduce((acc, c) => {
        if (!acc[c.continent]) acc[c.continent] = [];
        acc[c.continent].push(c);
        return acc;
    }, {});

    // Display grouped countries
    Object.keys(grouped).sort().forEach(continent => {
        // Auto-collapse if manually toggled, but force expand if user is searching
        const isCollapsed = collapsedContinents.has(continent) && !lowerFilter;
        
        const header = document.createElement('div');
        header.className = 'side-continent-header';
        if (isCollapsed) header.classList.add('collapsed');
        header.innerText = continent;
        sideList.appendChild(header);

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'side-continent-items';
        if (isCollapsed) itemsContainer.classList.add('collapsed');
        sideList.appendChild(itemsContainer);

        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const isCollapsed = itemsContainer.classList.toggle('collapsed');
            header.classList.toggle('collapsed');
            if (isCollapsed) {
                collapsedContinents.add(continent);
            } else {
                collapsedContinents.delete(continent);
            }
        });

        grouped[continent].sort((a,b) => a.name.localeCompare(b.name)).forEach(c => {
            const isGuessed = correctCountries.includes(c.name);
            const div = document.createElement('div');
            div.className = `side-item ${isGuessed ? 'guessed' : 'pending'}`;
            div.innerHTML = `<span>${c.name}</span><span>${isGuessed ? '✔️' : ''}</span>`;
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isRoundOver || isGuessed) return;
                guessInput.value = c.name;
                makeGuess();
            });
            itemsContainer.appendChild(div);
        });
    });
}

function makeGuess() {
    const userGuess = guessInput.value.trim().toLowerCase();
    const correctAnswer = currentCountry.name.toLowerCase();

    if (!userGuess) return;

    if (userGuess === correctAnswer) {
        clueResults[currentClue] = 'correct';
        sidePanel.classList.remove('open');
        endGame(true);
    } else {
        clueResults[currentClue] = 'incorrect';
        playEffect(sounds.incorrect, 0.5);

        // Trigger shake animation
        guessInput.classList.add('shake');
        guessInput.addEventListener('animationend', () => {
            guessInput.classList.remove('shake');
        }, { once: true });

        if (currentClue < maxClues - 1) {
            currentClue++;
            playEffect(sounds.reveal);
            clueResults[currentClue] = 'initial';
            localStorage.setItem('fifadle_saved_current_clue_index', currentClue.toString());
            localStorage.setItem('fifadle_clue_results', JSON.stringify(clueResults));
            renderClues();
            updateCluesUI();
            updateSidePanelList();
            guessInput.value = '';
        } else {
            endGame(false);
        }
    }
}

function skipClue() {
    clueResults[currentClue] = 'skipped';
    if (currentClue < maxClues - 1) {
        currentClue++;
        playEffect(sounds.reveal);
        clueResults[currentClue] = 'initial';
        localStorage.setItem('fifadle_saved_current_clue_index', currentClue.toString());
        localStorage.setItem('fifadle_clue_results', JSON.stringify(clueResults));
        renderClues();
        updateCluesUI();
        updateSidePanelList();
        guessInput.value = '';
    } else {
        endGame(false);
    }
}

function endGame(isWin) {
    isRoundOver = true;
    // Add clues revealed this round to the total tournament count
    totalClues += (currentClue + 1);    // add 1 since currentClue is 0-indexed
    localStorage.setItem('fifadle_total_clues', totalClues);

    guessInput.disabled = true;
    guessInput.style.display = 'none';
    submitBtn.style.display = 'none';
    skipBtn.style.display = 'none';
    playAgainBtn.style.display = 'block';
    if (newGameBtn) newGameBtn.style.display = 'none';
    // currentClue = maxClues - 1;
    renderClues();
    updateCluesUI();
    localStorage.removeItem('fifadle_saved_current_country_name');
    localStorage.removeItem('fifadle_saved_current_clue_index');
    localStorage.removeItem('fifadle_clue_results');
    localStorage.removeItem('fifadle_clue_order');

    if (isWin) {
        playEffect(sounds.correct);
        winCount++;
        localStorage.setItem('fifadle_win_count', winCount);
        
        // Trigger celebratory confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#004b87', '#c6a15b', '#008f4c', '#ffffff']
        });
    }

    // Update correct countries list and localStorage even if didnt win
    if (!correctCountries.includes(currentCountry.name)) {
        correctCountries.push(currentCountry.name);
        localStorage.setItem('fifadle_correct_list', JSON.stringify(correctCountries));

        updateScoreUI();
        updateSidePanelList();
    }

    // Check for total tournament completion (48/48)
    if (correctCountries.length >= countries.length) {
        triggerCompletionAnimation();
    }

    const winClue = currentClue;
    lastResultEmoji = generateShareEmoji(isWin, winClue);
    messageDiv.innerHTML = `${currentCountry.name} <span style="font-size: 2.2rem; margin-left: 10px;">${currentCountry.flag}</span>`;
    messageDiv.className = isWin ? 'success' : 'error';
}

function triggerCompletionAnimation() {
    isRoundOver = true;
    // Set best average upon completion
    const currentAvg = totalClues / countries.length;
    if (bestAverage === 0 || currentAvg < bestAverage) {
        bestAverage = currentAvg;
        localStorage.setItem('fifadle_best_average', bestAverage);
        updateScoreUI();
    }

    const currentAcc = (winCount / countries.length) * 100;
    if (bestAccuracy === 0 || currentAcc > bestAccuracy) {
        bestAccuracy = currentAcc;
        localStorage.setItem('fifadle_best_accuracy', bestAccuracy);
        updateScoreUI();
    }
        
    // Show "New Game" button instead of "Next Country" on tournament completion
    guessInput.disabled = true;
    guessInput.style.display = 'none';
    submitBtn.style.display = 'none';
    skipBtn.style.display = 'none';
    if (playAgainBtn) playAgainBtn.style.display = 'none';
    if (newGameBtn) newGameBtn.style.display = 'block';

    const isComplete = correctCountries.length >= countries.length;
    if (isComplete) scoreIndicator.classList.add('complete');
    else scoreIndicator.classList.remove('complete');

    // Play the special victory sound
    playEffect(sounds.victory);

    const end = Date.now() + (5 * 1000); // 5 second celebration
    const colors = ['#004b87', '#c6a15b', '#008f4c', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: colors
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function generateShareEmoji(isWin, winClue) {
    let emojiRow = "";
    for (let i = 0; i < maxClues; i++) {
        if (isWin && i === winClue) emojiRow += "🟩";
        else if (i <= winClue) emojiRow += "🟥";
        else emojiRow += "⬜";
    }
    
    return `Fifadle 2026 🏆\n${isWin ? (winClue + 1) : 'X'}/${maxClues}\n${emojiRow}\nhttps://your-website.com`;
}

function shareResults() {
    navigator.clipboard.writeText(lastResultEmoji);
}

function resetGame(resetProgress = false, confirmation = true) {
    if (!confirmation || confirm("Are you sure you want to reset current game progress? This cannot be undone.")) {
        localStorage.removeItem('fifadle_correct_list');
        localStorage.removeItem('fifadle_total_clues');
        localStorage.removeItem('fifadle_saved_current_country_name');
        localStorage.removeItem('fifadle_saved_current_clue_index');
        localStorage.removeItem('fifadle_clue_results');
        localStorage.removeItem('fifadle_clue_order');
        localStorage.removeItem('fifadle_win_count');
        if (resetProgress) {
            localStorage.removeItem('fifadle_best_average');
            localStorage.removeItem('fifadle_best_accuracy');
            bestAverage = 0;
            bestAccuracy = 0;
        }
        correctCountries = [];
        winCount = 0;
        totalClues = 0;
        collapsedContinents.clear();
        updateScoreUI();
        updateSidePanelList();
        initGame();
        settingsToggle.classList.remove('active');
        settingsPanel.classList.remove('visible');
    }
}

function testCompletion() {
    if (confirm("Debug: Set progress to 47/48 countries?")) {
        // Fill progress with the first 47 countries in the list
        correctCountries = countries.slice(0, 47).map(c => c.name);
        localStorage.setItem('fifadle_correct_list', JSON.stringify(correctCountries));

        // Mock some wins (e.g., 40 wins out of 47)
        winCount = 40;
        localStorage.setItem('fifadle_win_count', winCount);
        
        // Set total clues so the average looks realistic (e.g., 6 clues per country)
        totalClues = 47 * 6;
        localStorage.setItem('fifadle_total_clues', totalClues);

        // Auto-collapse completed continents
        const continents = [...new Set(countries.map(c => c.continent))];
        continents.forEach(cont => {
            const allGuessed = countries.filter(c => c.continent === cont).every(c => correctCountries.includes(c.name));
            if (allGuessed) collapsedContinents.add(cont);
        });

        // Clear current session to force the game to pick the 48th country
        localStorage.removeItem('fifadle_saved_current_country_name');
        localStorage.removeItem('fifadle_saved_current_clue_index');
        localStorage.removeItem('fifadle_clue_results');
        localStorage.removeItem('fifadle_clue_order');

        updateScoreUI();
        initGame();
        
        settingsToggle.classList.remove('active');
        settingsPanel.classList.remove('visible');
    }
}

// Add Spacebar shortcut to skip clue, start next country, or start new game
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement !== guessInput) {
        // Prevent the default behavior of scrolling the page
        e.preventDefault();
        
        // Priority 1: Next Country
        if (playAgainBtn && playAgainBtn.style.display !== 'none') {
            initGame();
        } 
        // Priority 2: New Game (at 48/48)
        else if (newGameBtn && newGameBtn.style.display !== 'none') {
            resetGame(false, false);
        }
        // Priority 3: Skip Clue (active gameplay)
        else if (skipBtn && skipBtn.style.display !== 'none') {
            skipClue();
        }
    }
});

guessInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') makeGuess(); });

// Open side panel when input is focused
messageDiv.addEventListener('click', () => { sidePanel.classList.add('open'); });
guessInput.addEventListener('focus', () => { sidePanel.classList.add('open'); });

// Automatically submit when a country is selected from the datalist
guessInput.addEventListener('input', (e) => {
    const val = e.target.value;
    updateSidePanelList(val);

    if (countries.some(c => c.name === val)) {
        makeGuess();
    }
});

// AUDIO
function getSafeVolume(key, defaultValue) {
    const saved = localStorage.getItem(key);
    if (saved === null) return defaultValue;
    const parsed = parseFloat(saved);
    // Ensure it's a finite number and clamped within the valid range [0, 1]
    return isFinite(parsed) ? Math.max(0, Math.min(1, parsed)) : defaultValue;
}

let sfxVolume = getSafeVolume('fifadle_sfx_volume', 0.1);
let musicVolume = getSafeVolume('fifadle_music_volume', 0.1);
// if volume was set 0 on prior go, set a default to .1
let preMuteSfx = sfxVolume > 0 ? sfxVolume : 0.1;           
let preMuteMusic = musicVolume > 0 ? musicVolume : 0.1;

// Background music initialization
const bgMusic = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
bgMusic.loop = true;

// Restore music position from localStorage
const savedPosition = localStorage.getItem('fifadle_music_position');
if (savedPosition) {
    bgMusic.currentTime = parseFloat(savedPosition);
}

// Save music position whenever the time updates
bgMusic.addEventListener('timeupdate', () => {
    localStorage.setItem('fifadle_music_position', bgMusic.currentTime);
});

// Sound effects initialization
const sounds = {
    // External royalty-free sound effect URLs
    correct: new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'),
    incorrect: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    reveal: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    victory: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')
};

// Settings panel logic
const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');
const musicSlider = document.getElementById('music-volume');
const sfxSlider = document.getElementById('sfx-volume');
const musicMuteBtn = document.getElementById('music-mute-btn');
const sfxMuteBtn = document.getElementById('sfx-mute-btn');

settingsToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsToggle.classList.toggle('active');
    settingsPanel.classList.toggle('visible');
});

// Close settings panel when clicking outside
document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && !settingsToggle.contains(e.target)) {
        settingsToggle.classList.remove('active');
        settingsPanel.classList.remove('visible');
    }
    // Close side panel when clicking outside of the panel, the toggle, or the input
    if (!sidePanel.contains(e.target) && !guessInput.contains(e.target) && !messageDiv.contains(e.target)) {
        sidePanel.classList.remove('open');
    }
});

// Audio control listeners
musicSlider.value = musicVolume;
sfxSlider.value = sfxVolume;

musicSlider.addEventListener('input', (e) => {
    musicVolume = parseFloat(e.target.value);
    if (musicVolume > 0) preMuteMusic = musicVolume;
    localStorage.setItem('fifadle_music_volume', musicVolume);
    updateAudioSettings();
});

musicMuteBtn.addEventListener('click', () => {
    if (musicVolume > 0) {
        preMuteMusic = musicVolume;
        musicVolume = 0;
    } else {
        musicVolume = preMuteMusic;
    }
    musicSlider.value = musicVolume;
    localStorage.setItem('fifadle_music_volume', musicVolume);
    updateAudioSettings();
});

sfxSlider.addEventListener('input', (e) => {
    sfxVolume = parseFloat(e.target.value);
    if (sfxVolume > 0) preMuteSfx = sfxVolume;
    localStorage.setItem('fifadle_sfx_volume', sfxVolume);
    updateAudioSettings();
});

sfxMuteBtn.addEventListener('click', () => {
    if (sfxVolume > 0) {
        preMuteSfx = sfxVolume;
        sfxVolume = 0;
    } else {
        sfxVolume = preMuteSfx;
    }
    sfxSlider.value = sfxVolume;
    localStorage.setItem('fifadle_sfx_volume', sfxVolume);
    updateAudioSettings();
});

function updateAudioSettings() {
    const isMuted = musicVolume === 0;
    const isHidden = document.visibilityState === 'hidden';
    const isBlurred = !document.hasFocus();

    // Music should stop if muted, the tab is hidden, or the window loses focus
    const shouldStop = isMuted || isHidden || isBlurred;

    if (musicMuteBtn) musicMuteBtn.innerText = musicVolume > 0 ? '🎵' : '🔇';
    if (sfxMuteBtn) sfxMuteBtn.innerText = sfxVolume > 0 ? '🔊' : '🔇';

    if (shouldStop) {
        bgMusic.volume = 0;
        bgMusic.pause();
    } else {
        bgMusic.volume = musicVolume;
        bgMusic.play().catch(e => console.debug("Playback failed during audio update", e));
    }
}

// Plays a sound effect, resetting it if already playing
function playEffect(audio, multiplier = 1) {
    audio.volume = sfxVolume * multiplier;
    audio.currentTime = 0;
    audio.play().catch(e => console.debug("Audio playback prevented", e));
}

// Background music playback logic
const startMusic = () => {
    // Only attempt to start if not muted and tab is active/focused
    if (musicVolume === 0 || document.visibilityState === 'hidden' || !document.hasFocus()) return;
    bgMusic.play().then(() => {
        // If successful, remove listeners to prevent redundant calls
        document.removeEventListener('click', startMusic);
        document.removeEventListener('keydown', startMusic);
    }).catch(e => console.debug("Autoplay blocked, waiting for interaction", e));
};

document.addEventListener('click', startMusic);
document.addEventListener('keydown', startMusic);

// Handle window focus and visibility to mute music and show pause overlay
document.addEventListener('visibilitychange', updateAudioSettings);
window.addEventListener('blur', () => {updateAudioSettings();});
window.addEventListener('focus', () => {updateAudioSettings();});

// Handle mouse leaving and entering the application window
document.addEventListener('mouseleave', () => {bgMusic.pause();});
document.addEventListener('mouseenter', () => {
    if (musicVolume > 0 && document.visibilityState === 'visible' && document.hasFocus()) {
        bgMusic.play().catch(e => console.debug("Playback failed on enter", e));
    }
});

function validateCountriesData(data) {
    if (!Array.isArray(data) || data.length === 0) return false;

    const requiredKeys = ['name', 'flag', 'continent', 'colors', 'capital', 'star', 'fifaRank', 'fact', 'history', 'nickname'];
    return data.every(c => 
        requiredKeys.every(key => c[key] !== undefined && c[key] !== null)
    );
}

async function loadCountries() {
    try {
        const response = await fetch('countries_data.json');
        const data = await response.json();

        if (!validateCountriesData(data)) {
            throw new Error("Data validation failed: countries_data.json is malformed or missing required keys.");
        }

        countries = data;

        // Populate datalist alphabetically for better UX
        [...countries]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(c => {
                let option = document.createElement('option');
                option.value = c.name;
                datalist.appendChild(option);
            });

        updateAudioSettings();
        startMusic(); 
        initGame();
    } catch (e) {
        console.error("Failed to load country data:", e);
    }
}

loadCountries();