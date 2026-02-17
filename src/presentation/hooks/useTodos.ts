"use client";

import { useState, useEffect } from "react";
import { Todo, Status } from "@/src/domain/models/todo";
import * as todoRepo from "@/src/infrastructure/repositories/todoRepository";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    todoRepo.fetchAll().then((data) => {
      if (!cancelled) {
        setTodos(data);
        setLoading(false);
      }
    }).catch((error) => {
      console.error("Error fetching todos:", error);
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  async function fetchTodos() {
    try {
      const data = await todoRepo.fetchAll();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  async function addTodo() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    try {
      const created = await todoRepo.create(text);
      setTodos((prev) => [...prev, created]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  async function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await todoRepo.remove(id);
    } catch (error) {
      console.error("Error deleting todo:", error);
      fetchTodos();
    }
  }

  async function changeStatus(id: number, status: Status) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await todoRepo.updateStatus(id, status);
    } catch (error) {
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
    try {
      await todoRepo.updateText(id, text);
    } catch (error) {
      console.error("Error updating todo:", error);
      fetchTodos();
    }
  }

  return {
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
  };
}
