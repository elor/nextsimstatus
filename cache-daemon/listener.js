const express = require("express");
const cors = require("cors");

module.exports.listen = function(PORT, getDataCallback) {
  const app = express();

  function formatError(error) {
    return JSON.stringify({
        error: "Error while processing the request",
        message: error ? error.message || error.msg || error : ""
      },
      null,
      "  "
    );
  }

  let router = express.Router();

  const allCommands = {
    all: () => {
      return {
        ...getDataCallback()
      };
    }

  };

  router.get("/:command", function(request, response, next) {
    let command = request.params.command || undefined;

    new Promise((resolve, reject) => {
        if (!command || !allCommands[command]) {
          return reject(new Error("Command not recognized."));
        }

        resolve(JSON.stringify(allCommands[command](), null, " "));
      })
      .then(jsonstring => {
        response.send(jsonstring);
      })
      .catch(error => {
        response.status(400).send(formatError(error));
      });
  });

  app.use(cors());

  app.use("/", router);

  app.listen(PORT);

  console.log("listening on port " + PORT);

  return app;
};
