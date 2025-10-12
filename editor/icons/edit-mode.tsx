import React from 'react';

export const EditModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
	props,
) => {
	return (
		<svg
			{...props}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
			<path d="M13 13l6 6" />
		</svg>
	);
};
