const uploadController = async (req, res) => {
  console.log("controller", req.file);
  res.json({ status: "Success" });
};

module.exports = {
  uploadController,
};
