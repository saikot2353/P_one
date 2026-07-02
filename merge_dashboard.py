import os

# 1. Read current modified file (which has the redesigned overview and animated background)
with open('src/routes/my-dashboard.tsx', 'r') as f:
    current_lines = f.readlines()

# Extract the animated background OR just extract the whole <main> ... </main>?
# Wait, the current file is:
# import { Sidebar } ...
# ...
# export default function MyDashboard() {
#   return (
#     <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
#       <Sidebar />
#       <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden bg-background">
#         {/* Animated Background Orbs */}
#         ...
#         <Topbar />
#         <div className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 space-y-6 bg-transparent relative z-10">
#           ... redesigned overview ...
#         </div>
#       </main>
#     </div>
#   );
# }

# In head-my-dashboard.tsx, the structure was:
# ... custom Sidebar ...
#       <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden bg-muted/20">
#         <Topbar />
#         {activeUrl === '__overview__' ? (
#           /* Main Dashboard Overview Area */
#           <div className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 space-y-6 bg-background">
#              ... old overview ...
#           </div>
#         ) : activeUrl === '__config__' || activeUrl === null ? (

# So from current file, we extract the background orbs and the redesigned overview.
bg_orbs = []
in_orbs = False
for line in current_lines:
    if '{/* Animated Background Orbs */}' in line:
        in_orbs = True
    if in_orbs:
        bg_orbs.append(line)
        if '</div>' in line and len(bg_orbs) >= 5: # Ends after the 3 divs
            break

overview = []
in_overview = False
for line in current_lines:
    if 'className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 space-y-6 bg-transparent relative z-10"' in line:
        in_overview = True
    if in_overview:
        if '</main>' in line:
            break
        overview.append(line)

# Trim trailing whitespace/newlines if any, and remove the last </div> if it was closing main instead of the overview container
# Wait, if overview stops before </main>, it includes the closing </div> of the overview container.

# 2. Read head-my-dashboard.tsx
with open('head-my-dashboard.tsx', 'r') as f:
    original_lines = f.readlines()

new_content = []
skip_overview = False

for i, line in enumerate(original_lines):
    if '<main className="flex-1 min-w-0 flex flex-col relative overflow-hidden bg-muted/20">' in line:
        # Change background to bg-background
        new_content.append(line.replace('bg-muted/20', 'bg-background'))
        # Insert background orbs
        new_content.extend(bg_orbs)
        continue
    
    if '/* Main Dashboard Overview Area */' in line:
        new_content.append(line)
        # We start skipping until the next condition
        skip_overview = True
        # Insert the redesigned overview
        new_content.extend(overview)
        continue
        
    if ") : activeUrl === '__config__' || activeUrl === null ? (" in line:
        skip_overview = False
        
    if not skip_overview:
        new_content.append(line)

with open('src/routes/my-dashboard.tsx', 'w') as f:
    f.writelines(new_content)

print("Merge successful!")
