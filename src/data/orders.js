// Orders remain in memory for the MVP. The controller now creates records with
// customerId, ownerId, and shopId fields so the move to role-based persistence
// later will require less refactoring.
const orders = [];

module.exports = orders;
