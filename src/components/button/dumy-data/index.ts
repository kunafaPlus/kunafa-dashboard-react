export const buttonDummyData = {
  audio: {
    src: 'https://example.com/audio.mp3',
    autoPlay: false,
    showProgress: true,
    showTime: true,
  },
  dropdown: {
    items: [
      { label: 'Option 1', value: '1', onClick: () => console.log('Option 1 clicked') },
      { label: 'Option 2', value: '2', onClick: () => console.log('Option 2 clicked') },
      { label: 'Option 3', value: '3', onClick: () => console.log('Option 3 clicked') },
    ],
  },
  social: {
    platforms: [
      { name: 'Facebook', icon: 'facebook-icon', url: 'https://facebook.com' },
      { name: 'Twitter', icon: 'twitter-icon', url: 'https://twitter.com' },
      { name: 'Instagram', icon: 'instagram-icon', url: 'https://instagram.com' },
    ],
  },
};

// Split Button Demo Data
export const splitButtonDemoItems = [
  { id: '1', label: 'Edit', icon: 'edit' },
  { id: '2', label: 'View', icon: 'eye' },
  { id: '3', label: 'Delete', icon: 'trash', danger: true },
  { id: '4', label: 'Share', icon: 'share' },
];

// Status Button Demo Data
export const statusButtonStates = [
  { status: 'online', label: 'Available' },
  { status: 'offline', label: 'Offline' },
  { status: 'away', label: 'Away' },
  { status: 'busy', label: 'Do not disturb' },
];

// Theme Toggle Demo Data
export const themeOptions = [
  { value: 'light', label: 'Light Mode', icon: 'sun' },
  { value: 'dark', label: 'Dark Mode', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'laptop' },
];

// Toolbar Button Demo Data
export const toolbarItems = [
  { id: 'bold', label: 'Bold', icon: 'bold', shortcut: 'Ctrl+B' },
  { id: 'italic', label: 'Italic', icon: 'italic', shortcut: 'Ctrl+I' },
  { id: 'underline', label: 'Underline', icon: 'underline', shortcut: 'Ctrl+U' },
  { id: 'strike', label: 'Strike', icon: 'strikethrough', shortcut: 'Ctrl+S' },
];

// Upload Button Demo Data
export const uploadButtonConfig = {
  acceptedTypes: {
    images: '.jpg,.jpeg,.png,.gif',
    documents: '.pdf,.doc,.docx',
    all: '*/*',
  },
  maxSizes: {
    image: 5 * 1024 * 1024, // 5MB
    document: 10 * 1024 * 1024, // 10MB
    video: 100 * 1024 * 1024, // 100MB
  },
};

// Voice Command Demo Data
export const voiceCommands = {
  navigation: [
    { command: 'go to home', action: 'navigate', path: '/' },
    { command: 'go back', action: 'navigate', path: 'back' },
    { command: 'scroll to top', action: 'scroll', target: 'top' },
  ],
  actions: [
    { command: 'save', action: 'save' },
    { command: 'delete', action: 'delete' },
    { command: 'print', action: 'print' },
  ],
  system: [
    { command: 'toggle theme', action: 'theme' },
    { command: 'increase volume', action: 'volume', value: 'up' },
    { command: 'decrease volume', action: 'volume', value: 'down' },
  ],
};

// Video Play Button Demo Data
export const videoPlayStates = {
  playing: {
    icon: 'pause',
    label: 'Pause',
    ariaLabel: 'Pause video',
  },
  paused: {
    icon: 'play',
    label: 'Play',
    ariaLabel: 'Play video',
  },
  loading: {
    icon: 'loader',
    label: 'Loading',
    ariaLabel: 'Video is loading',
  },
};
