/* 输入框附件、执行环境与本地文件选择。 */
(function () {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icons = { docx: 'wps_format_s', xlsx: 'et_format_s', pptx: 'wpp_format_s', image: 'pic', web: 'doc_file' };
  const catalog = [
    { id: 'upload-report', name: '项目调研报告.docx', type: 'docx', size: '128 KB', topic: '项目调研报告' },
    { id: 'upload-data', name: '季度经营数据.xlsx', type: 'xlsx', size: '86 KB', topic: '季度经营数据' },
    { id: 'upload-slides', name: '产品方案汇报.pptx', type: 'pptx', size: '1.2 MB', topic: '产品方案汇报' },
    { id: 'upload-image', name: '团队协作流程图.svg', type: 'image', size: '4 KB', topic: '团队协作流程图' },
  ];
  function makeDoc(id) {
    const item = catalog.find((f) => f.id === id);
    if (!item) return null;
    const tpl = DOC_TEMPLATES[item.type];
    const doc = { ...item, path: 'C:/Users/KSO/Documents/' + item.name, html: tpl.html(item.topic), sheets: tpl.sheets };
    if (tpl.pages) { doc.pages = tpl.pages(item.topic); doc.cur = 0; }
    return doc;
  }
  function renderFiles(host, files, options = {}) {
    host.innerHTML = ''; host.hidden = !files.length;
    files.forEach((doc) => {
      const card = document.createElement('div'); card.className = 'ds-attachment';
      const open = document.createElement(options.preview ? 'button' : 'div');
      open.className = 'ds-attachment-open' + (options.preview ? '' : ' attachment-static'); open.title = doc.name;
      open.innerHTML = `<img src="assets/icons/${icons[doc.type] || 'doc_file'}.svg" width="24" height="24" alt=""><span class="ds-attachment-info"><span class="ds-attachment-name">${esc(doc.name)}</span><span class="ds-attachment-size">${esc(doc.size || '')}</span></span>`;
      if (options.preview) { open.setAttribute('aria-label', '预览 ' + doc.name); open.onclick = () => options.onOpen(doc); }
      const remove = document.createElement('button'); remove.className = 'ds-attachment-remove'; remove.title = '移除文件'; remove.setAttribute('aria-label', '移除 ' + doc.name);
      remove.innerHTML = '<img src="assets/icons/symbol_cross_two.svg" width="16" height="16" alt="">';
      remove.onclick = () => options.onRemove(doc);
      card.append(open, remove); host.appendChild(card);
    });
  }
  let callbacks, menu, picker, anchor, pickerContext, selected = new Set(), directory = '文档', lastIndex = 0;
  const environmentKey = 'lingxi_demo_execution_environment';
  const environment = () => localStorage.getItem(environmentKey) || 'local';
  const glyph = (name) => `<img src="assets/icons/${name}.svg" width="16" height="16" alt="">`;
  function closeMenu() { if (menu) menu.hidden = true; if (anchor) anchor.setAttribute('aria-expanded', 'false'); }
  function positionMenu() {
    const r = anchor.getBoundingClientRect();
    menu.style.left = Math.max(8, Math.min(r.left, innerWidth - menu.offsetWidth - 8)) + 'px';
    menu.style.top = (r.top >= menu.offsetHeight + 8 ? r.top - menu.offsetHeight - 8 : Math.min(r.bottom + 8, innerHeight - menu.offsetHeight - 8)) + 'px';
    menu.classList.toggle('submenu-left', r.left + 520 > innerWidth);
  }
  function openMenu(button, context) {
    if (!menu.hidden && anchor === button) { closeMenu(); return; }
    closeMenu(); anchor = button; pickerContext = context;
    const locked = callbacks.isMini(context); const current = locked ? 'local' : environment();
    const rows = [['upload', 'upload', '上传文件'], ['data', 'archive', '专业数据源'], ['skills', 'lightning', '技能'], ['connect', 'plug', '连接器'], ['environment', 'equipment_computer', '执行环境'], ['plan', 'add_item', '计划']];
    menu.innerHTML = `<div class="kd-menu composer-menu-panel" role="menu">${rows.map(([action, icon, label]) => `<button class="kd-menu-item composer-menu-row" role="menuitem" data-tool="${action}" ${action === 'environment' ? 'aria-haspopup="menu"' : ''}>${glyph(icon)}<span class="kd-menu-item-content">${label}</span>${action === 'environment' ? '<span class="environment-current">' + (current === 'local' ? '本地' : '云端') + '</span>' : ''}${action === 'plan' ? '' : glyph('arrow_right_s')}</button>`).join('')}</div><div class="kd-menu environment-submenu" role="menu" aria-label="执行环境" hidden>${locked ? '<div class="environment-hint">只允许本地执行</div>' : ''}<button class="kd-menu-item environment-option" role="menuitemradio" aria-checked="${current === 'cloud'}" data-env="cloud" ${locked ? 'disabled' : ''}>${glyph('cloud')}<span><span>用灵犀的电脑</span><small>云端运行，不占本地资源</small></span>${current === 'cloud' ? glyph('symbol_tick') : ''}</button><button class="kd-menu-item environment-option" role="menuitemradio" aria-checked="${current === 'local'}" data-env="local">${glyph('equipment_computer')}<span><span>连接我的电脑</span><small>连接本机，可操作文件和应用</small></span>${current === 'local' ? glyph('symbol_tick') : ''}</button></div>`;
    menu.hidden = false; button.setAttribute('aria-expanded', 'true'); positionMenu();
    const submenu = menu.querySelector('.environment-submenu');
    const envRow = menu.querySelector('[data-tool="environment"]');
    const showEnvironment = () => { submenu.hidden = false; const availableTop = innerHeight - menu.getBoundingClientRect().top - submenu.offsetHeight - 8; submenu.style.top = Math.max(8, Math.min(envRow.offsetTop + 8, availableTop)) + 'px'; };
    envRow.onmouseenter = showEnvironment; envRow.onfocus = showEnvironment; envRow.onclick = showEnvironment;
    menu.querySelectorAll('[data-tool]').forEach((row) => {
      if (row === envRow) return;
      row.onmouseenter = () => submenu.hidden = true;
      row.onclick = () => { closeMenu(); if (row.dataset.tool === 'upload') openPicker(context); else callbacks.toast('当前演示未接入此功能'); };
    });
    menu.querySelectorAll('[data-env]').forEach((row) => row.onclick = () => {
      if (locked) { callbacks.toast('只允许本地执行'); return; }
      localStorage.setItem(environmentKey, row.dataset.env); callbacks.toast('执行环境已切换为' + (row.dataset.env === 'local' ? '本地' : '云端')); closeMenu();
    });
  }
  function visibleFiles() { return directory === '图片' ? catalog.filter((f) => f.type === 'image') : directory === '桌面' ? catalog.slice(0, 2) : directory === '下载' ? catalog.slice(2) : catalog; }
  function renderPicker() {
    const filter = $('#mock-file-type').value;
    const files = visibleFiles().filter((f) => filter === 'all' || f.type === filter);
    $('#mock-address').textContent = '此电脑  ›  ' + directory;
    picker.querySelectorAll('[data-directory]').forEach((b) => b.classList.toggle('active', b.dataset.directory === directory));
    $('#mock-file-list').innerHTML = files.map((file, i) => `<button class="mock-file-row ${selected.has(file.id) ? 'selected' : ''}" role="option" aria-selected="${selected.has(file.id)}" data-file="${file.id}" data-index="${i}">${glyph(icons[file.type])}<span>${esc(file.name)}</span><span>2026/10/15 10:00</span><span>${{ docx: 'WPS 文字', xlsx: 'WPS 表格', pptx: 'WPS 演示', image: 'SVG 图片' }[file.type]}</span><span>${file.size}</span></button>`).join('');
    $('#mock-file-list').querySelectorAll('[data-file]').forEach((row) => {
      row.onclick = (e) => {
        const id = row.dataset.file, index = +row.dataset.index;
        if (e.shiftKey) { if (!e.ctrlKey) selected.clear(); files.slice(Math.min(index, lastIndex), Math.max(index, lastIndex) + 1).forEach((f) => selected.add(f.id)); }
        else if (e.ctrlKey || e.metaKey) { if (selected.has(id)) selected.delete(id); else selected.add(id); }
        else { selected.clear(); selected.add(id); }
        lastIndex = index; syncPickerSelection(); row.focus();
      };
      row.ondblclick = () => { selected = new Set([row.dataset.file]); acceptPicker(); };
      row.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); if (!selected.has(row.dataset.file)) selected = new Set([row.dataset.file]); acceptPicker(); } };
    });
    syncPickerSelection();
  }
  function syncPickerSelection() {
    picker.querySelectorAll('[data-file]').forEach((row) => { const active = selected.has(row.dataset.file); row.classList.toggle('selected', active); row.setAttribute('aria-selected', String(active)); });
    $('#mock-file-name').value = [...selected].map((id) => catalog.find((f) => f.id === id)?.name).filter(Boolean).join('、');
    $('#mock-file-open').disabled = !selected.size;
  }
  function closePicker() { picker.hidden = true; anchor?.focus(); }
  function acceptPicker() {
    if (!selected.size) return;
    const docs = [...selected].map(makeDoc).filter(Boolean); closePicker(); callbacks.onFiles(pickerContext, docs);
  }
  function openPicker(context) { pickerContext = context; selected.clear(); directory = '文档'; $('#mock-file-type').value = 'all'; picker.hidden = false; renderPicker(); $('#mock-file-list [data-file]')?.focus(); }
  function init(options) {
    callbacks = options;
    menu = document.createElement('div'); menu.id = 'composer-tools-menu'; menu.className = 'composer-tools-menu'; menu.hidden = true; document.body.appendChild(menu);
    picker = document.createElement('div'); picker.id = 'mock-file-mask'; picker.className = 'mock-file-mask'; picker.hidden = true;
    picker.innerHTML = `<!-- [Modal: lg C3a] 打开文件 --><section class="mock-file-dialog" role="dialog" aria-modal="true" aria-labelledby="mock-file-title"><header class="mock-file-titlebar"><span id="mock-file-title">打开</span><button class="mock-close" aria-label="关闭文件选择器">${glyph('symbol_cross_two')}</button></header><div class="mock-file-addressbar"><button aria-label="上一级目录" id="mock-file-up">${glyph('arrow_up_s')}</button><div id="mock-address"></div><span class="mock-search">搜索当前文件夹</span></div><div class="mock-file-body"><nav class="mock-file-sidebar" aria-label="常用位置">${['快速访问', '桌面', '文档', '下载', '图片'].map((name) => `<button data-directory="${name}">${glyph(name === '图片' ? 'pic' : name === '快速访问' ? 'star_two' : 'folder')}<span>${name}</span></button>`).join('')}</nav><div class="mock-file-main"><div class="mock-file-head"><span>名称</span><span>修改日期</span><span>类型</span><span>大小</span></div><div id="mock-file-list" role="listbox" aria-label="文件列表" aria-multiselectable="true"></div></div></div><footer class="mock-file-footer"><label for="mock-file-name">文件名(N):</label><input id="mock-file-name" readonly><select id="mock-file-type" aria-label="文件类型"><option value="all">所有支持的文件</option><option value="docx">Word 文档</option><option value="xlsx">Excel 表格</option><option value="pptx">PowerPoint 演示</option><option value="image">图片</option></select><span></span><div class="mock-picker-tip">按住 Ctrl 可选择多个文件</div><div class="mock-file-actions"><button class="kd-button kd-button-primary" id="mock-file-open">打开(O)</button><button class="kd-button kd-button-secondary" id="mock-file-cancel">取消</button></div></footer></section>`;
    document.body.appendChild(picker);
    picker.querySelector('.mock-close').onclick = closePicker; $('#mock-file-cancel').onclick = closePicker; $('#mock-file-open').onclick = acceptPicker;
    $('#mock-file-type').onchange = () => { selected.clear(); renderPicker(); };
    $('#mock-file-up').onclick = () => { directory = '文档'; selected.clear(); renderPicker(); };
    picker.querySelectorAll('[data-directory]').forEach((b) => b.onclick = () => { directory = b.dataset.directory; selected.clear(); renderPicker(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { if (!picker.hidden) closePicker(); else closeMenu(); }
      if (!picker.hidden && e.key === 'Tab') { const nodes = [...picker.querySelectorAll('button:not(:disabled),input,select')]; const i = nodes.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); nodes[nodes.length - 1].focus(); } else if (!e.shiftKey && i === nodes.length - 1) { e.preventDefault(); nodes[0].focus(); } }
    });
    document.addEventListener('click', (e) => { if (!menu.contains(e.target) && !e.target.closest('[data-composer-plus]')) closeMenu(); });
    window.addEventListener('resize', closeMenu);
    document.querySelectorAll('[data-composer-plus]').forEach((button) => { button.setAttribute('aria-haspopup', 'menu'); button.setAttribute('aria-expanded', 'false'); button.onclick = () => openMenu(button, button.dataset.composerPlus); });
  }
  window.MockFiles = { catalog, make: makeDoc, icons,
    webDocument: () => ({ id: 'web-project-dashboard', type: 'web', name: '项目工作台', url: 'https://demo.example/project-dashboard',
      html: '<iframe class="web-preview" title="项目工作台网页预览" src="assets/demo/project-dashboard.html"></iframe>' }) };
  window.ComposerTools = { init, renderFiles, environment, closeMenu, openPicker };
})();
