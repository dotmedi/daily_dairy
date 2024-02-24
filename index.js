document.addEventListener('DOMContentLoaded' , function(){

const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const filterCompletedButton = document.getElementById('filterCompletedButton')
const filterUncompletedButton = document.getElementById('filterUncompletedButton')
const filterAllButton = document.getElementById('filterAllButton')


let editingTask = null;

function saveTasksToLocalStorage(){
    const tasks = [];
    const taskItems = taskList.getElementsByTagName('li');

    for (let i=0; i < taskItems.length; i++){
        const taskText = taskItems[i].querySelector('span').textContent;
        const isPriority = taskItems[i].classList.contains('priority');
        const isCompleted = taskItems[i].classList.contains('completed');
        tasks.push({ text: taskText, priority: isPriority, completed: isCompleted });
    }
    localStorage.setItem('tasks' , JSON.stringify(tasks));
}

     function loadTasksFromLocalStorage(){
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

for(const task of tasks){
            const taskItem = document.createElement('li');
            const taskTextSpan = document.createElement('span');
            const priorityButton = document.createElement('button');
            const editButton = document.createElement('button');
            const deleteButton = document.createElement('button');

            taskTextSpan.textContent = task.text;
            priorityButton.className = 'priority-button';
            priorityButton.textContent = 'Priority';
            editButton.className = 'edit-button'; 
            editButton.textContent = 'Edit';
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'Delete';

            if (task.priority) {
                taskItem.classList.add('priority');
            }

            if (task.completed){
                taskItem.classList.add('completed');
            }

             taskItem.appendChild(taskTextSpan);
             taskItem.appendChild(priorityButton);
             taskItem.appendChild(editButton);
             taskItem.appendChild(deleteButton);
             taskList.appendChild(taskItem);
        }
         
        
        
        const filterState = localStorage.getItem('filterState');   
         if (filterState){
            applyFilter(filterState);
         }
    }
           
           function applyFilter(filterState){
            switch (filterState){
                
                
                case 'completed':
                    filterCompletedButton.click();
                    break;
               
               
                    case 'uncompleted' :
                    filterUncompletedButton.click();
                    break;
                
                
                    case 'all':
                    filterAllButton.click();
                    break;
                    default:
           
           
                    filterAllButton.click();
            break;
             }
          }
            
          
          
          window.addEventListener('filter' , function(event){
                localStorage.setItem('filterState' , event.detail.filterState);
        });

 addButton.addEventListener('click' , function(){
    const taskTextValue = taskInput.value.trim();

    if(taskTextValue !== ''){
        if (editingTask) {
            editingTask.querySelector('span').textContent = taskTextValue;
            editingTask = null;
        } else {
                const taskItem = document.createElement('li');

               const taskText= document.createElement('span');
               taskText.textContent= taskTextValue;

               const priorityButton = document.createElement('button');
               priorityButton.className = 'priority-button';
               priorityButton.textContent = 'Priority';

               const editButton = document.createElement('button');
               editButton.className= 'edit-button';
               editButton.textContent= 'Edit';
       
               const deleteButton = document.createElement('button');
               deleteButton.className= 'delete-button';
               deleteButton.textContent= 'Delete'; 
 
        

       // const editInput = document.createElement('input');
       // editInput.type = 'text';
       // editInput.className = 'edit-input';

        taskItem.appendChild(taskText);
        taskItem.appendChild(priorityButton);
        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);
    

       taskList.appendChild(taskItem);
}

       saveTasksToLocalStorage();
       taskInput.value = '';
    }
});




taskList.addEventListener('click' , function (event){
    const clickedElement = event.target;
    if (clickedElement.tagName ==='LI'){
       clickedElement.classList.toggle('completed');

       saveTasksToLocalStorage();
    }
});






taskList.addEventListener('click' , function(event){
    const clickedElement = event.target;

    
    
    
    
    
    if (clickedElement.classList.contains('delete-button')){
    const taskItem = clickedElement.parentElement;
    taskList.removeChild(taskItem);
    saveTasksToLocalStorage();
    } else if (clickedElement.classList.contains('edit-button')){

    //Edit
      editingTask = clickedElement.parentElement;
        const taskText=editingTask.querySelector('span').textContent;
         taskInput.value = taskText;
        taskInput.focus();
    } else if (clickedElement.classList.contains('priority-button')){
        const taskItem = clickedElement.parentElement;
        taskItem.classList.toggle('priority');
        saveTasksToLocalStorage();
 }
});

  


filterCompletedButton.addEventListener('click' , function () {
      filterTasks ('completed' , true);
      dispatchFilterEvent('completed');
}) ;

  


filterUncompletedButton.addEventListener('click' , function(){
    filterTasks('completed' , false)
    dispatchFilterEvent('uncompleted');
});

 
filterAllButton.addEventListener('click' , function(){
   filterTasks('all' , null);
   dispatchFilterEvent('all');
 });
 
 
 
 function filterTasks(filterType , value) {
    const taskItems = taskList.getElementsByTagName('li');

    for (let i = 0; i < taskItems.length; i++){
        const displayStyle = (filterType === 'all' || value ===taskItems[i].classList.contains('completed')) ? 'list-item' : 'none';
        taskItems[i].style.display = displayStyle;
    }
}
    

function dispatchFilterEvent(filterState){
        const filterEvent = new CustomEvent ('filter' , { detail: {filterState}  });
        window.dispatchEvent(filterEvent);
     }

loadTasksFromLocalStorage();
     });

