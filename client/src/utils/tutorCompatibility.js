import { getTutorOptions, tutorBuildBlueprint, tutorParts } from '../data/tutorData'

function normalizeValue(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function includesAny(value, candidates) {
  const normalizedValue = normalizeValue(value)

  return candidates.some((candidate) => {
    const normalizedCandidate = normalizeValue(candidate)
    return normalizedValue.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedValue)
  })
}

function normalizeToArray(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (value === null || value === undefined || value === '') {
    return []
  }

  return [value]
}

function findStackEntry(buildStack, partKey) {
  return buildStack.find((entry) => entry.partKey === partKey)
}

function compareSocket(option, expectedSocket, reasons) {
  if (!option.socket) {
    reasons.push('Socket information is missing.')
    return false
  }

  if (option.socket !== expectedSocket) {
    reasons.push(`Socket mismatch: this option uses ${option.socket}, but the build needs ${expectedSocket}.`)
    return false
  }

  return true
}

function compareRamType(option, expectedRamType, reasons) {
  const optionRamTypes = normalizeToArray(option.ramType)
  const expectedRamTypes = normalizeToArray(expectedRamType)

  if (optionRamTypes.length === 0) {
    reasons.push('RAM type information is missing.')
    return false
  }

  if (expectedRamTypes.length > 0) {
    const hasCompatibleRamType = optionRamTypes.some((optionRamType) => expectedRamTypes.includes(optionRamType))

    if (!hasCompatibleRamType) {
      reasons.push(`RAM type mismatch: this option supports ${optionRamTypes.join(' / ')}, but the build needs ${expectedRamTypes.join(' / ')}.`)
      return false
    }
  }

  return true
}

function ramTypesOverlap(leftRamType, rightRamType) {
  const leftRamTypes = normalizeToArray(leftRamType)
  const rightRamTypes = normalizeToArray(rightRamType)

  if (leftRamTypes.length === 0 || rightRamTypes.length === 0) {
    return false
  }

  return leftRamTypes.some((leftType) => rightRamTypes.includes(leftType))
}

function compareFormFactor(option, expectedFormFactor, reasons) {
  if (!option.formFactor) {
    reasons.push('Form factor information is missing.')
    return false
  }

  if (option.formFactor !== expectedFormFactor) {
    reasons.push(`Form factor mismatch: this option is ${option.formFactor}, but the build needs ${expectedFormFactor}.`)
    return false
  }

  return true
}

function compareStorageInterface(option, expectedInterface, reasons) {
  if (!option.interface) {
    reasons.push('Storage interface information is missing.')
    return false
  }

  if (option.interface !== expectedInterface) {
    reasons.push(`Storage interface mismatch: this option uses ${option.interface}, but the build needs ${expectedInterface}.`)
    return false
  }

  return true
}

export function evaluateTutorSelection(partKey, optionKey, buildStack = []) {
  const part = tutorParts[partKey]
  const options = getTutorOptions(partKey)
  const option = options.find((candidate) => candidate.key === optionKey)

  if (!part) {
    return {
      compatible: false,
      reasons: ['Unknown tutor part.'],
      stackEntry: null,
      option: null,
    }
  }

  if (!option) {
    return {
      compatible: false,
      reasons: ['Unknown selection option.'],
      stackEntry: null,
      option: null,
    }
  }

  const reasons = []
  const motherboard = findStackEntry(buildStack, 'mobo')
  const cpu = findStackEntry(buildStack, 'cpu')
  const gpu = findStackEntry(buildStack, 'gpu')
  const caseEntry = findStackEntry(buildStack, 'case')
  const psu = findStackEntry(buildStack, 'psu')
  const currentBlueprint = tutorBuildBlueprint[partKey] ?? {}

  if (partKey === 'mobo') {
    compareSocket(option.attributes, tutorBuildBlueprint.mobo.socket, reasons)
    compareRamType(option.attributes, tutorBuildBlueprint.mobo.ramType, reasons)
    compareFormFactor(option.attributes, tutorBuildBlueprint.mobo.formFactor, reasons)

    if (cpu?.attributes?.ramType && !ramTypesOverlap(cpu.attributes.ramType, option.attributes.ramType)) {
      reasons.push(`RAM type mismatch with the already selected CPU (${normalizeToArray(cpu.attributes.ramType).join(' / ')}).`)
    }
  }

  if (partKey === 'cpu') {
    compareSocket(option.attributes, tutorBuildBlueprint.cpu.socket, reasons)

    if (option.attributes.bracket !== tutorBuildBlueprint.cpu.bracket) {
      reasons.push(`Cooler bracket mismatch: this CPU needs ${option.attributes.bracket} support.`)
    }

    compareRamType(option.attributes, tutorBuildBlueprint.cpu.ramType, reasons)

    if (motherboard?.attributes?.ramType && !ramTypesOverlap(option.attributes.ramType, motherboard.attributes.ramType)) {
      reasons.push(`RAM type mismatch with the already selected motherboard (${motherboard.attributes.ramType}).`)
    }
  }

  if (partKey === 'ram') {
    compareRamType(option.attributes, tutorBuildBlueprint.ram.ramType, reasons)

    if (typeof option.attributes.capacityGb !== 'number' || option.attributes.capacityGb < tutorBuildBlueprint.ram.capacityGb) {
      reasons.push(`Capacity mismatch: the build wants at least ${tutorBuildBlueprint.ram.capacityGb}GB.`)
    }
  }

  if (partKey === 'storage') {
    if (!option.attributes.type) {
      reasons.push('Storage type information is missing.')
    }

    if (!option.attributes.interface) {
      reasons.push('Storage interface information is missing.')
    }

    compareStorageInterface(option.attributes, tutorBuildBlueprint.storage.interface, reasons)

    if (option.attributes.type === 'NVMe' && option.attributes.interface !== 'M.2') {
      reasons.push('NVMe drives need an M.2 interface for this build.')
    }

    if (typeof option.attributes.capacityGb !== 'number' || option.attributes.capacityGb < tutorBuildBlueprint.storage.capacityGb) {
      reasons.push(`Capacity mismatch: the build wants at least ${tutorBuildBlueprint.storage.capacityGb}GB of storage.`)
    }

    if (motherboard?.attributes?.supportedStorageInterfaces && !includesAny(option.attributes.interface, motherboard.attributes.supportedStorageInterfaces)) {
      reasons.push('The selected motherboard does not support this storage interface.')
    }
  }

  if (partKey === 'gpu') {
    if (option.attributes.slot !== tutorBuildBlueprint.gpu.slot) {
      reasons.push(`Slot mismatch: the GPU must use ${tutorBuildBlueprint.gpu.slot}.`)
    }

    if (typeof option.attributes.powerWattage !== 'number') {
      reasons.push('Power draw information is missing.')
    } else if (option.attributes.powerWattage > tutorBuildBlueprint.gpu.requiredPsuWattage) {
      reasons.push(`Power draw is too high for the starter power budget.`)
    }

    const targetCase = caseEntry?.attributes ?? currentBlueprint.case
    if (targetCase && typeof option.attributes.lengthMm === 'number' && typeof targetCase.maxGpuLengthMm === 'number') {
      if (option.attributes.lengthMm > targetCase.maxGpuLengthMm) {
        reasons.push(`GPU length mismatch: this card is ${option.attributes.lengthMm}mm, but the case only supports ${targetCase.maxGpuLengthMm}mm.`)
      }
    }
  }

  if (partKey === 'cooler') {
    compareSocket(option.attributes, tutorBuildBlueprint.cooler.socket, reasons)

    const targetCase = caseEntry?.attributes ?? currentBlueprint.case
    if (targetCase && typeof option.attributes.heightMm === 'number' && typeof targetCase.maxCoolerHeightMm === 'number') {
      if (option.attributes.heightMm > targetCase.maxCoolerHeightMm) {
        reasons.push(`Cooler height mismatch: this cooler is ${option.attributes.heightMm}mm tall, but the case supports only ${targetCase.maxCoolerHeightMm}mm.`)
      }
    }
  }

  if (partKey === 'case') {
    const allowedFormFactors = tutorBuildBlueprint.case.formFactor === 'ATX'
      ? ['ATX', 'mATX', 'ITX']
      : [tutorBuildBlueprint.case.formFactor]

    if (!includesAny(option.attributes.supportedFormFactors ?? [], allowedFormFactors)) {
      reasons.push('The case does not support the required motherboard size.')
    }

    if (typeof option.attributes.maxGpuLengthMm === 'number' && option.attributes.maxGpuLengthMm < tutorBuildBlueprint.case.maxGpuLengthMm) {
      reasons.push('The case is too small for the target GPU clearance.')
    }

    if (typeof option.attributes.maxCoolerHeightMm === 'number' && option.attributes.maxCoolerHeightMm < tutorBuildBlueprint.case.maxCoolerHeightMm) {
      reasons.push('The case is too short for the target cooler clearance.')
    }
  }

  if (partKey === 'psu') {
    if (typeof option.attributes.wattage !== 'number') {
      reasons.push('Wattage information is missing.')
    } else if (option.attributes.wattage < tutorBuildBlueprint.psu.wattage) {
      reasons.push(`Wattage too low: the build needs at least ${tutorBuildBlueprint.psu.wattage}W.`)
    }

    compareFormFactor(option.attributes, tutorBuildBlueprint.psu.formFactor, reasons)
  }

  if (partKey === 'mobo' && cpu?.attributes?.socket && option.attributes.socket !== cpu.attributes.socket) {
    reasons.push(`Socket mismatch with the already selected CPU (${cpu.attributes.socket}).`)
  }

  if (partKey === 'cpu' && motherboard?.attributes?.socket && option.attributes.socket !== motherboard.attributes.socket) {
    reasons.push(`Socket mismatch with the already selected motherboard (${motherboard.attributes.socket}).`)
  }

  if (partKey === 'ram' && motherboard?.attributes?.ramType && option.attributes.ramType !== motherboard.attributes.ramType) {
    reasons.push(`RAM type mismatch with the already selected motherboard (${motherboard.attributes.ramType}).`)
  }

  if (partKey === 'gpu' && psu?.attributes?.wattage && typeof option.attributes.powerWattage === 'number') {
    if (option.attributes.powerWattage > psu.attributes.wattage) {
      reasons.push(`The current PSU does not leave enough power headroom for this GPU.`)
    }
  }

  if (partKey === 'cooler' && cpu?.attributes?.socket && option.attributes.socket !== cpu.attributes.socket) {
    reasons.push(`Socket mismatch with the already selected CPU (${cpu.attributes.socket}).`)
  }

  if (partKey === 'case' && motherboard?.attributes?.formFactor && !includesAny(motherboard.attributes.formFactor, option.attributes.supportedFormFactors ?? [])) {
    reasons.push(`Case does not support the already selected motherboard form factor (${motherboard.attributes.formFactor}).`)
  }

  if (partKey === 'psu' && gpu?.attributes?.powerWattage && typeof option.attributes.wattage === 'number') {
    if (option.attributes.wattage < gpu.attributes.powerWattage + 300) {
      reasons.push('The PSU is too small for the current GPU headroom target.')
    }
  }

  const compatible = reasons.length === 0
  const stackEntry = {
    partKey,
    optionKey: option.key,
    label: option.stackLabel,
    partLabel: part.label,
    summary: option.summary,
    attributes: option.attributes,
    compatible,
  }

  return {
    compatible,
    reasons,
    stackEntry,
    option,
  }
}
