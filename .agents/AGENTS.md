
## System Changes Tracking Rule
CRITICAL: Any modifications, new features, or structural changes made to this project MUST be documented in `src/routes/changes.tsx`. You must append the change to the default records array inside `useEffect` and increment the `system_changes_v*` local storage key to ensure it reflects on the user's end. The change descriptions must be written in both English (`descriptionEn`) and Bengali (`descriptionBn`) using conversational and simple language.
