const fs = require('fs');
let content = fs.readFileSync('src/routes/-changes-data.ts', 'utf-8');
content = content.replace(/\r\n/g, '\n');

const newRecord = `  {
    "id": "533",
    "date": new Date().toISOString().slice(0, 16),
    "type": "New Feature",
    "module": "HR Reports (Separation List)",
    "link": "/hr-report-separation-list",
    "descriptionEn": "Implemented a new 'Separation List' report page in the HR Reports section, allowing users to view, filter, and export detailed employee separation records including designation, joining date, and action date.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন 'Separation List' রিপোর্ট পেজ যুক্ত করা হয়েছে, যেখান থেকে ব্যবহারকারীরা পদত্যাগ বা সেপারেশন হওয়া কর্মীদের বিস্তারিত তথ্য (পদবি, যোগদানের তারিখ, অ্যাকশন ডেট ইত্যাদি) দেখতে ও এক্সপোর্ট করতে পারবেন।"
  },
`;

if (content.includes('export const DEFAULT_CHANGE_RECORDS: ChangeRecord[] = [')) {
  content = content.replace('export const DEFAULT_CHANGE_RECORDS: ChangeRecord[] = [\n', 'export const DEFAULT_CHANGE_RECORDS: ChangeRecord[] = [\n' + newRecord);
  fs.writeFileSync('src/routes/-changes-data.ts', content, 'utf-8');
  console.log("Updated -changes-data.ts");
} else {
  console.log("Could not find insert point in -changes-data.ts");
}
