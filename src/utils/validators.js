function normalizeEmail(email) {
  return `${email || ""}`.trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

function isValidPassword(password) {
  return typeof password === "string" && password.trim().length >= 6;
}

function isValidPhone(phone) {
  if (!phone) {
    return true;
  }

  return /^[0-9+()\-\s]{8,20}$/.test(`${phone}`.trim());
}

function isValidHttpUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

module.exports = {
  normalizeEmail,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidHttpUrl,
};
