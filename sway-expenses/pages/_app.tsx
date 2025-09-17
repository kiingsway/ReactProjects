import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import "antd/dist/reset.css";
import "./styles/globals.css";
import { Layout, Menu, ConfigProvider, theme, Alert } from "antd";
const { Header, Content, Footer, Sider } = Layout;
import React from "react";
import useBoolean from "@/hooks/useBoolean";
import { GiPayMoney } from "react-icons/gi";
import { MdCategory } from "react-icons/md";
import { FaChartPie } from "react-icons/fa";
import { AiOutlineSetting } from "react-icons/ai";
import { BsRegex } from "react-icons/bs";
import { useRouter } from "next/router";
import { RiBankFill } from "react-icons/ri";
import { VscRegex } from "react-icons/vsc";
import { rawText } from "@/services/helpers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function MyApp({ Component, pageProps }: AppProps): React.JSX.Element {

  const router = useRouter();
  const [menuOpened, { set: setMenuOpen }] = useBoolean();

  const tabs = [
    { key: "dash", label: "Dashboard", icon: <FaChartPie /> },
    { key: "expe", label: "Expenses", icon: <GiPayMoney /> },
    { key: "cate", label: "Categories", icon: <MdCategory /> },
    { key: "matc", label: "Matches", icon: <VscRegex /> },
    { key: "gtct", label: "Get-Categories", icon: <VscRegex /> },
    { key: "maed", label: "Matches-Editor", icon: <BsRegex /> },
    { key: "hmbk", label: "HomeBank", icon: <RiBankFill /> },
    { key: "sett", label: "Settings", icon: <AiOutlineSetting /> },
  ];

  const goTo = (key: string): void => {
    const tab = tabs.find(t => rawText(t.key) === rawText(key))?.label;
    if (!tab) return;
    if (key === "dash") router.push("/");
    else router.push(`/${tab.toLowerCase()}`);
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <main className={montserrat.className}>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsible collapsed={menuOpened} onCollapse={setMenuOpen}>
            <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              defaultSelectedKeys={["dash"]}
              mode="inline"
              items={tabs}
              onClick={({ key }) => goTo(key)}
            />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, background: "#222" }} />
            <Content style={{ margin: "16px" }}>
              <div style={{ padding: 24, minHeight: 360 }}>
                <Alert.ErrorBoundary>
                  <Component {...pageProps} />
                </Alert.ErrorBoundary>
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Expenses App ©{new Date().getFullYear()} Created by Sway
            </Footer>
          </Layout>
        </Layout>
      </main>
    </ConfigProvider>
  );
}