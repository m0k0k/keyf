import React, {memo} from 'react';

import {getAssetFromItem} from '../../assets/utils';
import {FEATURE_KEEP_ASPECT_RATIO_CONTROL} from '../../flags';
import {changeItem} from '../../state/actions/change-item';
import {
	updateItemHeight,
	updateItemWidth,
} from '../../state/actions/update-item-dimensions';
import {
	canKeepAspectRatioMap,
	getKeepAspectRatio,
	getOriginalAspectRatio,
} from '../../utils/aspect-ratio';
import {useItem, useWriteContext} from '../../utils/use-context';
import {InspectorSubLabel} from '../components/inspector-label';
import {ControlsPadding} from './controls-padding';
import {KeepAspectRatioControls} from './keep-aspect-ratio-controls';
import {NumberControl, NumberControlUpdateHandler} from './number-controls';

const DimensionsControlsUnmemoized: React.FC<{
	itemId: string;
	height: number;
	width: number;
}> = ({itemId, height, width}) => {
	const {setState} = useWriteContext();
	const item = useItem(itemId);

	const onHeight: NumberControlUpdateHandler = React.useCallback(
		({num, commitToUndoStack}) => {
			setState({
				update: (state) => {
					return changeItem(state, itemId, (i) => {
						const keepAspectRatio = getKeepAspectRatio(i);
						if (!keepAspectRatio) {
							return updateItemHeight({
								item: i,
								height: num,
								stopTextEditing: true,
							});
						}

						const asset = getAssetFromItem({
							item: i,
							assets: state.undoableState.assets,
						});
						const aspectRatio = getOriginalAspectRatio({item: i, asset});
						// Update both height and width to maintain original aspect ratio
						const newWidth = Math.round(num * aspectRatio);

						const updatedItem = updateItemHeight({
							item: i,
							height: num,
							stopTextEditing: true,
						});
						return updateItemWidth({
							item: updatedItem,
							width: newWidth,
							stopTextEditing: true,
						});
					});
				},
				commitToUndoStack,
			});
		},
		[setState, itemId],
	);

	const onWidth: NumberControlUpdateHandler = React.useCallback(
		({num, commitToUndoStack}) => {
			setState({
				update: (state) => {
					return changeItem(state, itemId, (i) => {
						const keepAspectRatio = getKeepAspectRatio(i);
						if (!keepAspectRatio) {
							return updateItemWidth({
								item: i,
								width: num,
								stopTextEditing: true,
							});
						}

						const asset = getAssetFromItem({
							item: i,
							assets: state.undoableState.assets,
						});
						const aspectRatio = getOriginalAspectRatio({item: i, asset});
						// Update both width and height to maintain original aspect ratio
						const newHeight = Math.round(num / aspectRatio);

						const updatedItem = updateItemWidth({
							item: i,
							width: num,
							stopTextEditing: true,
						});
						return updateItemHeight({
							item: updatedItem,
							height: newHeight,
							stopTextEditing: true,
						});
					});
				},
				commitToUndoStack,
			});
		},
		[setState, itemId],
	);

	return (
		<div>
			<InspectorSubLabel>Dimensions</InspectorSubLabel>
			<div className="flex w-full flex-row gap-2">
				<div className="flex-1">
					<NumberControl
						label="W"
						setValue={onWidth}
						value={width}
						min={1}
						max={null}
						step={1}
						accessibilityLabel="Width"
					/>
				</div>
				<div className="flex-1">
					<NumberControl
						label="H"
						setValue={onHeight}
						value={height}
						min={1}
						max={null}
						step={1}
						accessibilityLabel="Height"
					/>
				</div>
				{FEATURE_KEEP_ASPECT_RATIO_CONTROL &&
				canKeepAspectRatioMap[item.type] ? (
					<KeepAspectRatioControls
						keepAspectRatio={getKeepAspectRatio(item)}
						itemId={itemId}
					/>
				) : (
					<ControlsPadding />
				)}
			</div>
		</div>
	);
};

export const DimensionsControls = memo(DimensionsControlsUnmemoized);
