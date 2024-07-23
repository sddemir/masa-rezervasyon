import React from "react";

const DeleteEmployee = ({ employee, deleteEmployee }) => {
  const handleDelete = async () => {
    try {
      await deleteEmployee(employee.id);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <button className="delete-button" onClick={handleDelete}>
      Sil
    </button>
  );
};

export default DeleteEmployee;
