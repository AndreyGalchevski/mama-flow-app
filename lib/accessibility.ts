export const AccessibilityLabels = {
  // Navigation
  homeTab: 'Home tab',
  allLogsTab: 'All logs tab',
  settingsTab: 'Settings tab',

  // Actions
  addPumpLog: 'Add new pump log',
  editPumpLog: 'Edit pump log',
  deletePumpLog: 'Delete pump log',
  savePumpLog: 'Save pump log',
  cancelAction: 'Cancel',

  // Inputs
  volumeLeftInput: 'Enter volume pumped from left breast in milliliters',
  volumeRightInput: 'Enter volume pumped from right breast in milliliters',
  durationInput: 'Enter pumping duration in minutes',
  notesInput: 'Enter optional notes about this pumping session',

  // Settings
  remindersToggle: 'Toggle reminder notifications',
  dayHoursInput: 'Set hours between daytime reminders',
  nightHoursInput: 'Set hours between nighttime reminders',

  // Chart
  volumeChart: 'Weekly volume chart showing pumping trends over the last 7 days',

  // Import/Export
  importCSV: 'Import pump logs from CSV file',
  exportCSV: 'Export pump logs to CSV file',
} as const;

export const AccessibilityHints = {
  addPumpLog: 'Opens a form to record a new pumping session',
  editPumpLog: 'Opens the pumping session for editing',
  deletePumpLog: 'Removes this pumping session permanently',
  volumeChart: 'Swipe left or right to navigate between data points',
} as const;

export const AccessibilityRoles = {
  button: 'button',
  text: 'text',
  textInput: 'text',
  image: 'image',
  chart: 'image',
  switch: 'switch',
  tab: 'tab',
} as const;
