const includes = (record, query, keys) => {
  const needle = query.trim().toLocaleLowerCase();
  return !needle || keys.some(key => String(record[key] || '').toLocaleLowerCase().includes(needle));
};
const matches = (value, selected, allLabel) => !selected || selected === allLabel || value === selected;

export function filterPolicies(records, filters) {
  return records.filter(record =>
    includes(record, filters.query || '', ['title', 'summary', 'partner']) &&
    matches(record.country, filters.country, 'All countries') &&
    matches(record.status, filters.status, 'All statuses') &&
    matches(record.framework, filters.framework, 'All frameworks')
  );
}

export function filterResources(records, filters) {
  return records.filter(record =>
    includes(record, filters.query || '', ['title', 'summary', 'accessibility']) &&
    matches(record.country, filters.country, 'All countries') &&
    matches(record.topic, filters.topic, 'All topics') &&
    matches(record.language, filters.language, 'All languages') &&
    matches(record.format, filters.format, 'All formats')
  );
}
