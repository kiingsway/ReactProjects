import React from 'react';
import { useRouter } from 'next/router';
import { Input, Radio, Select, Tooltip } from 'antd';
import { GetStaticProps } from 'next';
import { FolderInfo, getFolders } from '@/services/server-scripts/getFolders';
import { ISort } from '@/interfaces';
import { rawText } from '@/services/scripts/rawText';
import { formatBytes } from '@/services/helpers';
import { DateTime } from 'luxon';
import { IoSearchSharp, IoSwapVertical, IoArrowUp, IoArrowDown } from 'react-icons/io5';
import { LuFolderPlus } from 'react-icons/lu';
import { MdMemory } from 'react-icons/md';
import { TbClockEdit } from 'react-icons/tb';
import styles from './styles/Pages.module.scss';

export const getStaticProps: GetStaticProps = async () => {
  return { props: { folders: getFolders() } };
};

const storageKey = 'quickProjectsSort';
const initialSort: ISort = { prop: 'name', order: 'asc' };

export default function Home({ folders }: { folders: FolderInfo[] }): React.JSX.Element {

  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState<ISort>(initialSort);

  React.useEffect(() => {
    const savedSort = localStorage.getItem(storageKey);
    if (savedSort) {
      try {
        setSort(JSON.parse(savedSort));
      } catch { }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(sort));
  }, [sort]);

  const filteredFolders = React.useMemo(() => {
    const filtered = !search ? folders : folders.filter(f => rawText(f.name).includes(rawText(search)));
    return filtered.sort((a, b) => {

      const [aProp, bProp] = [a[sort.prop], b[sort.prop]];

      const aValue: string | number = typeof aProp === 'number' ? aProp : rawText(aProp);
      const bValue: string | number = typeof bProp === 'number' ? bProp : rawText(bProp);

      if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [folders, search, sort]);

  return (
    <div className='flex items-center justify-center min-h-screen w-800'>
      <div className='text-center flex flex-col gap-4'>
        <h1 className='text-2xl font-bold'>Quick Projects</h1>
        {!folders.length && <small>No projects created, create a folder in Pages to start.</small>}
        <Toolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />
        <PagesList folders={filteredFolders} />
      </div>
    </div>
  );
}

interface ToolbarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  sort: ISort;
  setSort: React.Dispatch<React.SetStateAction<ISort>>
}

const Toolbar = ({ search, setSearch, sort, setSort }: ToolbarProps): React.JSX.Element => {

  const changePropSort = (prop: ISort['prop']): void => setSort(prev => ({ ...prev, prop }));
  const changeOrderSort = (order: ISort['order']): void => setSort(prev => ({ ...prev, order }));

  return (
    <div className={styles.main}>

      <div className={styles.toolbar}>

        <Tooltip title='Search'>
          <IoSearchSharp size={20} />
        </Tooltip>

        <Input
          size='small'
          placeholder='Search page...'
          value={search}
          onChange={e => setSearch(e.target.value)} />

        <div className={styles.toolbar_sorter}>
          <Tooltip title='Sort by'>
            <IoSwapVertical />
          </Tooltip>

          <Select
            size='small'
            id='sort'
            style={{ width: 160 }}
            value={sort.prop}
            onChange={changePropSort}
            options={[
              { label: 'Name', value: 'name' },
              { label: 'Created', value: 'created' },
              { label: 'Modified', value: 'modified' },
              { label: 'Size', value: 'size' },
            ]}
          />
          <Radio.Group size='small' value={sort.order} onChange={e => changeOrderSort(e.target.value)}>
            <Tooltip title='Ascending'>
              <Radio.Button value='asc'><IoArrowUp /></Radio.Button>
            </Tooltip>
            <Tooltip title='Descending'>
              <Radio.Button value='dsc'><IoArrowDown /></Radio.Button>
            </Tooltip>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};

interface PagesListProps {
  folders: FolderInfo[]
}

const PagesList = ({ folders }: PagesListProps): React.JSX.Element => {

  const router = useRouter();

  const FolderPage = ({ folder }: { folder: FolderInfo }): React.JSX.Element => {

    const onClick = (): void => { router.push(`/${folder.name}`); };

    const format = 'dd/LL/yy HH:mm';
    const formatDate = (date: string): string => DateTime.fromISO(date).toFormat(format);

    return (
      <div className={styles.folders_folder}>

        <button type='button' onClick={onClick}>{folder.name}</button>

        <div className={styles.folders_folder_info}>

          <Tooltip title="Size">
            <div className={styles.folders_icon}>
              <MdMemory />
              <small>{formatBytes(folder.size)}</small>
            </div>
          </Tooltip>

          <Tooltip title="Modified">
            <div className={styles.folders_icon}>
              <TbClockEdit />
              <small>{formatDate(folder.modified)}</small>
            </div>
          </Tooltip>

          <Tooltip title="Created">
            <div className={styles.folders_icon}>
              <LuFolderPlus />
              <small>{formatDate(folder.created)}</small>
            </div>
          </Tooltip>

        </div>
        <hr />
      </div>
    );
  };

  return (
    <div className={styles.main}>
      <div className={styles.folders}>
        {folders.map(f => <FolderPage key={f.name} folder={f} />)}
      </div>
    </div>
  );
};