import { RollupProperties } from "@/interfaces";
import React from "react";

export default function ColRollup({ column }: { column: RollupProperties }): React.ReactNode {
    if (!column) return <></>;
    return column.rollup.array.map(a => a.title[0].plain_text).join(", ");
}