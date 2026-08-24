import os
import json

# Define metadata for all 45 procurement pages
pages = [
    # Configuration
    {
        "route": "procurement-config-currency-rate",
        "title": "Currency Rate Manager",
        "headers": ["ID", "Currency Name", "ISO Code", "Symbol", "Exchange Rate (BDT)", "Last Updated", "Status"],
        "keys": ["id", "currency", "code", "symbol", "rate", "lastUpdated", "status"],
        "add_text": "Add Currency",
        "data": [
            {"id": "1", "currency": "US Dollar", "code": "USD", "symbol": "$", "rate": "120.50", "lastUpdated": "2026-08-24 10:30 AM", "status": "Active"},
            {"id": "2", "currency": "Euro", "code": "EUR", "symbol": "€", "rate": "130.20", "lastUpdated": "2026-08-24 10:30 AM", "status": "Active"},
            {"id": "3", "currency": "GB Pound", "code": "GBP", "symbol": "£", "rate": "152.80", "lastUpdated": "2026-08-24 09:15 AM", "status": "Active"},
            {"id": "4", "currency": "Chinese Yuan", "code": "CNY", "symbol": "¥", "rate": "16.70", "lastUpdated": "2026-08-23 04:00 PM", "status": "Active"},
            {"id": "5", "currency": "Indian Rupee", "code": "INR", "symbol": "₹", "rate": "1.44", "lastUpdated": "2026-08-24 10:00 AM", "status": "Active"},
        ]
    },
    {
        "route": "procurement-config-terms",
        "title": "Terms and Conditions Template Configuration",
        "headers": ["ID", "Template Title", "Category", "Payment Terms", "Delivery Term", "Status"],
        "keys": ["id", "templateName", "category", "paymentTerms", "deliveryTerm", "status"],
        "add_text": "Add Template",
        "data": [
            {"id": "1", "templateName": "Standard Import LC Terms", "category": "L/C Booking", "paymentTerms": "100% Sight L/C", "deliveryTerm": "FOB Shanghai", "status": "Active"},
            {"id": "2", "templateName": "Local Chemical Purchase", "category": "Cash/Credit Purchase", "paymentTerms": "60 Days Credit", "deliveryTerm": "LDP Factory Site", "status": "Active"},
            {"id": "3", "templateName": "Yarn Vendor Aggressive Contract", "category": "Work Order", "paymentTerms": "30% Advance, 70% LC 90 Days", "deliveryTerm": "CIF Chittagong", "status": "Active"},
        ]
    },
    {
        "route": "procurement-config-purchase-option",
        "title": "Purchase Options Configuration",
        "headers": ["ID", "Option Title", "Description", "Required Documents", "Approval Levels", "Status"],
        "keys": ["id", "title", "desc", "docs", "approvals", "status"],
        "add_text": "Add Option",
        "data": [
            {"id": "1", "title": "L/C Foreign Import", "desc": "Import goods via Letter of Credit", "docs": "PI, LC Application, Insurance", "approvals": "3 Levels", "status": "Active"},
            {"id": "2", "title": "Local Cash Purchase", "desc": "Spot purchasing for urgent store materials", "docs": "Requisition, Cash Receipt", "approvals": "1 Level", "status": "Active"},
        ]
    },
    {
        "route": "procurement-config-supplier-opening",
        "title": "Supplier Opening Balance Setup",
        "headers": ["Supplier ID", "Supplier Name", "Ledger Account", "Opening Balance", "Opening Date", "Status"],
        "keys": ["id", "name", "ledger", "balance", "date", "status"],
        "add_text": "Set Balance",
        "data": [
            {"id": "SUP-001", "name": "Apex Textile Chemical Ltd", "ledger": "201-002-901", "balance": "৳240,000.00", "date": "2026-07-01", "status": "Verified"},
            {"id": "SUP-204", "name": "Zhejiang Yarn Spinning Co.", "ledger": "201-004-102", "balance": "$12,500.00", "date": "2026-07-01", "status": "Verified"},
        ]
    },
    {
        "route": "procurement-config-lc-booking",
        "title": "L/C Booking Console",
        "headers": ["Booking ID", "Supplier Name", "PI Reference", "Booking Value", "Margin %", "L/C Open Date", "Status"],
        "keys": ["id", "supplier", "pi", "value", "margin", "date", "status"],
        "add_text": "Book L/C",
        "data": [
            {"id": "LCB-2026-004", "supplier": "Zhejiang Yarn Spinning Co.", "pi": "PI-2026-YRN-089", "value": "$45,200.00", "margin": "10%", "date": "2026-08-24", "status": "Draft"},
        ]
    },
    {
        "route": "procurement-config-lc-booking-list",
        "title": "L/C Bookings Registry",
        "headers": ["Booking ID", "Supplier", "PI Ref", "L/C Value", "Bank Name", "Opened Date", "Status"],
        "keys": ["id", "supplier", "pi", "value", "bank", "date", "status"],
        "add_text": "Export List",
        "data": [
            {"id": "LCB-2026-001", "supplier": "Zhejiang Yarn Spinning Co.", "pi": "PI-2026-YRN-004", "value": "$120,000.00", "bank": "Eastern Bank Ltd", "date": "2026-05-12", "status": "Active"},
            {"id": "LCB-2026-002", "supplier": "Euro Machinery Corp.", "pi": "PI-2026-MAC-012", "value": "€89,500.00", "bank": "HSBC Bangladesh", "date": "2026-06-15", "status": "Active"},
        ]
    },
    {
        "route": "procurement-config-bank-info",
        "title": "Bank Information Setup",
        "headers": ["Bank ID", "Bank Name", "Branch Name", "Swift Code", "Country", "Contact Person", "Status"],
        "keys": ["id", "name", "branch", "swift", "country", "contact", "status"],
        "add_text": "Add Bank",
        "data": [
            {"id": "BNK-001", "name": "Eastern Bank Ltd", "branch": "Banani", "swift": "EBLDBDHA", "country": "Bangladesh", "contact": "A. K. Azad", "status": "Active"},
            {"id": "BNK-002", "name": "HSBC Bangladesh", "branch": "Main Office", "swift": "HSBCBDHA", "country": "Bangladesh", "contact": "N. Chowdhury", "status": "Active"},
        ]
    },
    {
        "route": "procurement-config-bank-accounts",
        "title": "Bank Accounts Registry",
        "headers": ["Account ID", "Bank Name", "Account Number", "Account Title", "Currency", "Type", "Status"],
        "keys": ["id", "bank", "accNo", "title", "currency", "type", "status"],
        "add_text": "Link Account",
        "data": [
            {"id": "ACC-01", "bank": "Eastern Bank Ltd", "accNo": "104106098234", "title": "Cripton Apparel Procurement", "currency": "BDT", "type": "Current", "status": "Active"},
            {"id": "ACC-02", "bank": "HSBC Bangladesh", "accNo": "001928374102", "title": "Cripton Accessories Import", "currency": "USD", "type": "FC Account", "status": "Active"},
        ]
    },
    {
        "route": "procurement-config-supplier-name",
        "title": "Supplier Directory Setup",
        "headers": ["Supplier ID", "Supplier Name", "Supplier Code", "Contact Person", "Email Address", "Contact Phone", "Country", "Category", "Approval Status"],
        "keys": ["id", "supplierName", "code", "contactPerson", "email", "phone", "country", "category", "status"],
        "add_text": "Register Supplier",
        "data": [
            {"id": "1", "supplierName": "Apex Textile Chemical Ltd", "code": "SUP-ATC-001", "contactPerson": "M. A. Rahman", "email": "rahman@apexchem.com", "phone": "+880 1711-223344", "country": "Bangladesh", "category": "Chemicals", "status": "Approved"},
            {"id": "2", "supplierName": "Zhejiang Yarn Spinning Co.", "code": "SUP-ZYS-204", "contactPerson": "Li Wei", "email": "sales@zhejiangyarn.cn", "phone": "+86 571 8899 0011", "country": "China", "category": "Yarn Yarn", "status": "Approved"},
            {"id": "3", "supplierName": "Global Logistics & Shipping", "code": "SUP-GLS-902", "contactPerson": "Sarah Jenkins", "email": "s.jenkins@globallogistics.sg", "phone": "+65 6789 0123", "country": "Singapore", "category": "Services", "status": "Pending Approval"},
            {"id": "4", "supplierName": "Dacca Accessories & Thread Ind.", "code": "SUP-DAT-110", "contactPerson": "Faruk Hossain", "email": "faruk@daccathread.com", "phone": "+880 1819-334455", "country": "Bangladesh", "category": "Accessories", "status": "Approved"},
        ]
    },

    # Proforma Invoice
    {
        "route": "procurement-pi-create",
        "title": "Create Proforma Invoice",
        "headers": ["Item Ref", "Description", "Quantity", "Unit", "Unit Price ($)", "Total Amount ($)", "Action"],
        "keys": ["id", "desc", "qty", "unit", "price", "amount", "status"],
        "add_text": "Add Item Row",
        "data": [
            {"id": "YRN-30s-01", "desc": "30s Carded Cotton Yarn", "qty": "10,000", "unit": "Kg", "price": "3.20", "amount": "32,000.00", "status": "Draft"},
            {"id": "YRN-40s-02", "desc": "40s Combed Cotton Yarn", "qty": "5,000", "unit": "Kg", "price": "3.80", "amount": "19,000.00", "status": "Draft"},
        ]
    },
    {
        "route": "procurement-pi-list",
        "title": "Proforma Invoice Database",
        "headers": ["ID", "PI Number", "Issue Date", "Supplier Profile", "Currency", "Total Value", "Quantity", "Approval Stage"],
        "keys": ["id", "piNo", "date", "supplier", "currency", "totalValue", "qty", "status"],
        "add_text": "Register PI",
        "data": [
            {"id": "1", "piNo": "PI-2026-YRN-089", "date": "2026-08-22", "supplier": "Zhejiang Yarn Spinning Co.", "currency": "USD", "totalValue": "45,200.00", "qty": "12,000 Kg", "status": "Approve DC Price"},
            {"id": "2", "piNo": "PI-2026-CHM-092", "date": "2026-08-20", "supplier": "Apex Textile Chemical Ltd", "currency": "BDT", "totalValue": "1,520,000.00", "qty": "3,500 Ltr", "status": "Verified"},
            {"id": "3", "piNo": "PI-2026-ACC-104", "date": "2026-08-24", "supplier": "Dacca Accessories & Thread Ind.", "currency": "USD", "totalValue": "8,950.00", "qty": "150,000 Pcs", "status": "Draft"},
        ]
    },
    {
        "route": "procurement-pi-edit-dc-price",
        "title": "Direct Cost Price Editor",
        "headers": ["PI Ref", "Supplier", "Original Price ($/Kg)", "FOB Rate", "Freight", "Insurance", "Proposed Direct Cost", "Action"],
        "keys": ["id", "supplier", "orgPrice", "fob", "freight", "ins", "proposed", "status"],
        "add_text": "Update All",
        "data": [
            {"id": "PI-2026-YRN-089", "supplier": "Zhejiang Yarn Spinning Co.", "orgPrice": "3.40", "fob": "0.10", "freight": "0.15", "ins": "0.05", "proposed": "3.70", "status": "Draft"},
        ]
    },
    {
        "route": "procurement-pi-approve-dc-price",
        "title": "Direct Cost Price Approval Board",
        "headers": ["PI Number", "Supplier", "PI Total Value", "Proposed DC Rate ($)", "Target Cost ($)", "Variance ($)", "Approval Status"],
        "keys": ["piNo", "supplier", "totalValue", "proposed", "target", "variance", "status"],
        "add_text": "Approve Selected",
        "data": [
            {"piNo": "PI-2026-YRN-089", "supplier": "Zhejiang Yarn Spinning Co.", "totalValue": "$45,200.00", "proposed": "3.70/Kg", "target": "3.50/Kg", "variance": "+0.20", "status": "Under Review"},
        ]
    },
    {
        "route": "procurement-pi-delete-request",
        "title": "PI Deletion Approval Queue",
        "headers": ["PI Ref", "Supplier", "Requested By", "Date Requested", "Reason for Deletion", "Approval status"],
        "keys": ["id", "supplier", "by", "date", "reason", "status"],
        "add_text": "Process Request",
        "data": [
            {"id": "PI-2026-ACC-091", "supplier": "Dacca Accessories & Thread Ind.", "by": "M. Kabir", "date": "2026-08-24", "reason": "Supplier issued wrong invoice values, replaced by PI-104", "status": "Pending Approval"},
        ]
    },

    # Purchase Order
    {
        "route": "procurement-po-requisition-wise",
        "title": "Requisition Wise Purchase Order Generator",
        "headers": ["Requisition ID", "Item Category", "Requested Qty", "Estimated Budget", "HOD Approved By", "Generate Action"],
        "keys": ["id", "category", "qty", "budget", "hod", "status"],
        "add_text": "Batch Generate PO",
        "data": [
            {"id": "REQ-2026-091", "category": "Yarn", "qty": "12,000 Kg", "budget": "$42,000.00", "hod": "Tahmid Shapno", "status": "Generate PO"},
            {"id": "REQ-2026-093", "category": "Chemicals", "qty": "3,500 Ltr", "budget": "৳1,500,000.00", "hod": "Tahmid Shapno", "status": "Generate PO"},
        ]
    },
    {
        "route": "procurement-po-new",
        "title": "Create New Purchase Order",
        "headers": ["PO Ref", "Supplier", "Delivery Terms", "Payment Mode", "Currency", "Tax Code", "Action"],
        "keys": ["id", "supplier", "delivery", "payment", "currency", "tax", "status"],
        "add_text": "Add PO Details",
        "data": [
            {"id": "PO-TEMP-001", "supplier": "Apex Textile Chemical Ltd", "delivery": "FOB Factory", "payment": "LC Sight", "currency": "BDT", "tax": "V-5.5%", "status": "Draft"},
        ]
    },
    {
        "route": "procurement-po-list",
        "title": "Purchase Orders Registry",
        "headers": ["ID", "PO Number", "Dispatch Date", "Supplier", "Requisition", "PO Total Value", "Delivery Deadline", "Approval Status"],
        "keys": ["id", "poNo", "date", "supplier", "requisitionNo", "totalValue", "deliveryDate", "status"],
        "add_text": "Create PO",
        "data": [
            {"id": "1", "poNo": "PO-2026-00481", "date": "2026-08-23", "supplier": "Zhejiang Yarn Spinning Co.", "requisitionNo": "REQ-2026-091", "totalValue": "$45,200.00", "deliveryDate": "2026-09-15", "status": "Work Order Approval"},
            {"id": "2", "poNo": "PO-2026-00482", "date": "2026-08-21", "supplier": "Apex Textile Chemical Ltd", "requisitionNo": "REQ-2026-093", "totalValue": "৳1,520,000.00", "deliveryDate": "2026-09-05", "status": "Approved"},
            {"id": "3", "poNo": "PO-2026-00483", "date": "2026-08-24", "supplier": "Dacca Accessories & Thread Ind.", "requisitionNo": "REQ-2026-095", "totalValue": "$8,950.00", "deliveryDate": "2026-09-10", "status": "Draft"},
        ]
    },
    {
        "route": "procurement-po-work-order-approval",
        "title": "Work Order Approval Console",
        "headers": ["Work Order ID", "Supplier Profile", "PO Ref", "WO Date", "FOB Amount", "L/C Requirement", "Approval status"],
        "keys": ["id", "supplier", "po", "date", "amount", "lc", "status"],
        "add_text": "Bulk Approve",
        "data": [
            {"id": "WO-2026-0012", "supplier": "Zhejiang Yarn Spinning Co.", "po": "PO-2026-00481", "date": "2026-08-24", "amount": "$45,200.00", "lc": "Sight LC Needed", "status": "Under Review"},
        ]
    },

    # Billing
    {
        "route": "procurement-billing-prepare",
        "title": "Prepare Supplier Invoice Bill",
        "headers": ["ID", "Supplier Name", "PO Ref", "MRR Number", "Invoice Amount", "Pre-calculated Tax", "Action"],
        "keys": ["id", "supplier", "po", "mrr", "amount", "tax", "status"],
        "add_text": "Generate Bill Draft",
        "data": [
            {"id": "BIL-TEMP-901", "supplier": "Apex Textile Chemical Ltd", "po": "PO-2026-00482", "mrr": "MRR-2026-0820", "amount": "৳1,520,000.00", "tax": "৳83,600.00", "status": "Prepare Bill"},
        ]
    },
    {
        "route": "procurement-billing-purchase-list",
        "title": "Item Wise Purchase History Registry",
        "headers": ["Item ID", "Item name", "Supplier", "Purchase Date", "PO Ref", "Qty Purchased", "Unit Price", "Gross Amount"],
        "keys": ["id", "name", "supplier", "date", "po", "qty", "price", "amount"],
        "add_text": "Export Registry",
        "data": [
            {"id": "CHM-DYE-91", "name": "Reactive Dyes Yellow", "supplier": "Apex Textile Chemical Ltd", "date": "2026-08-20", "po": "PO-2026-00482", "qty": "1,200 Kg", "price": "৳650.00", "amount": "৳780,000.00"},
            {"id": "YRN-30s-01", "name": "30s Carded Cotton Yarn", "supplier": "Zhejiang Yarn Spinning Co.", "date": "2026-08-23", "po": "PO-2026-00481", "qty": "12,000 Kg", "price": "$3.70", "amount": "$44,400.00"},
        ]
    },
    {
        "route": "procurement-billing-vat-tax-register",
        "title": "VAT and Tax Registry compliance log",
        "headers": ["Bill Ref", "Supplier", "Gross Invoice Value", "VAT Rate", "VAT Ded.", "Tax Rate", "Tax Ded.", "Status"],
        "keys": ["id", "supplier", "gross", "vatRate", "vat", "taxRate", "tax", "status"],
        "add_text": "Add Log Entry",
        "data": [
            {"id": "BIL-2026-0078", "supplier": "Apex Textile Chemical Ltd", "gross": "৳1,520,000.00", "vatRate": "5.5%", "vat": "৳83,600.00", "taxRate": "2%", "tax": "৳30,400.00", "status": "Verified"},
        ]
    },
    {
        "route": "procurement-billing-loan-list",
        "title": "Procurement Loan Registry ledger",
        "headers": ["Loan Account", "Bank Name", "Sanction Value", "Outstanding Amount", "Sanction Date", "Maturity Date", "Status"],
        "keys": ["id", "bank", "sanction", "outstanding", "sDate", "mDate", "status"],
        "add_text": "Sanction Loan",
        "data": [
            {"id": "LATR-EBL-0091", "bank": "Eastern Bank Ltd", "sanction": "$100,000.00", "outstanding": "$45,200.00", "sDate": "2026-08-24", "mDate": "2026-11-24", "status": "Active"},
        ]
    },
    {
        "route": "procurement-billing-edit-rate",
        "title": "Supplier Bill Rate Modification Panel",
        "headers": ["Bill Ref", "Supplier Name", "Original Amount", "Proposed Amount", "Modified Rate By", "Status"],
        "keys": ["id", "supplier", "org", "prop", "by", "status"],
        "add_text": "Modify Selected",
        "data": [
            {"id": "BIL-2026-0078", "supplier": "Apex Textile Chemical Ltd", "org": "৳1,520,000.00", "prop": "৳1,500,000.00", "by": "M. Kabir", "status": "Draft"},
        ]
    },
    {
        "route": "procurement-billing-approve-rate",
        "title": "Supplier Bill Rate Approvals",
        "headers": ["Bill ID", "Invoice Number", "Supplier Profile", "PO Reference", "MRR Number", "Bill Amount", "Currency", "Bill Status"],
        "keys": ["id", "billNo", "supplier", "poNo", "mrrNo", "amount", "currency", "status"],
        "add_text": "Approve Selected",
        "data": [
            {"id": "1", "billNo": "BIL-2026-0078", "supplier": "Apex Textile Chemical Ltd", "poNo": "PO-2026-00482", "mrrNo": "MRR-2026-0820", "amount": "1,520,000.00", "currency": "BDT", "status": "Approve Bill Rate"},
        ]
    },
    {
        "route": "procurement-billing-supplier-record",
        "title": "Supplier Bill Record File",
        "headers": ["Record ID", "Supplier", "Total Invoiced Value", "Total Payments Made", "Outstanding Balance", "Last Invoice Date", "Status"],
        "keys": ["id", "supplier", "invoiced", "payments", "outstanding", "date", "status"],
        "add_text": "Add Record",
        "data": [
            {"id": "SUP-REC-01", "supplier": "Apex Textile Chemical Ltd", "invoiced": "৳4,800,000.00", "payments": "৳4,000,000.00", "outstanding": "৳800,000.00", "date": "2026-08-24", "status": "Active"},
        ]
    },
    {
        "route": "procurement-billing-supplier-record-list",
        "title": "Supplier Bill Records Registry",
        "headers": ["Bill ID", "Invoice Number", "Invoice Date", "Supplier Profile", "PO Reference", "MRR Number", "Bill Amount", "Currency", "Bill Status"],
        "keys": ["id", "billNo", "date", "supplier", "poNo", "mrrNo", "amount", "currency", "status"],
        "add_text": "Prepare Invoice Bill",
        "data": [
            {"id": "1", "billNo": "BIL-2026-0078", "date": "2026-08-24", "supplier": "Apex Textile Chemical Ltd", "poNo": "PO-2026-00482", "mrrNo": "MRR-2026-0820", "amount": "1,520,000.00", "currency": "BDT", "status": "Approve Bill Rate"},
            {"id": "2", "billNo": "BIL-2026-0079", "date": "2026-08-23", "supplier": "Zhejiang Yarn Spinning Co.", "poNo": "PO-2026-00481", "mrrNo": "MRR-2026-0822", "amount": "45,200.00", "currency": "USD", "status": "Prepared"},
        ]
    },
    {
        "route": "procurement-billing-prepare-v2",
        "title": "Batch Bill Processing Console (V2)",
        "headers": ["Batch ID", "Supplier Profile", "Purchase Period", "Total Bills", "Aggregated Value", "Status"],
        "keys": ["id", "supplier", "period", "billsCount", "totalVal", "status"],
        "add_text": "Create Batch Bill",
        "data": [
            {"id": "BBIL-2026-01", "supplier": "Apex Textile Chemical Ltd", "period": "Aug 2026 (W1-W2)", "billsCount": "4 Invoices", "totalVal": "৳5,240,000.00", "status": "Draft"},
        ]
    },
    {
        "route": "procurement-billing-vat-tax-entry",
        "title": "VAT and Tax Deduction Registry Log",
        "headers": ["Entry ID", "Supplier", "Invoice Amount", "VAT Deduction", "Tax Deduction", "Challan Number", "Status"],
        "keys": ["id", "supplier", "amount", "vat", "tax", "challan", "status"],
        "add_text": "Create Entry",
        "data": [
            {"id": "VTE-0048", "supplier": "Apex Textile Chemical Ltd", "amount": "৳1,520,000.00", "vat": "৳83,600.00", "tax": "৳30,400.00", "challan": "CH-2026-0820-A", "status": "Submitted"},
        ]
    },

    # Payment
    {
        "route": "procurement-payment-bill",
        "title": "Bill Settlement Payment Entry Form",
        "headers": ["Payment Ref", "Supplier", "Settled Bill Ref", "Amount Paid", "Currency", "Payment Mode", "Bank Source", "Status"],
        "keys": ["id", "supplier", "bill", "paid", "currency", "mode", "bank", "status"],
        "add_text": "Make Payment",
        "data": [
            {"id": "PAY-2026-0041", "supplier": "Apex Textile Chemical Ltd", "bill": "BIL-2026-0078", "paid": "৳1,520,000.00", "currency": "BDT", "mode": "Cheque", "bank": "Eastern Bank Ltd", "status": "Approved"},
        ]
    },
    {
        "route": "procurement-payment-list",
        "title": "Supplier Payments Transaction Register",
        "headers": ["Transaction ID", "Supplier Profile", "Date Settled", "Reference Bill", "Amount Cleared", "Currency", "Status"],
        "keys": ["id", "supplier", "date", "bill", "cleared", "currency", "status"],
        "add_text": "Export register",
        "data": [
            {"id": "PAY-2026-0041", "supplier": "Apex Textile Chemical Ltd", "date": "2026-08-24", "bill": "BIL-2026-0078", "cleared": "1,520,000.00", "currency": "BDT", "status": "Approved"},
        ]
    },

    # Audit
    {
        "route": "procurement-audit-mrr",
        "title": "Material Receive Report Audit Ledger",
        "headers": ["MRR ID", "MRR Date", "Supplier Profile", "PO Ref", "Inv Qty", "Received Qty", "Variance Qty", "Audit Status"],
        "keys": ["id", "date", "supplier", "po", "invQty", "recQty", "varQty", "status"],
        "add_text": "Run MRR Audit",
        "data": [
            {"id": "MRR-2026-0820", "date": "2026-08-20", "supplier": "Apex Textile Chemical Ltd", "po": "PO-2026-00482", "invQty": "3,500 Ltr", "recQty": "3,500 Ltr", "varQty": "0", "status": "Verified"},
            {"id": "MRR-2026-0822", "date": "2026-08-22", "supplier": "Zhejiang Yarn Spinning Co.", "po": "PO-2026-00481", "invQty": "12,000 Kg", "recQty": "11,950 Kg", "varQty": "-50 Kg", "status": "Under Review"},
        ]
    },
    {
        "route": "procurement-audit-landed-cost",
        "title": "Update Product Landed Cost Sheet",
        "headers": ["Item ID", "PO Reference", "Supplier", "Purchase price ($)", "Customs Duty ($)", "Freight/Ports ($)", "Total Landed Cost ($)", "Status"],
        "keys": ["id", "po", "supplier", "price", "duty", "freight", "landed", "status"],
        "add_text": "Update Cost Sheet",
        "data": [
            {"id": "YRN-30s-01", "po": "PO-2026-00481", "supplier": "Zhejiang Yarn Spinning Co.", "price": "44,400.00", "duty": "12,200.00", "freight": "3,500.00", "landed": "60,100.00", "status": "Approved"},
        ]
    },
    {
        "route": "procurement-audit-bill",
        "title": "Bill Audit & Verification Log",
        "headers": ["Audit ID", "Bill Number", "Supplier", "Bill Value", "Voucher Number", "Audited By", "Audit status"],
        "keys": ["id", "bill", "supplier", "value", "voucher", "by", "status"],
        "add_text": "Verify Vouchers",
        "data": [
            {"id": "AUD-BIL-0982", "bill": "BIL-2026-0078", "supplier": "Apex Textile Chemical Ltd", "value": "৳1,520,000.00", "voucher": "V-CHM-0089", "by": "Audit Team A", "status": "Audit Complete"},
        ]
    },

    # Reports
    {
        "route": "procurement-reports-purchase-price",
        "title": "Purchase Price Trend & Analysis Report",
        "headers": ["Item Code", "Item Category", "Last Purchase Rate", "Average Rate", "Min Purchase Rate", "Max Purchase Rate", "Price Trend"],
        "keys": ["id", "category", "last", "avg", "min", "max", "status"],
        "add_text": "Generate Chart",
        "data": [
            {"id": "YRN-30s-01", "category": "Yarn", "last": "$3.70/Kg", "avg": "$3.52/Kg", "min": "$3.20/Kg", "max": "$3.80/Kg", "status": "Upward Trend"},
            {"id": "CHM-DYE-91", "category": "Chemicals", "last": "৳650.00/Kg", "avg": "৳640.00/Kg", "min": "৳610.00/Kg", "max": "৳670.00/Kg", "status": "Stable"},
        ]
    },
    {
        "route": "procurement-reports-payment-statement",
        "title": "Supplier Payment Statement Ledger",
        "headers": ["Supplier Code", "Supplier Name", "Total Bill Billed", "Total Payment Settled", "Outstanding Balance", "Last Payment Date"],
        "keys": ["id", "name", "billed", "settled", "balance", "date"],
        "add_text": "Print Statements",
        "data": [
            {"id": "SUP-ATC-001", "name": "Apex Textile Chemical Ltd", "billed": "৳4,800,000.00", "settled": "৳4,000,000.00", "balance": "৳800,000.00", "date": "2026-08-24"},
            {"id": "SUP-ZYS-204", "name": "Zhejiang Yarn Spinning Co.", "billed": "$120,000.00", "settled": "$120,000.00", "balance": "$0.00", "date": "2026-08-23"},
        ]
    },
    {
        "route": "procurement-reports-yarn-booking-pi",
        "title": "Yarn Booking & PI Status Grid Summary",
        "headers": ["Booking ID", "Order Ref", "Buyer Profile", "Yarn Count Required", "Booking Qty (Kg)", "PI Rec. Qty (Kg)", "PI Status"],
        "keys": ["id", "order", "buyer", "count", "bQty", "piQty", "status"],
        "add_text": "Export status report",
        "data": [
            {"id": "BK-YRN-2601", "order": "ORD-2026-8910", "buyer": "H&M Group", "count": "30s Carded", "bQty": "15,000 Kg", "piQty": "12,000 Kg", "status": "Partial PI Rec."},
        ]
    },
    {
        "route": "procurement-reports-dnc-rate",
        "title": "DNC Variance Rate Report",
        "headers": ["Item ID", "PO Reference", "Actual DNC ($)", "Budgeted DNC ($)", "Variance DNC ($)", "Variance Percentage", "DNC Status"],
        "keys": ["id", "po", "actual", "budget", "variance", "percentage", "status"],
        "add_text": "Run Cost audit",
        "data": [
            {"id": "YRN-30s-01", "po": "PO-2026-00481", "actual": "3.70/Kg", "budget": "3.50/Kg", "variance": "+0.20", "percentage": "+5.71%", "status": "Over Budget"},
        ]
    },
    {
        "route": "procurement-reports-combined-po-statement",
        "title": "Combined PO Statements Ledger Sheet",
        "headers": ["Combined Ref", "Date Created", "PO Registry Count", "Combined Value", "Assigned Bank", "Customs clearance Ref", "Status"],
        "keys": ["id", "date", "poCount", "value", "bank", "clearance", "status"],
        "add_text": "Generate Combined Statement",
        "data": [
            {"id": "COMB-PO-26-01", "date": "2026-08-24", "poCount": "3 POs Included", "value": "$54,150.00", "bank": "Eastern Bank Ltd", "clearance": "C-902- Banani", "status": "Active"},
        ]
    },

    # Comparison Sheet
    {
        "route": "procurement-cs-supplier-items",
        "title": "Supplier Items Mapping Directory",
        "headers": ["Mapping ID", "Item Name", "Item Category", "Assigned Supplier", "Supplier Item Code", "DNC Rate Quote", "Status"],
        "keys": ["id", "name", "category", "supplier", "code", "rate", "status"],
        "add_text": "Map Supplier Item",
        "data": [
            {"id": "MAP-0912", "name": "Reactive Dyes Yellow", "category": "Chemicals", "supplier": "Apex Textile Chemical Ltd", "code": "ATC-CHM-YELLOW", "rate": "৳650.00/Kg", "status": "Active"},
        ]
    },
    {
        "route": "procurement-cs-create-batch",
        "title": "Create Comparison Sheet Batch Setup",
        "headers": ["Requisition ID", "Item Description", "Category", "Target Deadline", "Expected Quotes", "Assigned Analyst", "Action"],
        "keys": ["id", "desc", "category", "date", "quotes", "analyst", "status"],
        "add_text": "Create CS Batch",
        "data": [
            {"id": "REQ-2026-091", "desc": "30s Carded Cotton Yarn", "category": "Yarn", "date": "2026-08-28", "quotes": "3 Quotes Required", "analyst": "M. Kabir", "status": "Draft"},
        ]
    },
    {
        "route": "procurement-cs-batch-list",
        "title": "Comparison Sheet Batches Registry",
        "headers": ["Batch ID", "Item Category", "Quotes Received", "Min Price Offered", "Max Price Offered", "Winning Supplier", "CS Status"],
        "keys": ["id", "category", "quotes", "min", "max", "winner", "status"],
        "add_text": "Initiate CS Batch",
        "data": [
            {"id": "CS-2026-YRN4", "category": "Yarn", "quotes": "3 Received", "min": "$3.40/Kg", "max": "$3.80/Kg", "winner": "Zhejiang Yarn Spinning Co.", "status": "Under Review"},
            {"id": "CS-2026-CHM12", "category": "Chemicals", "quotes": "4 Received", "min": "৳620.00/Kg", "max": "৳690.00/Kg", "winner": "Apex Textile Chemical Ltd", "status": "Approved"},
        ]
    },
    {
        "route": "procurement-cs-supplier-price",
        "title": "Supplier Quotes Price List Ledger",
        "headers": ["Quote ID", "Supplier", "Item Reference", "Quote Price", "Currency", "Delivery terms offered", "Validation status"],
        "keys": ["id", "supplier", "item", "price", "currency", "terms", "status"],
        "add_text": "Import Quote",
        "data": [
            {"id": "QT-901A", "supplier": "Zhejiang Yarn Spinning Co.", "item": "30s Carded Yarn", "price": "3.70", "currency": "USD", "terms": "FOB Shanghai", "status": "Verified"},
            {"id": "QT-901B", "supplier": "Apex Textile Chemical Ltd", "item": "30s Carded Yarn (Local)", "price": "3.90", "currency": "USD", "terms": "LDP Factory", "status": "Verified"},
        ]
    },
    {
        "route": "procurement-cs-create-workorder",
        "title": "Auto Workorder Generation Center",
        "headers": ["Winner Quote ID", "Supplier Name", "CS Batch ID", "Final Net Cost", "Landed cost estimate ($)", "Generate Workorder Link"],
        "keys": ["id", "supplier", "batch", "cost", "landed", "status"],
        "add_text": "Auto Create Workorder",
        "data": [
            {"id": "QT-901A", "supplier": "Zhejiang Yarn Spinning Co.", "batch": "CS-2026-YRN4", "cost": "$44,400.00", "landed": "$60,100.00", "status": "Create Workorder"},
        ]
    }
]

# React TSX Template for static routes
template = """import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  ShoppingCart,
  DollarSign,
  FileSpreadsheet,
  Printer,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/%(route)s")({
  head: () => ({
    meta: [
      { title: "%(title)s — CRIPTON Procurement" },
      { name: "description", content: "%(title)s dynamic mock database console." },
    ],
  }),
  component: %(component_name)s,
});

function %(component_name)s() {
  const [searchQuery, setSearchQuery] = useState("");

  const tableHeaders = %(headers_json)s;
  const columnKeys = %(keys_json)s;
  const initialData = %(data_json)s;

  const [tableData] = useState<any[]>(initialData);

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      return Object.values(row).some((val) => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [tableData, searchQuery]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <ProcurementTopbar />
        
        <div className="p-3.5 md:p-4.5 lg:p-5 space-y-4 lg:space-y-5 w-full max-w-[1600px] mx-auto">
          {/* Header breadcrumbs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/45 pb-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                <ShoppingCart className="size-5.5 text-amber-500" />
                %(title)s
              </h2>
              <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-semibold">
                Procurement Management Workspace &gt; <span className="text-amber-500 font-bold">%(title)s</span>
              </p>
            </div>
          </div>

          {/* Table toolbar & search filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 bg-card border border-border/80 p-3.5 rounded-2xl shadow-xs">
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-4 h-9 rounded-lg bg-muted/40 border border-border/60 focus:border-amber-500/80 focus:bg-card focus:ring-4 focus:ring-amber-500/10 outline-none text-xs transition-all font-bold"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button className="h-9 px-3.5 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-lg transition-colors border border-border/80 flex items-center gap-1.5 cursor-pointer">
                  <SlidersHorizontal className="size-3.5" /> Filters
                </button>
                <button className="h-9 px-3.5 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-lg transition-colors border border-border/80 flex items-center gap-1.5 cursor-pointer">
                  <Printer className="size-3.5" /> Print
                </button>
                <button className="h-9 px-3.5 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-lg transition-colors border border-border/80 flex items-center gap-1.5 cursor-pointer">
                  <FileSpreadsheet className="size-3.5" /> Export Excel
                </button>
                <button className="h-9 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <Plus className="size-4" /> %(add_text)s
                </button>
              </div>
            </div>

            {/* High Fidelity Table */}
            <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="px-4.5 py-3 border-b border-border/40 bg-muted/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-muted-foreground/75 tracking-wider">
                    Records List
                  </span>
                  <span className="bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-amber-500/20">
                    {filteredData.length} records found
                  </span>
                </div>
                <div className="text-[9.5px] text-muted-foreground/60 font-semibold font-sans">
                  Columns are auto-configured with default CRIPTON styles.
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/40">
                      {tableHeaders.map((header: string) => (
                        <th key={header} className="px-4.5 py-3.5 font-bold border-r border-border/20 last:border-r-0">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/45">
                    {filteredData.map((row: any) => (
                      <tr key={row.id || row.piNo || row.poNo || row.billNo} className="group hover:bg-muted/15 transition-colors cursor-pointer">
                        {columnKeys.map((key: string) => {
                          const value = row[key];
                          const isStatus = key === "status";

                          return (
                            <td key={key} className="px-4.5 py-3.5 font-medium border-r border-border/20 last:border-r-0 max-w-[220px] truncate">
                              {isStatus ? (
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
                                  value === "Approved" || value === "Active" || value === "Audit Complete" || value === "Verified"
                                    ? "bg-success/15 text-success-foreground"
                                    : value === "Draft"
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                                }`}>
                                  {value}
                                </span>
                              ) : (
                                <span className={key === "id" || key === "poNo" || key === "piNo" || key === "billNo" ? "font-bold text-amber-500" : "text-foreground"}>
                                  {value}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <footer className="pt-6 pb-2 text-center text-[10px] font-medium text-muted-foreground/60 border-t border-border/20">
            © 2026 CRIPTON Procurement Management Portal — built with CRIPTON HRIS premium components.
          </footer>
        </div>
      </main>
    </div>
  );
}
"""

def generate_files():
    routes_dir = "/Volumes/Office Files/1. Projects/criptonhris/src/routes"
    os.makedirs(routes_dir, exist_ok=True)
    
    for page in pages:
        route_name = page["route"]
        # Convert route slug like procurement-config-currency-rate to PascalCase component name ProcurementConfigCurrencyRatePage
        parts = route_name.split("-")
        component_name = "".join(p.capitalize() for p in parts) + "Page"
        
        file_content = template % {
            "route": route_name,
            "title": page["title"],
            "component_name": component_name,
            "add_text": page["add_text"],
            "headers_json": json.dumps(page["headers"]),
            "keys_json": json.dumps(page["keys"]),
            "data_json": json.dumps(page["data"], indent=4)
        }
        
        file_path = os.path.join(routes_dir, f"{route_name}.tsx")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(file_content)
        print(f"Generated static route: {file_path}")

if __name__ == "__main__":
    generate_files()
