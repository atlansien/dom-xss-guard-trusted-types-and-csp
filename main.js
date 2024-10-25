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

// Trusted Types API 使用ぎ
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


// Trusted Types API 未使用
const unUseInput = document.getElementById('unUseInput');
const submitUnUseBtn = document.getElementById('submitUnUseBtn');
const unUseOutput = document.getElementById('unUseOutput');

document.getElementById('submitUnUseBtn').addEventListener('click', () => {
  const inputValue = unUseInput.value;

  try {

    // // TrustedHTMLに変換せずに直接反映
    unUseOutput.innerHTML = inputValue;

    // 入力フィールドをクリア
    unUseInput.value = '';
  } catch (error) {
    console.error('意図しない形式で反映された値です', error);
    unUseOutput.textContent = 'Error:意図しない形式で反映された値です';
  }
});