import { ServiceItem, IndustryItem, ProjectItem, WebsiteContent } from '../types.js';

export const initialWebsiteContent: WebsiteContent = {
  companyName: 'AMM Automation',
  companyDescription: 'AMM Automation is a reliable partner in the field of industrial automation, process instrumentation, and smart Industry 4.0 solutions.',
  tagline: 'Innovate. Automate. Control.',
  heroHeading: 'Industrial Automation & Smart Solutions',
  heroSubheading: 'Smart Solutions. Safer Operations. Stronger Tomorrow.',
  heroDescription: 'AMM Automation is a reliable partner in the field of industrial automation, process instrumentation, and smart Industry 4.0 solutions. We specialize in delivering advanced, cost-effective, and plant-ready solutions designed to improve operational efficiency, safety, productivity, and reliability.',
  aboutIntro: 'AMM Automation is dedicated to engineering excellence, offering complete turnkey automation, process instrumentation, electrical engineering, and smart manufacturing integration for heavy industries and modern enterprises.',
  aboutMission: 'To empower industrial operations with resilient, high-precision automation and intelligent digital monitoring solutions that optimize uptime, elevate plant safety, and drive measurable efficiency.',
  aboutVision: 'To be the most trusted industrial engineering and automation partner across process and manufacturing industries, recognized for technical depth, robust execution, and customer-first commitment.',
  aboutApproach: 'We combine rigorous field-level engineering with cutting-edge Industry 4.0 technologies—from precision field sensors and rugged PLC/SCADA architectures to enterprise analytics and safety compliance.',
  ctaHeading: "Let's Automate Today for a Smarter Tomorrow!",
  ctaSubheading: 'Connect with our engineering specialists to discuss your plant automation, process instrumentation, or custom digital transformation requirements.',
  contactEmail: 'ammautomationsr@gmail.com',
  contactPhone: '+91 9204673578',
  whatsappNumber: '+91 9204673578',
  address: 'Industrial Engineering Center, Sector 4, Bokaro / Ranchi Industrial Corridor, Jharkhand, India',
  workingHours: 'Monday - Saturday: 9:00 AM - 6:30 PM (24/7 Breakdown & Support on-call)'
};

export const initialServices: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Electrical Solutions',
    slug: 'electrical-solutions',
    shortDescription: 'Comprehensive industrial pump and motor overhauling, testing, and precision stator/rotor rewinding services.',
    fullDescription: 'AMM Automation delivers end-to-end electrical maintenance, refurbishment, and rewinding services for industrial pumps, AC/DC motors, heavy induction machines, and transformers. Our workshop and field technicians utilize high-grade insulation materials (Class F/H), precision dynamic balancing, and comprehensive load-testing protocols to restore peak machine efficiency and minimize unplanned downtime.',
    image: '/images/plc_control_panel.jpg',
    iconName: 'Zap',
    subOfferings: ['Pump & Motor Services', 'Stator & Rotor Rewindings', 'HT/LT Motor Overhauling', 'Dynamic Balancing & Vibration Analysis'],
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
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-2',
    title: 'Industrial Automation Solutions',
    slug: 'industrial-automation',
    shortDescription: 'Turnkey PLC programming, SCADA development, HMI interfaces, and VFD/Electrical Drive panel integration.',
    fullDescription: 'We architect, program, and commission robust industrial automation systems tailored to plant specifications. From Siemens, Rockwell/Allen Bradley, Schneider, and Mitsubishi PLCs to high-reliability SCADA supervisory control, distributed I/O, and variable frequency drive (VFD) panels, our solutions ensure repeatable precision, fail-safe interlocking, and intuitive operator telemetry.',
    image: '/images/hero_automation.jpg',
    iconName: 'Cpu',
    subOfferings: ['PLC Programming & Architecture', 'SCADA Supervisory Control', 'VFD & Electrical Drive Systems', 'Control Panel Fabrication'],
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
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-3',
    title: 'Process Instruments',
    slug: 'process-instruments',
    shortDescription: 'High-precision RTDs, thermocouples, flow, level, pressure transmitters, and thermal imaging diagnostics.',
    fullDescription: 'Accurate process measurement is the foundation of plant safety and product quality. AMM Automation supplies, installs, calibrates, and maintains high-accuracy process instrumentation—including simplex/duplex RTDs, industrial thermocouples, thermal imaging condition monitoring, electromagnetic/vortex flow transmitters, radar/ultrasonic level transmitters, and differential pressure gauges.',
    image: '/images/instrumentation_field.jpg',
    iconName: 'Gauge',
    subOfferings: ['RTDs & Thermocouples', 'Thermal Imaging Solutions', 'Flow Transmitters', 'Level Transmitters', 'Pressure & DP Transmitters'],
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
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-4',
    title: 'Safety Systems',
    slug: 'safety-systems',
    shortDescription: 'Certified Safety PLCs, ESD (Emergency Shutdown) interlocks, SIL-rated loop engineering, and fire/gas detection.',
    fullDescription: 'Industrial plant safety protects human lives and critical capital equipment. AMM Automation designs, integrates, and audits safety-instrumented systems (SIS) up to SIL-3 compliance. Our capabilities include fail-safe burner management (BMS), emergency depressurization systems, optical flame detection, toxic/combustible gas monitoring, and safety light curtains.',
    image: '/images/safety_systems.jpg',
    iconName: 'ShieldAlert',
    subOfferings: ['Safety Instrumented Systems (SIS)', 'Emergency Shutdown (ESD)', 'Burner Management Systems (BMS)', 'Fire & Gas Detection Systems'],
    features: [
      'TUV certified SIL-2/SIL-3 safety PLC architectures (1oo2, 2oo3 voting)',
      'Dual-redundant power supplies and fail-safe field wiring',
      'Emergency shutdown trip matrices and cause-and-effect validation',
      'Fast-response optical IR3/UV flame detectors and toxic gas sensors',
      'Comprehensive safety audit and periodic loop testing'
    ],
    applications: [
      'Chemical reaction vessels and explosive zone storage',
      'Blast furnace gas distribution and gas holder stations',
      'Refinery distillation columns and compressor stations',
      'Heavy press machines, shears, and automated robotic cells'
    ],
    relatedIndustries: ['Oil & Gas', 'Steel Industry', 'Pharma', 'Power Industry'],
    isActive: true,
    order: 4,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-5',
    title: 'Robotics & Factory Automation',
    slug: 'robotics-automation',
    shortDescription: 'Industrial articulated robotic cells, automated guided vehicles (AGVs), vision inspection, and end-of-line packaging.',
    fullDescription: 'Accelerate cycle times, eliminate manual handling fatigue, and ensure zero-defect output with robotic automation. We provide custom-tooled robotic cells (6-axis articulated, SCARA, and collaborative cobots) for precision arc/spot welding, high-speed pick-and-place, machine tending, palletizing, and automated vision inspection.',
    image: '/images/robotics_smart_plant.jpg',
    iconName: 'Bot',
    subOfferings: ['Robotic Welding & Cutting', 'Pick-and-Place & Palletizing', 'Machine Vision Inspection', 'Collaborative Robots (Cobots)'],
    features: [
      'Integration with KUKA, FANUC, ABB, and Universal Robots',
      'Deep-learning 2D/3D camera vision inspection and barcode tracking',
      'Custom pneumatic/vacuum end-of-arm tooling (EOAT) design',
      'Full safety fencing with interlocked light curtains and area scanners',
      'Plug-and-play integration with upstream conveyor and MES systems'
    ],
    applications: [
      'Automotive sheet metal welding and component handling',
      'High-speed FMCG cartooning and pallet loading',
      'CNC lathe and milling machine automatic billet tending',
      'Pharmaceutical blister pack optical quality inspection'
    ],
    relatedIndustries: ['Automotive', 'Food & Beverage', 'Pharma', 'Consumer Goods'],
    isActive: true,
    order: 5,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-6',
    title: 'Industrial IoT & Energy Management',
    slug: 'iiot-energy-management',
    shortDescription: 'Smart edge telemetry, cloud monitoring, automated energy audits, and predictive vibration AI condition monitoring.',
    fullDescription: 'Transition into Industry 4.0 with AMM Automation’s connected industrial IoT ecosystem. We deploy edge gateways, wireless vibration and temperature sensors, smart digital power meters, and cloud/on-prem dashboards to provide real-time plant KPIs, automated specific energy consumption (SEC) tracking, and predictive maintenance alerts.',
    image: '/images/iot_smart_energy.jpg',
    iconName: 'LineChart',
    subOfferings: ['Smart Energy Monitoring (EMS)', 'Edge Telemetry & Cloud Gateways', 'Predictive Maintenance Sensors', 'OEE & Production Dashboards'],
    features: [
      'RS485 Modbus / MQTT edge gateway integration with zero data loss',
      'Sub-meter level energy profiling (kWh, kVA, Power Factor, THD)',
      'Automated peak-demand alerts and tariff optimization algorithms',
      'Continuous vibration FFT spectrum analysis for early bearing wear',
      'Custom web & mobile dashboards accessible anywhere with role-based access'
    ],
    applications: [
      'Plant-wide ISO 50001 energy management compliance',
      'Critical pump, blower, and gearbox continuous health tracking',
      'Overall Equipment Effectiveness (OEE) tracking on packaging lines',
      'Remote utility monitoring across multi-site industrial campuses'
    ],
    relatedIndustries: ['Steel Industry', 'Cement Industry', 'Power Industry', 'Pharma', 'Food & Beverage'],
    isActive: true,
    order: 6,
    createdAt: '2025-01-10T00:00:00.000Z'
  }
];

export const initialIndustries: IndustryItem[] = [
  {
    id: 'ind-1',
    name: 'Steel Industry',
    slug: 'steel-industry',
    description: 'Heavy-duty automation, blast furnace instrumentation, rolling mill drive synchronization, and harsh environment process control.',
    image: '/images/metal_plant.jpg',
    iconName: 'Flame',
    challenges: [
      'Extreme ambient temperatures and heavy abrasive dust causing sensor failure',
      'Synchronized multi-stand drive control requiring sub-millisecond precision',
      'High energy consumption and gas emission management across blast furnaces',
      'Unscheduled downtime during continuous slab casting resulting in heavy losses'
    ],
    solutions: [
      'Ruggedized RTD/Thermocouple assemblies rated up to 1600°C with ceramic thermowells',
      'Siemens S7-1500 / Rockwell ControlLogix mill control with high-speed VFD drives',
      'Automated blast furnace gas (BFG) and coke oven gas (COG) safety trip systems',
      'Real-time vibration and thermal bearing monitoring on heavy continuous casters'
    ],
    relatedServices: ['Industrial Automation Solutions', 'Process Instruments', 'Electrical Solutions', 'Safety Systems'],
    isActive: true,
    order: 1
  },
  {
    id: 'ind-2',
    name: 'Power Generation',
    slug: 'power-industry',
    description: 'Thermal and renewable power plant automation, boiler-turbine-generator (BTG) instrumentation, and high-voltage motor overhauls.',
    image: '/images/plc_control_panel.jpg',
    iconName: 'Zap',
    challenges: [
      'Critical boiler drum level and steam temperature fluctuations',
      'Stringent environmental emission norms (SOx, NOx, SPM monitoring)',
      'HT boiler feed pump motor failures under continuous duty cycle',
      'Turbine overspeed and vibration protection reliability'
    ],
    solutions: [
      'Triple modular redundant (2oo3) drum level DP and radar measurement systems',
      'Continuous emission monitoring system (CEMS) telemetry integration',
      'Precision HT motor overhauling, VPI rewinding, and dynamic field balancing',
      'SIL-3 certified emergency steam turbine trip and bypass interlocks'
    ],
    relatedServices: ['Electrical Solutions', 'Process Instruments', 'Safety Systems', 'Industrial Automation Solutions'],
    isActive: true,
    order: 2
  },
  {
    id: 'ind-3',
    name: 'Water & Wastewater',
    slug: 'water-treatment',
    description: 'Turnkey automation for industrial effluent treatment plants (ETP), sewage treatment plants (STP), and water distribution SCADA.',
    image: '/images/water_treatment.jpg',
    iconName: 'Droplets',
    challenges: [
      'Geographically dispersed pump houses requiring centralized telemetry',
      'Chemical dosing variations causing water quality non-compliance',
      'Frequent pump impeller wear and cavitation failures',
      'High electrical pumping energy costs during peak tariff hours'
    ],
    solutions: [
      'Long-range cellular/radio SCADA for remote reservoir and valve monitoring',
      'Automated pH, turbidity, dissolved oxygen (DO), and chlorine control loops',
      'Heavy submersible pump overhauling, rewinding, and mechanical seal replacement',
      'VFD speed control optimizing pump delivery curves to reduce energy by up to 28%'
    ],
    relatedServices: ['Industrial Automation Solutions', 'Process Instruments', 'Electrical Solutions', 'Industrial IoT & Energy Management'],
    isActive: true,
    order: 3
  },
  {
    id: 'ind-4',
    name: 'Automotive & Discrete Manufacturing',
    slug: 'automotive-manufacturing',
    description: 'High-speed assembly automation, robotic welding fixtures, conveyor sequencing, and machine vision quality inspection.',
    image: '/images/robotics_smart_plant.jpg',
    iconName: 'Car',
    challenges: [
      'Tight cycle time constraints requiring rapid tooling transitions',
      'Zero-defect quality standards on safety-critical automotive parts',
      'Operator safety around high-speed pneumatic presses and robotic cells',
      'Lack of real-time visibility into overall equipment effectiveness (OEE)'
    ],
    solutions: [
      'Turnkey multi-axis robotic welding and material handling integration',
      'Cognex / Keyence high-resolution machine vision inspection stations',
      'Safety light curtains, laser scanners, and dual-channel safety relays',
      'Edge IoT gateways streaming line tact time, scrap count, and OEE to plant screens'
    ],
    relatedServices: ['Robotics & Factory Automation', 'Industrial Automation Solutions', 'Safety Systems', 'Industrial IoT & Energy Management'],
    isActive: true,
    order: 4
  }
];

export const initialProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Modernization of Hot Strip Mill Automation & VFD Drive Synchronization',
    slug: 'hot-strip-mill-automation',
    shortDescription: 'Turnkey PLC & multi-drive retrofit for a 6-stand hot rolling mill resulting in 18% higher throughput and 99.4% operational uptime.',
    fullDescription: 'AMM Automation engineered and executed complete automation modernization for a major integrated steel producer. The legacy DC drive system on 6 continuous finishing stands was replaced with synchronized Siemens AC drives and S7-1500F safety PLCs over high-speed Profinet IRT. The upgrade delivered precise tension control between stands, eliminated cobbles, and introduced a high-resolution SCADA interface with historical microsecond fault capture.',
    featuredImage: '/images/hero_automation.jpg',
    gallery: [
      '/images/plc_control_panel.jpg',
      '/images/scada_system.jpg',
      '/images/metal_plant.jpg'
    ],
    industry: 'Steel Industry',
    services: ['Industrial Automation Solutions', 'Electrical Solutions', 'Safety Systems'],
    technologies: ['Siemens S7-1500 PLC', 'Sinamics S120 Drives', 'WinCC Professional SCADA', 'Profinet IRT', 'Safety Integrated'],
    status: 'Completed',
    clientType: 'Major Integrated Steel Plant',
    location: 'Bokaro Industrial Corridor, Jharkhand',
    completionYear: '2024',
    isFeatured: true,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'proj-2',
    title: 'High-Pressure Boiler Drum Level & Combustion Control Instrumentation',
    slug: 'boiler-instrumentation-upgrade',
    shortDescription: 'Triplicated DP level transmitters and pneumatic fuel-air cross-limiting control for a 120 TPH captive power plant boiler.',
    fullDescription: 'To address steam temperature swings and drum level trip occurrences during load changes, AMM Automation designed a 2oo3 voting drum level measurement architecture and implemented a digital 3-element feed-water control loop. The project also included zirconia oxygen analyzers in flue gas and high-accuracy RTD thermowell assemblies for superheater tubes.',
    featuredImage: '/images/instrumentation_field.jpg',
    gallery: [
      '/images/plc_control_panel.jpg',
      '/images/hero_automation.jpg'
    ],
    industry: 'Power Generation',
    services: ['Process Instruments', 'Safety Systems', 'Industrial Automation Solutions'],
    technologies: ['HART Differential Pressure Transmitters', 'Zirconia Flue Gas Analyzers', 'Simplex/Duplex RTDs', 'SIL-3 Safety Loop Logic'],
    status: 'Completed',
    clientType: 'Thermal Power Utility',
    location: 'Odisha Industrial Zone',
    completionYear: '2024',
    isFeatured: true,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'proj-3',
    title: 'Robotic Weld Cell & Automated End-of-Line Inspection',
    slug: 'robotic-weld-inspection-cell',
    shortDescription: 'Turnkey 6-axis robotic welding workstation with 3D laser bead inspection and dual safety zone enclosure.',
    fullDescription: 'Custom-designed robotic welding solution for automotive chassis cross-member fabrication. The system features a 6-axis industrial robot, automatic torch cleaner, dual-station servo positioner, and an integrated machine vision camera validating weld penetration and dimensional tolerances before ejection.',
    featuredImage: '/images/robotics_smart_plant.jpg',
    gallery: [
      '/images/hero_automation.jpg',
      '/images/plc_control_panel.jpg'
    ],
    industry: 'Automotive & Discrete Manufacturing',
    services: ['Robotics & Factory Automation', 'Safety Systems', 'Industrial Automation Solutions'],
    technologies: ['6-Axis Industrial Robot', 'High-Speed Machine Vision', 'Safety Area Scanners', 'Modbus TCP Telemetry'],
    status: 'Completed',
    clientType: 'Tier-1 Automotive Component Manufacturer',
    location: 'Jamshedpur Auto Hub',
    completionYear: '2024',
    isFeatured: true,
    createdAt: '2025-01-10T00:00:00.000Z'
  }
];
