function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderCountries(container, detail, countries) {
  container.replaceChildren(...countries.map(country => {
    const card = element('article', 'card');
    card.append(element('span', 'status', `${country.status} • ${country.progress}%`), element('h3', '', country.name), element('p', '', country.summary));
    const progress = element('div', 'progress');
    progress.setAttribute('role', 'progressbar'); progress.setAttribute('aria-label', `${country.name} illustrative progress`); progress.setAttribute('aria-valuenow', country.progress); progress.setAttribute('aria-valuemin', '0'); progress.setAttribute('aria-valuemax', '100');
    const fill = element('span'); fill.style.width = `${country.progress}%`; progress.append(fill); card.append(progress);
    const button = element('button', 'button', `Explore ${country.name}`); button.addEventListener('click', () => {
      detail.replaceChildren(element('h3', '', `${country.name}: illustrative member-region view`), element('p', '', country.summary), element('p', '', `${country.milestones} milestones recorded • ${country.progress}% illustrative progress`), element('p', 'note', 'This sample demonstrates the proposed information structure. Client-approved evidence would replace these fictional records in production.'));
      detail.focus();
    }); card.append(button); return card;
  }));
  countries[0] && container.querySelector('button')?.click();
}

export function renderPolicies(container, records, lowBandwidth = false) {
  const visible = lowBandwidth ? records.slice(0, 4) : records;
  container.replaceChildren(...visible.map(record => {
    const card = element('article');
    card.append(element('p', 'meta', `${record.country} • ${record.status} • ${record.framework}`), element('h3', '', record.title), element('p', '', record.summary), element('p', '', `Updated ${record.updated} • ${record.partner}`));
    const button = element('button', 'text-button', 'View illustrative evidence summary');
    button.addEventListener('click', () => { button.insertAdjacentElement('afterend', element('p', 'resource-preview', 'Demonstration evidence: milestone note, consultation record and follow-up owner. No official record is linked in this concept.')); button.remove(); });
    card.append(button); return card;
  }));
  if (!records.length) container.append(element('p', 'note', 'No policies match these filters. Clear the filters or try a broader search.'));
  if (lowBandwidth && records.length > visible.length) container.append(element('p', 'note', `${records.length - visible.length} additional results are deferred in low-bandwidth mode. Refine the filters to narrow the list.`));
}

export function renderResources(container, records, lowBandwidth = false) {
  const visible = lowBandwidth ? records.slice(0, 4) : records;
  container.replaceChildren(...visible.map(record => {
    const card = element('article');
    if (record.persistent) card.classList.add('persistent-resource');
    card.append(element('p', 'meta', `${record.country} • ${record.topic} • ${record.language} • ${record.format}`), element('h3', '', record.title), element('p', '', record.summary), element('p', '', `Accessibility: ${record.accessibility}`));
    card.prepend(element('strong', 'content-label', record.persistent ? 'Published demonstration resource' : 'Illustrative demonstration content'));
    if (record.persistent && record.downloadUrl) {
      const meta=element('p','file-meta',`${record.fileName || 'Resource file'}${record.fileSize ? ` • ${Math.ceil(record.fileSize/1024)} KB` : ''}${record.updated ? ` • Updated ${record.updated}` : ''}`);
      const link=element('a','button',`Download ${record.title}`); link.href=record.downloadUrl; card.append(meta,link);
    } else {
      const button = element('button', 'text-button', 'View lightweight preview');
      button.addEventListener('click', () => { button.insertAdjacentElement('afterend', element('div', 'resource-preview', 'Text-first illustrative preview loaded on request. No real organisation file is attached to this fictional sample record.')); button.remove(); });
      card.append(button);
    }
    return card;
  }));
  if (!records.length) container.append(element('p', 'note', 'No resources match these filters. Clear the filters or try another term.'));
}

export function setOptions(select, values, allLabel) {
  select.replaceChildren(new Option(allLabel, allLabel), ...[...new Set(values)].sort().map(value => new Option(value, value)));
}

export function showErrors(summary, form, errors) {
  summary.replaceChildren(element('h3', '', 'Please correct the following:'));
  const list = element('ul');
  Object.entries(errors).forEach(([name, message]) => {
    const item = element('li'); const link = element('a', '', message); link.href = `#${form.id}-${name}`; link.addEventListener('click', event => { event.preventDefault(); form.elements[name].focus(); }); item.append(link); list.append(item); form.elements[name].setAttribute('aria-invalid', 'true'); form.elements[name].id = `${form.id}-${name}`;
  });
  summary.append(list); summary.hidden = false; summary.focus();
}

