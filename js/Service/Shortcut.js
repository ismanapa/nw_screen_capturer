const appWindow = nw.Window.get();
import { toggleRecording } from '../Actions';
import {
    SCREENSHOT_DEFAULT_FILENAME, ANIMATION_DEFAULT_FILENAME,
    TAKE_SCREENSHOT_SHORTCUT, RECORD_SHORTCUT, STOP_SHORTCUT
} from '../Constants';

export default class Shortcut {

    screenshotFilename = SCREENSHOT_DEFAULT_FILENAME;
    animationFilename = ANIMATION_DEFAULT_FILENAME;
    isRecording = false;

    constructor(capturer, store) {

        this.capturer = capturer;
        this.store = store;

        store.subscribe(() => {
            const {
                isRecording,
                screenshotFilename,
                animationFilename
            } = store.getState();
            this.screenshotFilename = screenshotFilename;
            this.animationFilename = animationFilename;
            this.isRecording = isRecording;
        });
    }

    registerOne(key, active) {
        const shortcut = new nw.Shortcut({
            key,
            active,
            failed: console.error
        });
        // Register global desktop shortcut, which can work without focus. 
        nw.App.registerGlobalHotKey(shortcut);
        appWindow.on('close', () => nw.App.unregisterGlobalHotKey(shortcut));
        window.addEventListener('beforeunload', () => nw.App.unregisterGlobalHotKey(shortcut), false);
    }


    registerAll() {
        this.registerOne(TAKE_SCREENSHOT_SHORTCUT, () => this.capturer.takeScreenshot(this.screenshotFilename));

        this.registerOne(RECORD_SHORTCUT, () => {
            if (this.isRecording) {
                return;
            }
            this.capturer.record(this.animationFilename);
            this.store.dispatch(toggleRecording(true));
        });
        this.registerOne(STOP_SHORTCUT, () => {
            if (!this.isRecording) {
                return;
            }
            this.capturer.stop();
            this.store.dispatch(toggleRecording(false));
        });
    }

} 