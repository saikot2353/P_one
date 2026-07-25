const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/routes/personnel-list.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Find the Personnel Operations block
const startStr = '          {/* Personnel Operations & Document Hub */}';
const startIndex = content.indexOf(startStr);

if (startIndex === -1) {
  console.log("Could not find start of Personnel Operations");
  process.exit(1);
}

// We need to find the end of this block. It ends with a </div> followed by empty line and {/* Data Grid Card Container */}
const endStrMarker = '          {/* Data Grid Card Container */}';
const endIndexMarker = content.indexOf(endStrMarker, startIndex);

if (endIndexMarker === -1) {
  console.log("Could not find end marker of Personnel Operations");
  process.exit(1);
}

// The block ends right before the Data Grid container.
// It looks like:
//           </div>
//
//           {/* Data Grid Card Container */}
// So we find the closing div before Data Grid Card Container
const blockEnd = content.lastIndexOf('          </div>\n\n          {/* Data Grid Card Container */}', endIndexMarker + endStrMarker.length);

if (blockEnd === -1) {
  console.log("Could not find exact block end");
  process.exit(1);
}

// The complete operations block includes that closing div:
const operationsBlock = content.substring(startIndex, blockEnd + 16); // +16 for '          </div>'

// Remove it from the original place
let newContent = content.substring(0, startIndex) + content.substring(blockEnd + 18); // +18 to skip \n\n

// Now we need to insert the wrapper.
// Find Collapsible Advanced Filters Section
const filterStr = '          {/* Collapsible Advanced Filters Section */}';
const filterIndex = newContent.indexOf(filterStr);

const wrapperStart = `          {/* SPLIT LAYOUT WRAPPER */}
          <div className="flex flex-col xl:flex-row gap-4 items-start w-full">
            {/* Left side (Filters and Table) */}
            <div className={\`flex-1 min-w-0 flex flex-col gap-4 transition-all duration-300 \${selectedEmpIds.length > 0 ? "w-full xl:w-[75%]" : "w-full"}\`}>
`;

newContent = newContent.substring(0, filterIndex) + wrapperStart + newContent.substring(filterIndex);

// Now find the end of Data Grid Card Container. 
// It ends right before:
//             {/* Bottom Footer Info */}
// ...
//           </div>
//         </div>
//
//         {/* Column Arrangement Modal */}
const columnModalStr = '        {/* Column Arrangement Modal */}';
const columnModalIndex = newContent.indexOf(columnModalStr);

// The div that closes the main content is right before columnModalStr.
// It looks like:
//           </div>
//         </div>
//
//         {/* Column Arrangement Modal */}

const mainContentEndIndex = newContent.lastIndexOf('        </div>\n\n        {/* Column Arrangement Modal */}', columnModalIndex + columnModalStr.length);

// We need to insert the closing tags for the left column, then the right column (Operations block restructured), then close the wrapper.
// First, we need to adapt the Operations Block to fit the sidebar.
// Originally:
// {/* Personnel Operations & Document Hub */}
// <div className="bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300">
// ...
// </div>
// It used xl:grid-cols-12, xl:col-span-8, xl:col-span-4. We need to remove those responsive classes or change them to stacked since it's in a narrow sidebar.
let sidebarBlock = operationsBlock;
sidebarBlock = sidebarBlock.replace(/grid grid-cols-1 xl:grid-cols-12 gap-5/g, 'flex flex-col gap-5');
sidebarBlock = sidebarBlock.replace(/xl:col-span-8/g, 'w-full');
sidebarBlock = sidebarBlock.replace(/xl:col-span-4/g, 'w-full');
sidebarBlock = sidebarBlock.replace(/grid grid-cols-1 md:grid-cols-3 gap-4/g, 'flex flex-col gap-4'); // Make columns stacked in sidebar
// Replace the empty state to not show, or just wrap the sidebar rendering in selectedEmpIds.length > 0
sidebarBlock = `
            {/* Right Column (Sidebar) */}
            {selectedEmpIds.length > 0 && (
              <div className="w-full xl:w-[25%] shrink-0 sticky top-4 animate-in slide-in-from-right-4 duration-300 space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
      ` + sidebarBlock.replace(/\{selectedEmpIds\.length === 0 \? \([\s\S]*?\) : \(/, '') // Remove empty state rendering
                     .replace(/<\/div>\n          <\/div>\n        \)}/, '</div>\n          </div>') + `
              </div>
            )}
`;

// Wait, the regex replace for the empty state condition:
// `{selectedEmpIds.length === 0 ? ( ... ) : (`
// This is fragile. Let's just wrap the WHOLE operations block as it is. If it renders the empty state, it will just show the info box in the sidebar, which is fine! Or since we only render the sidebar when > 0, the empty state will NEVER trigger inside the sidebar anyway because we wrap it in `selectedEmpIds.length > 0`.
// Let's use the original Operations Block without fragile regex for the ternary condition.
let robustSidebar = `
            {/* Right Column (Sidebar) */}
            {selectedEmpIds.length > 0 && (
              <div className="w-full xl:w-[25%] shrink-0 sticky top-4 animate-in slide-in-from-right-4 duration-300 space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto pb-4">
                ${operationsBlock.replace(/grid grid-cols-1 xl:grid-cols-12 gap-5/g, 'flex flex-col gap-5')
                                .replace(/xl:col-span-8/g, 'w-full')
                                .replace(/xl:col-span-4/g, 'w-full')
                                .replace(/grid grid-cols-1 md:grid-cols-3 gap-4/g, 'flex flex-col gap-3')}
              </div>
            )}
`;


const closingWrapper = `
            </div> {/* End Left Column */}
${robustSidebar}
          </div> {/* End Split Layout Wrapper */}
`;

// We insert closingWrapper right before the closing div of the Main Content Area (which is at mainContentEndIndex + 10)
// wait, mainContentEndIndex is the start of `        </div>`
newContent = newContent.substring(0, mainContentEndIndex) + closingWrapper + newContent.substring(mainContentEndIndex);

fs.writeFileSync(filePath, newContent);
console.log("Refactoring complete!");
