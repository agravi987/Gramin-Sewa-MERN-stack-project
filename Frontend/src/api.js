const API_URL = "http://localhost:5000/api"; // replace with your backend URL

export const createBooking = async (data, token) => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const getBookings = async (token) => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
