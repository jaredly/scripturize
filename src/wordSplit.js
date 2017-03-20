
export default text => {
  // TODO insert space after dashes n stuff
  return text
    .replace(/-/g, '- ')
    .replace(/—/g, '— ')
    .split(/\s+/g)
}
