export type Status = "outstanding" | "inprogress" | "complete";

export interface Todo {
  id: number;
  text: string;
  status: Status;
}

export const STATUSES: Status[] = ["outstanding", "inprogress", "complete"];
