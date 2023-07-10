/*
 * WebHID interface
 */

export function isSupported() {
  return 'hid' in navigator
}

export async function getDevices() {
  const devices = await navigator.hid.getDevices()
  console.log('Listing devices', devices)
  return devices
}

export async function pairDevice() {
  console.log('Pairing new device ...')
  await navigator.hid.requestDevice({ filters: [] })
}

export async function forgetDevice(device: HIDDevice) {
  console.log('Forgeting device ...', device)
  device.forget()
}

export async function connectDevice(device: HIDDevice) {
  if (device.opened) {
    console.log('Cannot connect, device already connected', device)
  }

  console.log('Connecting device', device)
  await device.open()
  return device.opened
}

export async function disconnectDevice(device: HIDDevice) {
  if (!device.opened) {
    console.log('Cannot disconnect, device already disconnected', device)
  }

  console.log('Disconnecting device', device)
  await device.close()
  return device.opened
}

export async function sendMessage(device: HIDDevice, data: Array<number>) {
  if (!device.opened) {
    console.log('Cannot send data, device is closed', device)
    return
  }

  console.log('Sending data', { device, data })
  await device.sendReport(0x0, new Uint8Array(data))
}

/*
 * Remote RGB interface
 */

const REMOTE_RGB_MESSAGE_KIND = {
  START: 0,
  STOP: 1,
  SET_COLOR: 2
}

export async function remoteRGBSendStart(device: HIDDevice) {
  const data = new Array(32).fill(0)
  data[0] = REMOTE_RGB_MESSAGE_KIND.START
  await sendMessage(device, data)
}

export async function remoteRGBSendStop(device: HIDDevice) {
  const data = new Array(32).fill(0)
  data[0] = REMOTE_RGB_MESSAGE_KIND.STOP
  await sendMessage(device, data)
}

export async function remoteRGBSendSetColor(device: HIDDevice, color: HexColor, keys: Array<KeyIndex>) {
  const chunks = chunkify(keys, 12)
  for (const chunk of chunks) {
    console.log('chunk', chunk)
    // * data[0]: message_kind
    // * data[1-3]: r,g,b values
    // * data[4]: count
    // * data[5-7]: unused
    // * data[8-31]: payload (up to 12 sequential pairs of row/column indices)
    const data = new Array(32).fill(0)
    const rgb = hexToRGB(color)
    // Header
    data[0] = REMOTE_RGB_MESSAGE_KIND.SET_COLOR
    data[1] = rgb?.r
    data[2] = rgb?.g
    data[3] = rgb?.b
    data[4] = chunk.length
    // Payload
    for (let i = 0; i < chunk.length; i++) {
      data.splice(8 + 2*i, 2, chunk[i][0], chunk[i][1])
    }
    console.log('Sending', data)
    await sendMessage(device, data)
  }
}

/*
 * Utils
 */

function hexToRGB(hex: HexColor) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) { return null }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

function* chunkify<T>(arr: Array<T>, n: number) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}