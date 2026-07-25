# 📚 Semester Study Tracker & Progress Dashboard

A sleek, responsive, single-page web application designed for students to organize, track, and optimize their academic study schedules across a 14-week semester. Built with modern UI/UX principles, glassmorphism design elements, localized data persistence via `localStorage`, and touch-friendly fluid navigation.

---

## ✨ Features

- **📱 Fully Responsive Design**: Seamlessly adjusts from wide desktop screens to mobile and tablet viewports with a slim `5px` outer margin layout for maximum screen real estate.
- **🎨 Glassmorphism Dark Theme**: Aesthetic UI featuring desaturated gradients, semi-transparent backdrop filters (`backdrop-filter: blur`), dark headers, and dynamic glowing progress indicators.
- **📍 Sticky Navigation Axis**:
  - **Subject Column**: Pinched to the left side so subject titles remain visible during horizontal scrolling.
  - **Progress Bar Column**: Pinched to the right side for immediate visibility of completion metrics.
  - **Header Row**: Frozen at the top during vertical table navigation.
- **🎯 Custom Dark Scrollbars**: Tailored CSS webkit and Firefox scrollbar styling that blends with the dark palette rather than standard light browser scrollbars.
- **🖱️ Enhanced Scrolling & Drag Interaction**:
  - Direct Mouse Drag-to-Scroll support across the table interface.
  - Vertical-to-Horizontal Mouse Wheel redirection (`Shift + Scroll` or natural wheel movement).
  - Touch-swipe acceleration support on mobile/tablet devices.
- **💾 LocalStorage Persistence**: Checkbox states persist across sessions without requiring a backend database or user login.
- **📊 Real-time Progress Tracking**: Automatically calculates percentage completion based on total required sessions ($14\text{ weeks} \times 3\text{ sessions} = 42\text{ checkpoints per subject}$). Dynamic gradient bars change state upon reaching 100% completion.

---

## 📖 Curriculum Breakdown & Modules

The application is pre-configured for **6 Core Subjects** structured across **14 Weeks**, with **3 target study sessions per week**:

1. 🗄️ **Database**
2. 🌐 **Networking**
3. 📁 **Project Management**
4. 🎨 **UI / UX Design**
5. 🛡️ **Quality Assurance**
6. 💻 **Programming Project**

---

## 🛠️ Tech Stack & Requirements

- **HTML5**: Structural semantic layout.
- **CSS3**: Custom CSS variables, Flexbox, Sticky Positioning, CSS Glassmorphism, CSS Custom Scrollbars, Keyframe Animations.
- **JavaScript (Vanilla ES6+)**: DOM Manipulation, Event Handling, Drag-to-Scroll Logic, `localStorage` API.
- **External Dependencies**: None (Zero third-party libraries/frameworks required).

---

## 🚀 Local Setup & Installation

1. Clone the repository or download the source code:
   ```bash
   git clone https://github.com/your-username/semester-study-tracker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd semester-study-tracker
   ```
3. Open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

---

## 🌐 Deploying to GitHub Pages

1. Create a new public repository on GitHub (e.g., `semester-study-tracker`).
2. Upload the `index.html` file to the root directory of the `main` or `master` branch.
3. On GitHub, navigate to **Settings** > **Pages** (under Code and automation).
4. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Choose `main` (or `master`) branch and set the folder to `/ (root)`.
5. Click **Save**. Your web application will be live at:
   `https://<your-username>.github.io/<repository-name>/`

---

## 📂 Project Structure

```text
semester-study-tracker/
└── index.html        # Monolithic Single-Page Application (HTML, CSS, JS)
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
