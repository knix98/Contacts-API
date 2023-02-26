const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const db = require("../config/mysql").db;

module.exports.createContact = async function (req, res) {
  try {
    // checking for all the required details...
    if (
      !req.body.first_name ||
      !req.body.last_name ||
      !req.body.email ||
      !req.body.mobile_number ||
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
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          mobile_number: req.body.mobile_number,
        },
      };

      let response = await fetch(`${process.env.API_ROOT}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Token token=${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let responseData = await response.json();

      if (responseData.errors) {
        return res.status(responseData.errors.code).json({
          success: false,
          message: responseData.errors.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Contact created successfully",
        contact: {
          id: responseData.contact.id,
          ...data.contact,
        },
      });
    }

    // data_store == "DATABASE"
    if (req.body.data_store == "DATABASE") {
      const sqlInsert = `INSERT INTO contacts(first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?);`;
      db.query(
        sqlInsert,
        [
          req.body.first_name,
          req.body.last_name,
          req.body.email,
          req.body.mobile_number,
        ],
        (err, result) => {
          if (err) throw err;

          return res.status(200).json({
            success: true,
            message: "Contact created successfully",
            contact: {
              id: result.insertId,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              mobile_number: req.body.mobile_number,
            },
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
