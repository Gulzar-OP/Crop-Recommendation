const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = Array.isArray(body.detail)
      ? body.detail.map((x) => x.msg).join(", ")
      : body.detail;

    throw new Error(
      body.message ||
      detail ||
      "Request failed"
    );
  }

  return body;
}

export async function getCropDetails(cropName) {
  const response = await fetch(
    `${API_URL}/crops/${encodeURIComponent(cropName)}`,
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load crop details"
    );
  }

  return data.crop;
}

export const registerUser = (data) =>
  request("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const loginUser = (data) =>
  request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const logoutUser = () =>
  request("/api/v1/auth/logout", {
    method: "POST",
  });

export const getMe = () =>
  request("/api/v1/auth/me")
    .then((result) => result.user);

export const recommendCrop = (values) =>
  request("/api/v1/recommendations", {
    method: "POST",
    body: JSON.stringify(values),
  });

export const getHistory = () =>
  request("/api/v1/recommendations/history");

export const deleteHistory = (id) =>
  request(
    `/api/v1/recommendations/history/${id}`,
    {
      method: "DELETE",
    }
  );