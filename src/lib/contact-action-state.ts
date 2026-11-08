export type ContactActionState = {
  success: boolean;
  status: "idle" | "success" | "warning" | "error";
  message: string;
};

export const initialContactActionState: ContactActionState = { success: false, status: "idle", message: "" };
