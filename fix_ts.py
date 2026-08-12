import re

with open("src/routes/add-employee.tsx", "r") as f:
    content = f.read()

# Fix add-employee.tsx missing presHouseNo in the object
content = content.replace(
    'presVillageEng: "",\n          presVillageBng: "",\n          presRoad: "",',
    'presVillageEng: "",\n          presVillageBng: "",\n          presHouseNo: "",\n          presRoad: "",'
)

with open("src/routes/add-employee.tsx", "w") as f:
    f.write(content)

with open("src/routes/configure-structure.tsx", "r") as f:
    struct = f.read()

struct = struct.replace('activeTab === "department"', 'activeTab === "departments"')
struct = struct.replace('activeTab === "section"', 'activeTab === "sections"')
struct = struct.replace('activeTab === "unit"', 'activeTab === "units"')
struct = struct.replace('activeTab === "line"', 'activeTab === "lines"')

with open("src/routes/configure-structure.tsx", "w") as f:
    f.write(struct)

