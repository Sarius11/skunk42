// The status ladder: three groups, a formal code, a name and a deadpan line per state.
// The lamp shape carries the state as well as its colour, so colour is never the only signal.

export type LampShape = 'off' | 'live' | 'hold' | 'go' | 'upg' | 'anom' | 'fix' | 'recert' | 'ret' | 'lost';
export type StatusGroup = 'Pre-flight' | 'In service' | 'End of life';

export interface Status {
  code: StatusCode;
  name: string;
  line: string;
  lamp: LampShape;
  group: StatusGroup;
}

export const STATUS_CODES = [
  'P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'PH',
  'S1', 'S2', 'S3', 'S4', 'S5',
  'X1', 'X2', 'X3', 'X4',
] as const;
export type StatusCode = (typeof STATUS_CODES)[number];

export const LADDER: Status[] = [
  { code: 'P0', name: 'Concept', line: 'Exists on a napkin. The napkin has been laminated.', lamp: 'off', group: 'Pre-flight' },
  { code: 'P1', name: 'Approved', line: 'Idea with a budget. The budget is lunch.', lamp: 'off', group: 'Pre-flight' },
  { code: 'P2', name: 'Design', line: 'Has drawings. Some of them to scale.', lamp: 'live', group: 'Pre-flight' },
  { code: 'P3', name: 'Build', line: 'Parts are being introduced to each other. Not all of them get along.', lamp: 'live', group: 'Pre-flight' },
  { code: 'P4', name: 'Ground test', line: 'Bolted down. Stand well back. Further than that.', lamp: 'live', group: 'Pre-flight' },
  { code: 'P5', name: 'Flight test', line: 'Has left the ground at least once, on purpose.', lamp: 'live', group: 'Pre-flight' },
  { code: 'PH', name: 'Hold', line: 'Countdown on hold. Someone spotted something.', lamp: 'hold', group: 'Pre-flight' },
  { code: 'S1', name: 'Operational', line: 'Works. Nobody touch anything.', lamp: 'go', group: 'In service' },
  { code: 'S2', name: 'Upgrade', line: 'Works. Someone is touching it anyway.', lamp: 'upg', group: 'In service' },
  { code: 'S3', name: 'Anomaly', line: 'Was cleared operational. Has since made other plans.', lamp: 'anom', group: 'In service' },
  { code: 'S4', name: 'Under repair', line: 'Back on the stand. Wrench in hand, lessons being learned.', lamp: 'fix', group: 'In service' },
  { code: 'S5', name: 'Recertification', line: 'Fixed. Probably. Nobody is saying it out loud yet.', lamp: 'recert', group: 'In service' },
  { code: 'X1', name: 'Mothballed', line: 'Under a tarp. Not dead, resting.', lamp: 'off', group: 'End of life' },
  { code: 'X2', name: 'Scrubbed', line: 'Cancelled. Weather, allegedly.', lamp: 'off', group: 'End of life' },
  { code: 'X3', name: 'Retired', line: 'Did its job. Now in a museum, looking smug.', lamp: 'ret', group: 'End of life' },
  { code: 'X4', name: 'Lost', line: 'Rapid unscheduled disassembly. Debris recovered, dignity was not.', lamp: 'lost', group: 'End of life' },
];

export function statusOf(code: StatusCode): Status {
  const s = LADDER.find((x) => x.code === code);
  if (!s) throw new Error(`Unknown status code: ${code}`);
  return s;
}

/** A lamp is lit when it shows colour: work underway, paused, in service or broken. */
export function isLit(code: StatusCode): boolean {
  return !['off', 'ret', 'lost'].includes(statusOf(code).lamp);
}
