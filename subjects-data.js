// subjects-data.js — FINAL
// Structured data for cascading dropdowns (Medium -> Class -> Subjects)
//
// দ্রষ্টব্য: আগে ক্লাস একাধিক শ্রেণি একসাথে গ্রুপ করে দেখানো হতো (যেমন "৬ষ্ঠ - ৮ম শ্রেণি")।
// এখন প্রতিটা শ্রেণি আলাদা আলাদা অপশন হিসেবে দেখানো হয় (যেমন "৬ষ্ঠ শ্রেণি", "৭ম শ্রেণি", "৮ম শ্রেণি")।
// একই আগের গ্রুপের ভেতরের সব শ্রেণির বিষয়-তালিকা অভিন্ন রাখা হয়েছে।
// বাংলা মিডিয়াম (BM) ও ইংলিশ ভার্সন (NC)-এর শ্রেণির নামগুলো apps-script.gs-এর CLASS_LABELS
// ম্যাপ-এর মানগুলোর সাথে হুবহু মিলিয়ে রাখা হয়েছে, যাতে টিচার-ম্যাচিং সঠিকভাবে কাজ করে।

const SUBJECTS_DATA = {
  "বাংলা মিডিয়াম (BM)": {
    "প্রি-স্কুল": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "লোয়ার কেজি": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "নার্সারি": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "আপার কেজি": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "১ম শ্রেণি": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "২য় শ্রেণি": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "৩য় শ্রেণি": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "৪র্থ শ্রেণি": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "ধর্ম ও নৈতিক শিক্ষা", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "৫ম শ্রেণি": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "ধর্ম ও নৈতিক শিক্ষা", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "৬ষ্ঠ শ্রেণি": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "ধর্ম ও নৈতিক শিক্ষা", "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "৭ম শ্রেণি": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "ধর্ম ও নৈতিক শিক্ষা", "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "৮ম শ্রেণি": [
      "সকল বিষয়", "গণিত", "ইংরেজি", "বাংলা", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "ধর্ম ও নৈতিক শিক্ষা", "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান", "ড্রয়িং", "আরবি", "হাতের লেখা"
    ],
    "৯ম শ্রেণি": [
      "সাইন্স গ্রুপ", "কমার্স গ্রুপ", "আর্টস গ্রুপ", "গণিত", "ইংরেজি", "বাংলা", "সাধারণ বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "ধর্ম ও নৈতিক শিক্ষা", "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", "উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "হিসাববিজ্ঞান", "ফিন্যান্স ও ব্যাংকিং", "ব্যবসায় উদ্যোগ", "ইতিহাস", "ভূগোল ও পরিবেশ", "পৌরনীতি ও নাগরিকতা", "অর্থনীতি", "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান", "শারীরিক শিক্ষা"
    ],
    "১০ম শ্রেণি": [
      "সাইন্স গ্রুপ", "কমার্স গ্রুপ", "আর্টস গ্রুপ", "গণিত", "ইংরেজি", "বাংলা", "সাধারণ বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "ধর্ম ও নৈতিক শিক্ষা", "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", "উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "হিসাববিজ্ঞান", "ফিন্যান্স ও ব্যাংকিং", "ব্যবসায় উদ্যোগ", "ইতিহাস", "ভূগোল ও পরিবেশ", "পৌরনীতি ও নাগরিকতা", "অর্থনীতি", "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান", "শারীরিক শিক্ষা"
    ],
    "এসএসসি পরীক্ষার্থী": [
      "সাইন্স গ্রুপ", "কমার্স গ্রুপ", "আর্টস গ্রুপ", "গণিত", "ইংরেজি", "বাংলা", "সাধারণ বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "ধর্ম ও নৈতিক শিক্ষা", "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", "উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "হিসাববিজ্ঞান", "ফিন্যান্স ও ব্যাংকিং", "ব্যবসায় উদ্যোগ", "ইতিহাস", "ভূগোল ও পরিবেশ", "পৌরনীতি ও নাগরিকতা", "অর্থনীতি", "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান", "শারীরিক শিক্ষা"
    ],
    "একাদশ শ্রেণি": [
      "সাইন্স গ্রুপ", "কমার্স গ্রুপ", "আর্টস গ্রুপ", "উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "ইংরেজি", "বাংলা", "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", "হিসাববিজ্ঞান", "ফিন্যান্স ব্যাংকিং ও বিমা", "ব্যবসায় সংগঠন ও ব্যবস্থাপনা", "উৎপাদন ব্যবস্থাপনা ও বিপণন", "অর্থনীতি", "পৌরনীতি ও সুশাসন", "যুক্তিবিদ্যা", "সমাজবিজ্ঞান", "সমাজকর্ম", "ইতিহাস", "ইসলামের ইতিহাস ও সংস্কৃতি", "ভূগোল", "পরিসংখ্যান", "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান"
    ],
    "দ্বাদশ শ্রেণি": [
      "সাইন্স গ্রুপ", "কমার্স গ্রুপ", "আর্টস গ্রুপ", "উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "ইংরেজি", "বাংলা", "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", "হিসাববিজ্ঞান", "ফিন্যান্স ব্যাংকিং ও বিমা", "ব্যবসায় সংগঠন ও ব্যবস্থাপনা", "উৎপাদন ব্যবস্থাপনা ও বিপণন", "অর্থনীতি", "পৌরনীতি ও সুশাসন", "যুক্তিবিদ্যা", "সমাজবিজ্ঞান", "সমাজকর্ম", "ইতিহাস", "ইসলামের ইতিহাস ও সংস্কৃতি", "ভূগোল", "পরিসংখ্যান", "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান"
    ],
    "এইচএসসি পরীক্ষার্থী": [
      "সাইন্স গ্রুপ", "কমার্স গ্রুপ", "আর্টস গ্রুপ", "উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "ইংরেজি", "বাংলা", "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", "হিসাববিজ্ঞান", "ফিন্যান্স ব্যাংকিং ও বিমা", "ব্যবসায় সংগঠন ও ব্যবস্থাপনা", "উৎপাদন ব্যবস্থাপনা ও বিপণন", "অর্থনীতি", "পৌরনীতি ও সুশাসন", "যুক্তিবিদ্যা", "সমাজবিজ্ঞান", "সমাজকর্ম", "ইতিহাস", "ইসলামের ইতিহাস ও সংস্কৃতি", "ভূগোল", "পরিসংখ্যান", "কৃষি শিক্ষা", "গার্হস্থ্য বিজ্ঞান"
    ]
  },

  "ইংলিশ ভার্সন (NC)": {
    "প্রি-স্কুল": [
      "All Subjects", "Mathematics", "English", "Bangla", "Drawing", "Arabic", "Handwriting"
    ],
    "লোয়ার কেজি": [
      "All Subjects", "Mathematics", "English", "Bangla", "Drawing", "Arabic", "Handwriting"
    ],
    "নার্সারি": [
      "All Subjects", "Mathematics", "English", "Bangla", "Drawing", "Arabic", "Handwriting"
    ],
    "আপার কেজি": [
      "All Subjects", "Mathematics", "English", "Bangla", "Drawing", "Arabic", "Handwriting"
    ],
    "১ম শ্রেণি": [
      "All Subjects", "Mathematics", "English", "Bangla", "Drawing", "Arabic", "Handwriting"
    ],
    "২য় শ্রেণি": [
      "All Subjects", "Mathematics", "English", "Bangla", "Drawing", "Arabic", "Handwriting"
    ],
    "৩য় শ্রেণি": [
      "All Subjects", "Mathematics", "English", "Bangla", "Drawing", "Arabic", "Handwriting"
    ],
    "৪র্থ শ্রেণি": [
      "All Subjects", "Mathematics", "English", "Bangla", "Science", "Bangladesh and Global Studies (BGS)", "Religion", "Drawing", "Arabic", "Handwriting"
    ],
    "৫ম শ্রেণি": [
      "All Subjects", "Mathematics", "English", "Bangla", "Science", "Bangladesh and Global Studies (BGS)", "Religion", "Drawing", "Arabic", "Handwriting"
    ],
    "৬ষ্ঠ শ্রেণি": [
      "All Subjects", "Mathematics", "English", "Bangla", "Science", "Bangladesh and Global Studies (BGS)", "Religion", "ICT", "Agriculture", "Home Science", "Drawing", "Arabic", "Handwriting"
    ],
    "৭ম শ্রেণি": [
      "All Subjects", "Mathematics", "English", "Bangla", "Science", "Bangladesh and Global Studies (BGS)", "Religion", "ICT", "Agriculture", "Home Science", "Drawing", "Arabic", "Handwriting"
    ],
    "৮ম শ্রেণি": [
      "All Subjects", "Mathematics", "English", "Bangla", "Science", "Bangladesh and Global Studies (BGS)", "Religion", "ICT", "Agriculture", "Home Science", "Drawing", "Arabic", "Handwriting"
    ],
    "৯ম শ্রেণি": [
      "Science Group", "Commerce Group", "Arts Group", "General Math", "English", "Bangla", "General Science", "BGS", "Religion", "ICT", "Higher Math", "Physics", "Chemistry", "Biology", "Accounting", "Finance & Banking", "Business Entrepreneurship", "History", "Geography", "Civics & Citizenship", "Economics", "Agriculture", "Home Science", "Physical Education"
    ],
    "১০ম শ্রেণি": [
      "Science Group", "Commerce Group", "Arts Group", "General Math", "English", "Bangla", "General Science", "BGS", "Religion", "ICT", "Higher Math", "Physics", "Chemistry", "Biology", "Accounting", "Finance & Banking", "Business Entrepreneurship", "History", "Geography", "Civics & Citizenship", "Economics", "Agriculture", "Home Science", "Physical Education"
    ],
    "এসএসসি পরীক্ষার্থী": [
      "Science Group", "Commerce Group", "Arts Group", "General Math", "English", "Bangla", "General Science", "BGS", "Religion", "ICT", "Higher Math", "Physics", "Chemistry", "Biology", "Accounting", "Finance & Banking", "Business Entrepreneurship", "History", "Geography", "Civics & Citizenship", "Economics", "Agriculture", "Home Science", "Physical Education"
    ],
    "একাদশ শ্রেণি": [
      "Science Group", "Commerce Group", "Arts Group", "Higher Math", "Physics", "Chemistry", "Biology", "English", "Bangla", "ICT", "Accounting", "Finance, Banking & Insurance", "Business Organization & Management", "Production Management & Marketing", "Economics", "Civics & Good Governance", "Logic", "Sociology", "Social Work", "History", "Islamic History & Culture", "Geography", "Statistics", "Agriculture", "Home Science"
    ],
    "দ্বাদশ শ্রেণি": [
      "Science Group", "Commerce Group", "Arts Group", "Higher Math", "Physics", "Chemistry", "Biology", "English", "Bangla", "ICT", "Accounting", "Finance, Banking & Insurance", "Business Organization & Management", "Production Management & Marketing", "Economics", "Civics & Good Governance", "Logic", "Sociology", "Social Work", "History", "Islamic History & Culture", "Geography", "Statistics", "Agriculture", "Home Science"
    ],
    "এইচএসসি পরীক্ষার্থী": [
      "Science Group", "Commerce Group", "Arts Group", "Higher Math", "Physics", "Chemistry", "Biology", "English", "Bangla", "ICT", "Accounting", "Finance, Banking & Insurance", "Business Organization & Management", "Production Management & Marketing", "Economics", "Civics & Good Governance", "Logic", "Sociology", "Social Work", "History", "Islamic History & Culture", "Geography", "Statistics", "Agriculture", "Home Science"
    ]
  },

  "ইংলিশ মিডিয়াম (EM)": {
    "Play": [
      "All Subjects", "Mathematics", "English", "Science", "Phonics", "Art", "Handwriting"
    ],
    "Nursery": [
      "All Subjects", "Mathematics", "English", "Science", "Phonics", "Art", "Handwriting"
    ],
    "KG": [
      "All Subjects", "Mathematics", "English", "Science", "Phonics", "Art", "Handwriting"
    ],
    "Grade 1": [
      "All Subjects", "Mathematics", "English", "Science", "Phonics", "Art", "Handwriting"
    ],
    "Grade 2": [
      "All Subjects", "Mathematics", "English", "Science", "Phonics", "Art", "Handwriting"
    ],
    "Grade 3": [
      "All Subjects", "Mathematics", "English", "Science", "Phonics", "Art", "Handwriting"
    ],
    "Grade 4": [
      "All Subjects", "Mathematics", "English", "Science", "Geography", "History", "ICT", "Art"
    ],
    "Grade 5": [
      "All Subjects", "Mathematics", "English", "Science", "Geography", "History", "ICT", "Art"
    ],
    "Grade 6": [
      "All Subjects", "Mathematics", "English", "English Literature", "Science", "Geography", "History", "ICT", "French", "Spanish", "Art"
    ],
    "Grade 7": [
      "All Subjects", "Mathematics", "English", "English Literature", "Science", "Geography", "History", "ICT", "French", "Spanish", "Art"
    ],
    "Grade 8": [
      "All Subjects", "Mathematics", "English", "English Literature", "Science", "Geography", "History", "ICT", "French", "Spanish", "Art"
    ],
    "O Level / IGCSE (Grade 9 - 10)": [
      "Mathematics (Syllabus D)", "Pure Mathematics", "Additional Mathematics", "English Language", "English Literature", "Physics", "Chemistry", "Biology", "Human Biology", "Accounting", "Business Studies", "Economics", "Computer Science", "ICT", "Environmental Management", "Bengali"
    ],
    "A Level (Grade 11 - 12)": [
      "Mathematics", "Further Mathematics", "Physics", "Chemistry", "Biology", "Accounting", "Business", "Economics", "Computer Science", "IT", "English Language", "English Literature", "Psychology", "Law", "Sociology"
    ]
  },

  "মাদ্রাসা": {
    "ইবতেদায়ি ১ম শ্রেণি": [
      "সকল বিষয়", "কোরআন মাজিদ", "আরবি ১ম", "আরবি ২য়", "আকাইদ ও ফিকহ", "গণিত", "ইংরেজি", "বাংলা", "হাতের লেখা"
    ],
    "ইবতেদায়ি ২য় শ্রেণি": [
      "সকল বিষয়", "কোরআন মাজিদ", "আরবি ১ম", "আরবি ২য়", "আকাইদ ও ফিকহ", "গণিত", "ইংরেজি", "বাংলা", "হাতের লেখা"
    ],
    "ইবতেদায়ি ৩য় শ্রেণি": [
      "সকল বিষয়", "কোরআন মাজিদ", "আরবি ১ম", "আরবি ২য়", "আকাইদ ও ফিকহ", "গণিত", "ইংরেজি", "বাংলা", "হাতের লেখা"
    ],
    "ইবতেদায়ি ৪র্থ শ্রেণি": [
      "সকল বিষয়", "কোরআন মাজিদ", "আরবি ১ম", "আরবি ২য়", "আকাইদ ও ফিকহ", "গণিত", "ইংরেজি", "বাংলা", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়"
    ],
    "ইবতেদায়ি ৫ম শ্রেণি": [
      "সকল বিষয়", "কোরআন মাজিদ", "আরবি ১ম", "আরবি ২য়", "আকাইদ ও ফিকহ", "গণিত", "ইংরেজি", "বাংলা", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়"
    ],
    "দাখিল ৬ষ্ঠ শ্রেণি": [
      "সকল বিষয়", "কোরআন মাজিদ ও তাজভিদ", "আরবি ১ম", "আরবি ২য়", "আকাইদ ও ফিকহ", "গণিত", "ইংরেজি", "বাংলা", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "তথ্য ও যোগাযোগ প্রযুক্তি", "কৃষি শিক্ষা"
    ],
    "দাখিল ৭ম শ্রেণি": [
      "সকল বিষয়", "কোরআন মাজিদ ও তাজভিদ", "আরবি ১ম", "আরবি ২য়", "আকাইদ ও ফিকহ", "গণিত", "ইংরেজি", "বাংলা", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "তথ্য ও যোগাযোগ প্রযুক্তি", "কৃষি শিক্ষা"
    ],
    "দাখিল ৮ম শ্রেণি": [
      "সকল বিষয়", "কোরআন মাজিদ ও তাজভিদ", "আরবি ১ম", "আরবি ২য়", "আকাইদ ও ফিকহ", "গণিত", "ইংরেজি", "বাংলা", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "তথ্য ও যোগাযোগ প্রযুক্তি", "কৃষি শিক্ষা"
    ],
    "দাখিল ৯ম শ্রেণি": [
      "কোরআন মাজিদ ও তাজভিদ", "হাদিস শরিফ", "আরবি ১ম", "আরবি ২য়", "আকাইদ ও ফিকহ", "ইসলামের ইতিহাস", "গণিত", "ইংরেজি", "বাংলা", "সাধারণ বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "তথ্য ও যোগাযোগ প্রযুক্তি", "উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান"
    ],
    "দাখিল ১০ম শ্রেণি": [
      "কোরআন মাজিদ ও তাজভিদ", "হাদিস শরিফ", "আরবি ১ম", "আরবি ২য়", "আকাইদ ও ফিকহ", "ইসলামের ইতিহাস", "গণিত", "ইংরেজি", "বাংলা", "সাধারণ বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "তথ্য ও যোগাযোগ প্রযুক্তি", "উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান"
    ],
    "আলিম ১ম বর্ষ (একাদশ)": [
      "কোরআন মাজিদ", "হাদিস শরিফ", "ফিকহ ১ম", "ফিকহ ২য়", "আরবি ১ম", "আরবি ২য়", "ইসলামের ইতিহাস", "বাংলা", "ইংরেজি", "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", "পদার্থবিজ্ঞান", "রসায়ন", "উচ্চতর গণিত", "জীববিজ্ঞান", "বালাগত ও মানতিক"
    ],
    "আলিম ২য় বর্ষ (দ্বাদশ)": [
      "কোরআন মাজিদ", "হাদিস শরিফ", "ফিকহ ১ম", "ফিকহ ২য়", "আরবি ১ম", "আরবি ২য়", "ইসলামের ইতিহাস", "বাংলা", "ইংরেজি", "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", "পদার্থবিজ্ঞান", "রসায়ন", "উচ্চতর গণিত", "জীববিজ্ঞান", "বালাগত ও মানতিক"
    ]
  },

  "ভোকেশনাল/পলিটেকনিক": {
    "এসএসসি ভোকেশনাল ৯ম শ্রেণি": [
      "ট্রেড-১", "ট্রেড-২", "গণিত", "ইংরেজি", "বাংলা", "ধর্ম ও নৈতিক শিক্ষা", "পদার্থবিজ্ঞান", "রসায়ন", "কম্পিউটার অ্যাপ্লিকেশন", "আত্মকর্মসংস্থান ও ব্যবসায় উদ্যোগ", "ড্রয়িং"
    ],
    "এসএসসি ভোকেশনাল ১০ম শ্রেণি": [
      "ট্রেড-১", "ট্রেড-২", "গণিত", "ইংরেজি", "বাংলা", "ধর্ম ও নৈতিক শিক্ষা", "পদার্থবিজ্ঞান", "রসায়ন", "কম্পিউটার অ্যাপ্লিকেশন", "আত্মকর্মসংস্থান ও ব্যবসায় উদ্যোগ", "ড্রয়িং"
    ]
  }
};

// Helper functions for the frontend (cascading: Medium -> Class -> Subjects,
// same pattern as District -> Area in areas-data.js)

// Dropdown 1 options
function getMediums() {
  return Object.keys(SUBJECTS_DATA);
}

// Dropdown 2 options — dynamically populated based on the selected Medium
// (এখন প্রতিটা এন্ট্রি একটা নির্দিষ্ট, একক শ্রেণি — কোনো রেঞ্জ/গ্রুপ নয়)
function getClassGroupsForMedium(medium) {
  if (SUBJECTS_DATA[medium]) {
    return Object.keys(SUBJECTS_DATA[medium]);
  }
  return [];
}

// Dropdown 3 / chip picker options — dynamically populated based on the selected Class
function getSubjectsForClass(medium, classGroup) {
  if (SUBJECTS_DATA[medium] && SUBJECTS_DATA[medium][classGroup]) {
    return SUBJECTS_DATA[medium][classGroup];
  }
  return [];
}

/* ============================================================
   CLASS_RANGES — টিচার ফর্মের জন্য (গার্ডিয়ান ফর্মে প্রভাব নেই)
   প্রতি মিডিয়ামের ক্লাসগুলোকে কয়েকটা রেঞ্জে ভাগ করা, যাতে টিচারকে প্রতিটা
   ক্লাস আলাদা করে সিলেক্ট করতে না হয় — একটা রেঞ্জ সিলেক্ট করলেই সেই রেঞ্জের
   ভেতরের সব ক্লাস কভার হয়ে যায়, আর বিষয়ও একবারই (ইউনিক করে) সিলেক্ট করা যায়।
   freeText: true হলে ফিক্সড বিষয়-তালিকার বদলে একটা free-text ইনপুট দেখানো হয়
   (যেমন "এডমিশন টেস্ট" — এটা প্রকৃত কোনো ক্লাসের সাথে ম্যাপ হয় না, তাই
   Teachable_Classes/matching-এ যোগ হয় না, আলাদা ফিল্ড হিসেবে জমা হয়)
============================================================ */
const CLASS_RANGES = {
  "বাংলা মিডিয়াম (BM)": [
    { label: "প্রি স্কুল - ৫ম", classes: ["প্রি-স্কুল", "লোয়ার কেজি", "নার্সারি", "আপার কেজি", "১ম শ্রেণি", "২য় শ্রেণি", "৩য় শ্রেণি", "৪র্থ শ্রেণি", "৫ম শ্রেণি"] },
    { label: "৬ষ্ঠ - ৮ম", classes: ["৬ষ্ঠ শ্রেণি", "৭ম শ্রেণি", "৮ম শ্রেণি"] },
    { label: "৯ম - এসএসসি", classes: ["৯ম শ্রেণি", "১০ম শ্রেণি", "এসএসসি পরীক্ষার্থী"] },
    { label: "১১শ - এইচএসসি", classes: ["একাদশ শ্রেণি", "দ্বাদশ শ্রেণি", "এইচএসসি পরীক্ষার্থী"] },
    { label: "এডমিশন টেস্ট", freeText: true }
  ],
  "ইংলিশ ভার্সন (NC)": [
    { label: "প্রি স্কুল - ৫ম", classes: ["প্রি-স্কুল", "লোয়ার কেজি", "নার্সারি", "আপার কেজি", "১ম শ্রেণি", "২য় শ্রেণি", "৩য় শ্রেণি", "৪র্থ শ্রেণি", "৫ম শ্রেণি"] },
    { label: "৬ষ্ঠ - ৮ম", classes: ["৬ষ্ঠ শ্রেণি", "৭ম শ্রেণি", "৮ম শ্রেণি"] },
    { label: "৯ম - এসএসসি", classes: ["৯ম শ্রেণি", "১০ম শ্রেণি", "এসএসসি পরীক্ষার্থী"] },
    { label: "১১শ - এইচএসসি", classes: ["একাদশ শ্রেণি", "দ্বাদশ শ্রেণি", "এইচএসসি পরীক্ষার্থী"] },
    { label: "এডমিশন টেস্ট", freeText: true }
  ],
  "মাদ্রাসা": [
    { label: "প্রি স্কুল - ৫ম", classes: ["ইবতেদায়ি ১ম শ্রেণি", "ইবতেদায়ি ২য় শ্রেণি", "ইবতেদায়ি ৩য় শ্রেণি", "ইবতেদায়ি ৪র্থ শ্রেণি", "ইবতেদায়ি ৫ম শ্রেণি"] },
    { label: "৬ষ্ঠ - ৮ম", classes: ["দাখিল ৬ষ্ঠ শ্রেণি", "দাখিল ৭ম শ্রেণি", "দাখিল ৮ম শ্রেণি"] },
    { label: "৯ম - এসএসসি", classes: ["দাখিল ৯ম শ্রেণি", "দাখিল ১০ম শ্রেণি"] },
    { label: "১১শ - এইচএসসি", classes: ["আলিম ১ম বর্ষ (একাদশ)", "আলিম ২য় বর্ষ (দ্বাদশ)"] },
    { label: "এডমিশন টেস্ট", freeText: true }
  ],
  "ইংলিশ মিডিয়াম (EM)": [
    { label: "Play - Grade 3", classes: ["Play", "Nursery", "KG", "Grade 1", "Grade 2", "Grade 3"] },
    { label: "Grade 4-5", classes: ["Grade 4", "Grade 5"] },
    { label: "Grade 6-8", classes: ["Grade 6", "Grade 7", "Grade 8"] },
    { label: "O Level", classes: ["O Level / IGCSE (Grade 9 - 10)"] },
    { label: "A Level", classes: ["A Level (Grade 11 - 12)"] },
    { label: "Admission Test", freeText: true }
  ],
  "ভোকেশনাল/পলিটেকনিক": [
    { label: "৯ম - এসএসসি", classes: ["এসএসসি ভোকেশনাল ৯ম শ্রেণি", "এসএসসি ভোকেশনাল ১০ম শ্রেণি"] }
  ]
};

function getRangesForMedium(medium) {
  return CLASS_RANGES[medium] || [];
}

// একটা রেঞ্জের ভেতরের সব ক্লাসের বিষয়-তালিকা একত্র করে ডুপ্লিকেট বাদ দিয়ে
// একটামাত্র ইউনিক লিস্ট রিটার্ন করে (ক্রম প্রথম-উপস্থিতি অনুযায়ী রাখা হয়)
function getUniqueSubjectsForRange(medium, rangeLabel) {
  const range = getRangesForMedium(medium).find(r => r.label === rangeLabel);
  if (!range || !range.classes) return [];
  const seen = new Set();
  const result = [];
  range.classes.forEach(cls => {
    getSubjectsForClass(medium, cls).forEach(subj => {
      if (!seen.has(subj)) { seen.add(subj); result.push(subj); }
    });
  });
  return result;
}
