const customConfigId: string = 'custom'
const customConfigLocalStorageKey: string = `config_${customConfigId}`

export function loadKeyboardConfigFromLocalStorage(): Keyboard | null {
  let json = localStorage.getItem(customConfigLocalStorageKey) || ''
  return validateKeyboardConfig(json)
}

export function saveKeyboardConfigToLocalStorage(config: Keyboard) {
  let json = JSON.stringify(config)
  localStorage.setItem(customConfigLocalStorageKey, json)
}

export function validateKeyboardConfig(config: string): Keyboard | null {
  // Validating the custom config
  let keyboard = null
  try {
    keyboard = JSON.parse(config)
  } catch (e) {
    return null
  }
  if (typeof keyboard !== 'object') {
    return null
  }
  if (!keyboard.id) {
    return null
  }
  if (!keyboard.name) {
    return null
  }
  if (!keyboard.manufacturer) {
    return null
  }
  if (!keyboard.usb) {
    return null
    // TODO: add extra validation for usb params
  }
  if (!keyboard.variants) {
    return null
    // TODO: add extra validation for variants
  }
  if (typeof keyboard.variants !== 'object') {
    return null
  }

  return keyboard
}

export function loadKeyboards(): Record<KeyboardId, Keyboard> {
  let allKeyboardConfigs: Record<KeyboardId, Keyboard> = {}

  // Read the default JSON keyboard definitions
  console.log('Reading default keyboard configurations ...')
  let defaultConfigs = import.meta.glob('@/assets/kbd/*.json', { eager: true }) as Record<string, { default: Keyboard }>
  for (const configPath in defaultConfigs) {
    const kbd = defaultConfigs[configPath].default
    allKeyboardConfigs[kbd.id] = kbd
  }

  // Additionally, try to read a custom keyboard definition from the local storage.
  // This definition will overwrite any existing definition with the same id.
  console.log('Reading custom keyboard configuration from local storage ...')
  const customConfig = localStorage.getItem(customConfigLocalStorageKey)
  if (customConfig) {
    const kbd = validateKeyboardConfig(customConfig)
    if (!kbd) {
      console.warn(`Invalid custom keyboard configuration:`, customConfig)
    } else {
      allKeyboardConfigs[customConfigId] = kbd
    }
  }

  // Traverse the JSONs and collect the keyboards into a record
  const keyboards: Record<string, Keyboard> = {}
  for (const kbd of Object.values(allKeyboardConfigs)) {
    // Show some debug info
    if (Object.keys(keyboards).includes(kbd.id)) {
      console.log(`Overwriting keyboard definition for ${kbd.id} ...`)
    } else {
      console.log(`Loading definition for ${kbd.id} ...`)
    }
    // Normalize the key layout of each variant
    Object.keys(kbd.variants).forEach((variant: VariantId) => {
      kbd.variants[variant].forEach((key: Key) => {
        if (!key.w) { key.w = 1 }
        if (!key.h) { key.h = 1 }
      })
    })
    // Push it to the record
    keyboards[kbd.id] = {
      id: kbd.id,
      name: kbd.name,
      manufacturer: kbd.manufacturer,
      url: kbd.url,
      usb: kbd.usb,
      variants: kbd.variants
    } as Keyboard
  }

  return keyboards
}
