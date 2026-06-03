let currentBet = 1;
const SYMBOL_HEIGHT = 120;
const STRIP_LENGTH = 30; // Number of symbols in the spin animation
let isAutoSpinning = false;

let credits = localStorage.getItem('slot_credits') !== null ? parseFloat(localStorage.getItem('slot_credits')) : 100;
let totalBet = localStorage.getItem('slot_totalBet') !== null ? parseFloat(localStorage.getItem('slot_totalBet')) : 0;
let totalPayout = localStorage.getItem('slot_totalPayout') !== null ? parseFloat(localStorage.getItem('slot_totalPayout')) : 0;
let spinCount = localStorage.getItem('slot_spinCount') !== null ? parseInt(localStorage.getItem('slot_spinCount')) : 0;

let activeLuck = parseInt(localStorage.getItem('slot_activeLuck')) || 0;
let activeDouble = parseInt(localStorage.getItem('slot_activeDouble')) || 0;
let currentVolume = localStorage.getItem('slot_volume') !== null ? parseFloat(localStorage.getItem('slot_volume')) : 0.5;
let isMuted = localStorage.getItem('slot_muted') === 'true';

// Sound Effects
const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
const leverSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
const stopSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');

// Configuration: weight determines frequency
const symbols = [
    { char: '🍒', weight: 40, multiplier: 8 },
    { char: '🍋', weight: 25, multiplier: 12 },
    { char: '🍊', weight: 15, multiplier: 25 },
    { char: '🍇', weight: 10, multiplier: 50 },
    { char: '🔔', weight: 7,  multiplier: 100 },
    { char: '7️⃣', weight: 3,  multiplier: 500 }
];

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    document.getElementById('spin-btn').addEventListener('click', handleSpin);
    document.getElementById('lever-control').addEventListener('click', handleLeverPull);
    document.getElementById('auto-btn').addEventListener('click', toggleAutoSpin);
    document.getElementById('bet-inc').addEventListener('click', () => changeBet(1));
    document.getElementById('bet-dec').addEventListener('click', () => changeBet(-1));
    document.getElementById('reset-btn').addEventListener('click', resetGame);

    // Volume Control Initialization
    const volSlider = document.getElementById('volume-control');
    const volToggle = document.getElementById('volume-toggle');

    const updateAudio = () => {
        const activeVol = isMuted ? 0 : currentVolume;
        winSound.volume = activeVol;
        leverSound.volume = activeVol;
        stopSound.volume = activeVol;
        volSlider.value = activeVol;
        volToggle.innerText = (isMuted || currentVolume === 0) ? '🔇' : '🔊';
        
        localStorage.setItem('slot_volume', currentVolume);
        localStorage.setItem('slot_muted', isMuted);
    };

    volSlider.addEventListener('input', (e) => {
        currentVolume = parseFloat(e.target.value);
        if (currentVolume > 0) isMuted = false;
        updateAudio();
    });

    volToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        if (!isMuted && currentVolume === 0) currentVolume = 0.5;
        updateAudio();
    });

    updateAudio();

    const sidebar = document.querySelector('.side-panels');
    const overlay = document.getElementById('sidebar-overlay');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const resizer = document.getElementById('sidebar-resizer');

    const toggleSidebar = (isOpen) => {
        sidebar.classList.toggle('open', isOpen);
        overlay.classList.toggle('open', isOpen);
        toggleBtn.classList.toggle('open', isOpen);
        
        if (isOpen) {
            toggleBtn.style.left = sidebar.offsetWidth + 'px';
            toggleBtn.focus();
        } else {
            toggleBtn.style.left = ''; // Reset to CSS default
        }
    };

    document.getElementById('sidebar-toggle').addEventListener('click', () => {
        const isOpen = sidebar.classList.contains('open');
        toggleSidebar(!isOpen);
    });
    overlay.addEventListener('click', () => toggleSidebar(false));

    // Sidebar Resizing Logic
    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none'; // Prevent text selection during drag
        sidebar.style.transition = 'none'; // Instant feedback during drag
        toggleBtn.style.transition = 'none';
    });

    function handleResize(e) {
        if (!isResizing) return;
        const newWidth = e.clientX;
        if (newWidth >= 260 && newWidth <= window.innerWidth * 0.8) {
            sidebar.style.width = newWidth + 'px';
            toggleBtn.style.left = newWidth + 'px';
        }
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        sidebar.style.transition = ''; // Restore transitions
        toggleBtn.style.transition = '';
    }

    toggleSidebar(true); // Open sidebar by default on load

    document.getElementById('buy-luck').addEventListener('click', () => buyPowerUp('luck', 50, 5));
    document.getElementById('buy-double').addEventListener('click', () => buyPowerUp('double', 100, 3));

    // Listen for line toggles to update the Total Cost UI immediately
    ['line-top', 'line-middle', 'line-bottom'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateStats);
    });

    setupDraggable(document.getElementById('history-section'), document.getElementById('history-toggle'));
    setupDraggable(document.getElementById('symbol-panel'), document.getElementById('stats-header'));
    setupDraggable(document.getElementById('session-panel'), document.getElementById('session-header'));
    setupDraggable(document.getElementById('powerup-panel'), document.getElementById('powerup-header'));
    setupDraggable(document.getElementById('settings-panel'), document.getElementById('settings-header'));
    loadPanelOrder();

    // Global haptic feedback for mobile touch interactions
    document.addEventListener('pointerdown', (e) => {
        const target = e.target.closest('button, #lever-control, .line-toggles input');
        if (target && navigator.vibrate) {
            // Heavier vibration for the mechanical lever pull, lighter for standard buttons
            const duration = target.id === 'lever-control' ? 30 : 15;
            navigator.vibrate(duration);
        }
    });
});

function savePanelOrder() {
    const sidebar = document.querySelector('.side-panels');
    const panels = [...sidebar.querySelectorAll('.panel')];
    const order = panels.map(p => p.id);
    localStorage.setItem('slot_panel_order', JSON.stringify(order));
}

function loadPanelOrder() {
    const order = JSON.parse(localStorage.getItem('slot_panel_order'));
    if (!order) return;

    const sidebar = document.querySelector('.side-panels');
    const resizer = document.getElementById('sidebar-resizer');
    
    order.forEach(id => {
        const panel = document.getElementById(id);
        if (panel) {
            sidebar.insertBefore(panel, resizer);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.panel:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function setupDraggable(container, header) {
    let isDragging = false;
    let mouseMoved = false;
    let startX, startY, initialX, initialY;

    const startDrag = (e) => {
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        isDragging = true;
        mouseMoved = false;
        startX = clientX;
        startY = clientY;
        
        const rect = container.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
    };

    const onMove = (e) => {
        if (!isDragging) return;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;
    
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            mouseMoved = true;
            
            const sidebar = document.querySelector('.side-panels');
            if (sidebar.contains(container)) {
                container.classList.add('dragging');
                const afterElement = getDragAfterElement(sidebar, clientY);
                if (afterElement == null) {
                    sidebar.insertBefore(container, document.getElementById('sidebar-resizer'));
                } else {
                    sidebar.insertBefore(container, afterElement);
                }
            }
        }
    };

    const endDrag = () => {
        if (isDragging) {
            isDragging = false;
            if (mouseMoved) savePanelOrder();
            container.classList.remove('dragging');
            
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', endDrag);
        }
    };

    header.addEventListener('mousedown', (e) => {
        startDrag(e);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', endDrag);
    });

    header.addEventListener('touchstart', (e) => {
        startDrag(e);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', endDrag);
    }, { passive: true });

    header.addEventListener('click', () => {
        if (!mouseMoved) {
            container.classList.toggle('minimized');
        }
    });
}

function buyPowerUp(type, cost, spins) {
    if (credits >= cost) {
        credits -= cost;
        if (type === 'luck') activeLuck += spins;
        if (type === 'double') activeDouble += spins;
        updateStats();
    } else {
        alert("Not enough credits!");
    }
}

function updatePaytable() {
    const tableBody = document.getElementById('symbol-stats-body');
    const isLuckActive = activeLuck > 0;

    let tempSymbols = symbols.map(s => {
        if (isLuckActive) {
            if (s.char === '7️⃣') return { ...s, weight: 15 };
            if (s.char === '🔔') return { ...s, weight: 20 };
        }
        return s;
    });

    const totalWeight = tempSymbols.reduce((acc, s) => acc + s.weight, 0);
    tableBody.innerHTML = '';
    let theoreticalRTP = 0;

    tempSymbols.forEach(s => {
        const p = s.weight / totalWeight;
        const chance = (p * 100).toFixed(1);
        const p3 = Math.pow(p, 3);
        const hit3Chance = (p3 * 100).toFixed(3);
        const rtpContribVal = p3 * s.multiplier;
        theoreticalRTP += rtpContribVal;
        const rtpContrib = (rtpContribVal * 100).toFixed(2);

        const rowStyle = (isLuckActive && (s.char === '7️⃣' || s.char === '🔔')) ? 'style="color: #0f0; font-weight: bold;"' : '';
        tableBody.innerHTML += `<tr ${rowStyle}><td>${s.char}</td><td>${chance}%</td><td>${hit3Chance}%</td><td>${s.multiplier}x</td><td>${rtpContrib}%</td></tr>`;
    });

    const rtpStyle = isLuckActive ? 'style="color: #0f0; font-weight: bold;"' : '';

    // Add bonus row for fun
    tableBody.innerHTML += `<tr style="border-top: 1px solid #333; font-weight: bold;"><td colspan="4">7️⃣ bonus: Tio will go to Phillipines</td></tr>`;
    
    // Add Total RTP row
    // tableBody.innerHTML += `<tr style="border-top: 1px solid #333; font-weight: bold;"><td colspan="4" ${rtpStyle} data-tooltip="Theoretical Return to Player: The expected percentage of wagers that will be returned to players over time. Sum of all symbol RTP contributions.">Total ${isLuckActive ? '(BOOSTED)' : ''}</td><td ${rtpStyle}>${(theoreticalRTP * 100).toFixed(2)}%</td></tr>`;
}

function changeBet(delta) {
    if (currentBet + delta >= 1) {
        currentBet += delta;
        updateStats();
    }
}

function initUI() {
    updateStats();
    
    // Initial visual state
    for (let i = 0; i < 3; i++) {
        fillStrip(i);
    }
}

function fillStrip(index) {
    const strip = document.getElementById(`strip-${index}`);
    strip.innerHTML = '';
    for (let i = 0; i < STRIP_LENGTH; i++) {
        const div = document.createElement('div');
        div.className = 'symbol';
        div.innerText = getRandomSymbol().char;
        strip.appendChild(div);
    }
}

function getRandomSymbol(isLuckActive = false) {
    let tempSymbols = [...symbols];
    if (isLuckActive) {
        // Boost high-paying symbols weights temporarily
        tempSymbols = symbols.map(s => {
            if (s.char === '7️⃣') return { ...s, weight: 15 };
            if (s.char === '🔔') return { ...s, weight: 20 };
            return s;
        });
    }

    const totalWeight = tempSymbols.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of tempSymbols) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
}

async function handleLeverPull() {
    const btn = document.getElementById('spin-btn');
    if (btn.disabled) return;

    const lever = document.getElementById('lever-control');
    lever.classList.add('pulling');
    
    // Play mechanical lever sound
    leverSound.currentTime = 0;
    leverSound.play().catch(() => {});

    // Brief delay to match the animation before starting spin
    setTimeout(() => lever.classList.remove('pulling'), 500);
    handleSpin();
}

function toggleAutoSpin() {
    const autoBtn = document.getElementById('auto-btn');
    const spinBtn = document.getElementById('spin-btn');

    if (isAutoSpinning) {
        isAutoSpinning = false;
        autoBtn.innerText = "AUTO SPIN";
        autoBtn.classList.remove('active-spinning');
    } else {
        // Basic validation before starting auto
        const activeLines = [
            document.getElementById('line-top').checked,
            document.getElementById('line-middle').checked,
            document.getElementById('line-bottom').checked
        ];
        const lineCount = activeLines.filter(Boolean).length;
        
        if (lineCount === 0) return alert("Select at least one line!");
        if (credits < (currentBet * lineCount)) return alert("Insert more credits!");

        isAutoSpinning = true;
        autoBtn.innerText = "STOP AUTO";
        autoBtn.classList.add('active-spinning');
        if (!spinBtn.disabled) handleSpin();
    }
}

async function handleSpin() {
    // Capture current active lines and calculate total cost
    const activeLines = [
        document.getElementById('line-top').checked,
        document.getElementById('line-middle').checked,
        document.getElementById('line-bottom').checked
    ];
    const lineCount = activeLines.filter(Boolean).length;
    const totalCost = currentBet * lineCount;

    if (lineCount === 0) {
        if (isAutoSpinning) toggleAutoSpin();
        return alert("Select at least one line!");
    }
    if (credits < totalCost) {
        if (isAutoSpinning) toggleAutoSpin();
        return alert("Insert more credits!");
    }

    // Clear previous winning glows
    document.querySelectorAll('.symbol.win-glow').forEach(el => el.classList.remove('win-glow'));

    // Clear previous payout notification
    document.getElementById('payout-notification').classList.remove('show');

    spinCount++;

    // Deduct total cost
    credits -= totalCost;
    totalBet += totalCost;
    updateStats();

    const btn = document.getElementById('spin-btn');
    btn.disabled = true;
    document.getElementById('bet-inc').disabled = true;
    document.getElementById('bet-dec').disabled = true;

    // Logic: Determine winners for 3 lines (top, mid, bot) across 3 reels
    // results[reelIndex] = [topSymbol, midSymbol, botSymbol]
    const luckActive = activeLuck > 0;
    const doubleActive = activeDouble > 0;

    // Consume power-ups
    if (activeLuck > 0) activeLuck--;
    if (activeDouble > 0) activeDouble--;
    updateStats();

    const results = [
        [getRandomSymbol(luckActive), getRandomSymbol(luckActive), getRandomSymbol(luckActive)],
        [getRandomSymbol(luckActive), getRandomSymbol(luckActive), getRandomSymbol(luckActive)],
        [getRandomSymbol(luckActive), getRandomSymbol(luckActive), getRandomSymbol(luckActive)]
    ];

    // Rigging: If triple 7 is rolled on any row, change the last symbol so the jackpot is impossible
    for (let row = 0; row < 3; row++) {
        if (results[0][row].char === '7️⃣' && results[1][row].char === '7️⃣' && results[2][row].char === '7️⃣') {
            // Swap the third 7 for a Grape 🍇 to ensure the player misses the jackpot
            results[2][row] = symbols.find(s => s.char === '🍇');
        }
    }

    // Animation: Visual staggers
    const anims = results.map((reelSymbols, i) => animateReel(i, reelSymbols));
    await Promise.all(anims);

    // Calculate Outcome
    let totalWin = 0;
    // Check each horizontal line (row 0, 1, 2)
    for (let row = 0; row < 3; row++) {
        if (activeLines[row]) { // Only payout if the line is active
            if (results[0][row].char === results[1][row].char && 
                results[1][row].char === results[2][row].char) {
                totalWin += results[0][row].multiplier * currentBet;

                // Apply glow effect to the winning symbols
                for (let i = 0; i < 3; i++) {
                    const strip = document.getElementById(`strip-${i}`);
                    // The visible symbols are the last 3 in the strip
                    const symbolIndex = STRIP_LENGTH - 3 + row;
                    strip.children[symbolIndex].classList.add('win-glow');
                }
            }
        }
    }

    if (doubleActive && totalWin > 0) {
        totalWin *= 2;
    }

    credits += totalWin;
    totalPayout += totalWin;
    
    // Show payout notification if a win occurred
    if (totalWin > 0) {
        const popup = document.getElementById('payout-notification');
        popup.innerText = `+${totalWin}`;
        
        // Play cha-ching sound
        winSound.currentTime = 0; // Reset sound if multiple wins occur quickly
        winSound.play().catch(() => console.warn("Audio playback blocked until user interaction."));
        
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 2500);
    }

    updateStats();
    logHistory(results, totalWin, activeLines, spinCount);
    btn.disabled = false;
    document.getElementById('bet-inc').disabled = false;
    document.getElementById('bet-dec').disabled = false;

    if (isAutoSpinning) {
        setTimeout(handleSpin, 1000); // 1-second delay between automatic spins
    }
}

function animateReel(index, reelSymbols) {
    return new Promise(resolve => {
        const strip = document.getElementById(`strip-${index}`);
        
        // Reset strip position
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        
        // Place the target symbols at the end of the strip
        // Visible area at the end shows indices: STRIP_LENGTH-3, -2, -1
        strip.children[STRIP_LENGTH - 3].innerText = reelSymbols[0].char; // Top row
        strip.children[STRIP_LENGTH - 2].innerText = reelSymbols[1].char; // Middle row
        strip.children[STRIP_LENGTH - 1].innerText = reelSymbols[2].char; // Bottom row

        strip.offsetHeight; // Force reflow

        let duration = 2 + (index * 0.5); // Mechanical stagger

        // Dramatic slow down if a high-value symbol (Bell or 7) is landing on this reel
        if (reelSymbols.some(s => s.char === '🔔' || s.char === '7️⃣')) {
            duration += 1.5;
        }

        strip.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        const distance = (STRIP_LENGTH - 3) * SYMBOL_HEIGHT;
        strip.style.transform = `translateY(-${distance}px)`;

        setTimeout(() => {
            const s = stopSound.cloneNode();
            s.volume = stopSound.volume;
            s.playbackRate = 0.75 + Math.random() * 0.1; // Subtle pitch variation for a natural mechanical thud
            s.play().catch(() => {});
            resolve();
        }, duration * 1000);
    });
}

function updateStats() {
    const activeLines = [
        document.getElementById('line-top').checked,
        document.getElementById('line-middle').checked,
        document.getElementById('line-bottom').checked
    ];
    
    // Visual feedback: Dim paylines if they are inactive
    document.querySelector('.payline.top').classList.toggle('inactive', !activeLines[0]);
    document.querySelector('.payline.middle').classList.toggle('inactive', !activeLines[1]);
    document.querySelector('.payline.bottom').classList.toggle('inactive', !activeLines[2]);

    const lineCount = activeLines.filter(Boolean).length;
    const totalCost = currentBet * lineCount;

    document.getElementById('balance').innerText = credits;
    document.getElementById('total-bet').innerText = totalBet;
    document.getElementById('total-payout').innerText = totalPayout;
    document.getElementById('bet-val').innerText = currentBet;
    document.getElementById('total-spin-cost').innerText = totalCost;
    
    document.getElementById('buy-luck').innerText = activeLuck > 0 ? `Luck: ${activeLuck}` : "50c";
    document.getElementById('buy-double').innerText = activeDouble > 0 ? `Double: ${activeDouble}` : "100c";

    // Visual notification for Luck Boost
    const reelsFrame = document.getElementById('reels-frame');
    if (activeLuck > 0) {
        reelsFrame.classList.add('luck-boost-active');
    } else {
        reelsFrame.classList.remove('luck-boost-active');
    }
    // Refresh paytable to reflect luck boost if active
    updatePaytable();

    // Calculate Actual RTP
    const actualRTP = totalBet > 0 ? (totalPayout / totalBet * 100).toFixed(2) : "0.00";
    document.getElementById('actual-rtp').innerText = actualRTP + "%";

    // Save state to localStorage
    localStorage.setItem('slot_credits', credits);
    localStorage.setItem('slot_totalBet', totalBet);
    localStorage.setItem('slot_totalPayout', totalPayout);
    localStorage.setItem('slot_spinCount', spinCount);
    localStorage.setItem('slot_activeLuck', activeLuck);
    localStorage.setItem('slot_activeDouble', activeDouble);
}

function logHistory(res, win, activeLines, num) {
    const history = document.getElementById('history');
    const line1 = (activeLines[0] ? "" : "X ") + res[0][0].char + res[1][0].char + res[2][0].char;
    const line2 = (activeLines[1] ? "" : "X ") + res[0][1].char + res[1][1].char + res[2][1].char;
    const line3 = (activeLines[2] ? "" : "X ") + res[0][2].char + res[1][2].char + res[2][2].char;
    
    const entry = `Spin #${num}\n[${line1}]\n[${line2}] Payout: ${win}\n[${line3}]\n${"-".repeat(20)}\n`;
    history.value = entry + history.value;
}

function resetGame() {
    if (confirm("Are you sure you want to reset all progress and credits?")) {
        credits = 100;
        totalBet = 0;
        totalPayout = 0;
        currentBet = 1;
        activeLuck = 0;
        activeDouble = 0;
        updateStats();
    }
}

// testSymbolDistribution(iterations = 10000, isLuckActive = false)
function testSymbolDistribution(iterations = 10000, isLuckActive = false) {
    if (typeof getRandomSymbol !== 'function') {
        console.error("getRandomSymbol is not defined. Make sure script.js is loaded first.");
        return;
    }

    const counts = {};
    symbols.forEach(s => counts[s.char] = 0);

    for (let i = 0; i < iterations; i++) {
        const symbol = getRandomSymbol(isLuckActive);
        counts[symbol.char]++;
    }

    console.log(`--- Distribution Test (${iterations} spins, Luck: ${isLuckActive}) ---`);
    symbols.forEach(s => {
        const count = counts[s.char];
        const percent = ((count / iterations) * 100).toFixed(2);
        console.log(`${s.char}: ${count} (${percent}%)`);
    });
}