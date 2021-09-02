function replacerForLinkEl(url, newUrl) {
  return {
    regexp: new RegExp(
      `(<link.*)(href\\s*=\\s*)(["']?)([/]?)(${url})(["']?)([^>]*)(>)`,
      "s"),
    replacer(match, p1, p2, p3, p4, url, p5, p6, p7) {
      /* arguments of replacer correspond to the above regexp.
       * For example, if the link element is:
       *   <link media="screen" href="foo.css" rel="stylesheet">
       * then:
       *   p1: <link media="screen"
       *   p2: href=
       *   p3: "
       *   p4:
       *   url: foo.css
       *   p5: "
       *   p6: rel="stylesheet"
       *   p7: >
       */
      return `${p1}${p2}${p3}${p4}${newUrl}${p5}${p6}${p7}`;
    }
  };
}

module.exports = {
  replacerForLinkEl
};
