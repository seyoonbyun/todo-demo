const input = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const list = document.getElementById("todo-list");
const tabs = document.querySelectorAll(".tab");

let filter = "all";
let todos = [
	{ id: 1, text: "아이템 추가", done: false },
	{ id: 2, text: "냠냠냠", done: false },
];

const render = () => {
	list.innerHTML = "";

	const visible = todos.filter((todo) => {
		if (filter === "active") return !todo.done;
		if (filter === "done") return todo.done;
		return true;
	});

	visible.forEach((todo) => {
		const item = document.createElement("li");
		item.className = "list__item";

		const text = document.createElement("span");
		text.className = "list__text";
		text.textContent = todo.text;
		if (todo.done) text.classList.add("is-done");

		const actions = document.createElement("div");
		actions.className = "list__actions";

		const toggle = document.createElement("button");
		toggle.type = "button";
		toggle.textContent = "Check";
		toggle.addEventListener("click", () => toggleTodo(todo.id));

		const remove = document.createElement("button");
		remove.type = "button";
		remove.textContent = "Delete";
		remove.addEventListener("click", () => deleteTodo(todo.id));

		actions.appendChild(toggle);
		actions.appendChild(remove);

		item.appendChild(text);
		item.appendChild(actions);
		list.appendChild(item);
	});
};

const addTodo = () => {
	const value = input.value.trim();
	if (!value) return;

	const nextId = Date.now();
	todos.push({ id: nextId, text: value, done: false });
	input.value = "";
	render();
};

const toggleTodo = (id) => {
	todos = todos.map((todo) =>
		todo.id === id ? { ...todo, done: !todo.done } : todo
	);
	render();
};

const deleteTodo = (id) => {
	todos = todos.filter((todo) => todo.id !== id);
	render();
};

addButton.addEventListener("click", addTodo);
input.addEventListener("keydown", (event) => {
	if (event.key === "Enter") addTodo();
});

tabs.forEach((tab) => {
	tab.addEventListener("click", () => {
		tabs.forEach((btn) => btn.classList.remove("is-active"));
		tab.classList.add("is-active");
		filter = tab.dataset.filter;
		render();
	});
});

render();
