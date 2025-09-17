import IconText from "@/components/Elements/IconText";
import CloudExpenses from "@/components/expenses/CloudExpenses";
import ImportExpenses from "@/components/expenses/ImportExpenses";
import ManageDuplicates from "@/components/expenses/ManageDuplicates";
import { usePaginatedNotion } from "@/hooks/usePaginatedNotion";
import { ICategoryItem, IRbcItem } from "@/interfaces";
import { noSwrRefresh } from "@/services/constants";
import { fetcher, getErrorMessage } from "@/services/helpers";
import { normalizeCategories, normalizeExpenses } from "@/services/normalizeItems";
import { Input, Tabs } from "antd";
import React from "react";
import { BiImport } from "react-icons/bi";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { MdCloud } from "react-icons/md";
import useSWR from "swr";

export type TGetCategoryByName = (catName?: string) => ICategoryItem | undefined;

export default function Expenses(): React.JSX.Element {

  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState<IRbcItem[]>();

  const expProps = usePaginatedNotion(process.env.NEXT_PUBLIC_EXPENSES_DB_ID!);
  const { error: expError, isLoading: expIL, data: expensesData, updateData: updateExpenses } = expProps;

  const catProps = useSWR(`/api/databases/${process.env.NEXT_PUBLIC_CATEGORIES_DB_ID}`, fetcher, noSwrRefresh);
  const { error: catError, isLoading: catIL, isValidating: catIV, data: categoriesData } = catProps;

  const errors = [expError, catError].filter(Boolean).map(getErrorMessage);

  const isLoading = expIL || catIL;
  const isValidating = catIV;

  const expenses = normalizeExpenses(expensesData);
  const categories = normalizeCategories(categoriesData);

  const addData = (data: unknown[], concat: boolean): void => {
    setData(prev => {
      const newData = data as IRbcItem[];

      if (!concat) return newData;

      // Cria um Set com as chaves existentes em newData
      const newKeys = new Set(newData.map(item => item.key));

      // Filtra prev (dados já existentes) removendo duplicados
      const filteredPrev = (prev || []).filter(item => !newKeys.has(item.key));

      // Concatena mantendo apenas os itens da primeira array em caso de duplicidade
      return [...newData, ...filteredPrev];
    });
  };

  const getCategoryByName: TGetCategoryByName = catName => !catName ? undefined : categories.find(c => c.Title === catName);

  const tabs = [
    {
      key: "clo", label: <IconText text="Cloud" icon={<MdCloud />} />,
      children: (
        <CloudExpenses
          errors={errors}
          isLoading={isLoading}
          isValidating={isValidating}
          expenses={expenses}
          categories={categories}
          updateExpenses={updateExpenses}
          search={search} />
      )
    },
    {
      key: "dup", label: <IconText text="Manage Duplicates" icon={<HiOutlineDocumentDuplicate />} />,
      children: <ManageDuplicates
        expenses={expenses}
        isValidating={isValidating}
        updateExpenses={updateExpenses} />
    },
    {
      key: "imp", label: <IconText text="Import Data" icon={<BiImport />} />,
      children: <ImportExpenses
        loading={isLoading}
        updateExpenses={updateExpenses}
        search={search}
        addData={addData}
        rbcItems={data}
        expensesData={expenses}
        getCategoryByName={getCategoryByName} />
    },
  ];

  return (
    <div className="flex flex-col gap-4 items-center">
      <Input
        style={{ maxWidth: 250 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search..." />
      <Tabs
        type="card"
        items={tabs}
        defaultActiveKey="1"
        className="w-full"
        style={{ marginBottom: 32 }}
      />
    </div>
  );
}