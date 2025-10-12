import React, {useMemo} from 'react';
import {Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {RequireCachedAsset} from '../../caching/require-cached-asset';
import {usePreferredLocalUrl} from '../../utils/find-asset-by-id';
import {useAssetFromItem} from '../../utils/use-context';
import {
	calculateFadeInOpacity,
	calculateFadeOutOpacity,
} from '../video/calculate-fade';
import {ImageItem} from './image-item-type';

const ImageItemUnmemoized: React.FC<{
	item: ImageItem;
}> = ({item}) => {
	if (item.type !== 'image') {
		throw new Error('Item is not an image');
	}

	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const asset = useAssetFromItem(item);

	const opacity = useMemo(() => {
		const inOpacity = calculateFadeInOpacity({
			currentFrame: frame,
			fadeInDurationInSeconds: item.fadeInDurationInSeconds,
			framesPerSecond: fps,
		});
		const outOpacity = calculateFadeOutOpacity({
			currentFrame: frame,
			fadeOutDurationInSeconds: item.fadeOutDurationInSeconds,
			framesPerSecond: fps,
			totalDurationInFrames: durationInFrames,
		});
		return inOpacity * outOpacity * item.opacity;
	}, [
		item.fadeInDurationInSeconds,
		fps,
		frame,
		item.opacity,
		durationInFrames,
		item.fadeOutDurationInSeconds,
	]);

	const innerStyle: React.CSSProperties = useMemo(() => {
		return {
			objectFit: 'fill',
			width: item.width,
			height: item.height,
			borderRadius: item.borderRadius,
		};
	}, [item]);

	const outerStyle: React.CSSProperties = useMemo(() => {
		return {
			position: 'absolute',
			left: item.left,
			top: item.top,
			transform: `rotate(${item.rotation}deg)`,
			opacity,
			...innerStyle,
		};
	}, [innerStyle, item.left, item.top, item.rotation, opacity]);

	const src = usePreferredLocalUrl(asset);

	return (
		<div style={outerStyle}>
			<RequireCachedAsset asset={asset}>
				<Img
					crossOrigin="anonymous"
					pauseWhenLoading
					style={innerStyle}
					src={src}
				/>
			</RequireCachedAsset>
		</div>
	);
};

export const ImageLayer = React.memo(ImageItemUnmemoized);
