import React from "react";

const InspectorLabelForwardRef: React.ForwardRefRenderFunction<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
> = (props, ref) => {
  return (
    <div
      ref={ref}
      className="mb-3 text-xs font-semibold text-neutral-300"
      {...props}
    ></div>
  );
};

export const InspectorLabel = React.forwardRef(InspectorLabelForwardRef);

const InspectorSubLabelForwardRef: React.ForwardRefRenderFunction<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
> = (props, ref) => {
  return (
    <div
      ref={ref}
      className="mt-2 mb-1 text-[0.7rem] font-semibold text-neutral-400"
      {...props}
    ></div>
  );
};

export const InspectorSubLabel = React.forwardRef(InspectorSubLabelForwardRef);
