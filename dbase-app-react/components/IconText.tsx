import React from "react";

interface Props {
  icon?: React.JSX.Element;
  text: string;
}

export default function IconText({ icon, text }: Props): React.JSX.Element {
  return (
    <div className="flex flex-row gap-2 items-center">
      {icon}
      {text}
    </div>
  );
}