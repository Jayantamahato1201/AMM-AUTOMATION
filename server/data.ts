import {
  ServiceItem,
  IndustryItem,
  PartnerCompanyItem,
  EnquiryItem,
  QuoteRequestItem,
  TestimonialItem,
  NewsletterSubscriberItem,
  WebsiteContent
} from '../src/types.js';

export const initialWebsiteContent: WebsiteContent = {
  companyName: 'AMM Automation',
  tagline: 'Innovate. Automate. Control.',
  heroHeading: 'Industrial Automation & Smart Solutions',
  heroSubheading: 'Smart Solutions. Safer Operations. Stronger Tomorrow.',
  heroDescription:
    'AMM Automation is a reliable partner in the field of industrial automation, process instrumentation, and smart Industry 4.0 solutions. We specialize in delivering advanced, cost-effective, and plant-ready solutions designed to improve operational efficiency, safety, productivity, and reliability.',
  aboutIntro:
    'AMM Automation is dedicated to engineering excellence, offering complete turnkey automation, process instrumentation, electrical engineering, and smart manufacturing integration for heavy industries and modern enterprises.',
  aboutMission:
    'To empower industrial operations with resilient, high-precision automation and intelligent digital monitoring solutions that optimize uptime, elevate plant safety, and drive measurable efficiency.',
  aboutVision:
    'To be the most trusted industrial engineering and automation partner across process and manufacturing industries, recognized for technical depth, robust execution, and customer-first commitment.',
  aboutApproach:
    'We combine rigorous field-level engineering with cutting-edge Industry 4.0 technologies—from precision field sensors and rugged PLC/SCADA architectures to enterprise analytics and safety compliance.',
  ctaHeading: "Let's Automate Today for a Smarter Tomorrow!",
  ctaSubheading:
    'Connect with our engineering specialists to discuss your plant automation, process instrumentation, or custom digital transformation requirements.',
  contactEmail: 'ammautomationsr@gmail.com',
  contactPhone: '+91 9204673578',
  alternatePhone: '+91 9876543210',
  whatsappNumber: '+91 9204673578',
  address: 'Industrial Engineering Center, Sector 4, Bokaro / Ranchi Industrial Corridor, Jharkhand, India',
  workingHours: 'Monday - Saturday: 9:00 AM - 6:30 PM (24/7 Breakdown & Support on-call)',
  metaTitle: 'AMM AUTOMATION | Turnkey Industrial Automation, PLC SCADA & Rewinding',
  metaDescription:
    'Certified industrial automation, PLC programming, control panel fabrication, and heavy HT/LT motor rewinding.'
};

export const initialPartners: PartnerCompanyItem[] = [
  {
    id: 'partner-1',
    companyName: 'Global Infosoft',
    slug: 'global-infosoft',
    websiteUrl: 'https://globalinfosoft.com',
    displayUrl: 'globalinfosoft.com',
    category: 'Technology & Digital Solutions Partner',
    shortDescription:
      'Global Infosoft is a technology and digital solutions partner supporting businesses with modern web solutions, software development, digital transformation, and innovative technology services.',
    fullDescription:
      'AMM Automation collaborates with Global Infosoft to deliver unified enterprise software, cloud SCADA dashboards, Industry 4.0 data pipelines, and responsive web platforms for modern manufacturing facilities.',
    logo: '/images/hero_automation.jpg',
    tags: ['Web & Software Development', 'Digital Transformation', 'Enterprise Systems', 'Cloud & IoT Integration'],
    establishedRole: 'Digital & Software Engineering Alliance',
    isActive: true,
    displayOrder: 1,
    createdAt: '2025-01-01T00:00:00.000Z'
  }
];

export const initialServices: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Electrical Solutions',
    slug: 'electrical-solutions',
    shortDescription:
      'Comprehensive industrial pump and motor overhauling, testing, and precision stator/rotor rewinding services.',
    fullDescription:
      'AMM Automation delivers end-to-end electrical maintenance, refurbishment, and rewinding services for industrial pumps, AC/DC motors, heavy induction machines, and transformers. Our workshop and field technicians utilize high-grade insulation materials (Class F/H), precision dynamic balancing, and comprehensive load-testing protocols to restore peak machine efficiency and minimize unplanned downtime.',
    image: '/images/plc_control_panel.jpg',
    iconName: 'Zap',
    subOfferings: [
      'Pump & Motor Services',
      'Stator & Rotor Rewindings',
      'HT/LT Motor Overhauling',
      'Dynamic Balancing & Vibration Analysis'
    ],
    features: [
      'Class F and Class H high-grade copper rewinding',
      'Vacuum Pressure Impregnation (VPI) capability',
      'Dynamic rotor balancing & laser alignment',
      'Surge, insulation resistance (Megger), and Hi-Pot testing',
      'On-site emergency troubleshooting and preventive maintenance'
    ],
    applications: [
      'Heavy industrial slurry and cooling water pumps',
      'Continuous duty induction motors for conveyor systems',
      'Compressor and blower drive motors in process plants',
      'Power generation and steel rolling mill electrical drives'
    ],
    relatedIndustries: ['Power Industry', 'Steel Industry', 'Cement Industry', 'Water & Wastewater'],
    isActive: true,
    order: 1,
    displayOrder: 1,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-2',
    title: 'Industrial Automation Solutions',
    slug: 'industrial-automation',
    shortDescription:
      'Turnkey PLC programming, SCADA development, HMI interfaces, and VFD/Electrical Drive panel integration.',
    fullDescription:
      'We architect, program, and commission robust industrial automation systems tailored to plant specifications. From Siemens, Rockwell/Allen Bradley, Schneider, and Mitsubishi PLCs to high-reliability SCADA supervisory control, distributed I/O, and variable frequency drive (VFD) panels, our solutions ensure repeatable precision, fail-safe interlocking, and intuitive operator telemetry.',
    image: '/images/hero_automation.jpg',
    iconName: 'Cpu',
    subOfferings: [
      'PLC Programming & Architecture',
      'SCADA Supervisory Control',
      'VFD & Electrical Drive Systems',
      'Control Panel Fabrication'
    ],
    features: [
      'Multi-vendor PLC programming (Siemens, Rockwell, Schneider, ABB, Delta)',
      'Custom SCADA screen design with historical trending & alarm logging',
      'Variable Frequency Drive (VFD) tuning & energy-saving motion control',
      'Industrial Ethernet (Profinet, Modbus TCP, EtherNet/IP) networking',
      'Turnkey control desk and MCC/PCC panel engineering'
    ],
    applications: [
      'Continuous process batching and mixing lines',
      'Automatic raw material conveying and weighing',
      'Boiler, turbine, and auxiliary control systems',
      'Packaging lines and multi-axis synchronized drives'
    ],
    relatedIndustries: ['Steel Industry', 'Cement Industry', 'Pharma', 'Food & Beverage', 'Automotive'],
    isActive: true,
    order: 2,
    displayOrder: 2,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-3',
    title: 'Process Instruments',
    slug: 'process-instruments',
    shortDescription:
      'High-precision RTDs, thermocouples, flow, level, pressure transmitters, and thermal imaging diagnostics.',
    fullDescription:
      'Accurate process measurement is the foundation of plant safety and product quality. AMM Automation supplies, installs, calibrates, and maintains high-accuracy process instrumentation—including simplex/duplex RTDs, industrial thermocouples, thermal imaging condition monitoring, electromagnetic/vortex flow transmitters, radar/ultrasonic level transmitters, and differential pressure gauges.',
    image: '/images/instrumentation_field.jpg',
    iconName: 'Gauge',
    subOfferings: [
      'RTDs & Thermocouples',
      'Thermal Imaging Solutions',
      'Flow Transmitters',
      'Level Transmitters',
      'Pressure & DP Transmitters'
    ],
    features: [
      'Simplex & Duplex PT100/PT1000 RTD temperature sensors with thermowells',
      'Type K, J, R, S, B, N industrial thermocouples for high-temperature kilns',
      'Non-contact continuous thermal imaging for electrical panels and refractories',
      'Electromagnetic, vortex, and coriolis mass flow measurement',
      'HART & Foundation Fieldbus enabled 4-20mA smart transmitters',
      'NIST-traceable calibration and testing services'
    ],
    applications: [
      'Furnace, blast furnace, and kiln temperature monitoring',
      'Chemical tank farm inventory and level custody transfer',
      'Steam, compressed air, and gas flow metering',
      'Cooling water pipeline pressure and differential strain control'
    ],
    relatedIndustries: ['Power Industry', 'Steel Industry', 'Oil & Gas', 'Pharma', 'Cement Industry'],
    isActive: true,
    order: 3,
    displayOrder: 3,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-4',
    title: 'LOTO Safety Solutions',
    slug: 'loto-safety-solutions',
    shortDescription:
      'Industrial Lockout-Tagout systems, mechanical & electrical safety interlocks, and compliance auditing.',
    fullDescription:
      'Human safety and regulatory compliance are non-negotiable in modern industrial facilities. Our Lockout-Tagout (LOTO) solutions provide comprehensive hazardous energy control programs—including custom safety padlock stations, valve lockouts, circuit breaker lockouts, group lockout boxes, tailored procedure placards, and plant-wide technician safety training.',
    image: '/images/safety_systems.jpg',
    iconName: 'ShieldAlert',
    subOfferings: [
      'Lockout Tagout Hardware',
      'Machine Energy Audit',
      'Custom Procedure Placards',
      'Industrial Safety Systems'
    ],
    features: [
      'OSHA-standard compliant Lockout/Tagout hardware and lockout stations',
      'Energy isolation point mapping and visual identification tags',
      'Valve, pneumatic, electrical breaker, and cable lockouts',
      'Customized plant standard operating procedures (SOPs)',
      'Safety audits and technician training workshops'
    ],
    applications: [
      'Scheduled plant shutdown maintenance and overhauls',
      'Electrical switchgear and MCC panel maintenance isolation',
      'Confined space entry and pressurized line servicing',
      'Heavy conveyor and crusher lockout procedures'
    ],
    relatedIndustries: ['Steel Industry', 'Power Industry', 'Oil & Gas', 'Cement Industry', 'Pharma'],
    isActive: true,
    order: 4,
    displayOrder: 4,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-5',
    title: 'Autonomous Robots for Logistics & Material Handling',
    slug: 'autonomous-robots-logistics',
    shortDescription:
      'AGVs, AMRs, robotic palletizers, and automated guided lifting systems for modern shop floor logistics.',
    fullDescription:
      'Elevate material movement safety and warehouse throughput with our autonomous mobile robots (AMR), Automated Guided Vehicles (AGV), and heavy-duty robotic lifting systems. Engineered for harsh industrial environments, our robotics solutions navigate dynamic shop floors using LiDAR SLAM and optical guidance to transport raw materials, work-in-progress pallets, and finished goods seamlessly.',
    image: '/images/robotics_smart_plant.jpg',
    iconName: 'Bot',
    subOfferings: [
      'Autonomous Mobile Robots (AMR)',
      'Automated Guided Vehicles (AGV)',
      'Robotic Lifting & Palletizing',
      'Fleet Management Software'
    ],
    features: [
      'Natural navigation via LiDAR SLAM (no floor magnetic tape required)',
      'Payload capacities from 100 kg up to 3,000 kg heavy industrial lifts',
      'Intelligent fleet dispatch and traffic control software',
      'Automated opportunistic battery docking and charging',
      'Seamless integration with shop-floor PLC lines and ERP/WMS systems'
    ],
    applications: [
      'Assembly line part delivery and line-side replenishment',
      'Automated pallet handling in high-density warehouses',
      'Hazardous material and hot metal transit in foundry environments',
      'End-of-line palletizing and stretch wrapping transfer'
    ],
    relatedIndustries: ['Automotive', 'Logistics & Warehousing', 'Pharma', 'Food & Beverage', 'Steel Industry'],
    isActive: true,
    order: 5,
    displayOrder: 5,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-6',
    title: 'Industry 4.0 & IIoT Solutions',
    slug: 'industry-4-iiot-solutions',
    shortDescription:
      'Energy Management (EMS), Building Management (BMS), real-time process telemetry, and predictive edge monitoring.',
    fullDescription:
      'Transform raw machine data into operational intelligence. Our Industry 4.0 and Industrial Internet of Things (IIoT) solutions integrate smart edge gateways, cloud/on-premise historians, Energy Management Systems (EMS), Building Management Systems (BMS), and predictive machine health monitoring to slash power consumption, eliminate bottlenecks, and prevent unexpected machine failures.',
    image: '/images/iot_smart_energy.jpg',
    iconName: 'Activity',
    subOfferings: [
      'Energy Management System (EMS)',
      'Building Management System (BMS)',
      'Process Monitoring',
      'Smart Industrial Monitoring'
    ],
    features: [
      'Real-time power quality and specific energy consumption (SEC) tracking',
      'Wireless vibration, temperature, and current clamp IoT sensors',
      'Cloud & on-premise live dashboarding with instant SMS/Email alerts',
      'OEE (Overall Equipment Effectiveness) tracking and downtime analytics',
      'Secure edge computing with MQTT, OPC-UA, and REST API support'
    ],
    applications: [
      'Plant-wide ISO 50001 energy auditing and load management',
      'Continuous vibration diagnostics on critical turbo-machinery',
      'Clean room HVAC environmental monitoring (Temp, RH, DP)',
      'Remote utility monitoring across multi-facility operations'
    ],
    relatedIndustries: ['Power Industry', 'Cement Industry', 'Pharma', 'Steel Industry', 'Food & Beverage'],
    isActive: true,
    order: 6,
    displayOrder: 6,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-7',
    title: 'Customised Management System',
    slug: 'customised-management-system',
    shortDescription:
      'Tailor-made industrial software and management systems to streamline plant workflows and shop-floor tracking.',
    fullDescription:
      'Off-the-shelf software often fails to capture the specialized operational workflows of manufacturing plants. AMM Automation develops tailored management systems—including digital logbooks, maintenance management (CMMS), quality assurance tracking, shift handovers, and material requisition portals—designed specifically around your team’s operating rhythm.',
    image: '/images/scada_system.jpg',
    iconName: 'LayoutDashboard',
    subOfferings: [
      'Custom Plant Software',
      'CMMS Maintenance Portals',
      'Digital Shift Logbooks',
      'Quality Assurance Trackers'
    ],
    features: [
      'Tailored database architecture matching plant hierarchy',
      'Role-based permissions for engineers, operators, and plant managers',
      'Automated daily/monthly generation of production & compliance reports',
      'Direct integration with PLC/SCADA tags for automated data entry',
      'Responsive web interfaces accessible on shop floor rugged tablets'
    ],
    applications: [
      'Preventive & corrective maintenance ticket tracking',
      'Raw material batch traceability and lab test certificates',
      'Shift-wise operator logs and energy consumption summaries',
      'Tooling and spare parts inventory control'
    ],
    relatedIndustries: ['Steel Industry', 'Power Industry', 'Cement Industry', 'Automotive', 'Pharma'],
    isActive: true,
    order: 7,
    displayOrder: 7,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-8',
    title: 'CRM & ERP Solutions',
    slug: 'crm-erp-solutions',
    shortDescription:
      'End-to-end CRM and ERP systems engineered to unify sales, procurement, inventory, and enterprise production.',
    fullDescription:
      'Achieve unified enterprise control with our robust CRM and ERP implementations. We help manufacturing and B2B industrial firms streamline customer relationship lifecycles, lead pipeline management, procurement, vendor tracking, bill of materials (BOM), production scheduling, and financial accounting into one synchronized system.',
    image: '/images/plc_control_panel.jpg',
    iconName: 'Database',
    subOfferings: [
      'B2B Sales CRM',
      'Manufacturing ERP',
      'Procurement & Vendor Modules',
      'Inventory & BOM Management'
    ],
    features: [
      'Multi-stage quotation, order booking, and dispatch workflow',
      'Live warehouse inventory and minimum reorder level alerts',
      'Production planning with Multi-level Bill of Materials (BOM)',
      'GST-compliant invoicing, ledger reconciliation, and payment tracking',
      'Executive dashboards with real-time gross margin and cash flow insights'
    ],
    applications: [
      'Industrial equipment manufacturing & job-shop order management',
      'Electrical contracting sales pipeline and material procurement',
      'Multi-branch spare parts distribution tracking',
      'Contractor billing and milestone certification'
    ],
    relatedIndustries: ['Automotive', 'Logistics & Warehousing', 'Steel Industry', 'Food & Beverage'],
    isActive: true,
    order: 8,
    displayOrder: 8,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-9',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    shortDescription:
      'Targeted B2B industrial digital marketing, search visibility, lead generation, and technical brand presence.',
    fullDescription:
      'Modern industrial procurement starts online. We provide high-impact B2B digital marketing strategies designed specifically for engineering enterprises, OEMs, and industrial service providers. From technical search engine optimization (SEO) and Google Ads search campaigns to LinkedIn B2B account-based marketing, we help expand your industrial reach.',
    image: '/images/water_treatment.jpg',
    iconName: 'TrendingUp',
    subOfferings: [
      'Industrial B2B SEO',
      'High-Intent Search Ads',
      'LinkedIn B2B Outreach',
      'Technical Content & Case Studies'
    ],
    features: [
      'Technical SEO optimized for industrial keywords and tender opportunities',
      'Targeted Google Search & Display campaigns with negative-keyword filtering',
      'LinkedIn Account-Based Marketing (ABM) for procurement managers & plant heads',
      'High-converting landing pages with direct WhatsApp and enquiry integrations',
      'Performance analytics and verified qualified lead reporting'
    ],
    applications: [
      'Industrial equipment and machinery manufacturer lead generation',
      'Testing, calibration, and engineering service visibility',
      'Product catalog launch campaigns in domestic and export markets',
      'Corporate brand credibility and capability portfolio presentation'
    ],
    relatedIndustries: ['Automotive', 'Pharma', 'Logistics & Warehousing', 'Food & Beverage'],
    isActive: true,
    order: 9,
    displayOrder: 9,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-10',
    title: 'Mobile Application Development',
    slug: 'mobile-applications',
    shortDescription:
      'Custom Android and iOS applications connecting engineers and managers directly to live plant operations.',
    fullDescription:
      'Stay connected to plant operations from anywhere. AMM Automation builds secure, high-performance mobile applications for Android and iOS that interface directly with SCADA systems, IIoT telemetry, maintenance ticketing systems, and enterprise ERPs. With push notification alarms, live machine metrics, and offline data sync, your plant status is always at your fingertips.',
    image: '/images/metal_plant.jpg',
    iconName: 'Smartphone',
    subOfferings: [
      'Plant Monitoring Mobile Apps',
      'Field Service & Maintenance Apps',
      'Executive Mobile Dashboards',
      'Offline Data Sync'
    ],
    features: [
      'Native & cross-platform development (React Native & Flutter)',
      'Real-time WebSocket alerts for critical machine trip conditions',
      'Biometric authentication and encrypted local credential storage',
      'Barcode and QR code scanning for equipment asset tagging',
      'Offline log capture with automatic server synchronization on reconnect'
    ],
    applications: [
      'Plant manager remote dashboard for daily generation & downtime',
      'Field engineer work order dispatch and on-site checklist validation',
      'Warehouse barcode scanning for incoming/outgoing asset audits',
      'Safety incident reporting with GPS tagging and image uploads'
    ],
    relatedIndustries: ['Steel Industry', 'Power Industry', 'Logistics & Warehousing', 'Pharma', 'Water & Wastewater'],
    isActive: true,
    order: 10,
    displayOrder: 10,
    createdAt: '2025-01-10T00:00:00.000Z'
  }
];

export const initialIndustries: IndustryItem[] = [
  {
    id: 'ind-1',
    name: 'Power Industry',
    slug: 'power-industry',
    description:
      'Thermal, hydel, and captive power plant automation, boiler instrumentation, and electrical drive overhauls ensuring round-the-clock grid reliability.',
    image: '/images/metal_plant.jpg',
    iconName: 'Flame',
    challenges: [
      'High thermal stress causing frequent thermocouple and sensor degradation',
      'Stringent environmental emission standards requiring real-time CEMS monitoring',
      'Critical pump and fan motor failures leading to multi-megawatt generation loss',
      'Complex interlocks between turbine, boiler, and feedwater systems'
    ],
    solutions: [
      'High-reliability duplex RTD/Thermocouple assemblies rated up to 1400°C',
      'Redundant PLC/SCADA architecture with bumpless transfer for boiler controls',
      'On-site HT motor rewinding, dynamic balancing, and vibration trend analysis',
      'Integrated Energy & Emission Management Systems with continuous logging'
    ],
    relatedServices: [
      'Process Instruments',
      'Industrial Automation Solutions',
      'Electrical Solutions',
      'Industry 4.0 & IIoT Solutions'
    ],
    isActive: true,
    order: 1,
    displayOrder: 1
  },
  {
    id: 'ind-2',
    name: 'Steel Industry',
    slug: 'steel-industry',
    description:
      'Rugged automation, furnace thermal imaging, mill drive control, and safety systems built to thrive in extreme heat, dust, and continuous mechanical shock.',
    image: '/images/metal_plant.jpg',
    iconName: 'Boxes',
    challenges: [
      'Extreme ambient temperatures and conductive metallic dust damaging electronics',
      'Multi-stand rolling mill drive speed synchronization to prevent cobbles',
      'Severe safety hazards during slag tapping and ladle transfer operations',
      'High unmetered electrical energy consumption in electric arc furnaces'
    ],
    solutions: [
      'IP66/NEMA 4X purged control panels with active air conditioning',
      'High-speed synchronized VFD drives with microsecond torque control',
      'Non-contact continuous thermal imaging for ladle and refractory shell monitoring',
      'Plant-wide LOTO safety interlocks and energy sub-metering systems'
    ],
    relatedServices: [
      'Industrial Automation Solutions',
      'Process Instruments',
      'LOTO Safety Solutions',
      'Electrical Solutions'
    ],
    isActive: true,
    order: 2,
    displayOrder: 2
  },
  {
    id: 'ind-3',
    name: 'Cement Industry',
    slug: 'cement-industry',
    description:
      'Automated raw material grinding, rotary kiln temperature tracking, bagging line control, and comprehensive heavy motor maintenance.',
    image: '/images/plc_control_panel.jpg',
    iconName: 'Building2',
    challenges: [
      'Heavy abrasive dust causing rapid mechanical wear and sensor blockage',
      'Kiln shell hotspots requiring early detection to avoid catastrophic downtime',
      'Huge electrical load spikes during crusher and ball mill startups',
      'High manual labor requirements in packaging and dispatch sections'
    ],
    solutions: [
      'Heavy-duty radar level transmitters and non-clogging differential pressure gauges',
      'Kiln infrared line scanners and automated alarm monitoring',
      'Soft starter and medium-voltage VFD integration for ball mills and ID fans',
      'Autonomous palletizing robots and automated truck loading controls'
    ],
    relatedServices: [
      'Industrial Automation Solutions',
      'Process Instruments',
      'Autonomous Robots for Logistics & Material Handling',
      'Electrical Solutions'
    ],
    isActive: true,
    order: 3,
    displayOrder: 3
  },
  {
    id: 'ind-4',
    name: 'Oil & Gas',
    slug: 'oil-and-gas',
    description:
      'Hazardous area certified instrumentation, pipeline pressure telemetry, and safety energy isolation systems.',
    image: '/images/instrumentation_field.jpg',
    iconName: 'Fuel',
    challenges: [
      'Zone 0 / Zone 1 explosive atmospheres demanding intrinsically safe instrumentation',
      'Custody transfer accuracy requirements for volumetric and mass flow measurement',
      'High risk of catastrophic energy release during valve and piping maintenance',
      'Remote tank farm inventory monitoring and leak detection'
    ],
    solutions: [
      'ATEX / IECEx certified smart pressure and flow transmitters',
      'SIL-rated Emergency Shutdown (ESD) and safety PLC interlocks',
      'Engineered Lockout/Tagout valve isolation and lockout management systems',
      'Secure SCADA telemetry with satellite / 4G cellular edge fallback'
    ],
    relatedServices: [
      'Process Instruments',
      'LOTO Safety Solutions',
      'Industrial Automation Solutions',
      'Industry 4.0 & IIoT Solutions'
    ],
    isActive: true,
    order: 4,
    displayOrder: 4
  },
  {
    id: 'ind-5',
    name: 'Pharma',
    slug: 'pharma',
    description:
      '21 CFR Part 11 compliant cleanroom monitoring, automated reactor batching, and sterile material transit robots.',
    image: '/images/iot_smart_energy.jpg',
    iconName: 'Stethoscope',
    challenges: [
      'Strict regulatory compliance (21 CFR Part 11) for electronic records and audit trails',
      'Tight tolerance environmental control (temperature, humidity, differential pressure)',
      'Cross-contamination risks during manual material transit between cleanrooms',
      'Batch repeatability and exact ingredient dosing accuracy'
    ],
    solutions: [
      'Validated SCADA and BMS systems with tamper-proof electronic audit trails',
      'Sanitary Tri-clamp RTDs, electromagnetic flowmeters, and cleanroom transmitters',
      'Sterile cleanroom-rated Autonomous Mobile Robots (AMRs) for material transit',
      'Custom batch tracking and Quality Assurance (QA) software modules'
    ],
    relatedServices: [
      'Industry 4.0 & IIoT Solutions',
      'Process Instruments',
      'Autonomous Robots for Logistics & Material Handling',
      'Customised Management System'
    ],
    isActive: true,
    order: 5,
    displayOrder: 5
  },
  {
    id: 'ind-6',
    name: 'Water & Wastewater',
    slug: 'water-and-wastewater',
    description:
      'Water treatment plant (WTP) automation, sewage treatment (STP) control, pump station telemetry, and flow metering.',
    image: '/images/robotics_smart_plant.jpg',
    iconName: 'Droplets',
    challenges: [
      'Geographically dispersed pumping stations requiring centralized monitoring',
      'Corrosive chemicals and sludge fouling standard level and flow sensors',
      'Excessive power costs in continuous aeration blower operation',
      'Need for automated chlorine dosing and pH balance control'
    ],
    solutions: [
      'Ultrasonic/Radar open-channel and tank level transmitters with zero-contact design',
      'Electromagnetic flowmeters for raw water, treated effluent, and chemical dosing',
      'VFD speed control on aeration blowers modulated by live dissolved oxygen (DO) feedback',
      'Cloud SCADA & mobile app telemetry for remote pump house status'
    ],
    relatedServices: [
      'Process Instruments',
      'Electrical Solutions',
      'Industrial Automation Solutions',
      'Mobile Application Development'
    ],
    isActive: true,
    order: 6,
    displayOrder: 6
  },
  {
    id: 'ind-7',
    name: 'Food & Beverage',
    slug: 'food-and-beverage',
    description:
      'Hygienic batch processing, CIP/SIP automated cycles, thermal sterilization monitoring, and robotic packaging.',
    image: '/images/robotics_smart_plant.jpg',
    iconName: 'Utensils',
    challenges: [
      'Food safety compliance requiring CIP (Clean-In-Place) washdown proof equipment',
      'High-speed packaging bottle necking and product labeling defects',
      'Recipe consistency across variable ingredient moisture and viscosity',
      'Traceability of batch numbers from raw milk/grain to retail carton'
    ],
    solutions: [
      'Stainless steel IP69K hygienic sensors and washdown servo control',
      'Automated Clean-in-Place (CIP) sequence programming with conductivity monitoring',
      'High-speed delta and cartesian robotic case packers and palletizers',
      'End-to-end ERP recipe management and batch genealogy tracking'
    ],
    relatedServices: [
      'Industrial Automation Solutions',
      'Autonomous Robots for Logistics & Material Handling',
      'CRM & ERP Solutions',
      'Process Instruments'
    ],
    isActive: true,
    order: 7,
    displayOrder: 7
  },
  {
    id: 'ind-8',
    name: 'Automotive',
    slug: 'automotive',
    description:
      'Robotic welding lines, conveyor synchronization, torque tool interlocks, and intelligent component AGV delivery.',
    image: '/images/water_treatment.jpg',
    iconName: 'Car',
    challenges: [
      'Zero-defect assembly demands with tight cycle time constraints',
      'Just-In-Time (JIT) line-side delivery of hundreds of unique part variations',
      'Heavy tooling wear and unexpected electric spindle motor degradation',
      'Need for automated Poka-Yoke error proofing on critical fastener torques'
    ],
    solutions: [
      'Heavy-duty industrial AMRs and AGVs with automatic route optimization',
      'Multi-axis robotic cell PLC integration with vision-guided quality inspection',
      'Predictive vibration monitoring and motor rewinding for stamping presses',
      'Custom manufacturing execution and traceability portals'
    ],
    relatedServices: [
      'Autonomous Robots for Logistics & Material Handling',
      'Industrial Automation Solutions',
      'Electrical Solutions',
      'Customised Management System'
    ],
    isActive: true,
    order: 8,
    displayOrder: 8
  },
  {
    id: 'ind-9',
    name: 'Logistics & Warehousing',
    slug: 'logistics-and-warehousing',
    description:
      'Autonomous mobile transport fleets, automated sortation conveyor controls, WMS integration, and smart dock monitoring.',
    image: '/images/robotics_smart_plant.jpg',
    iconName: 'Truck',
    challenges: [
      'High labor costs and operator turnover in repetitive pallet transport',
      'Forklift collisions and pedestrian safety risks in crowded aisles',
      'Inventory inaccuracies causing order fulfillment delays and stockouts',
      'Peak season throughput bottlenecks at dispatch and inbound docks'
    ],
    solutions: [
      'Fleet of autonomous pallet lifters with 360° safety laser scanners',
      'High-speed sorting conveyor controls with dynamic barcode scan tunnels',
      'Real-time Warehouse Management System (WMS) integration with ERP',
      'Energy-efficient lighting and BMS controls for high-bay fulfillment centers'
    ],
    relatedServices: [
      'Autonomous Robots for Logistics & Material Handling',
      'CRM & ERP Solutions',
      'Industry 4.0 & IIoT Solutions',
      'Mobile Application Development'
    ],
    isActive: true,
    order: 9,
    displayOrder: 9
  }
];

export const initialEnquiries: EnquiryItem[] = [
  {
    id: 'enq-1',
    name: 'Rajesh Sharma',
    companyName: 'Bokaro Engineering & Alloys Ltd.',
    email: 'rajesh.sharma@bokaroeng.com',
    phone: '+91 9876543210',
    subject: 'Enquiry for 355kW Motor Rewinding and Vibration Balancing',
    service: 'Electrical Solutions',
    serviceInterest: 'Electrical Solutions',
    message:
      'We have two 355kW 6.6kV cooling water pump motors requiring complete stator rewinding (Class H) and rotor dynamic balancing during our upcoming shutdown. Kindly send technical capability profile and quotation.',
    status: 'new',
    createdAt: '2025-02-28T10:15:00.000Z'
  },
  {
    id: 'enq-2',
    name: 'Anil Sengupta',
    companyName: 'Apex Cement Industries',
    email: 'anil.s@apexcement.in',
    phone: '+91 9431102938',
    subject: 'Kiln Temperature Monitoring and Radar Level Transmitters',
    service: 'Process Instruments',
    serviceInterest: 'Process Instruments',
    message:
      'Interested in upgrading our clinker cooler temperature sensors and raw meal silo radar level transmitters. Please share product datasheet and arrange a technical call.',
    status: 'contacted',
    adminNotes: 'Called client on 01-March. Shared instrumentation catalogue. Site visit planned.',
    notes: 'Called client on 01-March. Shared instrumentation catalogue. Site visit planned.',
    createdAt: '2025-03-01T14:30:00.000Z'
  }
];

export const initialQuotes: QuoteRequestItem[] = [
  {
    id: 'quote-1',
    name: 'Mahesh Verma',
    email: 'm.verma@easternmetallics.in',
    phone: '+91 9835012345',
    companyName: 'Eastern Metallics & Steel Pvt Ltd',
    industry: 'Steel Industry',
    requiredService: 'Industrial Automation Solutions',
    projectDescription:
      'Complete turnkey automation revamp for 6-strand continuous billet casting line. Scope includes dual redundant Siemens S7-1500 PLC, WinCC SCADA desk, and 12 VFD panels for mould oscillation and withdrawal.',
    estimatedBudget: '₹25,00,000 - ₹50,00,000',
    preferredContactMethod: 'phone',
    status: 'reviewing',
    adminNotes: 'Preliminary engineering BOM review underway by senior controls engineer.',
    createdAt: '2025-03-02T11:00:00.000Z'
  }
];

export const initialTestimonials: TestimonialItem[] = [
  {
    id: 'test-1',
    clientName: 'S. K. Mukherjee',
    company: 'Jamshedpur Heavy Engineering Corp',
    designation: 'General Manager - Maintenance',
    testimonial:
      'AMM Automation executed emergency rewinding and dynamic balancing of our critical 450 kW cooling water pump motor within a record 48-hour shutdown window. Exceptional technical expertise and workmanship.',
    rating: 5,
    isActive: true,
    displayOrder: 1,
    createdAt: '2025-01-20T00:00:00.000Z'
  },
  {
    id: 'test-2',
    clientName: 'Vikramaditya Roy',
    company: 'East India Alloy Steel Ltd',
    designation: 'Head of Automation & Electrical',
    testimonial:
      'Their PLC SCADA architecture and LOTO safety integration on our rolling mill line has drastically reduced downtime and eliminated operator safety blindspots. Highly recommended engineering partner.',
    rating: 5,
    isActive: true,
    displayOrder: 2,
    createdAt: '2025-02-15T00:00:00.000Z'
  }
];

export const initialSubscribers: NewsletterSubscriberItem[] = [
  {
    id: 'sub-1',
    email: 'plant.operations@steeldynamics.com',
    isSubscribed: true,
    subscribedAt: '2025-01-05T00:00:00.000Z'
  }
];
