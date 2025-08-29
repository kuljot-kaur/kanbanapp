# 🎮 Pixel Quest Kanban Board

A retro-style, gamified Kanban board application with pixel art aesthetics, real-time collaboration, and RPG-inspired progression mechanics.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.12.2-orange)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4.4-green)

## ✨ Features

### 🎯 Core Kanban Functionality
- **Multi-Board Management**: Create, join, and switch between multiple project boards
- **Task Management**: Add, edit, move, and delete tasks across columns (To Do, In Progress, Done)
- **Real-time Collaboration**: Live updates across all team members using Firebase Firestore
- **Board Sharing**: Share board codes with team members for instant collaboration

### 🎮 Gamification Elements
- **XP System**: Earn experience points for completing tasks and achieving milestones
- **Level Progression**: Advance through levels with visual celebrations and sound effects
- **Achievement Animations**: Satisfying pixel art animations for task completion
- **Sound Effects**: Retro gaming audio feedback (with mute option)

### 🎨 Pixel Art Design
- **Retro Aesthetic**: Complete pixel art UI with custom animations
- **Press Start 2P Font**: Authentic retro gaming typography
- **Animated Backgrounds**: Dynamic grid patterns and visual effects
- **Custom Icons**: Hand-crafted pixel art icons for all interface elements

### 🔐 Authentication & Security
- **Google Authentication**: Secure sign-in with Google accounts
- **User Profiles**: Persistent user data and progress tracking
- **Firestore Security**: Proper database rules for data protection

### 📱 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Onboarding**: Interactive tutorial for new users
- **Keyboard Shortcuts**: Efficient task management with hotkeys
- **Offline Support**: IndexedDB persistence for offline functionality

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore and Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-kanban-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Google provider
   - Enable Firestore Database
   - Copy your Firebase config and update `src/App.jsx`:

   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0**: Modern UI library with hooks
- **Vite 5.2.0**: Fast build tool and dev server
- **Tailwind CSS 3.4.4**: Utility-first CSS framework
- **Tone.js 15.0.4**: Web audio framework for sound effects

### Backend & Database
- **Firebase 10.12.2**: Backend-as-a-Service platform
- **Firestore**: NoSQL real-time database
- **Firebase Auth**: Authentication service

### Development Tools
- **ESLint**: Code linting and quality checks
- **PostCSS**: CSS processing with Autoprefixer
- **Vite Plugin React**: React support for Vite

## 📁 Project Structure

```
my-kanban-app/
├── src/
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application-specific styles
│   ├── index.css         # Global styles and pixel art classes
│   ├── main.jsx          # Application entry point
│   └── assets/
│       └── react.svg     # React logo
├── public/
│   └── vite.svg          # Vite logo
├── eslint.config.js      # ESLint configuration
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
└── package.json          # Project dependencies
```

## 🎮 How to Play

### Getting Started
1. **Sign in** with your Google account
2. **Complete the onboarding** tutorial to learn the basics
3. **Create your first board** or join an existing one with a board code

### Managing Tasks
- **Add Task**: Click the "+" button in any column
- **Edit Task**: Click the edit icon on any task
- **Move Tasks**: Drag and drop between columns (To Do → In Progress → Done)
- **Delete Tasks**: Use the delete icon (careful - this action cannot be undone!)

### Collaboration
- **Share Boards**: Copy the board code and share with team members
- **Real-time Updates**: See changes instantly as teammates work
- **User Identification**: Each user's tasks are color-coded

### Leveling Up
- **Complete Tasks**: Earn XP for moving tasks to "Done"
- **Achieve Milestones**: Get bonus XP for consecutive completions
- **Level Celebrations**: Enjoy epic animations when you level up!

## ⚙️ Configuration

### Firestore Rules
Set up proper security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /boards/{boardId} {
      allow read, write: if request.auth != null && 
        (resource.data.createdBy == request.auth.uid || 
         request.auth.uid in resource.data.members);
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Tailwind Configuration
The project includes custom Tailwind configuration for pixel art styling:

```javascript
// tailwind.config.js
theme: {
  extend: {
    fontFamily: {
      'pixel': ['"Press Start 2P"', 'monospace'],
    },
    animation: {
      'bounce-in': 'bounceIn 0.4s ease-out forwards',
      'fade-in': 'fadeIn 0.3s ease-out forwards',
      'level-up': 'levelUp 2s cubic-bezier(0.25, 1, 0.5, 1) forwards',
    }
  }
}
```

## 🎨 Customization

### Adding New Themes
1. Define new color schemes in `tailwind.config.js`
2. Create corresponding CSS classes in `src/index.css`
3. Add theme switching logic in `App.jsx`

### Custom Sound Effects
1. Add audio files to `public/sounds/` directory
2. Import and configure in `App.jsx` using Tone.js
3. Trigger sounds on specific actions

### New Animations
1. Define keyframes in the `<style>` section of `App.jsx`
2. Create corresponding CSS classes
3. Apply to components with Tailwind utilities

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint checks

## 📚 Dependencies

### Production Dependencies
- **react**: UI library
- **react-dom**: React DOM bindings
- **firebase**: Backend services
- **tone**: Web audio framework

### Development Dependencies
- **vite**: Build tool
- **tailwindcss**: CSS framework
- **eslint**: Code linting
- **autoprefixer**: CSS vendor prefixes

## 🐛 Troubleshooting

### Common Issues

**Build fails with Tailwind CSS**
```bash
# Downgrade to compatible version
npm install tailwindcss@3.3.3
```

**Firebase authentication errors**
- Ensure Google Auth is enabled in Firebase Console
- Check that domain is added to authorized domains
- Verify Firebase config values

**Audio not playing**
- Check browser audio permissions
- Ensure user interaction before playing sounds
- Test with mute toggle

**Real-time updates not working**
- Verify Firestore rules allow read/write access
- Check network connectivity
- Ensure user is authenticated

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **Press Start 2P Font**: Google Fonts for the retro typography
- **Tone.js**: For excellent web audio capabilities
- **Firebase**: For robust backend infrastructure
- **Tailwind CSS**: For utility-first styling approach
- **React**: For the amazing component architecture

## 🔮 Future Features

- [ ] Dark/Light theme toggle
- [ ] Task templates and automation
- [ ] Advanced filtering and search
- [ ] Time tracking and analytics
- [ ] Mobile app (React Native)
- [ ] Slack/Discord integrations
- [ ] Custom avatar system
- [ ] Achievement badges
- [ ] Team leaderboards

---

**Made with ❤️ and lots of ☕ by the development team**

*Start your pixel quest today and level up your productivity!*
