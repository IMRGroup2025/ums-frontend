export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getRole = () => {
  const user = getUser();
  return user?.user_type;
};

export const isLoggedIn = () => {
  return !!getUser();
};

export const logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};
