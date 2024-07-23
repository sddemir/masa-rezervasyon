import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap"; // Import Button from react-bootstrap
import DeleteEmployee from "./DeleteEmployee";
import UpdateEmployee from "./UpdateEmployee";
import AddEmployee from "./AddEmployee";
import {
  listUsers,
  fetchDepartments,
  fetchCompanies,
  deleteUser,
} from "../../services/userService";
import { fetchUserRoles } from "../../services/userRole";

const Calisanlar = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false); // New state for form visibility

  useEffect(() => {
    // Fetch employees data from the backend
    const fetchData = async () => {
      try {
        const [
          usersResponse,
          departmentsResponse,
          companiesResponse,
          rolesResponse,
        ] = await Promise.all([
          listUsers(),
          fetchDepartments(),
          fetchCompanies(),
          fetchUserRoles(),
        ]);

        setEmployees(usersResponse.data);
        setDepartments(departmentsResponse.data);
        setCompanies(companiesResponse.data);
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteUser(employeeId);
      setEmployees(employees.filter((employee) => employee.id !== employeeId));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
    setSelectedEmployee(null);
  };

  const handleSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleToggleAddEmployee = () => {
    setShowAddEmployee(!showAddEmployee); // Toggle form visibility
  };

  // Helper functions to get names
  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.departmentName : "Unknown";
  };

  const getCompanyName = (companyId) => {
    const company = companies.find((comp) => comp.id === companyId);
    return company ? company.companyName : "N/A";
  };

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.roleName : "N/A";
  };

  return (
    <div className="employee-list">
      <Button onClick={handleToggleAddEmployee} className="mb-3">
        {showAddEmployee ? "Kapat" : "Çalışan Ekle"}
      </Button>
      {showAddEmployee && <AddEmployee />}{" "}
      {/* Conditionally render AddEmployee */}
      <table className="table">
        <thead>
          <tr>
            <th>İsim</th>
            <th>Email</th>
            <th>Departman</th>
            <th>Şirket</th>
            <th>Rol</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              onClick={() => handleSelect(employee)}
              style={{ cursor: "pointer" }}
            >
              <td>{`${employee.firstName} ${employee.lastName}`}</td>
              <td>{employee.email}</td>
              <td>{getDepartmentName(employee.departmentId)}</td>
              <td>{getCompanyName(employee.companyId)}</td>
              <td>{getRoleName(employee.userRoleId)}</td>
              <td>
                <UpdateEmployee
                  employee={employee}
                  onUpdate={handleUpdateEmployee}
                />
                <DeleteEmployee
                  employee={employee}
                  deleteEmployee={handleDeleteEmployee}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calisanlar;
