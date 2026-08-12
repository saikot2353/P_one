import re

file_path = "/Volumes/Office Files/1. Projects/criptonhris/src/routes/merchandising-pre-costing.tsx"

with open(file_path, "r") as f:
    content = f.read()

# Update unitPrice
content = content.replace('unitPrice: 3.15', 'unitPrice: 4.15')

# Update dyedYarnRows
dyed_yarn = """dyedYarnRows: [
    { id:1, style:"SS27PB093-SL", yarnInfo:"30/1 Combed", colour:"Verdant Green", shade:"Dark", quantity:1200, uom:"Kg", rate:3.50 }
  ],"""
content = re.sub(r'dyedYarnRows: \[\],', dyed_yarn, content)

# Update commissionPct
content = content.replace('commissionPct:0', 'commissionPct:1.5')

# Make sure styleFOBRow gets unitPrice 4.15
content = content.replace('unitPrice: 3.15, deliveryDate:', 'unitPrice: 4.15, deliveryDate:')

with open(file_path, "w") as f:
    f.write(content)

# Now fix Buyer Costing Sheet as well (merchandising-quotation.tsx)
file_path_q = "/Volumes/Office Files/1. Projects/criptonhris/src/routes/merchandising-quotation.tsx"
with open(file_path_q, "r") as f:
    content_q = f.read()

# add sample cost
content_q = content_q.replace(
    '{ id:3, name:"Commission",        unit:"Dzn", rate:0.12 },',
    '{ id:3, name:"Commission",        unit:"Dzn", rate:0.12 },\n  { id:4, name:"Sample Cost",       unit:"Dzn", rate:0.03 },'
)

# update budget summary calculation in merchandising-quotation.tsx
budget_calc_old = """                    const fComm = 0;
                    const gSpec = qtyDozen * C.gmt;
                    const hOth = qtyDozen * (C.oth + C.bank + C.com);
                    const iSamp = 0;"""

budget_calc_new = """                    const fCommRate = form.otherCostRows.find(r => r.name.toLowerCase() === "commission")?.rate || 0;
                    const fComm = qtyDozen * fCommRate;
                    const sampleRate = form.otherCostRows.find(r => r.name.toLowerCase().includes("sample"))?.rate || 0;
                    const iSamp = qtyDozen * sampleRate;
                    const gSpec = qtyDozen * C.gmt;
                    const hOth = qtyDozen * (C.oth - fCommRate - sampleRate + C.bank + C.com);"""

content_q = content_q.replace(budget_calc_old, budget_calc_new)

with open(file_path_q, "w") as f:
    f.write(content_q)

print("Done")
