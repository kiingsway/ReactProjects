import React from 'react';
import styles from './Toolbar.module.scss';
import { Button, Dropdown, Tooltip } from 'antd';
import { IAddctType, maskString } from '@/pages/AddctApp';
import { IoSync } from 'react-icons/io5';

interface Props {
  types: IAddctType[] | undefined;
  // eslint-disable-next-line no-unused-vars
  openForm: (type: IAddctType | undefined) => void;
  isLoading: boolean;
  onUpdate: () => void
}

export default function Toolbar({ types, openForm, isLoading, onUpdate }: Props): React.JSX.Element {

  type TPosNegTypes = { positiveTypes: IAddctType[]; negativeTypes: IAddctType[] };

  const { positiveTypes, negativeTypes } = React.useMemo<TPosNegTypes>(() => {
    if (!types?.length) return { positiveTypes: [], negativeTypes: [] };

    return types.reduce<TPosNegTypes>(
      (acc, type) => {
        (type.points >= 0 ? acc.positiveTypes : acc.negativeTypes).push(type);
        return acc;
      },
      { positiveTypes: [], negativeTypes: [] }
    );
  }, [types]);

  return (
    <div className={styles.main}>

      <Button
        disabled={!types || !types.length}
        onClick={() => openForm(undefined)}
        size='large'
        style={{ height: 90, width: 128 }}
        type='primary'>
        New
      </Button>

      <div className={styles.btns}>

        <div className={styles.btns_line}>
          {positiveTypes.map(type => {
            return (
              <Dropdown.Button
                key={type.id}
                style={{ width: 'auto' }}
                menu={{ items: [{ key: 'dt', label: 'Add with Details', onClick: () => openForm(type) }] }}
              >
                {maskString(type.title)}
              </Dropdown.Button>
            );
          })}
        </div>
        <hr style={{ width: '100%' }} />
        <div className={styles.btns_line}>
          {negativeTypes.map(type => {
            return (
              <Dropdown.Button
                key={type.id}
                style={{ width: 'auto' }}
                menu={{ items: [{ key: 'dt', label: 'Add with Details', onClick: () => openForm(type) }] }}
              >
                {maskString(type.title)}
              </Dropdown.Button>
            );
          })}
        </div>
      </div>

      <div className={styles.btns}>
        <Tooltip title={isLoading ? 'Updating data...' : 'Update data'}>
          <Button
            disabled={isLoading}
            onClick={onUpdate}
            size='large'
            style={{ height: 90, width: 60, color: 'white', opacity: 0.5 }}
            type='text'
            loading={isLoading}
            icon={isLoading ? <></> : <IoSync />}
          />
        </Tooltip>
      </div>
    </div>
  );
}