const priorities = {
    1: 'Very High',
    2: 'High',
    3: 'Normal',
    4: 'Optional'
}

const pendTodos = []
const compTodos = []

const printList = (element, list) => {
    elem = document.getElementById(element)
    elem.innerHTML = ''
    list.sort((a, b) => a.priority - b.priority)
    for (const item of list) {
        elem.innerHTML += '<div><span>' + item.text + '</span><em>' + priorities[item.priority] + '</em></div>'
    }
}

function handleAddTodo(e) {
    e.preventDefault()
    const todo = document.forms["addTodoForm"]["todo"].value
    const priority = document.forms["addTodoForm"]["priority"].value
    if (todo) {
        document.forms["addTodoForm"].reset()
        document.forms["searchTodosForm"].reset()
        pendTodos.push({ text: todo, priority: priority })
        printList('pendList', pendTodos)
    }
}

function handleSearchTodos(e) {
    e.preventDefault()
    const query = document.forms["searchTodosForm"]["query"].value
    filteredPendTodos = pendTodos.filter(s => s.text.includes(query))
    filteredCompTodos = compTodos.filter(s => s.text.includes(query))
    printList('pendList', filteredPendTodos)
    printList('compList', filteredCompTodos)
}

function handleSearchTodosReset() {
    printList('pendList', pendTodos)
    printList('compList', compTodos)
}