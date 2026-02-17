import { Status, STATUSES } from "@/src/domain/models/todo";

export function getNextStatus(status: Status): Status | null {
  const idx = STATUSES.indexOf(status);
  return idx < STATUSES.length - 1 ? STATUSES[idx + 1] : null;
}

export function getPrevStatus(status: Status): Status | null {
  const idx = STATUSES.indexOf(status);
  return idx > 0 ? STATUSES[idx - 1] : null;
}
