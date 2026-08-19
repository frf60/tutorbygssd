// Apps Script Web App URL (একই স্ক্রিপ্ট guardian ও teacher দুটো ফর্মই হ্যান্ডল করবে)
const scriptURL = 'https://script.google.com/macros/s/AKfycbxMa3MPH4oEyVfGrw4Iyr94SmuSJ6OxFrWK4ay57aTG5-i3f4Vmv55Co_bNRpw-mrcNmQ/exec';

/* ============================================================
   ROLE TABS
============================================================ */
const roleTabs = document.querySelectorAll('.role-tab');
const guardianFlow = document.getElementById('guardianFlow');
const teacherFlow = document.getElementById('teacherFlow');
const summarySection = document.getElementById('summarySection');

roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        roleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const role = tab.dataset.role;

        if (role === 'guardian') {
            guardianFlow.classList.add('active');
            teacherFlow.classList.remove('active');
        } else {
            teacherFlow.classList.add('active');
            guardianFlow.classList.remove('active');
            summarySection.classList.remove('active');
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
    progressSteps.forEach(step => {
        const n = Number(step.dataset.step);
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
    });
});

document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => goToStep(Number(btn.dataset.back)));
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
    }

    finalMessage = `Location: ${district}\nAddress: ${address}\nPhone: ${phone}\n\nTeacher Required: ${teacherGender}\n\n-- Student Information --\nTotal Students: ${studentCount}\n${studentDetailsText}\n-- Schedule & Remuneration --\nDays: ${days}\nTime: ${timeStr}\nDuration: ${duration}\nSalary: ${salary}`;
    if (specialReq) finalMessage += `\nSpecial Requirements: ${specialReq}`;

    formDataObj = {
        formType: 'guardian',
        District: district, Phone: phone, Address: address, Teacher_Gender: teacherGender,
        Student_Count: studentCount, Student_Details: studentDetailsForSheet,
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
    submitBtn.innerText = 'অপেক্ষা করুন...';

    const formData = new FormData();
    for (const key in formDataObj) formData.append(key, formDataObj[key]);

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(() => redirectToWhatsApp())
        .catch(error => { console.error('Error!', error.message); redirectToWhatsApp(); });
});

function redirectToWhatsApp() {
    const encodedMessage = encodeURIComponent(finalMessage);
    window.location.href = `https://wa.me/8801622505105?text=${encodedMessage}`;
}

/* ============================================================
   TEACHER REGISTRATION
============================================================ */
const teacherForm = document.getElementById('teacherForm');
const teacherSubmitBtn = document.getElementById('teacherSubmitBtn');

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // strip data:...;base64, prefix
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
setupUploadStatus('t_idcard', 't_idcard_status');

teacherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!teacherForm.checkValidity()) { teacherForm.reportValidity(); return; }

    teacherSubmitBtn.disabled = true;
    teacherSubmitBtn.innerText = 'আপলোড হচ্ছে, অপেক্ষা করুন...';

    try {
        const nidFile = document.getElementById('t_nid').files[0];
        const idCardFile = document.getElementById('t_idcard').files[0];
        const [nidBase64, idCardBase64] = await Promise.all([
            fileToBase64(nidFile),
            fileToBase64(idCardFile)
        ]);

        const name = document.getElementById('t_name').value;
        const phone = document.getElementById('t_phone').value;
        const address = document.getElementById('t_address').value;
        const department = document.getElementById('t_department').value;
        const session = document.getElementById('t_session').value;
        const institution = document.getElementById('t_institution').value;
        const sscInfo = document.getElementById('t_ssc').value;
        const hscInfo = document.getElementById('t_hsc').value;
        const experience = document.getElementById('t_experience').value;
        const subjects = document.getElementById('t_subjects').value;
        const locations = document.getElementById('t_locations').value;
        const altPhone = document.getElementById('t_altphone').value;

        const formData = new FormData();
        formData.append('formType', 'teacher');
        formData.append('Name', name);
        formData.append('Phone', phone);
        formData.append('Address', address);
        formData.append('Department', department);
        formData.append('Session', session);
        formData.append('Institution', institution);
        formData.append('SSC_Info', sscInfo);
        formData.append('HSC_Info', hscInfo);
        formData.append('Experience', experience);
        formData.append('Subjects_Classes', subjects);
        formData.append('Locations', locations);
        formData.append('Alt_Phone', altPhone);
        formData.append('NID_Base64', nidBase64);
        formData.append('NID_Filename', nidFile.name);
        formData.append('NID_MimeType', nidFile.type);
        formData.append('IDCard_Base64', idCardBase64);
        formData.append('IDCard_Filename', idCardFile.name);
        formData.append('IDCard_MimeType', idCardFile.type);

        teacherSubmitBtn.innerText = 'রিডাইরেক্ট করা হচ্ছে...';

        const teacherMessage = `টিচার রেজিস্ট্রেশন\n\nনাম: ${name}\nফোন: ${phone}\nঠিকানা: ${address}\nপ্রতিষ্ঠান: ${institution}\nবিভাগ/সেশন: ${department} / ${session}\nএসএসসি: ${sscInfo}\nএইচএসসি: ${hscInfo}\nঅভিজ্ঞতা: ${experience}\nবিষয়/ক্লাস: ${subjects}\nলোকেশন: ${locations}\nবিকল্প নম্বর: ${altPhone}`;

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(() => redirectTeacherToWhatsApp(teacherMessage))
            .catch(err => { console.error('Teacher save error:', err); redirectTeacherToWhatsApp(teacherMessage); });

    } catch (err) {
        console.error('Teacher submit error:', err);
        teacherSubmitBtn.disabled = false;
        teacherSubmitBtn.innerText = 'রেজিস্ট্রেশন সম্পন্ন করুন';
        alert('দুঃখিত, একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
});

function redirectTeacherToWhatsApp(message) {
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/8801622505105?text=${encodedMessage}`;
}

