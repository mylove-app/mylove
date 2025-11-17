export function extractFields(template) {
  const fields = new Set();

  const regex = /{{(.*?)}}/g;

  // cek HTML
  if (template.html) {
    let match;
    while ((match = regex.exec(template.html)) !== null) {
      fields.add(match[1]);
    }
  }

  // cek CSS
  if (template.css) {
    let match;
    while ((match = regex.exec(template.css)) !== null) {
      fields.add(match[1]);
    }
  }

  // cek JS
  if (template.js) {
    let match;
    while ((match = regex.exec(template.js)) !== null) {
      fields.add(match[1]);
    }
  }

  return [...fields];
}
