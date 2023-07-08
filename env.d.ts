/// <reference types="vite/client" />

/*
 * Keyboards
 */

type Index = Array<number>

interface Key {
  index: Index
  x: number
  y: number
  w: number
  h: number
}

type KeyboardId = string
type Layout = Array<Key>

interface KeyboardUSBParams {
  vendorId?: number,
  productId?: number,
  usage?: number,
  usagePage?: number
}

interface Keyboard {
  id: KeyboardId
  name: string
  variant?: string
  manufacturer: string
  url: string
  usb: KeyboardUSBParams
  layout: Layout
}

/*
 * WebHID
 */

interface HIDDeviceFilter {
  vendorId?: number | undefined;
  productId?: number | undefined;
  usagePage?: number | undefined;
  usage?: number | undefined;
}

interface HIDDeviceRequestOptions {
  filters: HIDDeviceFilter[];
}

declare class HID extends EventTarget {
  onconnect: ((this: this, ev: Event) => any) | null;
  ondisconnect: ((this: this, ev: Event) => any) | null;

  getDevices(): Promise<HIDDevice[]>;

  requestDevice(options?: HIDDeviceRequestOptions): Promise<HIDDevice[]>;

  addEventListener(
    type: 'connect' | 'disconnect',
    listener: (this: this, ev: HIDConnectionEvent) => any,
    useCapture?: boolean,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener(
    type: 'connect' | 'disconnect',
    callback: (this: this, ev: HIDConnectionEvent) => any,
    useCapture?: boolean,
  ): void;
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
}

interface Navigator {
  readonly hid: HID;
}

interface HIDConnectionEventInit {
  device: HIDDevice;
}

declare class HIDConnectionEvent extends Event {
  constructor(type: string, eventInitDict: HIDConnectionEventInit);

  readonly device: HIDDevice;
}

interface HIDInputReportEventInit extends EventInit {
  device: HIDDevice;
  reportId: number;
  data: DataView;
}

declare class HIDInputReportEvent extends Event {
  constructor(type: string, eventInitDict: HIDInputReportEventInit);

  readonly device: HIDDevice;
  readonly reportId: number;
  readonly data: DataView;
}

type HIDUnitSystem =
  | 'none'
  | 'si-linear'
  | 'si-rotation'
  | 'english-linear'
  | 'english-rotation'
  | 'vendor-defined'
  | 'reserved';

interface HIDReportItem {
  isAbsolute?: boolean | undefined;
  isArray?: boolean | undefined;
  isBufferedBytes?: boolean | undefined;
  isConstant?: boolean | undefined;
  isLinear?: boolean | undefined;
  isRange?: boolean | undefined;
  isVolatile?: boolean | undefined;
  hasNull?: boolean | undefined;
  hasPreferredState?: boolean | undefined;
  wrap?: boolean | undefined;
  usages?: number[] | undefined;
  usageMinimum?: number | undefined;
  usageMaximum?: number | undefined;
  reportSize?: number | undefined;
  reportCount?: number | undefined;
  unitExponent?: number | undefined;
  unitSystem?: HIDUnitSystem | undefined;
  unitFactorLengthExponent?: number | undefined;
  unitFactorMassExponent?: number | undefined;
  unitFactorTimeExponent?: number | undefined;
  unitFactorTemperatureExponent?: number | undefined;
  unitFactorCurrentExponent?: number | undefined;
  unitFactorLuminousIntensityExponent?: number | undefined;
  logicalMinimum?: number | undefined;
  logicalMaximum?: number | undefined;
  physicalMinimum?: number | undefined;
  physicalMaximum?: number | undefined;
  strings?: string[] | undefined;
}

interface HIDReportInfo {
  reportId?: number | undefined;
  items?: HIDReportItem[] | undefined;
}

interface HIDCollectionInfo {
  usagePage?: number | undefined;
  usage?: number | undefined;
  type?: number | undefined;
  children?: HIDCollectionInfo[] | undefined;
  inputReports?: HIDReportInfo[] | undefined;
  outputReports?: HIDReportInfo[] | undefined;
  featureReports?: HIDReportInfo[] | undefined;
}

declare class HIDDevice extends EventTarget {
  oninputreport: ((this: this, ev: HIDInputReportEvent) => any) | null;
  readonly opened: boolean;
  readonly vendorId: number;
  readonly productId: number;
  readonly productName: string;
  readonly collections: HIDCollectionInfo[];

  open(): Promise<void>;

  close(): Promise<void>;

  forget(): Promise<void>;

  sendReport(reportId: number, data: BufferSource): Promise<void>;

  sendFeatureReport(reportId: number, data: BufferSource): Promise<void>;

  receiveFeatureReport(reportId: number): Promise<DataView>;

  addEventListener(type: 'inputreport', listener: (this: this, ev: HIDInputReportEvent) => any): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener(type: 'inputreport', callback: (this: this, ev: HIDInputReportEvent) => any): void;
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
}