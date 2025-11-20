async function submitSignup(data) {
  const response = await fetch('http://localhost:3001/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const payload = await response.json();
    throw new Error(payload.error || '報名失敗');
  }
  return response.json();
}
// DOM wiring
const form = document.querySelector('#signup-form');
const submitBtn = document.querySelector('#submit-btn');
const viewListBtn = document.querySelector('#view-list-btn');
const resultPre = document.querySelector('#result');

function showMessage(text, isError = false) {
  // simple inline message in result area
  const prefix = isError ? '錯誤: ' : '';
  resultPre.textContent = prefix + text;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submitBtn.disabled) return; // prevent double submit

  const formData = new FormData(form);
  const payload = {
    name: formData.get('name')?.trim(),
    email: formData.get('email')?.trim(),
    phone: formData.get('phone')?.trim(),
    // demo fields required by server validations
    password: 'changeme123',
    confirmPassword: 'changeme123',
    interests: ['web']
  };

  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = '送出中...';
  showMessage('送出中，請稍候...');

  try {
    const res = await submitSignup(payload);
    showMessage(`✅ ${res.message || '報名成功'}`);
    form.reset();
  } catch (err) {
    console.error(err);
    showMessage(`❌ ${err.message || '提交失敗'}`, true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// View list handler
async function fetchList() {
  try {
    viewListBtn.disabled = true;
    const r = await fetch('http://localhost:3001/api/signup');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const payload = await r.json();
    resultPre.textContent = JSON.stringify(payload, null, 2);
  } catch (e) {
    console.error(e);
    showMessage(`取得清單失敗：${e.message}`, true);
  } finally {
    viewListBtn.disabled = false;
  }
}

viewListBtn.addEventListener('click', fetchList);
