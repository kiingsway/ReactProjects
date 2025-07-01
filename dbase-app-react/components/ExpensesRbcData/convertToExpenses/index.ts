import { DateTime } from "luxon";
import { IRbcItem, IExpenseItem, IConvertExpenseRule } from "../interfaces";
import conversionRules from "./conversionRules";
import { hashIRItem } from "./hashIRItem";

export default function convertToExpenses(data: IRbcItem[]): IExpenseItem[] {
  if (!data.length) return [];
  return data.map(item => {
    const { AccountType, TransactionDate, Description1, Description2, Balance, Total } = item;
    const BankDescription = Description1 + " " + Description2;
    const TransactionMonth = DateTime.fromISO(TransactionDate).toFormat("(yy-MM) LLLL yy");
    const key = hashIRItem(item);

    return {
      key,
      AccountType, TransactionDate, BankDescription, Balance, Total, TransactionMonth,
      Account: "RBC",
      Title: "",
      ...guessData(item)
    };
  });
}

function guessData(item: IRbcItem): Partial<IExpenseItem> {
  const { Description1 = "", Description2 = "" } = item;

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

  return { Title: "" };
}