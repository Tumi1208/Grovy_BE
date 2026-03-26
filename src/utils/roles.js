const USER_ROLES = ["user", "owner"];

const isSupportedRole = (role) => USER_ROLES.includes(role);

module.exports = {
  USER_ROLES,
  isSupportedRole,
};
