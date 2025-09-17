import { IRbcItem, IExpenseItem, IConvertExpenseRule } from "@/interfaces";
import { DateTime } from "luxon";
import conversionRules from "./personalRules";
import personalRules from "./personalRules";

export default function convertToExpenses(data: IRbcItem[]): IExpenseItem[] {

  if (!data.length) return [];

  return data.map(item => {
    const { key, AccountType, TransactionDate, Description1, Description2, Balance, Total } = item;
    const TransactionMonth = DateTime.fromISO(TransactionDate).toFormat("(yy-MM) LLLL yy");
    const BankDescription = [Description1, Description2].filter(Boolean).join(" ");

    return {
      key, id: key, AccountType, TransactionDate, BankDescription, Balance, Total, TransactionMonth,
      Account: "RBC", Description: "", created_time: "", last_edited_time: "",
      ...guessData(item)
    };
  });
}

export function guessData(item: IRbcItem): Partial<IExpenseItem> {
  const { key, Description1, Description2 } = item;

  const desc1: string = String(Description1 || "");
  const desc2: string = String(Description2 || "");

  const rules = [...conversionRules];

  for (const rule of rules) {
    if (desc1.includes(rule.match)) {
      const { Title = "", Category = "", Subcategory = "" } = rule;
      return { Description: Title, Category: { id: "", name: Category }, Subcategory: { id: "", name: Subcategory } };
    }

    if (desc2.includes(rule.match)) {
      const { Title = "", Category = "", Subcategory = "" } = rule;
      return { Description: Title, Category: { id: "", name: Category }, Subcategory: { id: "", name: Subcategory } };
    }

    if (`${desc1} ${desc2}`.includes(rule.match)) {
      const { Title = "", Category = "", Subcategory = "" } = rule;
      return { Description: Title, Category: { id: "", name: Category }, Subcategory: { id: "", name: Subcategory } };
    }
  }

  const idRules: IConvertExpenseRule[] = [
    { match: "a6ff784602e9b8405317b77f32a6ebe2feb07cc1c9ef468aa0cf0481f9b4c6f4", Title: "Rent", Category: "Bills", Subcategory: "Rent" },
    ...personalRules
  ];

  for (const rule of idRules) {
    if (key === rule.match) {
      const { Title = "", Category = "", Subcategory = "" } = rule;
      return { Description: Title, Category: { id: "", name: Category }, Subcategory: { id: "", name: Subcategory } };
    }
  }

  return { Description: "" };
}