export const validatePassword = (password, userInfo = {}) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("passwordMinLength");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("passwordUppercase");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("passwordLowercase");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("passwordNumber");
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) {
    errors.push("passwordSpecial");
  }

  const { firstName, lastName, email } = userInfo;
  const lowered = password.toLowerCase();

  const personalParts = [firstName, lastName, email?.split("@")[0]].filter(
    (part) => part && part.length >= 3,
  );

  if (personalParts.some((part) => lowered.includes(part.toLowerCase()))) {
    errors.push("passwordNoPersonalInfo");
  }

  return { isValid: errors.length === 0, errors };
};
