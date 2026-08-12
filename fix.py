import re

with open("src/routes/financial-aid-list.tsx", "r") as f:
    content = f.read()

# Remove the rogue </main> at line 570
content = content.replace("      )}\n      </main>\n            </div>", "      )}\n            </div>")

# Add the correct </main> at the end, right before </div>\n  );\n}
content = content.replace("      )}\n    </div>\n  );\n}", "      )}\n        </main>\n    </div>\n  );\n}")

with open("src/routes/financial-aid-list.tsx", "w") as f:
    f.write(content)
