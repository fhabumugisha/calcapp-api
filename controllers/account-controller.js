
const projectService = require("../services/project-service");
const userService = require("../services/user-service");

/**
 *
 * @param {*} projectId
 * @param {*} req
 */
async function verifyReadAccountById(accountId, req) {
  const account = await userService.getUser(accountId);
  if (!account) {
    const error = new Error('Could not find account.');
    error.statusCode = 404;
    throw error;
  }
  // eslint-disable-next-line no-underscore-dangle
  if (account._id.toString() !== req.userId) {
    const error = new Error('Not authorized!');
    error.statusCode = 403;
    throw error;
  }
  return account;
}

exports.deleteAccount = async (req, res, next) => {
  const { accountId } = req.params;

  try {
    await verifyReadAccountById(accountId, req);

    await userService.deleteUser(accountId);

    await projectService.deleteProjectsByUserId(accountId);

    res.status(200).json({
      message: 'Deleted account.'
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
