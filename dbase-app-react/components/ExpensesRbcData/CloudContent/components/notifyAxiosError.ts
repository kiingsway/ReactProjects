import { getErrorMessage } from "@/app/services/helpers";
import { notification } from "antd";

export default function notifyAxiosError(err: unknown, message: string, title = "ERROR"): void {
  const errorMessage = getErrorMessage(err);

  notification.error({
    message: title,
    description: [message, errorMessage].filter(Boolean).join(": "),
    duration: 15,
  });
}