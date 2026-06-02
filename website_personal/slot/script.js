let currentBet = 1;
const SYMBOL_HEIGHT = 120;
const STRIP_LENGTH = 30; // Number of symbols in the spin animation

let credits = localStorage.getItem('slot_credits') !== null ? parseFloat(localStorage.getItem('slot_credits')) : 10;
let totalBet = localStorage.getItem('slot_totalBet') !== null ? parseFloat(localStorage.getItem('slot_totalBet')) : 0;
let totalPayout = localStorage.getItem('slot_totalPayout') !== null ? parseFloat(localStorage.getItem('slot_totalPayout')) : 0;
let spinCount = localStorage.getItem('slot_spinCount') !== null ? parseInt(localStorage.getItem('slot_spinCount')) : 0;

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
    document.getElementById('bet-inc').addEventListener('click', () => changeBet(1));
    document.getElementById('bet-dec').addEventListener('click', () => changeBet(-1));
    document.getElementById('reset-btn').addEventListener('click', resetGame);

    // Listen for line toggles to update the Total Cost UI immediately
    ['line-top', 'line-middle', 'line-bottom'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateStats);
    });

    setupDraggable(document.getElementById('history-section'), document.getElementById('history-toggle'));
    setupDraggable(document.getElementById('symbol-panel'), document.getElementById('stats-header'));
    setupDraggable(document.getElementById('session-panel'), document.getElementById('session-header'));
});

function setupDraggable(container, header) {
    let isDragging = false;
    let mouseMoved = false;
    let startX, startY, initialX, initialY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        mouseMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = container.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;

        // Transition to fixed position for free movement
        container.style.position = 'fixed';
        container.style.left = initialX + 'px';
        container.style.top = initialY + 'px';
        container.style.margin = '0';
        container.style.width = 'fit-content';
        container.style.bottom = 'auto';
        container.style.right = 'auto';
        container.style.zIndex = '1000';

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
        
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                mouseMoved = true;
                container.style.left = (initialX + dx) + 'px';
                container.style.top = (initialY + dy) + 'px';
            }
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    header.addEventListener('click', () => {
        if (!mouseMoved) {
            container.classList.toggle('minimized');
        }
    });
}

function updatePaytable() {
    const tableBody = document.getElementById('symbol-stats-body');
    const totalWeight = symbols.reduce((acc, s) => acc + s.weight, 0);
    tableBody.innerHTML = '';
    let theoreticalRTP = 0;

    symbols.forEach(s => {
        const p = s.weight / totalWeight;
        const chance = (p * 100).toFixed(0);
        const p3 = Math.pow(p, 3);
        const hit3Chance = (p3 * 100).toFixed(3);
        const rtpContribVal = p3 * s.multiplier;
        theoreticalRTP += rtpContribVal;
        const rtpContrib = (rtpContribVal * 100).toFixed(2);
        tableBody.innerHTML += `<tr><td>${s.char}</td><td>${chance}%</td><td>${hit3Chance}%</td><td>${s.multiplier}x</td><td>${rtpContrib}%</td></tr>`;
    });

    // Add Total RTP row
    tableBody.innerHTML += `<tr style="border-top: 1px solid #333; font-weight: bold;"><td colspan="4">Total</td><td>${(theoreticalRTP * 100).toFixed(2)}%</td></tr>`;
}

function changeBet(delta) {
    if (currentBet + delta >= 1) {
        currentBet += delta;
        updateStats();
    }
}

function initUI() {
    updatePaytable();
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

function getRandomSymbol() {
    const totalWeight = symbols.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of symbols) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
}

async function handleLeverPull() {
    const btn = document.getElementById('spin-btn');
    if (btn.disabled) return;

    const lever = document.getElementById('lever-control');
    lever.classList.add('pulling');
    
    // Brief delay to match the animation before starting spin
    setTimeout(() => lever.classList.remove('pulling'), 500);
    handleSpin();
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

    if (lineCount === 0) return alert("Select at least one line!");
    if (credits < totalCost) return alert("Insert more credits!");
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
    const results = [
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
    ];

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
            }
        }
    }

    credits += totalWin;
    totalPayout += totalWin;
    
    updateStats();
    logHistory(results, totalWin, activeLines, spinCount);
    btn.disabled = false;
    document.getElementById('bet-inc').disabled = false;
    document.getElementById('bet-dec').disabled = false;
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

        const duration = 2 + (index * 0.5); // Mechanical stagger
        strip.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        const distance = (STRIP_LENGTH - 3) * SYMBOL_HEIGHT;
        strip.style.transform = `translateY(-${distance}px)`;

        setTimeout(resolve, duration * 1000);
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

    // Calculate Actual RTP
    const actualRTP = totalBet > 0 ? (totalPayout / totalBet * 100).toFixed(2) : "0.00";
    document.getElementById('actual-rtp').innerText = actualRTP + "%";

    // Save state to localStorage
    localStorage.setItem('slot_credits', credits);
    localStorage.setItem('slot_totalBet', totalBet);
    localStorage.setItem('slot_totalPayout', totalPayout);
    localStorage.setItem('slot_spinCount', spinCount);
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
        credits = 10;
        totalBet = 0;
        totalPayout = 0;
        spinCount = 0;
        currentBet = 1;
        document.getElementById('history').value = '';
        updateStats();
        updatePaytable();
    }
}
