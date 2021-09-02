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
  const newFile = join(dir_out, newUrl);
  renameSync(linkFile, newFile);

  const replacer = getReplacer(ext, linkUrl, newUrl);
  const opts = {
    files: `${dir_out}/**/*.html`,
    from: replacer.regexp,
    to: replacer.replacer
  };
  const found = replace.sync(opts);
  printSummary(dir_out, linkUrl, found);
}

function printSummary(dir_out, linkUrl, found) {
  const changed = found.filter(f => f.hasChanged === true);
  const ok = (found.length > 0) && (found.length === changed.length);
  if (!ok) {
    err(`found:${found.length}, changed:${changed.length}.`);
  }
  function strFiles() {
    const shortPaths = changed.map(i => relative(dir_out, i.file));
    return shortPaths.join(", ");
  }
  log(`replaced "${linkUrl}" in ${found.length} files: ${strFiles()}`);
}

module.exports = {
  replaceInHtml
};
