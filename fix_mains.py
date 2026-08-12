import re

with open("src/routes/financial-aid-list.tsx", "r") as f:
    content = f.read()

# Remove any </main> anywhere
content = content.replace("      </main>\n", "")
content = content.replace("        </main>\n", "")

# Add it back to the very end properly
content = content.replace("      )}\n    </div>\n  );\n}", "      )}\n      </main>\n    </div>\n  );\n}")

with open("src/routes/financial-aid-list.tsx", "w") as f:
    f.write(content)
