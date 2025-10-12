import {getRemotionEnvironment} from 'remotion';
import {EditorStarterAsset} from '../assets/assets';
import {useRequireLocalUrl} from '../utils/find-asset-by-id';

// In preview, only load remote assets once, cache them and do all operations locally.
// (waveform, thumbnails, preview)
export const RequireCachedAsset = ({
	asset,
	children,
}: {
	asset: EditorStarterAsset;
	children: React.ReactNode;
}) => {
	if (getRemotionEnvironment().isRendering) {
		return children;
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const url = useRequireLocalUrl(asset);

	if (!url) {
		return null;
	}

	return children;
};
