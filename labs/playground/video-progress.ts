

import { Defer } from '../../src/func/defer';
import { func } from '../../src/func/func';
import { mathf } from '../../src/mathf/mathf';
import { WebWorker } from "../../src/dom/web-worker";

/**
 * See /examples/playground video progress for a sample.
 */
export class VideoProgress {
    private video: HTMLVideoElement;
    private videoReady: Defer;

    constructor(video: HTMLVideoElement) {
        this.video = video;
        // Ensure we don't run into autoplay issues.
        this.video.muted = true;
        this.video['playsinline'] = true;
        this.video.autoplay = false;

        this.videoReady = new Defer();
    }

    /**
     * Loads the video competely first.
     * TODO (uxder): Look for a better way to check completely readyState of video
     *     besides polling.
     */
    load(): Promise<any> {
        this.video.load();
        if (this.video.readyState === 4) {
            this.videoReady.resolve();
        } else {
            func.waitUntil(
                () => this.video.readyState == 4
            ).then(() => {
                this.videoReady.resolve();
            })
        }
        return this.videoReady.getPromise();
    }


    setProgress(progress: number) {
        let interpolatedTime = mathf.lerp(0, this.video.duration, progress);
        this.video.pause();
        if (this.video['fastSeek']) {
            this.video['fastSeek'](interpolatedTime);
        } else {
            this.video.currentTime = interpolatedTime;
        }
    }


}