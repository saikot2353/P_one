import re

file_path = "src/routes/add-employee.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove {subSection === "primary_placement" && (
content = content.replace('{subSection === "primary_placement" && (', '')

# 2. Remove the buttons at the end of primary_placement and the closing )}
primary_placement_end = """                      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              toast.success("Progress saved. Exiting...");
                              window.location.href = "/";
                            }}
                            className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                          >
                            Save and Exit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              toast.success("Progress saved as draft successfully!");
                            }}
                            className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                          >
                            Save as Draft
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSubSection("address_contact");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Next Section <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}"""

content = content.replace(primary_placement_end, '                    </div>\n')

# 3. Remove {subSection === "address_contact" && (
content = content.replace('{subSection === "address_contact" && (', '')

# 4. Extract Emergency Contact block
emergency_regex = re.compile(r'\{\s*/\*\s*SUBSECTION: EMERGENCY CONTACT\s*\*/\s*\}.*?\{activeTab === "personal_identity" && subSection === "emergency_contact" && \(\s*(.*?)\s*\)\}', re.DOTALL)
emergency_match = emergency_regex.search(content)
if emergency_match:
    emergency_content = emergency_match.group(1)
    # Remove the buttons from emergency_content
    emergency_buttons = """                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved. Exiting...");
                          window.location.href = "/";
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save and Exit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved as draft successfully!");
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save as Draft
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSubSection("references");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Next Section <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>"""
    emergency_content = emergency_content.replace(emergency_buttons, '                </div>')
    # Remove original block from file
    content = content[:emergency_match.start()] + content[emergency_match.end():]
else:
    print("Emergency contact not found")
    emergency_content = ""

# 5. Extract References block
references_regex = re.compile(r'\{\s*/\*\s*SUBSECTION: REFERENCE\s*\*/\s*\}.*?\{activeTab === "personal_identity" && subSection === "references" && \(\s*(.*?)\s*\)\}', re.DOTALL)
references_match = references_regex.search(content)
if references_match:
    references_content = references_match.group(1)
    
    references_buttons = """                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved. Exiting...");
                          window.location.href = "/";
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save and Exit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved as draft successfully!");
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save as Draft
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("financial_employment");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Continue to Financial & Employment <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>"""
                
    references_buttons2 = """                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved. Exiting...");
                          window.location.href = "/";
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save and Exit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success("Progress saved as draft successfully!");
                        }}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save as Draft
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("personal_identity");
                        setSubSection("references");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Next Section <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>"""
                
    references_content = references_content.replace(references_buttons, '                </div>')
    references_content = references_content.replace(references_buttons2, '                </div>')
    
    # Remove original block from file
    content = content[:references_match.start()] + content[references_match.end():]
else:
    print("References not found")
    references_content = ""


# 6. Insert emergency and references before address_contact ends
address_contact_end = """                      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              toast.success("Progress saved. Exiting...");
                              window.location.href = "/";
                            }}
                            className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                          >
                            Save and Exit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              toast.success("Progress saved as draft successfully!");
                            }}
                            className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                          >
                            Save as Draft
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSubSection("emergency_contact");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Next Section <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}"""

new_end = f"""
                  {{/* SUBSECTION: EMERGENCY CONTACT */}}
                  {emergency_content}
                  
                  {{/* SUBSECTION: REFERENCE */}}
                  {references_content}
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={{() => {{
                          toast.success("Progress saved. Exiting...");
                          window.location.href = "/";
                        }}}}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save and Exit
                      </button>
                      <button
                        type="button"
                        onClick={{() => {{
                          toast.success("Progress saved as draft successfully!");
                        }}}}
                        className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted/50 transition duration-200"
                      >
                        Save as Draft
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={{() => {{
                        setActiveTab("financial_employment");
                        window.scrollTo({{ top: 0, behavior: "smooth" }});
                      }}}}
                      className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Continue to Financial & Employment <ArrowRight className="size-4" />
                    </button>
                  </div>
                    </div>
"""

content = content.replace(address_contact_end, new_end)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
