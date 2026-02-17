"use client";

import { Todo, Status } from "@/src/domain/models/todo";
import { STATUS_CONFIG } from "@/src/presentation/constants/statusConfig";
import { TodoItem } from "./TodoItem";

interface StatusColumnProps {
  status: Status;
  todos: Todo[];
  editingId: number | null;
  editText: string;
  onEditTextChange: (value: string) => void;
  onStartEdit: (todo: Todo) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  onChangeStatus: (id: number, status: Status) => void;
  onDelete: (id: number) => void;
}

export function StatusColumn({
  status,
  todos,
  editingId,
  editText,
  onEditTextChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onChangeStatus,
  onDelete,
}: StatusColumnProps) {
  const config = STATUS_CONFIG[status];
  const items = todos.filter((t) => t.status === status);

  return (
    <div className="w-full lg:w-1/3">
      <div className="mb-2 flex items-center gap-2">
        <h2 className={`text-lg font-semibold ${config.color}`}>{config.label}</h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 py-4 text-center text-sm text-gray-400">
          No {config.label.toLowerCase()} tasks
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              editingId={editingId}
              editText={editText}
              onEditTextChange={onEditTextChange}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onChangeStatus={onChangeStatus}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
