// https://github.com/anubhavsrivastava/react-for-electron-only/blob/master/src/isElectron.js
export default function isElectron() {
	// Renderer process
	if (typeof window !== 'undefined' && typeof window.process === 'object') {
		return true;
	}

	// Main process
	if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
		return true;
	}

	// Detect the user agent when the `nodeIntegration` option is set to true
	if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
		return true;
	}

	return false;
}

declare global {
	interface Window {
		electronAPI: {
			setCloseToTray: (setting: boolean) => void;
		};
	}
  }
  