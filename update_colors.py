import re

filepath = "src/routes/inv-dashboard.tsx"
with open(filepath, "r") as f:
    content = f.read()

# Update Category Data Colors
content = content.replace('color: "#3b82f6"', 'color: "#6366f1"') # Indigo
content = content.replace('color: "#10b981"', 'color: "#0ea5e9"') # Sky
content = content.replace('color: "#f59e0b"', 'color: "#f43f5e"') # Rose
content = content.replace('color: "#6366f1"', 'color: "#8b5cf6"') # Violet (original Hardware was 6366f1, so let's do regex to be safe)

# Regex for categoryData to be safe
content = re.sub(
    r'const categoryData = \[.*?\];',
    r'''const categoryData = [
  { name: "Stationary", value: 40, color: "#6366f1" },
  { name: "Electronics", value: 30, color: "#0ea5e9" },
  { name: "Raw Mat", value: 20, color: "#f43f5e" },
  { name: "Hardware", value: 10, color: "#8b5cf6" },
];''',
    content,
    flags=re.DOTALL
)

# Update Area Chart Colors
content = re.sub(r'stopColor="#ef4444"', 'stopColor="#f43f5e"', content) # Red -> Rose
content = re.sub(r'stroke="#ef4444"', 'stroke="#f43f5e"', content)
content = re.sub(r'stopColor="#10b981"', 'stopColor="#0ea5e9"', content) # Green -> Sky
content = re.sub(r'stroke="#10b981"', 'stroke="#0ea5e9"', content)

# Update Bar Chart Color
content = re.sub(r'fill="#3b82f6" radius=\[0, 4, 4, 0\] barSize=\{24\}', 'fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24}', content)

# Update Composed Chart Colors
content = re.sub(r'fill="#94a3b8" radius=\[4, 4, 0, 0\] name="Receipts"', 'fill="#bae6fd" radius={[4, 4, 0, 0]} name="Receipts"', content)
content = re.sub(r'fill="#334155" radius=\[4, 4, 0, 0\] name="Issues"', 'fill="#94a3b8" radius={[4, 4, 0, 0]} name="Issues"', content)
content = re.sub(r'stroke="#3b82f6" strokeWidth=\{3\} dot=\{\{r: 5, fill: \'#3b82f6\'\}\}', 'stroke="#6366f1" strokeWidth={3} dot={{r: 5, fill: \'#6366f1\'}}', content)

with open(filepath, "w") as f:
    f.write(content)
