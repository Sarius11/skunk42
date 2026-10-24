// favicon.ico, generated at build time from the hand-drawn 48px favicon.
// An ICO file can carry a PNG as-is: a 6-byte header, one 16-byte directory entry, then the PNG.
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const GET: APIRoute = () => {
  const png = fs.readFileSync(path.join(process.cwd(), 'src', 'assets', 'icons', 'favicon-48.png'));
  const head = Buffer.alloc(22);
  head.writeUInt16LE(0, 0); // reserved
  head.writeUInt16LE(1, 2); // type: icon
  head.writeUInt16LE(1, 4); // one image
  head.writeUInt8(48, 6); // width
  head.writeUInt8(48, 7); // height
  head.writeUInt8(0, 8); // no palette
  head.writeUInt8(0, 9); // reserved
  head.writeUInt16LE(1, 10); // colour planes
  head.writeUInt16LE(32, 12); // bits per pixel
  head.writeUInt32LE(png.length, 14); // image size
  head.writeUInt32LE(22, 18); // image offset
  return new Response(new Uint8Array(Buffer.concat([head, png])), { headers: { 'Content-Type': 'image/x-icon' } });
};
