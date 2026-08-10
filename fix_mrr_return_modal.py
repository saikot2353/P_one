import os
import re

filepath = "src/routes/inv-issue-mrr-return.tsx"

with open(filepath, "r") as f:
    content = f.read()

# We need to extract the content inside `if (printIssue) { return ( ... ) }`
# and move it to the bottom of the main component return.

# The block starts at `  // FULL PAGE DETAILS VIEW (matches screenshot 3 perfectly)`
# and ends right before `  return (\n    <div className="min-h-screen flex bg-slate-50 text-foreground">`

start_marker = "  // FULL PAGE DETAILS VIEW (matches screenshot 3 perfectly)"
end_marker = "  return (\n    <div className=\"min-h-screen flex bg-slate-50 text-foreground\">\n      <InventorySidebar />"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    early_return_block = content[start_idx:end_idx]
    
    # Extract the inner JSX inside the <div className="p-4 md:p-6 flex-1 overflow-y-auto"> ... </div>
    # Actually, we can just grab everything from `              {/* Header */}` to `            </div>\n          </div>`
    
    doc_start_marker = "              {/* Header */}"
    doc_end_marker = "            </div>\n          </div>\n        </main>\n      </div>\n    );\n  }"
    
    inner_doc_start_idx = early_return_block.find(doc_start_marker)
    inner_doc_end_idx = early_return_block.find(doc_end_marker)
    
    if inner_doc_start_idx != -1 and inner_doc_end_idx != -1:
        inner_doc = early_return_block[inner_doc_start_idx:inner_doc_end_idx]
        # the inner_doc doesn't contain the closing `</div>` of the max-w-[1200px] container, so we append it
        inner_doc += "            </div>\n"
        
        # Now we wrap this inner_doc in the modal wrapper
        modal_jsx = """
      {/* Print Preview Modal */}
      {printIssue && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white text-black w-full max-w-5xl rounded-sm shadow-2xl relative my-auto border border-gray-300">
            
            {/* Print action bar (not printable) */}
            <div className="absolute top-0 inset-x-0 h-12 bg-gray-100 border-b border-gray-300 flex items-center justify-between px-4 print:hidden rounded-t-sm z-10">
              <div className="text-sm font-bold text-gray-700">Print Preview</div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="size-3.5" />
                  Print Document
                </button>
                <button 
                  onClick={() => setPrintIssue(null)} 
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Print Content */}
            <div className="p-8 sm:p-12 mt-12 print:mt-0 font-sans relative z-0">
""" + inner_doc + """          </div>
        </div>
      )}
"""
        # Remove the early return block from the content
        new_content = content[:start_idx] + content[end_idx:]
        
        # Inject the modal_jsx right before the final closing tag `    </div>\n  );\n}`
        inject_marker = "    </div>\n  );\n}"
        inject_idx = new_content.rfind(inject_marker)
        
        if inject_idx != -1:
            final_content = new_content[:inject_idx] + modal_jsx + new_content[inject_idx:]
            
            with open(filepath, "w") as f:
                f.write(final_content)
            print("Successfully rewritten as modal!")
        else:
            print("Could not find inject marker.")
    else:
        print("Could not find inner doc markers.")
else:
    print("Could not find start or end markers.")
