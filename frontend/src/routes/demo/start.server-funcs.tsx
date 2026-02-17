import fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { CheckCircle2, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

/*
const loggingMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    console.log("Request:", request.url);
    return next();
  }
);
const loggedServerFunction = createServerFn({ method: "GET" }).middleware([
  loggingMiddleware,
]);
*/

const TODOS_FILE = "todos.json";

async function readTodos() {
	return JSON.parse(
		await fs.promises.readFile(TODOS_FILE, "utf-8").catch(() =>
			JSON.stringify(
				[
					{ id: 1, name: "Get groceries" },
					{ id: 2, name: "Buy a new phone" },
				],
				null,
				2,
			),
		),
	);
}

const getTodos = createServerFn({
	method: "GET",
}).handler(async () => await readTodos());

const addTodo = createServerFn({ method: "POST" })
	.inputValidator((d: string) => d)
	.handler(async ({ data }) => {
		const todos = await readTodos();
		todos.push({ id: todos.length + 1, name: data });
		await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2));
		return todos;
	});

export const Route = createFileRoute("/demo/start/server-funcs")({
	component: Home,
	loader: async () => await getTodos(),
});

function Home() {
	const router = useRouter();
	const todos = Route.useLoaderData();

	const [todo, setTodo] = useState("");

	const submitTodo = useCallback(async () => {
		await addTodo({ data: todo });
		setTodo("");
		router.invalidate();
	}, [todo, router.invalidate]);

	return (
		<div className="w-full bg-background">
			<div className="w-full px-6 py-8">
				<div className="flex items-center justify-center min-h-screen">
					<div className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
						<div className="flex items-center gap-2 mb-4">
							<CheckCircle2 className="h-5 w-5 text-green-400" />
							<Badge variant="secondary">Server Functions Demo</Badge>
						</div>
						<h2 className="text-foreground text-2xl font-semibold mb-2">
							Todo List with Server Functions
						</h2>
						<p className="text-muted-foreground mb-4">
							Add and manage todos using server functions
						</p>
						<div className="space-y-4">
							{todos && todos.length > 0 && (
								<div className="space-y-2">
									<h3 className="text-sm font-medium text-foreground">
										Your Todos
									</h3>
									<ul className="space-y-2">
										{todos.map((t: { id: number; name: string }) => (
											<li
												key={t.id}
												className="flex items-center gap-3 bg-muted/50 border border-border rounded-lg p-3"
											>
												<CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
												<span className="text-foreground">{t.name}</span>
											</li>
										))}
									</ul>
								</div>
							)}
							<div className="space-y-3">
								<h3 className="text-sm font-medium text-foreground">
									Add New Todo
								</h3>
								<div className="flex gap-2">
									<Input
										type="text"
										value={todo}
										onChange={(e) => setTodo(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												submitTodo();
											}
										}}
										placeholder="Enter a new todo..."
										className="flex-1"
									/>
									<Button
										onClick={submitTodo}
										disabled={todo.trim().length === 0}
										className="shrink-0"
									>
										<Plus className="h-4 w-4 mr-2" />
										Add
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
