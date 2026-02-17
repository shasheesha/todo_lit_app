"use client";

interface AddTodoFormProps {
  input: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
}

export function AddTodoForm({ input, onInputChange, onAdd }: AddTodoFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd();
      }}
      className="mb-8 flex gap-2 w-full"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Add
      </button>
    </form>
  );
}
