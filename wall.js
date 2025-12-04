// DOM Elements
const themeIcon = document.getElementById('theme-icon');
const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');
const digitalTime = document.getElementById('digital-time');
const digitalDate = document.getElementById('digital-date');
const particlesContainer = document.getElementById('particles');
const themeModeBtn = document.getElementById('theme-mode');
const glowModeBtn = document.getElementById('glow-mode');
const soundToggleBtn = document.getElementById('sound-toggle');
const fullscreenToggleBtn = document.getElementById('fullscreen-toggle');
const worldClockBtn = document.getElementById('world-clock-btn');
const alarmBtn = document.getElementById('alarm-btn');
const stopwatchBtn = document.getElementById('stopwatch-btn');
const timerBtn = document.getElementById('timer-btn');
const settingsBtn = document.getElementById('settings-btn');
const worldClocksPanel = document.getElementById('world-clocks');
const alarmPanel = document.getElementById('alarm-panel');
const stopwatchPanel = document.getElementById('stopwatch-panel');
const timerPanel = document.getElementById('timer-panel');
const settingsPanel = document.getElementById('settings-panel');
const tickSound = document.getElementById('tick-sound');
const alarmSound = document.getElementById('alarm-sound');

// Clock State
let is24HourFormat = true;
let isSoundEnabled = true;
let isGlowEnabled = true;
let isSmoothMotion = true;
let currentTheme = 'dark';
let currentGlowMode = 'normal';

// World Clocks Data
const worldClocks = [
    { city: 'New York', timezone: 'America/New_York' },
    { city: 'London', timezone: 'Europe/London' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo' },
    { city: 'Sydney', timezone: 'Australia/Sydney' },
    { city: 'Dubai', timezone: 'Asia/Dubai' },
    { city: 'Paris', timezone: 'Europe/Paris' }
];

// Alarms
let alarms = JSON.parse(localStorage.getItem('quantumAlarms')) || [];
let activeAlarms = [];

// Stopwatch
let stopwatchInterval;
let stopwatchTime = 0;
let stopwatchRunning = false;
let lapTimes = [];

// Timer
let timerInterval;
let timerTime = 0;
let timerRunning = false;
let originalTimerTime = 0;

// Initialize clock
function initClock() {
    createParticles();
    updateClock();
    setInterval(updateClock, 1000);
    loadSettings();
    updateWorldClocks();
    updateAlarmList();
   
    // Check for saved theme
    if (localStorage.getItem('clockTheme') === 'light') {
        toggleTheme();
    }
   
    if (localStorage.getItem('clockSound') === 'off') {
        toggleSound();
    }
   
    // Set up event listeners
    setupEventListeners();
}

// Update clock hands and digital display
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
   
    // Calculate hand rotations
    const secondRotation = (seconds * 6) + (milliseconds * 0.006);
    const minuteRotation = (minutes * 6) + (seconds * 0.1);
    const hourRotation = (hours % 12) * 30 + (minutes * 0.5);
   
    // Apply rotations with smooth transition if enabled
    if (isSmoothMotion) {
        secondHand.style.transition = 'transform 0.5s cubic-bezier(0.4, 2.3, 0.8, 1)';
        minuteHand.style.transition = 'transform 0.5s cubic-bezier(0.4, 2.3, 0.8, 1)';
        hourHand.style.transition = 'transform 0.5s cubic-bezier(0.4, 2.3, 0.8, 1)';
    } else {
        secondHand.style.transition = 'none';
        minuteHand.style.transition = 'none';
        hourHand.style.transition = 'none';
    }
   
    secondHand.style.transform = `translateX(-50%) rotate(${secondRotation}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteRotation}deg)`;
    hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
   
    // Update digital display
    updateDigitalDisplay(now);
   
    // Play tick sound if enabled
    if (isSoundEnabled && seconds % 5 === 0) {
        playTickSound();
    }
   
    // Check alarms
    checkAlarms(now);
   
    // Update world clocks
    updateWorldClocks();
}

// Update digital time display
function updateDigitalDisplay(now) {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
   
    let displayHours = hours;
    let amPm = '';
   
    if (!is24HourFormat) {
        displayHours = hours % 12 || 12;
        amPm = hours >= 12 ? ' PM' : ' AM';
    }
   
    const timeString = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}${amPm}`;
    digitalTime.textContent = timeString;
   
    // Update date
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    digitalDate.textContent = now.toLocaleDateString('en-US', options);
}

// Toggle between dark and light themes
function toggleTheme() {
    document.body.classList.toggle('light-theme');
   
    if (document.body.classList.contains('light-theme')) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        currentTheme = 'light';
        localStorage.setItem('clockTheme', 'light');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        currentTheme = 'dark';
        localStorage.setItem('clockTheme', 'dark');
    }
   
    // Update particles for new theme
    createParticles();
}

// Toggle glow effects
function toggleGlow() {
    isGlowEnabled = !isGlowEnabled;
   
    if (isGlowEnabled) {
        document.documentElement.style.setProperty('--accent-glow', currentTheme === 'dark' ? 'rgba(0, 255, 157, 0.5)' : 'rgba(108, 99, 255, 0.3)');
        glowModeBtn.innerHTML = '<i class="fas fa-lightbulb"></i><span>Glow</span>';
    } else {
        document.documentElement.style.setProperty('--accent-glow', 'transparent');
        glowModeBtn.innerHTML = '<i class="fas fa-lightbulb"></i><span>No Glow</span>';
    }
}

// Toggle sound effects
function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
   
    if (isSoundEnabled) {
        soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i><span>Sound</span>';
        localStorage.setItem('clockSound', 'on');
    } else {
        soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i><span>Muted</span>';
        localStorage.setItem('clockSound', 'off');
    }
}

// Toggle fullscreen mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
        fullscreenToggleBtn.innerHTML = '<i class="fas fa-compress"></i><span>Exit</span>';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullscreenToggleBtn.innerHTML = '<i class="fas fa-expand"></i><span>Fullscreen</span>';
        }
    }
}

// Play tick sound
function playTickSound() {
    if (isSoundEnabled) {
        tickSound.currentTime = 0;
        tickSound.play().catch(e => console.log("Audio play failed:", e));
    }
}

// Create floating particles
function createParticles() {
    particlesContainer.innerHTML = '';
    const particleCount = 50;
   
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
       
        // Random properties
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;
       
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
       
        // Theme-based color
        if (document.body.classList.contains('light-theme')) {
            particle.style.background = 'var(--accent-color)';
        }
       
        particlesContainer.appendChild(particle);
    }
}

// Update world clocks display
function updateWorldClocks() {
    const worldClocksList = document.getElementById('world-clocks-list');
    worldClocksList.innerHTML = '';
   
    worldClocks.forEach(clock => {
        const now = new Date();
        const options = {
            timeZone: clock.timezone,
            hour12: !is24HourFormat,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
       
        const timeString = now.toLocaleTimeString('en-US', options);
        const timezoneString = clock.timezone.split('/')[1];
       
        const clockItem = document.createElement('div');
        clockItem.className = 'world-clock-item';
        clockItem.innerHTML = `
            <div class="world-clock-info">
                <div class="world-clock-city">${clock.city}</div>
                <div class="world-clock-timezone">${timezoneString}</div>
            </div>
            <div class="world-clock-time">${timeString}</div>
        `;
       
        worldClocksList.appendChild(clockItem);
    });
}

// Update alarm list
function updateAlarmList() {
    const alarmList = document.getElementById('alarm-list');
    alarmList.innerHTML = '';
   
    alarms.forEach((alarm, index) => {
        const alarmItem = document.createElement('div');
        alarmItem.className = 'alarm-item';
        alarmItem.innerHTML = `
            <div class="alarm-info">
                <div class="alarm-time">${alarm.time}</div>
                <div class="alarm-label">${alarm.label || 'Alarm'}</div>
            </div>
            <div class="alarm-actions">
                <button class="alarm-action-btn toggle-alarm" data-index="${index}">
                    <i class="fas ${alarm.active ? 'fa-bell' : 'fa-bell-slash'}"></i>
                </button>
                <button class="alarm-action-btn delete-alarm" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
       
        alarmList.appendChild(alarmItem);
    });
   
    // Add event listeners for alarm actions
    document.querySelectorAll('.toggle-alarm').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('.toggle-alarm').dataset.index;
            toggleAlarm(index);
        });
    });
   
    document.querySelectorAll('.delete-alarm').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('.delete-alarm').dataset.index;
            deleteAlarm(index);
        });
    });
}

// Check alarms
function checkAlarms(now) {
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
   
    alarms.forEach((alarm, index) => {
        if (alarm.active && alarm.time === currentTime && !activeAlarms.includes(index)) {
            activeAlarms.push(index);
            triggerAlarm(index);
        }
    });
}

// Trigger alarm
function triggerAlarm(index) {
    if (isSoundEnabled) {
        alarmSound.play();
    }
   
    // Show notification
    if (Notification.permission === 'granted') {
        new Notification('Alarm!', {
            body: `It's ${alarms[index].time} - ${alarms[index].label || 'Alarm'}`,
            icon: '/favicon.ico'
        });
    }
   
    // Flash the alarm in the list
    const alarmItems = document.querySelectorAll('.alarm-item');
    if (alarmItems[index]) {
        alarmItems[index].style.animation = 'pulse 1s infinite';
        setTimeout(() => {
            alarmItems[index].style.animation = '';
        }, 5000);
    }
}

// Toggle alarm active state
function toggleAlarm(index) {
    alarms[index].active = !alarms[index].active;
    localStorage.setItem('quantumAlarms', JSON.stringify(alarms));
    updateAlarmList();
}

// Delete alarm
function deleteAlarm(index) {
    alarms.splice(index, 1);
    localStorage.setItem('quantumAlarms', JSON.stringify(alarms));
    updateAlarmList();
}

// Add new alarm
function addAlarm() {
    const time = prompt('Enter alarm time (HH:MM):', '07:00');
    if (time && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
        const label = prompt('Enter alarm label (optional):', 'Wake up');
        alarms.push({
            time,
            label: label || 'Alarm',
            active: true
        });
        localStorage.setItem('quantumAlarms', JSON.stringify(alarms));
        updateAlarmList();
    } else if (time) {
        alert('Please enter a valid time in HH:MM format');
    }
}

// Stopwatch functions
function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        const startTime = Date.now() - stopwatchTime;
       
        stopwatchInterval = setInterval(() => {
            stopwatchTime = Date.now() - startTime;
            updateStopwatchDisplay();
        }, 10);
       
        document.getElementById('start-stopwatch').textContent = 'Pause';
    } else {
        pauseStopwatch();
    }
}

function pauseStopwatch() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    document.getElementById('start-stopwatch').textContent = 'Resume';
}

function resetStopwatch() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    lapTimes = [];
    updateStopwatchDisplay();
    updateLapTimes();
    document.getElementById('start-stopwatch').textContent = 'Start';
}

function lapStopwatch() {
    if (stopwatchRunning) {
        lapTimes.push(stopwatchTime);
        updateLapTimes();
    }
}

function updateStopwatchDisplay() {
    const hours = Math.floor(stopwatchTime / 3600000);
    const minutes = Math.floor((stopwatchTime % 3600000) / 60000);
    const seconds = Math.floor((stopwatchTime % 60000) / 1000);
    const milliseconds = Math.floor((stopwatchTime % 1000) / 10);
   
    document.getElementById('stopwatch-display').textContent =
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

function updateLapTimes() {
    const lapTimesContainer = document.getElementById('lap-times');
    lapTimesContainer.innerHTML = '';
   
    lapTimes.forEach((lapTime, index) => {
        const hours = Math.floor(lapTime / 3600000);
        const minutes = Math.floor((lapTime % 3600000) / 60000);
        const seconds = Math.floor((lapTime % 60000) / 1000);
        const milliseconds = Math.floor((lapTime % 1000) / 10);
       
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `
            <span>Lap ${index + 1}</span>
            <span>${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}</span>
        `;
       
        lapTimesContainer.appendChild(lapItem);
    });
}

// Timer functions
function startTimer() {
    if (!timerRunning && timerTime > 0) {
        timerRunning = true;
        originalTimerTime = timerTime;
       
        timerInterval = setInterval(() => {
            timerTime -= 1000;
            updateTimerDisplay();
           
            if (timerTime <= 0) {
                timerComplete();
            }
        }, 1000);
       
        document.getElementById('start-timer').textContent = 'Pause';
    } else if (timerRunning) {
        pauseTimer();
    }
}

function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    document.getElementById('start-timer').textContent = 'Resume';
}

function resetTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    timerTime = originalTimerTime || 25 * 60 * 1000; // Default to 25 minutes
    updateTimerDisplay();
    document.getElementById('start-timer').textContent = 'Start';
}

function timerComplete() {
    timerRunning = false;
    clearInterval(timerInterval);
   
    if (isSoundEnabled) {
        alarmSound.play();
    }
   
    // Show notification
    if (Notification.permission === 'granted') {
        new Notification('Timer Complete!', {
            body: 'Your timer has finished.',
            icon: '/favicon.ico'
        });
    }
   
    alert('Timer complete!');
    resetTimer();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerTime / 60000);
    const seconds = Math.floor((timerTime % 60000) / 1000);
   
    document.getElementById('timer-display').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function setTimer(minutes) {
    timerTime = minutes * 60 * 1000;
    updateTimerDisplay();
    resetTimer();
}

// Load settings from localStorage
function loadSettings() {
    const savedFormat = localStorage.getItem('timeFormat');
    if (savedFormat) {
        is24HourFormat = savedFormat === '24h';
        document.getElementById('time-format').value = savedFormat;
    }
   
    const savedSmoothMotion = localStorage.getItem('smoothMotion');
    if (savedSmoothMotion !== null) {
        isSmoothMotion = savedSmoothMotion === 'true';
        document.getElementById('smooth-motion').checked = isSmoothMotion;
    }
   
    const savedShowDigital = localStorage.getItem('showDigital');
    if (savedShowDigital !== null) {
        document.getElementById('show-digital').checked = savedShowDigital === 'true';
        document.querySelector('.digital-display').style.display =
            savedShowDigital === 'true' ? 'block' : 'none';
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('timeFormat', document.getElementById('time-format').value);
    localStorage.setItem('smoothMotion', document.getElementById('smooth-motion').checked);
    localStorage.setItem('showDigital', document.getElementById('show-digital').checked);
   
    // Apply settings
    is24HourFormat = document.getElementById('time-format').value === '24h';
    isSmoothMotion = document.getElementById('smooth-motion').checked;
    document.querySelector('.digital-display').style.display =
        document.getElementById('show-digital').checked ? 'block' : 'none';
}

// Set up event listeners
function setupEventListeners() {
    // Theme and control buttons
    themeIcon.addEventListener('click', toggleTheme);
    themeModeBtn.addEventListener('click', toggleTheme);
    glowModeBtn.addEventListener('click', toggleGlow);
    soundToggleBtn.addEventListener('click', toggleSound);
    fullscreenToggleBtn.addEventListener('click', toggleFullscreen);
   
    // Navigation buttons
    worldClockBtn.addEventListener('click', () => togglePanel(worldClocksPanel));
    alarmBtn.addEventListener('click', () => togglePanel(alarmPanel));
    stopwatchBtn.addEventListener('click', () => togglePanel(stopwatchPanel));
    timerBtn.addEventListener('click', () => togglePanel(timerPanel));
    settingsBtn.addEventListener('click', () => togglePanel(settingsPanel));
   
    // Panel close buttons
    document.getElementById('close-world-clocks').addEventListener('click', () => togglePanel(worldClocksPanel));
    document.getElementById('close-alarm').addEventListener('click', () => togglePanel(alarmPanel));
    document.getElementById('close-stopwatch').addEventListener('click', () => togglePanel(stopwatchPanel));
    document.getElementById('close-timer').addEventListener('click', () => togglePanel(timerPanel));
    document.getElementById('close-settings').addEventListener('click', () => togglePanel(settingsPanel));
   
    // Stopwatch controls
    document.getElementById('start-stopwatch').addEventListener('click', startStopwatch);
    document.getElementById('lap-stopwatch').addEventListener('click', lapStopwatch