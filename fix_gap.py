import re

file_path = "/Volumes/Office Files/1. Projects/criptonhris/src/routes/merchandising-quotation.tsx"

with open(file_path, "r") as f:
    content = f.read()

# Remove justify-between from left and right column
content = content.replace(
    'className="col-span-12 lg:col-span-7 flex flex-col justify-between space-y-4"',
    'className="col-span-12 lg:col-span-7 flex flex-col space-y-4"'
)

content = content.replace(
    'className="col-span-12 lg:col-span-5 flex flex-col justify-between space-y-4"',
    'className="col-span-12 lg:col-span-5 flex flex-col space-y-4"'
)

with open(file_path, "w") as f:
    f.write(content)
print("Done")
