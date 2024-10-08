import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/users";
const DEPARTMENTS_API_URL = "http://localhost:8080/api/departments";
const COMPANIES_API_URL = "http://localhost:8080/api/companies";
const DESKS_API_URL = "http://localhost:8080/api/desks";
const RESERVATIONS_API_URL = "http://localhost:8080/api/reservations";

export const listUsers = () => axios.get(REST_API_BASE_URL);
export const deleteUser = (userId) =>
  axios.delete(`${REST_API_BASE_URL}/${userId}`);
export const updateUser = (userId, updatedUser) =>
  axios.put(`${REST_API_BASE_URL}/${userId}`, updatedUser);
export const createUser = (user) => axios.post(REST_API_BASE_URL, user);
export const fetchDepartments = () => axios.get(DEPARTMENTS_API_URL);
export const fetchCompanies = () => axios.get(COMPANIES_API_URL);

// Desk API Endpoints
export const listDesks = () => axios.get(DESKS_API_URL);
export const getDesk = (deskId) => axios.get(`${DESKS_API_URL}/${deskId}`);
export const createDesk = (desk) => axios.post(DESKS_API_URL, desk);
export const updateDesk = (deskId, updatedDesk) =>
  axios.put(`${DESKS_API_URL}/${deskId}`, updatedDesk);
export const deleteDesk = (deskId) =>
  axios.delete(`${DESKS_API_URL}/${deskId}`);

// Reservation API Endpoints
export const listReservations = () => axios.get(RESERVATIONS_API_URL);

export const getReservation = (reservationId) =>
  axios.get(`${RESERVATIONS_API_URL}/${reservationId}`);
export const createReservation = (reservation) =>
  axios.post(RESERVATIONS_API_URL, reservation);
export const updateReservation = (reservationId, updatedReservation) =>
  axios.put(`${RESERVATIONS_API_URL}/${reservationId}`, updatedReservation);
export const deleteReservation = (reservationId) =>
  axios.delete(`${RESERVATIONS_API_URL}/${reservationId}`);
// Example: Filter reservations by userId
export const listReservationsByUser = (userId) =>
  axios.get(`${RESERVATIONS_API_URL}?userId=${userId}`);
// export const listReservationsByUser = (userId) => {
//   const url = `${RESERVATIONS_API_URL}?userId=${userId}`;
//   console.log("Making API request to:", url); // Add this line for debugging
//   return axios.get(url);
// };
// export const listDesksWithStatus = async (selectedDate) => {
//   try {
//     const desksResponse = await listDesks();
//     const reservationsResponse = await listReservations();

//     const desks = desksResponse.data;
//     const reservations = reservationsResponse.data;

//     // Convert selectedDate to string in 'YYYY-MM-DD' format
//     const reservationDate = selectedDate.toISOString().split("T")[0];

//     // Map reservations by deskId and reservationDate
//     const reservedDesks = reservations.reduce((acc, reservation) => {
//       if (reservation.reservationDate === reservationDate) {
//         acc[reservation.deskId] = true;
//       }
//       return acc;
//     }, {});

//     return desks.map((desk) => ({
//       ...desk,
//       isReserved: reservedDesks[desk.id] || false,
//     }));
//   } catch (error) {
//     console.error("Error fetching desk statuses:", error);
//     throw error;
//   }
// };
export const listDesksWithStatus = async (selectedDate) => {
  try {
    const desksResponse = await listDesks();
    const reservationsResponse = await listReservations();

    const desks = desksResponse.data;
    const reservations = reservationsResponse.data;

    // Convert selectedDate to string in 'YYYY-MM-DD' format
    const reservationDate = selectedDate.toISOString().split("T")[0];

    console.log("Formatted Reservation Date:", reservationDate);
    console.log("Reservations:", reservations);

    // Map reservations by deskId and reservationDate
    const reservedDesks = reservations.reduce((acc, reservation) => {
      if (reservation.reservationDate === reservationDate) {
        acc[reservation.deskId] = true;
      }
      return acc;
    }, {});

    const desksWithStatus = desks.map((desk) => ({
      ...desk,
      isReserved: reservedDesks[desk.id] || false,
    }));

    console.log("Fetched desks with status:", desksWithStatus);
    return desksWithStatus;
  } catch (error) {
    console.error("Error fetching desk statuses:", error);
    throw error;
  }
};
