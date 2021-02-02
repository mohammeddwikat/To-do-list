class Task {
  constructor(task, assignee, id) {
    this.task = task;
    this.assignee = assignee;
    this.id = id;
    this.state = "to do";
  }
  toJSON() {
    return {
      task: this.task,
      assignee: this.assignee,
      id: this.id,
      state: this.state,
    };
  }
}

const showAllTasks = () => {
  const arrOfkeys = Object.keys(window.localStorage);
  const tasks = document.getElementById("tasksId");
  let id;
  let taskName;
  let assignee;
  let jsonObj;
  let taskDiv;
  let textsDiv;
  let textView;
  let textArea;
  let buttonsDiv;
  let cancelIcon;
  let doneIcon;

  for (let i in arrOfkeys) {
    jsonObj = JSON.parse(window.localStorage.getItem(arrOfkeys[i]));
    id = jsonObj.id;
    taskName = jsonObj.task;
    assignee = jsonObj.assignee;
    taskDiv = document.createElement("div");
    textsDiv = document.createElement("div");
    textView = getTextView(taskName, id, "tv");
    textArea = getTextView(assignee, id, "ta");
    buttonsDiv = document.createElement("div");
    cancelIcon = getDeleteIcon(id);
    doneIcon = document.createElement("i");
    taskDiv.id = id;
    taskDiv.classList.add("task");
    buttonsDiv.classList.add("task__buttons");
    buttonsDiv.id = id + "buttons";
    if (jsonObj.state == "done") {
      doneIcon = getUndoIcon(id);
      taskDiv.classList.add("done__task");
      textArea.classList.add("done__task");
      textView.classList.add("done__task");
    } else {
      doneIcon = getConfirmIcon(id);
    }
    doneIcon.id = id + "DoneIcon";
    textsDiv.classList.add("task__text");
    textsDiv.id = id + "textsDiv";
    buttonsDiv.appendChild(cancelIcon);
    buttonsDiv.appendChild(doneIcon);
    textsDiv.appendChild(textView);
    textsDiv.appendChild(textArea);
    taskDiv.appendChild(textsDiv);
    taskDiv.appendChild(buttonsDiv);
    tasks.appendChild(taskDiv);
  }
};

const deleteTask = (event) => {
  const elemntToDeleteId = event.target.parentNode.id;
  document.getElementById(elemntToDeleteId).style.display = "none";
  localStorage.removeItem(elemntToDeleteId);
  closeConfairmMessage();
  getCountToTasks();
  getCountDoneTasks();
};

const editTask = (event) => {
  const idTextViewParent = event.target.parentNode.id;
  const parentDiv = document.getElementById(idTextViewParent);
  const textValue = document.getElementById(event.target.id).innerHTML;

  if (event.target.id.includes("textarea")) {
    const idTextInput = event.target.id.split("textarea")[0];
    parentDiv.replaceChild(
      getTextarea(textValue, idTextInput, "ta"),
      parentDiv.childNodes[1]
    );
    document.getElementById(parentDiv.childNodes[1].id).focus();
  } else if (event.target.id.includes("textView")) {
    const idTextInput = event.target.id.split("textView")[0];
    parentDiv.replaceChild(
      getTextfield(textValue, idTextInput, "tv"),
      parentDiv.childNodes[0]
    );
    document.getElementById(parentDiv.childNodes[0].id).focus();
  }

  document.getElementById(parentDiv.childNodes[1].id).disabled = false;
  document.getElementById(parentDiv.childNodes[1].id).style.background ==
    "white";
};

const backToTextView = (event) => {
  const idTextInputParent = event.target.parentNode.id;
  const parentDiv = document.getElementById(idTextInputParent);
  const textValue = document.getElementById(event.target.id).value;
  const idTextView = event.target.id.split("text")[0];
  let jsonTask = JSON.parse(localStorage.getItem(idTextView));
  if (event.target.id.includes("textarea")) {
    parentDiv.replaceChild(
      getTextView(textValue, idTextView, "ta"),
      parentDiv.childNodes[1]
    );
    jsonTask.assignee = textValue;
    localStorage.setItem(idTextView, JSON.stringify(jsonTask));
  } else if (event.target.id.includes("textinput")) {
    parentDiv.replaceChild(
      getTextView(textValue, idTextView, "tv"),
      parentDiv.childNodes[0]
    );
    jsonTask.task = textValue;
    localStorage.setItem(parentDiv.parentNode.id, JSON.stringify(jsonTask));
  }

  if (jsonTask.state == "done") {
    document
      .getElementById(parentDiv.childNodes[0].id)
      .classList.add("done__task");
    document
      .getElementById(parentDiv.childNodes[1].id)
      .classList.add("done__task");
  }
};

const addTask = () => {
  const taskName = document.getElementById("task").value;
  const assignee = document.getElementById("assignee").value;
  const id = localStorage.length + 1 + taskName;

  const task = new Task(taskName, assignee, id);
  const taskJSON = task.toJSON();

  localStorage.setItem(id, JSON.stringify(taskJSON));
  getCountToTasks();
  getCountDoneTasks();
};

const finishtTask = (event) => {
  const divId = event.target.id.split("DoneIcon")[0];
  let eitedTask = JSON.parse(window.localStorage.getItem(divId));
  eitedTask["state"] = "done";
  localStorage.setItem(divId, JSON.stringify(eitedTask));
  document.getElementById(divId).classList.add("done__task");
  document.getElementById(divId + "textarea").classList.add("done__task");
  document.getElementById(divId + "textView").classList.add("done__task");
  const buttonsGroub = document.getElementById(divId + "buttons");
  buttonsGroub.replaceChild(getUndoIcon(divId), buttonsGroub.childNodes[1]);
  getCountToTasks();
  getCountDoneTasks();
};

const getCountToTasks = () => {
  const arrOfToDoTasks = Object.keys(localStorage);
  let jsonObj;
  let counter = 0;

  for (let i in arrOfToDoTasks) {
    jsonObj = JSON.parse(localStorage.getItem(arrOfToDoTasks[i]));
    if (jsonObj.state == "to do") {
      counter++;
    }
  }

  document.getElementById("todo").innerHTML = "To Do : " + counter;
};

const getCountDoneTasks = () => {
  const arrOfDoneTasks = Object.keys(localStorage);
  let jsonObj;
  let counter = 0;

  for (let i in arrOfDoneTasks) {
    jsonObj = JSON.parse(localStorage.getItem(arrOfDoneTasks[i]));
    if (jsonObj.state == "done") {
      counter++;
    }
  }
  document.getElementById("done").innerHTML = "Done : " + counter;
};

const showConfairmMessage = (event) => {
  document.getElementById("confairm").style.display = "block";
  document.getElementById("delete").parentNode.id = event.target.id.split(
    "DeleteIcon"
  )[0];
  document.getElementById("delete").onclick = deleteTask;
};

const closeConfairmMessage = () => {
  document.getElementById("confairm").style.display = "none";
};

window.onclick = (event) => {
  const confairm = document.getElementById("confairm");
  if (event.target == confairm) {
    closeConfairmMessage();
  }
};

const clearSearchValue = () => {
  document.getElementById("searchTask").value = "";
  visibleAllTasks();
};

const undoFinishTask = (event) => {
  const divId = event.target.id.split("DoneIcon")[0];
  let eitedTask = JSON.parse(window.localStorage.getItem(divId));
  eitedTask["state"] = "to do";
  localStorage.setItem(divId, JSON.stringify(eitedTask));
  document.getElementById(divId).classList.remove("done__task");
  document.getElementById(divId + "textarea").classList.remove("done__task");
  const buttonsGroub = document.getElementById(divId + "buttons");

  document.getElementById(divId + "textView").classList.remove("done__task");
  buttonsGroub.replaceChild(getConfirmIcon(divId), buttonsGroub.childNodes[1]);
  getCountToTasks();
  getCountDoneTasks();
};

const getTextarea = (assignee, id) => {
  let textarea = document.createElement("input");
  textarea.classList.add("task__textarea");
  textarea.classList.add("textarea--border-none");
  textarea.classList.add("textarae--background-white");
  textarea.value = assignee;
  textarea.id = id + "textarea";
  textarea.onblur = backToTextView;
  return textarea;
};

const getTextfield = (taskName, id) => {
  let textinput = document.createElement("input");
  textinput.id = id + "textinput";
  textinput.classList.add("input--border-none");
  textinput.classList.add("input--background-white");
  textinput.value = taskName;
  textinput.onblur = backToTextView;
  return textinput;
};
const getTextView = (text, id, element) => {
  let textView = document.createElement("p");
  if (element == "ta") {
    textView.id = id + "textarea";
  } else if (element == "tv") {
    textView.id = id + "textView";
  }
  textView.innerHTML = text;
  textView.onclick = editTask;
  return textView;
};
const getDeleteIcon = (id) => {
  let cancelIcon;
  cancelIcon = document.createElement("i");
  cancelIcon.classList.add("fa");
  cancelIcon.classList.add("fa-trash");
  cancelIcon.id = id + "DeleteIcon";
  cancelIcon.onclick = showConfairmMessage;
  return cancelIcon;
};

const getUndoIcon = (id) => {
  let undoIcon;
  undoIcon = document.createElement("i");
  undoIcon.classList.add("fa");
  undoIcon.classList.add("fa-undo");
  undoIcon.onclick = undoFinishTask;
  undoIcon.id = id + "DoneIcon";

  return undoIcon;
};

const getConfirmIcon = (id) => {
  let confirmIcon;
  confirmIcon = document.createElement("i");
  confirmIcon.classList.add("fa");
  confirmIcon.classList.add("fa-check-circle");
  confirmIcon.onclick = finishtTask;
  confirmIcon.id = id + "DoneIcon";
  return confirmIcon;
};

const showSpecificTasks = () => {
  let searchValue = document.getElementById("searchTask").value;
  if (searchValue == "") {
    visibleAllTasks();
  } else {
    const tasks = document.getElementById("tasksId");
    for (let i in tasks.childNodes) {
      console.log(tasks.childNodes[1].className);
      if (tasks.childNodes[i].className == "task") {
        document.getElementById(tasks.childNodes[i].id).style.display = "flex";
        const taskName = tasks.childNodes[i].firstChild.firstChild;
        if (taskName != null) {
          const valueTaskToShow = taskName.innerHTML;
          if (valueTaskToShow != null) {
            if (!valueTaskToShow.includes(searchValue)) {
              document.getElementById(tasks.childNodes[i].id).style.display =
                "none";
            }
          }
        }
      } else if (tasks.childNodes[i].className == "task done__task") {
        document.getElementById(tasks.childNodes[i].id).style.display = "none";
      }
    }
  }
};

const visibleAllTasks = () => {
  const tasks = document.getElementById("tasksId");
  for (let i in tasks.childNodes) {
    if (
      tasks.childNodes[i].className == "task" ||
      tasks.childNodes[i].className == "task done__task"
    ) {
      document.getElementById(tasks.childNodes[i].id).style.display = "flex";
    }
  }
};
