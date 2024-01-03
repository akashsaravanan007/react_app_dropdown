import React, { useState, useEffect } from 'react';
import './App.css';

const generateRandomData = () => {
  const data = [];
  for (let i = 1; i <= 10; i++) {
    data.push({
      id: i,
      name: `User ${i}`,
      age: Math.floor(Math.random() * 30) + 20,
      isChecked: false,
      dropdownValue: 'OED',
    });
  }
  return data;
};

const App = () => {
  const [tableData, setTableData] = useState(() => {
  const savedData = JSON.parse(localStorage.getItem('tableData'));
    return savedData || generateRandomData();
  });

  const [updateMessage, setUpdateMessage] = useState('');

  const handleCheckboxChange = (id) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const handleDropdownChange = (id, value) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, dropdownValue: value } : item
      )
    );
  };

  const handleUpdateClick = () => {
    localStorage.setItem('tableData', JSON.stringify(tableData));
    setUpdateMessage('Details updated successfully');
    setTimeout(() => setUpdateMessage(''), 3000);
  };

  return (
    <div>
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
          {tableData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </td>
              <td>
                <select
                  disabled={!item.isChecked}
                  value={item.dropdownValue}
                  onChange={(e) => handleDropdownChange(item.id, e.target.value)}
                >
                  <option value="OED">OED</option>
                  <option value="ODM">ODM</option>
                  <option value="OOM">OOM</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleUpdateClick}>Update</button>
      {updateMessage && <p>{updateMessage}</p>}
    </div>
  );
};

export default App;
