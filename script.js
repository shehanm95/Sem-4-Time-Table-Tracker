const subjects = [
    "Database",
    "Networking",
    "Project Management",
    "UI UX",
    "Quality Assurance",
    "Programming Project"
];

const TOTAL_WEEKS = 14;
const SESSIONS_PER_WEEK = 3;
const TOTAL_SESSIONS_PER_SUBJECT = TOTAL_WEEKS * SESSIONS_PER_WEEK;

// Separate Keys for LocalStorage Persistence
const GRID_STORAGE_KEY = 'semester_tracker_state';
const TODO_STORAGE_KEY = 'semester_todo_state';
const NOTES_STORAGE_KEY = 'semester_notes_state';

let trackerState = JSON.parse(localStorage.getItem(GRID_STORAGE_KEY)) || {};
let todoListState = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY)) || [];
let notesState = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY)) || {};

let activeNoteKey = null;

function initApp() {
    initTable();
    initTodoSection();
    initNoteModal();
}

function initTable() {
    const headerRow = document.getElementById('headerRow');
    const tableBody = document.getElementById('tableBody');
    const progressTableBody = document.getElementById('progressTableBody');

    // 1. Create Week Headers
    for (let w = 1; w <= TOTAL_WEEKS; w++) {
        const th = document.createElement('th');
        th.textContent = `W${w}`;
        headerRow.appendChild(th);
    }

    // 2. Create Grid Rows & Summary Rows
    subjects.forEach((subject, subjectIdx) => {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.className = 'subject-name';
        tdName.textContent = subject;
        tr.appendChild(tdName);

        for (let w = 1; w <= TOTAL_WEEKS; w++) {
            const tdWeek = document.createElement('td');
            
            const cellGroup = document.createElement('div');
            cellGroup.className = 'cell-content-group';

            // Checkbox group
            const checkboxGroup = document.createElement('div');
            checkboxGroup.className = 'checkbox-group';

            for (let s = 1; s <= SESSIONS_PER_WEEK; s++) {
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'custom-checkbox';
                
                const cbKey = `s${subjectIdx}_w${w}_session${s}`;
                cb.checked = !!trackerState[cbKey];

                cb.addEventListener('change', (e) => {
                    trackerState[cbKey] = e.target.checked;
                    localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify(trackerState));
                    updateProgress(subjectIdx);
                });

                checkboxGroup.appendChild(cb);
            }

            // Note Trigger Button (Positioned right after the checkboxes)
            const noteBtn = document.createElement('button');
            const noteKey = `s${subjectIdx}_w${w}`;
            noteBtn.id = `note-btn-${noteKey}`;
            
            updateNoteBtnStyle(noteBtn, noteKey);

            noteBtn.addEventListener('click', () => {
                openNoteModal(subject, w, noteKey);
            });

            cellGroup.appendChild(checkboxGroup);
            cellGroup.appendChild(noteBtn);

            tdWeek.appendChild(cellGroup);
            tr.appendChild(tdWeek);
        }
        tableBody.appendChild(tr);

        // Progress Summary Row
        const progTr = document.createElement('tr');
        
        const progTdName = document.createElement('td');
        progTdName.className = 'subject-title';
        progTdName.textContent = subject;

        const progTdBar = document.createElement('td');
        progTdBar.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" id="progress-fill-${subjectIdx}"></div>
                </div>
                <span class="progress-text" id="progress-text-${subjectIdx}">0%</span>
            </div>
        `;

        progTr.appendChild(progTdName);
        progTr.appendChild(progTdBar);
        progressTableBody.appendChild(progTr);

        updateProgress(subjectIdx);
    });

    setupDragToScroll();
}

function updateNoteBtnStyle(btnElement, noteKey) {
    const hasNote = !!(notesState[noteKey] && notesState[noteKey].trim());
    
    if (hasNote) {
        btnElement.className = 'note-btn has-note';
        btnElement.title = 'View / Edit Note';
        btnElement.innerHTML = '<span class="material-symbols-outlined">warning</span>';
    } else {
        btnElement.className = 'note-btn empty-note';
        btnElement.title = 'Add Note';
        btnElement.innerHTML = '<span class="material-symbols-outlined">check_box_outline_blank</span>';
    }
}

function updateProgress(subjectIdx) {
    let checkedCount = 0;

    for (let w = 1; w <= TOTAL_WEEKS; w++) {
        for (let s = 1; s <= SESSIONS_PER_WEEK; s++) {
            const cbKey = `s${subjectIdx}_w${w}_session${s}`;
            if (trackerState[cbKey]) {
                checkedCount++;
            }
        }
    }

    const percentage = Math.round((checkedCount / TOTAL_SESSIONS_PER_SUBJECT) * 100);
    
    const fillElement = document.getElementById(`progress-fill-${subjectIdx}`);
    const textElement = document.getElementById(`progress-text-${subjectIdx}`);

    if (fillElement && textElement) {
        fillElement.style.width = `${percentage}%`;
        textElement.textContent = `${percentage}%`;

        if (percentage === 100) {
            fillElement.style.background = 'var(--accent-green)';
        } else {
            fillElement.style.background = 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))';
        }
    }
}

// =========================================================
// Weekly Note Modal Logic
// =========================================================
function initNoteModal() {
    const overlay = document.getElementById('noteModalOverlay');
    const closeBtn = document.getElementById('closeModalBtn');
    const saveBtn = document.getElementById('saveNoteBtn');
    const deleteBtn = document.getElementById('deleteNoteBtn');

    closeBtn.addEventListener('click', closeNoteModal);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeNoteModal();
    });

    saveBtn.addEventListener('click', saveNote);
    deleteBtn.addEventListener('click', deleteNote);
}

function openNoteModal(subject, weekNum, noteKey) {
    activeNoteKey = noteKey;
    
    const modalTitle = document.getElementById('modalTitle');
    const noteArea = document.getElementById('modalNoteText');
    const overlay = document.getElementById('noteModalOverlay');

    modalTitle.textContent = `Note — ${subject} (Week ${weekNum})`;
    noteArea.value = notesState[noteKey] || '';

    overlay.style.display = 'flex';
    noteArea.focus();
}

function closeNoteModal() {
    const overlay = document.getElementById('noteModalOverlay');
    overlay.style.display = 'none';
    activeNoteKey = null;
}

function saveNote() {
    if (!activeNoteKey) return;

    const noteArea = document.getElementById('modalNoteText');
    const noteText = noteArea.value.trim();

    if (noteText) {
        notesState[activeNoteKey] = noteText;
    } else {
        delete notesState[activeNoteKey];
    }

    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesState));
    
    const btn = document.getElementById(`note-btn-${activeNoteKey}`);
    if (btn) updateNoteBtnStyle(btn, activeNoteKey);

    closeNoteModal();
}

function deleteNote() {
    if (!activeNoteKey) return;

    delete notesState[activeNoteKey];
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesState));

    const btn = document.getElementById(`note-btn-${activeNoteKey}`);
    if (btn) updateNoteBtnStyle(btn, activeNoteKey);

    closeNoteModal();
}

// =========================================================
// To-Do Section Logic
// =========================================================
function initTodoSection() {
    const subjectSelect = document.getElementById('todoSubjectSelect');
    const weekSelect = document.getElementById('todoWeekSelect');
    const addBtn = document.getElementById('addTodoBtn');
    const taskInput = document.getElementById('todoTaskInput');

    subjects.forEach(sub => {
        const opt = document.createElement('option');
        opt.value = sub;
        opt.textContent = sub;
        subjectSelect.appendChild(opt);
    });

    for (let w = 1; w <= TOTAL_WEEKS; w++) {
        const opt = document.createElement('option');
        opt.value = `W${w}`;
        opt.textContent = `Week ${w}`;
        weekSelect.appendChild(opt);
    }

    addBtn.addEventListener('click', addTodoTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodoTask();
    });

    renderTodoList();
}

function showErrorMessage(message) {
    const errorDiv = document.getElementById('todoErrorMsg');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 4000);
}

function addTodoTask() {
    const subjectSelect = document.getElementById('todoSubjectSelect');
    const weekSelect = document.getElementById('todoWeekSelect');
    const taskInput = document.getElementById('todoTaskInput');

    const selectedSubject = subjectSelect.value;
    const selectedWeek = weekSelect.value;
    const taskText = taskInput.value.trim();

    if (!selectedSubject || !selectedWeek || !taskText) {
        showErrorMessage("⚠️ කරුණාකර Subject, Week සහ Task Description යන සියල්ලම තෝරා/ඇතුළත් කරන්න!");
        return;
    }

    const newTask = {
        id: Date.now(),
        subject: selectedSubject,
        week: selectedWeek,
        text: taskText,
        completed: false
    };

    todoListState.push(newTask);
    saveAndRenderTodos();

    subjectSelect.value = "";
    weekSelect.value = "";
    taskInput.value = "";
}

function toggleTodoStatus(id) {
    todoListState = todoListState.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveAndRenderTodos();
}

function editTodoTask(id) {
    const taskToEdit = todoListState.find(task => task.id === id);
    if (!taskToEdit) return;

    const newText = prompt("Edit Task Description:", taskToEdit.text);
    if (newText === null) return;
    
    const trimmedText = newText.trim();
    if (!trimmedText) {
        showErrorMessage("⚠️ Task එක හිස්ව තැබිය නොහැක!");
        return;
    }

    taskToEdit.text = trimmedText;
    saveAndRenderTodos();
}

function deleteTodoTask(id) {
    todoListState = todoListState.filter(task => task.id !== id);
    saveAndRenderTodos();
}

function saveAndRenderTodos() {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todoListState));
    renderTodoList();
}

function renderTodoList() {
    const todoListUl = document.getElementById('todoList');
    todoListUl.innerHTML = '';

    if (todoListState.length === 0) {
        todoListUl.innerHTML = '<li class="empty-todo-msg">No pending tasks. Add a task above!</li>';
        return;
    }

    todoListState.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed-task' : 'active-task'}`;

        li.innerHTML = `
            <span class="todo-badge">${task.subject} • ${task.week}</span>
            <span class="todo-text">${escapeHtml(task.text)}</span>
            <div class="todo-actions">
                <button class="complete-btn" onclick="toggleTodoStatus(${task.id})">
                    ${task.completed ? 'Completed' : 'Mark Complete'}
                </button>
                <button class="edit-btn" title="Edit Task" onclick="editTodoTask(${task.id})">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="delete-btn" title="Delete Task" onclick="deleteTodoTask(${task.id})">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;

        todoListUl.appendChild(li);
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

// Drag-to-Scroll Logic
function setupDragToScroll() {
    const slider = document.getElementById('tableWrapper');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            slider.scrollLeft += e.deltaY;
        }
    }, { passive: false });

    slider.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.closest('.note-btn')) return;
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => { isDown = false; });
    slider.addEventListener('mouseup', () => { isDown = false; });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
    });
}

document.addEventListener('DOMContentLoaded', initApp);