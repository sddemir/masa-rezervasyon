import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api"; // Adjust base URL as per your backend setup

export const authenticateUser = async (email, password) => {
  try {
    // Fetch all users
    const response = await axios.get(`${REST_API_BASE_URL}/users`);
    const users = response.data;

    // Find the user matching the provided email and password
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Fetch user role based on userRoleId
    const userRoleResponse = await axios.get(
      `${REST_API_BASE_URL}/userRoles/${user.userRoleId}`
    );
    const userRole = userRoleResponse.data.roleName;

    // Return user details including the ID and role
    return { ...user, role: userRole };
  } catch (error) {
    throw error;
  }
};

export const fetchUserRoles = () => axios.get(`${REST_API_BASE_URL}/userRoles`);

//sdfg@dfghj.com
//sdfghj@dfghjk.com
//hgfdes43
