## System Changes Tracking Rule
DEPRECATED / DISABLED: Do NOT track, append, or add changes to `src/routes/changes.tsx` or `src/routes/-changes-data.ts`. All previous records must remain as they are, but no new changes or version bumps should be automatically added moving forward.

---

## Merchandising Module Granular Modification Tracking Rule (Effective: 13 October 2026)
**MANDATORY FOR ALL AGENT WORK**:
Starting from **13 October 2026**, whenever ANY modification, UI enhancement, bug fix, logic change, or new feature is implemented in the **Merchandising Module** (`src/routes/merchandising-*`, `src/components/merchandising/*`):

1. **PAIR PROGRAMMING & COLLABORATIVE OBJECTIVE**:
   - The user (developer) established the original baseline codebase up to **13 October 2026**.
   - The user and agent are now working together as a pair programming duo.
   - **PRIMARY OBJECTIVE**: Track feature-by-feature how much has been modified/enhanced by the duo on top of what the user originally built.
   - **STRICTLY NO RESET**: There must be NO option or mechanism to reset tracking data. All modification percentages and revision history are permanent, cumulative, and continuous.

2. **STRICT TARGET SCOPE**:
   - This tracking rule applies **EXCLUSIVELY to the Merchandising Module**.
   - Do **NOT** track changes for HR, Payroll, Inventory, Procurement, SSP, or any other modules.
   - Do **NOT** write to `src/routes/changes.tsx` or `src/routes/-changes-data.ts` (those remain strictly deprecated).

3. **GRANULAR TRACKING PER MENU & SUB-MENU (84 ITEMS)**:
   - Track every single sidebar menu, sub-group, sub-menu, and tab individually without missing any (e.g. MM Settings subgroups & tabs, Capacity sub-items, Order Management parts/tabs, Work Orders, 24 Report tabs, etc.).
   - All 84 tracked items are cataloged in `src/routes/-mm-route-catalog.ts` in the `DEFAULT_MERCHANDISING_PAGES` array.

4. **MANDATORY TRACKING ACTION**:
   - Whenever any page, tab, or component within Merchandising is modified, the agent **MUST** immediately update `src/routes/-mm-route-catalog.ts` for the affected item(s):
     - **`modificationPercent`**: Increase or update the cumulative percentage of modification for that item relative to the user's initial baseline (0% to 100%).
     - **`status`**: Update to `"Modified"`, `"In Progress"`, or `"Completed"` (when 100%).
     - **`lastModified`**: Set to the current date (e.g., `"2026-10-13"`).
     - **`totalRevisions`**: Increment by 1.
     - **`changeHistory`**: Append a new entry to the item's `changeHistory` array:
       ```ts
       {
         id: "chg-" + Date.now(),
         date: "2026-10-13 HH:mm",
         type: "Feature" | "UI Enhancement" | "Bug Fix" | "Logic Update" | "Refactor",
         description: "Detailed description of the modification made on top of user's work for this sub-menu/feature",
         percentDelta: 10, // The percentage points added by this change
       }
       ```

5. **HIDDEN AUDIT INTERFACE (`/shapnocheck`)**:
   - **DO NOT put the modification tracker in the sidebar**. It is strictly a **HIDDEN MENU**.
   - **NO RESET OPTION**: The interface contains no reset button or reset mechanism.
   - Accessible ONLY via manual browser URL input:
     - Route: `/shapnocheck`
     - Component: `src/routes/shapnocheck.tsx`
     - Data file: `src/routes/-mm-route-catalog.ts`
   - The user manually types `/shapnocheck` in the address bar to inspect modification % and revision logs for every menu and sub-menu.
