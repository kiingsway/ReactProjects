import { getPagesFolders } from "@/services/getPagesFolders";
import { Button } from "antd";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import React from "react";

export const getStaticProps: GetStaticProps = async () => {
  return { props: { folders: getPagesFolders() } };
};

export default function Home({ folders }: { folders: string[] }): React.JSX.Element {

  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen w-800">
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Quick Projects</h1>

        <div className="grid grid-cols-4 gap-4">
          {(folders || []).map(folder => {
            const goTo = (): Promise<boolean> => router.push(`/${folder}`);
            return (
              <div key={folder} className="flex items-center justify-center w-full">
                <Button className="h-16 w-32" type="primary" onClick={goTo}>
                  {folder}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}