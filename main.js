// HTML 요소 가져오기
const input = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const list = document.getElementById("todo-list");
const tabs = document.querySelectorAll(".tab");

// 필터 상태
let filter = "all";

// + 버튼을 클릭하면 할일이 추가된다
// delete버튼을 누르면 할일이 삭제된다
// check버튼을 누르면 할일이 끝나면서 밑줄이 간다
// 진행중, 끝남 탭을 누르면 여더바가 이동한다
// 끝남탭은 끝남아이템만, 진행중탭은 진행중 아이템만
// 전체 탭을 누르면 다시 전체아이템으로 돌아옴

let taskList = [
	{ id: 1, text: "할일추가하기 앱 완성하기", isComplete: false },
	{ id: 2, text: "냠냠냠", isComplete: false },
	{ id: 3, text: "명절이지만", isComplete: false },
	{ id: 4, text: "과제는 해야해", isComplete: false },
];

// 화면에 렌더링
const render = () => {
	list.innerHTML = "";

	// 필터에 따라 표시할 목록 정하기
	let visible = [];
	for (let i = 0; i < taskList.length; i++) {
		if (filter === "all") {
			visible.push(taskList[i]);
		} else if (filter === "active" && !taskList[i].isComplete) {
			visible.push(taskList[i]);
		} else if (filter === "done" && taskList[i].isComplete) {
			visible.push(taskList[i]);
		}
	}

	// DOM에 렌더링하기
	for (let i = 0; i < visible.length; i++) {
		const task = visible[i];
		
		const item = document.createElement("li");
		item.className = "list__item";
		if (task.isComplete) {
			item.style.backgroundColor = "#f3f1ef";
		}

		const text = document.createElement("span");
		text.className = "list__text";
		text.textContent = task.text;
		if (task.isComplete) {
			text.classList.add("is-done");
		}

		const actions = document.createElement("div");
		actions.className = "list__actions";

		const toggle = document.createElement("button");
		toggle.type = "button";
		toggle.textContent = task.isComplete ? "↺" : "✓";
		toggle.addEventListener("click", () => toggleComplete(task.id));

		const remove = document.createElement("button");
		remove.type = "button";
		remove.textContent = "🗑";
		remove.addEventListener("click", () => deleteTask(task.id));

		actions.appendChild(toggle);
		actions.appendChild(remove);

		item.appendChild(text);
		item.appendChild(actions);
		list.appendChild(item);
	}
};

// add 버튼을 클릭했을 때, 할일이 추가된다
const addTask = () => {
	const value = input.value.trim();
	if (!value) return;

	const nextId = Date.now();
	taskList.push({ id: nextId, text: value, isComplete: false });
	input.value = "";
	render();
	console.log(taskList);
};

// check버튼을 누르면 할일이 끝나면서 밑줄이 간다
function toggleComplete(id) {
	for (let i = 0; i < taskList.length; i++) {
		if (taskList[i].id === id) {
			taskList[i].isComplete = !taskList[i].isComplete;
			break;
		}
	}
	render();
	console.log(taskList);
}

// delete버튼을 누르면 할일이 삭제된다
function deleteTask(id) {
	for (let i = 0; i < taskList.length; i++) {
		if (taskList[i].id === id) {
			taskList.splice(i, 1);
			break;
		}
	}
	render();
	console.log(taskList);
}

// + 버튼을 클릭했을 때
addButton.addEventListener("click", addTask);

// Enter 키로도 추가 가능
input.addEventListener("keydown", (event) => {
	if (event.key === "Enter") addTask();
});

// 진행중, 끝남 탭을 누르면 언더바가 이동한다
tabs.forEach((tab) => {
	tab.addEventListener("click", () => {
		tabs.forEach((btn) => btn.classList.remove("is-active"));
		tab.classList.add("is-active");
		filter = tab.dataset.filter;
		render();
	});
});

// 초기 렌더링
render();
