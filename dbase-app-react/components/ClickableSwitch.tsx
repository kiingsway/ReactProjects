import React, { useState } from "react";
import { Switch } from "antd";

interface ClickableSwitchProps {
  checked?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange?: (checked: boolean) => void;
  label: string;
  icon?: React.JSX.Element;
}

export default function ClickableSwitch(props: ClickableSwitchProps): React.JSX.Element {
  const { checked = false, onChange, label, icon } = props;
  
  const [checkedState, setCheckedState] = useState(checked);
  const id = `switch-${Math.random().toString(36).slice(2)}`;

  const handleChange = (val: boolean): void => {
    setCheckedState(val);
    if (onChange) onChange(val);
  };

  return (
    <label htmlFor={id} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
      <Switch id={id} checked={checkedState} onChange={handleChange} />
      {icon}
      <span>{label}</span>
    </label>
  );
}
