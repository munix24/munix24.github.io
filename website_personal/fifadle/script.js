const countries = [
    { 
        name: "Argentina", 
        flag: "🇦🇷",
        continent: "South America",
        colors: "Sky Blue and White",
        capital: "Buenos Aires",
        star: "Lionel Messi",
        fifaRank: "1",
        fact: "Defending 2022 Champions"
    },
    { 
        name: "France", 
        flag: "🇫🇷",
        continent: "Europe",
        colors: "Blue, White, Red",
        capital: "Paris",
        star: "Kylian Mbappé",
        fifaRank: "2",
        fact: "2018 World Cup Winners"
    },
    { 
        name: "USA", 
        flag: "🇺🇸",
        continent: "North America",
        colors: "Red, White, Blue",
        capital: "Washington D.C.",
        star: "Christian Pulisic",
        fifaRank: "11",
        fact: "One of the three 2026 host nations"
    },
    { 
        name: "Morocco", 
        flag: "🇲🇦",
        continent: "Africa",
        colors: "Red and Green",
        capital: "Rabat",
        star: "Achraf Hakimi",
        fifaRank: "13",
        fact: "First African team to reach a WC semi-final"
    },
    { 
        name: "Japan", 
        flag: "🇯🇵",
        continent: "Asia",
        colors: "Blue and White",
        capital: "Tokyo",
        star: "Takefusa Kubo",
        fifaRank: "18",
        fact: "Known as the Samurai Blue"
    },
    { 
        name: "Brazil", 
        flag: "🇧🇷",
        continent: "South America",
        colors: "Yellow and Green",
        capital: "Brasília",
        star: "Vinícius Júnior",
        fifaRank: "5",
        fact: "Only team to play in every World Cup"
    },
    { 
        name: "England", 
        flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        continent: "Europe",
        colors: "White and Red",
        capital: "London",
        star: "Harry Kane",
        fifaRank: "4",
        fact: "Winners of the 1966 World Cup"
    },
    { 
        name: "Belgium", 
        flag: "🇧🇪",
        continent: "Europe",
        colors: "Red and Black",
        capital: "Brussels",
        star: "Kevin De Bruyne",
        fifaRank: "3",
        fact: "Known as the Red Devils"
    },
    { 
        name: "Portugal", 
        flag: "🇵🇹",
        continent: "Europe",
        colors: "Red and Green",
        capital: "Lisbon",
        star: "Cristiano Ronaldo",
        fifaRank: "6",
        fact: "Winners of Euro 2016"
    },
    { 
        name: "Netherlands", 
        flag: "🇳🇱",
        continent: "Europe",
        colors: "Orange",
        capital: "Amsterdam",
        star: "Virgil van Dijk",
        fifaRank: "7",
        fact: "Three-time World Cup runners-up"
    },
    { 
        name: "Spain", 
        flag: "🇪🇸",
        continent: "Europe",
        colors: "Red and Gold",
        capital: "Madrid",
        star: "Rodri",
        fifaRank: "8",
        fact: "Winners of the 2010 World Cup"
    },
    { 
        name: "Italy", 
        flag: "🇮🇹",
        continent: "Europe",
        colors: "Blue",
        capital: "Rome",
        star: "Nicolò Barella",
        fifaRank: "9",
        fact: "Four-time World Cup winners"
    },
    { 
        name: "Croatia", 
        flag: "🇭🇷",
        continent: "Europe",
        colors: "Red and White Checks",
        capital: "Zagreb",
        star: "Luka Modrić",
        fifaRank: "10",
        fact: "Runners-up in the 2018 World Cup"
    },
    { 
        name: "Germany", 
        flag: "🇩🇪",
        continent: "Europe",
        colors: "White and Black",
        capital: "Berlin",
        star: "Florian Wirtz",
        fifaRank: "16",
        fact: "Won their 4th title in 2014"
    },
    { 
        name: "Mexico", 
        flag: "🇲🇽",
        continent: "North America",
        colors: "Green, White, Red",
        capital: "Mexico City",
        star: "Santiago Giménez",
        fifaRank: "15",
        fact: "First country to host three World Cups"
    },
    { 
        name: "Uruguay", 
        flag: "🇺🇾",
        continent: "South America",
        colors: "Sky Blue",
        capital: "Montevideo",
        star: "Federico Valverde",
        fifaRank: "14",
        fact: "Winners of the first ever World Cup"
    },
    { 
        name: "Colombia", 
        flag: "🇨🇴",
        continent: "South America",
        colors: "Yellow, Blue, Red",
        capital: "Bogotá",
        star: "Luis Díaz",
        fifaRank: "12",
        fact: "Reached the quarter-finals in 2014"
    },
    { 
        name: "Senegal", 
        flag: "🇸🇳",
        continent: "Africa",
        colors: "White and Green",
        capital: "Dakar",
        star: "Sadio Mané",
        fifaRank: "17",
        fact: "Current AFCON heavyweights"
    },
    { 
        name: "Switzerland", 
        flag: "🇨🇭",
        continent: "Europe",
        colors: "Red and White",
        capital: "Bern",
        star: "Granit Xhaka",
        fifaRank: "19",
        fact: "Regularly reach the Round of 16"
    },
    { 
        name: "Iran", 
        flag: "🇮🇷",
        continent: "Asia",
        colors: "White and Green",
        capital: "Tehran",
        star: "Mehdi Taremi",
        fifaRank: "20",
        fact: "Highest ranked team in Central Asia"
    },
    { 
        name: "Denmark", 
        flag: "🇩🇰",
        continent: "Europe",
        colors: "Red and White",
        capital: "Copenhagen",
        star: "Christian Eriksen",
        fifaRank: "21",
        fact: "Euro 1992 surprise winners"
    },
    { 
        name: "South Korea", 
        flag: "🇰🇷",
        continent: "Asia",
        colors: "Red",
        capital: "Seoul",
        star: "Son Heung-min",
        fifaRank: "23",
        fact: "Semi-finalists in 2002"
    },
    { 
        name: "Australia", 
        flag: "🇦🇺",
        continent: "Oceania/Asia",
        colors: "Gold and Green",
        capital: "Canberra",
        star: "Mathew Ryan",
        fifaRank: "24",
        fact: "Known as the Socceroos"
    },
    { 
        name: "Ukraine", 
        flag: "🇺🇦",
        continent: "Europe",
        colors: "Blue and Yellow",
        capital: "Kyiv",
        star: "Oleksandr Zinchenko",
        fifaRank: "22",
        fact: "Reached 2006 WC Quarter-finals"
    },
    { 
        name: "Austria", 
        flag: "🇦🇹",
        continent: "Europe",
        colors: "Red and White",
        capital: "Vienna",
        star: "David Alaba",
        fifaRank: "25",
        fact: "Finished 3rd in 1954"
    },
    { 
        name: "Nigeria", 
        flag: "🇳🇬",
        continent: "Africa",
        colors: "Green and White",
        capital: "Abuja",
        star: "Victor Osimhen",
        fifaRank: "30",
        fact: "Known as the Super Eagles"
    },
    { 
        name: "Canada", 
        flag: "🇨🇦",
        continent: "North America",
        colors: "Red and White",
        capital: "Ottawa",
        star: "Alphonso Davies",
        fifaRank: "49",
        fact: "Co-host making their 3rd appearance"
    },
    { 
        name: "Egypt", 
        flag: "🇪🇬",
        continent: "Africa",
        colors: "Red, White, Black",
        capital: "Cairo",
        star: "Mohamed Salah",
        fifaRank: "36",
        fact: "Most AFCON titles in history"
    },
    { 
        name: "Ecuador", 
        flag: "🇪🇨",
        continent: "South America",
        colors: "Yellow, Blue, Red",
        capital: "Quito",
        star: "Enner Valencia",
        fifaRank: "31",
        fact: "Played the opening match in 2022"
    },
    { 
        name: "Serbia", 
        flag: "🇷🇸",
        continent: "Europe",
        colors: "Red",
        capital: "Belgrade",
        star: "Dušan Vlahović",
        fifaRank: "33",
        fact: "Successor to the Yugoslavia team"
    },
    { 
        name: "Peru", 
        flag: "🇵🇪",
        continent: "South America",
        colors: "White with Red Sash",
        capital: "Lima",
        star: "Luis Advíncula",
        fifaRank: "32",
        fact: "Returned to the WC in 2018 after 36 years"
    },
    { 
        name: "Scotland", 
        flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        continent: "Europe",
        colors: "Dark Blue",
        capital: "Edinburgh",
        star: "Andrew Robertson",
        fifaRank: "39",
        fact: "Played in the first ever international match"
    },
    { 
        name: "Poland", 
        flag: "🇵🇱",
        continent: "Europe",
        colors: "White and Red",
        capital: "Warsaw",
        star: "Robert Lewandowski",
        fifaRank: "28",
        fact: "Finished 3rd in 1974 and 1982"
    },
    { 
        name: "Algeria", 
        flag: "🇩🇿",
        continent: "Africa",
        colors: "White and Green",
        capital: "Algiers",
        star: "Riyad Mahrez",
        fifaRank: "43",
        fact: "Beat West Germany in 1982"
    },
    { 
        name: "Tunisia", 
        flag: "🇹🇳",
        continent: "Africa",
        colors: "Red and White",
        capital: "Tunis",
        star: "Ellyes Skhiri",
        fifaRank: "41",
        fact: "First African team to win a WC match (1978)"
    },
    { 
        name: "Chile", 
        flag: "🇨🇱",
        continent: "South America",
        colors: "Red, White, Blue",
        capital: "Santiago",
        star: "Alexis Sánchez",
        fifaRank: "42",
        fact: "Hosted the 1962 World Cup"
    },
    { 
        name: "Turkey", 
        flag: "🇹🇷",
        continent: "Europe",
        colors: "Red and White",
        capital: "Ankara",
        star: "Hakan Çalhanoğlu",
        fifaRank: "40",
        fact: "Finished 3rd in 2002"
    },
    { 
        name: "Norway", 
        flag: "🇳🇴",
        continent: "Europe",
        colors: "Red, White, Blue",
        capital: "Oslo",
        star: "Erling Haaland",
        fifaRank: "47",
        fact: "Famous win against Brazil in 1998"
    },
    { 
        name: "Ivory Coast", 
        flag: "🇨🇮",
        continent: "Africa",
        colors: "Orange",
        capital: "Yamoussoukro",
        star: "Sébastien Haller",
        fifaRank: "38",
        fact: "Known as the Elephants"
    },
    { 
        name: "Cameroon", 
        flag: "🇨🇲",
        continent: "Africa",
        colors: "Green and Red",
        capital: "Yaoundé",
        star: "Vincent Aboubakar",
        fifaRank: "51",
        fact: "First African quarter-finalists (1990)"
    },
    { 
        name: "Mali", 
        flag: "🇲🇱",
        continent: "Africa",
        colors: "Green, Yellow, Red",
        capital: "Bamako",
        star: "Yves Bissouma",
        fifaRank: "44",
        fact: "Consistent performers in youth WCs"
    },
    { 
        name: "Ghana", 
        flag: "🇬🇭",
        continent: "Africa",
        colors: "White and Black",
        capital: "Accra",
        star: "Mohammed Kudus",
        fifaRank: "68",
        fact: "Known as the Black Stars"
    },
    { 
        name: "Panama", 
        flag: "🇵🇦",
        continent: "North America",
        colors: "Red",
        capital: "Panama City",
        star: "Adalberto Carrasquilla",
        fifaRank: "45",
        fact: "Made their debut in 2018"
    },
    { 
        name: "Costa Rica", 
        flag: "🇨🇷",
        continent: "North America",
        colors: "Red and Blue",
        capital: "San José",
        star: "Keylor Navas",
        fifaRank: "52",
        fact: "Reached the quarter-finals in 2014"
    },
    { 
        name: "New Zealand", 
        flag: "🇳🇿",
        continent: "Oceania",
        colors: "White",
        capital: "Wellington",
        star: "Chris Wood",
        fifaRank: "107",
        fact: "Only undefeated team in 2010 WC"
    },
    { 
        name: "Qatar", 
        flag: "🇶🇦",
        continent: "Asia",
        colors: "Maroon and White",
        capital: "Doha",
        star: "Akram Afif",
        fifaRank: "34",
        fact: "Hosts of the 2022 World Cup"
    },
    { 
        name: "Iraq", 
        flag: "🇮🇶",
        continent: "Asia",
        colors: "White",
        capital: "Baghdad",
        star: "Aymen Hussein",
        fifaRank: "58",
        fact: "Asian Cup winners in 2007"
    },
    { 
        name: "Saudi Arabia", 
        flag: "🇸🇦",
        continent: "Asia",
        colors: "Green and White",
        capital: "Riyadh",
        star: "Salem Al-Dawsari",
        fifaRank: "53",
        fact: "Beat Argentina in 2022"
    }
];

const clueTypes = [
    { key: 'continent', label: 'Continent', icon: '🌍' },
    { key: 'colors', label: 'Colors', icon: '🎨' },
    { key: 'capital', label: 'Capital', icon: '🏛️' },
    { key: 'star', label: 'Star', icon: '⭐' },
    { key: 'fifaRank', label: 'Rank', icon: '📈' },
    { key: 'fact', label: 'Fact', icon: '' },
    { key: 'flag', label: 'Flag', icon: '🏁' }
];

let currentCountry;
let currentClue = 0;
const maxClues = 6;
let lastResultEmoji = "";
let clueResults = [];
let clueOrder = [];
// Try to load from the new key, fallback to the old key for migration, default to empty array
let correctCountries = JSON.parse(localStorage.getItem('fifadle_correct_list')) || [];
let totalClues = JSON.parse(localStorage.getItem('fifadle_total_clues')) || 0;
let bestAverage = parseFloat(localStorage.getItem('fifadle_best_average')) || 0;

// Sound state management
let sfxVolume = localStorage.getItem('fifadle_sfx_volume') !== null ? parseFloat(localStorage.getItem('fifadle_sfx_volume')) : 0.5;
let musicVolume = localStorage.getItem('fifadle_music_volume') !== null ? parseFloat(localStorage.getItem('fifadle_music_volume')) : 0.2;
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
    victory: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3')
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
    bgMusic.volume = musicVolume;
}

// Plays a sound effect, resetting it if already playing
function playEffect(audio, multiplier = 1) {
    audio.volume = sfxVolume * multiplier;
    audio.currentTime = 0;
    audio.play().catch(e => console.debug("Audio playback prevented", e));
}

const clueContainer = document.getElementById('clue-container');
const clueText = document.getElementById('clue-text');
const scoreText = document.getElementById('score-text');
const scoreIndicator = document.querySelector('.score-indicator');
const avgText = document.getElementById('avg-text');
const bestAvgText = document.getElementById('best-avg-text');
const totalCluesText = document.getElementById('total-clues-text');
const guessInput = document.getElementById('guess-input');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const shareBtn = document.getElementById('share-btn');
const skipBtn = document.getElementById('skip-btn');
const datalist = document.getElementById('countries-list');

// Populate datalist alphabetically for better UX
[...countries]
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(c => {
        let option = document.createElement('option');
        option.value = c.name;
        datalist.appendChild(option);
    });

function updateScoreUI() {
    scoreText.innerText = `Country: ${correctCountries.length} / ${countries.length}`;
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
}

function getShuffledClueOrder() {
    const order = Array.from({length: clueTypes.length}, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order.slice(0, maxClues);
}

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
        updateScoreUI();
    } else {
        currentClue = 0;
        clueResults = new Array(maxClues).fill(null);
        clueResults[0] = 'initial';
        clueOrder = getShuffledClueOrder();
        totalClues++;
        localStorage.setItem('fifadle_total_clues', totalClues);
        const availableCountries = countries.filter(c => !correctCountries.includes(c.name));
        currentCountry = availableCountries.length > 0 
            ? availableCountries[Math.floor(Math.random() * availableCountries.length)]
            : countries[Math.floor(Math.random() * countries.length)];
    }

    // Always save the current state after initGame (whether loaded or new)
    localStorage.setItem('fifadle_saved_current_country_name', currentCountry.name);
    localStorage.setItem('fifadle_saved_current_clue_index', currentClue.toString());
    localStorage.setItem('fifadle_clue_results', JSON.stringify(clueResults));
    localStorage.setItem('fifadle_clue_order', JSON.stringify(clueOrder));
    
    messageDiv.className = 'pulsing';
    messageDiv.innerText = '???';
    guessInput.value = '';
    guessInput.disabled = false;
    submitBtn.style.display = 'inline-block';
    playAgainBtn.style.display = 'none';
    skipBtn.style.display = 'inline-block';
    
    renderClues();
    updateCluesUI();
}

function renderClues() {
    clueContainer.innerHTML = '';
    for (let i = 0; i < maxClues; i++) {
        const div = document.createElement('div');
        const status = clueResults[i];
        const statusClass = status || (i <= currentClue ? 'correct' : '');
        div.className = `clue-item ${i <= currentClue ? 'revealed' : ''} ${statusClass}`;
        
        const clue = clueTypes[clueOrder[i]];
        if (clue.key === 'fact' && i <= currentClue) {
            // Special case for Fact: no icon, but show label
            div.innerHTML = `<div><strong>${clue.label}:</strong> ${currentCountry[clue.key]}</div>`;
        } else {
            const icon = i <= currentClue ? clue.icon : '🔒';
            const content = i <= currentClue 
                ? `<strong>${clue.label}:</strong> ${currentCountry[clue.key]}` 
                : `<strong>Clue ${i + 1}:</strong> Locked`;
                
            div.innerHTML = `<span class="clue-icon">${icon}</span><div>${content}</div>`;
        }
        clueContainer.appendChild(div);
    }
}

function updateCluesUI() {
    clueText.innerText = `Clue ${currentClue + 1} / ${maxClues}`;
    if (totalCluesText) {
        totalCluesText.innerText = `Total Clues: ${totalClues}`;
    }
}

function makeGuess() {
    const userGuess = guessInput.value.trim().toLowerCase();
    const correctAnswer = currentCountry.name.toLowerCase();

    if (!userGuess) return;

    if (userGuess === correctAnswer) {
        clueResults[currentClue] = 'correct';
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
            totalClues++;
            localStorage.setItem('fifadle_total_clues', totalClues);

            currentClue++;
            clueResults[currentClue] = 'initial';
            localStorage.setItem('fifadle_saved_current_clue_index', currentClue.toString());
            localStorage.setItem('fifadle_clue_results', JSON.stringify(clueResults));
            renderClues();
            updateCluesUI();
            guessInput.value = '';
        } else {
            endGame(false);
        }
    }
}

function skipClue() {
    if (currentClue < maxClues - 1) {
        clueResults[currentClue] = 'skipped';
        totalClues++;
        localStorage.setItem('fifadle_total_clues', totalClues);

        currentClue++;
        localStorage.setItem('fifadle_saved_current_clue_index', currentClue.toString());
        localStorage.setItem('fifadle_clue_results', JSON.stringify(clueResults));
        renderClues();
        updateCluesUI();
        guessInput.value = '';
    } else {
        clueResults[currentClue] = 'skipped';
        renderClues();
        endGame(false);
    }
}

function endGame(isWin) {
    const winClue = currentClue;
    guessInput.disabled = true;
    submitBtn.style.display = 'none';
    playAgainBtn.style.display = 'block';
    skipBtn.style.display = 'none';
    currentClue = maxClues - 1;
    renderClues();
    updateCluesUI();
    localStorage.removeItem('fifadle_saved_current_country_name');
    localStorage.removeItem('fifadle_saved_current_clue_index');
    localStorage.removeItem('fifadle_clue_results');
    localStorage.removeItem('fifadle_clue_order');

    if (isWin) {
        playEffect(sounds.correct);
        
        // Trigger celebratory confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#004b87', '#c6a15b', '#008f4c', '#ffffff']
        });
    }

    // Update correct countries list and localStorage even if didnt win
    correctCountries.push(currentCountry.name);
    localStorage.setItem('fifadle_correct_list', JSON.stringify(correctCountries));
    updateScoreUI();

    // Check for total tournament completion (48/48)
    if (correctCountries.length === countries.length) {
        triggerCompletionAnimation();
    }

    lastResultEmoji = generateShareEmoji(isWin, winClue);
    messageDiv.innerHTML = `${currentCountry.name} <span style="font-size: 2.2rem; margin-left: 10px;">${currentCountry.flag}</span>`;
    messageDiv.className = isWin ? 'success' : 'error';
}

function triggerCompletionAnimation() {
    // Set best average upon completion
    const currentAvg = totalClues / countries.length;
    if (bestAverage === 0 || currentAvg < bestAverage) {
        bestAverage = currentAvg;
        localStorage.setItem('fifadle_best_average', bestAverage);
        updateScoreUI();
    }
        
    const isComplete = correctCountries.length === countries.length;
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

function newGame() {
    if (confirm("Are you sure you want to reset current game progress? This cannot be undone.")) {
        localStorage.removeItem('fifadle_correct_list');
        localStorage.removeItem('fifadle_total_clues');
        localStorage.removeItem('fifadle_saved_current_country_name');
        localStorage.removeItem('fifadle_saved_current_clue_index');
        localStorage.removeItem('fifadle_clue_results');
        localStorage.removeItem('fifadle_clue_order');
        correctCountries = [];
        totalClues = 0;
        updateScoreUI();
        initGame();
        settingsToggle.classList.remove('active');
        settingsPanel.classList.remove('visible');
    }
}

function resetProgress() {
    if (confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
        localStorage.removeItem('fifadle_correct_list');
        localStorage.removeItem('fifadle_total_clues');
        localStorage.removeItem('fifadle_saved_current_country_name');
        localStorage.removeItem('fifadle_saved_current_clue_index');
        localStorage.removeItem('fifadle_clue_results');
        localStorage.removeItem('fifadle_clue_order');
        localStorage.removeItem('fifadle_best_average');
        correctCountries = [];
        totalClues = 0;
        updateScoreUI();
        initGame();
        settingsToggle.classList.remove('active');
        settingsPanel.classList.remove('visible');
    }
}

guessInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') makeGuess(); });

// Automatically submit when a country is selected from the datalist
guessInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (countries.some(c => c.name === val)) {
        makeGuess();
    }
});

function shareResults() {
    navigator.clipboard.writeText(lastResultEmoji);
}

// Background music playback logic
const startMusic = () => {
    bgMusic.play().then(() => {
        // If successful, remove listeners to prevent redundant calls
        document.removeEventListener('click', startMusic);
        document.removeEventListener('keydown', startMusic);
    }).catch(e => console.debug("Autoplay blocked, waiting for interaction", e));
};
document.addEventListener('click', startMusic);
document.addEventListener('keydown', startMusic);

// Handle background/foreground state for mobile and browser tabs
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        bgMusic.pause();
    } else if (musicVolume > 0) {
        // Only resume if the user hasn't muted the music
        bgMusic.play().catch(e => console.debug("Resume blocked until interaction", e));
    }
});

updateAudioSettings();
startMusic(); // Attempt to play immediately on page load
initGame();