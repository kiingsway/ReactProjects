import React from "react";

interface Props {
  total: number;
}

export default function ColValue({ total }: Props): React.JSX.Element {
  if (!total) return <span>$ -</span>;
  return <span>$ {total.toFixed(2)}</span>;
}