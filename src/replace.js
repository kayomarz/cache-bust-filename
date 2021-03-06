const {readFileSync, renameSync} = require("fs");
const md5 = require('md5');
const {resolve, join, extname, relative} = require("path");
const replace = require('replace-in-file');

const {replacerForLinkEl} = require('./replacers');

function err(msg) {
  throw new Error(`cacheBustLink: ${msg}`);
}

function log(msg) {
  console.log(`cacheBustLink: ${msg}`);
}

function fullPath(path) {
  return resolve(__dirname, path);
}

const REPLACERS = {
  ".css": replacerForLinkEl
};

function getReplacer(ext, linkUrl, newUrl) {
  const replacerFn = REPLACERS[ext];
  if (!replacerFn) {
    err(`No replacer for extension "${ext}"`);
  }
  return replacerFn(linkUrl, newUrl);
}

function replaceInHtml(_dir_out, linkUrl) {
  if (!linkUrl) {
    log(`No "cacheBustLink" found in package.json`);
    return;
  }

  const dir_out = fullPath(_dir_out);
  const linkFile = join(dir_out, linkUrl);
  const sum = md5(readFileSync(linkFile));
  const ext = extname(linkFile);
  const newUrl = linkUrl.replace(
    new RegExp(`${ext}$`), `-${sum}${ext}`);
  if (newUrl === linkUrl) {
    err(`checksum not appended`);
  }

  const replacer = getReplacer(ext, linkUrl, newUrl);
  const opts = {
    files: `${dir_out}/**/*.html`,
    from: replacer.regexp,
    to: replacer.replacer
  };
  const found = replace.sync(opts);
  const edited = found.filter(f => f.hasChanged === true);

  printSummary(dir_out, linkUrl, found, edited);
  if (edited.length > 0)
  {
    const newFile = join(dir_out, newUrl);
    renameSync(linkFile, newFile);
  }
}

function printSummary(dir_out, linkUrl, found, edited) {
  const ok = (found.length > 0) && (found.length === edited.length);
  log(`replaced "${linkUrl}" in ${edited.length} files`);
  log(`(found:${found.length} files, edited:${edited.length} files)`);
  if (found.length != edited.length) {
    log(`found files: ${strFiles(found)}`);
  }
  log(`edited files: ${strFiles(edited)}`);
  function strFiles(files) {
    const shortPaths = files.map(i => relative(dir_out, i.file));
    return shortPaths.join(", ");
  }
}

module.exports = {
  replaceInHtml
};
