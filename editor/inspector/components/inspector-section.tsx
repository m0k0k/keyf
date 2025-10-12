export const InspectorSection: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className="px-2 py-4">{children}</div>;
};

export const InspectorDivider: React.FC = () => {
  return <div className="h-[1px] bg-white/5"></div>;
};
