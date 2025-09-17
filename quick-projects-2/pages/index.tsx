import React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { GetStaticProps } from 'next';
import { getPagesFolders } from '@/services/getPagesFolders';

export const getStaticProps: GetStaticProps = async () => {
  return { props: { folders: getPagesFolders() } };
};

export default function Home({ folders }: { folders: string[] }): React.JSX.Element {

  const router = useRouter();

  return (
    <div className='flex items-center justify-center min-h-screen w-800'>
      <div className='text-center flex flex-col gap-4'>
        <h1 className='text-2xl font-bold'>Quick Projects</h1>
        {!folders.length && <small>No projects created, create a folder in Pages to start.</small>}
        <div className='grid grid-cols-4 gap-4'>
          {folders.map(folder => {
            const goTo = (): Promise<boolean> => router.push(`/${folder}`);
            return <FolderButton key={folder} folder={folder} onClick={goTo} />;
          })}
        </div>
      </div>
    </div>
  );
}

interface FolderButtonProps {
  folder: string;
  onClick: () => void;
}

const FolderButton = ({ folder, onClick }: FolderButtonProps): React.JSX.Element => (
  <div key={folder} className='flex items-center justify-center w-full'>
    <Button className='h-16 w-32' type='primary' onClick={onClick}>
      {folder}
    </Button>
  </div>
);