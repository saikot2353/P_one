# IE Recruitment Module: Comprehensive Field-by-Field and Step-by-Step User Manual

This user manual provides detailed, step-by-step instructions and comprehensive reference tables describing every page, section, input field, dropdown, check box, and button within the IE Recruitment module of the CRIPTON HRIS application. Emojis and icons have been excluded to maintain a professional, plain-text format.

---

## Chapter 1: IE Recruitment Basic Setup (System Rules Configuration)

### 1.1 Navigation Path

Open the left sidebar menu, locate the Configuration group, and click on **IE Recruitment Basic Setup** (URL: `/recruitment-basic-setup`).

### 1.2 Screen Elements Reference (Field-by-Field & Button-by-Button)

#### 1.2.1 Configuration Form Fields

- **Basic Form is Applicable**: Dropdown select field. Options: `Yes` or `No`. When set to `Yes`, candidate registration is enforced before any assessment can occur.
- **Assessment is Applicable**: Dropdown select field. Options: `Yes` or `No`. When set to `Yes`, candidates must pass through both the Industrial Engineering (IE) and Human Resources (HR) assessment workflows. When set to `No`, candidates bypass assessments and can be onboarded directly into the personnel database.
- **Prefix**: Text input field. Restricts values to alphanumeric characters (e.g., `PAL`). This string acts as the prefix for candidate temporary IDs.
- **No of Digit**: Dropdown select field. Options include `3`, `4`, `5`, `6`, `7`, `8`. Determines the digit padding length of the generated candidate IDs. For example, a Prefix of `PAL` and `6` digits will generate IDs sequentially: `PAL000001`, `PAL000002`, and so forth.
- **Configure Category**: Checkbox group. Options: `Worker`, `Staff`, `Executive`. Determines which employee categories are governed by the Prefix and ID generation rules configured on this screen. Multiple categories can be checked.

#### 1.2.2 Form Buttons

- **Save Settings**: Button located at the bottom center of the configuration card. On click, the system validates all selections, saves the configuration values to the local settings repository, and displays a success notification.

---

### 1.3 Step-by-Step Procedures

#### Task 1.3.1: Configuring Candidate Registration Rules and Temp ID Formatting

1. Navigate to the **IE Recruitment Basic Setup** page using the sidebar.
2. Select `Yes` in the **Basic Form is Applicable** dropdown to require candidate registration.
3. Select `Yes` in the **Assessment is Applicable** dropdown to require IE and HR assessment phases.
4. Input the letters `PAL` into the **Prefix** text field.
5. Select `6` from the **No of Digit** dropdown list.
6. Check the checkbox for the `Worker` category.
7. Click the **Save Settings** button. The settings are now stored, and any new candidate registered in the Worker category will automatically be assigned an ID starting with `PAL000001`.

---

## Chapter 2: Configuration Matrices Management

### 2.1 Navigation Path

Open the left sidebar menu, locate the Configuration group, and click on **Configuration Matrices** (URL: `/recruitment-configuration`).

### 2.2 Screen Elements Reference (Field-by-Field & Button-by-Button)

#### 2.2.1 Database Tabs

- **Operation Name**: Click this tab to view, add, or search the Operations Database (`recruitment_config_operations`).
- **M/C Name**: Click this tab to manage the Machine Database (`recruitment_config_machines`).
- **Operation Grade**: Click this tab to manage the Operation Grades catalog (`recruitment_config_op_grades`).
- **Measurement**: Click this tab to manage the Fabric/Part Dimensions catalog (`recruitment_config_measurements`).
- **SMV Bank**: Click this tab to manage Standard Minute Values mapped to Operation, Machine, Grade, and Measurement combinations (`recruitment_config_smv_bank`).
- **Efficiency Grade Points**: Click this tab to manage the mapping of trial efficiencies to Grade Points (`recruitment_config_eff_grades`).
- **Grade Points vs Grade**: Click this tab to manage salary bands and grades associated with overall weighted Grade Points (`recruitment_config_grade_vs_grade`).
- **Multi/SS**: Click this tab to manage multi-skill allowances and validity periods (`recruitment_config_multi_ss_v2`).

#### 2.2.2 General List Control Buttons

- **Add Record**: Button located at the top right of the active tab panel. On click, it opens a specific pop-up modal containing fields required to create a new database record.
- **Delete Record**: Button represented by a red text link or red icon in each row of the table. On click, it displays a confirmation prompt. If confirmed, the system deletes the record.

#### 2.2.3 Add Record Modals (Fields and Sub-Buttons)

##### A. Operation Name Modal

- **Operation Name**: Text input. Must be unique. Duplication check is case-insensitive.
- **Save Record**: Button to commit the new operation.
- **Cancel**: Button to close the modal.

##### B. M/C Name Modal

- **M/C Full Name**: Text input. The full descriptive name of the machine.
- **M/C Short Name**: Text input. The unique short code of the machine (e.g., `SNLS`, `FL-3TH`).
- **Save Record / Cancel**: Buttons to commit or discard.

##### C. SMV Bank Modal

- **Operation**: Dropdown select populated from the Operations Database.
- **M/C**: Dropdown select populated from the Machine Database.
- **Grade**: Dropdown select populated from the Operation Grade database.
- **Measurement**: Dropdown select populated from the Measurement database.
- **SMV Value**: Numeric decimal input. Represents the standard minutes allocated to this operation combination.
- **Save Record / Cancel**: Buttons to commit or discard.

##### D. Efficiency Grade Points Modal

- **Efficiency From**: Decimal percentage input (e.g., `80.00`).
- **Efficiency To**: Decimal percentage input (e.g., `89.99`). Must be higher than the From value.
- **Point**: Decimal Grade Point score allocated for this range (e.g., `4.50`).
- **Save Record / Cancel**: Buttons to commit or discard. The system validates that this range does not overlap with any existing record.

##### E. Grade Points vs Grade Modal

- **Point From**: Decimal input. Starting Grade Point boundary (e.g., `5.00`).
- **Point To**: Decimal input. Ending Grade Point boundary (e.g., `5.99`).
- **Grade**: Text input. Grade letter code (e.g., `B+`).
- **Salary From**: Integer input. Lower limit of the monthly salary range in local currency.
- **Salary To**: Integer input. Upper limit of the monthly salary range in local currency.
- **Govt Grade**: Text input. Government grade scale mapping (e.g., `Grade-4`).
- **Validity From**: Date picker. Starting date of validity for this salary scale.
- **Validity To**: Date picker. Ending date of validity.
- **Remarks**: Text area for admin notes.
- **Save Record / Cancel**: Buttons to commit or discard.

##### F. Multi/SS Modal

- **Point**: Decimal overall Grade Point boundary.
- **Operation Grade**: Dropdown select. Mapped grade.
- **Min Operation Count**: Integer input. Minimum number of operations tested to qualify for this allowance.
- **M/C Type**: Dropdown select. Options: `Same` (using the same type of machine) or `Different` (using different machine models).
- **Efficiency**: Decimal efficiency threshold required.
- **Add Amount**: Integer input. Additional allowance in local currency (e.g., `500`).
- **Validity From / Validity To**: Date pickers for the active date range of the allowance.
- **Save Record / Cancel**: Buttons to commit or discard.

---

### 2.3 Step-by-Step Procedures

#### Task 2.3.1: Registering a New Operation and Mapping its SMV

1. Navigate to the **Configuration Matrices** page.
2. Under the **Operation Name** tab, click **Add Record**.
3. In the input field, type `Hemming Sleeve` and click **Save Record**.
4. Click on the **SMV Bank** tab.
5. Click **Add Record**.
6. Select `Hemming Sleeve` in the **Operation** dropdown.
7. Select `SNLS` in the **M/C** dropdown.
8. Select `A` in the **Grade** dropdown.
9. Select `Short` in the **Measurement** dropdown.
10. Input `0.35` into the **SMV Value** input.
11. Click **Save Record**. The new standard value is now mapped in the system database.

---

## Chapter 3: Candidate Registration and Intake

### 3.1 Navigation Path

Open the left sidebar menu, locate the Recruitment group, and click on **New Candidate Registration** (URL: `/recruitment-basic-entry`).

### 3.2 Screen Elements Reference (Field-by-Field & Button-by-Button)

#### 3.2.1 Basic Info Card (Yellow Header)

- **Employee Name (Eng)**: Text input. Maximum length `100` characters. Accepts alphabetical letters, spaces, and periods. This field is required.
- **Employee Name (Bng)**: Text input. Maximum length `150` characters. Bengali script character format.
- **Temp ID**: Read-only text box. Automatically generated based on IE Recruitment Basic Setup rules.
- **Date of Birth**: Date picker. This field is required. The system validates the input date: the candidate's age must calculate to be between `18` and `60` years old. If outside this range, validation errors block form submission.
- **Age**: Read-only text box. Automatically calculates and displays the candidate's age in years when a valid Date of Birth is selected.
- **Personal Contact**: Text input. Requires exactly `11` digits and numeric format (e.g., `01712345678`). This field is required.
- **Emergency Contact**: Text input. Optional. Requires numeric format.
- **Shift**: Dropdown select field. Options: `General`, `Shift A`, `Shift B`.

#### 3.2.2 Details Info Card (Pink Header)

- **Present Address**: Multi-line textarea. Required.
- **Same as Present Address**: Checkbox. When checked, the text currently entered in Present Address is copied into the Permanent Address field, and the Permanent Address textarea is locked from manual editing. If unchecked, the Permanent Address field is unlocked and can be entered manually.
- **Permanent Address**: Multi-line textarea. Required.

#### 3.2.3 Attachment Upload Blocks

- **Employee Photo Box**: Upload area on the left side. Displays guidelines for image dimensions (minimum 200x200 pixels) and file size (maximum 2 MB, JPG or PNG formats).
- **Employee Signature Box**: Upload area on the right side. Same file format and size guidelines apply.
- **File Upload Input**: File explorer link inside each box. On click, it opens the local file browser to select an image.
- **Camera Capture**: Button located below the photo box. On click, it turns on the local camera/webcam and displays a live feed overlay.
- **Capture Snapshot**: Button within the camera overlay. On click, it captures the current video frame as a PNG image, populates the Photo Box, and shuts down the camera feed.

#### 3.2.4 Company Info Card (Green Header)

- **Employee Category**: Dropdown select. Options: `Worker`, `Staff`, `Executive`. Required.
- **Department**: Dropdown select. Populated from the company department database. Required.
- **Section**: Dropdown select. Populated from the sections database based on the selected Department. Required.
- **Designation**: Dropdown select. Populated from designations database. Required.
- **Line**: Dropdown select. Options represent target production lines. Required.
- **Unit**: Dropdown select. Options represent company manufacturing units. Required.

#### 3.2.5 Form Footer Buttons

- **Submit Registration**: Button located in the right corner of the footer. On click, the system executes form validations. If valid, the candidate record is saved to the local store with status `IE Pending` and the system redirects to the Basic Info Search List.
- **Clear Form**: Button located in the left corner of the footer. On click, clears all input values and resets fields to defaults.

---

### 3.3 Step-by-Step Procedures

#### Task 3.3.1: Registering a New Candidate Profile with Webcam Photo

1. Click on **New Candidate Registration** in the sidebar.
2. In the Basic Info Card, type `John Doe` in the **Employee Name (Eng)** input.
3. Click the **Date of Birth** field, choose the year `1998`, month `May`, and day `15` in the calendar picker. Verify the **Age** display updates to show `28`.
4. Enter `01798765432` in the **Personal Contact** input.
5. In the Details Info Card, type `House 45, Road 2, Sector 3, Uttara, Dhaka` in the **Present Address** textbox.
6. Check the **Same as Present Address** checkbox. Verify the Permanent Address textbox populates and locks.
7. Click the **Camera Capture** button in the Photo box. Adjust position, then click **Capture Snapshot**. Verify the taken photo shows in the preview box.
8. In the Company Info Card, select `Worker` from the **Employee Category** dropdown.
9. Select `RMG Operation` under **Department**, `Sewing` under **Section**, and `Operator` under **Designation**. Select `52` for **Line** and `Unit-6` for **Unit**.
10. Click **Submit Registration**. A notification will confirm registration and the page will transition to the Search List.

---

## Chapter 4: Database Search, Filtering, and Candidate Management

### 4.1 Navigation Path

- **Basic Info Search List**: Click **Basic Info Search List** (URL: `/recruitment-basic-info-list`) in the sidebar.
- **Assessment Search List**: Click **Assessment Search List** (URL: `/recruitment-assessment-list`) in the sidebar.

### 4.2 Screen Elements Reference (Field-by-Field & Button-by-Button)

#### 4.2.1 Search Filter Bar

- **Assess Status**: Dropdown select. Options: `All`, `IE Pending`, `HR Pending`, `HR Approved`, `HR Rejected`.
- **Category**: Dropdown select. Options: `All`, `Worker`, `Staff`, `Executive`.
- **DOJ From**: Date picker. Filter candidates by their registered date of joining starting boundary.
- **DOJ To**: Date picker. Filter candidates by ending boundary.
- **Department**: Dropdown select. Dynamically populated based on available candidate records.
- **Section**: Dropdown select. Dynamically populated.
- **Unit**: Dropdown select. Dynamically populated.
- **Search**: Button. On click, applies the selected dropdown and date filters to the database query and displays matching candidate rows in the results table.
- **Reset Filters**: Button next to Search. On click, clears all filter values, sets dropdown selections back to `All`, and re-queries the database to show the complete candidate list.

#### 4.2.2 Candidate List Table Columns

- **Candidate ID**: Column displaying the candidate's unique temporary ID.
- **Candidate Details**: Column displaying candidate English and Bengali names, Shift, and Mobile number.
- **Category / Dept / Sec**: Column displaying the assigned operational departments.
- **Status**: Column displaying the candidate's current recruitment phase status (`IE Pending`, `HR Pending`, `HR Approved`, `HR Rejected`).
- **Line / Unit**: Column displaying the assigned production line and factory unit.
- **Actions / Execute**: Column containing operational action buttons.

#### 4.2.3 Action Buttons inside Candidate Table Rows

- **Pencil (Edit)**: Button in the Actions column. Clicking this redirects the user to the candidate registration form to edit details. **This button is only active if candidate status is `IE Pending`**. If the status is any other value, the button is disabled.
- **Trash (Delete)**: Button in the Actions column. On click, prompts a confirmation dialog to delete the candidate record. **This action is restricted to Administrators**.
- **Play (Execute Assessment)**: Button in the Execute column on the IE Assessment search screen. On click, redirects the user to the cycle time assessment sheet for the selected candidate.
- **Eye (View HR Evaluation)**: Button in the Actions column on the Assessment Search List screen. On click, opens the HR review and salary package allocation sheet.

---

### 4.3 Step-by-Step Procedures

#### Task 4.3.1: Filtering Candidate List by Department and Status

1. Navigate to the **Basic Info Search List** page.
2. Click the **Assess Status** dropdown and select `IE Pending`.
3. Click the **Department** dropdown and select `RMG Operation`.
4. Click the **Search** button. The table will update to show only candidates in RMG Operation who have not yet undergone IE skill testing.

#### Task 4.3.2: Deleting a Pending Candidate Record

1. Locate the candidate to be deleted in the **Basic Info Search List** table (ensure status is `IE Pending`).
2. Click the red **Trash** button in the candidate's table row.
3. When the confirmation pop-up asks "Are you sure you want to delete this candidate record?", click **OK**. The table will reload, and the candidate profile is permanently removed from the system database.

---

## Chapter 5: Industrial Engineering (IE) Skill Assessments & Calculations

### 5.1 Navigation Path

Open the left sidebar menu, locate the IE Section group, and click on **IE Assessment Search** (URL: `/recruitment-ie-list`). Locate the candidate and click the blue **Play** button.

### 5.2 Screen Elements Reference (Field-by-Field & Button-by-Button)

#### 5.2.1 Skill Assessment Grid (Field-by-Field)

- **Add Row**: Button located at the top right of the worksheet table. On click, inserts a blank evaluation row into the worksheet.
- **Operation Name**: Dropdown select inside each evaluation row. Contains the list of operations from the Operations Database. On selection, the system automatically fetches the mapped SMV value from the database and fills it in.
- **M/C**: Dropdown select inside the row. Contains machines catalog. Required.
- **Meas.**: Dropdown select inside the row. Mapped textile fabric dimensions.
- **SMV**: Read-only text box in the row showing the fetched SMV.
- **CT1, CT2, CT3, CT4, CT5**: Numeric input text boxes. Captures stopwatch times in seconds for up to 5 trials.
- **Avg CT**: Read-only text box in the row. Shows calculated average stopwatch time.
- **Capacity**: Read-only text box in the row. Displays calculated hourly output capacity.
- **Standard**: Read-only text box in the row. Shows target standard hourly output.
- **Efficiency %**: Read-only text box in the row. Shows calculated operator skill efficiency percentage.
- **Grade Point**: Read-only text box. Shows mapped Grade Point for the row based on the computed Efficiency %.
- **Delete Row (Trash icon)**: Button at the end of each row. On click, deletes that skill trial row and recalculates overall metrics.

#### 5.2.2 Assessment Results Card (Read-only Summary Panels)

- **Designation**: Displays the registered candidate designation.
- **Overall GP**: Displays the compiled weighted Grade Point across all tested rows.
- **Grade**: Displays the mapped grade category matching the overall GP.
- **Multi-Skill Allow.**: Displays the allowance value if multiple different machine types were tested.
- **Base Salary Range**: Displays the minimum and maximum base salary values for this Grade.
- **Max Proposed Salary**: Displays the sum of maximum base salary and multi-skill allowance.

#### 5.2.3 IE Recommendation Card (Editable Fields)

- **Recommended Designation**: Text input. Pre-populated with candidate designation. The IE assessor can change this to recommend a different role based on skill trials.
- **IE Notes**: Text area. Open textbox for candidate performance remarks.

#### 5.2.4 Form Footer Buttons

- **Submit to HR**: Button in the bottom right corner. On click, saves trial rows, locks candidate details from further editing, changes candidate status to `HR Pending`, and redirects back to the search list.
- **Cancel**: Button in the bottom left corner. Discards entries and exits without modifying status.

---

### 5.3 Mathematical Calculations and Calculations Formulas

#### 5.3.1 Average Cycle Time (AvgCT)

$$AvgCT = \frac{\sum_{i=1}^{n} CT_i}{n}$$
Where $CT_i$ represents the stopwatch trials recorded in seconds, and $n$ represents the count of non-zero trials entered (up to 5).

#### 5.3.2 Capacity (Pcs/Hr)

$$Capacity = \frac{3600}{AvgCT \times 1.20}$$
This represents hourly output. The factory standard allowance multiplier of 20% (1.20) is automatically applied.

#### 5.3.3 Standard Target (Pcs/Hr)

$$Standard = \frac{60}{SMV}$$
Determines the standard target hourly output based on the Operation's database SMV.

#### 5.3.4 Efficiency %

$$Efficiency \% = \left( \frac{Capacity}{Standard} \right) \times 100$$

#### 5.3.5 Multi-Skill Grade Point (Overall GP Score)

If a candidate is tested on multiple operations, the system ranks the resulting Grade Points. The maximum Grade Point is weighted heavily, and additional tested operations add fractional value:
$$Total\ GP = \frac{\sum (GPs) - Max(GP)}{16} + Max(GP)$$
Where $\sum (GPs)$ is the sum of Grade Points across all rows, and $Max(GP)$ is the single highest Grade Point among all rows.

#### 5.3.6 Max Proposed Salary Calculation

$$Max\ Proposed\ Salary = Max\ Base\ Salary\ for\ Grade + Multi\text{-}Skill\ Allowance$$

---

### 5.4 Worked Calculation Examples

#### Example 5.4.1: Single Operation Candidate

A candidate is tested for **Side Seam** on an **OL-5TH** machine.

- Mapped SMV in database = `0.45` minutes.
- Recorded stopwatch trials: `15`, `16`, `15`, `14`, `15` seconds.
- **Average Cycle Time**:
  $$AvgCT = \frac{15 + 16 + 15 + 14 + 15}{5} = 15.0\text{ seconds}$$
- **Capacity**:
  $$Capacity = \frac{3600}{15.0 \times 1.20} = 200.0\text{ Pcs/Hr}$$
- **Standard Target**:
  $$Standard = \frac{60}{0.45} = 133.33\text{ Pcs/Hr}$$
- **Efficiency %**:
  $$Efficiency \% = \left( \frac{200.0}{133.33} \right) \times 100 = 150.00\%$$
- **Grade Point Mapping**: An efficiency of $150.00\%$ falls inside the $[120.01\%, 200.00\%]$ boundary which maps to **$7.00$ GP**.
- **Overall GP**: $Total\ GP = 7.00$ GP (Single skill).
- **Grade Mapping**: $7.00$ GP falls into the range $[7.00 - 10.00]$ which maps to Grade **Special** with a base salary scale of `17,001 - 20,000` currency.
- **Multi-Skill Allowance**: `0` (Only 1 machine operated).
- **Max Proposed Salary**: `20,000` (Max Base) + `0` (Allowance) = **`20,000`**.

#### Example 5.4.2: Multi-Skill Candidate (2 operations on different machines)

A candidate is tested on:

1. **Pocket Attach** on _SNLS_ machine (SMV = `0.38` minutes). AvgCT = `18.4` seconds.
2. **Sleeve Hem** on _FL-3TH_ machine (SMV = `0.35` minutes). AvgCT = `22.0` seconds.

- **Row 1 Calculations (Pocket Attach)**:
  - $AvgCT = 18.4$ seconds.
  - $Capacity = \frac{3600}{18.4 \times 1.20} = 163.04$ Pcs/Hr.
  - $Standard = \frac{60}{0.38} = 157.89$ Pcs/Hr.
  - $Efficiency \% = \left(\frac{163.04}{157.89}\right) \times 100 = 103.26\%$.
  - Efficiency Grade Point lookup: $103.26\%$ maps to **$5.50$ GP** (range $[100.01\% - 110.00\%]$).

- **Row 2 Calculations (Sleeve Hem)**:
  - $AvgCT = 22.0$ seconds.
  - $Capacity = \frac{3600}{22.0 \times 1.20} = 136.36$ Pcs/Hr.
  - $Standard = \frac{60}{0.35} = 171.43$ Pcs/Hr.
  - $Efficiency \% = \left(\frac{136.36}{171.43}\right) \times 100 = 79.54\%$.
  - Efficiency Grade Point lookup: $79.54\%$ maps to **$4.00$ GP** (range $[70.00\% - 79.99\%]$).

- **Multi-Skill Calculation**:
  - Tested GPs: $5.50$ and $4.00$.
  - Maximum GP = $5.50$.
  - Overall GP Score:
    $$Total\ GP = \frac{(5.50 + 4.00) - 5.50}{16} + 5.50$$
    $$Total\ GP = \frac{4.00}{16} + 5.50 = 0.25 + 5.50 = 5.75\text{ GP}$$
- **Salary & Allowance Lookup**:
  - $5.75$ GP matches Grade Points vs Grade row: GP $[5.50, 5.99] \rightarrow$ Grade **B+**, base salary scale `14,501 – 15,000`. Base maximum = `15,000`.
  - Candidate operated `2` different machine types (_SNLS_ and _FL-3TH_) $\rightarrow$ Multi-Skill allowance applies: `500` currency.
  - **Max Proposed Salary**:
    $$Max\ Proposed\ Salary = 15,000\text{ (Base)} + 500\text{ (Allowance)} = 15,500\text{ currency}$$

---

### 5.5 Step-by-Step Procedures

#### Task 5.5.1: Executing stopwatch assessment trials for a candidate

1. Navigate to **IE Assessment Search**.
2. Locate candidate `PAL000001` in the table list. Click the blue **Play** icon in the row.
3. Click the **Add Row** button in the worksheet header.
4. Select `Side Seam` from the **Operation Name** dropdown in the new row. Mapped SMV `0.45` will populate.
5. Select `OL-5TH` in the **M/C** dropdown, and `Short` in the **Meas.** dropdown.
6. Click the **CT1** field and type `15`. Repeat and type `16` in **CT2**, `15` in **CT3**, `14` in **CT4**, and `15` in **CT5**. Verify the **Avg CT** is `15.00`, **Capacity** is `200.00`, **Standard** is `133.33`, **Efficiency %** is `150.00%`, and **Grade Point** is `7.00`.
7. Scroll to the **IE Recommendation** card. Enter `Senior Operator` in **Recommended Designation** and write comments `High sewing efficiency and speed` in **IE Notes**.
8. Click the **Submit to HR** button. The worksheet will save, and status updates to `HR Pending`.

---

## Chapter 6: Human Resources (HR) Review and Final Hiring Approvals

### 6.1 Navigation Path

Open the left sidebar menu, locate the HR Section group, and click on **Assessment Search List** (URL: `/recruitment-assessment-list`). Locate the candidate and click the blue **Eye** button.

### 6.2 Screen Elements Reference (Field-by-Field & Button-by-Button)

#### 6.2.1 Candidate Info Card (Read-only Panel)

- Displays candidate Name, Temp ID, Department, Section, Designation, Line, and Unit values registered during candidate intake.

#### 6.2.2 IE Evaluation Results (Read-only Table Grid)

- Displays rows of tested operations containing M/C, SMV, average cycle times, capacity, target standards, efficiency percentages, and Grade Point ratings compiled by the IE assessor.

#### 6.2.3 Assessment Summary Panel (Read-only Cards)

- **Overall GP**: Calculated candidate Grade Point.
- **Grade**: Auto-assigned Grade letter.
- **Multi-Skill Allowance**: Multi-machine bonus amount if applicable.
- **Base Salary Range**: Minimum and maximum base salary boundary scale.
- **Max Proposed Salary**: Sum of maximum base and multi-skill allowance.
- **IE Recommended Designation**: Mapped designation suggested by the IE team.
- **IE Recommendation Notes**: Assessor remarks.

#### 6.2.4 HR Recommendation Card (Editable Fields)

- **Proposed Gross Salary**: Numeric text input field. Pre-populated with the calculated **Max Proposed Salary** value. The HR Manager can modify this amount based on interviews or agreements.
- **HR Final Designation**: Text input. Pre-populated with the **IE Recommended Designation** value. HR can modify this designation.
- **HR Comments**: Text area. Input box for HR remarks, hiring conditions, or approval notes.

#### 6.2.5 Form Footer Buttons

- **Approve & Generate Form**: Button in the bottom right. On click, the system validates the inputs, locks the salary details, updates the candidate status to `HR Approved`, generates a draft personnel file, and redirects back to the assessment list.
- **Reject Candidate**: Button in the bottom center. On click, changes the candidate status to `HR Rejected`, locks the record, and returns to the assessment list.
- **Close**: Button in the bottom left. Discards changes and returns to the search list without changing candidate status.

---

### 6.3 Step-by-Step Procedures

#### Task 6.3.1: Approving Candidate Salary and Designation Package

1. Navigate to the **Assessment Search List**.
2. Locate the candidate (status must be `HR Pending`) and click the **Eye** icon.
3. Review the candidate demographics card, the skill assessment table, and the calculated Grade.
4. Read the IE Recommended designation and comments.
5. In the **HR Recommendation** card, verify the pre-populated salary value in the **Proposed Gross Salary** input. If required, change the amount.
6. Verify the designation in the **HR Final Designation** textbox.
7. Enter comments in the **HR Comments** text area (e.g., `Approved for sewing floor line 52`).
8. Click **Approve & Generate Form**. The candidate status is updated to `HR Approved` and the draft onboarding record is saved.

---

## Chapter 7: Troubleshooting and System Maintenance

### 7.1 Troubleshooting FAQs

#### Question 7.1.1: Why is the Pencil (Edit) button disabled on the Basic Info List?

- **Answer**: The candidate basic registration fields cannot be edited once the Industrial Engineering evaluation starts. The edit button is only enabled when a candidate is in the `IE Pending` status.

#### Question 7.1.2: Why does the HR Assessment page hang on a "Loading Candidate evaluation data..." screen?

- **Answer**: This happens if the candidate was pre-seeded directly into `HR Pending` or `HR Approved` status without undergoing the IE assessment. The system now supplies fallback baseline evaluations to prevent hanging.

#### Question 7.1.3: Can I register a candidate who is under 18 or over 60 years old?

- **Answer**: No. The system has built-in validation checks on the Date of Birth field. If the calculated age is under 18 or over 60, the form cannot be submitted.

---

### 7.2 System Reset Procedures

#### Task 7.2.1: Hard Resetting the Recruitment database

If mock records or configurations need to be completely cleared and reset to factory defaults:

1. Open the web browser developer tools console (usually by pressing F12 or right-clicking and selecting **Inspect** -> **Console**).
2. Type the following command in the console prompt:
   `window.__resetRecruitmentData()`
3. Press Enter. The local storage database will be cleared and re-populated with default configurations and candidate profiles. The page will reload automatically.
