import React from 'react';
import { useRouter } from 'next/router';
import { MdKeyboardArrowRight } from 'react-icons/md';

interface Props {
  name: string;
}

export default function LearningNav({ name, children }: React.PropsWithChildren<Props>): React.JSX.Element {


  return (
    <div className="min-h-screen flex flex-col">
      <AppPageName name={name} />

      <main
        style={{ padding: '60px 20px 0 20px' }}
        className="flex-1 flex-col flex p-4 mt-16 w-full">
        {children}
      </main>
    </div>
  );
}

const AppPageName = ({ name }: { name: string }): React.JSX.Element => {

  const router = useRouter();
  const goHome = (): void => { router.push('/'); };
  const goLearningReact = (): void => { router.push('/LearningReact'); };

  const Small = ({ children, o, onClick }: React.PropsWithChildren<{ o: number, onClick?: () => void }>): React.JSX.Element => (
    <small
      onClick={onClick}
      style={{ opacity: o, fontWeight: 500, cursor: onClick ? 'pointer' : 'default' }}>
      {children}
    </small>
  );

  return (
    <nav
      style={{ backgroundColor: '#1A1A1A' }}
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className='flex gap-4 items-baseline'>
        <h1
          onClick={goHome}
          style={{ padding: 10, cursor: 'pointer', margin: 0 }}
          className="text-xl font-semibold text-blue-600 hover:text-blue-800"
        >
          Quick Projects
        </h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingLeft: 10 }}>
          <Small o={0.8} onClick={goLearningReact}>LearningReact</Small>
          <MdKeyboardArrowRight />
          <Small o={0.6}>{name}</Small>
        </div>
      </div>
    </nav>
  );
};