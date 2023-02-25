const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports.createContact = async function (req, res) {
  try {
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
