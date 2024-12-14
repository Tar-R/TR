// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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
