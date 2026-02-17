"use client";

import { STATUSES } from "@/src/domain/models/todo";
import { useTodos } from "@/src/presentation/hooks/useTodos";
import { AddTodoForm } from "./AddTodoForm";
import { StatusColumn } from "./StatusColumn";

export function TodoPage() {
  const {
    todos,
    input,
    setInput,
    editingId,
    setEditingId,
    editText,
    setEditText,
    loading,
    addTodo,
    deleteTodo,
    changeStatus,
    startEdit,
    saveEdit,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="mx-auto container">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Todo List</h1>
          {loading && (
            <p className="mb-4 text-sm text-gray-500">Loading todos...</p>
          )}
          <AddTodoForm input={input} onInputChange={setInput} onAdd={addTodo} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {STATUSES.map((status) => (
            <StatusColumn
              key={status}
              status={status}
              todos={todos}
              editingId={editingId}
              editText={editText}
              onEditTextChange={setEditText}
              onStartEdit={startEdit}
              onSaveEdit={saveEdit}
              onCancelEdit={() => setEditingId(null)}
              onChangeStatus={changeStatus}
              onDelete={deleteTodo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
