// components/Apps.tsx
import React from "react";
import { Button } from "antd";
import { useRouter } from "next/router";

interface AppsProps {
  asComponent?: boolean;
}

export default function Apps({ asComponent = false }: AppsProps): React.JSX.Element {

  const router = useRouter();

  const appsList: string[] = ["addct"];
  const apps = appsList.map(key => ({ key, onClick: (): Promise<boolean> => router.push(`/apps/${key}`) }));

  const content = (
    <>
      <h1 className="font-semibold text-xl">Apps</h1>
      <div className="flex flex-col gap-y-2 max-w-[800px] w-full mx-auto">
        <div className="grid w-full gap-2 grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
          {apps.map(app => (
            <Button
              key={app.key}
              className="w-full aspect-square flex justify-center items-center"
              style={{ height: 100 }}
              onClick={app.onClick}
            >
              {app.key}
            </Button>
          ))}
        </div>
      </div>
    </>
  );

  if (asComponent) return content;

  else return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2">
      {content}
    </div>
  );
}
