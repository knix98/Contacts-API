const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports.deleteContact = async function (req, res) {
  try {
    if (req.body.data_store == "CRM") {
      let response = await fetch(
        `${process.env.API_ROOT}/contacts/${req.body.contact_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token token=${process.env.API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      let responseData = await response.json();

      if (responseData.errors) {
        return res.status(responseData.errors.code).json({
          success: false,
          message: responseData.errors.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Contact deleted successfully",
      });
    }

    if (req.body.data_store == "DATABASE") {
    }

    return res.status(400).json({
      success: false,
      message: "Bad Request",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
