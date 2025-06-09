import { renderNotionDate } from "@/app/services/helpers";
import { DateProperties } from "@/interfaces";
import React from "react";

export default function ColDate({ column }: { column: DateProperties }): React.ReactNode {
    if (!column) return <></>;
    return renderNotionDate(column.date.start, column.date.end);
}