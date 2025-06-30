const priorities = {
    1: 'Very High',
    2: 'High',
    3: 'Normal',
    4: 'Optional'
}

let nextId = 1
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
        todos.push({ id: nextId++, text: todo, priority: priority, status: 'pending' })
        printTodos()
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
    todo.status = ev.currentTarget.id == 'pendList' ? 'pending' : 'completed'
    printTodos()
}