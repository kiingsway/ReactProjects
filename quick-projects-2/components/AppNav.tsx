import React from 'react';
import { useRouter } from 'next/router';

interface Props {
  name: string;
}

export default function AppNav({ name, children }: React.PropsWithChildren<Props>): React.JSX.Element {

  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <AppPageName name={name} onClick={() => router.push('/')} />

      <main
        style={{ padding: '60px 20px 0 20px' }}
        className="flex-1 flex-col flex p-4 mt-16 w-full">
        {children}
      </main>
    </div>
  );
}

/**
 * Fixed Navigation
 * @returns JSX.Element
 */
const AppPageName = ({ name, onClick }: { name: string; onClick: () => void }): React.JSX.Element => (
  <nav
    style={{ backgroundColor: '#1A1A1A' }}
    className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
    <div className='flex gap-4 items-baseline'>
      <h1
        onClick={onClick}
        style={{ padding: 10, cursor: 'pointer', margin: 0 }}
        className="text-xl font-semibold text-blue-600 hover:text-blue-800"
      >
        Quick Projects
      </h1>
      <small style={{ opacity: 0.6, paddingLeft: 10, fontWeight: 500 }}>{name}</small>
    </div>
  </nav>
);