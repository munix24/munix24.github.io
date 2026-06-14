// TODO: settings gear?
// top panel with stats and paytable
// bottom panel with game history
// left panel with power-ups and upgrades
// wild card that gives power up

let currentBet = 1;
const STRIP_LENGTH = 30; // Number of symbols in the spin animation
let isAutoSpinning = false;

let credits = localStorage.getItem('slot_credits') !== null ? parseFloat(localStorage.getItem('slot_credits')) : 100;
let totalBet = localStorage.getItem('slot_totalBet') !== null ? parseFloat(localStorage.getItem('slot_totalBet')) : 0;
let totalPayout = localStorage.getItem('slot_totalPayout') !== null ? parseFloat(localStorage.getItem('slot_totalPayout')) : 0;
let spinCount = localStorage.getItem('slot_spinCount') !== null ? parseInt(localStorage.getItem('slot_spinCount')) : 0;

let activeLuck = parseInt(localStorage.getItem('slot_activeLuck')) || 0;
let activeDouble = parseInt(localStorage.getItem('slot_activeDouble')) || 0;
let activeSpeed = parseInt(localStorage.getItem('slot_activeSpeed')) || 0;
let currentVolume = localStorage.getItem('slot_volume') !== null ? parseFloat(localStorage.getItem('slot_volume')) : 0.5;
let isMuted = localStorage.getItem('slot_muted') === 'true';
let isLeverLeft = localStorage.getItem('slot_lever_left') === 'true';

// Sound Effects
const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
const leverSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
const stopSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
const tensionSound = new Audio('https://assets.mixkit.co/active_storage/sfx/154/154-preview.mp3'); // Suspenseful riser
const clinkSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3'); // Metallic clink

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
    initLeverDraggable();
    document.getElementById('spin-btn').addEventListener('click', handleLeverPull);
    // Lever click is now handled by the drag logic (tap vs drag)
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
        tensionSound.volume = activeVol;
        clinkSound.volume = activeVol;
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

    // Fullscreen Logic for Immersive Experience
    const fsBtn = document.getElementById('fullscreen-btn');
    const fsIcon = document.getElementById('fullscreen-icon');

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    };

    fsBtn.addEventListener('click', toggleFullscreen);
    fsIcon.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', () => {
        fsIcon.innerText = document.fullscreenElement ? '🗗' : '🗖';
    });

    const sidebar = document.querySelector('.side-panels');
    const overlay = document.getElementById('sidebar-overlay');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const resizer = document.getElementById('sidebar-resizer');

    // Settings Modal Logic
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsClose = document.getElementById('settings-close');

    const toggleSettings = (forceState) => {
        const isOpen = (typeof forceState === 'boolean') ? forceState : !settingsPanel.classList.contains('open');
        settingsPanel.classList.toggle('open', isOpen);
    };

    settingsBtn.addEventListener('click', () => toggleSettings());
    settingsClose.addEventListener('click', () => toggleSettings(false));

    // Lever Handedness Logic
    const leverToggle = document.getElementById('lever-flip-toggle');
    const updateLeverMode = () => {
        document.body.classList.toggle('lever-left', isLeverLeft);
        if (leverToggle) leverToggle.checked = isLeverLeft;
        localStorage.setItem('slot_lever_left', isLeverLeft);
    };
    if (leverToggle) {
        leverToggle.addEventListener('change', (e) => {
            isLeverLeft = e.target.checked;
            updateLeverMode();
        });
    }
    updateLeverMode();

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

    // Click on empty space inside the sidebar to close it
    sidebar.addEventListener('click', (e) => {
        if (e.target === sidebar) {
            toggleSidebar(false);
        }
    });

    // Swipe left on the sidebar to close it
    let swipeStartX = 0;
    sidebar.addEventListener('touchstart', (e) => {
        swipeStartX = e.touches[0].clientX;
    }, { passive: true });

    sidebar.addEventListener('touchend', (e) => {
        const swipeEndX = e.changedTouches[0].clientX;
        // Threshold of 60px for a left swipe gesture
        if (swipeStartX - swipeEndX > 60) {
            toggleSidebar(false);
        }
    }, { passive: true });

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

    document.getElementById('buy-double').addEventListener('click', () => buyPowerUp('double', 50, 10));
    document.getElementById('buy-speed').addEventListener('click', () => buyPowerUp('speed', 50, 10));
    document.getElementById('buy-luck').addEventListener('click', () => buyPowerUp('luck', 50, 10));

    // Listen for line toggles to update the Total Cost UI immediately
    ['line-top', 'line-middle', 'line-bottom'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateStats);
    });

    setupDraggable(document.getElementById('history-section'), document.getElementById('history-toggle'));
    setupDraggable(document.getElementById('symbol-panel'), document.getElementById('stats-header'));
    setupDraggable(document.getElementById('session-panel'), document.getElementById('session-header'));
    setupDraggable(document.getElementById('powerup-panel'), document.getElementById('powerup-header'));
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

    // Handle window resizing to keep reels aligned
    window.addEventListener('resize', () => {
        const spinBtn = document.getElementById('spin-btn');
        // If the machine is currently spinning, don't interrupt the animation
        if (spinBtn && spinBtn.disabled) return;

        for (let i = 0; i < 3; i++) {
            const strip = document.getElementById(`strip-${i}`);
            // Only update if the strip has been spun (has a transform applied)
            if (strip && strip.style.transform && strip.style.transform !== 'translateY(0px)' && strip.style.transform !== 'translateY(0)') {
                const firstSymbol = strip.querySelector('.symbol');
                if (firstSymbol) {
                const symbolHeight = firstSymbol.getBoundingClientRect().height;
                    const distance = (STRIP_LENGTH - 3) * symbolHeight;
                    strip.style.transition = 'none'; // Instant update without animation
                    strip.style.transform = `translateY(-${distance}px)`;
                }
            }
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
        if (type === 'speed') activeSpeed += spins;
        updateStats();
    } else {
        alert("Not enough credits!");
    }
}

function initLeverDraggable() {
    const leverControl = document.getElementById('lever-control');
    const leverArm = leverControl.querySelector('.lever-arm');
    const spinBtn = document.getElementById('spin-btn');
    
    let isDragging = false;
    let startY = 0;
    let thresholdMet = false;
    let clinkPlayed = false;
    const maxRotation = 120; // Degrees for a full mechanical pull
    const pullThreshold = 300; // Adjusted for more fluid, responsive movement

    const startDrag = (e) => {
        if (e.type === 'mousedown') e.preventDefault();
        if (spinBtn.disabled) return;
        isDragging = true;
        thresholdMet = false;
        clinkPlayed = false;
        startY = e.clientY || e.touches[0].clientY;
        leverArm.classList.add('no-transition');        // Normally, CSS says "take 0.4 seconds to change any transform."
        document.body.classList.add('lever-active');
        
        // Play initial mechanical click
        leverSound.currentTime = 0;
        leverSound.play().catch(() => {});
    };

    const moveDrag = (e) => {
        if (!isDragging) return;
        
        const currentY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        const deltaY = Math.max(0, currentY - startY);
        
        // Map deltaY to rotation (0 to 80 degrees)
        const rotation = Math.min(maxRotation, (deltaY / pullThreshold) * maxRotation);
        
        // Use the same 3D rotation logic from your CSS
        leverArm.style.transform = `rotateX(${rotation}deg)`;

        // Trigger spin only if pulled almost entirely to the bottom (99%)
        if (rotation >= maxRotation * 0.99 && !spinBtn.disabled) {
            if (!clinkPlayed) {
                clinkSound.currentTime = 0;
                clinkSound.play().catch(() => {});
                clinkPlayed = true;
            }
            thresholdMet = true;
            finishPull();
        }
    };

    const finishPull = () => {
        if (!isDragging) return;
        isDragging = false;
        
        leverArm.classList.remove('no-transition');
        document.body.classList.remove('lever-active');
        leverArm.style.transform = ''; // Reset to CSS default (upright)
        
        if (!spinBtn.disabled && thresholdMet) {
            handleSpin();
        }
    };

    const cancelDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.classList.remove('lever-active');
        leverArm.classList.remove('no-transition');
        leverArm.style.transform = '';
    };

    // Mouse Events
    leverControl.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('mouseup', finishPull);

    // Touch Events
    leverControl.addEventListener('touchstart', (e) => {
        startDrag(e);
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault(); // Prevent scrolling while pulling the lever
            moveDrag(e);
        }
    }, { passive: false });
    
    document.addEventListener('touchend', finishPull);
}

function updatePaytable() {
    const tableBody = document.getElementById('symbol-stats-body');
    const isLuckActive = activeLuck > 0;
    const isDoubleActive = activeDouble > 0;

    let tempSymbols = symbols.map(s => {
        if (isLuckActive) {
            if (s.char === '🍒') return { ...s, weight: 7 };
            if (s.char === '🍋') return { ...s, weight: 40 };
            if (s.char === '🍊') return { ...s, weight: 25 };
            if (s.char === '🍇') return { ...s, weight: 15 };
            if (s.char === '🔔') return { ...s, weight: 10 };
        }
        return s;
    });

    const totalWeight = tempSymbols.reduce((acc, s) => acc + s.weight, 0);
    tableBody.innerHTML = '';
    let theoreticalRTP = 0;
    let totalChance = 0;
    let totalHit3Chance = 0;

    tempSymbols.forEach(s => {
        const p = s.weight / totalWeight;
        const chanceVal = p * 100;
        const chance = chanceVal.toFixed(0);
        totalChance += chanceVal;

        const p3 = Math.pow(p, 3);
        const hit3ChanceVal = p3 * 100;
        const hit3Chance = hit3ChanceVal.toFixed(3);
        totalHit3Chance += hit3ChanceVal;

        const effectiveMultiplier = isDoubleActive ? s.multiplier * 2 : s.multiplier;
        const rtpContribVal = p3 * effectiveMultiplier;
        theoreticalRTP += rtpContribVal;
        const rtpContrib = (rtpContribVal * 100).toFixed(2);

        // Determine specific column styles based on active boosts
        const isSymbolBoosted = isLuckActive && s.char !== '🍒' && s.char !== '7️⃣';
        const luckStyle = isSymbolBoosted ? 'style="color: #0f0; font-weight: bold;"' : '';
        const doubleStyle = isDoubleActive ? 'style="color: var(--gold); font-weight: bold;"' : '';
        const mixedStyle = 'style="color: #8cda21; font-weight: bold;"';

        tableBody.innerHTML += `
            <tr>
                <td>${s.char}</td>
                <td ${luckStyle}>${chance}%</td>
                <td ${luckStyle}>${hit3Chance}%</td>
                <td ${doubleStyle}>${s.multiplier}x${(isDoubleActive) ? '*2' : ''}</td>
                <td ${(isSymbolBoosted && isDoubleActive) ? mixedStyle : (doubleStyle || luckStyle)}>${rtpContrib}%</td>
            </tr>`;
    });

    const luckStyle = isLuckActive ? 'style="color: #0f0; font-weight: bold;"' : '';
    const doubleStyle = isDoubleActive ? 'style="color: var(--gold); font-weight: bold;"' : '';
    const mixedStyle = 'style="color: #8cda21; font-weight: bold;"';
    const isBothActive = isLuckActive && isDoubleActive;

    // Add bonus row for fun
    tableBody.innerHTML += `<tr style="border-top: 1px solid #333; font-weight: bold;"><td colspan="5" data-tooltip="Reward redeemable only once one day. Only valid if hit while luck boost is not active">7️⃣ bonus: Tio will go to Philippines</td></tr>`;
    
    // Add Total RTP row
    tableBody.innerHTML += `
        <tr style="border-top: 1px solid #333; font-weight: bold;">
            <td data-tooltip="Theoretical totals for the game parameters.">Sum</td>
            <td>${totalChance.toFixed(0)}%</td>
            <td>${totalHit3Chance.toFixed(3)}%</td>
            <td></td>
            <td ${isBothActive ? mixedStyle : (doubleStyle || luckStyle)}>${(theoreticalRTP * 100).toFixed(2)}%</td>
        </tr>`;
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
        const strip = document.getElementById(`strip-${i}`);
        const firstSymbol = strip.querySelector('.symbol');
        if (firstSymbol) {
            // Position the reel at the end of the strip immediately
            const symbolHeight = firstSymbol.getBoundingClientRect().height;
            const distance = (STRIP_LENGTH - 3) * symbolHeight;
            strip.style.transform = `translateY(-${distance}px)`;
        }
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
        // Boost all symbol weights temporarily except Cherry and 7
        tempSymbols = symbols.map(s => {
            if (s.char === '🍋') return { ...s, weight: 40 };
            if (s.char === '🍊') return { ...s, weight: 30 };
            if (s.char === '🍇') return { ...s, weight: 25 };
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

    // Fallback for button click or auto-spin
    const lever = document.getElementById('lever-control');
    const arm = lever.querySelector('.lever-arm');
    
    // Play mechanical sounds for programmatic pull
    leverSound.currentTime = 0;
    leverSound.play().catch(() => {});
    
    arm.style.transform = 'rotateX(120deg)';
    
    setTimeout(() => {
        clinkSound.currentTime = 0;
        clinkSound.play().catch(() => {});
        arm.style.transform = '';
    }, 400);
    
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
        if (!spinBtn.disabled) handleLeverPull();
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
    const speedActive = activeSpeed > 0;

    // Consume power-ups
    if (activeLuck > 0) activeLuck--;
    if (activeDouble > 0) activeDouble--;
    if (activeSpeed > 0) activeSpeed--;
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
    const anims = results.map((reelSymbols, i) => animateReel(i, reelSymbols, results, activeLines, speedActive));
    await Promise.all(anims);

    // Calculate Outcome
    let totalWin = 0;
    let stopAutoOnBigWin = false;
    // Check each horizontal line (row 0, 1, 2)
    for (let row = 0; row < 3; row++) {
        if (activeLines[row]) { // Only payout if the line is active
            if (results[0][row].char === results[1][row].char && 
                results[1][row].char === results[2][row].char) {
                const winChar = results[0][row].char;
                totalWin += results[0][row].multiplier * currentBet;

                // Pause auto spin if we hit a high-value 3-of-a-kind
                if (winChar === '🔔' || winChar === '7️⃣') {
                    stopAutoOnBigWin = true;
                }

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
        
        // if (totalWin >= 100) triggerBigWinCelebration();

        triggerBigWinCelebration();

        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 2500);
    }

    updateStats();
    logHistory(results, totalWin, activeLines, spinCount);
    btn.disabled = false;
    document.getElementById('bet-inc').disabled = false;
    document.getElementById('bet-dec').disabled = false;

    if (stopAutoOnBigWin && isAutoSpinning) {
        toggleAutoSpin();
    }

    if (isAutoSpinning) {
        setTimeout(handleLeverPull, 1000); // 1-second delay between automatic spins
    }
}

function animateReel(index, reelSymbols, allResults, activeLines, speedActive) {
    return new Promise(resolve => {
        const strip = document.getElementById(`strip-${index}`);
        // Dynamically calculate height to support responsive CSS
        const firstSymbol = strip.querySelector('.symbol');
        const symbolHeight = firstSymbol ? firstSymbol.getBoundingClientRect().height : 120;
        
        // CONTINUITY: Copy previous results from the bottom of the strip to the top
        // so they are visible when we instantly reset the transform.
        strip.children[0].innerText = strip.children[STRIP_LENGTH - 3].innerText;
        strip.children[1].innerText = strip.children[STRIP_LENGTH - 2].innerText;
        strip.children[2].innerText = strip.children[STRIP_LENGTH - 1].innerText;

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

        if (speedActive) {
            duration *= 0.5; // Double the spin speed
        }

        // Anticipation trigger: If the first two reels match symbols on an active payline,
        // the third reel spins longer to build suspense for a potential 3-of-a-kind.
        let isAnticipating = false;
        if (index === 2) {
            isAnticipating = activeLines.some((active, row) => 
                active && allResults[0][row].char === allResults[1][row].char
            );
            if (isAnticipating) {
                // Add anticipation delay (half the normal delay if speed is active)
                duration += speedActive ? 0.5 : 1.0; 
                
                // Apply win-glow to the first two reels after they finish spinning (2.5s)
                setTimeout(() => {
                    activeLines.forEach((active, row) => {
                        if (active && allResults[0][row].char === allResults[1][row].char) {
                            for (let i = 0; i < 2; i++) {
                                const targetStrip = document.getElementById(`strip-${i}`);
                                const symbolIndex = STRIP_LENGTH - 3 + row;
                                if (targetStrip && targetStrip.children[symbolIndex]) {
                                    targetStrip.children[symbolIndex].classList.add('win-glow');
                                }
                            }
                        }
                    });
                }, speedActive ? 1250 : 2500); // Sync with the second reel stopping
            }
        }

        strip.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        const distance = (STRIP_LENGTH - 3) * symbolHeight;
        strip.style.transform = `translateY(-${distance}px)`;

        // Play tension sound for the final reel after the first two have stopped,
        // provided slow-motion (anticipation) is active.
        if (index === 2 && isAnticipating) {
            setTimeout(() => {
                tensionSound.currentTime = 0;
                tensionSound.play().catch(() => {});
            }, speedActive ? 1250 : 2500); // Wait for the second reel (index 1) to finish
        }

        setTimeout(() => {
            if (index === 2) {
                tensionSound.pause();
                tensionSound.currentTime = 0;
            }
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

    document.getElementById('buy-double').innerText = activeDouble > 0 ? `50c: ${activeDouble}` : "50c";
    document.getElementById('buy-speed').innerText = activeSpeed > 0 ? `50c: ${activeSpeed}` : "50c";
    document.getElementById('buy-luck').innerText = activeLuck > 0 ? `50c: ${activeLuck}` : "50c";
    
    // Visual notification for Luck Boost
    const reelsFrame = document.getElementById('reels-frame');
    const luck = activeLuck > 0;
    const double = activeDouble > 0;
    const both = luck && double;

    reelsFrame.classList.toggle('both-boosts-active', both);
    reelsFrame.classList.toggle('luck-boost-active', luck && !both);
    reelsFrame.classList.toggle('double-win-active', double && !both);

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
    localStorage.setItem('slot_activeSpeed', activeSpeed);
    localStorage.setItem('slot_activeDouble', activeDouble);
}

function logHistory(res, win, activeLines, num) {
    const history = document.getElementById('history');
    const line1 = (activeLines[0] ? "" : "X ") + res[0][0].char + res[1][0].char + res[2][0].char;
    const line2 = (activeLines[1] ? "" : "X ") + res[0][1].char + res[1][1].char + res[2][1].char;
    const line3 = (activeLines[2] ? "" : "X ") + res[0][2].char + res[1][2].char + res[2][2].char;
    
    const entry = `Spin #${num}\n[${line1}]\n[${line2}] Payout: ${win}\n[${line3}]\n${"-".repeat(20)}\n`;
    history.value = entry + history.value;

    const lines = (history.value).split('\n');
    history.value = lines.slice(0, 50).join('\n');
}

function resetGame() {
    if (confirm("Are you sure you want to reset all progress and credits?")) {
        credits = 100;
        totalBet = 0;
        totalPayout = 0;
        currentBet = 1;
        activeLuck = 0;
        activeSpeed = 0;
        activeDouble = 0;
        updateStats();
    }
}

/**
 * Triggers a burst of falling gold coins across the screen
 */
function triggerBigWinCelebration() {
    const container = document.getElementById('coin-container');
    const coinCount = 60; // Total coins in the burst

    for (let i = 0; i < coinCount; i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.className = 'coin';
            const size = Math.random() * 20 + 15; // 15px to 35px
            coin.style.width = `${size}px`;
            coin.style.height = `${size}px`;
            coin.style.left = `${Math.random() * 100}vw`;
            coin.style.animationDuration = `${Math.random() * 2 + 2}s`; // 2s to 4s fall
            container.appendChild(coin);
            
            // Clean up DOM after animation
            setTimeout(() => coin.remove(), 4000);
        }, Math.random() * 2000); // Stagger the start times over 2 seconds
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