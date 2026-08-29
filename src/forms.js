const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateJoin(values) {
  const errors = {};
  if (!String(values.name || '').trim()) errors.name = 'Enter your full name.';
  if (!emailPattern.test(String(values.email || '').trim())) errors.email = 'Enter a valid email address.';
  if (!values.consent) errors.consent = 'Confirm the demonstration consent statement.';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStaffRecord(values) {
  const errors = {};
  if (String(values.title || '').trim().length < 3) errors.title = 'Enter a title of at least 3 characters.';
  if (String(values.summary || '').trim().length < 20) errors.summary = 'Enter a summary of at least 20 characters.';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function createStaffRecord(values, now = Date.now) {
  return {
    id: `staff-${now()}`,
    title: String(values.title).trim(),
    summary: String(values.summary).trim(),
    country: values.country || 'All regions',
    topic: 'Community resource',
    language: 'English',
    format: 'Resource',
    accessibility: 'Accessibility review pending in this simulation.',
    demonstration: true
  };
}
