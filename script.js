// Apps Script Web App URL (একই স্ক্রিপ্ট guardian ও teacher দুটো ফর্মই হ্যান্ডল করবে)
const scriptURL = 'https://script.google.com/macros/s/AKfycbxMa3MPH4oEyVfGrw4Iyr94SmuSJ6OxFrWK4ay57aTG5-i3f4Vmv55Co_bNRpw-mrcNmQ/exec';

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
   GUARDIAN WIZARD — Step Navigation
============================================================ */
const stepPanels = document.querySelectorAll('#guardianFlow .step-panel');
const progressSteps = document.querySelectorAll('.progress-step');

function goToStep(stepNum) {
    stepPanels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.step === String(stepNum));
    });
    // দ্রষ্টব্য: data-step-এ বাংলা সংখ্যা থাকলে Number() ভুল ফলাফল দেয় (NaN),
    // তাই টেক্সট পার্স না করে সিরিয়াল পজিশন (index) দিয়ে হিসেব করা হচ্ছে
    progressSteps.forEach((step, idx) => {
        const n = idx + 1;
        step.classList.toggle('active', n === stepNum);
        step.classList.toggle('done', n < stepNum);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(stepPanel) {
    const inputs = stepPanel.querySelectorAll('input[required], select[required], textarea[required]');
    for (const input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }
    }
    return true;
}

document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
        const currentPanel = btn.closest('.step-panel');
        if (!validateStep(currentPanel)) return;
        goToStep(Number(btn.dataset.next));
        saveDraft();
    });
});

document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => {
        goToStep(Number(btn.dataset.back));
        saveDraft();
    });
});

/* ============================================================
   DYNAMIC STUDENT FIELDS (guardian step 2)
============================================================ */
const studentCountSelect = document.getElementById('studentCount');
const dynamicStudentsDiv = document.getElementById('dynamicStudents');

const classesOptions = `
    <option value="প্রি স্কুল">প্রি স্কুল</option><option value="লোয়ার কেজি">লোয়ার কেজি</option>
    <option value="কেজি/নার্সারি">কেজি/নার্সারি</option><option value="আপার কেজি">আপার কেজি</option>
    <option value="ওয়ান">ওয়ান</option><option value="টু">টু</option><option value="থ্রি">থ্রি</option>
    <option value="ফোর">ফোর</option><option value="ফাইভ">ফাইভ</option><option value="সিক্স">সিক্স</option>
    <option value="সেভেন">সেভেন</option><option value="এইট">এইট</option><option value="নাইন">নাইন</option>
    <option value="টেন">টেন</option><option value="এসএসসি পরীক্ষার্থী">এসএসসি পরীক্ষার্থী</option>
    <option value="একাদশ">একাদশ</option><option value="দ্বাদশ">দ্বাদশ</option>
    <option value="এইচএসসি পরীক্ষার্থী">এইচএসসি পরীক্ষার্থী</option><option value="এডমিশন প্রিপারেশন">এডমিশন প্রিপারেশন</option>
`;
const mediumsOptions = `
    <option value="বাংলা মিডিয়াম (BM)">বাংলা মিডিয়াম (BM)</option>
    <option value="ইংলিশ মিডিয়াম (EM)">ইংলিশ মিডিয়াম (EM)</option>
    <option value="ইংলিশ ভার্সন (NC)">ইংলিশ ভার্সন (NC)</option>
    <option value="মাদ্রাসা">মাদ্রাসা</option>
    <option value="ভোকেশনাল/পলিটেকনিক">ভোকেশনাল/পলিটেকনিক</option>
`;
const higherClasses = ['নাইন', 'টেন', 'এসএসসি পরীক্ষার্থী', 'একাদশ', 'দ্বাদশ', 'এইচএসসি পরীক্ষার্থী', 'এডমিশন প্রিপারেশন'];

window.handleClassChange = function(selectElement, index) {
    const container = document.getElementById(`group-container-${index}`);
    const groupSelect = container.querySelector('.s-group');
    if (higherClasses.includes(selectElement.value)) {
        container.style.display = 'block';
        groupSelect.setAttribute('required', 'true');
    } else {
        container.style.display = 'none';
        groupSelect.removeAttribute('required');
        groupSelect.value = '';
    }
};

function renderStudentFields(count) {
    let html = '';
    for (let i = 1; i <= count; i++) {
        html += `
        <div class="student-box">
            <h4>শিক্ষার্থী ${i} এর তথ্য</h4>
            <div class="form-group">
                <label>মিডিয়াম</label>
                <select class="s-medium" required>
                    <option value="" disabled selected>মিডিয়াম নির্বাচন করুন</option>
                    ${mediumsOptions}
                </select>
            </div>
            <div class="form-group">
                <label>ক্লাস</label>
                <select class="s-class" required onchange="handleClassChange(this, ${i-1})">
                    <option value="" disabled selected>ক্লাস নির্বাচন করুন</option>
                    ${classesOptions}
                </select>
            </div>
            <div class="form-group" id="group-container-${i-1}" style="display: none;">
                <label>গ্রুপ</label>
                <select class="s-group">
                    <option value="" disabled selected>গ্রুপ নির্বাচন করুন</option>
                    <option value="বিজ্ঞান (Science)">বিজ্ঞান (Science)</option>
                    <option value="ব্যবসা শিক্ষা (Commerce)">ব্যবসা শিক্ষা (Commerce)</option>
                    <option value="মানবিক (Arts)">মানবিক (Arts)</option>
                </select>
            </div>
            <div class="form-group">
                <label>বিষয়</label>
                <textarea class="s-subjects" maxlength="2000" placeholder="বিষয়গুলো লিখুন..." required></textarea>
            </div>
        </div>`;
    }
    dynamicStudentsDiv.innerHTML = html;
}
studentCountSelect.addEventListener('change', (e) => renderStudentFields(e.target.value));
renderStudentFields(1);
restoreDraft();

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
    const students = Array.from(document.querySelectorAll('.student-box')).map(box => ({
        medium: box.querySelector('.s-medium')?.value || '',
        cls: box.querySelector('.s-class')?.value || '',
        group: box.querySelector('.s-group')?.value || '',
        subjects: box.querySelector('.s-subjects')?.value || ''
    }));
    const currentStep = document.querySelector('#guardianFlow .step-panel.active')?.dataset.step || '1';

    return {
        step: currentStep,
        district: document.getElementById('district').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        teacherGender: document.getElementById('teacherGender').value,
        preferredDegree: document.getElementById('preferred_degree').value,
        preferredInstitution: document.getElementById('preferred_institution').value,
        studentCount: document.getElementById('studentCount').value,
        students,
        days: document.getElementById('days').value,
        duration: document.getElementById('duration').value,
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
    document.getElementById('phone').value = saved.phone || '';
    document.getElementById('address').value = saved.address || '';
    document.getElementById('teacherGender').value = saved.teacherGender || '';
    document.getElementById('preferred_degree').value = saved.preferredDegree || '';
    document.getElementById('preferred_institution').value = saved.preferredInstitution || '';
    document.getElementById('days').value = saved.days || '';
    document.getElementById('duration').value = saved.duration || '';
    document.getElementById('salary').value = saved.salary || '';
    document.getElementById('specialReq').value = saved.specialReq || '';

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
                const classEl = boxes[i].querySelector('.s-class');
                const groupEl = boxes[i].querySelector('.s-group');
                const subjEl = boxes[i].querySelector('.s-subjects');
                if (mediumEl) mediumEl.value = s.medium;
                if (classEl) { classEl.value = s.cls; handleClassChange(classEl, i); }
                if (groupEl) groupEl.value = s.group;
                if (subjEl) subjEl.value = s.subjects;
            });
        }, 0);
    }

    goToStep(Number(saved.step) || 1);
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

    const step3Panel = document.querySelector('#guardianFlow .step-panel[data-step="3"]');
    if (!validateStep(step3Panel)) return;

    const district = document.getElementById('district').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const teacherGender = document.getElementById('teacherGender').value;
    const preferredDegree = document.getElementById('preferred_degree').value;
    const preferredInstitution = document.getElementById('preferred_institution').value;
    const studentCount = document.getElementById('studentCount').value;
    const days = document.getElementById('days').value;
    const duration = document.getElementById('duration').value;
    const salary = document.getElementById('salary').value;
    const specialReq = document.getElementById('specialReq').value;

    const checkedTimes = document.querySelectorAll('input[name="time"]:checked');
    const timeArr = Array.from(checkedTimes).map(cb => cb.value);
    const timeStr = timeArr.join(', ');

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 11 || phoneDigits.length > 14) {
        alert('অনুগ্রহ করে সঠিক মোবাইল নাম্বার দিন (উদা: 01xxxxxxxxx)।');
        return;
    }
    if (timeArr.length === 0) {
        alert('অনুগ্রহ করে পড়ানোর সময় নির্বাচন করুন।');
        return;
    }

    let studentDetailsText = "", studentDetailsForSheet = "";
    const studentClassesRaw = []; // পোস্ট-জেনারেশন ও ম্যাচিং-এর জন্য আলাদা রাখা (regex পার্সিং এড়াতে)
    const studentSubjectsRaw = [];
    const studentMediumsRaw = [];
    const studentGroupsRaw = [];
    const sMediums = document.querySelectorAll('.s-medium');
    const sClasses = document.querySelectorAll('.s-class');
    const sGroups = document.querySelectorAll('.s-group');
    const sSubjects = document.querySelectorAll('.s-subjects');

    for (let i = 0; i < studentCount; i++) {
        if (!sMediums[i].value || !sClasses[i].value || !sSubjects[i].value) {
            alert(`অনুগ্রহ করে শিক্ষার্থী ${i+1} এর সম্পূর্ণ তথ্য দিন।`);
            return;
        }
        let groupTextStr = "", groupTextSheet = "";
        if (higherClasses.includes(sClasses[i].value)) {
            if (!sGroups[i].value) { alert(`অনুগ্রহ করে শিক্ষার্থী ${i+1} এর গ্রুপ নির্বাচন করুন।`); return; }
            groupTextStr = `, গ্রুপ: ${sGroups[i].value}`;
            groupTextSheet = ` [Group: ${sGroups[i].value}]`;
        }
        studentDetailsText += `[শিক্ষার্থী ${i+1}] ক্লাস: ${sClasses[i].value}${groupTextStr}, মিডিয়াম: ${sMediums[i].value}\nবিষয়: ${sSubjects[i].value}\n`;
        studentDetailsForSheet += `Student ${i+1}: Class ${sClasses[i].value}${groupTextSheet} (${sMediums[i].value}), Subjects: ${sSubjects[i].value} | `;
        studentClassesRaw.push(sClasses[i].value);
        studentSubjectsRaw.push(sSubjects[i].value);
        studentMediumsRaw.push(sMediums[i].value);
        if (sGroups[i].value) studentGroupsRaw.push(sGroups[i].value);
    }

    finalMessage = `Location: ${district}\nAddress: ${address}\nPhone: ${phone}\n\nTeacher Required: ${teacherGender}\n\n-- Student Information --\nTotal Students: ${studentCount}\n${studentDetailsText}\n-- Schedule & Remuneration --\nDays: ${days}\nTime: ${timeStr}\nDuration: ${duration}\nSalary: ${salary}`;
    if (specialReq) finalMessage += `\nSpecial Requirements: ${specialReq}`;

    formDataObj = {
        formType: 'guardian',
        District: district, Phone: phone, Address: address, Teacher_Gender: teacherGender,
        Preferred_Degree: preferredDegree, Preferred_Institution: preferredInstitution,
        Student_Count: studentCount, Student_Details: studentDetailsForSheet,
        Student_Classes: studentClassesRaw.join(','), Student_Subjects: studentSubjectsRaw.join(' | '),
        Student_Mediums: studentMediumsRaw.join(','), Student_Groups: studentGroupsRaw.join(','),
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

/* ---- পড়ানোর সময় (t_time) — "যেকোনো সময়" এক্সক্লুসিভ লজিক ---- */
const tTimeCheckboxes = document.querySelectorAll('input[name="t_time"]');
const tAnyTimeCb = document.getElementById('t-cb-anytime');
const tAnyTimeLabel = document.getElementById('t-lbl-anytime');

tTimeCheckboxes.forEach(cb => {
    cb.addEventListener('change', function() {
        if (this === tAnyTimeCb && this.checked) {
            tTimeCheckboxes.forEach(other => {
                if (other !== tAnyTimeCb) {
                    other.checked = false;
                    other.disabled = true;
                    other.parentElement.classList.add('disabled');
                }
            });
        } else if (this === tAnyTimeCb && !this.checked) {
            tTimeCheckboxes.forEach(other => {
                other.disabled = false;
                other.parentElement.classList.remove('disabled');
            });
        } else {
            let checkedCount = 0;
            tTimeCheckboxes.forEach(other => { if (other !== tAnyTimeCb && other.checked) checkedCount++; });
            if (checkedCount > 0) {
                tAnyTimeCb.checked = false;
                tAnyTimeCb.disabled = true;
                tAnyTimeLabel.classList.add('disabled');
            } else {
                tAnyTimeCb.disabled = false;
                tAnyTimeLabel.classList.remove('disabled');
            }
        }
    });
});

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

/* ---- Draft auto-save (টিচার) ---- */
const T_DRAFT_KEY = 'teacherDraft_v1';
const T_TEXT_FIELD_IDS = [
    't_name', 't_gender', 't_phone', 't_altphone', 't_target_district', 't_address',
    't_permanent_address', 't_locations', 't_status', 't_department', 't_session',
    't_institution', 't_institution_type', 't_degree_type', 't_ssc_group', 't_ssc_result',
    't_ssc_school', 't_hsc_group', 't_hsc_result', 't_hsc_college', 't_subjects', 't_experience_years'
];
const T_CHECKBOX_GROUPS = ['t_time', 't_classes', 't_mediums', 't_groups'];

function teacherCollectDraftData() {
    const data = { step: document.querySelector('#teacherFlow .step-panel.active')?.dataset.tstep || '1' };
    T_TEXT_FIELD_IDS.forEach(id => { data[id] = document.getElementById(id).value; });
    T_CHECKBOX_GROUPS.forEach(name => {
        data[name] = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
    });
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

    const tTimeArr = Array.from(document.querySelectorAll('input[name="t_time"]:checked')).map(cb => cb.value);
    const tClassesArr = Array.from(document.querySelectorAll('input[name="t_classes"]:checked')).map(cb => cb.value);
    const tMediumsArr = Array.from(document.querySelectorAll('input[name="t_mediums"]:checked')).map(cb => cb.value);
    const tGroupsArr = Array.from(document.querySelectorAll('input[name="t_groups"]:checked')).map(cb => cb.value);

    if (tTimeArr.length === 0) { alert('অনুগ্রহ করে পড়ানোর সময় নির্বাচন করুন।'); return; }
    if (tClassesArr.length === 0) { alert('অনুগ্রহ করে অন্তত একটা শ্রেণি নির্বাচন করুন।'); return; }
    if (tMediumsArr.length === 0) { alert('অনুগ্রহ করে অন্তত একটা মিডিয়াম নির্বাচন করুন।'); return; }

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
        const targetDistrict = get('t_target_district'), address = get('t_address'), permanentAddress = get('t_permanent_address');
        const locations = get('t_locations'), status = get('t_status');
        const department = get('t_department'), session = get('t_session'), institution = get('t_institution');
        const institutionType = get('t_institution_type'), degreeType = get('t_degree_type');
        const sscGroup = get('t_ssc_group'), sscResult = get('t_ssc_result'), sscSchool = get('t_ssc_school');
        const hscGroup = get('t_hsc_group'), hscResult = get('t_hsc_result'), hscCollege = get('t_hsc_college');
        const subjects = get('t_subjects'), experienceYears = normalizeDigits(get('t_experience_years'));
        const secondDocType = tSecondDocLabel.textContent;

        teacherFinalMessage =
            `📋 টিউটর সিভি\n\n` +
            `নাম: ${name}\nজেন্ডার: ${gender}\nফোন: ${phone}${altPhone ? ' / ' + altPhone : ''}\n` +
            `যে জেলায় টিউশন করাতে চান: ${targetDistrict}\nবর্তমান ঠিকানা: ${address}\nস্থায়ী ঠিকানা: ${permanentAddress}\n` +
            `টিউশনের এলাকা: ${locations}\nবর্তমান স্ট্যাটাস: ${status}\n\n` +
            `-- শিক্ষাগত যোগ্যতা --\nবিভাগ/সেশন: ${department} / ${session}\nপ্রতিষ্ঠান: ${institution} (${institutionType})\nডিগ্রী: ${degreeType}\n` +
            `এসএসসি: ${sscGroup}, ${sscResult}, ${sscSchool}\nএইচএসসি: ${hscGroup}, ${hscResult}, ${hscCollege}\n\n` +
            `-- পড়ানোর তথ্য --\nসময়: ${tTimeArr.join(', ')}\nশ্রেণি: ${tClassesArr.join(', ')}\nমিডিয়াম: ${tMediumsArr.join(', ')}\n` +
            `গ্রুপ: ${tGroupsArr.join(', ') || 'উল্লেখ নেই'}\nবিষয়: ${subjects}\nঅভিজ্ঞতা: ${experienceYears || '0'} বছর`;

        teacherFormDataObj = {
            formType: 'teacher',
            Name: name, Gender: gender, Phone: phone, Alt_Phone: altPhone,
            Target_District: targetDistrict, Address: address, Permanent_Address: permanentAddress,
            Locations: locations, Current_Status: status,
            Department: department, Session: session, Institution: institution,
            Institution_Type: institutionType, Degree_Type: degreeType,
            SSC_Group: sscGroup, SSC_Result: sscResult, SSC_School: sscSchool,
            HSC_Group: hscGroup, HSC_Result: hscResult, HSC_College: hscCollege,
            Available_Times: tTimeArr.join(', '), Teachable_Classes: tClassesArr.join(', '),
            Teachable_Mediums: tMediumsArr.join(', '), Teachable_Groups: tGroupsArr.join(', '),
            Subjects: subjects, Experience_Years: experienceYears,
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
