// GET /
const getIndex = (req, res) => {
  console.log(req.user);
  res.render('garden/index', { user: req.user });
};

module.exports = { getIndex };