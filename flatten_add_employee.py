import re

def process_file():
    with open("src/routes/add-employee.tsx", "r", encoding="utf-8") as f:
        lines = f.readlines()

    # We want to:
    # 1. Remove '{subSection === "primary_placement" && (' (and its closing)}
    # 2. Remove '{subSection === "address_contact" && (' (and its closing)}
    # 3. Extract '{activeTab === "personal_identity" && subSection === "emergency_contact" && (' block
    # 4. Extract '{activeTab === "personal_identity" && subSection === "references" && (' block
    # 5. Insert emergency and references blocks right after address_contact block
    # 6. Replace buttons with a single "Continue to Financial & Employment" button

    def find_block(start_marker, lines_arr):
        start_idx = -1
        for i, line in enumerate(lines_arr):
            if start_marker in line:
                start_idx = i
                break
        if start_idx == -1: return None, None, None
        
        # count braces to find end
        brace_count = 0
        end_idx = -1
        found_start = False
        
        for i in range(start_idx, len(lines_arr)):
            line = lines_arr[i]
            for char in line:
                if char == '{':
                    brace_count += 1
                    found_start = True
                elif char == '}':
                    brace_count -= 1
            if found_start and brace_count == 0:
                end_idx = i
                break
                
        return start_idx, end_idx, lines_arr[start_idx:end_idx+1]

    # Find primary placement
    start_1, end_1, block_1 = find_block('{subSection === "primary_placement" && (', lines)
    
    # Find address contact
    start_2, end_2, block_2 = find_block('{subSection === "address_contact" && (', lines)
    
    # Find emergency contact
    start_3, end_3, block_3 = find_block('{activeTab === "personal_identity" && subSection === "emergency_contact" && (', lines)
    
    # Find references
    start_4, end_4, block_4 = find_block('{activeTab === "personal_identity" && subSection === "references" && (', lines)
    
    if not (start_1 != -1 and start_2 != -1 and start_3 != -1 and start_4 != -1):
        print("Could not find all blocks")
        return

    # Let's clean the wrappers from blocks
    def clean_block(block, remove_last_buttons=True):
        # remove first line and last line
        cleaned = block[1:-1]
        if remove_last_buttons:
            # find where the flex flex-wrap items-center justify-between gap-4 pt-6 border-t start
            btn_idx = -1
            for i, line in enumerate(cleaned):
                if '<div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">' in line:
                    btn_idx = i
                    break
            if btn_idx != -1:
                # also need to remove closing </div> for the wrapper, which is just before btn_idx?
                # Actually, the block itself has a main wrapper <div className="space-y-3 animate-in fade-in duration-200">
                # which closes AFTER the buttons. So if we remove buttons, we must keep the closing </div>
                cleaned = cleaned[:btn_idx] + ["                  </div>\n"]
        return cleaned

    cleaned_1 = clean_block(block_1, True)
    cleaned_2 = clean_block(block_2, True)
    cleaned_3 = clean_block(block_3, True)
    
    # For references, we also remove the original buttons but we ADD the new final button
    cleaned_4 = clean_block(block_4, True)
    # Remove the last </div> we added in clean_block, so we can insert the new button before it
    cleaned_4.pop() 
    
    final_button = """                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20 mt-6">
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
                </div>\n"""
    
    cleaned_4.append(final_button)
    
    # We reconstruct the file.
    # 0 to start_1
    # cleaned_1
    # end_1+1 to start_2
    # cleaned_2
    # cleaned_3
    # cleaned_4
    # end_2+1 to start_3 (wait, there might be family_dependents between end_2 and start_3? No, start_3 is at 4495, which is after TAB 3.
    # Wait, the structure is:
    # 0 -> start_1
    # cleaned_1
    # end_1+1 -> start_2
    # cleaned_2
    # cleaned_3
    # cleaned_4
    # end_2+1 -> len(lines) EXCEPT we need to skip block_3 and block_4!
    
    # Let's create an array of keep lines
    keep_lines = []
    
    # Before start_1
    keep_lines.extend(lines[:start_1])
    keep_lines.extend(cleaned_1)
    keep_lines.extend(lines[end_1+1:start_2])
    keep_lines.extend(cleaned_2)
    keep_lines.extend(["                  {/* SUBSECTION: EMERGENCY CONTACT */}\n"])
    keep_lines.extend(cleaned_3)
    keep_lines.extend(["                  {/* SUBSECTION: REFERENCE */}\n"])
    keep_lines.extend(cleaned_4)
    
    # From end_2+1 onwards, but skipping block_3 and block_4
    idx = end_2 + 1
    while idx < len(lines):
        if idx == start_3:
            # Skip block 3
            # Wait, there's also the `{/* SUBSECTION: EMERGENCY CONTACT */}` comment just above start_3
            # We can just skip start_3 to end_3
            idx = end_3 + 1
            continue
        if idx == start_4:
            # Skip block 4
            idx = end_4 + 1
            continue
            
        # We also want to skip the `{/* SUBSECTION: EMERGENCY CONTACT */}` comments if they are at idx
        if "SUBSECTION: EMERGENCY CONTACT" in lines[idx] or "SUBSECTION: REFERENCE" in lines[idx]:
            idx += 1
            continue
            
        keep_lines.append(lines[idx])
        idx += 1

    with open("src/routes/add-employee.tsx", "w", encoding="utf-8") as f:
        f.writelines(keep_lines)
        
    print("Done")

process_file()
