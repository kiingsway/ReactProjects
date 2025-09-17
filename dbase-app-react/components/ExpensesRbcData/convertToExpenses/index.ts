import { DateTime } from "luxon";
import { IRbcItem, IExpenseItem, IConvertExpenseRule } from "../interfaces";
import conversionRules from "./conversionRules";
import conversionIdRules from "./conversionIdRules";

export default function convertToExpenses(data: IRbcItem[]): IExpenseItem[] {

  if (!data.length) return [];

  return data.map(item => {
    const { key, AccountType, TransactionDate, Description1, Description2, Balance, Total } = item;
    const TransactionMonth = DateTime.fromISO(TransactionDate).toFormat("(yy-MM) LLLL yy");
    const BankDescription = [Description1, Description2].filter(Boolean).join(" ");

    return {
      key, AccountType, TransactionDate, BankDescription, Balance, Total, TransactionMonth,
      Account: "RBC", Title: "",
      ...guessData(item)
    };
  });
}

function guessData(item: IRbcItem): Partial<IExpenseItem> {
  const { key, Description1 = "", Description2 = "" } = item;

  const rules: IConvertExpenseRule[] = [
    { match: "Monthly fee", Title: Description1, Category: "Bank", Subcategory: "Fee" },
    ...conversionRules
  ];

  for (const rule of rules) {
    if (Description1.includes(rule.match)) {
      const { Title = "", Category = "", Subcategory = "" } = rule;
      return { Title, Category, Subcategory };
    }

    if (Description2.includes(rule.match)) {
      const { Title = "", Category = "", Subcategory = "" } = rule;
      return { Title, Category, Subcategory };
    }

    if (`${Description1} ${Description2}`.includes(rule.match)) {
      const { Title = "", Category = "", Subcategory = "" } = rule;
      return { Title, Category, Subcategory };
    }
  }

  const idRules: IConvertExpenseRule[] = [
    { match: "a6ff784602e9b8405317b77f32a6ebe2feb07cc1c9ef468aa0cf0481f9b4c6f4", Title: "Rent", Category: "Bills", Subcategory: "Rent" },
    ...conversionIdRules
  ];

  for (const rule of idRules) {
    if (key === rule.match) {
      const { Title = "", Category = "", Subcategory = "" } = rule;
      return { Title, Category, Subcategory };
    }
  }

  return { Title: "" };
}