todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));

todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));

todoForm.addEventListener('submit', onSubmit);


const todoListElement = document.getElementById('todoList');


let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api('http://localhost:5000/tasks');

function validateField(field) {
  
  const { name, value } = field;

  let = validationMessage = '';

  switch (name) {
    case 'title': {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {

        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
    
        titleValid = true;
      }
      break;
    }

    case 'description': {

      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    
    case 'dueDate': {
    
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }
  
  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}


function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    console.log('Submit');
    saveTask();
  }
}


function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };

  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}


function renderList() {
  
  console.log('rendering');

  
  api.getAll().then((tasks) => {
    
    todoListElement.innerHTML = '';

    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
      });
    }
  });
}
  /***********************Labb 2 ***********************/

  // ***************Mina Förklaringar******************//

//Nedan finns kod som berör labb 2
//en if-sats som kollar om completed är true eller false. Om completed är true, 
//skapas en li-element med vissa styling-klasser.
//Checkboxen har en onclick-attribut som kör en JavaScript-funktion updateTask
//med uppgiftens ID som argument
//Efter if-satsen skapas en sträng med HTML-kod för uppgiften och tilldelas variabeln html.
 
  /***********************Labb 2 ***********************/
function renderTask({ id, title, description, dueDate, completed }) {
  let html = "";
  if (completed) {
    html = `
    <li id="${id}" class="select-none mt-2 bg-black-500 py-2 border-b 
    border-black-300">
      <div class="flex items-center">
      <input type="checkbox" onclick="updateTask(${id})"  
      checked  class="mr-3 ">
      <h3 class="mb-2 flex-1 text-xl font-bold text-gray-400
       line-through uppercase">${title}</h3>
        <div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-amber-500
           text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;
  } else {
    html = `
    <li class="select-none mt-2 py-2 border-b border-purple-300">
      <div class="flex items-center">
      <input type= "checkbox" onclick="updateTask(${id})" class="mr-4">
       
      <h3 class="mb-3 flex-1 text-xl font-bold text-grey-800 uppercase">${title}</h3>
        
        <div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;
  }

/***********************Labb 2 ***********************/

description &&
 
  (html += `
    <p class="ml-8 mt-2 text-xs italic">${description}</p>
`)

return html;
}


function deleteTask(id) {
  api.remove(id).then((result) => {

    renderList(); 
  });
}

/***********************Labb 2 ***********************/
/*en uppdatering av en uppgift med hjälp av funktionen api.update(id), 
och när uppdateringen är klar ritar den upp listan med uppgifter igen med hjälp av 
funktionen renderList(). */
/***********************Labb 2 ***********************/

function updateTask(id) {
  api.update(id).then((result) => {
    renderList();
  });
}


renderList();
/***********************Labb 2 ***********************/