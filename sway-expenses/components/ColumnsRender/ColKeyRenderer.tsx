import { Tooltip, Button } from 'antd';
import React, { JSX } from 'react';
import { BsKeyFill, BsKey } from 'react-icons/bs';

export default function ColKeyRenderer({ hashKey }: { hashKey: string }): React.JSX.Element {

  const Icon = (): JSX.Element => hashKey ? <BsKeyFill /> : <BsKey color="red" />;

  return (
    <Tooltip title={String(hashKey)}>
      <Button
        size="small"
        type="text"
        icon={<Icon />}
        style={{ cursor: "default" }} />
    </Tooltip>
  );
}