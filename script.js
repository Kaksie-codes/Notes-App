const noteContainer = document.querySelector('.wrapper');
const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const titleTag = popupBox.querySelector("input");
const descTag = popupBox.querySelector("textarea");
const addBtn = popupBox.querySelector("button");
// console.log(noteContainer)
// console.log({noteContainer})
// console.log(closeIcon)
const months = ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"];

//upon initialization check the locaaal storage for notes, if any, show the notes in the DOM
getNotesFromStorage().forEach((note) =>  showNotes(note.title, note.content, note.id, note.date))
console.log(getNotesFromStorage())

//function for getting notes from the local storage
function getNotesFromStorage(){
    const notes = JSON.parse(localStorage.getItem('notesCollection-notes') || []);
    return notes
}

//function for saving note to the local storage
function saveNotesToStorage(notesToSave){
    localStorage.setItem('notesCollection-notes', JSON.stringify(notesToSave));
    // console.log(getNotesFromStorage())
}


//event listener for displaying pop up box
addBox.addEventListener('click', () => {
    popupBox.classList.add('show');
    popupTitle.innerText = 'Add a new Note';    
    addBtn.innerText = 'Add Note';

    //put the titleTag on focus on wider screens
    if(window.innerWidth > 660) titleTag.focus();     
});

//add an event listener to listen for when the addBtn is clicked
addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let title = titleTag.value.trim();
    let description = descTag.value.trim();

    let currentDate = new Date();
    let month = months[currentDate.getMonth()];
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();
   
    let dateObject = {
        month: `${month}`,
        day: `${day}`,
        year: `${year}`
    }
    
    //check to see if user provided a title or description
    if(title || description){
        addNotes(title, description, dateObject);        
        titleTag.value = '';
        descTag.value = ''; 
    }  
    popupBox.classList.remove('show'); 
    
}); 

//function for adding new notes
function addNotes(title,content, date){
    const existingNotes = getNotesFromStorage();
    // console.log(existingNotes)
    const newNoteObject = {
        'id': Math.floor(Math.random()*1000000),        
        title: `${title}`,
        content: `${content}`,
        date: `${date.month} ${date.day}, ${date.year}`
    }
    existingNotes.push(newNoteObject);
    showNotes(newNoteObject.title, newNoteObject.content, newNoteObject.id, newNoteObject.date);    
    saveNotesToStorage(existingNotes)

}

//function to create note elements
function showNotes(title,content,id, date){    
    const noteEl = document.createElement('li');
    noteEl.classList.add('note');
    noteEl.setAttribute('id', id)
    noteContainer.appendChild(noteEl);
    let filterDesc = content.replaceAll("\n", '<br/>');
    

    noteEl.innerHTML = `<div class="details">
                            <p>${title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${date}</span>
                            <div class="settings">
                                <i onclick ="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id})"><i class="fa-solid fa-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="fa-solid fa-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>`;    

    // return noteEl;
}

//event listener monitoring for when the close button is clicked.
closeIcon.addEventListener('click', () => {
    titleTag.value = '';
    descTag.value = '';
    popupBox.classList.remove('show')
})

function deleteNote(id){   
   const confirmDel = confirm('Are you sure you want to delete this note')
   
   if(!confirmDel) return;    
    let existingNotes = getNotesFromStorage();
    let remainingNotes = existingNotes.filter((note) => note.id != id);    
    saveNotesToStorage(remainingNotes); 
    document.getElementById(id).remove();
      
}

function showMenu(element){
    element.addEventListener('click',() => {
        element.parentElement.classList.add('show');        
    })
    document.addEventListener('click', (e) => {
        if(e.target.tagName != 'I' || e.target != element){
            element.parentElement.classList.remove('show');
        }
    })
}

// function updateNote(id){
//     popupBox.classList.add('show');
//     popupTitle.innerText = 'Edit Note';    
//     addBtn.innerText = 'Edit Note';    

//     let existingNotes = getNotesFromStorage();
//     let updatedNote = existingNotes.filter((note) => note.id == id)[0];
//     titleTag.value = updatedNote.title;
//     descTag.textContent = updatedNote.content;
//     console.log(updatedNote)
//     saveNotesToStorage(existingNotes)
// }