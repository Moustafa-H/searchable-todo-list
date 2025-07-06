const firebaseConfig = {
    apiKey: "AIzaSyAWMyd3o5sBcA0m4m22y6bZFTns1jA4prY",
    authDomain: "searchable-todo-list.firebaseapp.com",
    projectId: "searchable-todo-list",
    storageBucket: "searchable-todo-list.firebasestorage.app",
    messagingSenderId: "199763559022",
    appId: "1:199763559022:web:5014ccf6a6bc8593d35c7f"
}

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

const priorities = {
    1: 'Very High',
    2: 'High',
    3: 'Normal',
    4: 'Optional'
}

let todos = []

const printTodos = (list = todos) => {
    const pendList = document.getElementById('pendList')
    const compList = document.getElementById('compList')
    pendList.innerHTML = ''
    compList.innerHTML = ''
    list.sort((a, b) => a.priority - b.priority)
    for (const item of list) {
        if (item.status === 'pending') {
            pendList.innerHTML += '<div id="' + item.id + '" draggable="true" ondragstart="dragstartHandler(event)"><span>' + item.text +'</span><em>' + priorities[item.priority] + '</em></div>'
        } else {
            compList.innerHTML += '<div id="' + item.id + '" draggable="true" ondragstart="dragstartHandler(event)"><span>' + item.text +'</span><em>' + priorities[item.priority] + '</em></div>'
        }
    }
}

function handleAddTodo(e) {
    e.preventDefault()
    const todo = document.forms["addTodoForm"]["todo"].value
    const priority = document.forms["addTodoForm"]["priority"].value
    if (todo) {
        document.forms["addTodoForm"]["todo"].value = ''
        document.forms["searchTodosForm"].reset()

        db.collection("todos").add({
            text: todo,
            priority: priority,
            status: 'pending'
        })
        .then((docRef) => {
            todos.push({ id: docRef.id, text: todo, priority: priority, status: 'pending' })
            printTodos()
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        })
    }
}

function handleSearchTodos(e) {
    e.preventDefault()
    const query = document.forms["searchTodosForm"]["query"].value
    filteredTodos = todos.filter(s => s.text.includes(query))
    printTodos(filteredTodos)
}

function handleSearchTodosReset() {
    printTodos()
}

function dragstartHandler(ev) {
    ev.dataTransfer.setData("id", ev.target.id);
}

function dragoverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("id");
    const todo = todos.find(s => s.id == data)
    const newStatus = ev.currentTarget.id == 'pendList' ? 'pending' : 'completed'
    todo.status = newStatus
    printTodos()

    db.collection("todos").doc(data).update({
        status: newStatus
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    })
}

db.collection("todos").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const todo = doc.data()
        todos.push({ id: doc.id, text: todo.text, priority: todo.priority, status: todo.status })
    })
    printTodos()
})
