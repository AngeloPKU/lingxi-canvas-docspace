/* 文档空间：演示文件目录、应用内标签与 Canvas 预览入口。 */
(function () {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const asset = (name) => 'assets/docspace/' + name + '.svg';
  const icon = (name, cls = '') => `<span class="ds-icon-slot ${cls}"><img src="${asset(name)}" alt=""></span>`;
  const FILE_ICONS = { folder: '42-10698-imgFolderFormat24', docx: '42-11057-imgWpsFormat24', xlsx: '42-11016-imgEtFormat24', pptx: '42-11137-imgWppFormat24', app: 'window_unhide_24' };
  const NAMES = { cloud: '云端产物', local: '本地产物', shared: '文档分享', apps: '网页应用', recent: '最近打开', mydocs: '我的文档' };
  const items = [
    { id: 'cloud-project', parent: 'cloud', type: 'folder', name: '新手引导重构方案 2026年6月', time: '今天 15:19', size: '1368 KB', order: 1519 },
    { id: 'cloud-design', parent: 'cloud', type: 'folder', name: '灵犀AI设计组', time: '今天 15:19', size: '1368 KB', order: 1519 },
    { id: 'cloud-dev', parent: 'cloud', type: 'folder', name: '云端开发小组', time: '今天 15:45', size: '512 KB', order: 1545 },
    { id: 'cloud-funnel', parent: 'cloud', type: 'xlsx', name: '引导漏斗数据分析.xlsx', time: '今天 15:06', size: '2048 KB', order: 1506, topic: '引导漏斗数据分析' },
    { id: 'cloud-report', parent: 'cloud', type: 'docx', name: '竞品引导流程拆解.docx', time: '今天 15:06', size: '2048 KB', order: 1506, topic: '竞品引导流程拆解' },
    { id: 'cloud-slides', parent: 'cloud', type: 'pptx', name: '新手引导重构方案 2026年6月.pptx', time: '今天 15:06', size: '2048 KB', order: 1506, topic: '新手引导重构方案' },
    { id: 'cloud-prd', parent: 'cloud-project', type: 'docx', name: '新手引导产品需求.docx', time: '今天 16:20', size: '680 KB', order: 1620, topic: '新手引导产品需求' },
    { id: 'cloud-metrics', parent: 'cloud-project', type: 'xlsx', name: '核心指标与验收口径.xlsx', time: '今天 15:40', size: '320 KB', order: 1540, topic: '核心指标与验收口径' },
    { id: 'cloud-research', parent: 'cloud-design', type: 'folder', name: '用户调研', time: '今天 14:30', size: '420 KB', order: 1430 },
    { id: 'cloud-interviews', parent: 'cloud-research', type: 'docx', name: '用户访谈总结.docx', time: '今天 14:20', size: '420 KB', order: 1420, topic: '用户访谈总结' },
    { id: 'local-task', parent: 'local', type: 'folder', name: '小米YU7与Model Y对比调研', time: '今天 15:06', size: '4096 KB', order: 1506 },
    { id: 'local-analysis', parent: 'local', type: 'folder', name: '2026年第二季度经营分析', time: '昨天 18:30', size: '2560 KB', order: 830 },
    { id: 'local-doc', parent: 'local-task', type: 'docx', name: '小米YU7与特斯拉Model Y对比调研报告.docx', time: '今天 15:06', size: '1280 KB', order: 1506, topic: '小米YU7与特斯拉Model Y对比调研报告', demo: true },
    { id: 'local-sheet', parent: 'local-task', type: 'xlsx', name: '核心参数与用户口碑对比.xlsx', time: '今天 15:06', size: '768 KB', order: 1506, topic: '核心参数与用户口碑对比', demo: true },
    { id: 'local-slides', parent: 'local-task', type: 'pptx', name: '车型对比调研汇报.pptx', time: '今天 15:06', size: '2048 KB', order: 1506, topic: '车型对比调研汇报' },
    { id: 'local-quarter', parent: 'local-analysis', type: 'docx', name: '第二季度经营分析报告.docx', time: '昨天 18:30', size: '1080 KB', order: 830, topic: '第二季度经营分析报告' },
    { id: 'shared-doc', parent: 'shared', type: 'docx', name: '竞品引导流程拆解.docx', time: '今天 15:06', size: '2048 KB', order: 1506, topic: '竞品引导流程拆解' },
    { id: 'shared-slides', parent: 'shared', type: 'pptx', name: '新手引导重构方案.pptx', time: '今天 14:30', size: '1680 KB', order: 1430, topic: '新手引导重构方案' },
    { id: 'my-project', parent: 'mydocs', type: 'folder', name: '产品工作', time: '今天 14:00', size: '1536 KB', order: 1400 },
    { id: 'my-note', parent: 'mydocs', type: 'docx', name: '本周项目进展.docx', time: '今天 14:00', size: '256 KB', order: 1400, topic: '本周项目进展' },
    { id: 'my-plan', parent: 'my-project', type: 'docx', name: '文档空间迭代计划.docx', time: '今天 13:20', size: '512 KB', order: 1320, topic: '文档空间迭代计划' },
    { id: 'app-dashboard', parent: 'apps', type: 'app', name: '新手引导数据看板', time: '今天 15:06', size: '网页应用', order: 1506 },
  ];
  const state = { location: 'cloud', expanded: new Set(['lingxi', 'wps']), tabs: [], active: 'space', filter: 'all', sort: 0, deleted: new Set(), selected: new Set(), recent: ['cloud-report', 'cloud-funnel', 'my-note'] };
  let callbacks = { toast: () => {} };
  const runningPreviews = new Set();
  const foldersIn = (id) => items.filter((i) => i.parent === id && i.type === 'folder' && !state.deleted.has(i.id));
  const find = (id) => items.find((i) => i.id === id);

  function makePreviewDoc(id) {
    const item = find(id);
    if (!item || !DOC_TEMPLATES[item.type]) return null;
    const tpl = DOC_TEMPLATES[item.type];
    const doc = { id: item.id, name: item.name, size: item.size, topic: item.topic, type: item.type, path: item.name, html: tpl.html(item.topic), sheets: tpl.sheets };
    if (item.demo && item.type === 'docx') doc.html = demoDocxHtml();
    if (item.demo && item.type === 'xlsx') doc.html = demoXlsxHtml();
    if (tpl.pages) { doc.pages = tpl.pages(item.topic); doc.cur = 0; }
    return doc;
  }

  function hidePopup() {
    $('#ds-popup').hidden = true;
    document.querySelectorAll('.ds-file-row.menu-open').forEach((row) => row.classList.remove('menu-open'));
    $('#ds-filter').setAttribute('aria-expanded', 'false');
  }

  function showPopup(anchor, html) {
    const popup = $('#ds-popup');
    hidePopup();
    popup.innerHTML = html;
    popup.hidden = false;
    const rect = anchor.getBoundingClientRect();
    popup.style.left = Math.max(8, Math.min(rect.left, innerWidth - popup.offsetWidth - 8)) + 'px';
    popup.style.top = Math.max(8, Math.min(rect.bottom + 4, innerHeight - popup.offsetHeight - 8)) + 'px';
    popup.querySelector('button')?.focus();
  }

  function renderTabs() {
    const bar = $('#ds-tabs');
    bar.innerHTML = `<div class="ds-tab ds-tab-home ${state.active === 'space' ? 'active' : ''}"><button class="ds-tab-select" id="ds-tab-space" role="tab" aria-selected="${state.active === 'space'}" aria-controls="ds-workspace" tabindex="${state.active === 'space' ? 0 : -1}">${icon('42-10457-imgGroup0')}<span>文档空间</span></button></div>`;
    state.tabs.forEach((id) => {
      const item = find(id);
      const node = document.createElement('div');
      node.className = 'ds-tab' + (state.active === id ? ' active' : '');
      const tabIcon = { docx: 'wps_format_s', xlsx: 'et_format_s', pptx: 'wpp_format_s', app: 'doc_file' }[item.type];
      node.innerHTML = `<button class="ds-tab-select" role="tab" id="ds-tab-${id}" aria-selected="${state.active === id}" aria-controls="ds-preview-${id}" tabindex="${state.active === id ? 0 : -1}" title="${esc(item.name)}"><span class="ds-icon-slot"><img src="assets/icons/${tabIcon}.svg" width="16" height="16" alt=""></span><span>${esc(item.name)}</span></button><button class="ds-tab-close" aria-label="关闭 ${esc(item.name)}" title="关闭标签"><img src="assets/docspace/symbol_cross_two.svg" width="16" height="16" alt=""></button>`;
      node.querySelector('.ds-tab-select').onclick = () => activate(id);
      node.querySelector('.ds-tab-close').onclick = () => closeTab(id);
      bar.appendChild(node);
    });
    $('#ds-tab-space').onclick = () => activate('space');
  }

  function activate(id) {
    hidePopup();
    state.active = id;
    $('#ds-workspace').hidden = id !== 'space';
    $('#ds-previews').hidden = id === 'space';
    document.querySelectorAll('.ds-preview').forEach((p) => p.hidden = p.dataset.id !== id);
    renderTabs();
    const active = $('#ds-tabs [aria-selected="true"]');
    active?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function closeTab(id) {
    const index = state.tabs.indexOf(id);
    if (index < 0) return;
    state.tabs.splice(index, 1);
    const panel = $('#ds-preview-' + id);
    if (runningPreviews.has(id)) { if (panel) panel.hidden = true; }
    else panel?.remove();
    if (state.active === id) activate(state.tabs[Math.min(index, state.tabs.length - 1)] || 'space');
    else renderTabs();
    $('#ds-tabs [aria-selected="true"]')?.focus();
  }

  function openFile(item) {
    if (item.type === 'folder') { navigate(item.id); return; }
    if (!state.tabs.includes(item.id)) {
      state.tabs.push(item.id);
      if ($('#ds-preview-' + item.id)) { activate(item.id); return; }
      const panel = document.createElement('section');
      panel.className = 'ds-preview'; panel.id = 'ds-preview-' + item.id; panel.dataset.id = item.id;
      panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', 'ds-tab-' + item.id);
      panel.innerHTML = '<div class="ds-preview-loading">正在加载预览…</div>';
      const frame = document.createElement('iframe');
      frame.title = item.name + ' · Canvas 预览';
      frame.onload = () => panel.querySelector('.ds-preview-loading')?.remove();
      if (item.type === 'app') frame.srcdoc = appPreviewHtml();
      else frame.src = 'index.html?preview=' + encodeURIComponent(item.id);
      panel.appendChild(frame); $('#ds-previews').appendChild(panel);
    }
    state.recent = [item.id, ...state.recent.filter((id) => id !== item.id)].slice(0, 8);
    activate(item.id);
  }

  function treeRow(id, label, image, level, hasChildren, group) {
    const row = document.createElement('div');
    row.className = 'ds-tree-item' + (state.location === id ? ' active' : '');
    row.dataset.level = level;
    const expanded = state.expanded.has(id);
    row.innerHTML = hasChildren
      ? `<button class="ds-toggle" aria-label="${expanded ? '收起' : '展开'}${esc(label)}" aria-expanded="${expanded}"><img src="${asset(expanded ? 'arrow_triangle_down' : 'arrow_triangle_right')}" alt=""></button>`
      : '<span class="ds-toggle-space"></span>';
    row.insertAdjacentHTML('beforeend', `<button class="ds-tree-select" ${group ? `aria-expanded="${expanded}"` : `aria-current="${state.location === id ? 'page' : 'false'}"`}>${image}<span>${esc(label)}</span></button>`);
    row.querySelector('.ds-tree-select').onclick = () => group ? toggle(id) : navigate(id);
    const trigger = row.querySelector('.ds-toggle');
    if (trigger) trigger.onclick = () => toggle(id);
    return row;
  }

  function toggle(id) {
    if (state.expanded.has(id)) state.expanded.delete(id); else state.expanded.add(id);
    renderDirectory();
  }

  function renderDirectory() {
    const nav = $('#ds-directory'); nav.innerHTML = '';
    const folderIcon = icon('folder');
    const appendFolders = (host, id, level) => {
      if (!state.expanded.has(id)) return;
      foldersIn(id).forEach((folder) => {
        host.appendChild(treeRow(folder.id, folder.name, folderIcon, level, foldersIn(folder.id).length > 0, false));
        appendFolders(host, folder.id, level + 1);
      });
    };
    const lingxi = document.createElement('div'); lingxi.className = 'ds-tree-group';
    lingxi.appendChild(treeRow('lingxi', '灵犀的产物', icon('bubble_chat'), 0, true, true));
    if (state.expanded.has('lingxi')) {
      [['cloud', icon('42-10492-imgGroup0')], ['local', icon('42-10492-imgGroup1')], ['shared', icon('42-10492-imgGroup2', 'ds-share-icon')], ['apps', icon('42-10492-imgGroup3')]].forEach(([id, image]) => {
        lingxi.appendChild(treeRow(id, NAMES[id], image, 1, id !== 'apps', false));
        appendFolders(lingxi, id, 2);
      });
    }
    nav.appendChild(lingxi);
    const wps = document.createElement('div'); wps.className = 'ds-tree-group';
    wps.appendChild(treeRow('wps', 'WPS 云文档', icon('logo_kd_line'), 0, true, true));
    if (state.expanded.has('wps')) {
      wps.appendChild(treeRow('recent', '最近打开', icon('clock'), 1, false, false));
      wps.appendChild(treeRow('mydocs', '我的文档', folderIcon, 1, true, false));
      appendFolders(wps, 'mydocs', 2);
    }
    nav.appendChild(wps);
  }

  function trail(id) {
    if (NAMES[id]) return [{ id: ['mydocs', 'recent'].includes(id) ? 'wps' : 'lingxi', name: ['mydocs', 'recent'].includes(id) ? 'WPS 云文档' : '灵犀的产物' }, { id, name: NAMES[id] }];
    const folder = find(id);
    return folder ? [...trail(folder.parent), { id: folder.id, name: folder.name }] : [];
  }

  function navigate(id) {
    hidePopup(); state.location = id; state.filter = 'all';
    const ancestors = trail(id); ancestors.slice(0, -1).forEach((part) => state.expanded.add(part.id));
    renderDirectory(); renderBreadcrumb(); renderRows(); activate('space');
    $('.ds-table-wrap').scrollTop = 0;
  }

  function renderBreadcrumb() {
    const host = $('#ds-breadcrumb'); host.innerHTML = '';
    const crumbs = trail(state.location);
    crumbs.forEach((part, i) => {
      if (i) host.insertAdjacentHTML('beforeend', `<img src="${asset('arrow_right_s')}" alt="">`);
      const button = document.createElement('button');
      button.className = 'ds-crumb' + (i === crumbs.length - 1 ? ' current' : '');
      button.textContent = part.name;
      if (i === crumbs.length - 1) button.setAttribute('aria-current', 'location');
      button.onclick = () => navigate(part.id === 'lingxi' ? 'cloud' : part.id === 'wps' ? 'mydocs' : part.id);
      host.appendChild(button);
    });
    const refresh = document.createElement('button'); refresh.className = 'ds-refresh'; refresh.title = '刷新'; refresh.setAttribute('aria-label', '刷新文件列表');
    refresh.innerHTML = '<img src="assets/docspace/refresh.svg" width="16" height="16" alt="">';
    refresh.onclick = () => { renderRows(); callbacks.toast('文件列表已刷新'); };
    host.appendChild(refresh);
  }

  function visibleItems() {
    let visible = state.location === 'recent' ? state.recent.map(find).filter(Boolean) : items.filter((i) => i.parent === state.location);
    visible = visible.filter((i) => !state.deleted.has(i.id) && (state.filter === 'all' || i.type === state.filter));
    if (state.sort) visible.sort((a, b) => (a.type === 'folder' ? 0 : 1) - (b.type === 'folder' ? 0 : 1) || state.sort * (a.order - b.order));
    return visible;
  }

  function selectable(item) { return !!DOC_TEMPLATES[item.type]; }

  function syncSelection() {
    document.querySelectorAll('.ds-file-row').forEach((row) => {
      const checked = state.selected.has(row.dataset.id);
      row.classList.toggle('selected', checked);
      const input = row.querySelector('input');
      if (input) { input.checked = checked; input.parentElement.classList.toggle('is-checked', checked); }
    });
    const files = visibleItems().filter(selectable);
    const count = files.filter((item) => state.selected.has(item.id)).length;
    const all = $('#ds-select-all');
    all.checked = files.length > 0 && count === files.length;
    all.indeterminate = count > 0 && count < files.length;
    all.disabled = !files.length;
    all.parentElement.classList.toggle('is-checked', all.checked);
    all.parentElement.classList.toggle('is-indeterminate', all.indeterminate);
    all.parentElement.classList.toggle('is-disabled', all.disabled);
  }

  function renderAttachments() {
    const host = $('#ds-attachments'); host.innerHTML = '';
    host.hidden = !state.selected.size;
    [...state.selected].map(find).filter(Boolean).forEach((item) => {
      const card = document.createElement('div'); card.className = 'ds-attachment'; card.dataset.id = item.id;
      card.innerHTML = `<button class="ds-attachment-open" title="预览 ${esc(item.name)}"><img src="${asset(FILE_ICONS[item.type])}" alt=""><span class="ds-attachment-info"><span class="ds-attachment-name">${esc(item.name.replace(/\.[^.]+$/, ''))}</span><span class="ds-attachment-size">${esc(item.size)}</span></span></button><button class="ds-attachment-remove" aria-label="移除 ${esc(item.name)}" title="移除文件"><img src="assets/icons/symbol_cross_two.svg" width="16" height="16" alt=""></button>`;
      card.querySelector('.ds-attachment-open').onclick = () => openFile(item);
      card.querySelector('.ds-attachment-remove').onclick = () => { state.selected.delete(item.id); syncSelection(); renderAttachments(); };
      host.appendChild(card);
    });
    updateSendIcon();
  }

  function updateSendIcon() {
    const ready = state.selected.size || $('#ds-input').innerText.trim();
    $('#ds-send').innerHTML = ready ? DOCSPACE_INLINE_ICONS.arrow_up_tail_s : '<img src="assets/icons/microphone.svg" width="16" height="16" alt="">';
  }

  function sendRequest() {
    const text = $('#ds-input').innerText.trim();
    const files = [...state.selected].map(makePreviewDoc).filter(Boolean);
    if (!text && !files.length) return;
    if (!callbacks.onSendRequest(text || '请查看这些文件', files)) return;
    $('#ds-input').textContent = '';
    state.selected.clear(); syncSelection(); renderAttachments();
  }

  function renderRows() {
    const host = $('#ds-rows'); host.innerHTML = '';
    const visible = visibleItems();
    visible.forEach((item) => {
      const row = document.createElement('div'); row.className = 'ds-file-row'; row.setAttribute('role', 'listitem'); row.dataset.id = item.id;
      row.innerHTML = `<div class="ds-name-column"><button class="ds-file-name" title="${esc(item.name)}"><img src="${asset(FILE_ICONS[item.type])}" alt=""><span>${esc(item.name)}</span></button></div><span class="ds-date-column">${esc(item.time)}</span><span class="ds-size-column">${esc(item.size)}</span><div class="ds-actions-column ds-row-actions"><button class="ds-row-more" title="更多操作" aria-label="${esc(item.name)}的更多操作" aria-haspopup="menu"><img src="${asset('more')}" alt=""></button></div>`;
      row.insertAdjacentHTML('afterbegin', selectable(item) ? `<label class="kd-checkbox ds-checkbox-slot ds-row-checkbox"><span class="kd-checkbox-input"><input class="kd-checkbox-original" type="checkbox" aria-label="选择 ${esc(item.name)}"><span class="kd-checkbox-inner" aria-hidden="true"></span></span></label>` : '<span class="ds-checkbox-slot"></span>');
      const checkbox = row.querySelector('input');
      if (checkbox) checkbox.onchange = () => { if (checkbox.checked) state.selected.add(item.id); else state.selected.delete(item.id); syncSelection(); renderAttachments(); };
      row.querySelector('.ds-file-name').onclick = () => openFile(item);
      row.querySelector('.ds-row-more').onclick = (e) => { fileMenu(item, e.currentTarget); row.classList.add('menu-open'); };
      host.appendChild(row);
    });
    if (!visible.length) host.innerHTML = '<div class="ds-empty"><span class="ds-empty-title">这里暂时没有文件</span><span>可以切换目录或文件类型查看其他内容</span></div>';
    $('#ds-filter span').textContent = { all: '全部类型', folder: '文件夹', docx: '文字文档', xlsx: '表格', pptx: '演示文稿', app: '网页应用' }[state.filter];
    syncSelection();
  }

  function fileMenu(item, button) {
    const menuIcon = (name) => `<span class="ds-icon-slot" aria-hidden="true">${DOCSPACE_INLINE_ICONS[name]}</span>`;
    const actions = item.type === 'folder' ? [['open', '打开文件夹', 'insert'], ['delete', '删除', 'trash_can']] : [
      ['task', '添加到任务', 'insert'], ['share', '复制分享链接', 'chain'], ['download', '下载', 'download'], ['delete', '删除', 'trash_can'],
    ];
    showPopup(button, `<div class="ds-file-menu">${actions.map(([action, title, image]) => `${action === 'delete' ? '<span class="ds-menu-separator"></span>' : ''}<button role="menuitem" data-action="${action}" class="${action === 'delete' ? 'ds-menu-danger' : ''}">${menuIcon(image)}<span>${title}</span></button>`).join('')}</div>`);
    $('#ds-popup').querySelectorAll('[data-action]').forEach((b) => b.onclick = () => {
      hidePopup();
      const action = b.dataset.action;
      if (action === 'open') navigate(item.id);
      if (action === 'task') item.type === 'app' ? callbacks.toast('网页应用可以从预览标签打开') : callbacks.onAddTask(item);
      if (action === 'share') {
        const link = new URL('index.html', location.href); link.searchParams.set('preview', item.id);
        if (navigator.clipboard?.writeText) navigator.clipboard.writeText(link.href).then(() => callbacks.toast('演示预览链接已复制')).catch(() => callbacks.toast('浏览器未允许复制链接'));
        else callbacks.toast('当前浏览器不支持复制链接');
      }
      if (action === 'download') download(item);
      if (action === 'delete') {
        if (!window.confirm(`删除“${item.name}”？仅移除本次演示中的项目。`)) return;
        const removed = new Set([item.id]);
        let changed = true;
        while (changed) { changed = false; items.forEach((i) => { if (removed.has(i.parent) && !removed.has(i.id)) { removed.add(i.id); changed = true; } }); }
        removed.forEach((id) => { state.deleted.add(id); state.selected.delete(id); closeTab(id); });
        renderDirectory(); renderRows(); renderAttachments(); callbacks.toast('已删除演示项目');
      }
    });
  }

  function download(item) {
    if (item.type === 'app') { callbacks.toast('网页应用从预览标签中查看'); return; }
    const doc = makePreviewDoc(item.id);
    const body = '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>' + esc(item.name) + '</title><body>' + doc.html + '</body></html>';
    const url = URL.createObjectURL(new Blob([body], { type: 'text/html;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = item.name.replace(/\.[^.]+$/, '') + '-预览.html'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); callbacks.toast('已下载 HTML 演示预览');
  }

  function appPreviewHtml() {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><link rel="stylesheet" href="css/kdesign/tokens.css"><link rel="stylesheet" href="css/kdesign/reset.css"><link rel="stylesheet" href="css/kdesign/button.css"><style>body{padding:32px;font-family:inherit}main{max-width:1040px;margin:auto}h1{font-size:var(--kd-font-size-extra-large);margin-bottom:8px}p{color:var(--kd-color-text-secondary);font-size:var(--kd-font-size-base)}header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:32px}.metrics{display:flex;gap:16px}.metric{flex:1;padding:24px;background:var(--kd-color-fill-base);border-radius:var(--kd-border-radius-large)}strong{display:block;font-size:var(--kd-font-size-large);margin:16px 0 8px}table{width:100%;margin-top:24px;background:var(--kd-color-fill-base);border-collapse:collapse}td,th{padding:16px;text-align:left;border-bottom:1px solid var(--kd-color-line-light);font-size:var(--kd-font-size-base)}th{font-weight:var(--kd-font-weight-bold)}</style></head><body><main><header><div><h1>新手引导数据看板</h1><p>查看引导各环节的转化情况</p></div><button class="kd-button kd-button-secondary kd-button-lg" onclick="this.textContent='已刷新'">刷新数据</button></header><div class="metrics"><div class="metric"><p>进入引导</p><strong>12,480</strong><p>本周用户数</p></div><div class="metric"><p>完成首个任务</p><strong>68.4%</strong><p>首个任务完成率</p></div><div class="metric"><p>次日留存</p><strong>42.6%</strong><p>较上周提升 3.2%</p></div></div><table><thead><tr><th>引导环节</th><th>用户数</th><th>转化率</th></tr></thead><tbody><tr><td>进入引导</td><td>12,480</td><td>100%</td></tr><tr><td>输入首条指令</td><td>10,320</td><td>82.7%</td></tr><tr><td>查看任务产物</td><td>9,210</td><td>73.8%</td></tr><tr><td>完成首个任务</td><td>8,537</td><td>68.4%</td></tr></tbody></table></main></body></html>`;
  }

  function init(options) {
    callbacks = options;
    renderTabs(); renderDirectory(); renderBreadcrumb(); renderRows(); activate('space');
    $('#ds-select-all').onchange = (e) => { visibleItems().filter(selectable).forEach((item) => { if (e.target.checked) state.selected.add(item.id); else state.selected.delete(item.id); }); syncSelection(); renderAttachments(); };
    $('#ds-input').addEventListener('input', updateSendIcon);
    $('#ds-input').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendRequest(); } });
    $('#ds-send').onclick = sendRequest;
    $('#ds-plus').onclick = () => callbacks.toast('可勾选列表中的文件添加到任务');
    $('#ds-filter').onclick = (e) => {
      if (!$('#ds-popup').hidden) { hidePopup(); return; }
      const filters = [['all', '全部类型'], ['folder', '文件夹'], ['docx', '文字文档'], ['xlsx', '表格'], ['pptx', '演示文稿'], ['app', '网页应用']];
      showPopup(e.currentTarget, `<div class="kd-menu" role="presentation">${filters.map(([id, name]) => `<button class="kd-menu-item" role="menuitemradio" aria-checked="${id === state.filter}" data-filter="${id}"><span class="kd-menu-item-content">${name}</span></button>`).join('')}</div>`);
      $('#ds-filter').setAttribute('aria-expanded', 'true');
      $('#ds-popup').querySelectorAll('[data-filter]').forEach((b) => b.onclick = () => { state.filter = b.dataset.filter; hidePopup(); renderRows(); $('#ds-filter').focus(); });
    };
    $('#ds-sort').onclick = () => { state.sort = state.sort === -1 ? 1 : -1; $('#ds-sort-mark').textContent = state.sort === -1 ? '↓' : '↑'; renderRows(); };
    $('#ds-tabs').addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Delete'].includes(e.key)) return;
      const ids = ['space', ...state.tabs]; const index = ids.indexOf(state.active);
      e.preventDefault();
      if (e.key === 'Delete') { if (state.active !== 'space') closeTab(state.active); return; }
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? ids.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length;
      activate(ids[next]); $('#ds-tabs [aria-selected="true"]')?.focus();
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('#ds-popup,.ds-filter,.ds-row-more')) hidePopup(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hidePopup();
      if (e.target.closest('#ds-popup') && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault(); const buttons = [...$('#ds-popup').querySelectorAll('button')];
        const index = buttons.indexOf(document.activeElement); buttons[(index + (e.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]?.focus();
      }
    });
    window.addEventListener('resize', hidePopup);
    $('.ds-table-wrap').addEventListener('scroll', hidePopup);
  }

  window.Docspace = {
    init, makePreviewDoc, hidePopup,
    open: () => { callbacks.onOpen(); hidePopup(); },
    openPreview: (id) => { const item = find(id); if (item) { callbacks.onOpen(); openFile(item); } },
    previewSource: (source) => [...document.querySelectorAll('.ds-preview iframe')].find((frame) => frame.contentWindow === source)?.parentElement.dataset.id,
    broadcastMode: (enabled) => document.querySelectorAll('.ds-preview iframe').forEach((frame) => frame.contentWindow.postMessage({ channel: 'lingxi-docspace', type: 'preview-mode', enabled }, '*')),
    updatePreviewDoc: (doc) => $('#ds-preview-' + doc.id + ' iframe')?.contentWindow.postMessage({ channel: 'lingxi-docspace', type: 'preview-doc', doc: JSON.parse(JSON.stringify(doc)) }, '*'),
    setPreviewRunning: (id, active) => { if (active) runningPreviews.add(id); else { runningPreviews.delete(id); if (!state.tabs.includes(id)) $('#ds-preview-' + id)?.remove(); } },
  };
})();
