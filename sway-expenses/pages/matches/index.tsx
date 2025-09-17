import ColDateRender from '@/components/ColumnsRender/ColDateRender';
import IconText from '@/components/Elements/IconText';
import PatternFormModal from '@/components/matches/PatternFormModal';
import useBoolean from '@/hooks/useBoolean';
import { IPatternItem } from '@/interfaces';
import { noSwrRefresh } from '@/services/constants';
import { fetcher, sorter } from '@/services/helpers';
import { normalizeCategories, normalizePatterns } from '@/services/normalizeItems';
import { Alert, Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React from 'react';
import { TbRegex } from 'react-icons/tb';
import useSWR from 'swr';

export default function Matches(): React.JSX.Element {


  const catProps = useSWR(`/api/databases/${process.env.NEXT_PUBLIC_CATEGORIES_DB_ID}`, fetcher, noSwrRefresh);
  const patProps = useSWR(`/api/databases/${process.env.NEXT_PUBLIC_PATTERNS_DB_ID}`, fetcher, noSwrRefresh);

  const { error: caterror, isLoading: cisld, data: categoriesData, mutate: updateCategories } = catProps;
  const { error: paterror, isLoading: pisld, data: patternsData, mutate: updatePatterns, isValidating } = patProps;

  const categories = normalizeCategories(categoriesData);
  const patterns = normalizePatterns(patternsData);

  const [selectedPattern, selectPattern] = React.useState<IPatternItem>();
  const [openedModal, { setTrue: openModal, setFalse: closeModal }] = useBoolean();

  const error = [paterror, caterror].join(" ").trim();
  const isError = Boolean(error);
  const isLoading = cisld || pisld;

  const setPattern = (pattern?: IPatternItem): void => {
    selectPattern(pattern);
    openModal();
  };

  const unsetPattern = (): void => {
    selectPattern(undefined);
    closeModal();
    updateCategories();
    updatePatterns();
  };

  const columns: ColumnsType<IPatternItem> = [
    {
      title: "Match", dataIndex: "Match", key: "Match",
      sorter: (a, b) => sorter.alphabetically(a.Match, b.Match),
      render: (t, item) => <Button type="text" size="small" onClick={() => setPattern(item)}>{t}</Button>
    },
    {
      title: "Title", dataIndex: "Title", key: "Title",
      sorter: (a, b) => sorter.alphabetically(a.Title, b.Title),
    },
    {
      title: "Category", dataIndex: ["Category", "name"], key: "Category",
      sorter: (a, b) => sorter.alphabetically(a.Category.name, b.Category.name)
    },
    {
      title: "Subcategory", dataIndex: ["Subcategory", "name"], key: "Subcategory",
      sorter: (a, b) => sorter.alphabetically(a.Subcategory.name, b.Subcategory.name)
    },
    {
      key: "created_time", dataIndex: "created_time", title: "Created",
      width: 150,
      render: (date: string) => <ColDateRender date={date} />
    },
    {
      key: "last_edited_time", dataIndex: "last_edited_time", title: "Modified",
      width: 150,
      render: (date: string) => <ColDateRender date={date} />
    },
  ];

  return (
    <div  className='flex flex-col gap-4'>
      <Toolbar
        onCreateClick={() => setPattern(undefined)}
        error={isError ? String(error) : ""}
        isLoading={isLoading} />

      <Table<IPatternItem>
        rowKey="id"
        dataSource={patterns}
        loading={isLoading || isValidating}
        size="small"
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />

      <PatternFormModal
        pattern={selectedPattern}
        open={openedModal}
        allCategories={categories}
        onClose={unsetPattern}
        updateData={updatePatterns}
      />
    </div>
  );
}

interface ToolbarProps {
  onCreateClick: () => void;
  error: string;
  isLoading: boolean;
}

const Toolbar = ({ error, isLoading, onCreateClick }: ToolbarProps): React.JSX.Element => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2 justify-start">
        <Button
          onClick={onCreateClick}
          type="primary"
          disabled={isLoading}>
          <IconText text="Create Pattern" icon={<TbRegex />} />
        </Button>
      </div>
    </div>
    {error ? <Alert message={String(error)} type="error" /> : <></>}
  </div>
);