import AppNav from '@/components/AppNav';
import { getLearningPagesFolders } from '@/services/getLearningPagesFolders';
import { Button } from 'antd';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

export const getStaticProps: GetStaticProps = async () => {
  return { props: { folders: getLearningPagesFolders() } };
};

export default function LearningReact({ folders }: { folders: string[] }): React.JSX.Element {

  const router = useRouter();

  return (
    <AppNav name={LearningReact.name}>
      <small style={{ padding: '10px 0 30px 0' }}>Select a page of learning</small>
      <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
        {folders.map(folder => {

          const onClick = (): void => { router.push(`/LearningReact/${folder}`); };

          return (
            <Button
              onClick={onClick}
              style={{ height: 90 }}
              type='primary'
              size='large'
              key={folder}>
              {folder}
            </Button>
          );
        })}
      </div>
    </AppNav>
  );
}