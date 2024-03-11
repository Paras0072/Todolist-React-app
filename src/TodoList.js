// Import necessary libraries
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the existing CSS file

// TodoList component
const TodoList = () => {
  const [todos, setTodos] = useState([]); // for setting in react state
  const [showAddForm, setShowAddForm] = useState(false); // for adding and updating data
  const [newTodo, setNewTodo] = useState({ id: "", title: "" }); // for adding new todo
  const [editTodo, setEditTodo] = useState(null); // for updating todo
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // for showing how many todo visible in one Page

  // for fetching todoes from API
  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };
  // for adding the todoes
  const addTodo = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTodo((prevTodo) => ({ ...prevTodo, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Simulate adding a todo on the server (dummy POST request)
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/todos",
        { title: newTodo.title, completed: false } // Omit the 'id' field
      );

      // Update state with the new todo (even though it's not added on the server)
      setTodos([...todos, response.data]);
      setShowAddForm(false);

      // Log the response data to the console
      console.log("New Todo:", response.data);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };
  // for updating the todo
  const updateTodo = (id) => {
    // Find the todo to be updated
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (!todoToUpdate) {
      console.error(`Todo with ID ${id} not found.`);
      return;
    }

    // Open the form with existing todo data for editing
    setEditTodo(todoToUpdate);
    setShowAddForm(true);
  };

  const handleEditSubmit = async () => {
    try {
      // Simulate updating a todo on the server (dummy PUT request)
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/todos/${editTodo.id}`,
        { ...editTodo, completed: !editTodo.completed }
      );

      // Update state with the modified todo
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editTodo.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      );

      // Log the response data to the console
      console.log("Updated Todo:", response.data);

      // Reset editTodo and hide the form
      setEditTodo(null);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // for deleting the todo
  const deleteTodo = async (id) => {
    try {
      // Simulate deleting a todo on the server (dummy DELETE request)
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);

      // Update state by removing the deleted todo
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

      // Log the deleted todo ID to the console
      console.log("Deleted Todo ID:", id);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTodos = todos.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container">
      <div className="box">
        <h1>Todo List</h1>
        <button onClick={addTodo}>Add Todo</button>
        <ul>
          {/* mapping all the todoes */}
          {currentTodos.map((todo) => (
            <li key={todo.id}>
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
                onClick={() => console.log("Todo clicked:", todo.title)}
              >
                {`ID: ${todo.id} - Title: ${todo.title}`}
              </span>

              <div className="button-container">
                <button
                  className="update-button"
                  onClick={() => updateTodo(todo.id)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {showAddForm && (
          <div className="add-form">
            <label>
              ID:
              <input
                type="text"
                name="id"
                value={newTodo.id}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={newTodo.title}
                onChange={handleInputChange}
              />
            </label>
            <button
              onClick={editTodo !== null ? handleEditSubmit : handleSubmit}
            >
              {editTodo !== null ? "Update" : "Submit"}
            </button>
          </div>
        )}
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Prev
          </button>
          <button onClick={nextPage} disabled={indexOfLastItem >= todos.length}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
