/**
 * Supplier Quotation Portal - Mock Data & Calculation Engine
 * Realistic procurement records with multiple statuses and history
 */

import {
  CSItem,
  CSInfo,
  SupplierInvitationRecord,
  ItemQuotationEntry,
  CalculatedItemValues,
  OverallQuotation,
  FinancialSummary,
  QuotationSnapshot,
} from "./types";

/**
 * Item-wise financial calculation adhering strictly to procurement rules:
 * Gross Amount = Required Quantity * Unit Price
 * Discount Amount = Gross Amount * Discount % / 100
 * Taxable Amount = Gross Amount - Discount Amount
 * VAT Amount = Taxable Amount * VAT % / 100
 * TAX Amount = Taxable Amount * TAX % / 100
 * Final Item Amount = Taxable Amount + VAT Amount + TAX Amount
 */
export function calculateItemValues(
  item: CSItem,
  entry?: ItemQuotationEntry,
): CalculatedItemValues {
  const qty = item.requiredQuantity || 0;
  if (!entry || entry.status === "Not Quoted") {
    return {
      requiredQuantity: qty,
      unitPrice: 0,
      grossAmount: 0,
      discountAmount: 0,
      taxableAmount: 0,
      vatAmount: 0,
      taxAmount: 0,
      finalItemAmount: 0,
    };
  }

  const unitPrice = Math.max(0, Number(entry.unitPrice) || 0);
  const grossAmount = qty * unitPrice;

  const discountPercent = Math.max(0, Math.min(100, Number(entry.discountPercent) || 0));
  const discountAmount = (grossAmount * discountPercent) / 100;
  const taxableAmount = Math.max(0, grossAmount - discountAmount);

  const vatPercent = Math.max(0, Number(entry.vatPercent) || 0);
  const vatAmount = (taxableAmount * vatPercent) / 100;

  const taxPercent = Math.max(0, Number(entry.taxPercent) || 0);
  const taxAmount = (taxableAmount * taxPercent) / 100;

  const finalItemAmount = taxableAmount + vatAmount + taxAmount;

  return {
    requiredQuantity: qty,
    unitPrice,
    grossAmount,
    discountAmount,
    taxableAmount,
    vatAmount,
    taxAmount,
    finalItemAmount,
  };
}

/**
 * Calculates complete live financial summary across all items and overall pricing adjustments
 */
export function calculateFinancialSummary(
  items: CSItem[],
  itemQuotes: Record<string, ItemQuotationEntry>,
  overall: OverallQuotation,
): FinancialSummary {
  let quotedItemsCount = 0;
  let notQuotedItemsCount = 0;
  let itemWiseGrossTotal = 0;
  let itemWiseDiscountTotal = 0;
  let itemWiseTaxableTotal = 0;
  let itemWiseVatTotal = 0;
  let itemWiseTaxTotal = 0;
  let itemWiseFinalTotal = 0;

  items.forEach((item) => {
    const quote = itemQuotes[item.itemId];
    if (quote && quote.status === "Quoted") {
      quotedItemsCount++;
      const calc = calculateItemValues(item, quote);
      itemWiseGrossTotal += calc.grossAmount;
      itemWiseDiscountTotal += calc.discountAmount;
      itemWiseTaxableTotal += calc.taxableAmount;
      itemWiseVatTotal += calc.vatAmount;
      itemWiseTaxTotal += calc.taxAmount;
      itemWiseFinalTotal += calc.finalItemAmount;
    } else {
      notQuotedItemsCount++;
    }
  });

  // Overall Discount calculation
  let overallDiscountAmount = 0;
  if (overall.discountType === "Percentage") {
    const pct = Math.max(0, Math.min(100, Number(overall.discountValue) || 0));
    overallDiscountAmount = (itemWiseTaxableTotal * pct) / 100;
  } else {
    overallDiscountAmount = Math.min(
      itemWiseTaxableTotal,
      Math.max(0, Number(overall.discountValue) || 0),
    );
  }

  const baseForOverallTaxes = Math.max(0, itemWiseTaxableTotal - overallDiscountAmount);

  // Overall VAT & TAX (AIT)
  const overallVatAmount =
    (baseForOverallTaxes * Math.max(0, Number(overall.vatPercent) || 0)) / 100;
  const overallTaxAmount =
    (baseForOverallTaxes * Math.max(0, Number(overall.taxPercent) || 0)) / 100;

  // Additional Charges
  const transportationCharges = Math.max(0, Number(overall.transportationCharges) || 0);
  const installationCharges = Math.max(0, Number(overall.installationCharges) || 0);
  const otherCharges = Math.max(0, Number(overall.otherCharges) || 0);

  // Net Quotation Amount
  // If item-level VAT/TAX was already computed, we sum them cleanly:
  const netQuotationAmount =
    baseForOverallTaxes +
    itemWiseVatTotal +
    itemWiseTaxTotal +
    overallVatAmount +
    overallTaxAmount +
    transportationCharges +
    installationCharges +
    otherCharges;

  return {
    totalItems: items.length,
    quotedItemsCount,
    notQuotedItemsCount,
    itemWiseGrossTotal,
    itemWiseDiscountTotal,
    itemWiseTaxableTotal,
    itemWiseVatTotal,
    itemWiseTaxTotal,
    itemWiseFinalTotal,
    overallDiscountAmount,
    overallVatAmount,
    overallTaxAmount,
    transportationCharges,
    installationCharges,
    otherCharges,
    netQuotationAmount,
  };
}

/**
 * Creates snapshot of current quotation
 */
export function createQuotationSnapshot(
  invitation: SupplierInvitationRecord,
): QuotationSnapshot {
  const finSummary = calculateFinancialSummary(
    invitation.items,
    invitation.currentQuotation.itemQuotes,
    invitation.currentQuotation.overallQuote,
  );

  return {
    quotationReference: invitation.currentQuotation.quotationReference,
    version: invitation.currentQuotation.version,
    submittedAt: invitation.currentQuotation.submittedAt || new Date().toISOString(),
    status: invitation.currentQuotation.status,
    itemQuotes: JSON.parse(JSON.stringify(invitation.currentQuotation.itemQuotes)),
    overallQuote: JSON.parse(JSON.stringify(invitation.currentQuotation.overallQuote)),
    commercialTerms: JSON.parse(JSON.stringify(invitation.currentQuotation.commercialTerms)),
    attachments: JSON.parse(JSON.stringify(invitation.currentQuotation.attachments)),
    supplierContact: JSON.parse(JSON.stringify(invitation.supplierContact)),
    financialSummary: finSummary,
    declarationAccepted: invitation.currentQuotation.declarationAccepted,
  };
}

// -------------------------------------------------------------
// SEED INVITATIONS
// -------------------------------------------------------------

export const SEED_INVITATIONS: SupplierInvitationRecord[] = [
  // 1. Apex Textile Chemicals (Draft status with realistic chemical & auxiliaries CS)
  {
    invitationToken: "inv_apex_textiles_2026",
    invitationStatus: "Draft",
    invitationSentDate: "2026-11-08T09:30:00Z",
    firstOpenedDate: "2026-11-08T11:15:00Z",
    lastUpdatedDate: "2026-11-14T10:00:00Z",
    csInfo: {
      csNumber: "CS-2026-000891",
      csDate: "2026-11-06",
      csSubject:
        "Procurement of Industrial Reactive Dyes, Eco-friendly Leveling Agents & Cationic Softeners for Dyeing Unit 3",
      department: "Textile Processing & Wet Finishing",
      deliveryLocation: "Pakiza Knit Composite Ltd, Central Chemical Warehouse, Gorai, Tangail",
      currency: "BDT",
      submissionDeadline: "2026-11-28T18:00:00",
      generalRequirements:
        "All supplied chemicals must be OEKO-TEX Standard 100 (Class 1) and ZDHC Level 3 certified. Certificate of Analysis (COA) and Technical Data Sheet (TDS) are required with delivery.",
      invitationReference: "RFQ-CRIPTON-2026-CHM-041",
      supportingDocuments: [
        {
          id: "cs-doc-1",
          name: "CS-2026-000891-Specifications-Matrix.pdf",
          size: "480 KB",
          type: "application/pdf",
        },
        {
          id: "cs-doc-2",
          name: "Standard-Procurement-Commercial-Clauses-2026.pdf",
          size: "260 KB",
          type: "application/pdf",
        },
      ],
    },
    items: [
      {
        sl: 1,
        itemId: "item-chm-01",
        itemCode: "CHM-DYE-101",
        itemName: "Novacron Deep Black W-NN Reactive Dye",
        specification:
          "High build-up reactive black powder, wash-fastness grade 4-5, suitable for exhaust dyeing at 60°C",
        requiredQuantity: 2500,
        uom: "KG",
        category: "Dyestuff",
      },
      {
        sl: 2,
        itemId: "item-chm-02",
        itemCode: "CHM-AUX-204",
        itemName: "Ultravon PRE Wetting & Scouring Agent",
        specification:
          "Concentrated low-foaming biodegradable non-ionic surfactant, APEO/NPEO-free, pH 6.0-7.5",
        requiredQuantity: 1800,
        uom: "KG",
        category: "Auxiliary",
      },
      {
        sl: 3,
        itemId: "item-chm-03",
        itemCode: "CHM-SFT-309",
        itemName: "Megasoft JET-50 Hydrophilic Silicone Softener",
        specification:
          "Micro-emulsion silicone, excellent drapability and soft touch, non-yellowing on optical white fabric",
        requiredQuantity: 1200,
        uom: "KG",
        category: "Softener",
      },
      {
        sl: 4,
        itemId: "item-chm-04",
        itemCode: "CHM-FIX-415",
        itemName: "Albafix WFF Formaldehyde-Free Dye Fixing Agent",
        specification:
          "Polyquaternary amine based, improves wet fastness without shade change, ZDHC Level 3 registered",
        requiredQuantity: 800,
        uom: "KG",
        category: "Fixing Agent",
      },
    ],
    supplierMaster: {
      supplierCode: "SUP-TEX-0042",
      supplierName: "Apex Textile Chemicals Ltd",
    },
    supplierContact: {
      contactPerson: "Engr. Mahmudul Hasan",
      designation: "Director - Key Accounts & Industrial Sales",
      email: "m.hasan@apextexchem.com",
      mobile: "+880 1713-882299",
      officeAddress: "Plot 18, Road 11, Block-D, Banani Commercial Area, Dhaka-1213",
      country: "Bangladesh",
    },
    currentQuotation: {
      quotationReference: "QT-APEX-2026-0891-V1",
      version: 1,
      status: "Draft",
      itemQuotes: {
        "item-chm-01": {
          itemId: "item-chm-01",
          status: "Quoted",
          offeredBrand: "Novacron (Huntsman)",
          offeredOrigin: "Switzerland / Singapore",
          unitPrice: 850,
          discountPercent: 3.5,
          vatPercent: 7.5,
          taxPercent: 3.0,
          deliveryLeadTimeDays: 7,
          warrantyPeriodMonths: 12,
          remarks: "Standard 25kg original UN approved tamper-proof fiber drums with inner liner",
        },
        "item-chm-02": {
          itemId: "item-chm-02",
          status: "Quoted",
          offeredBrand: "Ultravon (Archroma)",
          offeredOrigin: "Germany",
          unitPrice: 320,
          discountPercent: 2.0,
          vatPercent: 7.5,
          taxPercent: 3.0,
          deliveryLeadTimeDays: 5,
          warrantyPeriodMonths: 12,
          remarks: "Ex-stock Dhaka warehouse ready for immediate dispatch",
        },
        "item-chm-03": {
          itemId: "item-chm-03",
          status: "Quoted",
          offeredBrand: "Megasoft (CHT Group)",
          offeredOrigin: "Germany",
          unitPrice: 540,
          discountPercent: 0,
          vatPercent: 7.5,
          taxPercent: 3.0,
          deliveryLeadTimeDays: 10,
          warrantyPeriodMonths: 12,
          remarks: "Supplied with Lot-specific Certificate of Analysis",
        },
        "item-chm-04": {
          itemId: "item-chm-04",
          status: "Not Quoted",
          offeredBrand: "",
          offeredOrigin: "",
          unitPrice: 0,
          discountPercent: 0,
          vatPercent: 0,
          taxPercent: 0,
          deliveryLeadTimeDays: 0,
          warrantyPeriodMonths: 0,
          remarks: "Currently out of stock from European principal until December",
        },
      },
      overallQuote: {
        discountType: "Percentage",
        discountValue: 1.5,
        vatPercent: 0,
        taxPercent: 0,
        transportationCharges: 12000,
        installationCharges: 0,
        otherCharges: 2500,
        remarks:
          "Includes door-to-door delivery with specialized temperature-controlled covered transport. Special handling charge included.",
      },
      commercialTerms: {
        paymentTerms: "30 Days Credit from Date of Final Quality Inspection & GRN",
        deliveryTerms: "Delivered at Place (DAP) - Pakiza Gorai Factory Compound",
        overallLeadTimeDays: 10,
        warrantyTerms: "12 Months shelf life from date of manufacturing with free replacement for any settling",
        installationIncluded: false,
        transportationIncluded: true,
        afterSalesService: true,
        offerValidity: "30 Days from submission",
        specialConditions:
          "Prices are fixed and firm during the contract validity period. No foreign exchange fluctuation surcharge will be claimed.",
        additionalNotes:
          "Emergency dispatch available on 24 hours call for backup quantities up to 500kg.",
      },
      attachments: [
        {
          id: "att-1",
          category: "Official Quotation (PDF)",
          fileName: "Apex-Official-Quotation-QT-2026-0891.pdf",
          fileType: "application/pdf",
          fileSize: 345000,
          fileSizeFormatted: "345 KB",
          uploadedAt: "2026-11-12T14:20:00Z",
        },
        {
          id: "att-2",
          category: "Technical Specification",
          fileName: "Novacron-Megasoft-Technical-DataSheets.pdf",
          fileType: "application/pdf",
          fileSize: 820000,
          fileSizeFormatted: "820 KB",
          uploadedAt: "2026-11-12T14:25:00Z",
        },
      ],
      declarationAccepted: true,
    },
    revisionHistory: [],
  },

  // 2. Global Dyes & Auxiliaries BV (Submitted status with read-only lock, ready to test Revision Request workflow)
  {
    invitationToken: "inv_dyes_chem_global",
    invitationStatus: "Submitted",
    invitationSentDate: "2026-11-08T09:30:00Z",
    firstOpenedDate: "2026-11-09T08:20:00Z",
    lastUpdatedDate: "2026-11-13T16:45:00Z",
    csInfo: {
      csNumber: "CS-2026-000891",
      csDate: "2026-11-06",
      csSubject:
        "Procurement of Industrial Reactive Dyes, Eco-friendly Leveling Agents & Cationic Softeners for Dyeing Unit 3",
      department: "Textile Processing & Wet Finishing",
      deliveryLocation: "Pakiza Knit Composite Ltd, Central Chemical Warehouse, Gorai, Tangail",
      currency: "BDT",
      submissionDeadline: "2026-11-28T18:00:00",
      generalRequirements:
        "All supplied chemicals must be OEKO-TEX Standard 100 (Class 1) and ZDHC Level 3 certified. Certificate of Analysis (COA) and Technical Data Sheet (TDS) are required with delivery.",
      invitationReference: "RFQ-CRIPTON-2026-CHM-041",
      supportingDocuments: [
        {
          id: "cs-doc-1",
          name: "CS-2026-000891-Specifications-Matrix.pdf",
          size: "480 KB",
          type: "application/pdf",
        },
      ],
    },
    items: [
      {
        sl: 1,
        itemId: "item-chm-01",
        itemCode: "CHM-DYE-101",
        itemName: "Novacron Deep Black W-NN Reactive Dye",
        specification:
          "High build-up reactive black powder, wash-fastness grade 4-5, suitable for exhaust dyeing at 60°C",
        requiredQuantity: 2500,
        uom: "KG",
        category: "Dyestuff",
      },
      {
        sl: 2,
        itemId: "item-chm-02",
        itemCode: "CHM-AUX-204",
        itemName: "Ultravon PRE Wetting & Scouring Agent",
        specification:
          "Concentrated low-foaming biodegradable non-ionic surfactant, APEO/NPEO-free, pH 6.0-7.5",
        requiredQuantity: 1800,
        uom: "KG",
        category: "Auxiliary",
      },
      {
        sl: 3,
        itemId: "item-chm-03",
        itemCode: "CHM-SFT-309",
        itemName: "Megasoft JET-50 Hydrophilic Silicone Softener",
        specification:
          "Micro-emulsion silicone, excellent drapability and soft touch, non-yellowing on optical white fabric",
        requiredQuantity: 1200,
        uom: "KG",
        category: "Softener",
      },
      {
        sl: 4,
        itemId: "item-chm-04",
        itemCode: "CHM-FIX-415",
        itemName: "Albafix WFF Formaldehyde-Free Dye Fixing Agent",
        specification:
          "Polyquaternary amine based, improves wet fastness without shade change, ZDHC Level 3 registered",
        requiredQuantity: 800,
        uom: "KG",
        category: "Fixing Agent",
      },
    ],
    supplierMaster: {
      supplierCode: "SUP-CHM-0108",
      supplierName: "Global Dyes & Auxiliaries BV",
    },
    supplierContact: {
      contactPerson: "Kazi Farhad Ahmed",
      designation: "Country General Manager - Commercial",
      email: "farhad.ahmed@globaldyes.nl",
      mobile: "+880 1819-334455",
      officeAddress: "Navana Tower (Level 14), 45 Gulshan South Avenue, Gulshan-1, Dhaka",
      country: "Bangladesh",
    },
    currentQuotation: {
      quotationReference: "QT-GDA-2026-0891-V1",
      version: 1,
      status: "Submitted",
      submittedAt: "2026-11-13T16:45:00Z",
      declarationAccepted: true,
      itemQuotes: {
        "item-chm-01": {
          itemId: "item-chm-01",
          status: "Quoted",
          offeredBrand: "Everzol Black ED-G",
          offeredOrigin: "Taiwan",
          unitPrice: 830,
          discountPercent: 2.0,
          vatPercent: 7.5,
          taxPercent: 3.0,
          deliveryLeadTimeDays: 14,
          warrantyPeriodMonths: 18,
          remarks: "Direct bulk import from Everlight Chemical Industrial Corp",
        },
        "item-chm-02": {
          itemId: "item-chm-02",
          status: "Quoted",
          offeredBrand: "Dianix Wet Ultra",
          offeredOrigin: "South Korea",
          unitPrice: 305,
          discountPercent: 1.5,
          vatPercent: 7.5,
          taxPercent: 3.0,
          deliveryLeadTimeDays: 7,
          warrantyPeriodMonths: 12,
          remarks: "Fully compliant with bluesign and ZDHC Gateway Level 3",
        },
        "item-chm-03": {
          itemId: "item-chm-03",
          status: "Quoted",
          offeredBrand: "Sera Soft M-Fluid",
          offeredOrigin: "Germany / Dystar",
          unitPrice: 515,
          discountPercent: 2.0,
          vatPercent: 7.5,
          taxPercent: 3.0,
          deliveryLeadTimeDays: 10,
          warrantyPeriodMonths: 12,
          remarks: "High stability against high shear force in jet dyeing vessels",
        },
        "item-chm-04": {
          itemId: "item-chm-04",
          status: "Quoted",
          offeredBrand: "Sera Fast N-BS",
          offeredOrigin: "Germany / Dystar",
          unitPrice: 460,
          discountPercent: 1.0,
          vatPercent: 7.5,
          taxPercent: 3.0,
          deliveryLeadTimeDays: 10,
          warrantyPeriodMonths: 12,
          remarks: "Formaldehyde-free cat-ionic fixing auxiliary",
        },
      },
      overallQuote: {
        discountType: "Percentage",
        discountValue: 2.0,
        vatPercent: 0,
        taxPercent: 0,
        transportationCharges: 10000,
        installationCharges: 0,
        otherCharges: 0,
        remarks: "Comprehensive package rate for all 4 items with bundled free factory delivery.",
      },
      commercialTerms: {
        paymentTerms: "45 Days Credit via Account Payee Cheque against Original VAT Challan",
        deliveryTerms: "Delivered at Place (DAP) - Factory Gate",
        overallLeadTimeDays: 14,
        warrantyTerms: "18 Months standard manufacturer warranty with technical service support",
        installationIncluded: false,
        transportationIncluded: true,
        afterSalesService: true,
        offerValidity: "45 Days from submission",
        specialConditions:
          "Free technical demonstration and trial run assistance by our certified chemical textile engineer.",
        additionalNotes: "Minimum order replenishment lead time 5 working days.",
      },
      attachments: [
        {
          id: "att-gd-1",
          category: "Official Quotation (PDF)",
          fileName: "GlobalDyes-Quotation-QT-GDA-2026-0891-V1.pdf",
          fileType: "application/pdf",
          fileSize: 420000,
          fileSizeFormatted: "420 KB",
          uploadedAt: "2026-11-13T16:30:00Z",
        },
        {
          id: "att-gd-2",
          category: "Company Profile",
          fileName: "Global-Dyes-Credentials-ZDHC-Certification.pdf",
          fileType: "application/pdf",
          fileSize: 1100000,
          fileSizeFormatted: "1.1 MB",
          uploadedAt: "2026-11-13T16:35:00Z",
        },
      ],
    },
    revisionHistory: [],
  },

  // 3. EuroTech Knit Machinery (Revision Approved status with historical Version 1)
  {
    invitationToken: "inv_knitwear_machinery",
    invitationStatus: "Revision Approved",
    invitationSentDate: "2026-10-25T10:00:00Z",
    firstOpenedDate: "2026-10-25T11:40:00Z",
    lastUpdatedDate: "2026-11-14T11:00:00Z",
    csInfo: {
      csNumber: "CS-2026-000945",
      csDate: "2026-10-24",
      csSubject:
        "Supply of High-Speed Circular Knitting Machine Spares, Ceramic Feeders & Inverter Drive Modules",
      department: "Knitting Unit Maintenance & Engineering",
      deliveryLocation: "Pakiza Knit Composite Ltd, Knitting Store, Mirzapur, Tangail",
      currency: "BDT",
      submissionDeadline: "2026-11-20T17:00:00",
      generalRequirements:
        "All spare parts must be 100% genuine OEM components from Terrot or Mayer & Cie certified distributors. Serial number verification certificates required.",
      invitationReference: "RFQ-CRIPTON-2026-MCH-019",
      supportingDocuments: [
        {
          id: "cs-doc-mch-1",
          name: "CS-000945-Technical-Drawings-Knitting-Spares.pdf",
          size: "1.4 MB",
          type: "application/pdf",
        },
      ],
    },
    items: [
      {
        sl: 1,
        itemId: "item-mch-01",
        itemCode: "MCH-SP-501",
        itemName: "Ceramic Positive Yarn Feeder MPF-20 L1",
        specification:
          "Memminger-IRO original yarn feeder with stop-motion sensor and dual tension discs",
        requiredQuantity: 60,
        uom: "PCS",
        category: "Knitting Feeder",
      },
      {
        sl: 2,
        itemId: "item-mch-02",
        itemCode: "MCH-SP-502",
        itemName: "Groz-Beckert Vo-Spec 71.70 G01 Latch Needles",
        specification:
          "High performance cylinder latch needles for 28-Gauge single jersey circular knitting",
        requiredQuantity: 5000,
        uom: "PCS",
        category: "Needles",
      },
      {
        sl: 3,
        itemId: "item-mch-03",
        itemCode: "MCH-SP-503",
        itemName: "Siemens Sinamics V20 15kW Inverter Drive",
        specification:
          "Heavy duty frequency converter with Modbus RTU communication and BOP operator panel",
        requiredQuantity: 4,
        uom: "UNIT",
        category: "Electronics",
      },
    ],
    supplierMaster: {
      supplierCode: "SUP-ENG-0029",
      supplierName: "EuroTech Knit Machinery Inc.",
    },
    supplierContact: {
      contactPerson: "Tobias Lindqvist",
      designation: "Technical Director - Asia Pacific",
      email: "tobias.l@eurotech-machinery.de",
      mobile: "+880 1711-998877",
      officeAddress: "Swedish Business Centre, Sector 3, Uttara Model Town, Dhaka",
      country: "Bangladesh",
    },
    currentQuotation: {
      quotationReference: "QT-ET-2026-0945-V2",
      version: 2,
      status: "Revision Approved",
      revisionReason:
        "Principal manufacturer updated discount tier for bulk Groz-Beckert needles, allowing us to reduce needle price by 6.5% and shorten lead time.",
      revisionRequestedAt: "2026-11-13T10:00:00Z",
      itemQuotes: {
        "item-mch-01": {
          itemId: "item-mch-01",
          status: "Quoted",
          offeredBrand: "Memminger-IRO",
          offeredOrigin: "Germany",
          unitPrice: 16500,
          discountPercent: 5.0,
          vatPercent: 7.5,
          taxPercent: 3.0,
          deliveryLeadTimeDays: 14,
          warrantyPeriodMonths: 24,
          remarks: "Original German packaging with holograph seal",
        },
        "item-mch-02": {
          itemId: "item-mch-02",
          status: "Quoted",
          offeredBrand: "Groz-Beckert",
          offeredOrigin: "Germany",
          unitPrice: 135,
          discountPercent: 6.5,
          vatPercent: 7.5,
          taxPercent: 3.0,
          deliveryLeadTimeDays: 7,
          warrantyPeriodMonths: 6,
          remarks: "Pack of 500 pcs in corrosion-protected blister packs",
        },
        "item-mch-03": {
          itemId: "item-mch-03",
          status: "Quoted",
          offeredBrand: "Siemens",
          offeredOrigin: "Germany / Czech Rep",
          unitPrice: 142000,
          discountPercent: 3.0,
          vatPercent: 7.5,
          taxPercent: 3.0,
          deliveryLeadTimeDays: 14,
          warrantyPeriodMonths: 24,
          remarks: "Includes parameter commissioning and backup programming",
        },
      },
      overallQuote: {
        discountType: "Percentage",
        discountValue: 2.0,
        vatPercent: 0,
        taxPercent: 0,
        transportationCharges: 15000,
        installationCharges: 25000,
        otherCharges: 0,
        remarks: "Includes full installation and test commissioning of inverter modules on machines.",
      },
      commercialTerms: {
        paymentTerms: "10% Advance, 90% after successful commissioning & test knitting trial",
        deliveryTerms: "Delivered at Place (DAP) including mechanical positioning",
        overallLeadTimeDays: 14,
        warrantyTerms: "24 Months replacement warranty on electronic drive modules, 12 months on feeders",
        installationIncluded: true,
        transportationIncluded: true,
        afterSalesService: true,
        offerValidity: "60 Days from submission",
        specialConditions:
          "European certified factory-trained service engineer will oversee drive installation.",
        additionalNotes: "Full circuit diagrams and spare parts manual included.",
      },
      attachments: [
        {
          id: "att-et-1",
          category: "Official Quotation (PDF)",
          fileName: "EuroTech-Machinery-Quotation-V2-Draft.pdf",
          fileType: "application/pdf",
          fileSize: 490000,
          fileSizeFormatted: "490 KB",
          uploadedAt: "2026-11-14T09:30:00Z",
        },
      ],
      declarationAccepted: true,
    },
    revisionHistory: [
      {
        id: "rev-v1-hist",
        version: 1,
        quotationReference: "QT-ET-2026-0945-V1",
        submittedAt: "2026-10-30T14:15:00Z",
        status: "Submitted",
        revisionReason:
          "Principal manufacturer updated discount tier for bulk Groz-Beckert needles, allowing us to reduce needle price by 6.5% and shorten lead time.",
        revisionRequestedAt: "2026-11-13T10:00:00Z",
        revisionDecision: "Approved",
        decisionRemarks:
          "Commercial review approved revision request to capture price reduction on Groz-Beckert needle lot.",
        decisionDate: "2026-11-14T09:00:00Z",
        snapshot: {
          quotationReference: "QT-ET-2026-0945-V1",
          version: 1,
          submittedAt: "2026-10-30T14:15:00Z",
          status: "Submitted",
          declarationAccepted: true,
          itemQuotes: {
            "item-mch-01": {
              itemId: "item-mch-01",
              status: "Quoted",
              offeredBrand: "Memminger-IRO",
              offeredOrigin: "Germany",
              unitPrice: 16500,
              discountPercent: 3.0,
              vatPercent: 7.5,
              taxPercent: 3.0,
              deliveryLeadTimeDays: 21,
              warrantyPeriodMonths: 24,
              remarks: "Original German packaging with holograph seal",
            },
            "item-mch-02": {
              itemId: "item-mch-02",
              status: "Quoted",
              offeredBrand: "Groz-Beckert",
              offeredOrigin: "Germany",
              unitPrice: 145,
              discountPercent: 0,
              vatPercent: 7.5,
              taxPercent: 3.0,
              deliveryLeadTimeDays: 14,
              warrantyPeriodMonths: 6,
              remarks: "Initial needle unit pricing before bulk tier rebate",
            },
            "item-mch-03": {
              itemId: "item-mch-03",
              status: "Quoted",
              offeredBrand: "Siemens",
              offeredOrigin: "Germany / Czech Rep",
              unitPrice: 142000,
              discountPercent: 0,
              vatPercent: 7.5,
              taxPercent: 3.0,
              deliveryLeadTimeDays: 21,
              warrantyPeriodMonths: 24,
              remarks: "Standard drive unit supply",
            },
          },
          overallQuote: {
            discountType: "Amount",
            discountValue: 0,
            vatPercent: 0,
            taxPercent: 0,
            transportationCharges: 15000,
            installationCharges: 25000,
            otherCharges: 0,
            remarks: "Original submission",
          },
          commercialTerms: {
            paymentTerms: "100% Sight L/C through Prime Bank",
            deliveryTerms: "Delivered at Place (DAP)",
            overallLeadTimeDays: 21,
            warrantyTerms: "12 Months standard warranty",
            installationIncluded: true,
            transportationIncluded: true,
            afterSalesService: true,
            offerValidity: "30 Days from submission",
            specialConditions: "Standard OEM supply conditions.",
            additionalNotes: "None",
          },
          attachments: [],
          supplierContact: {
            contactPerson: "Tobias Lindqvist",
            designation: "Technical Director - Asia Pacific",
            email: "tobias.l@eurotech-machinery.de",
            mobile: "+880 1711-998877",
            officeAddress: "Swedish Business Centre, Sector 3, Uttara Model Town, Dhaka",
            country: "Bangladesh",
          },
          financialSummary: {
            totalItems: 3,
            quotedItemsCount: 3,
            notQuotedItemsCount: 0,
            itemWiseGrossTotal: 2283000,
            itemWiseDiscountTotal: 29700,
            itemWiseTaxableTotal: 2253300,
            itemWiseVatTotal: 168997.5,
            itemWiseTaxTotal: 67599,
            itemWiseFinalTotal: 2489896.5,
            overallDiscountAmount: 0,
            overallVatAmount: 0,
            overallTaxAmount: 0,
            transportationCharges: 15000,
            installationCharges: 25000,
            otherCharges: 0,
            netQuotationAmount: 2529896.5,
          },
        },
      },
    ],
  },

  // 4. Meghna Combed Cotton Mills (Invitation Sent status - fresh invitation not yet started)
  {
    invitationToken: "inv_cotton_yarn_ltd",
    invitationStatus: "Invitation Sent",
    invitationSentDate: "2026-11-14T08:00:00Z",
    lastUpdatedDate: "2026-11-14T08:00:00Z",
    csInfo: {
      csNumber: "CS-2026-001012",
      csDate: "2026-11-13",
      csSubject:
        "Semi-Annual Procurement of 100% Combed Cotton Ring Spun Knitting Yarn 30/1 & 40/1 (Compact)",
      department: "Spinning & Yarn Merchandising",
      deliveryLocation: "Pakiza Knit Composite Ltd, Central Yarn Depot, Gazipur",
      currency: "BDT",
      submissionDeadline: "2026-12-05T17:00:00",
      generalRequirements:
        "Contamination-free virgin Australian/US upland cotton, Uster Statistics top 5% standard, CSP minimum 2850, IPI under 50. Mill test certificate required per lot.",
      invitationReference: "RFQ-CRIPTON-2026-YRN-089",
      supportingDocuments: [
        {
          id: "cs-doc-yrn-1",
          name: "CS-001012-Yarn-Quality-Parameters-Uster.pdf",
          size: "620 KB",
          type: "application/pdf",
        },
      ],
    },
    items: [
      {
        sl: 1,
        itemId: "item-yrn-01",
        itemCode: "YRN-COT-301",
        itemName: "100% Combed Cotton Compact Yarn 30/1",
        specification:
          "Ne 30/1 Compact Ring Spun, CSP > 2900, Hairiness H < 4.2, suitable for 24-28 GG single jersey knitting",
        requiredQuantity: 45000,
        uom: "LBS",
        category: "Combed Yarn",
      },
      {
        sl: 2,
        itemId: "item-yrn-02",
        itemCode: "YRN-COT-401",
        itemName: "100% Combed Cotton Compact Yarn 40/1",
        specification:
          "Ne 40/1 Compact Ring Spun, CSP > 3000, Hairiness H < 3.8, for high-end interlock and rib fabric",
        requiredQuantity: 25000,
        uom: "LBS",
        category: "Combed Yarn",
      },
    ],
    supplierMaster: {
      supplierCode: "SUP-YRN-0015",
      supplierName: "Meghna Combed Cotton Mills Ltd",
    },
    supplierContact: {
      contactPerson: "Alhaj Anisur Rahman",
      designation: "Managing Director",
      email: "anisur.rahman@meghnacotton.com",
      mobile: "+880 1715-667788",
      officeAddress: "Meghna Industrial Park, Sonargaon, Narayanganj",
      country: "Bangladesh",
    },
    currentQuotation: {
      quotationReference: "QT-MCM-2026-1012-V1",
      version: 1,
      status: "Invitation Sent",
      declarationAccepted: false,
      itemQuotes: {},
      overallQuote: {
        discountType: "Percentage",
        discountValue: 0,
        vatPercent: 0,
        taxPercent: 0,
        transportationCharges: 0,
        installationCharges: 0,
        otherCharges: 0,
        remarks: "",
      },
      commercialTerms: {
        paymentTerms: "90 Days Deferred L/C through Authorized Dealer Bank",
        deliveryTerms: "Delivered at Place (DAP) - Factory Yarn Depot",
        overallLeadTimeDays: 15,
        warrantyTerms: "Full replacement guarantee against shade variation, barre, or unevenness",
        installationIncluded: false,
        transportationIncluded: true,
        afterSalesService: false,
        offerValidity: "15 Days from submission",
        specialConditions: "Prompt lot delivery in 50,000 lbs schedule batches.",
        additionalNotes: "",
      },
      attachments: [],
    },
    revisionHistory: [],
  },
];

