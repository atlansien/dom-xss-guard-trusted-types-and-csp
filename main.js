const observer = new ReportingObserver(
  (reports, observer) => {
    for (const report of reports) {
      if (
        report.type !== 'csp-violation' ||
        report.body.effectiveDirective !== 'require-trusted-types-for'
      ) {
        continue;
      }
      console.error('Trusted Types Violation:', report.body);
    }
  },
  { buffered: true }
);

observer.observe();

// Trusted Typesポリシーの作成
let escapePolicy;
if (window.trustedTypes && trustedTypes.createPolicy) {
  escapePolicy = trustedTypes.createPolicy('escapeHTMLPolicy', {
    createHTML: (string) => {
      return string
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },
  });
}

// DOMイベントの設定
const useInput = document.getElementById('useInput');
const submitBtn = document.getElementById('submitUseBtn');
const output = document.getElementById('useOutput');

document.getElementById('submitUseBtn').addEventListener('click', () => {
  const inputValue = useInput.value;

  try {
    // 入力値をTrustedHTMLに変換
    const sanitizedHTML = escapePolicy.createHTML(inputValue);

    // TrustedHTMLをDOMに反映
    output.innerHTML = sanitizedHTML;

    // 入力フィールドをクリア
    useInput.value = '';
  } catch (error) {
    console.error('Error processing input:', error);
    output.textContent = 'Error processing input';
  }
});
