import { Alert, Button, Divider, Modal, Progress, Slider } from "antd";
import React from "react";
import IconText from "../Elements/IconText";
import useBoolean from "@/hooks/useBoolean";
import { SiNotion } from "react-icons/si";
import { IExpenseItem, IExpenseProperties, NotionPayload } from "@/interfaces";
import { saveExpenseInNotion } from "./ExpenseFormModal";
import { generateUniqueKey, getErrorMessage, getRelationProp } from "@/services/helpers";
import { TGetCategoryByName } from "@/pages/expenses";

interface Props {
  expensesLoading: boolean;
  localExpenses: IExpenseItem[];
  cloudExpenses: IExpenseItem[];
  getCategoryByName: TGetCategoryByName
  updateExpenses: () => void;
  btnProps?: {
    disabled?: boolean;
    loading?: boolean;
  }
}

const maxItemsPerExport = 100;

export default function SendNotionModal({ expensesLoading, cloudExpenses, localExpenses, btnProps, getCategoryByName, updateExpenses }: Props): React.JSX.Element {

  const [loading, { setTrue: startLoad, setFalse: stopLoad }] = useBoolean();
  const [modalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean();
  const [imports, setImports] = React.useState(1);
  const [progress, setProgress] = React.useState({ c: 0, t: 0 });
  const [error, setError] = React.useState<string>();

  const onFinish = async (): Promise<void> => {
    startLoad();
    setProgress({ c: 0, t: imports });
    const itemsToImport = getFirstUniqueLocalExpenses(localExpenses, cloudExpenses, imports)
      .filter(i => i.Category?.name && i.Subcategory?.name);

    for (let i = 0; i < itemsToImport.length; i++) {
      const item = itemsToImport[i];
      try {
        const itemData = convertExpenseToNotionData(item, getCategoryByName);
        const noCategory = Boolean(!itemData.properties.Category?.relation.length);
        const noSubcategory = Boolean(!itemData.properties.Subcategory?.relation.length);

        if (noCategory || noSubcategory) {
          const Parent = item.Category?.name;
          const Child = item.Subcategory?.name;
          if (!Parent && !Child) console.error("No category and subcategory");
          else console.error("Missing Category:", { Parent, Child });
        }

        if (!noCategory && !noSubcategory) await saveExpenseInNotion(itemData);
        setProgress(p => ({ ...p, c: p.c + 1 }))
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        setError(`Error importing ${item.BankDescription} - ` + getErrorMessage(error))
        console.error(error);
        setProgress(p => ({ ...p, c: p.c + 1 }))
      }
    }

    stopLoad();
    updateExpenses();
  }

  const localKeys = new Set(localExpenses.map(item => item.key));
  const sharedCount = cloudExpenses.filter(item => localKeys.has(item.key)).length;

  return (
    <>
      <Button
        onClick={openModal}
        type="primary"
        loading={btnProps?.loading}
        disabled={btnProps?.disabled}>
        <IconText text="Send to Notion" icon={<SiNotion />} />
      </Button>
      <Modal
        title="Send Expenses to Cloud (Notion)"
        open={modalOpen}
        onCancel={closeModal}
        onOk={onFinish}
        okText="Import"
        cancelText="Cancel"
        okButtonProps={{ disabled: loading || expensesLoading, loading: loading || expensesLoading }}
      >
        <ImportCard
          sharedCount={sharedCount}
          localExpenses={localExpenses} />
        <label htmlFor="slider">Number of imports:</label>
        <Slider
          value={imports}
          onChange={setImports}
          id="slider"
          min={1}
          max={Math.min(localExpenses.length, maxItemsPerExport)} />
        <Progress percent={Math.round((progress.c / progress.t) * 100)} />
        {!error ? <></> : <Alert message={error} type="error" closable />}
      </Modal>
    </>
  );
}

const ImportCard = ({ localExpenses, sharedCount }: { localExpenses: IExpenseItem[]; sharedCount: number }): React.JSX.Element => {

  const { missingDescription, missingCategory, missingSubcategory } = localExpenses.reduce((acc, expense) => {
    if (!expense.Description) acc.missingDescription += 1;
    if (!expense.Category) acc.missingCategory += 1;
    if (!expense.Subcategory) acc.missingSubcategory += 1;
    return acc;
  }, { missingDescription: 0, missingCategory: 0, missingSubcategory: 0 } as { missingDescription: number, missingCategory: number, missingSubcategory: number });

  const InfoField = ({ title, value }: { title: string; value: number }): React.JSX.Element => (
    <div className="flex justify-between items-center">
      <span className="font-medium text-gray-400 text-base">{title}</span>
      <span className="text-gray-300 font-bold text-base">{value}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
      {/* Missing Fields Card */}
      <div className="bg-red-950 rounded-lg shadow p-5 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Missing Fields</h2>
        <Divider style={{ margin: "0 0 10px 0" }} />
        <div className="flex flex-col gap-3">
          <InfoField title="Description" value={missingDescription} />
          <InfoField title="Category" value={missingCategory} />
          <InfoField title="Subcategory" value={missingSubcategory} />
        </div>
      </div>
      {/* Items Overview Card */}
      <div className="bg-gray-800 rounded-lg shadow p-5 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Items Overview</h2>
        <Divider style={{ margin: "0 0 10px 0" }} />
        <div className="flex flex-col gap-3">
          <InfoField title="Total" value={localExpenses.length} />
          <InfoField title="Already in Notion" value={sharedCount} />
          <InfoField title="Exclusive (to be added)" value={localExpenses.length - sharedCount} />
        </div>
      </div>
    </div>
  );
};

function getFirstUniqueLocalExpenses(localExpenses: IExpenseItem[], cloudExpenses: IExpenseItem[], x: number): IExpenseItem[] {
  const cloudKeys = new Set(cloudExpenses.map(item => item.key));

  const uniqueLocal = localExpenses.filter(item => !cloudKeys.has(item.key));

  return uniqueLocal.slice(0, x);
}

const database_id = process.env.NEXT_PUBLIC_EXPENSES_DB_ID;
const convertExpenseToNotionData = (item: IExpenseItem, getCategoryByName: TGetCategoryByName): NotionPayload<IExpenseProperties> => {

  if (!database_id) throw new Error("CRITIAL ERROR: NO EXPENSES DATABASE ID");

  const categoryId = getRelationProp(getCategoryByName(item.Category?.name)?.id);
  const subcategoryId = getRelationProp(getCategoryByName(item.Subcategory?.name)?.id);

  return {
    parent: { database_id },
    properties: {
      key: { title: [{ text: { content: item.key || generateUniqueKey() } }] },
      Account: { rich_text: [{ text: { content: item.Account } }] },
      "Account Type": { rich_text: [{ text: { content: item.AccountType } }] },
      "Bank Description": { rich_text: [{ text: { content: item.BankDescription } }] },
      Description: { rich_text: [{ text: { content: item.Description } }] },
      Date: { date: { start: item.TransactionDate } },
      ...(categoryId && { Category: categoryId }),
      ...(subcategoryId && { Subcategory: subcategoryId }),
      Balance: { number: item.Balance },
      Total: { number: item.Total }
    }
  }
};