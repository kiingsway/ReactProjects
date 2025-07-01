import IconText from "@/components/IconText";
import useBoolean from "@/hooks/useBoolean";
import { Button, Input, Modal } from "antd";
import React from "react";
import { IoMdAdd, IoMdCopy } from "react-icons/io";
import { copyScript, parseStringArray } from "./helpers";

interface Props {
	// eslint-disable-next-line no-unused-vars
	onRealData: (data: unknown[]) => void;
}

export default function AddJsonModal({ onRealData }: Props): React.JSX.Element {

	const [jsonText, setJsonText] = React.useState("");
	const [modalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean();

	const onCopy = async (): Promise<void> => {
		try {
			await navigator.clipboard.writeText(copyScript);
		} catch (error) {
			console.error("Failed to copy script:", error);
		}
	};

	const [data, isArray] = React.useMemo(() => {
		const data = parseStringArray(jsonText) || [];
		return [data, Boolean(data?.length)];
	}, [jsonText]);

	const onFinish = (): void => {
		if (!jsonText || !isArray) return;
		onRealData(data);
		closeModal();
	};

	return (
		<>
			<Button type="primary" onClick={openModal}>
				<IconText icon={<IoMdAdd />} text="Add JSON" />
			</Button>
			<Modal
				title="Importar JSON"
				open={modalOpen}
				onCancel={closeModal}
				onOk={onFinish}
				okText="Import"
				cancelText="Cancel"
				okButtonProps={{ disabled: !isArray }}
			>
				<div className="flex flex-col gap-4">
					<div className="flex gap-4 justify-between items-center">
						<p>Paste your JSON content here:</p>
						<Button onClick={onCopy}><IconText icon={<IoMdCopy />} text="Copy Script" /></Button>
					</div>
					<Input.TextArea
						rows={8}
						value={jsonText}
						onChange={e => setJsonText(e.target.value)}
						placeholder='Ex: [{Date: 123, Value: 999.99}, ...]'
					/>
				</div>
			</Modal>
		</>
	);
}