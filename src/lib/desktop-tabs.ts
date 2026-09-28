export function initDesktopTabs(root: HTMLElement) {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];

  function selectTab(selected: HTMLButtonElement) {
    for (const tab of tabs) {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panelId = tab.getAttribute('aria-controls');
      const panel = panelId && root.querySelector<HTMLElement>(`[id="${panelId}"]`);
      if (panel) panel.hidden = !active;
    }
    selected.focus();
  }

  for (const tab of tabs) {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      const index = tabs.indexOf(tab);
      const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
          : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
      if (next === -1) return;
      event.preventDefault();
      selectTab(tabs[next]);
    });
  }
}
