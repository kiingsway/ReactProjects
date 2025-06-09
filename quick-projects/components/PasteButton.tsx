import { Button } from "antd";
import { BiPaste } from "react-icons/bi";

type PasteButtonProps = {
  // eslint-disable-next-line no-unused-vars
  onPaste: (text: string) => void;
};

export default function PasteButton({ onPaste }: PasteButtonProps): React.JSX.Element {
  const handlePaste = async (): Promise<void> => {
    try {
      const text = await navigator.clipboard.readText();
      onPaste(text);
    } catch (err) {
      console.error("Erro ao colar texto:", err);
    }
  };

  return (
    <Button
      icon={<BiPaste />}
      type="text"
      style={{ padding: 0 }}
      onClick={handlePaste}
    />
  );
}
