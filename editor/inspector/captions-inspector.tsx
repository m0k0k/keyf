import React from 'react';
import {
	FEATURE_CAPTIONS_PAGE_DURATION_CONTROL,
	FEATURE_COLOR_CONTROL,
	FEATURE_DIMENSIONS_CONTROL,
	FEATURE_FONT_FAMILY_CONTROL,
	FEATURE_FONT_STYLE_CONTROL,
	FEATURE_OPACITY_CONTROL,
	FEATURE_POSITION_CONTROL,
	FEATURE_ROTATION_CONTROL,
	FEATURE_TEXT_ALIGNMENT_CONTROL,
	FEATURE_TEXT_DIRECTION_CONTROL,
	FEATURE_TEXT_FONT_SIZE_CONTROL,
	FEATURE_TEXT_LETTER_SPACING_CONTROL,
	FEATURE_TEXT_LINE_HEIGHT_CONTROL,
	FEATURE_TEXT_MAX_LINES_CONTROL,
	FEATURE_TEXT_STROKE_COLOR_CONTROL,
	FEATURE_TEXT_STROKE_WIDTH_CONTROL,
	FEATURE_TOKENS_CONTROL,
} from '../flags';
import {CaptionsItem} from '../items/captions/captions-item-type';
import {ColorInspector} from './color-inspector';
import {InspectorLabel} from './components/inspector-label';
import {
	InspectorDivider,
	InspectorSection,
} from './components/inspector-section';
import {AlignmentControls} from './controls/alignment-controls';
import {PageDurationControls} from './controls/caption-controls/page-duration-controls';
import {TokensControls} from './controls/caption-controls/tokens-controls';
import {DimensionsControls} from './controls/dimensions-controls';
import {FontFamilyControl} from './controls/font-family-controls/font-family-controls';
import {FontSizeControls} from './controls/font-size-controls';
import {FontStyleControls} from './controls/font-style-controls/font-style-controls';
import {LetterSpacingControls} from './controls/letter-spacing-controls';
import {LineHeightControls} from './controls/line-height-controls';
import {MaxLinesControls} from './controls/max-lines-controls';
import {OpacityControls} from './controls/opacity-controls';
import {PositionControl} from './controls/position-control';
import {RotationControl} from './controls/rotation-controls';
import {StrokeWidthControls} from './controls/stroke-width-controls';
import {TextAlignmentControls} from './controls/text-alignment-controls';
import {TextDirectionControls} from './controls/text-direction-controls';

const CaptionsInspectorUnmemoized: React.FC<{
	item: CaptionsItem;
}> = ({item}) => {
	return (
		<div>
			<InspectorSection>
				<InspectorLabel>Layout</InspectorLabel>
				<AlignmentControls itemId={item.id} />
				{FEATURE_POSITION_CONTROL && (
					<PositionControl left={item.left} top={item.top} itemId={item.id} />
				)}
				{FEATURE_DIMENSIONS_CONTROL && (
					<DimensionsControls
						itemId={item.id}
						height={item.height}
						width={item.width}
					/>
				)}
				{FEATURE_ROTATION_CONTROL && (
					<RotationControl rotation={item.rotation} itemId={item.id} />
				)}
			</InspectorSection>
			<InspectorDivider />
			<InspectorSection>
				<InspectorLabel>Typography</InspectorLabel>
				{FEATURE_FONT_FAMILY_CONTROL && (
					<FontFamilyControl fontFamily={item.fontFamily} itemId={item.id} />
				)}
				{FEATURE_FONT_STYLE_CONTROL && (
					<FontStyleControls
						fontFamily={item.fontFamily}
						fontStyle={item.fontStyle}
						itemId={item.id}
					/>
				)}
				{FEATURE_TEXT_FONT_SIZE_CONTROL && (
					<FontSizeControls
						fontSize={item.fontSize}
						itemId={item.id}
						itemType="captions"
					/>
				)}

				<div className="flex flex-row gap-2">
					{FEATURE_TEXT_LINE_HEIGHT_CONTROL && (
						<LineHeightControls lineHeight={item.lineHeight} itemId={item.id} />
					)}
					{FEATURE_TEXT_LETTER_SPACING_CONTROL && (
						<LetterSpacingControls
							letterSpacing={item.letterSpacing}
							itemId={item.id}
						/>
					)}
				</div>
				<div className="flex flex-row gap-2">
					{FEATURE_TEXT_ALIGNMENT_CONTROL && (
						<TextAlignmentControls align={item.align} itemId={item.id} />
					)}
					{FEATURE_TEXT_DIRECTION_CONTROL && (
						<TextDirectionControls
							direction={item.direction}
							itemId={item.id}
						/>
					)}
				</div>
			</InspectorSection>
			<InspectorDivider />
			{FEATURE_OPACITY_CONTROL && (
				<InspectorSection>
					<InspectorLabel>Fill</InspectorLabel>
					{FEATURE_OPACITY_CONTROL && (
						<OpacityControls opacity={item.opacity} itemId={item.id} />
					)}
					<div className="flex flex-row gap-2">
						{FEATURE_COLOR_CONTROL && (
							<ColorInspector
								color={item.color}
								itemId={item.id}
								colorType="color"
								accessibilityLabel="Fill color"
							/>
						)}
						{FEATURE_COLOR_CONTROL && (
							<ColorInspector
								color={item.highlightColor}
								itemId={item.id}
								colorType="highlightColor"
								accessibilityLabel="Highlight color"
							/>
						)}
					</div>
				</InspectorSection>
			)}
			<InspectorDivider />
			<InspectorSection>
				<InspectorLabel>Stroke</InspectorLabel>
				{FEATURE_TEXT_STROKE_WIDTH_CONTROL && (
					<StrokeWidthControls
						strokeWidth={item.strokeWidth}
						itemId={item.id}
					/>
				)}
				{FEATURE_TEXT_STROKE_COLOR_CONTROL && (
					<ColorInspector
						color={item.strokeColor}
						itemId={item.id}
						colorType="strokeColor"
						accessibilityLabel="Stroke color"
					/>
				)}
			</InspectorSection>
			<InspectorDivider />
			<InspectorSection>
				<InspectorLabel>Captions</InspectorLabel>
				{FEATURE_CAPTIONS_PAGE_DURATION_CONTROL && (
					<PageDurationControls
						pageDurationInMilliseconds={item.pageDurationInMilliseconds}
						itemId={item.id}
					/>
				)}
				{FEATURE_TEXT_MAX_LINES_CONTROL && (
					<MaxLinesControls maxLines={item.maxLines} itemId={item.id} />
				)}
			</InspectorSection>
			<InspectorDivider />
			{FEATURE_TOKENS_CONTROL && <TokensControls item={item} />}
		</div>
	);
};

export const CaptionsInspector = React.memo(CaptionsInspectorUnmemoized);
