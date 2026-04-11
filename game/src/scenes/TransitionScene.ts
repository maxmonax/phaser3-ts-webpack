import { AudioMng } from "@/audio/AudioMng";
import { Config } from "@/data/Config";
import { Curtain } from "@/gui/Curtain";
import { SceneNames } from "./SceneNames";

export type TransitionOptions = {
    duration?: number;
    color?: number;
    alpha?: number;
    ease?: string | ((v: number) => number);
    stopCurrent?: boolean;
    targetData?: object;
};

type TransitionData = TransitionOptions & {
    fromSceneKey?: string;
    targetSceneKey: string;
};

export class TransitionScene extends Phaser.Scene {
    private static readonly DEFAULT_DURATION = 300;
    private static readonly DEFAULT_COLOR = 0x111111;
    private static readonly DEFAULT_ALPHA = 1;

    private _curtain!: Curtain;
    private _isTransitioning = false;

    constructor() {
        super(SceneNames.TransitionScene);
    }

    static change(scene: Phaser.Scene, targetSceneKey: string, options: TransitionOptions = {}): void {
        if (scene.scene.isActive(SceneNames.TransitionScene)) return;

        scene.scene.launch(SceneNames.TransitionScene, {
            ...options,
            fromSceneKey: scene.scene.key,
            targetSceneKey,
        } satisfies TransitionData);
        scene.scene.bringToTop(SceneNames.TransitionScene);
    }

    public create(data: TransitionData): void {
        AudioMng.init(this);

        if (this._isTransitioning) return;
        this._isTransitioning = true;

        const duration = data.duration ?? TransitionScene.DEFAULT_DURATION;
        const alpha = data.alpha ?? TransitionScene.DEFAULT_ALPHA;

        this._curtain = new Curtain({
            scene: this,
            x: Config.GW_HALF,
            y: Config.GH_HALF,
            w: Config.GW,
            h: Config.GH,
            color: data.color ?? TransitionScene.DEFAULT_COLOR,
        });
        this.add.existing(this._curtain);

        this._curtain.showCurtain({
            alpha,
            dur: duration,
            ease: data.ease,
            cb: () => {
                this.startTargetScene(data);
                this.hideCurtain(data);
            },
        });
    }

    private startTargetScene(data: TransitionData): void {
        if (data.stopCurrent ?? true) {
            if (data.fromSceneKey && data.fromSceneKey !== data.targetSceneKey) {
                this.scene.stop(data.fromSceneKey);
            }
        }

        this.scene.launch(data.targetSceneKey, data.targetData);
        this.scene.bringToTop(SceneNames.TransitionScene);
    }

    private hideCurtain(data: TransitionData): void {
        this._curtain.hideCurtain(data.duration ?? TransitionScene.DEFAULT_DURATION, () => {
            this._isTransitioning = false;
            this.scene.stop();
        }, undefined, data.ease);
    }
}
