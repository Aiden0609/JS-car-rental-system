/* 通用工具：API 请求、提示、格式化、分页、弹窗 */

/* 统一的 API 请求封装。
 * 后端响应格式：{ status: true, message, data } 或 { status: false, message, errors }
 * 成功时返回 data，失败时抛错。 */
async function api(url, options = {}) {
  const config = { headers: {}, ...options };
  if (config.body !== undefined && typeof config.body !== 'string') {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(config.body);
  }

  let res;
  try {
    res = await fetch(url, config);
  } catch (e) {
    throw new Error('网络请求失败，请确认后端服务已启动');
  }

  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new Error(`服务器返回了无法解析的响应 (HTTP ${res.status})`);
  }

  if (!json.status) {
    const detail = Array.isArray(json.errors) ? json.errors.join('；') : json.errors;
    throw new Error(detail || json.message || '请求失败');
  }
  return json.data;
}

/* 轻量提示 */
function toast(message, type = 'success') {
  let box = document.getElementById('toast-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toast-box';
    document.body.appendChild(box);
  }
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = message;
  box.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 2600);
}

/* HTML 转义，防止注入 */
function esc(v) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

/* 日期格式化：2026-08-10 14:30 */
function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* 金额格式化 */
function fmtMoney(v) {
  if (v === null || v === undefined) return '—';
  return `¥${Number(v).toFixed(2)}`;
}

/* 本地时间字符串转 ISO，供后端存储 */
function toISO(v) {
  return v ? new Date(v).toISOString() : v;
}

/* 渲染分页控件。pagination 来自后端，load(currentPage) 为翻页回调。 */
function renderPagination(pagination, load) {
  const box = document.getElementById('pagination');
  if (!box) return;
  const { total, currentPage, pageSize } = pagination;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  box.innerHTML = [
    `<span class="page-info">共 ${total} 条 · 第 ${currentPage} / ${totalPages} 页</span>`,
    `<button class="btn btn-sm" data-page="${currentPage - 1}" ${currentPage <= 1 ? 'disabled' : ''}>上一页</button>`,
    `<button class="btn btn-sm" data-page="${currentPage + 1}" ${currentPage >= totalPages ? 'disabled' : ''}>下一页</button>`,
  ].join(' ');
  box.querySelectorAll('[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = Number(btn.dataset.page);
      if (p >= 1 && p !== currentPage) load(p);
    });
  });
}

/* 弹窗开关 */
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

/* 点击遮罩层关闭弹窗 */
document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('modal')) {
    e.target.classList.remove('open');
  }
});

/* 通用数据填充的辅助：把值写进对应 id 的元素 */
function fill(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}
