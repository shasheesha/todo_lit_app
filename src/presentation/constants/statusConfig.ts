import { Status } from "@/src/domain/models/todo";

export const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  outstanding: { label: "Outstanding", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  inprogress: { label: "In Progress", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  complete: { label: "Complete", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
};
