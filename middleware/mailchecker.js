const http = require("https");

exports.mailchecker = async (req, res, next) => {
  /* try {
    const mail = req.body.email;
    const options = {
      method: "GET",
      hostname: "email-checker.p.rapidapi.com",
      port: null,
      path: `/verify/v1?${mail}`,
      headers: {
        "X-RapidAPI-Key": "f33b226cdcmshdbd84d8eccec16dp1a49dcjsn165baab5dde7",
        "X-RapidAPI-Host": "email-checker.p.rapidapi.com",
        useQueryString: true,
      },
    };
  } catch (err) {
    next(err);
    console.log(err);
  } */
  const mail = req.body.email;
  const options = {
    method: "GET",
    hostname: "email-checker.p.rapidapi.com",
    port: null,
    path: "/verify/v1?$raveenlw44@gmail.com",
    headers: {
      "X-RapidAPI-Key": "f33b226cdcmshdbd84d8eccec16dp1a49dcjsn165baab5dde7",
      "X-RapidAPI-Host": "email-checker.p.rapidapi.com",
      useQueryString: true,
    },
  };
  const reqe = http.request(options, function (res) {
    const chunks = [];
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
    res.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  reqe.end();
};
