// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZIm5-FIF60sUPsCFY4AWw3oiMOxnW3W8",
  authDomain: "study-tracker-46744.firebaseapp.com",
  databaseURL: "https://study-tracker-46744-default-rtdb.firebaseio.com",
  projectId: "study-tracker-46744",
  storageBucket: "study-tracker-46744.firebasestorage.app",
  messagingSenderId: "190293942527",
  appId: "1:190293942527:web:57a6b4cb28b8d1adae2cca"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

// Utility Functions
function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

// Timer Functionality
class Timer {
  constructor(user) {
    this.user = user;
    this.startTime = null;
    this.intervalId = null;
    this.totalTime = 0;

    this.startBtn = document.getElementById(`${user}-start-btn`);
    this.stopBtn = document.getElementById(`${user}-stop-btn`);
    this.timerDisplay = document.getElementById(`${user}-timer-display`);
    this.entriesList = document.getElementById(`${user}-entries`);
    this.totalTimeDisplay = document.getElementById(`${user}-total-time`);

    this.initListeners();
    this.syncEntries();
  }

  startTimer() {
    if (this.intervalId) return;

    this.startTime = Date.now();
    this.intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.timerDisplay.textContent = formatTime(elapsed);
    }, 1000);
  }

  stopTimer() {
    if (!this.intervalId) return;

    clearInterval(this.intervalId);
    this.intervalId = null;

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);

    this.totalTime += minutes;
    this.timerDisplay.textContent = '00:00:00';
    this.saveEntry(minutes);
  }

  saveEntry(minutes) {
    const ref = db.ref(`timers/${this.user}`).push();
    ref.set({ minutes, timestamp: Date.now() });
  }

  syncEntries() {
    const ref = db.ref(`timers/${this.user}`);
    ref.on('child_added', (snapshot) => {
      const { minutes } = snapshot.val();
      const entry = document.createElement('li');
      entry.textContent = `${minutes} minutes`;
      this.entriesList.appendChild(entry);

      // Recalculate total time
      this.totalTime += minutes;
      this.totalTimeDisplay.textContent = this.totalTime;
    });
  }

  initListeners() {
    this.startBtn.addEventListener('click', () => this.startTimer());
    this.stopBtn.addEventListener('click', () => this.stopTimer());
  }
}

// Initialize Timers
new Timer('hima');
new Timer('tarush');
