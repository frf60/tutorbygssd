# গৃহশিক্ষক/শিক্ষিকা দিচ্ছি — Website (Modern Redesign)

## এই আপডেটে যা করা হয়েছে

**Design:**
- সম্পূর্ণ নতুন visual system — গভীর সবুজ (গার্ডিয়ান) + সোনালি (টিচার) রঙ, "Baloo Da 2" + "Hind Siliguri" ফন্ট
- হেডারে খাতার মার্জিন-লাইন motif — বিষয়ের সাথে সামঞ্জস্যপূর্ণ visual signature
- Top-এ দুটো clear tab: **টিউটর খুঁজছি (অভিভাবক)** vs **আমি পড়াতে চাই (টিচার)** — যিনি যেটা দরকার শুধু সেটাই দেখবেন

**গার্ডিয়ানের জন্য সহজীকরণ:**
- ফর্মটি এখন ৩-ধাপের wizard: (১) যোগাযোগ (২) শিক্ষার্থীর তথ্য (৩) সময়সূচী ও বাজেট
- Progress indicator — কোন ধাপে আছেন স্পষ্ট দেখা যায়
- প্রতি ধাপে শুধু প্রাসঙ্গিক ফিল্ড, তাই একসাথে অনেক কিছু দেখতে হয় না

**টিচার রেজিস্ট্রেশন (নতুন, সম্পূর্ণ ফ্রি):**
- আগে external Google Form-এর লিংক ছিল, এখন সাইটের ভিতরেই নেটিভ ফর্ম
- আপনার দেওয়া টেমপ্লেট অনুযায়ী সব ফিল্ড (নাম, ঠিকানা, বিভাগ, সেশন, প্রতিষ্ঠান, এসএসসি/এইচএসসি তথ্য, অভিজ্ঞতা, বিষয়, লোকেশন)
- NID/জন্মনিবন্ধন ও ID কার্ডের ছবি আপলোড — সরাসরি Google Drive-এ সেভ হয়, লিংক Sheet-এ যায়
- সব তথ্য automatically **Teachers** নামের আলাদা শিটে জমা হয়, status='Pending' দিয়ে (আপনি ম্যানুয়ালি রিভিউ করে 'Active' করবেন)

## Setup (আপনার করণীয়)

### ১. Apps Script backend আপডেট করুন
1. আপনার Google Sheet খুলুন → Extensions → Apps Script
2. পুরনো কোড মুছে `apps-script.gs`-এর সম্পূর্ণ কোড পেস্ট করুন
3. Deploy → Manage deployments → পুরনো deployment এডিট করুন (অথবা নতুন deployment করলে `script.js`-এ URL আপডেট করতে হবে)
4. **Execute as:** Me, **Who has access:** Anyone
5. Deploy করার সময় Google আপনাকে Drive access অনুমতি চাইবে (ফাইল সেভ করার জন্য প্রয়োজন) — অনুমতি দিন
6. প্রথমবার deploy/test করার সময় Sheet-এ automatically দুটো ট্যাব তৈরি হবে: **Guardians** ও **Teachers**

### ২. URL গুলো আপডেট করুন
- `index.html`-এ ২ জায়গায় `your-domain-or-username.github.io/repo-name/` — আপনার আসল GitHub Pages URL দিন
- `script.js`-এ `scriptURL` — যদি নতুন deployment URL হয়, সেটা বসান (পুরনো URL এডিট করলে বদলাতে হবে না)

### ৩. GitHub-এ push ও Pages enable করুন

## ফাইল তালিকা
- `index.html`, `style.css`, `script.js` — ফ্রন্টএন্ড
- `apps-script.gs` — ব্যাকএন্ড (Google Apps Script-এ পেস্ট করার জন্য)
- `robots.txt`, `sitemap.xml` — SEO (আগের মতোই)

## পরের ধাপ (ভবিষ্যতে চাইলে)
- OCR দিয়ে NID/ID কার্ড অটো-ভেরিফিকেশন
- GitHub Actions দিয়ে auto-deploy + minify
- Teacher status='Active' হলে guardian-এর সাথে ম্যাচিং (এটা আলাদা প্রজেক্ট, WhatsApp/email ভিত্তিক হতে পারে খরচ ছাড়াই যদি ম্যানুয়াল করেন)
