// Add this to server/scripts/addSampleBugs.js
import mongoose from 'mongoose';
import Bug from '../src/models/Bug.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleBugs = [
  {
    title: 'Login button not responding on mobile',
    description: 'When clicking the login button on mobile devices, nothing happens. The button appears to be unresponsive.',
    status: 'open',
    priority: 'high',
    stepsToReproduce: [
      'Open the application on a mobile device',
      'Navigate to the login page',
      'Enter valid credentials',
      'Click the login button'
    ],
    expectedBehavior: 'User should be logged in and redirected to dashboard',
    actualBehavior: 'Button does nothing when clicked',
    environment: {
      os: 'iOS 16.0',
      browser: 'Safari',
      device: 'iPhone 13'
    },
    reporter: 'Sarah Johnson',
    assignee: 'Frontend Team',
    tags: ['mobile', 'login', 'ui']
  },
  {
    title: 'Dashboard data loading very slowly',
    description: 'The dashboard takes over 10 seconds to load user data, causing poor user experience.',
    status: 'in-progress',
    priority: 'medium',
    stepsToReproduce: [
      'Log into the application',
      'Navigate to the dashboard',
      'Observe loading time'
    ],
    expectedBehavior: 'Dashboard should load within 2-3 seconds',
    actualBehavior: 'Dashboard takes 10+ seconds to load completely',
    environment: {
      os: 'Windows 11',
      browser: 'Chrome 118',
      device: 'Desktop'
    },
    reporter: 'Mike Chen',
    assignee: 'Backend Team',
    tags: ['performance', 'dashboard', 'api']
  },
  {
    title: 'Profile picture upload fails for large files',
    description: 'Users cannot upload profile pictures larger than 1MB. The upload fails without any error message.',
    status: 'open',
    priority: 'high',
    stepsToReproduce: [
      'Go to user profile settings',
      'Click "Change Profile Picture"',
      'Select an image larger than 1MB',
      'Click upload'
    ],
    expectedBehavior: 'Image should be uploaded and resized if necessary',
    actualBehavior: 'Upload fails silently, no error message shown',
    environment: {
      os: 'macOS Ventura',
      browser: 'Firefox 115',
      device: 'MacBook Pro'
    },
    reporter: 'Emily Rodriguez',
    assignee: '',
    tags: ['upload', 'profile', 'files']
  },
  {
    title: 'Search functionality returns incorrect results',
    description: 'The search feature returns unrelated results when searching for specific terms.',
    status: 'open',
    priority: 'medium',
    stepsToReproduce: [
      'Use the search bar in the header',
      'Search for "user settings"',
      'Observe results'
    ],
    expectedBehavior: 'Should return relevant pages about user settings',
    actualBehavior: 'Returns unrelated articles and pages',
    environment: {
      os: 'Windows 10',
      browser: 'Edge 115',
      device: 'Desktop'
    },
    reporter: 'David Kim',
    assignee: 'Search Team',
    tags: ['search', 'functionality']
  },
  {
    title: 'Password reset email not being sent',
    description: 'When users request a password reset, no email is received even though the system says it was sent.',
    status: 'resolved',
    priority: 'critical',
    stepsToReproduce: [
      'Go to login page',
      'Click "Forgot Password"',
      'Enter registered email address',
      'Check email inbox'
    ],
    expectedBehavior: 'Password reset email should arrive within 2 minutes',
    actualBehavior: 'No email received even after 30 minutes',
    environment: {
      os: 'Android 13',
      browser: 'Chrome Mobile',
      device: 'Samsung Galaxy S22'
    },
    reporter: 'Lisa Wang',
    assignee: 'DevOps Team',
    tags: ['email', 'authentication', 'critical']
  },
  {
    title: 'Mobile menu overlaps content on small screens',
    description: 'On devices with screen width less than 320px, the navigation menu overlaps page content.',
    status: 'closed',
    priority: 'low',
    stepsToReproduce: [
      'Open app on device with 320px width or less',
      'Open navigation menu',
      'Observe content overlap'
    ],
    expectedBehavior: 'Menu should push content down or overlay properly',
    actualBehavior: 'Menu overlaps with page content making it unreadable',
    environment: {
      os: 'iOS 15',
      browser: 'Safari',
      device: 'iPhone SE'
    },
    reporter: 'Alex Thompson',
    assignee: 'UI/UX Team',
    tags: ['responsive', 'mobile', 'css']
  }
];

const addSampleBugs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bug-tracker');
    console.log('Connected to MongoDB');
    
    // Clear existing bugs
    await Bug.deleteMany({});
    console.log('Cleared existing bugs');
    
    // Add sample bugs
    await Bug.insertMany(sampleBugs);
    console.log(`Added ${sampleBugs.length} sample bugs`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample bugs:', error);
    process.exit(1);
  }
};

addSampleBugs();