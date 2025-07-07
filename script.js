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

async function handleAddTodo(e) {
    e.preventDefault()
    const todo = document.forms["addTodoForm"]["todo"].value
    const priority = document.forms["addTodoForm"]["priority"].value
    if (todo) {
        document.forms["addTodoForm"]["todo"].value = ''
        document.forms["searchTodosForm"].reset()

        fields = {
            text: { stringValue: todo },
            priority: { stringValue: priority },
            status: { stringValue: 'pending' }
        }

        try {
            const response = await fetch('https://firestore.googleapis.com/v1/projects/searchable-todo-list/databases/(default)/documents/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fields })
            })
            const json = await response.json()
            const idArr = json.name.split('/')
            const id = idArr[idArr.length - 1]
            todos.push({ id: id, text: todo, priority: priority, status: 'pending' })
            printTodos()
        } catch (error) {
            console.log(error)
        }
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

    fetch(`https://firestore.googleapis.com/v1/projects/searchable-todo-list/databases/(default)/documents/todos/${data}?updateMask.fieldPaths=status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fields: {
                status: { stringValue: newStatus }
            }
        })
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Change to:', data.fields.status.stringValue)
    })
    .catch((error) => console.log(error))
}

fetch('https://firestore.googleapis.com/v1/projects/searchable-todo-list/databases/(default)/documents/todos')
.then((response) => response.json())
.then((data) => {
    for (const todo of data.documents) {
        const idArr = todo.name.split('/')
        const id = idArr[idArr.length - 1]
        todos.push({
            id: id,
            text: todo.fields.text.stringValue,
            priority: todo.fields.priority.stringValue,
            status: todo.fields.status.stringValue
        })
    }
    printTodos()
})
.catch((error) => console.log(error))
