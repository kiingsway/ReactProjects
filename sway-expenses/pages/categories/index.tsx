import CategoryFormModal from '@/components/categories/CategoryFormModal';
import ColDateRender from '@/components/ColumnsRender/ColDateRender';
import IconText from '@/components/Elements/IconText';
import useBoolean from '@/hooks/useBoolean';
import { ICategoryItem } from '@/interfaces';
import { noSwrRefresh } from '@/services/constants';
import { fetcher } from '@/services/helpers';
import { normalizeCategories } from '@/services/normalizeItems';
import { Table, Button, Alert, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react'
import { BsArrowClockwise } from 'react-icons/bs';
import { TbCategoryPlus } from 'react-icons/tb';
import useSWR from 'swr';

export default function Categories() {

  const [selectedCategory, selectCategory] = React.useState<ICategoryItem>();
  const [openedModal, { setTrue: openModal, setFalse: closeModal }] = useBoolean();

  const catProps = useSWR(`/api/databases/${process.env.NEXT_PUBLIC_CATEGORIES_DB_ID}`, fetcher, noSwrRefresh);
  const { error, isLoading, data: categoriesData, isValidating, mutate: updateCategories } = catProps;

  const categories = normalizeCategories(categoriesData);
  const isError = Boolean(error);

  const setCategory = (category?: ICategoryItem): void => {
    selectCategory(category);
    openModal();
  };

  const unsetCategory = (): void => {
    selectCategory(undefined);
    closeModal();
    updateCategories();
  };

  const columns: ColumnsType<ICategoryItem> = [
    {
      key: "Title", dataIndex: "Title", title: "Title",
      render: (t, item) => <Button type="text" size="small" onClick={() => setCategory(item)}>{t}</Button>
    },
    {
      key: "Parent", dataIndex: ["Parent", "name"], title: "Parent",
      render: (_, item) => item.Parent.map(c => c.name).join(", "),
    },
    {
      key: "Children", dataIndex: ["Children", "name"], title: "Children",
      render: (_, item) => item.Children.map(c => c.name).join(", "),
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
    <div className='flex flex-col gap-4'>

      <Toolbar
        updateData={updateCategories}
        onCreateClick={() => setCategory(undefined)}
        error={isError ? String(error) : ""}
        isValidating={isValidating}
        isLoading={isLoading} />

      <Table
        rowKey="id"
        dataSource={categories}
        loading={isLoading || isValidating}
        size="small"
        columns={columns}
        pagination={{
          hideOnSinglePage: true,
          pageSize: 50,
          pageSizeOptions: [50, 100]
        }}
      />

      <CategoryFormModal
        category={selectedCategory}
        open={openedModal}
        allCategories={categories}
        onClose={unsetCategory}
        updateData={updateCategories}
      />
    </div>
  )
}

interface ToolbarProps {
  updateData: () => void;
  onCreateClick: () => void;
  error: string;
  isLoading: boolean;
  isValidating: boolean;
}

const Toolbar = ({ error, isLoading, isValidating, updateData, onCreateClick }: ToolbarProps): React.JSX.Element => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2 justify-start">
        <Button
          onClick={onCreateClick}
          type="primary"
          disabled={isLoading}>
          <IconText text="Create Category" icon={<TbCategoryPlus />} />
        </Button>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <Tooltip title="Update data">
          <Button
            onClick={updateData}
            type="text"
            loading={isLoading || isValidating}
            disabled={isLoading}>
            <IconText icon={<BsArrowClockwise />} />
          </Button>
        </Tooltip>
      </div>
    </div>
    {error ? <Alert message={String(error)} type="error" /> : <></>}
  </div>
);