const fs = require("fs");
const path = require("path");

const srcDir = path.resolve(__dirname, "src");

const replacements = [
  ["bg-[#F9FAFB]", "bg-secondary"],
  ["bg-[#F8FAFC]", "bg-secondary"],
  ["bg-[#F3F4F6]", "bg-accent"],
  ["hover:bg-[#F3F4F6]", "hover:bg-accent"],
  ["hover:bg-[#F9FAFB]", "hover:bg-secondary"],
  ["bg-white", "bg-card"],
  ["border-[#E5E7EB]", "border-border"],
  ["border-[#E2E8F0]", "border-border"],
  ["divide-[#E5E7EB]", "divide-border"],
  ["divide-[#E2E8F0]", "divide-border"],
  ["text-[#111827]", "text-foreground"],
  ["text-[#0F172A]", "text-foreground"],
  ["text-[#1F2937]", "text-foreground"],
  ["text-[#374151]", "text-foreground"],
  ["text-[#6B7280]", "text-muted-foreground"],
  ["text-[#64748B]", "text-muted-foreground"],
  ["text-[#9CA3AF]", "text-muted-foreground"],
  ["text-[#94A3B8]", "text-muted-foreground"],
  ["placeholder-[#9CA3AF]", "placeholder-muted-foreground"],
  ["placeholder-[#94A3B8]", "placeholder-muted-foreground"],
  ["text-[#3B82F6]", "text-primary"],
  ["text-[#2563EB]", "text-primary"],
  ["bg-[#3B82F6]", "bg-primary"],
  ["bg-[#2563EB]", "bg-primary"],
  ["text-[#EF4444]", "text-destructive"],
  ["bg-[#EF4444]", "bg-destructive"],
  ["hover:bg-red-50", "hover:bg-destructive/10"],
  ["bg-red-50", "bg-destructive/10"],
  ["border-red-200", "border-destructive/30"],
  ["text-red-500", "text-destructive"],
  ["text-red-600", "text-destructive"],
  ["focus:ring-[#3B82F6]", "focus:ring-primary"],
  ["focus:ring-[#2563EB]/30", "focus:ring-primary/30"],
  ["focus:ring-[#2563EB]", "focus:ring-primary"],
  ["focus:border-[#3B82F6]", "focus:border-primary"],
  ["focus:border-[#2563EB]", "focus:border-primary"],
  ["from-[#3B82F6]", "from-primary"],
  ["to-[#6366F1]", "to-ring"],
  ["from-[#2563EB]", "from-primary"],
  ["to-[#7C3AED]", "to-ring"],
  ["hover:from-[#1D4ED8]", "hover:from-primary/90"],
  ["hover:to-[#6D28D9]", "hover:to-ring/90"],
  ["shadow-blue-500/25", "shadow-primary/25"],
  ["shadow-blue-500/40", "shadow-primary/40"],
  ["bg-[#1E293B]", "bg-secondary"],
  ["text-[#F8D7DA]", "text-destructive"],
  ["from-[#1E3A5F]", "from-gradient-from"],
  ["via-[#2563EB]", "via-primary"],
  ["bg-blue-50", "bg-primary/10"],
  ["text-blue-600", "text-primary"],
  ["text-blue-700", "text-primary"],
  ["border-blue-200", "border-primary/30"],
  ["bg-green-50", "bg-success/10"],
  ["text-green-600", "text-success"],
  ["text-green-700", "text-success"],
  ["border-green-200", "border-success/30"],
  ["bg-yellow-50", "bg-warning/10"],
  ["text-yellow-600", "text-warning"],
  ["text-yellow-700", "text-warning"],
  ["border-yellow-200", "border-warning/30"],
  ["bg-purple-50", "bg-primary/10"],
  ["text-purple-600", "text-primary"],
  ["text-purple-700", "text-primary"],
  ["ring-[#3B82F6]", "ring-primary"],
  ["ring-[#2563EB]", "ring-primary"],
];

function walkDir(dir, ext) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        if (file !== "node_modules") {
          results = results.concat(walkDir(filePath, ext));
        }
      } else if (filePath.endsWith(ext)) {
        results.push(filePath);
      }
    }
  } catch (e) {
    console.error("Error reading dir:", dir, e.message);
  }
  return results;
}

console.log("Searching in:", srcDir);
const files = walkDir(srcDir, ".jsx");
console.log("Found", files.length, "JSX files");

let totalUpdated = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Updated:", path.relative(srcDir, filePath));
    totalUpdated++;
  }
}

console.log("Total files updated:", totalUpdated);
