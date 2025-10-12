import {BaseItem, CanHaveBorderRadius, CanHaveRotation} from '../shared';

export type VideoItem = BaseItem &
	CanHaveBorderRadius &
	CanHaveRotation & {
		type: 'video';
		videoStartFromInSeconds: number;
		decibelAdjustment: number;
		playbackRate: number;
		audioFadeInDurationInSeconds: number;
		audioFadeOutDurationInSeconds: number;
		fadeInDurationInSeconds: number;
		fadeOutDurationInSeconds: number;
		assetId: string;
		keepAspectRatio: boolean;
	};
