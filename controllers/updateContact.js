const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const db = require("../config/mysql").db;

module.exports.updateContact = async function (req, res) {
  try {
    // checking for all the required details...
    if (
      !req.body.contact_id ||
      !req.body.new_email ||
      !req.body.new_mobile_number ||
      !req.body.data_store
    ) {
      return res.status(400).json({
        success: false,
        message: "Please send all the details required in the API request",
      });
    }

    // data_store == "CRM"
    if (req.body.data_store == "CRM") {
      let data = {
        contact: {
          email: req.body.new_email,
          mobile_number: req.body.new_mobile_number,
        },
      };

      let response = await fetch(
        `${process.env.API_ROOT}/contacts/${req.body.contact_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token token=${process.env.API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
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
        message: "Contact updated succesfully",
        updated_contact: responseData.contact,
      });
    }

    // data_store == "DATABASE"
    if (req.body.data_store == "DATABASE") {
      const sqlUpdate = `UPDATE contacts SET email=?, mobile_number=? WHERE id=?`;

      db.query(
        sqlUpdate,
        [req.body.new_email, req.body.new_mobile_number, req.body.contact_id],
        function (err, result) {
          if (err) throw err;

          if (result.affectedRows == 0) {
            return res.status(400).json({
              success: false,
              message: "Bad Request",
            });
          }

          return res.status(200).json({
            success: true,
            message: "Contact updated successfully",
          });
        }
      );
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
