const fs = require('fs');
const {join} = require('path');
const {replaceInHtml} = require("./replace");

const mock = require("mock-fs");

const HTML = `
<html>
  <head>
    <link media="screen"
      href=
        "foo.css"
      rel="stylesheet">
  </head>
  <body>
  </body>
</html>`;

const HTML_REPLACED = `
<html>
  <head>
    <link media="screen"
      href=
        "foo-99440565f57b1f0c23afb0e0e71ffa35.css"
      rel="stylesheet">
  </head>
  <body>
  </body>
</html>`;

const CSS = "p{color:red;}"; // md5: 99440565f57b1f0c23afb0e0e71ffa35

function constructMockFs() {
  mock({
    "/cache-buster/test-data": {
      "foo.html": HTML,
      "foo.css": CSS
    }
  });
}

function destructMockFs() {
  mock.restore();
}

beforeEach(() => {
  constructMockFs();
});

afterEach(() => {
  destructMockFs();
});

const DIR = "/cache-buster/test-data";
const HTML_FILE = join(DIR, "foo.html");
const CSS_URL = "foo.css";
const CSS_FILE = join(DIR, CSS_URL);


test("replace links in html", async () => {
  expect(1).toBe(1);
  replaceInHtml(DIR, "foo.css");
  const html = await readHtml();
  expect(html).toBe(HTML_REPLACED);
  const files = await fs.promises.readdir(DIR);
  expect(files.length).toBe(2);
  expect(files.indexOf("foo.html")).toBeGreaterThan(-1);
  expect(files.indexOf("foo.css")).toBe(-1);
  expect(files.indexOf("foo-99440565f57b1f0c23afb0e0e71ffa35.css"))
    .toBeGreaterThan(-1);
  async function readHtml(){
    return await fs.promises.readFile(HTML_FILE, "utf8");
  }
});
