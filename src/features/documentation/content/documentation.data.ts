export type DocumentationFeatureKey =
  | "orders"
  | "inventory"
  | "production"
  | "scheduling"
  | "shipments";

export interface DocumentationSection {
  id: string;
  title: string;
  summary: string;
  paragraphs?: string[];
  bullets?: string[];
  callout?: string;
}

export interface DocumentationTerm {
  term: string;
  definition: string;
  whyItMatters: string;
}

export interface DocumentationFeature {
  title: string;
  slug: DocumentationFeatureKey;
  tone: string;
  iconKey: DocumentationFeatureKey;
  tagline: string;
  audience: string;
  summary: string;
  backendDoc: string;
  quickFacts: string[];
  flow: string[];
  sections: DocumentationSection[];
  terms: DocumentationTerm[];
}

export const documentationFeatures: DocumentationFeature[] = [
  {
    title: "Orders",
    slug: "orders",
    tone: "#2563eb",
    iconKey: "orders",
    tagline: "Demand intake, customer commitments, financial posture, and fulfillment state.",
    audience: "Sales ops, support, finance, and fulfillment teams",
    summary: "The Orders module tracks customer demand from intake through fulfillment. It gives users visibility into status, quantities, commitments, and downstream execution readiness.",
    backendDoc: "Ops-Intell-Backend/Documentation/order_module_documentation.docx",
    quickFacts: [
      "Orders are the commercial source of demand for production, scheduling, and shipment workflows.",
      "Order status should be interpreted alongside fulfillment and payment posture.",
      "Filtering and search are backend-driven so users see true database results, not page-local matches."
    ],
    flow: ["Create order", "Validate demand", "Allocate stock or production", "Monitor fulfillment", "Complete or close"],
    sections: [
      {
        id: "orders-overview",
        title: "Module Overview",
        summary: "Orders capture who is buying, what they need, how much is due, and where operational follow-through must happen.",
        paragraphs: [
          "This module is the operational handshake between commercial demand and execution. An order record usually contains the customer context, commercial totals, priority, order type, shipping expectations, and status information.",
          "Teams use the list page to identify work that needs review, work already processing, and orders that have moved into shipment or completion states."
        ],
        callout: "If a user is unsure why an order is blocked, check both fulfillment status and any outstanding action or exception indicators."
      },
      {
        id: "orders-key-data",
        title: "Key Data Users Should Understand",
        summary: "Several order fields affect execution decisions downstream.",
        bullets: [
          "Order type defines the commercial path, such as standard sales, expedited demand, or special handling.",
          "Channel identifies where the demand originated, which matters for reporting and customer-service workflows.",
          "Outstanding amount or outstanding quantity signals unresolved commercial or fulfillment work.",
          "Status represents lifecycle state, but it should always be interpreted with shipment and production readiness."
        ]
      },
      {
        id: "orders-workflow",
        title: "Typical User Workflow",
        summary: "Most users review the list, inspect a detail view, and then act through editing or fulfillment follow-up.",
        bullets: [
          "Search or filter the order list using customer, status, or order type criteria.",
          "Open an order detail page to inspect lines, commitments, and commercial context.",
          "Edit the order only when the backend endpoint allows the target fields to change.",
          "Use related production or shipment records to understand operational follow-through."
        ]
      }
    ],
    terms: [
      {
        term: "Awaiting Action",
        definition: "An order state indicating manual review, missing data, or unresolved next-step work is still required.",
        whyItMatters: "This usually identifies records that need human intervention before execution can continue."
      },
      {
        term: "Channel",
        definition: "The commercial source through which the order entered the system, such as direct sales or partner demand.",
        whyItMatters: "Channel is useful for reporting, prioritization, and understanding customer-service obligations."
      },
      {
        term: "Outstanding",
        definition: "The remaining commercial or quantity exposure that has not yet been fulfilled or resolved.",
        whyItMatters: "It helps teams spot open obligations even when an order is partially processed."
      }
    ]
  },
  {
    title: "Inventory",
    slug: "inventory",
    tone: "#0f766e",
    iconKey: "inventory",
    tagline: "Catalog control, stock posture, locations, suppliers, and movement history.",
    audience: "Inventory planners, warehouse teams, procurement, and operations leads",
    summary: "The Inventory module manages product master data and stock context. Users rely on it to understand what exists, where it is stored, how it moves, and what replenishment posture looks like.",
    backendDoc: "Ops-Intell-Backend/Documentation/inventory_module_documentation.docx",
    quickFacts: [
      "Catalog records are distinct from warehouse stock positions and movement transactions.",
      "Reference data such as warehouses and categories should not refetch on every page change.",
      "Product details should load only when a user opens the product detail view."
    ],
    flow: ["Maintain catalog", "Track stock position", "Review movements", "Assess replenishment", "Coordinate suppliers"],
    sections: [
      {
        id: "inventory-overview",
        title: "Module Overview",
        summary: "Inventory combines product definitions with stock visibility and warehouse context.",
        paragraphs: [
          "Users start with the catalog to understand the product master. From there, they move into stock posture, warehouses, suppliers, brands, and movement history depending on the question they are trying to answer.",
          "The module supports both master-data maintenance and operational analysis, which is why different subnavigation areas exist for catalog, stock movement, suppliers, and warehouse views."
        ]
      },
      {
        id: "inventory-catalog",
        title: "Catalog and Product Master Data",
        summary: "Catalog data defines what a product is and how it should be managed.",
        bullets: [
          "SKU is the stable product identifier used in operational workflows.",
          "Unit of measure tells users how stock and transactions are quantified.",
          "Reorder level signals when replenishment attention is needed.",
          "Status helps distinguish active catalog items from draft or inactive definitions."
        ]
      },
      {
        id: "inventory-movements",
        title: "Stock Movements and Warehousing",
        summary: "Movement history explains how inventory changes over time.",
        bullets: [
          "Inbound movements increase available stock and often reflect purchase receipts or transfers.",
          "Outbound movements reduce available stock and often reflect fulfillment or usage.",
          "Warehouse-level context matters because the same product can have different posture across locations."
        ],
        callout: "When users ask why stock changed, movement history is usually the first place to inspect."
      }
    ],
    terms: [
      {
        term: "SKU",
        definition: "A stock keeping unit that uniquely identifies a catalog item.",
        whyItMatters: "It is the operational key used across inventory, orders, production, and shipments."
      },
      {
        term: "Reorder Level",
        definition: "A threshold that signals inventory may need replenishment.",
        whyItMatters: "It helps planners avoid stockouts before demand becomes urgent."
      },
      {
        term: "Stock Movement",
        definition: "A transaction that changes quantity in a warehouse or stock location.",
        whyItMatters: "Movement history is how users audit changes in stock posture over time."
      }
    ]
  },
  {
    title: "Production",
    slug: "production",
    tone: "#7c3aed",
    iconKey: "production",
    tagline: "Manufacturing orders, routings, labor execution, machine posture, and output readiness.",
    audience: "Production planners, supervisors, shop-floor managers, and manufacturing ops",
    summary: "The Production module translates demand into executable manufacturing work. It helps users understand planned work, work in progress, bottlenecks, and execution performance.",
    backendDoc: "Ops-Intell-Backend/Documentation/production_module_documentation.docx",
    quickFacts: [
      "Production orders are separate from routings, machines, and labor logs but depend on them.",
      "Production overview metrics should come from backend summaries, not the current page of rows.",
      "Routing and machine subpages support execution analysis beyond the main overview."
    ],
    flow: ["Create production order", "Confirm routing and resources", "Start execution", "Track progress", "Complete output"],
    sections: [
      {
        id: "production-overview",
        title: "Module Overview",
        summary: "Production records planned and active manufacturing work tied to operational demand.",
        paragraphs: [
          "The overview page is where users assess throughput posture, work in progress, and status breakdowns. Detail pages reveal the exact execution context for a specific production order.",
          "Routings, machine data, and labor logs support the broader picture of how efficiently work can be executed."
        ]
      },
      {
        id: "production-routings",
        title: "Routings, Machines, and Labor",
        summary: "Execution readiness depends on process definition and resource capacity.",
        bullets: [
          "A routing defines the sequence of operations required to make a product.",
          "Machines represent equipment capacity, health, and availability context.",
          "Labor logs show who performed work, for how long, and on which jobs."
        ]
      },
      {
        id: "production-status",
        title: "Status Interpretation",
        summary: "Production states should be read as execution signals, not just labels.",
        bullets: [
          "Planned or draft orders are not yet actively executing.",
          "In progress indicates active work is underway.",
          "Paused suggests an interruption that may require material, labor, machine, or scheduling follow-up.",
          "Completed signals the order has reached its intended execution end state."
        ]
      }
    ],
    terms: [
      {
        term: "Routing",
        definition: "The ordered sequence of operations used to manufacture an item.",
        whyItMatters: "Without a reliable routing, production planning and execution quality break down."
      },
      {
        term: "Labor Log",
        definition: "A record of work performed by personnel against a production activity.",
        whyItMatters: "It supports accountability, costing, and throughput analysis."
      },
      {
        term: "Paused",
        definition: "A production state where work has stopped temporarily and needs follow-up.",
        whyItMatters: "Paused work is a direct indicator of interruption risk and missed throughput."
      }
    ]
  },
  {
    title: "Scheduling",
    slug: "scheduling",
    tone: "#ea580c",
    iconKey: "scheduling",
    tagline: "Planning logic, shifts, dispatch posture, exceptions, and timing control.",
    audience: "Schedulers, dispatch coordinators, operations planners, and supervisors",
    summary: "The Scheduling module manages how work is sequenced and dispatched. It gives users a view of plans, jobs, exceptions, shifts, and dispatch readiness across time.",
    backendDoc: "Ops-Intell-Backend/Documentation/Scheduling_Module_Documentation.docx",
    quickFacts: [
      "Scheduling list calls should be tab-specific so only the active tab endpoint is invoked.",
      "Shift and dispatch metrics should come from backend summary counts rather than the current page.",
      "Scheduling is where timing conflicts and execution constraints become visible."
    ],
    flow: ["Generate plan", "Review jobs", "Inspect exceptions", "Dispatch work", "Adjust schedule"],
    sections: [
      {
        id: "scheduling-overview",
        title: "Module Overview",
        summary: "Scheduling turns operational work into time-based execution decisions.",
        paragraphs: [
          "This module is used to coordinate when work should happen, which jobs are ready, and what conflicts or exceptions need attention.",
          "Different tabs and subpages represent different scheduling concerns, such as plans, jobs, exceptions, shifts, and dispatch."
        ]
      },
      {
        id: "scheduling-tabs",
        title: "Plans, Jobs, and Exceptions",
        summary: "Each scheduling area answers a different operational question.",
        bullets: [
          "Plans describe the broader scheduling strategy or generated sequence.",
          "Jobs represent dispatchable or actively managed units of work.",
          "Exceptions reveal issues such as constraints, conflicts, or failed assumptions."
        ]
      },
      {
        id: "scheduling-dispatch",
        title: "Shifts and Dispatch",
        summary: "Shift design and dispatch timing directly shape execution reliability.",
        bullets: [
          "Shifts define the work windows in which jobs can run.",
          "Dispatch prioritizes what should be released to the floor or team next.",
          "Blockers in dispatch usually require material, labor, or schedule logic resolution."
        ]
      }
    ],
    terms: [
      {
        term: "Generation Mode",
        definition: "The method or mode used to create a schedule or planning result.",
        whyItMatters: "It helps users understand how much of the schedule was automated versus manually controlled."
      },
      {
        term: "Dispatch",
        definition: "The act of releasing ready work to execution at the appropriate time.",
        whyItMatters: "Poor dispatch timing creates congestion, idle resources, or missed commitments."
      },
      {
        term: "Exception",
        definition: "A scheduling issue or anomaly that requires review or action.",
        whyItMatters: "Exceptions signal that the plan may not execute as intended without intervention."
      }
    ]
  },
  {
    title: "Shipments",
    slug: "shipments",
    tone: "#db2777",
    iconKey: "shipments",
    tagline: "Transportation execution, carriers, lanes, addresses, and delivery state.",
    audience: "Logistics coordinators, fulfillment teams, transport planners, and customer operations",
    summary: "The Shipments module manages outbound movement after fulfillment is ready. It covers shipment records, carriers, lanes, delivery addresses, and transport terms used in execution.",
    backendDoc: "Ops-Intell-Backend/Documentation/Shipment_Module_Documentation.docx",
    quickFacts: [
      "Shipment status metrics should come from backend summary endpoints, not page-local table counts.",
      "Carriers and lanes support the main shipment record with transport execution context.",
      "Users often need glossary help for logistics terms like Incoterm and shipping terms."
    ],
    flow: ["Prepare shipment", "Assign carrier", "Confirm lane and address", "Track transit", "Confirm delivery"],
    sections: [
      {
        id: "shipments-overview",
        title: "Module Overview",
        summary: "Shipments represent the transportation layer of fulfillment.",
        paragraphs: [
          "A shipment record usually captures the carrier, shipping terms, tracking, status, address context, and timing information needed to monitor delivery execution.",
          "Carrier and lane subpages help users understand network structure and transport coverage outside the individual shipment record."
        ]
      },
      {
        id: "shipments-key-fields",
        title: "Key Shipment Fields",
        summary: "Several logistics fields are essential even when users are not transport specialists.",
        bullets: [
          "Carrier identifies who is physically transporting the goods.",
          "Tracking gives the reference used to monitor shipment progress.",
          "Shipping terms and Incoterm describe responsibility and commercial handoff rules.",
          "Lane or shipment address data reveals where goods move from and to."
        ]
      },
      {
        id: "shipments-status",
        title: "Status and Operational Follow-Up",
        summary: "Shipment state indicates where transport execution currently stands.",
        bullets: [
          "Processing usually means the shipment is being prepared or coordinated.",
          "In transit means the goods have left origin and are moving toward destination.",
          "Delivered means transport execution is complete.",
          "Failed or exception-oriented states need immediate follow-up."
        ],
        callout: "When customer teams ask for delivery updates, shipment status and tracking are the first fields to verify."
      }
    ],
    terms: [
      {
        term: "Incoterm",
        definition: "A standardized trade term defining responsibility, cost, and risk transfer between trading parties.",
        whyItMatters: "It affects who is accountable for transport cost, insurance, customs, and handoff points."
      },
      {
        term: "Carrier",
        definition: "The logistics provider responsible for moving the shipment.",
        whyItMatters: "Carrier performance directly affects delivery reliability and customer outcomes."
      },
      {
        term: "Lane",
        definition: "A transport path or route pairing, often defined by origin and destination.",
        whyItMatters: "Lane analysis helps logistics teams understand transport coverage and execution patterns."
      }
    ]
  }
];

export const documentationFeatureMap = documentationFeatures.reduce<Record<string, DocumentationFeature>>((accumulator, feature) => {
  accumulator[feature.slug] = feature;
  return accumulator;
}, {});
