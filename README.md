# Plan My Day 🚀

A smarter version of Todoist that automatically plans your day. This is an MVP prototype built to validate the core experience of intelligent daily scheduling.

## ✨ Core Features
- **Intelligent Planner**: Automatically schedules your tasks based on priority (High → Medium → Low).
- **Smart Time Blocking**: Starts your day at 9:00 AM and assigns realistic time slots.
- **Auto-Breaks**: Automatically inserts 15-minute breaks after every 2 tasks to maintain productivity.
- **Overflow Management**: Identifies tasks that don't fit into a standard 8-hour day and moves them to "Later".
- **Modern UI**: Clean, minimal, and centered layout built with React and Tailwind CSS.

## 🛠️ Tech Stack
- **React 19** (Vite)
- **TypeScript**
- **Tailwind CSS v3**
- **Lucide React** (for icons)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/khawajayy/ToDoDoDoo.git
   cd ToDoDoDoo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

## 🧠 Planning Logic
The app uses a priority-based scheduling algorithm:
1. **Sort**: Tasks are sorted by Priority (High → Medium → Low).
2. **Assign**: Time slots are assigned sequentially starting from 9:00 AM.
3. **Breaks**: A 15-minute break is inserted after every 2 tasks.
4. **Limits**: Scheduling stops after 8 total hours (approx. 5:00 PM).
5. **Overflow**: Any remaining tasks are shown in the "Overflow" section.

## 🧪 Validation Goal
This MVP aims to answer: **Do users find this automated planning feature useful?**

---
Built with ❤️ for rapid validation.
