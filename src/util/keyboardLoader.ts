export function loadKeyboards(): Record<KeyboardId, Keyboard> {
  // Read the JSON keyboard definitions
  const jsons = import.meta.glob('@/assets/kbd/*.json', { eager: true }) as Record<KeyboardId, Keyboard>
  // Traverse the JSONs and collect the keyboards into a record
  const keyboards: Record<string, Keyboard> = {}
  for (const kbd of Object.values(jsons)) {
    // Show some debug info
    console.log(`Loading definition for ${kbd.id} ...`)
    // Normalize the key layout
    kbd.layout.forEach((key: Key) => {
      if (!key.w) { key.w = 1 }
      if (!key.h) { key.h = 1 }
    })
    // Push it to the record
    keyboards[kbd.id] = kbd as Keyboard
  }
  // Return the collected record
  return keyboards
}
