import IconText from "@/components/IconText";
import { graphUrl } from "@/services/consts";
import useBoolean from "@/services/hooks/useBoolean";
import { Button, Input, Modal } from "antd";
import React from "react";
import { TbExternalLink } from "react-icons/tb";
import PasteButton from "@/components/PasteButton";
import { getMe } from "@/services/graph/getMe";
import { IMe } from "@/interfaces";

interface Props {
  displayName?: string;
  token: string;
  // eslint-disable-next-line no-unused-vars
  onLogin: (newToken: string, newMe: IMe) => void;
  loading: boolean;
}

export default function HeaderLogin({ displayName, token, onLogin, loading: dataLoading }: Props): React.JSX.Element {

  const [tempToken, setTempToken] = React.useState(token);
  const [loading, { setTrue: startLoad, setFalse: stopLoad }] = useBoolean();
  const [loginModal, { setTrue: openLoginModal, setFalse: closeLoginModal }] = useBoolean();

  React.useEffect(() => {
    setTempToken(token);
  }, [token]);

  const login = (): void => {
    startLoad();
    getMe(tempToken)
      .then(me => {
        onLogin(tempToken, me.data);
        closeLoginModal();
      })
      .finally(stopLoad);
  };

  const GoToGraph = (): React.JSX.Element => (
    <Button type="link" style={{ padding: 0 }} href={graphUrl} target="_blank" >
      <IconText icon={<TbExternalLink />} text="Graph Explorer" iconPosition="right" />
    </Button>
  );

  const ModalTitle = (): React.JSX.Element => <>Login via <GoToGraph /></>;

  return (
    <div className="flex items-center" style={{ justifyContent: "flex-end" }}>
      <Button type="text" onClick={openLoginModal} loading={dataLoading} disabled={dataLoading}>{displayName || "Login"}</Button>
      <Modal
        onOk={login}
        okButtonProps={{ disabled: !tempToken.length || loading, loading }}
        open={loginModal}
        onCancel={closeLoginModal}
        title={<ModalTitle />}>
        <div className="flex flex-col gap-4">
          <Input
            value={tempToken}
            onChange={e => setTempToken(e.target.value)}
            placeholder="Graph Token..."
            suffix={<PasteButton onPaste={setTempToken} />} />
        </div>
      </Modal>
    </div>
  );
}