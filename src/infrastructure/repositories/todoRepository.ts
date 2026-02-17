import { Todo } from "@/src/domain/models/todo";
import { gqlRequest } from "@/src/infrastructure/api/graphqlClient";

export async function fetchAll(): Promise<Todo[]> {
  const data = await gqlRequest<{ todos: Todo[] }>(`
    query { todos { id text status } }
  `);
  return data.todos;
}

export async function create(text: string): Promise<Todo> {
  const data = await gqlRequest<{ createTodo: Todo }>(`
    mutation($text: String!) { createTodo(text: $text) { id text status } }
  `, { text });
  return data.createTodo;
}

export async function updateText(id: number, text: string): Promise<Todo> {
  const data = await gqlRequest<{ updateTodo: Todo }>(`
    mutation($id: ID!, $text: String) { updateTodo(id: $id, text: $text) { id text status } }
  `, { id: String(id), text });
  return data.updateTodo;
}

export async function updateStatus(id: number, status: string): Promise<Todo> {
  const data = await gqlRequest<{ updateTodo: Todo }>(`
    mutation($id: ID!, $status: String) { updateTodo(id: $id, status: $status) { id text status } }
  `, { id: String(id), status });
  return data.updateTodo;
}

export async function remove(id: number): Promise<void> {
  await gqlRequest(`
    mutation($id: ID!) { deleteTodo(id: $id) }
  `, { id: String(id) });
}
