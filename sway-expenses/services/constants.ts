export const noSwrRefresh = {
  refreshInterval: 0,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: false,
};

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
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