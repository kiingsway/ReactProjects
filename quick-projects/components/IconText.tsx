interface IconTextProps {
  icon: React.JSX.Element;
  text: string;
  iconPosition?: "left" | "right";
  gap?: 1 | 2 | 3 | 4
}

const IconText = ({ icon, text, iconPosition, gap }: IconTextProps): React.JSX.Element => (
  <div className={`flex flex-row gap-${gap || 2} items-center`} style={{ gap: 6 }}>
    {iconPosition === "left" ? <>{icon}{text}</> : <>{text}{icon}</>}
  </div>
);

export default IconText;