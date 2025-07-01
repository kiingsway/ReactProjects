import { createHash } from "crypto"; // Node.js (ou use um pacote equivalente no browser)
import { IRbcItem } from "../interfaces";
import React from "react";
import { Button, Tooltip } from "antd";
import { FaKey } from "react-icons/fa";

export function hashIRItem(item: IRbcItem): string {
  const str = [
    item.AccountType,
    item.TransactionDate,
    item.Description1,
    item.Description2,
    item.Balance.toFixed(2),
    item.Total.toFixed(2),
  ].join("|"); // separador confiável

  return createHash("sha256").update(str).digest("hex");
}

export const RenderKey = ({ hashKey }: { hashKey: string }): React.JSX.Element => (
  <Tooltip title={hashKey}>
    <Button type="text" icon={<FaKey />} style={{ cursor: "default" }} />
  </Tooltip>
);