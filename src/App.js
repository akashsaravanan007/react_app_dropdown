import React, { useState, useEffect } from "react";
import "./App.css";

const UserForm = () => {
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    isChecked: false,
    dropdownValue: "OED",
  });

  const [userList, setUserList] = useState([]);
  const [editUserId, setEditUserId] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editUserId) {
     
      try {
        const response = await fetch(`http://localhost:5000/api/users/${editUserId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const updatedUser = await response.json();

        setUserList((prevList) =>
          prevList.map((user) => (user._id === editUserId ? updatedUser : user))
        );

        setEditUserId(null);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    } else {

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const newUser = await response.json();
      setUserList((prevList) => [...prevList, newUser]);
    } catch (error) {
      console.error("Error submitting user data:", error);
    }
  }

  setUserData({
    name: "",
    age: "",
    isChecked: false,
    dropdownValue: "OED",
  });
};

const handleEdit = (userId) => {
  const userToEdit = userList.find((user) => user._id === userId);
  setUserData({ ...userToEdit });
  setEditUserId(userId);
};

const handleDelete = async (userId) => {
  try {
    await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "DELETE",
    });

    setUserList((prevList) => prevList.filter((user) => user._id !== userId));
  } catch (error) {
    console.error("Error deleting user data:", error);
  }
};

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        const users = await response.json();
        setUserList(users);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Age:
          <input
            type="text"
            name="age"
            value={userData.age}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Checkbox:
          <input
            type="checkbox"
            name="isChecked"
            checked={userData.isChecked}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Dropdown:
          <select
            name="dropdownValue"
            value={userData.dropdownValue}
            onChange={handleChange}
          >
            <option value="OED">OED</option>
            <option value="ODM">ODM</option>
            <option value="OOM">OOM</option>
          </select>
        </label>
        <br />
        <button type="submit">{editUserId ? "Update" : "Submit"}</button>
      </form>

      <h2>User Table</h2>
      <table>
        <thead>
          <tr>
            <th>S.no</th>
            <th>Name</th>
            <th>Age</th>
            <th>Checkbox</th>
            <th>Dropdown</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.isChecked ? "Checked" : "Unchecked"}</td>
              <td>{user.dropdownValue}</td>
              <td>
                <button onClick={() => handleEdit(user._id)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserForm;
