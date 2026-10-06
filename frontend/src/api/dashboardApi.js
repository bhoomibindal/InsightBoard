const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchStats(startDate, endDate) {
  const params = new URLSearchParams();

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_BASE_URL}/stats${queryString ? `?${queryString}` : ""}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return response.json();
}


export async function fetchRevenue(startDate, endDate) {
  const params = new URLSearchParams();

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_BASE_URL}/revenue${queryString ? `?${queryString}` : ""}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch revenue data");
  }

  return response.json();
}

export async function fetchCategories(startDate, endDate) {
  const params = new URLSearchParams();

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_BASE_URL}/categories${queryString ? `?${queryString}` : ""}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category data");
  }

  return response.json();
}

export async function fetchOrders(startDate, endDate) {
  const params = new URLSearchParams();

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_BASE_URL}/orders${queryString ? `?${queryString}` : ""}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}