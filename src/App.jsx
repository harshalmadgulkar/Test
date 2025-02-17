import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isupdate, setIsupdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    console.log(savedTodos);
    if (savedTodos) {
      setTodoList(JSON.parse(savedTodos));
      setIsLoading(false);
    } else {
      fetchTodos();
    }
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('https://dummyjson.com/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      console.log(data.todos.slice(0, 5));
      setTodoList(
        data.todos.map((todo) => ({
          id: todo.id,
          todo: todo.todo,
          completed: todo.completed,
        }))
      );
      localStorage.setItem('todos', JSON.stringify(data.todos));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!isupdate && newTodo.trim() !== '') {
      const newTodoItem = { id: Date.now(), todo: newTodo, completed: false };
      const updatedTodoList = [newTodoItem, ...todoList];
      setTodoList(updatedTodoList);
      localStorage.setItem('todos', JSON.stringify(updatedTodoList));
      setNewTodo('');
    }
    // if (isupdate && newTodo.trim() !== '') {
    //   const newTodoItem = { id, text: newTodo, completed: false };
    //   const updatedTodoList = [newTodoItem, ...todoList];
    //   setTodoList(updatedTodoList);
    //   localStorage.setItem('todos', JSON.stringify(updatedTodoList));
    //   setNewTodo('');
    // }
  };

  // const handleEditTodo = (id) => {
  //   e.preventDefault();
  //   const todoEdit = todoList.filter((todo) => todo.id === id);
  //   setIsupdate(true);
  //   setNewTodo(todoEdit.text);
  // };

  const handleToggleTodo = (id) => {
    const updatedTodoList = todoList.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodoList(updatedTodoList);
    localStorage.setItem('todos', JSON.stringify(updatedTodoList));
  };

  const handleDeleteTodo = (id) => {
    const updatedTodoList = todoList.filter((todo) => todo.id !== id);
    setTodoList(updatedTodoList);
    localStorage.setItem('todos', JSON.stringify(updatedTodoList));
  };

  if (isLoading) {
    return <div className='text-center mt-8'>Loading Your ToDo List</div>;
  }

  return (
    <div className='container mx-auto p-4 max-w-md'>
      <h1 className='text-3xl font-bold text-center mb-6'>To-Do List App</h1>

      <form onSubmit={handleAddTodo} className='mb-4'>
        <div className='flex'>
          <input
            type='text'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder='Add a new todo'
            className='flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none'
          />
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none'
          >
            Add
          </button>
        </div>
      </form>

      <ul className='flex flex-col gap-2'>
        {todoList.map((todo) => (
          <li
            key={todo.id}
            className='flex items-center bg-white p-2 rounded-md shadow'
          >
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
              className='mr-2'
            />
            <span
              className={`flex-grow ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.todo}
            </span>
            <div className='flex justify-center gap-2'>
              {/* <button
                onClick={() => handleEditTodo(todo.id)}
                className='text-red-500 hover:text-red-700 focus:outline-none'
              >
                Edit
              </button> */}
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className='text-red-500 hover:text-red-700 focus:outline-none'
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
