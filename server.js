import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8080;
const HOST = '0.0.0.0'; // Cloud Run requires listening on all interfaces

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// .glb is included: meshopt-compressed geometry is designed to be gzipped on top (≈ -22 % here).
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.gltf', '.glb']);
const LONG_CACHE = new Set(['.glb', '.jpg', '.jpeg', '.png', '.webp']);

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Files are immutable inside the container image, so each compressible file is gzipped once and kept
// in memory instead of re-compressing on every request.
const gzipCache = new Map();

async function getGzipped(filePath) {
  let entry = gzipCache.get(filePath);
  if (!entry) {
    entry = fsp.readFile(filePath).then((buf) => zlib.gzipSync(buf, { level: 9 }));
    gzipCache.set(filePath, entry);
    entry.catch(() => gzipCache.delete(filePath));
  }
  return entry;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS, ...headers });
  res.end(body);
}

function resolveSafePath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null; // malformed percent-encoding (would otherwise throw and crash the process)
  }
  if (decoded.includes('\0')) return null;
  const rel = decoded === '/' ? '/index.html' : decoded;
  const resolved = path.resolve(ROOT, '.' + rel);
  // Must stay strictly inside ROOT (plain startsWith(ROOT) would also accept e.g. "/app-other")
  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) return null;
  return resolved;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      send(res, 405, 'Method Not Allowed', { Allow: 'GET, HEAD' });
      return;
    }

    const urlPath = (req.url || '/').split('?')[0];
    if (urlPath === '/healthz') {
      send(res, 200, 'ok', { 'Cache-Control': 'no-store' });
      return;
    }

    const filePath = resolveSafePath(urlPath);
    if (!filePath) {
      send(res, 400, 'Bad Request');
      return;
    }

    let stat;
    try {
      stat = await fsp.stat(filePath);
    } catch {
      stat = null;
    }
    if (!stat || !stat.isFile()) {
      send(res, 404, 'Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const isVendor = filePath.includes(`${path.sep}node_modules${path.sep}`);
    const headers = {
      ...SECURITY_HEADERS,
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': isVendor || LONG_CACHE.has(ext) ? 'public, max-age=86400' : 'public, max-age=300',
      'Last-Modified': stat.mtime.toUTCString()
    };

    const acceptsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    if (COMPRESSIBLE.has(ext) && acceptsGzip) {
      const gz = await getGzipped(filePath);
      Object.assign(headers, {
        'Content-Encoding': 'gzip',
        Vary: 'Accept-Encoding',
        'Content-Length': gz.length,
        // three.js FileLoader reads X-File-Size for accurate progress when the body is compressed
        'X-File-Size': stat.size
      });
      res.writeHead(200, headers);
      res.end(req.method === 'HEAD' ? undefined : gz);
      return;
    }

    headers['Content-Length'] = stat.size;
    res.writeHead(200, headers);
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  } catch (err) {
    console.error('Request failed:', req.url, err);
    if (!res.headersSent) send(res, 500, 'Internal Server Error');
    else res.destroy();
  }
});

server.listen(PORT, HOST, () => {
  console.log(`3D Loft Tour server listening on http://${HOST}:${PORT}`);
});

// Graceful shutdown when Cloud Run stops the instance
process.on('SIGTERM', () => server.close(() => process.exit(0)));
