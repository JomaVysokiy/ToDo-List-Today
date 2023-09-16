// Переменные
let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completedTodosDiv = document.querySelector('.completed-todos')
const uncompletedTodosDiv = document.querySelector('.uncompleted-todos')
const audio = new Audio('../picturesAndSound/sound.mp3')

// Получить список дел при первой загрузке
window.onload = () => {
  const storageTodoItems = localStorage.getItem('todoItems')
  if (storageTodoItems !== null) {
    todoItems = JSON.parse(storageTodoItems)
  }
  render()
}

// Получить содержимое, введенное на вход
todoInput.onkeyup = ((e) => {
  const value = e.target.value.replace(/^\s+/, '')
  if (value && e.keyCode === 13) { // Enter
    addTodo(value)

    todoInput.value = ''
    todoInput.focus()
  }
})

// Добавить todo
function addTodo (text) {
  todoItems.push({
    id: Date.now(),
    text,
    completed: false
  })

  saveAndRender()
}

// Удалить todo
function removeTodo (id) {
  todoItems = todoItems.filter(todo => todo.id !== Number(id))
  saveAndRender()
}

// Задача выполнена
function markAsCompleted (id) {
  todoItems = todoItems.filter(todo => {
    if (todo.id === Number(id)) {
      todo.completed = true
    }

    return todo
  })
  audio.play()
  saveAndRender()
}

// Задача не выполнена
function markAsUncompleted (id) {
  todoItems = todoItems.filter(todo => {
    if (todo.id === Number(id)) {
      todo.completed = false
    }

    return todo
  })

  saveAndRender()
}

// Сохранение в локальном хранилище
function save () {
  localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// Render
function render () {
  const unCompletedTodos = todoItems.filter(item => !item.completed)
  const completedTodos = todoItems.filter(item => item.completed)

  completedTodosDiv.innerHTML = ''
  uncompletedTodosDiv.innerHTML = ''

  if (unCompletedTodos.length > 0) {
    unCompletedTodos.forEach(todo => {
      uncompletedTodosDiv.append(createTodoElement(todo))
    })
  } else {
    uncompletedTodosDiv.innerHTML = "<div class ='empty'>Нету невыполненных задач</div>"
  }
  if (completedTodos.length > 0) {
    completedTodosDiv.innerHTML = `<div class='completed-title'>Выполнено (${completedTodos.length} / ${todoItems.length})</div>`

    completedTodos.forEach(todo => {
      completedTodosDiv.append(createTodoElement(todo))
    })
  }
}

// Сохранение и Render
function saveAndRender () {
  save()
  render()
}

// Создать элемент списка дел
function createTodoElement (todo) {
  // Создать контейнер списка дел
  const todoDiv = document.createElement('div')
  todoDiv.setAttribute('data-id', todo.id)
  todoDiv.className = 'todo-item'

  // Создать текст задачи
  const todoTextSpan = document.createElement('span')
  todoTextSpan.innerHTML = todo.text

  // Марка(галочка) для списка
  const todoInputCheckbox = document.createElement('input')
  todoInputCheckbox.type = 'checkbox'
  todoInputCheckbox.checked = todo.completed
  todoInputCheckbox.onclick = (e) => {
    const id = e.target.closest('.todo-item').dataset.id
    e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
  }

  // Кнопка «Удалить» из списка
  const todoRemoveBtn = document.createElement('a')
  todoRemoveBtn.href = '#'
  todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M18 6l-12 12"></path>
                          <path d="M6 6l12 12"></path>
                            </svg>`
  todoRemoveBtn.onclick = (e) => {
    const id = e.target.closest('.todo-item').dataset.id
    removeTodo(id)
  }

  todoTextSpan.prepend(todoInputCheckbox)
  todoDiv.appendChild(todoTextSpan)
  todoDiv.appendChild(todoRemoveBtn)

  return todoDiv
}
