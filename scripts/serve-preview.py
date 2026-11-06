#!/usr/bin/env python3
"""Serve a built site on loopback, with enough queue capacity for browser QA."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class PreviewServer(ThreadingHTTPServer):
    request_queue_size = 128


class PreviewHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


parser = argparse.ArgumentParser()
parser.add_argument("--port", type=int, default=4000)
args = parser.parse_args()
handler = partial(PreviewHandler, directory="_site")
server = PreviewServer(("127.0.0.1", args.port), handler)
print(f"Local preview: http://127.0.0.1:{args.port}", flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
