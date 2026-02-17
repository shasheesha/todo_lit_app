"use client";

import { Todo, Status } from "@/src/domain/models/todo";
import { getNextStatus, getPrevStatus } from "@/src/domain/helpers/statusHelpers";
import { STATUS_CONFIG } from "@/src/presentation/constants/statusConfig";

interface TodoItemProps {
  todo: Todo;
  editingId: number | null;
  editText: string;
  onEditTextChange: (value: string) => void;
  onStartEdit: (todo: Todo) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  onChangeStatus: (id: number, status: Status) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({
  todo,
  editingId,
  editText,
  onEditTextChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onChangeStatus,
  onDelete,
}: TodoItemProps) {
  const config = STATUS_CONFIG[todo.status];
  const prev = getPrevStatus(todo.status);
  const next = getNextStatus(todo.status);

  return (
    <li className={`flex items-center gap-3 rounded-lg border ${config.border} ${config.bg} px-4 py-3`}>
      {editingId === todo.id ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSaveEdit(todo.id);
          }}
          className="flex flex-1 gap-2"
        >
          <input
            type="text"
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
            autoFocus
          />
          <button type="submit" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Save
          </button>
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <span
            className={`flex-1 text-sm ${todo.status === "complete" ? "text-green-800 line-through" : "text-gray-800"}`}
          >
            {todo.text}
          </span>

          <div className="flex items-center gap-1">
            {prev && (
              <button
                onClick={() => onChangeStatus(todo.id, prev)}
                title={`Move to ${STATUS_CONFIG[prev].label}`}
                className="rounded p-1 text-gray-400 hover:bg-white hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            {next && (
              <button
                onClick={() => onChangeStatus(todo.id, next)}
                title={`Move to ${STATUS_CONFIG[next].label}`}
                className="rounded p-1 text-gray-400 hover:bg-white hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            <button
              onClick={() => onStartEdit(todo)}
              title="Edit"
              className="rounded p-1 text-gray-400 hover:bg-white hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              title="Delete"
              className="rounded p-1 text-gray-400 hover:bg-white hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </>
      )}
    </li>
  );
}
