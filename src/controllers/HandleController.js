const cheerio = require("cheerio");
const request = require("request-promise");

module.exports = {
  crawlData(req, res) {
    var query = req.query;
    if (query.url) {
      return request(query.url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          var columns = [];
          var rows = [];
          $(".wikitable").each((index, el) => {
            $(el)
              .find("tr>th")
              .each((i, temp) => {
                columns.push($(temp).text().trim() || 0);
              });
            $(el)
              .find("tr>td")
              .each((i, temp) => {
                rows.push($(temp).text().trim());
              });
          });
          var rowsChunk = [];
          rowsChunk = chunk(rows, 4);
          var array_responses = [];
          if (rowsChunk.length > 0) {
            rowsChunk.map((item) => {
              var tempObject = {};
              item.map((element, index) => {
                let value = "";
                if (index == 0) {
                  value = element.split("m")[0].trim();
                } else if (index == 3) {
                  value = element.split("[")[0].trim();
                } else {
                  value = element;
                }
                tempObject[columns[index]] = value;
              });
              array_responses.push(tempObject);
            });
          }
          return res.send({ status: true, data: array_responses });
        } else {
          return res.send({
            status: false,
            msg: "the link have problems, please check again.",
          });
        }
      });
    } else {
        return res.send({
            status: false,
            msg: "Url invalid",
          });
    }
  },
};

function chunk(arr, chunkSize) {
  if (chunkSize <= 0) throw "Invalid chunk size";
  var R = [];
  for (var i = 0, len = arr.length; i < len; i += chunkSize)
    R.push(arr.slice(i, i + chunkSize));
  return R;
}
