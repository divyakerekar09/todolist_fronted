import { configureStore, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const todoSlice = createSlice({
  name: "todo",
  initialState: {
    items: [],
  },
  reducers: {
    addItemSuccess: (state, action) => {
      state.items.push(action.payload);
    },
    getItemsSuccess: (state, action) => {
      state.items = action.payload;
    },
    editItemSuccess: (state, action) => {
      const { id, item } = action.payload;
      const editedItem = state.items.find((item) => item.id === id);
      if (editedItem) {
        editedItem.item = item;
      }
    },
    deleteItemSuccess: (state, action) => {
      const deletedItemId = action.payload;
      state.items = state.items.filter((item) => item._id !== deletedItemId);
    },
   
  },
});

export const {
  addItemSuccess,
  getItemsSuccess,
  editItemSuccess,handleStatusSuccess,
  deleteItemSuccess,
} = todoSlice.actions;

// Async action to add an item using the API
export const addItemAsync = (item,description) => async (dispatch) => {
  try {
    const response = await axios.post("https://todo-list-node-u2xd.onrender.com/api/create-item", {
      item,description,
      completed: false,
    });
    dispatch(addItemSuccess(response.data.result)); // Use response.data instead of item
    console.log(response.data);
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

export const getItemAsync = () => async (dispatch) => {
  try {
    const response = await axios.get("https://todo-list-node-u2xd.onrender.com/api/get-all-todos");
    const items = response.data; // Assuming the response data is an array of objects
    dispatch(getItemsSuccess(response.data));
    console.log(items);
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

// Async action to edit an item using the API
export const editItemAsync = (id, item,description,) => async (dispatch) => {
  try {
    const response = await axios.put(
      `https://todo-list-node-u2xd.onrender.com/api/update-todo-by-id/${id}`,
      {
        item,description,
      }
    );
    dispatch(editItemSuccess(response.data));
  } catch (error) {
    console.error("Error editing item:", error);
  }
};
// Async action to handle status using the API
export const handleStatusAsync = (id) => async (dispatch, getState) => {
  try {
    const response = await axios.patch(`https://todo-list-node-u2xd.onrender.com/api/toggle-status/${id}`);
    dispatch(handleStatusSuccess(response.data));
  } catch (error) {
    console.error("Error handling status:", error);
  }
};

// Async action to delete an item using the API
export const deleteItemAsync = (id) => async (dispatch) => {
  try {
    await axios.delete(`https://todo-list-node-u2xd.onrender.com/api/delete-one-todo/${id}`);
    dispatch(deleteItemSuccess(id)); 
    // Dispatch deleteItemSuccess action with the deleted item id
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};



export const store = configureStore({
  reducer: {
    todo: todoSlice.reducer,
  },
});
