import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addItemAsync, getItemAsync ,editItemAsync, deleteItemAsync} from "../../Redux/Store"; // Import the getItemAsync action
import { addItemSuccess, editItemSuccess, deleteItemSuccess } from "../../Redux/Store";
import { SvgIcon } from "../../Components/SvgIcon";
import "./ToDo.css";

export default function ToDo() {
  const editItemRef = useRef(null); // Ref for item title
  const editDescriptionRef = useRef(null); // Ref for item description
  const [editItemId, setEditItemId] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const dispatch = useDispatch();

  const items = useSelector((state) => state.todo.items.flat()); // useSelector outside the callback
 // Effect runs whenever items state changes
 const completedItems = items.filter((item) => item.completed === true);
 const editInputRef = useRef(null);
 

  // Use useSelector to get items from the Redux store
  // const items = useSelector((state) => state.todo.items);
  // Fetch items on component mount
  useEffect(() => {
    if (!items.length) {
      dispatch(getItemAsync());
    }

    console.log(items);
  }, [items, dispatch]);



  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = e.target.item.value.trim();
    const newDescription = e.target.description.value.trim(); // Retrieve the value of the description input
    if (newItem !== "" && newDescription !== "") { // Check if both item and description are not empty
      dispatch(addItemAsync(newItem, newDescription)); // Pass newItem and newDescription to addItemAsync
      e.target.reset();
    } else {
      e.target.reset();
    }
  };
  

 // Inside the ToDo component
 const handleEdit = (id, newItem, newDescription) => {
  dispatch(editItemAsync(id, newItem, newDescription))
    .then(() => {
      dispatch(getItemAsync());
    })
    .catch((error) => {
      console.error("Error editing item:", error);
    });
};



const handleTaskClick = (e, task) => {
  const targetClass = e.target.className;

  if (typeof targetClass === "string") {
    if (targetClass.includes("fa-pen")) {
      setEditItemId(task._id);
    } else if (targetClass.includes("fa-check")) {
      if (editItemRef.current.value.trim() !== "") {
        handleEdit(task._id, editItemRef.current.value.trim());
        setEditItemId(null);
      } else {
        dispatch(deleteItemAsync(task._id)); // Dispatch deleteItemAsync action
      }
    } else if (targetClass.includes("fa-trash")) {
      dispatch(deleteItemAsync(task._id)); // Dispatch deleteItemAsync action
    }
  }
};
return (
  <section>
    <div className="todo-app">
      <form className="input-section" onSubmit={handleSubmit}>
        <input type="text" placeholder="Add item..." name="item" />
        <input type="text" placeholder="Add item..." name="description" />
        <button type="submit" className="add">
          Add
        </button>
      </form>

      <div className="todos">
        <ul className="todo-list">
          {items.map((task) => (
            <li
              key={task._id}
              className={`task ${showAnimation ? "slide-down" : ""}`}
              onClick={(e) => handleTaskClick(e, task)}
            >
              {editItemId !== task._id ? (
                <>
                  <label className="container">
                    <input type="checkbox" defaultChecked={task.completed} />
                    <SvgIcon />
                    <span className="todo-text">{task.item}</span>
                    <span className="todo-text">{task.description}</span>

                  </label>
                  <span className="span-button">
                    <i  className="fa-solid fa-pen" onClick={() => setEditItemId(task._id)}></i>
                  </span>
                  <span className="span-button">
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </>
              ) : (
                <>
                  <label className="container">
                  <SvgIcon />
                    <input type="checkbox" defaultChecked={task.completed} />
                    <input
                      type="text"
                      defaultValue={task.item}
                      className="edit-input"
                      ref={editItemRef}
                    />
                    <input
                      type="text"
                      defaultValue={task.description}
                      className="edit-input"
                      ref={editDescriptionRef}
                    />
                  </label>
                  <span className="span-button">
                    <i className="fa-solid fa-check" onClick={() => handleEdit(task._id, editItemRef.current.value.trim(), editDescriptionRef.current.value.trim())}></i>
                  </span>
                  <span className="span-button">
                    <i className="fa-solid fa-trash" ></i>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
        {completedItems.length > 0 && (
            <>
              <label className="ps-4 my-2">Completed</label>
              <ul className="todo-list">
                {completedItems.map((task) => (
                  <li
                    key={task.id}
                    className={`task ${showAnimation ? "slide-down" : ""}`}
                    onClick={(e) => handleTaskClick(e, task)}
                  >
                    {/* It checks the id passed from edit icon and current task are equal or not */}
                    {editItemId !== task.id ? (
                      <>
                        <label className="container">
                          <input type="checkbox" defaultChecked />
                          <SvgIcon />
                          <span className="todo-text">{task.item}</span>
                        </label>
                        <span className="span-button">
                          <i className="fa-solid fa-pen"></i>
                        </span>
                        <span className="span-button">
                          <i className="fa-solid fa-trash"></i>
                        </span>
                      </>
                    ) : (
                      <>
                        <label className="container">
                          <input type="checkbox" />
                          <SvgIcon />

                          <input
                            type="text"
                            defaultValue={task.item}
                            className="edit-input"
                            ref={editInputRef}
                          />
                        </label>
                        <span className="span-button">
                          <i className="fa-solid fa-check"></i>
                        </span>
                        <span className="span-button">
                          <i className="fa-solid fa-trash"></i>
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

      </div>
    </div>
  </section>
);
}