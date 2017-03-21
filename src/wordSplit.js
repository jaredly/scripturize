
export default (text, clean) => {
  // TODO insert space after dashes n stuff
  text = text
    .replace(/-/g, '- ')
    .replace(/—/g, '— ')

  if (clean) text = text.replace(/\b\d\b/g, '').replace(/[^a-zA-Z0-9\s]/g, '').trim()
  return text.split(/\s+/g)
}
