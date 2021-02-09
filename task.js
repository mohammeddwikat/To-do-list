class Task {
  /**
   * Represents a task.
   * @constructor
   * @param {string} task - description of the task.
   * @param {string} assignee - The name of person that he will do thee task.
   * @param {number} id - The id of the task
   */
  constructor(task, assignee, id) {
    this.task = task;
    this.assignee = assignee;
    this.id = id;
    this.state = "to do";
  }

  /** Return the object as JSON object. */
  toJSON() {
    return {
      task: this.task,
      assignee: this.assignee,
      id: this.id,
      state: this.state,
    };
  }
}

/** Show all the tasks that was hidden when search on a task or when run the page */
const showAllTasks = () => {
  const arrOfKeys = Object.keys(window.localStorage);
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

  for (let index in arrOfKeys) {
    jsonObj = JSON.parse(window.localStorage.getItem(arrOfKeys[index]));
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

/**
 * Delete a task when make event.
 * @param {event} event - event handler on HTML elements.
 */ 
const deleteTask = (event) => {
  const elementToDeleteId = event.target.parentNode.id;
  document.getElementById(elementToDeleteId).style.display = "none";
  localStorage.removeItem(elementToDeleteId);
  closeConfirmMessage();
  getCountToDoTasks();
  getCountDoneTasks();
};

/**
 * Edit a task when make event by convert paragraph element to a text view.
 * @param {event} event - event handler on HTML elements.
 */ 
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
      getTextField(textValue, idTextInput, "tv"),
      parentDiv.childNodes[0]
    );
    document.getElementById(parentDiv.childNodes[0].id).focus();
  }

  document.getElementById(parentDiv.childNodes[1].id).disabled = false;
  document.getElementById(parentDiv.childNodes[1].id).style.background ==
    "white";
};

/**
 * Finish editing a task and convert the text view to paragraph.
 * @param {event} event - event handler on HTML elements.
 */ 
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
  } else if (event.target.id.includes("textInput")) {
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

/** Add a new task when enter its information*/
const addTask = () => {
  const taskName = document.getElementById("task").value;
  const assignee = document.getElementById("assignee").value;
  const id = localStorage.length + 1 + taskName;

  const task = new Task(taskName, assignee, id);
  const taskJSON = task.toJSON();

  localStorage.setItem(id, JSON.stringify(taskJSON));
  getCountToDoTasks();
  getCountDoneTasks();
};

/**
 * Do a task by mark it with a green background and convert done icon to undo icon.
 * @param {event} event - event handler on HTML elements.
 */ 
const finishTask = (event) => {
  const divId = event.target.id.split("DoneIcon")[0];
  let editedTask = JSON.parse(window.localStorage.getItem(divId));
  editedTask["state"] = "done";
  localStorage.setItem(divId, JSON.stringify(editedTask));
  document.getElementById(divId).classList.add("done__task");
  document.getElementById(divId + "textarea").classList.add("done__task");
  document.getElementById(divId + "textView").classList.add("done__task");
  const buttonsGroup = document.getElementById(divId + "buttons");
  buttonsGroup.replaceChild(getUndoIcon(divId), buttonsGroup.childNodes[1]);
  getCountToDoTasks();
  getCountDoneTasks();
};

/** Return the count of to do tasks */
const getCountToDoTasks = () => {
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

/** Return the count of done tasks */
const getCountDoneTasks = () => {
  const arrOfDoneTasks = Object.keys(localStorage);
  let jsonObj;
  let counter = 0;

  for (let index in arrOfDoneTasks) {
    jsonObj = JSON.parse(localStorage.getItem(arrOfDoneTasks[index]));
    if (jsonObj.state == "done") {
      counter++;
    }
  }
  document.getElementById("done").innerHTML = "Done : " + counter;
};

/**
 * Show a message to the user when he wants delete task.
 * @param {event} event - event handler on HTML elements.
 */ 
const showConfirmMessage = (event) => {
  document.getElementById("confirm").style.display = "block";
  document.getElementById("delete").parentNode.id = event.target.id.split(
    "DeleteIcon"
  )[0];
  document.getElementById("delete").onclick = deleteTask;
};

/** Close the message when the user delete a task */
const closeConfirmMessage = () => {
  document.getElementById("confirm").style.display = "none";
};

/**
 * Close the message when the user click on any part of the window outside the message body 
 * @param {event} event - event handler on HTML elements.
 */ 
window.onclick = (event) => {
  const confirm = document.getElementById("confirm");
  if (event.target == confirm) {
    closeConfirmMessage();
  }
};

/** Clear the search value */
const clearSearchValue = () => {
  document.getElementById("searchTask").value = "";
  visibleAllTasks();
};

/**
 * Return the task to do task after make it done when the user click on the undo icon  
 * @param {event} event - event handler on HTML elements.
 */ 
const undoFinishTask = (event) => {
  const divId = event.target.id.split("DoneIcon")[0];
  let editedTask = JSON.parse(window.localStorage.getItem(divId));
  editedTask["state"] = "to do";
  localStorage.setItem(divId, JSON.stringify(editedTask));
  document.getElementById(divId).classList.remove("done__task");
  document.getElementById(divId + "textarea").classList.remove("done__task");
  const buttonsGroup = document.getElementById(divId + "buttons");
  document.getElementById(divId + "textView").classList.remove("done__task");
  buttonsGroup.replaceChild(getConfirmIcon(divId), buttonsGroup.childNodes[1]);
  getCountToDoTasks();
  getCountDoneTasks();
};

/**
 * Creat a textInput as textArea   
 * @param {string} assignee - String represent the name of person will make the task
 * @param {number} id - The id of the textArea
 */ 
const getTextarea = (assignee, id) => {
  let textarea = document.createElement("input");
  textarea.classList.add("task__textarea");
  textarea.classList.add("textarea--border-none");
  textarea.classList.add("textarea--background-white");
  textarea.value = assignee;
  textarea.id = id + "textarea";
  textarea.onblur = backToTextView;
  return textarea;
};

/**
 * Creat a textInput   
 * @param {string} taskDescription - String represent the task description
 * @param {number} id - The id of the textInput
 */ 
const getTextField = (taskDescription, id) => {
  let textInput = document.createElement("input");
  textInput.id = id + "textInput";
  textInput.classList.add("input--border-none");
  textInput.classList.add("input--background-white");
  textInput.value = taskDescription;
  textInput.onblur = backToTextView;
  return textInput;
};

/**
 * Creat a paragraph    
 * @param {text} taskDescription - String represent the task description
 * @param {number} id - The id of the textView
 * @param {string} element - String represent if the text input is textArea or textInput
 */ 
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

/**
 * Creat Delete icon    
 * @param {number} id - The id of the icon
 */ 
const getDeleteIcon = (id) => {
  let cancelIcon;
  cancelIcon = document.createElement("i");
  cancelIcon.classList.add("fa");
  cancelIcon.classList.add("fa-trash");
  cancelIcon.id = id + "DeleteIcon";
  cancelIcon.onclick = showConfirmMessage;
  return cancelIcon;
};

/**
 * Creat undo icon    
 * @param {number} id - The id of the icon
 */ 
const getUndoIcon = (id) => {
  let undoIcon;
  undoIcon = document.createElement("i");
  undoIcon.classList.add("fa");
  undoIcon.classList.add("fa-undo");
  undoIcon.onclick = undoFinishTask;
  undoIcon.id = id + "DoneIcon";
  return undoIcon;
};

/**
 * Creat confirm icon    
 * @param {number} id - The id of the icon
 */ 
const getConfirmIcon = (id) => {
  let confirmIcon;
  confirmIcon = document.createElement("i");
  confirmIcon.classList.add("fa");
  confirmIcon.classList.add("fa-check-circle");
  confirmIcon.onclick = finishTask;
  confirmIcon.id = id + "DoneIcon";
  return confirmIcon;
};

/** Return the todo tasks based on the search value */
const showSpecificTasks = () => {
  const searchValue = document.getElementById("searchTask").value;
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

/** Visible all tasks after clear the search input */
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
