export const getUser = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
};

export const getRole = () => {
  const user = getUser();
  return user?.role || null;
};

export const isPrincipal = () => getRole() === "principal";
export const isTeacher = () => getRole() === "teacher";
export const isReceptionist = () => getRole() === "accountant";

export const isLoggedIn = () => !!getUser();