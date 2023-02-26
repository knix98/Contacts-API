const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const db = require("../config/mysql").db;

module.exports.getContact = async function (req, res) {
  try {
    // checking for all the required details...
    if (!req.body.contact_id || !req.body.data_store) {
      return res.status(400).json({
        success: false,
        message: "Please send all the details required in the API request",
      });
    }

    // data_store == "CRM"
    if (req.body.data_store == "CRM") {
      let response = await fetch(
        `${process.env.API_ROOT}/contacts/${req.body.contact_id}`,
        {
          method: "GET",
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
        message: "Here is your contact",
        contact: responseData.contact,
      });
    }

    // data_store == "DATABASE"
    if (req.body.data_store == "DATABASE") {
      const sqlSelect = `SELECT * FROM contacts WHERE id = ?`;

      db.query(sqlSelect, req.body.contact_id, function (err, result) {
        if (err) throw err;

        if (result.length == 0) {
          return res.status(200).json({
            success: false,
            message: "No contact with the given id",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Here is your contact",
          contact: result[0],
        });
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Please send correct data_store value",
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
