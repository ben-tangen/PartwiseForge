export const tutorPartOrder = [
  'cpu',
  'cooler',
  'mobo',
  'ram',
  'storage',
  'gpu',
  'case',
  'psu',
]

export const tutorParts = {
  mobo: {
    key: 'mobo',
    label: 'Motherboard',
    shortLabel: 'mobo',
    whatItIs: 'The motherboard is the main circuit board of the PC.',
    whatItDoes: 'It connects the CPU, RAM, storage, GPU, power, and accessories so they can work together.',
    compatibility: 'Match the CPU socket, RAM type, and case form factor before buying a board.',
    lessonTitle: 'Motherboard basics',
    questionPrompt: 'What does the motherboard do for the PC?',
    questionHint: 'It is the main board that everything plugs into.',
  },
  cpu: {
    key: 'cpu',
    label: 'CPU',
    shortLabel: 'cpu',
    whatItIs: 'The CPU is the computer\'s processor.',
    whatItDoes: 'It handles instructions, calculations, and most of the system\'s decision-making.',
    compatibility: 'The CPU socket must match the motherboard socket, and the cooler bracket must fit the CPU mount.',
    lessonTitle: 'CPU basics',
    questionPrompt: 'What does the CPU do for the PC?',
    questionHint: 'It is often called the brain of the computer.',
  },
  cooler: {
    key: 'cooler',
    label: 'CPU Cooler',
    shortLabel: 'cooler',
    whatItIs: 'A cooler removes heat from the CPU and sometimes other parts.',
    whatItDoes: 'It keeps the system from overheating so the PC can stay stable and fast.',
    compatibility: 'The cooler must fit the CPU socket, the case height limit, and any RAM clearance constraints.',
    lessonTitle: 'CPU cooler basics',
    questionPrompt: 'What does the CPU cooler do for the PC?',
    questionHint: 'It keeps temperatures under control.',
  },
  mobo: {
    key: 'mobo',
    label: 'Motherboard',
    shortLabel: 'mobo',
    whatItIs: 'The motherboard is the main circuit board of the PC.',
    whatItDoes: 'It connects the CPU, RAM, storage, GPU, power, and accessories so they can work together.',
    compatibility: 'Match the CPU socket, RAM type, and case form factor before buying a board.',
    lessonTitle: 'Motherboard basics',
    questionPrompt: 'What does the motherboard do for the PC?',
    questionHint: 'It is the main board that everything plugs into.',
  },
  ram: {
    key: 'ram',
    label: 'Memory',
    shortLabel: 'ram',
    whatItIs: 'RAM is temporary high-speed memory for active tasks.',
    whatItDoes: 'It keeps programs and data ready so the PC can work quickly while powered on.',
    compatibility: 'RAM type and speed must match motherboard support, and the modules must physically fit the slots.',
    lessonTitle: 'Memory basics',
    questionPrompt: 'What does memory do for the PC?',
    questionHint: 'It is the short-term memory used while the PC is running.',
  },
  storage: {
    key: 'storage',
    label: 'Storage',
    shortLabel: 'storage',
    whatItIs: 'Storage keeps the operating system, programs, and files when the PC is turned off.',
    whatItDoes: 'It gives the PC long-term space for data and determines how quickly files and apps load.',
    compatibility: 'Storage type and interface must match the motherboard, and NVMe drives need a supported M.2 slot.',
    lessonTitle: 'Storage basics',
    questionPrompt: 'What does storage do for the PC?',
    questionHint: 'It holds data long-term, even when the PC is off.',
  },
  gpu: {
    key: 'gpu',
    label: 'Video Card',
    shortLabel: 'gpu',
    whatItIs: 'The GPU is the graphics processor.',
    whatItDoes: 'It renders images, video, and 3D graphics, and helps with gaming or visual workloads.',
    compatibility: 'The GPU needs a PCIe x16 slot, enough case clearance, and enough PSU power and connectors.',
    lessonTitle: 'Video card basics',
    questionPrompt: 'What does the video card do for the PC?',
    questionHint: 'It is the part that handles graphics and visuals.',
  },
  case: {
    key: 'case',
    label: 'Case',
    shortLabel: 'case',
    whatItIs: 'The case is the outer enclosure that holds the PC.',
    whatItDoes: 'It protects the components, shapes airflow, and gives the build its physical layout.',
    compatibility: 'The case must support the motherboard size, GPU length, cooler height, and PSU placement.',
    lessonTitle: 'Case basics',
    questionPrompt: 'What does the case do for the PC?',
    questionHint: 'It is the shell that everything is mounted inside of.',
  },
  psu: {
    key: 'psu',
    label: 'Power Supply',
    shortLabel: 'psu',
    whatItIs: 'The PSU is the power supply unit.',
    whatItDoes: 'It converts wall power into the stable voltages the PC parts need.',
    compatibility: 'The PSU needs enough wattage, the right connectors, and the correct physical size for the case.',
    lessonTitle: 'Power supply basics',
    questionPrompt: 'What does the power supply do for the PC?',
    questionHint: 'It is the part that feeds power to the entire system.',
  },
  wifi: {
    key: 'wifi',
    label: 'Wi-Fi',
    shortLabel: 'wifi',
    whatItIs: 'Wi-Fi hardware gives the PC wireless networking access.',
    whatItDoes: 'It lets the system connect to the internet without an ethernet cable.',
    compatibility: 'A Wi-Fi card needs a supported slot or interface, and onboard Wi-Fi changes whether you need a separate card at all.',
    lessonTitle: 'Wi-Fi basics',
    questionPrompt: 'What does Wi-Fi hardware do for the PC?',
    questionHint: 'It adds wireless internet access.',
  },
}

export const tutorSelectionOptions = {
  mobo: [
    {
      key: 'asus-b760-plus-ddr5',
      label: 'ASUS Prime B760-PLUS',
      summary: 'LGA 1700, DDR5, ATX.',
      stackLabel: 'ASUS Prime B760-PLUS (LGA 1700, DDR5)',
      attributes: {
        socket: 'LGA1700',
        ramType: 'DDR5',
        formFactor: 'ATX',
        hasWiFi: false,
        supportedStorageInterfaces: ['SATA', 'M.2'],
      },
    },
    {
      key: 'msi-b550-a-pro',
      label: 'MSI B550-A PRO',
      summary: 'AM4, DDR4, ATX.',
      stackLabel: 'MSI B550-A PRO (AM4, DDR4)',
      attributes: {
        socket: 'AM4',
        ramType: 'DDR4',
        formFactor: 'ATX',
        hasWiFi: false,
        supportedStorageInterfaces: ['SATA'],
      },
    },
    {
      key: 'gigabyte-b650m-wifi',
      label: 'GIGABYTE B650M WiFi',
      summary: 'AM5, DDR5, micro-ATX.',
      stackLabel: 'GIGABYTE B650M WiFi (AM5, DDR5)',
      attributes: {
        socket: 'AM5',
        ramType: 'DDR5',
        formFactor: 'mATX',
        hasWiFi: true,
        supportedStorageInterfaces: ['SATA', 'M.2'],
      },
    },
    {
      key: 'msi-b760m-ddr4',
      label: 'MSI PRO B760M-P DDR4',
      summary: 'LGA 1700, DDR4, micro-ATX.',
      stackLabel: 'MSI PRO B760M-P DDR4 (LGA 1700, DDR4)',
      attributes: {
        socket: 'LGA1700',
        ramType: 'DDR4',
        formFactor: 'mATX',
        hasWiFi: false,
        supportedStorageInterfaces: ['SATA', 'M.2'],
      },
    },
  ],
  cpu: [
    {
      key: 'i7-14700k',
      label: 'Intel Core i7-14700K',
      summary: 'LGA 1700 and a bracket that matches the socket.',
      stackLabel: 'Intel Core i7-14700K (LGA 1700)',
      attributes: {
        socket: 'LGA1700',
        bracket: 'LGA1700',
        ramType: 'DDR5',
        generation: '14th Gen',
      },
    },
    {
      key: 'ryzen-5-5600x',
      label: 'AMD Ryzen 5 5600X',
      summary: 'AM4 CPU with an AM4 bracket.',
      stackLabel: 'AMD Ryzen 5 5600X (AM4)',
      attributes: {
        socket: 'AM4',
        bracket: 'AM4',
        ramType: 'DDR4',
        generation: 'Zen 3',
      },
    },
    {
      key: 'i5-13600k',
      label: 'Intel Core i5-13600K',
      summary: 'LGA 1700 and a matching socket bracket.',
      stackLabel: 'Intel Core i5-13600K (LGA 1700)',
      attributes: {
        socket: 'LGA1700',
        bracket: 'LGA1700',
        ramType: 'DDR5',
        generation: '13th Gen',
      },
    },
    {
      key: 'ryzen-7-7700x',
      label: 'AMD Ryzen 7 7700X',
      summary: 'AM5 CPU that needs DDR5 support.',
      stackLabel: 'AMD Ryzen 7 7700X (AM5)',
      attributes: {
        socket: 'AM5',
        bracket: 'AM5',
        ramType: 'DDR5',
        generation: 'Zen 4',
      },
    },
  ],
  ram: [
    {
      key: 'corsair-32-ddr5',
      label: 'Corsair Vengeance 32GB DDR5-6000',
      summary: 'DDR5 kit built for current Intel and AMD boards.',
      stackLabel: 'Corsair Vengeance 32GB DDR5-6000',
      attributes: {
        ramType: 'DDR5',
        capacityGb: 32,
        speedMhz: 6000,
      },
    },
    {
      key: 'gskill-32-ddr4',
      label: 'G.Skill Ripjaws 32GB DDR4-3600',
      summary: 'DDR4 kit for older compatible boards.',
      stackLabel: 'G.Skill Ripjaws 32GB DDR4-3600',
      attributes: {
        ramType: 'DDR4',
        capacityGb: 32,
        speedMhz: 3600,
      },
    },
    {
      key: 'teamgroup-16-ddr5',
      label: 'TeamGroup 16GB DDR5-5200',
      summary: 'DDR5 starter kit.',
      stackLabel: 'TeamGroup 16GB DDR5-5200',
      attributes: {
        ramType: 'DDR5',
        capacityGb: 16,
        speedMhz: 5200,
      },
    },
    {
      key: 'kingston-32-ddr4',
      label: 'Kingston Fury 32GB DDR4-3200',
      summary: 'DDR4 kit for AM4 or DDR4 boards.',
      stackLabel: 'Kingston Fury 32GB DDR4-3200',
      attributes: {
        ramType: 'DDR4',
        capacityGb: 32,
        speedMhz: 3200,
      },
    },
  ],
  storage: [
    {
      key: 'samsung-990-pro',
      label: 'Samsung 990 Pro 1TB',
      summary: 'NVMe M.2 drive for fast primary storage.',
      stackLabel: 'Samsung 990 Pro 1TB NVMe',
      attributes: {
        type: 'NVMe',
        interface: 'M.2',
        capacityGb: 1000,
      },
    },
    {
      key: 'crucial-bx500',
      label: 'Crucial BX500 1TB',
      summary: 'SATA SSD for budget storage.',
      stackLabel: 'Crucial BX500 1TB SATA SSD',
      attributes: {
        type: 'SSD',
        interface: 'SATA',
        capacityGb: 1000,
      },
    },
    {
      key: 'seagate-barra-2tb',
      label: 'Seagate Barracuda 2TB',
      summary: 'Traditional hard drive for bulk storage.',
      stackLabel: 'Seagate Barracuda 2TB HDD',
      attributes: {
        type: 'HDD',
        interface: 'SATA',
        capacityGb: 2000,
      },
    },
    {
      key: 'wd-black-sn850x',
      label: 'WD Black SN850X 2TB',
      summary: 'High-performance NVMe M.2 drive.',
      stackLabel: 'WD Black SN850X 2TB NVMe',
      attributes: {
        type: 'NVMe',
        interface: 'M.2',
        capacityGb: 2000,
      },
    },
  ],
  gpu: [
    {
      key: 'rtx-4070-super',
      label: 'NVIDIA GeForce RTX 4070 Super',
      summary: 'Strong gaming GPU with a moderate power draw.',
      stackLabel: 'NVIDIA GeForce RTX 4070 Super',
      attributes: {
        slot: 'PCIe x16',
        powerWattage: 220,
        lengthMm: 300,
      },
    },
    {
      key: 'rx-6600',
      label: 'AMD Radeon RX 6600',
      summary: 'Efficient PCIe graphics card.',
      stackLabel: 'AMD Radeon RX 6600',
      attributes: {
        slot: 'PCIe x16',
        powerWattage: 130,
        lengthMm: 240,
      },
    },
    {
      key: 'rtx-4090',
      label: 'NVIDIA GeForce RTX 4090',
      summary: 'Huge card with a big power requirement.',
      stackLabel: 'NVIDIA GeForce RTX 4090',
      attributes: {
        slot: 'PCIe x16',
        powerWattage: 450,
        lengthMm: 336,
      },
    },
    {
      key: 'rx-7600',
      label: 'AMD Radeon RX 7600',
      summary: 'Compact 1080p card.',
      stackLabel: 'AMD Radeon RX 7600',
      attributes: {
        slot: 'PCIe x16',
        powerWattage: 165,
        lengthMm: 267,
      },
    },
  ],
  cooler: [
    {
      key: 'peerless-assassin-120',
      label: 'Thermalright Peerless Assassin 120 SE',
      summary: 'Air cooler with an LGA 1700 mount and sensible height.',
      stackLabel: 'Thermalright Peerless Assassin 120 SE',
      attributes: {
        socket: 'LGA1700',
        heightMm: 157,
      },
    },
    {
      key: 'wraith-stealth',
      label: 'AMD Wraith Stealth',
      summary: 'AM4 stock cooler for lower-power CPUs.',
      stackLabel: 'AMD Wraith Stealth',
      attributes: {
        socket: 'AM4',
        heightMm: 54,
      },
    },
    {
      key: 'h150i-elite',
      label: 'Corsair iCUE H150i Elite',
      summary: '360mm AIO with a tall radiator footprint.',
      stackLabel: 'Corsair iCUE H150i Elite',
      attributes: {
        socket: 'LGA1700',
        heightMm: 120,
      },
    },
    {
      key: 'nh-d15',
      label: 'Noctua NH-D15',
      summary: 'Large dual-tower cooler.',
      stackLabel: 'Noctua NH-D15',
      attributes: {
        socket: 'LGA1700',
        heightMm: 165,
      },
    },
  ],
  case: [
    {
      key: 'fractal-pop-air',
      label: 'Fractal Design Pop Air',
      summary: 'ATX case with strong clearance.',
      stackLabel: 'Fractal Design Pop Air',
      attributes: {
        supportedFormFactors: ['ATX', 'mATX', 'ITX'],
        maxGpuLengthMm: 405,
        maxCoolerHeightMm: 170,
      },
    },
    {
      key: 'corsair-3000d',
      label: 'Corsair 3000D Airflow',
      summary: 'ATX case with room for large parts.',
      stackLabel: 'Corsair 3000D Airflow',
      attributes: {
        supportedFormFactors: ['ATX', 'mATX', 'ITX'],
        maxGpuLengthMm: 360,
        maxCoolerHeightMm: 170,
      },
    },
    {
      key: 'nzxt-h5-flow',
      label: 'NZXT H5 Flow',
      summary: 'ATX and mATX friendly mid-tower.',
      stackLabel: 'NZXT H5 Flow',
      attributes: {
        supportedFormFactors: ['ATX', 'mATX', 'ITX'],
        maxGpuLengthMm: 365,
        maxCoolerHeightMm: 165,
      },
    },
    {
      key: 'mini-itx-cozy',
      label: 'Mini-ITX Compact Case',
      summary: 'Tiny case with very limited clearance.',
      stackLabel: 'Mini-ITX Compact Case',
      attributes: {
        supportedFormFactors: ['ITX'],
        maxGpuLengthMm: 230,
        maxCoolerHeightMm: 120,
      },
    },
  ],
  psu: [
    {
      key: 'corsair-rm750e',
      label: 'Corsair RM750e 750W',
      summary: 'ATX power supply with enough wattage for the starter build.',
      stackLabel: 'Corsair RM750e 750W',
      attributes: {
        wattage: 750,
        formFactor: 'ATX',
        connectors: ['24-pin ATX', 'EPS 8-pin', 'PCIe 8-pin'],
      },
    },
    {
      key: 'seasonic-focus-650',
      label: 'Seasonic Focus GX-650',
      summary: '650W ATX power supply.',
      stackLabel: 'Seasonic Focus GX-650',
      attributes: {
        wattage: 650,
        formFactor: 'ATX',
        connectors: ['24-pin ATX', 'EPS 8-pin', 'PCIe 8-pin'],
      },
    },
    {
      key: 'sfx-450',
      label: 'Cooler Master V SFX 450W',
      summary: 'Small SFX unit for compact builds only.',
      stackLabel: 'Cooler Master V SFX 450W',
      attributes: {
        wattage: 450,
        formFactor: 'SFX',
        connectors: ['24-pin ATX', 'EPS 8-pin', 'PCIe 6-pin'],
      },
    },
    {
      key: 'thermaltake-850',
      label: 'Thermaltake Toughpower 850W',
      summary: 'High-wattage ATX supply for larger GPUs.',
      stackLabel: 'Thermaltake Toughpower 850W',
      attributes: {
        wattage: 850,
        formFactor: 'ATX',
        connectors: ['24-pin ATX', 'EPS 8-pin', 'PCIe 8-pin'],
      },
    },
  ],
  wifi: [
    {
      key: 'intel-ax210-m2',
      label: 'Intel AX210 M.2 Wi-Fi Card',
      summary: 'Uses an M.2 E-key slot.',
      stackLabel: 'Intel AX210 M.2 Wi-Fi Card',
      attributes: {
        interface: 'M.2',
      },
    },
    {
      key: 'tp-link-pcie-x1',
      label: 'TP-Link Archer TX3000E',
      summary: 'PCIe x1 Wi-Fi card.',
      stackLabel: 'TP-Link Archer TX3000E',
      attributes: {
        interface: 'PCIe x1',
      },
    },
    {
      key: 'usb-wifi-6',
      label: 'USB Wi-Fi 6 Adapter',
      summary: 'Simple USB wireless adapter.',
      stackLabel: 'USB Wi-Fi 6 Adapter',
      attributes: {
        interface: 'USB',
      },
    },
    {
      key: 'onboard-wifi-card',
      label: 'Onboard Wi-Fi Module',
      summary: 'Represents a motherboard with built-in Wi-Fi.',
      stackLabel: 'Onboard Wi-Fi Module',
      attributes: {
        interface: 'Onboard',
      },
    },
  ],
}

export const tutorBuildBlueprint = {
  cpu: {
    socket: 'LGA1700',
    bracket: 'LGA1700',
    ramType: 'DDR5',
  },
  cooler: {
    socket: 'LGA1700',
    maxHeightMm: 160,
  },
  mobo: {
    socket: 'LGA1700',
    ramType: 'DDR5',
    formFactor: 'ATX',
    hasWiFi: false,
    supportedStorageInterfaces: ['SATA', 'M.2'],
  },
  ram: {
    ramType: 'DDR5',
    capacityGb: 32,
    speedMhz: 6000,
  },
  storage: {
    type: 'NVMe',
    interface: 'M.2',
    capacityGb: 1000,
  },
  gpu: {
    slot: 'PCIe x16',
    powerWattage: 220,
    lengthMm: 300,
    requiredPsuWattage: 650,
  },
  case: {
    formFactor: 'ATX',
    maxGpuLengthMm: 360,
    maxCoolerHeightMm: 170,
    supportedPsuFormFactors: ['ATX'],
  },
  psu: {
    wattage: 750,
    formFactor: 'ATX',
  },
  wifi: {
    supportedInterfaces: ['M.2', 'PCIe x1', 'USB'],
  },
}

export const tutorOverviewCards = [
  {
    title: 'Part selection',
    description: 'Learn what each component does and how parts fit together before touching the build stack.',
  },
  {
    title: 'Assembly',
    description: 'Pick compatible parts in the right order so each choice feeds into the next one.',
  },
  {
    title: 'Hints',
    description: 'Get guided feedback when a reading answer is wrong or a part choice does not fit the build.',
  },
]

export const tutorGradingFlow = [
  {
    title: 'Content + Rules',
    description: 'The answer is checked against the lesson content and strict answer rules.',
  },
  {
    title: 'Evaluation Layer',
    description: 'The LLM acts as the evaluator for borderline answers and applies the grading prompt.',
  },
  {
    title: 'Progress Tracking',
    description: 'The app marks the question, stores completion, and unlocks the next step.',
  },
  {
    title: 'Hints / Next Step',
    description: 'If the answer is wrong, the learner gets a targeted hint and can try again.',
  },
]

export function getTutorPart(partKey) {
  return tutorParts[partKey]
}

export function getTutorOptions(partKey) {
  return tutorSelectionOptions[partKey] ?? []
}
