export const parseStringArray = (str: string): unknown[] | null => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const renderDate = (d: string): string => {
  if (!d) return "";
  const date = new Date(d);
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "2-digit" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
  return `${formattedDate} (${weekday})`;
};

/**
 * Sorting utilities that push `undefined` values to the end.
 *
 * Examples:
 * - Alphabetical: ['b', undefined, 'a'] → ['a', 'b', undefined]
 * - Numerical:    [3, undefined, 1] → [1, 3, undefined]
 * - Boolean:      [false, true, undefined] → [true, false, undefined]
 */
export const sorter = {
  /**
   * Sorts strings alphabetically, placing `undefined` values last.
   */
  alphabetically: (a?: string, b?: string): number => {
    if (a === undefined && b !== undefined) return 1;
    if (a !== undefined && b === undefined) return -1;
    return (a || "").localeCompare(b || "");
  },

  /**
   * Sorts numbers in ascending order, placing `undefined` values last.
   */
  numerically: (a?: number, b?: number): number => {
    if (a === undefined && b !== undefined) return 1;
    if (a !== undefined && b === undefined) return -1;
    return (a ?? -Infinity) - (b ?? -Infinity);
  },

  /**
   * Sorts booleans with `true` first, `false` second, and `undefined` last.
   */
  booleanally: (a?: boolean, b?: boolean): number => {
    if (a === undefined && b !== undefined) return 1;
    if (a !== undefined && b === undefined) return -1;
    return Number(b ?? false) - Number(a ?? false);
  },
};

export const copyScript = `const table = document.querySelector(".rbc-transaction-list-table");
const tableRows = Array.from(table.querySelectorAll("tbody tr")).slice(1, -1); // ignora header e última linha

const AccountType = (() => {
  const accountLabel = document.getElementById("accountSelector").children[0].textContent.trim();
  return accountLabel === "RBC Day to Day Banking(3222)" ? "Checking" : "Savings";
})();

const parseDate = str => new Date(str).toISOString().split("T")[0];
const parseValue = str => !str ? 0 : parseFloat(str.replace(/[\$,]/g, "")) || 0;

const items = [];

for (const row of tableRows) {
  const [dateCell, descCell, withdrawCell, depositCell, balanceCell] = Array.from(row.children).map(t => t.textContent.trim());

  const [Description1, Description2 = ""] = descCell.split("  ");
  const [Withdrawal, Deposit] = [withdrawCell, depositCell].map(parseValue);

  const TransactionDate = parseDate(dateCell);
  const Total = Withdrawal || Deposit;

  const Balance = (() => {
    const val = parseValue(balanceCell);
    if (val) return val;

    const sameDayItem = items.find(i => i.TransactionDate === TransactionDate);
    return sameDayItem ? sameDayItem.Balance : 0;
  })();


  items.push({ AccountType, TransactionDate, Description1, Description2, Balance, Total });
}

console.log(items);`;