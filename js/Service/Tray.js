const appWindow = nw.Window.get();
import { toggleRecording } from '../Actions';
import {
    SCREENSHOT_DEFAULT_FILENAME,
    ANIMATION_DEFAULT_FILENAME,
    TAKE_SCREENSHOT_SHORTCUT,
    RECORD_SHORTCUT,
    STOP_SHORTCUT
} from '../Constants';

export default class Tray {

    tray = null;
    screenshotFilename = SCREENSHOT_DEFAULT_FILENAME;
    animationFilename = ANIMATION_DEFAULT_FILENAME;
    isRecording = false;

    constructor(capturer, store) {
        this.capturer = capturer;
        this.store = store;
        this.title = nw.App.manifest.description;
        this.removeOnExit();

        store.subscribe(() => {
            const {
                isRecording,
                screenshotFilename,
                animationFilename
            } = store.getState();
            this.screenshotFilename = screenshotFilename;
            this.animationFilename = animationFilename;

            if (this.isRecording === isRecording)
                return;

            this.isRecording = isRecording;
            this.render();
        });
    }

    getItems = () => [
        {
            label: `Take screenshot (${TAKE_SCREENSHOT_SHORTCUT})`,
            click: () => this.capturer.takeScreenshot(this.screenshotFilename)
        },
        {
            label: `Start recording (${RECORD_SHORTCUT})`,
            enabled: !this.isRecording,
            click: () => {
                this.capturer.record(this.animationFilename);
                this.store.dispatch(toggleRecording(true));
            }
        },
        {
            label: `Stop recording (${STOP_SHORTCUT})`,
            enabled: this.isRecording,
            click: () => {
                this.capturer.stop();
                this.store.dispatch(toggleRecording(false));
            }
        }, 
        {
            type: 'separator'
        },
        {
            label: 'Open',
            click: () => appWindow.show()
        },
        {
            label: 'Exit',
            click: () => appWindow.close()
        }
    ];

    render() {
        if (this.tray)
            this.tray.remove();

        const icon = './assets/' +
            (process.platform === 'linux' ? 'icon-48x48.png' : 'icon-32x32.png');

        this.tray = new nw.Tray({
            title: this.title,
            icon,
            iconsAreTemplates: false
        });

        const menu = new nw.Menu();
        this.getItems().forEach((item) => menu.append(new nw.MenuItem(item)));
        this.tray.menu = menu;
    }

    removeOnExit() {
        appWindow.on('close', () => {
            this.tray.remove();
            appWindow.hide(); // Pretend to be closed already 
            appWindow.close(true);
        });
        // do not spawn Tray instances on page reload 
        window.addEventListener('beforeunload', () => this.tray.remove(), false);
    }
} 