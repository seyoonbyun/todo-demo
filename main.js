// HTML 요소 가져오기
const input = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const list = document.getElementById("todo-list");
const monthTodoList = document.getElementById("month-todo-list");
const tabs = document.querySelectorAll(".tab");
const calendarTitle = document.getElementById("calendar-title");
const calendarDays = document.getElementById("calendar-days");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

// 필터 상태 및 캘린더 상태
let filter = "all";
let currentDate = new Date(2026, 1, 18); // 2026년 2월 18일
let selectedDate = null;
const today = new Date(2026, 1, 18);

// + 버튼을 클릭하면 할일이 추가된다
// delete버튼을 누르면 할일이 삭제된다
// check버튼을 누르면 할일이 끝나면서 밑줄이 간다
// 진행중, 끝남 탭을 누르면 여더바가 이동한다
// 끝남탭은 끝남아이템만, 진행중탭은 진행중 아이템만
// 전체 탭을 누르면 다시 전체아이템으로 돌아옴

// localStorage에서 데이터 로드
function loadFromStorage() {
	const savedTasks = localStorage.getItem('taskList');
	const savedGoals = localStorage.getItem('monthGoals');
	
	let tasks = [];
	let goals = [];
	
	// taskList 로드
	if (savedTasks) {
		try {
			tasks = JSON.parse(savedTasks);
		} catch (e) {
			console.error('Failed to load tasks:', e);
			// 오류 시 초기값 사용
			tasks = [
				{ id: 1, text: "할일추가하기 앱 완성하기", isComplete: false, date: "2026-02-18" },
				{ id: 2, text: "냠냠냠", isComplete: false, date: "2026-02-18" },
				{ id: 3, text: "명절이지만", isComplete: false, date: "2026-02-19" },
				{ id: 4, text: "과제는 해야해", isComplete: false, date: "2026-02-20" },
			];
		}
	} else {
		// localStorage에 데이터가 없으면 초기값
		tasks = [
			{ id: 1, text: "할일추가하기 앱 완성하기", isComplete: false, date: "2026-02-18" },
			{ id: 2, text: "냠냠냠", isComplete: false, date: "2026-02-18" },
			{ id: 3, text: "명절이지만", isComplete: false, date: "2026-02-19" },
			{ id: 4, text: "과제는 해야해", isComplete: false, date: "2026-02-20" },
		];
	}
	
	// monthGoals 로드
	if (savedGoals) {
		try {
			goals = JSON.parse(savedGoals);
		} catch (e) {
			console.error('Failed to load goals:', e);
			// 오류 시 초기값 사용
			goals = [
				{ id: 101, text: "건강한 생활 습관 만들기", month: "2026-02" },
				{ id: 102, text: "독서 5권 완독하기", month: "2026-02" },
			];
		}
	} else {
		// localStorage에 데이터가 없으면 초기값
		goals = [
			{ id: 101, text: "건강한 생활 습관 만들기", month: "2026-02" },
			{ id: 102, text: "독서 5권 완독하기", month: "2026-02" },
		];
	}
	
	return { tasks, goals };
}

// localStorage에 데이터 저장
function saveToStorage() {
	localStorage.setItem('taskList', JSON.stringify(taskList));
	localStorage.setItem('monthGoals', JSON.stringify(monthGoals));
}

// 초기 데이터 로드
const initialData = loadFromStorage();

// 날짜별 할일 리스트
let taskList = initialData.tasks;

// 이달의 목표 리스트 (별도 관리)
let monthGoals = initialData.goals;

// 날짜 포맷 함수 (YYYY-MM-DD)
function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

// 날짜 표시 포맷 (M/D)
function formatDateDisplay(dateStr) {
	const [year, month, day] = dateStr.split("-");
	return `${parseInt(month)}/${parseInt(day)}`;
}

// 화면에 렌더링
const render = () => {
	list.innerHTML = "";

	// 캘린더의 현재 월 가져오기 (YYYY-MM 형식)
	const currentYear = currentDate.getFullYear();
	const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
	const currentYearMonth = `${currentYear}-${currentMonth}`;

	// 필터에 따라 표시할 목록 정하기
	let visible = [];
	for (let i = 0; i < taskList.length; i++) {
		const task = taskList[i];
		
		// 월 필터링 (캘린더의 현재 월과 일치하는 할일만)
		if (!task.date.startsWith(currentYearMonth)) continue;
		
		// 날짜 필터링
		if (selectedDate) {
			const selectedDateStr = formatDate(selectedDate);
			if (task.date !== selectedDateStr) continue;
		}

		if (filter === "all") {
			visible.push(task);
		} else if (filter === "active" && !task.isComplete) {
			visible.push(task);
		} else if (filter === "done" && task.isComplete) {
			visible.push(task);
		}
	}

	// 날짜순으로 정렬 (오래된 날짜가 위로)
	visible.sort((a, b) => {
		if (a.date < b.date) return -1;
		if (a.date > b.date) return 1;
		return 0;
	});

	// DOM에 렌더링하기
	for (let i = 0; i < visible.length; i++) {
		const task = visible[i];
		
		const item = document.createElement("li");
		item.className = "list__item";
		if (task.isComplete) {
			item.style.backgroundColor = "#f3f1ef";
		}

		// 날짜 표시
		const dateStr = formatDateDisplay(task.date);
		const dateLabel = document.createElement("span");
		dateLabel.className = "list__date";
		dateLabel.textContent = dateStr;

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

		const textContainer = document.createElement("div");
		textContainer.style.display = "flex";
		textContainer.style.flexDirection = "column";
		textContainer.style.flex = "1";
		textContainer.appendChild(dateLabel);
		textContainer.appendChild(text);

		item.appendChild(textContainer);
		item.appendChild(actions);
		list.appendChild(item);
	}
};

// add 버튼을 클릭했을 때, 이달의 목표를 추가한다
const addTask = () => {
	const value = input.value.trim();
	if (!value) return;

	// 캘린더의 현재 월 가져오기
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, "0");
	const currentMonth = `${year}-${month}`;

	// 이달의 목표가 이미 3개 이상인지 체크
	let monthGoalCount = 0;
	for (let i = 0; i < monthGoals.length; i++) {
		if (monthGoals[i].month === currentMonth) {
			monthGoalCount++;
		}
	}

	if (monthGoalCount >= 3) {
		alert(`${parseInt(month)}월은 이미 3개의 목표가 등록되었습니다. 다른 목표를 제거하고 진행해주세요.`);
		return;
	}

	const nextId = Date.now();
	monthGoals.push({ id: nextId, text: value, month: currentMonth });
	input.value = "";
	saveToStorage();
	renderMonthGoals();
	console.log(monthGoals);
};

// 이달의 목표 수정
function editMonthGoal(id) {
	for (let i = 0; i < monthGoals.length; i++) {
		if (monthGoals[i].id === id) {
			const newText = prompt("목표를 수정하세요:", monthGoals[i].text);
			if (newText && newText.trim()) {
				monthGoals[i].text = newText.trim();
				saveToStorage();
				renderMonthGoals();
				console.log(monthGoals);
			}
			break;
		}
	}
}

// 이달의 목표 삭제
function deleteMonthGoal(id) {
	for (let i = 0; i < monthGoals.length; i++) {
		if (monthGoals[i].id === id) {
			monthGoals.splice(i, 1);
			break;
		}
	}
	saveToStorage();
	renderMonthGoals();
	console.log(monthGoals);
}

// check버튼을 누르면 할일이 끝나면서 밑줄이 간다
function toggleComplete(id) {
	for (let i = 0; i < taskList.length; i++) {
		if (taskList[i].id === id) {
			taskList[i].isComplete = !taskList[i].isComplete;
			break;
		}
	}
	saveToStorage();
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
	saveToStorage();
	render();
	console.log(taskList);
}

// 캘린더 렌더링
function renderCalendar() {
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	// 월/년도 제목 업데이트
	const monthNames = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	calendarTitle.textContent = `${monthNames[month]} ${year}`;

	// 해당 월의 첫 날짜와 마지막 날짜 구하기
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const prevLastDay = new Date(year, month, 0);

	// 캘린더 그리드 초기화
	calendarDays.innerHTML = "";

	// 이전 월의 남은 날짜들
	const prevDaysCount = firstDay.getDay();
	for (let i = prevDaysCount - 1; i >= 0; i--) {
		const day = document.createElement("div");
		day.className = "calendar-day other-month";
		day.textContent = prevLastDay.getDate() - i;
		calendarDays.appendChild(day);
	}

	// 현재 월의 날짜들
	for (let i = 1; i <= lastDay.getDate(); i++) {
		const day = document.createElement("div");
		day.className = "calendar-day";
		day.textContent = i;

		// 오늘 날짜 강조
		if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
			day.classList.add("today");
		}

		// 선택된 날짜 강조
		if (selectedDate && i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
			day.classList.add("selected");
		}

		// 날짜 클릭 이벤트
		day.addEventListener("click", () => {
			// 커스텀 모달 표시
			showTodoModal(month + 1, i, (todo) => {
				if (todo && todo.trim()) {
					const taskDate = formatDate(new Date(year, month, i));
					const nextId = Date.now();
					taskList.push({ 
						id: nextId, 
						text: todo.trim(), 
						isComplete: false, 
						date: taskDate 
					});
					saveToStorage();
					console.log(taskList);
					// 할일 추가 후 selectedDate 초기화하여 전체 목록 표시
					selectedDate = null;
					render();
					renderCalendar();
				}
			});
		});

		calendarDays.appendChild(day);
	}

	// 다음 월의 날짜들
	const nextDaysCount = 42 - (prevDaysCount + lastDay.getDate());
	for (let i = 1; i <= nextDaysCount; i++) {
		const day = document.createElement("div");
		day.className = "calendar-day other-month";
		day.textContent = i;
		calendarDays.appendChild(day);
	}
}

// 이달의 목표 리스트 렌더링 (날짜별 할일과 별도)
function renderMonthGoals() {
	monthTodoList.innerHTML = "";

	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, "0");
	const currentMonth = `${year}-${month}`;

	// 이달의 목표 필터링
	let goals = [];
	for (let i = 0; i < monthGoals.length; i++) {
		if (monthGoals[i].month === currentMonth) {
			goals.push(monthGoals[i]);
		}
	}

	// 렌더링
	if (goals.length === 0) {
		const empty = document.createElement("li");
		empty.textContent = "이달의 목표가 없습니다";
		empty.style.color = "#aaa";
		empty.style.textAlign = "center";
		monthTodoList.appendChild(empty);
		return;
	}

	for (let i = 0; i < goals.length; i++) {
		const goal = goals[i];
		const li = document.createElement("li");
		li.className = "month-goal-item";

		const textSpan = document.createElement("span");
		textSpan.textContent = goal.text;
		textSpan.style.flex = "1";
		textSpan.style.fontSize = "14px";
		textSpan.style.color = "#333";

		const actions = document.createElement("div");
		actions.className = "list__actions";

		const editBtn = document.createElement("button");
		editBtn.type = "button";
		editBtn.textContent = "✏️";
		editBtn.style.fontSize = "16px";
		editBtn.addEventListener("click", () => editMonthGoal(goal.id));

		const deleteBtn = document.createElement("button");
		deleteBtn.type = "button";
		deleteBtn.textContent = "🗑";
		deleteBtn.style.fontSize = "16px";
		deleteBtn.addEventListener("click", () => deleteMonthGoal(goal.id));

		actions.appendChild(editBtn);
		actions.appendChild(deleteBtn);

		li.appendChild(textSpan);
		li.appendChild(actions);
		monthTodoList.appendChild(li);
	}
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
		// 탭 전환 시 selectedDate 초기화하여 전체 목록 표시
		selectedDate = null;
		render();
		renderCalendar();
	});
});

// 이전/다음 월 버튼
prevMonthBtn.addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() - 1);
	renderCalendar();
	renderMonthGoals();
	render();
});

nextMonthBtn.addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() + 1);
	renderCalendar();
	renderMonthGoals();
	render();
});

// 초기 렌더링
renderCalendar();
renderMonthGoals();
render();

// 커스텀 모달 함수
function showTodoModal(month, day, callback) {
	const modal = document.getElementById("todo-modal");
	const modalTitle = document.getElementById("modal-title");
	const modalInput = document.getElementById("modal-input");
	const confirmBtn = document.getElementById("modal-confirm");
	const cancelBtn = document.getElementById("modal-cancel");

	modalTitle.textContent = `${month}월 ${day}일의 할일을 입력하세요:`;
	modalInput.value = "";
	modal.style.display = "flex";
	modalInput.focus();

	// 확인 버튼
	const handleConfirm = () => {
		const value = modalInput.value;
		modal.style.display = "none";
		callback(value);
		cleanup();
	};

	// 취소 버튼
	const handleCancel = () => {
		modal.style.display = "none";
		cleanup();
	};

	// 엔터키 처리
	const handleKeydown = (e) => {
		if (e.key === "Enter") {
			handleConfirm();
		} else if (e.key === "Escape") {
			handleCancel();
		}
	};

	// 이벤트 리스너 정리
	const cleanup = () => {
		confirmBtn.removeEventListener("click", handleConfirm);
		cancelBtn.removeEventListener("click", handleCancel);
		modalInput.removeEventListener("keydown", handleKeydown);
	};

	confirmBtn.addEventListener("click", handleConfirm);
	cancelBtn.addEventListener("click", handleCancel);
	modalInput.addEventListener("keydown", handleKeydown);
}
