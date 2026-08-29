export const WALKTHROUGH_STEPS = Object.freeze([
  { title: 'Member network at a glance', prompt: 'Introduce the shared hub and its four fictional regional member organisations.', targetId: 'overview' },
  { title: 'Member progress', prompt: 'Show how milestones and progress can be explored without relying on colour alone.', targetId: 'countries' },
  { title: 'Policy accountability', prompt: 'Filter policies and explain how evidence, ownership and dates make progress visible.', targetId: 'tracker' },
  { title: 'Knowledge sharing', prompt: 'Search accessible resources by region, topic and language.', targetId: 'knowledge' },
  { title: 'Learning in the platform', prompt: 'Complete the short knowledge check and show browser-based progress.', targetId: 'learning' },
  { title: 'Low-bandwidth inclusion', prompt: 'Switch modes and explain text-first delivery, static counters and deferred previews.', targetId: 'performance' },
  { title: 'Staff and accessibility', prompt: 'Add a sample resource, then show accessibility settings and the one-click reset.', targetId: 'staff' }
]);

export const boundedStep = index => Math.max(0, Math.min(WALKTHROUGH_STEPS.length - 1, Number(index) || 0));
