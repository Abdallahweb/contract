(function () {
  "use strict";

  const STORAGE_KEY = "leaseContract_v1";
  const form = document.getElementById("lease-form");
  const preview = document.getElementById("contract-preview");

  /** بنود ثابتة (٤–١٥) — عدّل النص ليطابق نموذجك الرسمي إن لزم */
  const STATIC_CLAUSES = [
    "يستلم الطرف الثاني العين المؤجرة بحالتها الراهنة، وعليه إرجاعها عند انتهاء العقد بحالة جيدة مع الاستعمال العادي.",
    "لا يجوز للطرف الثاني إجراء أي تعديلات أو إضافات في العين إلا بموافقة خطية مسبقة من الطرف الأول.",
    "يتحمل الطرف الثاني فواتير الخدمات (الماء، الكهرباء، الصرف الصحي، وما شابه) طوال مدة الإيجار ما لم يتفق الطرفان على خلاف ذلك.",
    "لا يجوز للطرف الثاني تأجير العين أو التنازل عن العقد أو جزء منه لغيره إلا بموافقة خطية من الطرف الأول.",
    "يتحمل الطرف الثاني مسؤولية أي ضرر ينشأ عن إهماله أو سوء استخدامه للعين، بما في ذلك أضرار الحريق إن وجدت.",
    "يلتزم الطرف الثاني بالمحافظة على نظافة المبنى والالتزام بلوائح السكن والجيران.",
    "عند انتهاء العقد يسلم الطرف الثاني العين خالية من الأشخاص والممتلكات خلال المدة المتفق عليها، وإلا يتحمل ما يترتب على التأخير.",
    "في حال تأخر الطرف الثاني عن سداد الأجرة في مواعيدها، يحق للطرف الأول المطالبة وفق الأنظمة المعمول بها دون إخلال بحقوق الطرفين.",
    "للطرف الأول الحق في معاينة العين بعد إشعار مسبق وبما لا يخل بخصوصية الطرف الثاني.",
    "أي إخلال جوهري بالتزامات هذا العقد يخول الطرف المتضرر المطالبة بإنهائه وفق الأنظمة بعد الإنذار عند الاقتضاء.",
    "يُعمل بهذا العقد فيما لم يرد فيه نص وفقاً لنظام الإيجار ولائحته ولأحكام الأنظمة الأخرى ذات العلاقة في المملكة العربية السعودية.",
    "اتفق الطرفان على أن محل إبرام العقد هو المدينة الواردة في الترويسة، وأن أي نزاع يُحال إلى الجهات المختصة.",
  ];

  function getFormData() {
    const fd = new FormData(form);
    const pick = (k) => (fd.get(k) || "").toString().trim();
    return {
      contractDay: pick("contractDay"),
      hijriDate: pick("hijriDate"),
      city: pick("city"),
      lessorName: pick("lessorName"),
      lessorNationality: pick("lessorNationality"),
      lessorId: pick("lessorId"),
      tenantName: pick("tenantName"),
      tenantNationality: pick("tenantNationality"),
      tenantId: pick("tenantId"),
      aptNumber: pick("aptNumber"),
      buildingName: pick("buildingName"),
      propertyLocation: pick("propertyLocation"),
      leaseDuration: pick("leaseDuration"),
      leaseStart: pick("leaseStart"),
      leaseEnd: pick("leaseEnd"),
      rentAmount: pick("rentAmount"),
      rentSchedule: pick("rentSchedule"),
      lessorSignName: pick("lessorSignName"),
      tenantSignName: pick("tenantSignName"),
    };
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function spanVal(s, fallback) {
    const t = (s || "").trim();
    if (t) return escapeHtml(t);
    return `<span class="ph">${escapeHtml(fallback)}</span>`;
  }

  function renderPreview() {
    const d = getFormData();

    const locLine = [d.buildingName, d.propertyLocation].filter(Boolean).join(" — ") || "………";

    let html = "";

    html += `<h1 class="ct-title">عقد إيجار شقة</h1>`;
    html += `<p class="ct-preamble">تم إبرام هذا العقد في يوم ${spanVal(d.contractDay, "………")} الموافق ${spanVal(d.hijriDate, "…/…/…هـ")} بمدينة ${spanVal(d.city, "………")}، بين كلٍ من:</p>`;

    html += `<section class="ct-parties">`;
    html += `<p><strong>الطرف الأول (المؤجر):</strong> السيد / ${spanVal(d.lessorName, "الاسم")}، جنسيته ${spanVal(d.lessorNationality, "………")}، هوية رقم (${spanVal(d.lessorId, "………")}).</p>`;
    html += `<p><strong>الطرف الثاني (المستأجر):</strong> السيد / ${spanVal(d.tenantName, "الاسم")}، جنسيته ${spanVal(d.tenantNationality, "………")}، هوية رقم (${spanVal(d.tenantId, "………")}).</p>`;
    html += `<p class="ct-agree">وقد أقر الطرفان بأهليتهما للتعاقد، فاتفقا وهما بكامل أهليتهما المعتبرة شرعاً ونظاماً على ما يلي:</p>`;
    html += `</section>`;

    html += `<ol class="ct-clauses" start="1">`;
    html += `<li>أجر الطرف الأول للطرف الثاني شقة للسكن الكائن موقعها في ${escapeHtml(locLine)}${d.aptNumber ? `، رقم الشقة (${escapeHtml(d.aptNumber)})` : ""}، وذلك للاستعمال السكني فقط.</li>`;
    html += `<li>مدة هذا العقد ${spanVal(d.leaseDuration, "………")}، تبدأ من ${spanVal(d.leaseStart, "………")} وتنتهي في ${spanVal(d.leaseEnd, "………")}.</li>`;
    html += `<li>اتفق الطرفان على أن الأجرة السنوية مبلغ وقدره (${spanVal(d.rentAmount, "………")}) ريال سعودي لا غير، و${spanVal(d.rentSchedule, "يُحدد أسلوب الدفع ………")}.</li>`;

    STATIC_CLAUSES.forEach((text) => {
      html += `<li>${escapeHtml(text)}</li>`;
    });
    html += `</ol>`;

    html += `<p class="ct-closing">والله ولي التوفيق، وعلى ذلك أقر الطرفان بما سبق.</p>`;

    const lSign = (d.lessorSignName || d.lessorName).trim();
    const tSign = (d.tenantSignName || d.tenantName).trim();

    /* في RTL أول عنصر يظهر يميناً: المؤجر ثم المستأجر يساراً */
    html += `<div class="ct-signatures">`;
    html += `<div class="ct-sign-block">`;
    html += `<p class="ct-sign-role">طرف أول (المؤجر)</p>`;
    html += `<p class="ct-sign-name">الاسم: ${lSign ? escapeHtml(lSign) : spanVal("", "………………")}</p>`;
    html += `<p class="ct-sign-line">التوقيع: ____________________</p>`;
    html += `</div>`;
    html += `<div class="ct-sign-block">`;
    html += `<p class="ct-sign-role">طرف ثانٍ (المستأجر)</p>`;
    html += `<p class="ct-sign-name">الاسم: ${tSign ? escapeHtml(tSign) : spanVal("", "………………")}</p>`;
    html += `<p class="ct-sign-line">التوقيع: ____________________</p>`;
    html += `</div>`;
    html += `</div>`;

    preview.innerHTML = html;
  }

  function save() {
    const d = getFormData();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    } catch (_) {}
  }

  function load() {
    let raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (_) {}
    if (!raw) return;
    let d;
    try {
      d = JSON.parse(raw);
    } catch (_) {
      return;
    }
    Object.keys(d).forEach((key) => {
      const el = form.elements.namedItem(key);
      if (el && "value" in el) el.value = d[key] || "";
    });
  }

  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  const debounced = debounce(() => {
    save();
    renderPreview();
  }, 120);

  form.addEventListener("input", debounced);
  form.addEventListener("change", () => {
    save();
    renderPreview();
  });

  document.getElementById("btn-print").addEventListener("click", () => {
    window.print();
  });

  document.getElementById("btn-reset").addEventListener("click", () => {
    if (!confirm("مسح كل الحقول والبيانات المحفوظة في هذا المتصفح؟")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    form.reset();
    renderPreview();
  });

  load();
  renderPreview();
})();
