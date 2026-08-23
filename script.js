// Apps Script Web App URL (একই স্ক্রিপ্ট guardian ও teacher দুটো ফর্মই হ্যান্ডল করবে)
const scriptURL = 'https://script.google.com/macros/s/AKfycbxMa3MPH4oEyVfGrw4Iyr94SmuSJ6OxFrWK4ay57aTG5-i3f4Vmv55Co_bNRpw-mrcNmQ/exec';

// এই বিষয়গুলো "সকল বিষয়" থেকে সবসময় স্বাধীন থাকবে — "সকল বিষয়" টিক দিলেও এগুলো ডিজেবল হবে না,
// আলাদাভাবে সবসময় সিলেক্ট করা যাবে (গার্ডিয়ান ও টিচার — দুই ফর্মেই প্রযোজ্য)
const INDEPENDENT_SUBJECTS = ['ড্রয়িং', 'আরবি', 'হাতের লেখা'];

/* ============================================================
   ROLE TABS
============================================================ */
const roleTabs = document.querySelectorAll('.role-tab');
const guardianFlow = document.getElementById('guardianFlow');
const teacherFlow = document.getElementById('teacherFlow');
const summarySection = document.getElementById('summarySection');
const teacherSummarySection = document.getElementById('teacherSummarySection');

roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        roleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const role = tab.dataset.role;

        if (role === 'guardian') {
            guardianFlow.classList.add('active');
            teacherFlow.classList.remove('active');
            teacherSummarySection.classList.remove('active');
        } else {
            teacherFlow.classList.add('active');
            guardianFlow.classList.remove('active');
            summarySection.classList.remove('active');
            teacherSummarySection.classList.remove('active');
        }
    });
});

/* ============================================================
   GUARDIAN FORM — Validation (single-step form, whole form at once)
============================================================ */
function validateStep(scopeEl) {
    const inputs = scopeEl.querySelectorAll('input[required], select[required], textarea[required]');
    for (const input of inputs) {
        // রেডিও/চেকবক্স গ্রুপে একটাতে required থাকলেই যথেষ্ট — গ্রুপের কোনো একটা checked থাকলে বাকিগুলোর
        // নেটিভ validity মেসেজ (যেমন প্রথম রেডিওতে) আটকাবে না
        if ((input.type === 'radio' || input.type === 'checkbox') && input.name) {
            const group = scopeEl.querySelectorAll(`input[name="${input.name}"]`);
            const anyChecked = Array.from(group).some(el => el.checked);
            if (anyChecked) continue;
        }
        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }
    }
    return true;
}

/* ============================================================
   DYNAMIC STUDENT FIELDS (শিক্ষার্থীর তথ্য)
============================================================ */
const studentCountSelect = document.getElementById('studentCount');
const dynamicStudentsDiv = document.getElementById('dynamicStudents');

// মিডিয়াম ড্রপডাউনের অপশন — subjects-data.js এর SUBJECTS_DATA থেকে
const mediumsOptions = getMediums()
    .map(m => `<option value="${m}">${m}</option>`)
    .join('');

// মিডিয়াম বদলালে সেই ছাত্রের ক্লাস (ক্লাস-গ্রুপ) ড্রপডাউন রিফ্রেশ হবে, বিষয় রিসেট হবে
window.handleMediumChange = function(selectElement, index) {
    const box = document.querySelector(`.student-box[data-index="${index}"]`);
    const classSelect = box.querySelector('.s-class');
    const subjectsWrap = box.querySelector('.s-subjects-wrap');

    const groups = getClassGroupsForMedium(selectElement.value);
    classSelect.innerHTML = '<option value="" disabled selected>ক্লাস নির্বাচন করুন</option>' +
        groups.map(g => `<option value="${g}">${g}</option>`).join('');
    classSelect.disabled = false;

    subjectsWrap.innerHTML = '<p class="hint">আগে ক্লাস নির্বাচন করুন</p>';
};

// ক্লাস (ক্লাস-গ্রুপ) বদলালে সেই ছাত্রের বিষয়ের চিপ-লিস্ট রিফ্রেশ হবে
window.handleClassChange = function(selectElement, index) {
    const box = document.querySelector(`.student-box[data-index="${index}"]`);
    const mediumSelect = box.querySelector('.s-medium');
    const subjectsWrap = box.querySelector('.s-subjects-wrap');

    const subjects = getSubjectsForClass(mediumSelect.value, selectElement.value);
    if (!subjects.length) {
        subjectsWrap.innerHTML = '<p class="hint">এই ক্লাসের জন্য কোনো বিষয় পাওয়া যায়নি</p>';
        return;
    }
    subjectsWrap.innerHTML = `<div class="chip-group">` +
        subjects.map((subj, si) => `
            <label class="chip-item">
                <input type="checkbox" class="s-subject-cb" value="${subj}" onchange="handleSubjectChipChange(${index})" id="subj-${index}-${si}">
                <span>${subj}</span>
            </label>`).join('') +
        `
            <label class="chip-item">
                <input type="checkbox" class="s-subject-cb s-other-cb" value="অন্যান্য বিষয়" onchange="handleSubjectChipChange(${index})" id="subj-${index}-other">
                <span>অন্যান্য বিষয়</span>
            </label>
        </div>
        <input type="text" class="s-other-subject-text" placeholder="বিষয়ের নাম লিখুন" oninput="handleSubjectChipChange(${index})" style="display:none; margin-top:8px;">
        <input type="hidden" class="s-subjects" required>`;
};

// "সকল বিষয়" (বা "All Subjects") টিক দিলে বাকি সব বিষয় নিষ্ক্রিয় হয়ে যাবে (একসাথে সিলেক্ট করার দরকার নেই)
window.handleSubjectChipChange = function(index) {
    const box = document.querySelector(`.student-box[data-index="${index}"]`);
    const checkboxes = box.querySelectorAll('.s-subject-cb');
    const allSubjectsCb = Array.from(checkboxes).find(cb => cb.value === 'সকল বিষয়' || cb.value === 'All Subjects');
    const otherCb = box.querySelector('.s-other-cb');
    const otherInput = box.querySelector('.s-other-subject-text');

    checkboxes.forEach(cb => {
        if (INDEPENDENT_SUBJECTS.includes(cb.value)) {
            cb.disabled = false;
            cb.closest('.chip-item').classList.remove('disabled');
        } else if (allSubjectsCb && allSubjectsCb.checked && cb !== allSubjectsCb) {
            cb.checked = false;
            cb.disabled = true;
            cb.closest('.chip-item').classList.add('disabled');
        } else {
            cb.disabled = false;
            cb.closest('.chip-item').classList.remove('disabled');
        }
        cb.closest('.chip-item').classList.toggle('chip-selected', cb.checked);
    });

    if (otherInput && otherCb) {
        const showOther = otherCb.checked && !otherCb.disabled;
        otherInput.style.display = showOther ? 'block' : 'none';
        otherInput.required = showOther;
        if (!showOther) otherInput.value = '';
    }

    const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => {
        if (cb === otherCb) {
            const customVal = otherInput ? otherInput.value.trim() : '';
            return customVal || 'অন্যান্য বিষয়';
        }
        return cb.value;
    });
    box.querySelector('.s-subjects').value = selected.join(', ');
};

function renderStudentFields(count) {
    let html = '';
    for (let i = 1; i <= count; i++) {
        html += `
        <div class="student-box" data-index="${i-1}">
            <h4>শিক্ষার্থী ${i} এর তথ্য</h4>
            <div class="form-group">
                <label>মিডিয়াম</label>
                <select class="s-medium" required onchange="handleMediumChange(this, ${i-1})">
                    <option value="" disabled selected>মিডিয়াম নির্বাচন করুন</option>
                    ${mediumsOptions}
                </select>
            </div>
            <div class="form-group">
                <label>ক্লাস</label>
                <select class="s-class" required disabled onchange="handleClassChange(this, ${i-1})">
                    <option value="" disabled selected>আগে মিডিয়াম নির্বাচন করুন</option>
                </select>
            </div>
            <div class="form-group">
                <label>বিষয়</label>
                <div class="s-subjects-wrap">
                    <p class="hint">আগে মিডিয়াম ও ক্লাস নির্বাচন করুন</p>
                </div>
            </div>
        </div>`;
    }
    dynamicStudentsDiv.innerHTML = html;
}
studentCountSelect.addEventListener('change', (e) => renderStudentFields(e.target.value));
renderStudentFields(1);
restoreDraft();

/* ============================================================
   জেলা → এরিয়া কাসকেডিং (areas-data.js ব্যবহার করে)
============================================================ */
const DISTRICT_KEY_MAP = {
    'চট্টগ্রাম': 'Chattogram', 'ফেনী': 'Feni', 'কুমিল্লা': 'Cumilla', 'চাঁদপুর': 'Chandpur',
    'নোয়াখালী': 'Noakhali', 'লক্ষ্মীপুর': 'Lakshmipur', 'কক্সবাজার': "Cox's Bazar",
    'খাগড়াছড়ি': 'Khagrachari', 'রাঙামাটি': 'Rangamati', 'বান্দরবান': 'Bandarban',
    'ব্রাহ্মণবাড়িয়া': 'Brahmanbaria'
};

const districtSelect = document.getElementById('district');
const areaSelect = document.getElementById('area');
const otherAreaGroup = document.getElementById('otherAreaGroup');
const otherAreaText = document.getElementById('otherAreaText');

districtSelect.addEventListener('change', () => {
    const key = DISTRICT_KEY_MAP[districtSelect.value];
    const areas = (typeof AREAS_BY_DISTRICT !== 'undefined' && AREAS_BY_DISTRICT[key]) ? AREAS_BY_DISTRICT[key] : [];

    areaSelect.innerHTML = '<option value="" disabled selected>এরিয়া নির্বাচন করুন</option>' +
        areas.map(a => `<option value="${a}">${a}</option>`).join('') +
        '<option value="অন্যান্য">অন্যান্য (তালিকায় নেই)</option>';
    areaSelect.disabled = false;

    otherAreaGroup.style.display = 'none';
    otherAreaText.removeAttribute('required');
    otherAreaText.value = '';
});

areaSelect.addEventListener('change', () => {
    if (areaSelect.value === 'অন্যান্য') {
        otherAreaGroup.style.display = 'block';
        otherAreaText.setAttribute('required', 'true');
    } else {
        otherAreaGroup.style.display = 'none';
        otherAreaText.removeAttribute('required');
        otherAreaText.value = '';
    }
});

/* ============================================================
   TIME CHECKBOXES (guardian step 3)
============================================================ */
const timeCheckboxes = document.querySelectorAll('input[name="time"]');
const anyTimeCb = document.getElementById('cb-anytime');
const anyTimeLabel = document.getElementById('lbl-anytime');

timeCheckboxes.forEach(cb => {
    cb.addEventListener('change', function() {
        if (this === anyTimeCb && this.checked) {
            timeCheckboxes.forEach(other => {
                if (other !== anyTimeCb) {
                    other.checked = false;
                    other.disabled = true;
                    other.parentElement.classList.add('disabled');
                }
            });
        } else if (this === anyTimeCb && !this.checked) {
            timeCheckboxes.forEach(other => {
                other.disabled = false;
                other.parentElement.classList.remove('disabled');
            });
        } else {
            let checkedCount = 0;
            timeCheckboxes.forEach(other => { if (other !== anyTimeCb && other.checked) checkedCount++; });
            if (checkedCount > 2) {
                this.checked = false;
                alert('আপনি সর্বোচ্চ ২ টি নির্দিষ্ট সময় নির্বাচন করতে পারবেন।');
            }
            if (checkedCount > 0) {
                anyTimeCb.checked = false;
                anyTimeCb.disabled = true;
                anyTimeLabel.classList.add('disabled');
            } else {
                anyTimeCb.disabled = false;
                anyTimeLabel.classList.remove('disabled');
            }
        }
    });
});

/* ============================================================
   DRAFT AUTO-SAVE (গার্ডিয়ান) — ভুলে ট্যাব বন্ধ/রিফ্রেশ হলেও তথ্য থাকবে
============================================================ */
const DRAFT_KEY = 'guardianDraft_v1';

function collectDraftData() {
    const timeArr = Array.from(document.querySelectorAll('input[name="time"]:checked')).map(cb => cb.value);
    const durationChecked = document.querySelector('input[name="duration"]:checked');
    const students = Array.from(document.querySelectorAll('.student-box')).map(box => ({
        medium: box.querySelector('.s-medium')?.value || '',
        cls: box.querySelector('.s-class')?.value || '',
        subjects: box.querySelector('.s-subjects')?.value || ''
    }));

    return {
        district: document.getElementById('district').value,
        phone: document.getElementById('phone').value,
        area: areaSelect.value,
        otherArea: otherAreaText.value,
        address: document.getElementById('address').value,
        teacherGender: document.getElementById('teacherGender').value,
        studentCount: document.getElementById('studentCount').value,
        students,
        days: document.getElementById('days').value,
        duration: durationChecked ? durationChecked.value : '',
        time: timeArr,
        salary: document.getElementById('salary').value,
        specialReq: document.getElementById('specialReq').value
    };
}

function saveDraft() {
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(collectDraftData()));
    } catch (e) { /* localStorage অনুপলব্ধ হলে চুপচাপ ignore করা হবে */ }
}

function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
}

function restoreDraft() {
    let saved;
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return;
        saved = JSON.parse(raw);
    } catch (e) { return; }

    const hasData = saved.district || saved.phone || saved.address;
    if (!hasData) return;

    const wantsRestore = confirm('আপনার আগের অসম্পূর্ণ তথ্য পাওয়া গেছে। সেটা দিয়ে চালিয়ে যেতে চান?');
    if (!wantsRestore) { clearDraft(); return; }

    document.getElementById('district').value = saved.district || '';
    if (saved.district) {
        districtSelect.dispatchEvent(new Event('change'));
        areaSelect.value = saved.area || '';
        if (saved.area === 'অন্যান্য') {
            otherAreaGroup.style.display = 'block';
            otherAreaText.setAttribute('required', 'true');
            otherAreaText.value = saved.otherArea || '';
        }
    }
    document.getElementById('phone').value = saved.phone || '';
    document.getElementById('address').value = saved.address || '';
    document.getElementById('teacherGender').value = saved.teacherGender || '';
    document.getElementById('days').value = saved.days || '';
    document.getElementById('salary').value = saved.salary || '';
    document.getElementById('specialReq').value = saved.specialReq || '';

    if (saved.duration) {
        const durationRadio = document.querySelector(`input[name="duration"][value="${saved.duration}"]`);
        if (durationRadio) durationRadio.checked = true;
    }

    if (saved.time && saved.time.length) {
        document.querySelectorAll('input[name="time"]').forEach(cb => {
            if (saved.time.includes(cb.value)) cb.checked = true;
        });
    }

    if (saved.studentCount) {
        studentCountSelect.value = saved.studentCount;
        renderStudentFields(Number(saved.studentCount));
        setTimeout(() => {
            const boxes = document.querySelectorAll('.student-box');
            (saved.students || []).forEach((s, i) => {
                if (!boxes[i]) return;
                const mediumEl = boxes[i].querySelector('.s-medium');
                if (mediumEl && s.medium) {
                    mediumEl.value = s.medium;
                    handleMediumChange(mediumEl, i);
                }
                const classEl = boxes[i].querySelector('.s-class');
                if (classEl && s.cls) {
                    classEl.value = s.cls;
                    handleClassChange(classEl, i);
                }
                if (s.subjects) {
                    const subjArr = s.subjects.split(', ');
                    const subjectCbs = boxes[i].querySelectorAll('.s-subject-cb');
                    const knownValues = Array.from(subjectCbs).map(cb => cb.value);
                    subjectCbs.forEach(cb => {
                        if (subjArr.includes(cb.value)) cb.checked = true;
                    });
                    const unmatched = subjArr.filter(v => v && !knownValues.includes(v));
                    const otherCb = boxes[i].querySelector('.s-other-cb');
                    const otherInput = boxes[i].querySelector('.s-other-subject-text');
                    if (unmatched.length && otherCb) {
                        otherCb.checked = true;
                        if (otherInput) otherInput.value = unmatched.join(', ');
                    }
                    handleSubjectChipChange(i);
                }
            });
        }, 0);
    }
}

// প্রতিটা ধাপ পরিবর্তনের সময় ও ফর্মে যেকোনো ইনপুটের সময় ড্রাফট সেভ হবে
document.getElementById('guardianForm').addEventListener('input', saveDraft);
document.getElementById('guardianForm').addEventListener('change', saveDraft);

/* ============================================================
   GUARDIAN — Check & Submit
============================================================ */
const checkBtn = document.getElementById('checkBtn');
const editBtn = document.getElementById('editBtn');
const submitBtn = document.getElementById('submitBtn');
const summaryContent = document.getElementById('summaryContent');

let formDataObj = {};
let finalMessage = "";

checkBtn.addEventListener('click', () => {
    if (typeof fbq === 'function') fbq('track', 'InitiateCheckout');

    const honeypot = document.getElementById('website');
    if (honeypot && honeypot.value) { console.warn('Spam blocked.'); return; }

    const guardianFormEl = document.getElementById('guardianForm');
    if (!validateStep(guardianFormEl)) return;

    const district = document.getElementById('district').value;
    const phone = document.getElementById('phone').value;
    const area = (areaSelect.value === 'অন্যান্য') ? otherAreaText.value.trim() : areaSelect.value;
    const address = document.getElementById('address').value;
    const teacherGender = document.getElementById('teacherGender').value;
    const studentCount = document.getElementById('studentCount').value;
    const days = document.getElementById('days').value;
    const salary = document.getElementById('salary').value;
    const specialReq = document.getElementById('specialReq').value;

    const durationChecked = document.querySelector('input[name="duration"]:checked');
    const duration = durationChecked ? durationChecked.value : '';

    const checkedTimes = document.querySelectorAll('input[name="time"]:checked');
    const timeArr = Array.from(checkedTimes).map(cb => cb.value);
    const timeStr = timeArr.join(', ');

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 11 || phoneDigits.length > 14) {
        alert('অনুগ্রহ করে সঠিক মোবাইল নাম্বার দিন (উদা: 01xxxxxxxxx)।');
        return;
    }
    if (!area) {
        alert('অনুগ্রহ করে এরিয়া নির্বাচন করুন (তালিকায় না থাকলে "অন্যান্য" দিয়ে লিখুন)।');
        return;
    }
    if (timeArr.length === 0) {
        alert('অনুগ্রহ করে পড়ানোর সময় নির্বাচন করুন।');
        return;
    }
    if (!duration) {
        alert('অনুগ্রহ করে ক্লাসের সময়কাল নির্বাচন করুন।');
        return;
    }

    let studentDetailsText = "", studentDetailsForSheet = "";
    const studentClassesRaw = []; // পোস্ট-জেনারেশন ও ম্যাচিং-এর জন্য আলাদা রাখা (regex পার্সিং এড়াতে)
    const studentSubjectsRaw = [];
    const studentMediumsRaw = [];
    const sMediums = document.querySelectorAll('.s-medium');
    const sClasses = document.querySelectorAll('.s-class');
    const sSubjects = document.querySelectorAll('.s-subjects');

    for (let i = 0; i < studentCount; i++) {
        if (!sMediums[i].value || !sClasses[i].value || !sSubjects[i].value) {
            alert(`অনুগ্রহ করে শিক্ষার্থী ${i+1} এর সম্পূর্ণ তথ্য দিন (মিডিয়াম, ক্লাস ও অন্তত একটা বিষয়)।`);
            return;
        }
        studentDetailsText += `[শিক্ষার্থী ${i+1}] ক্লাস: ${sClasses[i].value}, মিডিয়াম: ${sMediums[i].value}\nবিষয়: ${sSubjects[i].value}\n`;
        studentDetailsForSheet += `Student ${i+1}: Class ${sClasses[i].value} (${sMediums[i].value}), Subjects: ${sSubjects[i].value} | `;
        studentClassesRaw.push(sClasses[i].value);
        studentSubjectsRaw.push(sSubjects[i].value);
        studentMediumsRaw.push(sMediums[i].value);
    }

    finalMessage = `Location: ${district}, ${area}\nAddress: ${address}\nPhone: ${phone}\n\nTeacher Required: ${teacherGender}\n\n-- Student Information --\nTotal Students: ${studentCount}\n${studentDetailsText}\n-- Schedule & Remuneration --\nDays: ${days}\nDuration: ${duration}\nTime: ${timeStr}\nSalary: ${salary}`;
    if (specialReq) finalMessage += `\nOther Info: ${specialReq}`;

    formDataObj = {
        formType: 'guardian',
        District: district, Area: area, Phone: phone, Address: address, Teacher_Gender: teacherGender,
        Student_Count: studentCount, Student_Details: studentDetailsForSheet,
        Student_Classes: studentClassesRaw.join(','), Student_Subjects: studentSubjectsRaw.join(' | '),
        Student_Mediums: studentMediumsRaw.join(','),
        Days: days, Duration: duration, Time: timeStr, Salary: salary, Special_Requirements: specialReq
    };

    summaryContent.innerText = finalMessage;
    guardianFlow.classList.remove('active');
    summarySection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

editBtn.addEventListener('click', () => {
    summarySection.classList.remove('active');
    guardianFlow.classList.add('active');
});

submitBtn.addEventListener('click', () => {
    if (typeof fbq === 'function') fbq('track', 'Lead');
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');
    editBtn.disabled = true;

    const formData = new FormData();
    for (const key in formDataObj) formData.append(key, formDataObj[key]);

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(() => { clearDraft(); showGuardianCelebration(); })
        .catch(error => { console.error('Error!', error.message); clearDraft(); showGuardianCelebration(); });
});

function showGuardianCelebration() {
    document.getElementById('summaryFormBlock').style.display = 'none';
    document.getElementById('guardianCelebrate').style.display = 'block';
    setTimeout(redirectToWhatsApp, 1100); // অ্যানিমেশনটা একটু দেখার সময় দেওয়া হচ্ছে
}

function redirectToWhatsApp() {
    const encodedMessage = encodeURIComponent(finalMessage);
    window.location.href = `https://wa.me/8801622505105?text=${encodedMessage}`;
}

/* ============================================================
   TEACHER REGISTRATION (4-step wizard + CV summary)
============================================================ */
const teacherForm = document.getElementById('teacherForm');
const teacherStepPanels = document.querySelectorAll('#teacherFlow .step-panel');
const teacherProgressSteps = document.querySelectorAll('#teacherProgressTrack .progress-step');
const tCheckBtn = document.getElementById('tCheckBtn');
const teacherEditBtn = document.getElementById('teacherEditBtn');
const teacherSubmitBtn = document.getElementById('teacherSubmitBtn');
const teacherSummaryContent = document.getElementById('teacherSummaryContent');

function goToTeacherStep(stepNum) {
    teacherStepPanels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.tstep === String(stepNum));
    });
    teacherProgressSteps.forEach((step, idx) => {
        const n = idx + 1;
        step.classList.toggle('active', n === stepNum);
        step.classList.toggle('done', n < stepNum);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-tnext]').forEach(btn => {
    btn.addEventListener('click', () => {
        const currentPanel = btn.closest('.step-panel');
        if (!validateStep(currentPanel)) return;
        if (currentPanel.dataset.tstep === '1' && !tValidateAreas()) return;
        goToTeacherStep(Number(btn.dataset.tnext));
        teacherSaveDraft();
    });
});
document.querySelectorAll('[data-tback]').forEach(btn => {
    btn.addEventListener('click', () => {
        goToTeacherStep(Number(btn.dataset.tback));
        teacherSaveDraft();
    });
});

/* ============================================================
   মিডিয়াম → ক্লাস → বিষয় (ক্যাসকেডিং) নির্বাচন — টিচার
   গার্ডিয়ান ফর্মের মতোই: আগে মিডিয়াম, তারপর সেই মিডিয়ামের নিজস্ব ক্লাস-লিস্ট (getClassGroupsForMedium),
   তারপর সেই (মিডিয়াম, ক্লাস) জোড়ার নিজস্ব বিষয়-লিস্ট (getSubjectsForClass) — এতে ইংলিশ মিডিয়াম/
   মাদ্রাসা/ভোকেশনাল-এর ভিন্ন ক্লাস-নামকরণও (Grade 6, দাখিল ৯ম শ্রেণি ইত্যাদি) সঠিকভাবে কাজ করে।
   একজন টিচার একাধিক মিডিয়াম সিলেক্ট করলে প্রতিটা মিডিয়ামের জন্য আলাদা ক্লাস-লিস্ট দেখাবে,
   এবং প্রতিটা মিডিয়ামে আলাদাভাবে ক্লাস বেছে সেই ক্লাসের বিষয় বেছে নিতে পারবেন।
   ডেটা "মিডিয়াম::ক্লাস" — এই কম্পোজিট-কী দিয়ে জমা হয়, যা গার্ডিয়ানের
   (Student_Mediums[i], Student_Classes[i]) জোড়ার সাথে হুবহু মিলে (matching-এ ব্যবহৃত হয়)।
============================================================ */
let tMediumSelectedClasses = {}; // { "বাংলা মিডিয়াম (BM)": ["৯ম শ্রেণি", "১০ম শ্রেণি"], ... }
let tMediumClassSubjects = {};   // { "বাংলা মিডিয়াম (BM)::৯ম শ্রেণি": ["ইংরেজি", "আর্টস গ্রুপ"], ... }
let tMediumClassOtherText = {};  // { "বাংলা মিডিয়াম (BM)::৯ম শ্রেণি": "কাস্টম বিষয়ের টেক্সট" }

function tRenderMediumClassSubjects() {
    const wrap = document.getElementById('t_medium_class_subjects');
    const mediums = Array.from(document.querySelectorAll('input[name="t_mediums"]:checked')).map(cb => cb.value);

    if (!mediums.length) {
        wrap.innerHTML = '<p class="hint">আগে উপর থেকে মিডিয়াম নির্বাচন করুন</p>';
        tMediumSelectedClasses = {};
        tMediumClassSubjects = {};
        tMediumClassOtherText = {};
        tSyncMediumClassSubjectsJson();
        return;
    }

    // আনসিলেক্ট হয়ে যাওয়া মিডিয়ামের ডেটা মুছে ফেলা
    Object.keys(tMediumSelectedClasses).forEach(m => { if (!mediums.includes(m)) delete tMediumSelectedClasses[m]; });
    Object.keys(tMediumClassSubjects).forEach(key => { if (!mediums.includes(key.split('::')[0])) delete tMediumClassSubjects[key]; });
    Object.keys(tMediumClassOtherText).forEach(key => { if (!mediums.includes(key.split('::')[0])) delete tMediumClassOtherText[key]; });

    wrap.innerHTML = '<p class="hint" style="margin-bottom:10px;">✅ আপনি যেসব বিষয়ে এক্সপার্ট নন সেগুলো তালিকা থেকে বাদ দিয়ে দিন।</p>' + mediums.map(medium => {
        const classOptions = getClassGroupsForMedium(medium);
        const selectedClasses = tMediumSelectedClasses[medium] || [];

        const classChecks = classOptions.map(cls => `
            <label class="checkbox-item">
                <input type="checkbox" class="t-medium-class-cb" data-medium="${medium}" value="${cls}"
                    ${selectedClasses.includes(cls) ? 'checked' : ''}
                    onchange="handleTMediumClassChange('${medium}')">
                ${cls}
            </label>`).join('');

        const allClassesChecked = classOptions.length > 0 && classOptions.every(cls => selectedClasses.includes(cls));
        const allClassesToggle = `
            <label class="checkbox-item" style="font-weight:bold;">
                <input type="checkbox" class="t-medium-allclasses-cb" ${allClassesChecked ? 'checked' : ''}
                    onchange="handleTMediumAllClasses('${medium}', this.checked)">
                সব ক্লাস (${medium})
            </label>`;

        const subjectBoxes = selectedClasses.map(cls => {
            const key = medium + '::' + cls;
            const options = getSubjectsForClass(medium, cls);
            const selectedSubs = tMediumClassSubjects[key] || [];
            const chips = options.map(subj => `
                <label class="chip-item ${selectedSubs.includes(subj) ? 'chip-selected' : ''}">
                    <input type="checkbox" class="t-mc-subject-cb" data-key="${key}" value="${subj}"
                        ${selectedSubs.includes(subj) ? 'checked' : ''}
                        onchange="handleTMcSubjectChange('${key}')">
                    <span>${subj}</span>
                </label>`).join('');
            const otherChecked = selectedSubs.includes('অন্যান্য বিষয়');
            return `
                <div class="t-mc-subject-box" data-mc-box="${key}" style="margin:8px 0 16px 18px;">
                    <p class="hint" style="margin-bottom:6px;"><strong>${cls}</strong> — বিষয়সমূহ</p>
                    <div class="chip-group">
                        ${chips}
                        <label class="chip-item ${otherChecked ? 'chip-selected' : ''}">
                            <input type="checkbox" class="t-mc-subject-cb t-mc-other-cb" data-key="${key}" value="অন্যান্য বিষয়"
                                ${otherChecked ? 'checked' : ''}
                                onchange="handleTMcSubjectChange('${key}')">
                            <span>অন্যান্য বিষয়</span>
                        </label>
                    </div>
                    <input type="text" class="t-mc-other-subject-text" placeholder="বিষয়ের নাম লিখুন"
                        oninput="handleTMcSubjectChange('${key}')"
                        style="display:${otherChecked ? 'block' : 'none'}; margin-top:8px;"
                        value="${tMediumClassOtherText[key] || ''}">
                </div>`;
        }).join('');

        return `
            <div class="t-medium-box" style="margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid #eee;">
                <p class="hint" style="margin-bottom:6px;"><strong>${medium}</strong> — যেসব শ্রেণি পড়াতে পারবেন</p>
                <div class="checkbox-group">${allClassesToggle}${classChecks}</div>
                ${subjectBoxes}
            </div>`;
    }).join('');

    // নতুন ক্লাস সিলেক্ট হলে ডিফল্টভাবে "সকল বিষয়" অটো-চেক থাকবে (উপরের রেন্ডারে already সেট করা থাকলে
    // এখানে শুধু disabled/chip-selected স্টাইল ও selected-array সিঙ্ক করা হয়) — টিচারকে প্রতিটা বিষয়
    // আলাদা করে টিক দিতে হবে না, শুধু না-পড়াতে-পারা বিষয় আনচেক করলেই চলবে
    Object.keys(tMediumClassSubjects).forEach(key => handleTMcSubjectChange(key));

    tSyncMediumClassSubjectsJson();
}

window.handleTMediumAllClasses = function(medium, checked) {
    document.querySelectorAll(`input.t-medium-class-cb[data-medium="${medium}"]`).forEach(cb => { cb.checked = checked; });
    handleTMediumClassChange(medium);
};

window.handleTMediumClassChange = function(medium) {
    const checked = Array.from(document.querySelectorAll(`input.t-medium-class-cb[data-medium="${medium}"]:checked`)).map(cb => cb.value);
    const previouslySelected = tMediumSelectedClasses[medium] || [];
    checked.forEach(cls => {
        const key = medium + '::' + cls;
        if (!previouslySelected.includes(cls) && !tMediumClassSubjects[key]) {
            // নতুন ক্লাস — ডিফল্টভাবে "সকল বিষয়" সিলেক্টেড থাকবে
            tMediumClassSubjects[key] = ['সকল বিষয়'];
        }
    });
    // ক্লাস আনচেক হয়ে গেলে সেই ক্লাসের পুরনো বিষয়-ডেটা মুছে ফেলা (নাহলে সাবমিশনে ভুলভাবে থেকে যেত)
    previouslySelected.forEach(cls => {
        if (!checked.includes(cls)) {
            const key = medium + '::' + cls;
            delete tMediumClassSubjects[key];
            delete tMediumClassOtherText[key];
        }
    });
    tMediumSelectedClasses[medium] = checked;
    tRenderMediumClassSubjects();
};

window.handleTMcSubjectChange = function(key) {
    const box = document.querySelector(`.t-mc-subject-box[data-mc-box="${key}"]`);
    if (!box) return;

    const checkboxes = box.querySelectorAll('.t-mc-subject-cb');
    const allCb = Array.from(checkboxes).find(cb => cb.value === 'সকল বিষয়' || cb.value === 'All Subjects');
    const otherCb = box.querySelector('.t-mc-other-cb');
    const otherInput = box.querySelector('.t-mc-other-subject-text');

    checkboxes.forEach(cb => {
        if (INDEPENDENT_SUBJECTS.includes(cb.value)) {
            cb.disabled = false;
            cb.closest('.chip-item').classList.remove('disabled');
        } else if (allCb && allCb.checked && cb !== allCb) {
            cb.checked = false;
            cb.disabled = true;
            cb.closest('.chip-item').classList.add('disabled');
        } else {
            cb.disabled = false;
            cb.closest('.chip-item').classList.remove('disabled');
        }
        cb.closest('.chip-item').classList.toggle('chip-selected', cb.checked);
    });

    if (otherInput && otherCb) {
        const showOther = otherCb.checked && !otherCb.disabled;
        otherInput.style.display = showOther ? 'block' : 'none';
        if (!showOther) otherInput.value = '';
    }

    const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => {
        if (cb === otherCb) {
            const customVal = otherInput ? otherInput.value.trim() : '';
            return customVal || 'অন্যান্য বিষয়';
        }
        return cb.value;
    });

    tMediumClassSubjects[key] = selected;
    tMediumClassOtherText[key] = otherInput ? otherInput.value : '';
    tSyncMediumClassSubjectsJson();
};

function tSyncMediumClassSubjectsJson() {
    const cleaned = {};
    Object.keys(tMediumClassSubjects).forEach(k => {
        if (tMediumClassSubjects[k] && tMediumClassSubjects[k].length) cleaned[k] = tMediumClassSubjects[k];
    });
    document.getElementById('t_subjects_by_class_json').value = JSON.stringify(cleaned);
}

document.querySelectorAll('input[name="t_mediums"]').forEach(cb => cb.addEventListener('change', tRenderMediumClassSubjects));

/* ---- স্ট্যাটাস অনুযায়ী ডাইনামিক দ্বিতীয় ডকুমেন্ট লেবেল ---- */
const tStatusSelect = document.getElementById('t_status');
const tSecondDocLabel = document.getElementById('t_second_doc_label');
const tSecondDocHint = document.getElementById('t_second_doc_hint');

function updateSecondDocLabel() {
    const status = tStatusSelect.value;
    if (status === 'স্টুডেন্ট') {
        tSecondDocLabel.textContent = 'স্টুডেন্ট আইডি/ভর্তির প্রমাণ';
        tSecondDocHint.textContent = 'বিভাগ ও সেশন যাচাইয়ের জন্য স্টুডেন্ট আইডি কার্ড বা ভর্তির রেজিস্ট্রেশনের ছবি দিন';
    } else if (status) {
        tSecondDocLabel.textContent = 'জব আইডি/প্রফেশনাল প্রমাণ';
        tSecondDocHint.textContent = 'কর্মস্থলের আইডি কার্ড বা প্রাসঙ্গিক প্রমাণের ছবি দিন';
    } else {
        tSecondDocLabel.textContent = 'দ্বিতীয় ডকুমেন্ট';
        tSecondDocHint.textContent = '';
    }
}
tStatusSelect.addEventListener('change', updateSecondDocLabel);

/* ============================================================
   জেলা → এরিয়া (মাল্টি-সিলেক্ট, সার্চেবল চিপ পিকার) — টিচার ফর্ম
============================================================ */
const tTargetDistrictSelect = document.getElementById('t_target_district');
const tAreasPicker = document.getElementById('t_areas_picker');
const tAreasChips = document.getElementById('t_areas_chips');
const tAreasSearch = document.getElementById('t_areas_search');
const tAreasDropdown = document.getElementById('t_areas_dropdown');
const tOtherAreaGroup = document.getElementById('t_otherAreaGroup');
const tOtherAreaText = document.getElementById('t_otherAreaText');

let tSelectedAreas = [];

function tCurrentDistrictKey() {
    return DISTRICT_KEY_MAP[tTargetDistrictSelect.value];
}

function tRenderAreaChips() {
    tAreasChips.innerHTML = tSelectedAreas.map(area => `
        <span class="area-chip" data-area="${area}">
            ${area}
            <button type="button" aria-label="বাদ দিন">×</button>
        </span>
    `).join('');
    tAreasChips.querySelectorAll('.area-chip button').forEach(btn => {
        btn.addEventListener('click', () => {
            const area = btn.closest('.area-chip').dataset.area;
            tSelectedAreas = tSelectedAreas.filter(a => a !== area);
            tRenderAreaChips();
            tRenderAreaDropdown(tAreasSearch.value);
        });
    });
}

function tSelectArea(area) {
    if (!tSelectedAreas.includes(area)) tSelectedAreas.push(area);
    tAreasSearch.value = '';
    tRenderAreaChips();
    tRenderAreaDropdown('');
    tAreasSearch.focus();
    teacherSaveDraft();
}

function tShowOtherAreaField() {
    tOtherAreaGroup.style.display = 'block';
    tOtherAreaText.focus();
}

function tRenderAreaDropdown(query) {
    const key = tCurrentDistrictKey();
    if (!key) { tAreasDropdown.classList.remove('open'); return; }

    const q = (query || '').trim();
    const matches = (typeof searchAreas === 'function' ? searchAreas(key, q) : [])
        .filter(a => !tSelectedAreas.includes(a));

    let html = '';
    if (matches.length === 0 && q === '') {
        html += `<div class="area-dropdown-empty">সবগুলো এরিয়া বাছাই করা হয়ে গেছে</div>`;
    } else if (matches.length === 0) {
        html += `<div class="area-dropdown-empty">কোনো এরিয়া পাওয়া যায়নি</div>`;
    } else {
        html += matches.map(a => `<div class="area-dropdown-item" data-area="${a}">${a}</div>`).join('');
    }
    html += `<div class="area-dropdown-item other-option" data-other="1">✏️ অন্যান্য (তালিকায় নেই — নিজে লিখুন)</div>`;
    tAreasDropdown.innerHTML = html;

    tAreasDropdown.querySelectorAll('.area-dropdown-item[data-area]').forEach(item => {
        item.addEventListener('click', () => tSelectArea(item.dataset.area));
    });
    const otherItem = tAreasDropdown.querySelector('.area-dropdown-item[data-other]');
    if (otherItem) {
        otherItem.addEventListener('click', () => {
            tShowOtherAreaField();
            tAreasDropdown.classList.remove('open');
        });
    }
    tAreasDropdown.classList.add('open');
}

function tHandleDistrictChange(silent) {
    const key = tCurrentDistrictKey();
    const districtChosen = !!tTargetDistrictSelect.value;
    tSelectedAreas = [];
    tRenderAreaChips();
    tOtherAreaGroup.style.display = 'none';
    tOtherAreaText.value = '';
    tAreasSearch.value = '';
    tAreasDropdown.classList.remove('open');

    if (key) {
        tAreasSearch.disabled = false;
        tAreasSearch.placeholder = 'এরিয়া খুঁজুন (ঐচ্ছিক) — অথবা স্ক্রল করে বাছাই করুন';
        if (!silent) tRenderAreaDropdown('');
    } else if (districtChosen) {
        // এই জেলার canonical এরিয়া-লিস্ট এখনো নেই — সরাসরি ফ্রি-টেক্সটে যেতে হবে
        tAreasSearch.disabled = true;
        tAreasSearch.placeholder = 'এই জেলার এরিয়া তালিকা এখনো যোগ করা হয়নি';
        tOtherAreaGroup.style.display = 'block';
        if (!silent) tOtherAreaText.focus();
    } else {
        tAreasSearch.disabled = true;
        tAreasSearch.placeholder = 'আগে জেলা নির্বাচন করুন';
    }
}
tTargetDistrictSelect.addEventListener('change', () => tHandleDistrictChange(false));

tAreasSearch.addEventListener('focus', () => tRenderAreaDropdown(tAreasSearch.value));
tAreasSearch.addEventListener('input', () => tRenderAreaDropdown(tAreasSearch.value));
document.addEventListener('click', (e) => {
    if (!tAreasPicker.contains(e.target)) tAreasDropdown.classList.remove('open');
});

function tValidateAreas() {
    if (tSelectedAreas.length === 0 && tOtherAreaText.value.trim() === '') {
        alert('অনুগ্রহ করে অন্তত একটা এলাকা নির্বাচন করুন অথবা "অন্যান্য" তে লিখুন।');
        tAreasSearch.focus();
        return false;
    }
    return true;
}

/* ---- Draft auto-save (টিচার) ---- */
const T_DRAFT_KEY = 'teacherDraft_v1';
const T_TEXT_FIELD_IDS = [
    't_name', 't_gender', 't_phone', 't_altphone', 't_target_district', 't_address',
    't_otherAreaText', 't_status', 't_department', 't_session',
    't_institution', 't_institution_type', 't_degree_type', 't_ssc_group', 't_ssc_result',
    't_ssc_school', 't_hsc_group', 't_hsc_result', 't_hsc_college', 't_experience_years'
];
const T_CHECKBOX_GROUPS = ['t_mediums'];

function teacherCollectDraftData() {
    const data = { step: document.querySelector('#teacherFlow .step-panel.active')?.dataset.tstep || '1' };
    T_TEXT_FIELD_IDS.forEach(id => { data[id] = document.getElementById(id).value; });
    T_CHECKBOX_GROUPS.forEach(name => {
        data[name] = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
    });
    data.t_areas = tSelectedAreas;
    data.t_medium_selected_classes = tMediumSelectedClasses;
    data.t_medium_class_subjects = tMediumClassSubjects;
    data.t_medium_class_other_text = tMediumClassOtherText;
    return data;
}
function teacherSaveDraft() {
    try { localStorage.setItem(T_DRAFT_KEY, JSON.stringify(teacherCollectDraftData())); } catch (e) {}
}
function teacherClearDraft() {
    try { localStorage.removeItem(T_DRAFT_KEY); } catch (e) {}
}
function teacherRestoreDraft() {
    let saved;
    try {
        const raw = localStorage.getItem(T_DRAFT_KEY);
        if (!raw) return;
        saved = JSON.parse(raw);
    } catch (e) { return; }

    const hasData = saved.t_name || saved.t_phone;
    if (!hasData) return;
    if (!confirm('আপনার আগের অসম্পূর্ণ টিচার রেজিস্ট্রেশন তথ্য পাওয়া গেছে। সেটা দিয়ে চালিয়ে যেতে চান?')) { teacherClearDraft(); return; }

    T_TEXT_FIELD_IDS.forEach(id => {
        if (saved[id] !== undefined) document.getElementById(id).value = saved[id];
    });
    T_CHECKBOX_GROUPS.forEach(name => {
        if (saved[name] && saved[name].length) {
            document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
                if (saved[name].includes(cb.value)) cb.checked = true;
            });
        }
    });

    if (saved.t_medium_selected_classes) tMediumSelectedClasses = saved.t_medium_selected_classes;
    if (saved.t_medium_class_subjects) tMediumClassSubjects = saved.t_medium_class_subjects;
    if (saved.t_medium_class_other_text) tMediumClassOtherText = saved.t_medium_class_other_text;
    tRenderMediumClassSubjects();

    if (tTargetDistrictSelect.value) {
        tHandleDistrictChange(true);
        if (saved.t_areas && saved.t_areas.length) {
            tSelectedAreas = saved.t_areas.slice();
            tRenderAreaChips();
        }
        if (saved.t_otherAreaText) {
            tOtherAreaText.value = saved.t_otherAreaText;
            tOtherAreaGroup.style.display = 'block';
        }
        tAreasDropdown.classList.remove('open');
    }

    updateSecondDocLabel();
    goToTeacherStep(Number(saved.step) || 1);
}
teacherForm.addEventListener('input', teacherSaveDraft);
teacherForm.addEventListener('change', teacherSaveDraft);
teacherRestoreDraft();

/* ---- বাংলা সংখ্যা → ইংরেজি সংখ্যা normalize (Sheet-এ consistent ডেটার জন্য) ---- */
function normalizeDigits(str) {
    if (!str) return str;
    const bnDigits = '০১২৩৪৫৬৭৮৯';
    return str.toString().replace(/[০-৯]/g, d => bnDigits.indexOf(d));
}

/* ---- ফাইল আপলোড স্ট্যাটাস ---- */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
function setupUploadStatus(inputId, statusId) {
    const input = document.getElementById(inputId);
    const status = document.getElementById(statusId);
    input.addEventListener('change', () => {
        if (input.files.length > 0) {
            const sizeMB = (input.files[0].size / (1024 * 1024)).toFixed(1);
            if (input.files[0].size > 5 * 1024 * 1024) {
                status.textContent = `ফাইল খুব বড় (${sizeMB}MB) — 5MB এর কম সাইজের ফাইল দিন`;
                status.classList.remove('ok');
                input.value = '';
            } else {
                status.textContent = `✓ নির্বাচিত হয়েছে (${sizeMB}MB)`;
                status.classList.add('ok');
            }
        }
    });
}
setupUploadStatus('t_nid', 't_nid_status');
setupUploadStatus('t_second_doc', 't_second_doc_status');

/* ---- ধাপ ৪ → সারাংশ (CV) তৈরি ---- */
let teacherFormDataObj = {};
let teacherFinalMessage = "";

tCheckBtn.addEventListener('click', async () => {
    const step4Panel = document.querySelector('#teacherFlow .step-panel[data-tstep="4"]');
    if (!validateStep(step4Panel)) return;

    const tMediumsArr = Array.from(document.querySelectorAll('input[name="t_mediums"]:checked')).map(cb => cb.value);
    if (tMediumsArr.length === 0) { alert('অনুগ্রহ করে অন্তত একটা মিডিয়াম নির্বাচন করুন।'); return; }

    const subjectsByClassJson = document.getElementById('t_subjects_by_class_json').value || '{}';
    const parsedSubjectsByClass = JSON.parse(subjectsByClassJson);

    let hasAnyClass = false;
    const missingSubjectKeys = [];
    tMediumsArr.forEach(medium => {
        (tMediumSelectedClasses[medium] || []).forEach(cls => {
            hasAnyClass = true;
            const key = medium + '::' + cls;
            if (!(parsedSubjectsByClass[key] && parsedSubjectsByClass[key].length)) {
                missingSubjectKeys.push(`${cls} (${medium})`);
            }
        });
    });
    if (!hasAnyClass) { alert('অনুগ্রহ করে অন্তত একটা শ্রেণি নির্বাচন করুন।'); return; }
    if (missingSubjectKeys.length) {
        alert('অনুগ্রহ করে প্রতিটা নির্বাচিত শ্রেণির জন্য অন্তত একটা বিষয় বাছাই করুন: ' + missingSubjectKeys.join(', '));
        return;
    }

    tCheckBtn.disabled = true;
    tCheckBtn.classList.add('is-loading');

    try {
        const nidFile = document.getElementById('t_nid').files[0];
        const secondDocFile = document.getElementById('t_second_doc').files[0];
        const [nidBase64, secondDocBase64] = await Promise.all([
            fileToBase64(nidFile),
            fileToBase64(secondDocFile)
        ]);

        const get = id => document.getElementById(id).value;
        const name = get('t_name'), gender = get('t_gender'), phone = get('t_phone'), altPhone = get('t_altphone');
        const targetDistrict = get('t_target_district'), address = get('t_address');
        const areasStr = tSelectedAreas.join(', ');
        const otherAreasStr = get('t_otherAreaText').trim();
        const locationsDisplay = [areasStr, otherAreasStr].filter(Boolean).join(', ');
        const status = get('t_status');
        const department = get('t_department'), session = get('t_session'), institution = get('t_institution');
        const institutionType = get('t_institution_type'), degreeType = get('t_degree_type');
        const sscGroup = get('t_ssc_group'), sscResult = get('t_ssc_result'), sscSchool = get('t_ssc_school');
        const hscGroup = get('t_hsc_group'), hscResult = get('t_hsc_result'), hscCollege = get('t_hsc_college');
        const experienceYears = normalizeDigits(get('t_experience_years'));
        const secondDocType = tSecondDocLabel.textContent;

        const subjectsSummaryText = Object.keys(parsedSubjectsByClass).map(key => {
            const [medium, cls] = key.split('::');
            return `${cls} (${medium}): ${parsedSubjectsByClass[key].join(', ')}`;
        }).join('\n');
        const teachableClassesFlat = [...new Set(
            tMediumsArr.flatMap(m => tMediumSelectedClasses[m] || [])
        )].join(', ');

        teacherFinalMessage =
            `📋 টিউটর সিভি\n\n` +
            `নাম: ${name}\nলিঙ্গ: ${gender}\nফোন: ${phone}${altPhone ? ' / ' + altPhone : ''}\n` +
            `যে জেলায় টিউশন করাতে চান: ${targetDistrict}\nবর্তমান ঠিকানা: ${address}\n` +
            `টিউশনের এলাকা: ${locationsDisplay}\nবর্তমান স্ট্যাটাস: ${status}\n\n` +
            `-- শিক্ষাগত যোগ্যতা --\nবিভাগ/সেশন: ${department} / ${session}\nপ্রতিষ্ঠান: ${institution} (${institutionType})\nডিগ্রী: ${degreeType}\n` +
            `এসএসসি: ${sscGroup}, ${sscResult}, ${sscSchool}\nএইচএসসি: ${hscGroup}, ${hscResult}, ${hscCollege}\n\n` +
            `-- পড়ানোর তথ্য --\nমিডিয়াম: ${tMediumsArr.join(', ')}\nক্লাসভিত্তিক বিষয়সমূহ:\n${subjectsSummaryText}\n` +
            `অভিজ্ঞতা: ${experienceYears || '0'} বছর`;

        teacherFormDataObj = {
            formType: 'teacher',
            Name: name, Gender: gender, Phone: phone, Alt_Phone: altPhone,
            Target_District: targetDistrict, Address: address,
            Areas: areasStr, Other_Areas: otherAreasStr, Current_Status: status,
            Department: department, Session: session, Institution: institution,
            Institution_Type: institutionType, Degree_Type: degreeType,
            SSC_Group: sscGroup, SSC_Result: sscResult, SSC_School: sscSchool,
            HSC_Group: hscGroup, HSC_Result: hscResult, HSC_College: hscCollege,
            Teachable_Classes: teachableClassesFlat, Teachable_Mediums: tMediumsArr.join(', '),
            Subjects: subjectsSummaryText, Subjects_By_Class: JSON.stringify(parsedSubjectsByClass),
            Experience_Years: experienceYears,
            NID_Base64: nidBase64, NID_Filename: nidFile.name, NID_MimeType: nidFile.type,
            SecondDoc_Base64: secondDocBase64, SecondDoc_Filename: secondDocFile.name,
            SecondDoc_MimeType: secondDocFile.type, SecondDoc_Type: secondDocType
        };

        teacherSummaryContent.innerText = teacherFinalMessage;
        teacherFlow.classList.remove('active');
        teacherSummarySection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        console.error('CV তৈরি করতে সমস্যা:', err);
        alert('দুঃখিত, একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
        tCheckBtn.disabled = false;
        tCheckBtn.classList.remove('is-loading');
    }
});

teacherEditBtn.addEventListener('click', () => {
    teacherSummarySection.classList.remove('active');
    teacherFlow.classList.add('active');
});

teacherSubmitBtn.addEventListener('click', () => {
    teacherSubmitBtn.disabled = true;
    teacherSubmitBtn.classList.add('is-loading');
    teacherEditBtn.disabled = true;

    const formData = new FormData();
    for (const key in teacherFormDataObj) formData.append(key, teacherFormDataObj[key]);

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(() => { teacherClearDraft(); showTeacherCelebration(); })
        .catch(err => { console.error('Teacher save error:', err); teacherClearDraft(); showTeacherCelebration(); });
});

function showTeacherCelebration() {
    document.getElementById('teacherSummaryFormBlock').style.display = 'none';
    document.getElementById('teacherCelebrate').style.display = 'block';
    setTimeout(() => redirectTeacherToWhatsApp(teacherFinalMessage), 1100);
}

function redirectTeacherToWhatsApp(message) {
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/8801622505105?text=${encodedMessage}`;
}
