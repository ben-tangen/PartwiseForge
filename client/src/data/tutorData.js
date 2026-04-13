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
    buyingTips: [
      'Intel K chips are unlocked for overclocking; non-K chips are usually cheaper and easier to cool.',
      'AMD X chips are higher-clock models; X3D chips add extra cache and are often stronger for gaming.',
      'Core count matters for multitasking and creator work, while gaming often benefits more from fast single-core performance.',
      'Check platform lifespan and upgrade path so your motherboard can support future CPU options.',
    ],
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
    buyingTips: [
      'Air coolers are usually quieter and simpler to maintain, while AIO liquid coolers can offer better peak thermals in some builds.',
      'Always verify socket mounting support in the cooler box, especially across older and newer CPU generations.',
      'Check case clearance for tower height or radiator size before buying.',
      'For sustained gaming or rendering, prioritize coolers with strong thermal headroom instead of bare-minimum models.',
    ],
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
    buyingTips: [
      'Start with socket and chipset, then confirm RAM generation support (DDR4 vs DDR5) and desired memory speeds.',
      'Check the VRM quality if you plan on higher-power CPUs; weak VRMs can limit performance and stability.',
      'Verify M.2 slot count, PCIe lane layout, rear I/O, and internal headers so the board matches your full build plan.',
      'Choose form factor based on expansion needs: ATX for flexibility, mATX for balance, ITX for compact builds.',
    ],
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
    buyingTips: [
      'Capacity first, speed second: 32GB is a strong target for modern gaming and multitasking.',
      'Use matched kits (2x or 4x) to ensure stable dual-channel operation and easier tuning.',
      'Lower latency and higher frequency both help, but real gains depend on CPU and game/workload behavior.',
      'Enable EXPO/XMP after installation to run advertised memory speeds.',
    ],
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
    buyingTips: [
      'Use NVMe SSDs for the OS and frequently played games; SATA SSDs remain good for budget expansion.',
      'Check sustained write performance and endurance ratings if you move large files often.',
      'Confirm your motherboard M.2 slot generation to avoid paying for speeds your platform cannot use.',
      'A common strategy is a fast primary SSD plus larger secondary storage for media and archives.',
    ],
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
    buyingTips: [
      'Pick GPU based on target resolution and frame rate first, then compare cards in that performance class.',
      'VRAM capacity matters more as texture quality and resolution increase.',
      'Check total board power, connector type, and cooler size before buying.',
      'For creator workflows, verify encoder support and app-specific acceleration, not just game benchmarks.',
    ],
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
    buyingTips: [
      'Prioritize airflow layout and fan support over pure aesthetics for easier thermal management.',
      'Check clearance specs for GPU length, cooler height, and radiator compatibility before committing.',
      'Front I/O and cable-routing space can strongly affect daily usability and build quality.',
      'Compact cases save space but often require tighter part choices and more planning.',
    ],
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
    buyingTips: [
      'Leave headroom above estimated load so transient spikes do not cause instability under gaming or rendering peaks.',
      'Look for 80 Plus Gold or better, strong OEM reviews, and modern protection features.',
      'Fully modular units make cable management easier and improve airflow in tighter cases.',
      'Verify connector support for your exact GPU and motherboard power requirements.',
    ],
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
      summary: 'LGA 1700 CPU that can pair with DDR4 or DDR5 boards.',
      stackLabel: 'Intel Core i7-14700K (LGA 1700)',
      attributes: {
        socket: 'LGA1700',
        bracket: 'LGA1700',
        ramType: ['DDR4', 'DDR5'],
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
      summary: 'LGA 1700 CPU that can pair with DDR4 or DDR5 boards.',
      stackLabel: 'Intel Core i5-13600K (LGA 1700)',
      attributes: {
        socket: 'LGA1700',
        bracket: 'LGA1700',
        ramType: ['DDR4', 'DDR5'],
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
}

export const tutorBuildBlueprint = {
  cpu: {
    socket: 'LGA1700',
    bracket: 'LGA1700',
    ramType: ['DDR4', 'DDR5'],
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

export const tutorOptionImages = {
  'asus-b760-plus-ddr5': '/images/ausus prim b760.jpeg',
  'msi-b550-a-pro': '/images/b550 a pro.jpeg',
  'gigabyte-b650m-wifi': '/images/gigabyte b650m wifi.jpeg',
  'msi-b760m-ddr4': '/images/msi prom p ddr4.jpeg',
  'i7-14700k': '/images/i7 14700k.jpeg',
  'ryzen-5-5600x': '/images/Ryzen 5 5500.png',
  'i5-13600k': '/images/i7 12700k.avif',
  'ryzen-7-7700x': '/images/ryzen 5 7600.jpeg',
  'corsair-32-ddr5': '/images/vengeance corsair ddd5.jpeg',
  'gskill-32-ddr4': '/images/ripjaws.jpeg',
  'teamgroup-16-ddr5': '/images/teamgroup ddr5.jpeg',
  'kingston-32-ddr4': '/images/kingston fury dd4.jpeg',
  'samsung-990-pro': '/images/samsung 990 pro1tb.jpeg',
  'crucial-bx500': '/images/crucial bx500 1tb.jpeg',
  'seagate-barra-2tb': '/images/seagate barracude 2tb.jpeg',
  'wd-black-sn850x': '/images/sn850x.jpeg',
  'rtx-4070-super': '/images/rtx 4070 super.jpeg',
  'rx-6600': '/images/rx 6600.jpeg',
  'rtx-4090': '/images/rtx 4080.jpeg',
  'rx-7600': '/images/rx 7600.jpeg',
  'peerless-assassin-120': '/images/thermalright peerless assassin.jpeg',
  'wraith-stealth': '/images/amd wraith stealth.jpeg',
  'h150i-elite': '/images/corsair icue h150i elite.jpeg',
  'nh-d15': '/images/noctua nh d15.jpeg',
  'fractal-pop-air': '/images/fractal design pop air.jpeg',
  'corsair-3000d': '/images/corsair 3000d airlfow.jpeg',
  'nzxt-h5-flow': '/images/nzxt h5 flow.jpeg',
  'mini-itx-cozy': '/images/mini itx.jpeg',
  'corsair-rm750e': '/images/rm750e.jpeg',
  'seasonic-focus-650': '/images/seasonic focus gx 650.jpeg',
  'sfx-450': '/images/cooler master 450w.jpeg',
  'thermaltake-850': '/images/toughpower 850w.jpeg',
}

export function getTutorPart(partKey) {
  return tutorParts[partKey]
}

export function getTutorOptions(partKey) {
  return tutorSelectionOptions[partKey] ?? []
}

export function getTutorOptionImage(optionKey) {
  return tutorOptionImages[optionKey] || ''
}
