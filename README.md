# 🧠 Brainac - Learn Smarter, Learn Faster

A modern, production-ready edtech platform built with Next.js, TypeScript, Firebase, and PWA capabilities. Brainac offers personalized learning experiences with class-based content (Class 6 & Class 10), progress tracking, and comprehensive student dashboard.

![Brainac Banner](./public/og-image.jpg)

## 🎉 Phase 1: COMPLETED ✅

### 📚 Student Dashboard Implementation
- **Firebase Authentication** - Complete user management with trial system
- **Class-Based Content** - Separate course catalogs for Class 6 and Class 10
- **Video Learning Platform** - Streaming with progress tracking and playlists
- **Trial Management** - 3-day free trial with automatic restrictions
- **Progress Analytics** - Detailed learning statistics and course completion tracking
- **Student Profile** - Profile management and settings

### 🔥 Firebase Integration
- **Authentication System** - Email/password signup and login
- **Firestore Database** - Real-time data for courses, videos, and progress
- **Security Rules** - Proper user data protection
- **Trial System** - Time-limited access with payment integration ready

## ✨ Features

### 🎯 Core Features
- **Student Dashboard** - Comprehensive learning management interface
- **Class-Based Learning** - Content organized by academic class (6, 10)
- **Free Trial Access** - 3-day full access to all platform features  
- **Progress Tracking** - Detailed analytics, video completion, and course progress
- **Video Learning** - Streaming platform with progress saving and playlists
- **Course Management** - Browse, search, and access courses by class
- **Student Profile** - Profile settings and subscription management

### 🚀 Technical Features
- **Progressive Web App (PWA)** - Installable, offline-capable, native app-like experience
- **Firebase Backend** - Authentication, Firestore database, and real-time sync
- **Responsive Design** - Mobile-first design that works on all devices
- **Dark Mode** - Full dark/light theme support with system preference detection
- **Smooth Animations** - Framer Motion powered animations and transitions
- **SEO Optimized** - Complete meta tags, Open Graph, and Twitter Card support
- **Type Safety** - Full TypeScript implementation with strict typing
- **Modern Tech Stack** - Next.js 15, React 19, Tailwind CSS, Firebase v9+

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **PWA:** @ducanh2912/next-pwa
- **Themes:** next-themes
- **Build Tool:** Turbopack
- **Deployment:** Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/brainac.git
   cd brainac
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your Firebase credentials
   # Get credentials from https://console.firebase.google.com/
   ```

4. **Seed sample data** (Optional)
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable Authentication with Email/Password provider
   - Create Firestore database in production mode

2. **Configure Environment**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase project credentials
   - All required environment variables are documented in `.env.example`

3. **Firestore Collections**
   The app uses these collections:
   - `students` - User profiles with trial information
   - `courses` - Course catalog organized by class
   - `videos` - Course content with streaming URLs
   - `progress` - Student learning progress and completion data

## 🚀 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript checks
- `npm run seed` - Seed database with sample courses and videos

## 🏗️ Project Structure

```
brainac/
├── public/
│   ├── icons/              # PWA icons and favicons
│   ├── manifest.json       # PWA manifest
│   └── ...
├── src/
│   ├── app/
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout with metadata
│   │   ├── page.tsx        # Homepage
│   │   ├── dashboard/      # Student dashboard pages
│   │   ├── login/          # Login page with Firebase auth
│   │   └── signup/         # Signup page with Firebase auth
│   ├── components/
│   │   ├── DashboardLayout.tsx    # Main dashboard layout
│   │   ├── DashboardOverview.tsx  # Dashboard homepage
│   │   ├── CourseManager.tsx      # Course browsing and management
│   │   ├── VideoPlayer.tsx        # Video streaming with progress
│   │   ├── ProgressTracker.tsx    # Learning analytics
│   │   ├── StudentProfile.tsx     # Profile management
│   │   └── ...                    # Homepage components
│   ├── lib/
│   │   ├── firebase.ts     # Firebase configuration
│   │   ├── auth.ts         # Authentication services
│   │   ├── firestore.ts    # Database operations
│   │   └── seedData.ts     # Sample data for testing
│   └── types/
│       └── index.ts        # TypeScript interfaces
├── scripts/
│   └── seed.ts            # Data seeding script
├── .env.example           # Environment template with Firebase setup
├── tailwind.config.ts     # Tailwind configuration
├── next.config.ts         # Next.js configuration with PWA
└── package.json
```

## � Usage

### For Students
1. **Sign up** for a free 3-day trial account
2. **Select your class** (6 or 10) during registration
3. **Browse courses** available for your class
4. **Watch videos** with automatic progress tracking
5. **Track progress** in the analytics dashboard
6. **Manage profile** and view subscription status

### For Developers
1. **Set up Firebase** project and configure environment
2. **Run seed script** to populate with sample data
3. **Customize courses** by modifying `src/lib/seedData.ts`
4. **Add payment integration** for trial-to-premium conversion
5. **Deploy to production** with proper environment variables

## 🎨 Customization

### Adding New Courses
1. Use the `seedSampleData` function in `src/lib/seedData.ts`
2. Add course data to Firebase through the admin interface
3. Courses are automatically filtered by student's class

### Modifying Trial Period
Update the trial duration in `src/lib/auth.ts`:
```typescript
const trialEndDate = new Date();
trialEndDate.setDate(trialEndDate.getDate() + 3); // Change trial period here
```

## 🔒 Security

- **Firebase Security Rules** configured for user data protection
- **Authentication** required for all dashboard access
- **Class-based access control** prevents cross-class content access
- **Trial restrictions** automatically enforce time limits

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with automatic PWA and Firebase optimization

### Environment Variables for Production
Make sure to set all Firebase environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production (tests build process)
npm run build

# Seed test data
npm run seed
```

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Roadmap

### Phase 2: Payment & Subscription
- [ ] Stripe payment integration
- [ ] Subscription management
- [ ] Invoice generation
- [ ] Trial-to-premium conversion

### Phase 3: Enhanced Learning
- [ ] Real-time chat and discussions
- [ ] AI-powered recommendations
- [ ] Quizzes and assessments
- [ ] Certificates and achievements

### Phase 4: Mobile & Advanced Features
- [ ] React Native mobile app
- [ ] Push notifications
- [ ] Offline video downloads
- [ ] Multi-language support

---

<div align="center">
  <p>Made with ❤️ by the Brainac Team</p>
  <p><strong>Phase 1 Complete:</strong> Firebase Authentication, Student Dashboard, Class-based Learning Platform</p>
</div>
