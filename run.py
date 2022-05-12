import http.server
import sys
HandlerClass = http.server.SimpleHTTPRequestHandler

# Patch in the correct extensions
HandlerClass.extensions_map['.js'] = 'text/javascript'
HandlerClass.extensions_map['.mjs'] = 'text/javascript'

# Run the server (like `python -m http.server` does)
http.server.test(HandlerClass, port= sys.argv[1] if len(sys.argv) > 1 else 8080)