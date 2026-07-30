# Enterprise Backend Integration Guide: Two-Phase Attachment Token Pattern

This document describes the enterprise-standard architecture for handling dynamic optional attachments (such as academic transcripts, training certificates, and experience releases) in a personnel file wizard.

Rather than sending complex binary streams nested inside a giant payload during form submission, this system decouples **file uploads** from **data submission** using a two-phase token reference system.

---

## Why this Architecture? (Enterprise Benefits)

1. **Upload Resilience**: If an upload fails, only that specific file fails. The user can retry uploading *just that file* without refilling or re-submitting the main employee registration wizard.
2. **Accurate Progress Tracking**: Direct HTTP file streams permit real-time browser progress bars (e.g., `XMLHttpRequest.upload.onprogress`) per file.
3. **Stateless API Design**: The final employee creation endpoint is a lightweight, standard `application/json` post, completing in milliseconds rather than holding connection threads open during heavy file streams.
4. **Draft-Saving Support**: In Draft profiles, files remain saved in object storage and are linked simply by their unique `attachmentId`.

---

## The Workflow Diagram

```
[ User Selects File in Table Row ]
               │
               ▼
[ Phase 1: Async File Upload ] ───(multipart/form-data)───► [ Attachment API ]
               │                                                    │
               │                                                    ▼
               │                                           [ Save to Secure GCS/S3 ]
               │                                                    │
               │                                                    ▼
[ Store attachmentId in Row State ] ◄───(returns JSON Token)────── [ Save Metadata & Return ID ]
               │
               ▼
[ User Fills Other Form Fields ]
               │
               ▼
[ Phase 2: Final Form Submit ] ─────(application/json)────► [ Employee API ]
                                                                    │
                                                                    ▼
                                                            [ Insert Records & ]
                                                            [ Link Foreign Keys ]
```

---

## Phase 1: Async Upload Endpoint

When the user selects a file in a table row, the client-side makes an immediate background request to:

### Request
```http
POST /api/v1/attachments
Content-Type: multipart/form-data

file: [Binary File Stream]
module: "employee_credentials"
```

### Server Validation
1. **Size check**: Validate `file.size` does not exceed **5MB**. Reject with `413 Payload Too Large`.
2. **MIME/Header check**: Verify magic bytes. Allowed MIME types: `application/pdf`, `image/png`, `image/jpeg`. Reject others with `400 Bad Request`.
3. **Unique filename generation**: Strip unsafe chars and prefix a UUID:
   `unique_filename = UUID() + "_" + sanitize(original_filename)`

### Storage & Response
- Store the file in a private cloud storage bucket (e.g., GCS, AWS S3).
- Insert metadata into the `attachments` table.
- Return the generated unique identifier as a JSON token (`201 Created`).

```json
{
  "status": "success",
  "data": {
    "attachmentId": "att_8a9b7c6d5e4f3g2h1",
    "originalName": "bsc_transcript.pdf",
    "fileSize": "1.45 MB",
    "mimeType": "application/pdf"
  }
}
```

---

## Phase 2: Final Form Submission

When the user clicks the final wizard submit button, the payload is sent as clean, standard JSON. All attachments are referenced purely by their parsed `attachmentId`s:

### Request
```http
POST /api/v1/employees
Content-Type: application/json
```

```json
{
  "nameEng": "Tahmid Afsar Shapno",
  "email": "tahmid@criptech.com",
  "educationList": [
    {
      "degree": "Bachelor of Science (B.Sc)",
      "institute": "IIT University of Dhaka",
      "passingYear": "2022",
      "resultGpa": "3.85",
      "attachmentId": "att_8a9b7c6d5e4f3g2h1" -- Referenced Token
    },
    {
      "degree": "Higher Secondary (HSC)",
      "institute": "Dhaka College",
      "passingYear": "2018",
      "resultGpa": "5.00",
      "attachmentId": null -- Optional (No file uploaded)
    }
  ]
}
```

### Database Schema Mapping
The database schema remains highly normalized. The main arrays tables (`employee_education` and `employee_experience`) simply have a foreign key reference pointing to the centralized `attachments` table.

```sql
-- Centralized Attachments Metadata Registry
CREATE TABLE attachments (
    id VARCHAR(50) PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(512) NOT NULL, -- Path/URI inside Cloud Storage bucket
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Employee Education Table
CREATE TABLE employee_education (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
    degree_title VARCHAR(150) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    passing_year VARCHAR(4) NOT NULL,
    result_gpa VARCHAR(10) NOT NULL,
    attachment_id VARCHAR(50) REFERENCES attachments(id) ON DELETE SET NULL, -- Nullable FK reference
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## Garbage Collection (Orphaned Attachments Cleanup)

If a user uploads a file (Phase 1) but closes their browser tab without submitting the final form (Phase 2), that attachment becomes "orphaned".

**Recommended cleanup strategy:**
- Run a daily cron job that executes a SQL query to find any attachments that have no parent relationships in `employee_education` or `employee_experience` and were created more than 24 hours ago.
- The cron job deletes those files from the S3/GCS bucket and removes their records from the database registry.
