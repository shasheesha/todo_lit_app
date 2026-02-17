"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

type Status = "outstanding" | "inprogress" | "complete";

interface Todo {
  id: number;
  text: string;
  status: Status;
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  outstanding: { label: "Outstanding", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  inprogress: { label: "In Progress", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  complete: { label: "Complete", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
};

const STATUSES: Status[] = ["outstanding", "inprogress", "complete"];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodos(data as Todo[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  async function addTodo() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const { data, error } = await supabase
      .from("todos")
      .insert({ text, status: "outstanding" })
      .select()
      .single();
    if (error) {
      console.error("Error adding todo:", error);
      return;
    }
    setTodos((prev) => [...prev, data as Todo]);
  }

  async function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.error("Error deleting todo:", error);
      fetchTodos();
    }
  }

  async function changeStatus(id: number, status: Status) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    const { error } = await supabase.from("todos").update({ status }).eq("id", id);
    if (error) {
      console.error("Error updating status:", error);
      fetchTodos();
    }
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditText(todo.text);
  }

  async function saveEdit(id: number) {
    const text = editText.trim();
    if (!text) return;
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
    setEditingId(null);
    setEditText("");
    const { error } = await supabase.from("todos").update({ text }).eq("id", id);
    if (error) {
      console.error("Error updating todo:", error);
      fetchTodos();
    }
  }

  function getNextStatus(status: Status): Status | null {
    const idx = STATUSES.indexOf(status);
    return idx < STATUSES.length - 1 ? STATUSES[idx + 1] : null;
  }

  function getPrevStatus(status: Status): Status | null {
    const idx = STATUSES.indexOf(status);
    return idx > 0 ? STATUSES[idx - 1] : null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="mx-auto container">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Todo List</h1>
          {loading && (
            <p className="mb-4 text-sm text-gray-500">Loading todos...</p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTodo();
            }}
            className="mb-8 flex gap-2 w-full"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
        </div>

        {/* Status columns */}
        <div className="flex flex-col lg:flex-row gap-6">
          {STATUSES.map((status) => {
            const config = STATUS_CONFIG[status];
            const items = todos.filter((t) => t.status === status);

            return (
              <div key={status} className="w-full lg:w-1/3">
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
                      <li
                        key={todo.id}
                        className={`flex items-center gap-3 rounded-lg border ${config.border} ${config.bg} px-4 py-3`}
                      >
                        {editingId === todo.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              saveEdit(todo.id);
                            }}
                            className="flex flex-1 gap-2"
                          >
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                              autoFocus
                            />
                            <button type="submit" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <>
                            <span
                              className={`flex-1 text-sm ${status === "complete" ? "text-green-800 line-through" : "text-gray-800"
                                }`}
                            >
                              {todo.text}
                            </span>

                            <div className="flex items-center gap-1">
                              {getPrevStatus(status) && (
                                <button
                                  onClick={() => changeStatus(todo.id, getPrevStatus(status)!)}
                                  title={`Move to ${STATUS_CONFIG[getPrevStatus(status)!].label}`}
                                  className="rounded p-1 text-gray-400 hover:bg-white hover:text-gray-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                              {getNextStatus(status) && (
                                <button
                                  onClick={() => changeStatus(todo.id, getNextStatus(status)!)}
                                  title={`Move to ${STATUS_CONFIG[getNextStatus(status)!].label}`}
                                  className="rounded p-1 text-gray-400 hover:bg-white hover:text-gray-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={() => startEdit(todo)}
                                title="Edit"
                                className="rounded p-1 text-gray-400 hover:bg-white hover:text-gray-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteTodo(todo.id)}
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
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
