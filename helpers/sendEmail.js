const ElasticEmail = require("@elasticemail/elasticemail-client");
require("dotenv").config();

const defaultClient = ElasticEmail.ApiClient.instance;

const { apikey } = defaultClient.authentications;
apikey.apiKey = `${process.env.ELASTIC_API_KEY}`;


const api = new ElasticEmail.EmailsApi();

const sendEmail = async (data) => {
  const sendEmail = { ...data };

  const callback = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
      console.log("API called successfully.");
    }
  };
  api.emailsPost(sendEmail, callback);
};

module.exports = sendEmail;
