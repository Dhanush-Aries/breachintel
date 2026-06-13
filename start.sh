#!/usr/bin/env bash
# BreachIntel launcher — kills any stale instance, then starts the web GUI.
set -e
cd "$(dirname "$0")"
PORT="${PORT:-7474}"

# free the port (any previous instance)
pkill -9 -f "breachintel/server.py" 2>/dev/null || true
pkill -9 -f "python3 server.py"     2>/dev/null || true
command -v fuser >/dev/null 2>&1 && fuser -k "${PORT}/tcp" 2>/dev/null || true
sleep 1

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║   BreachIntel — All-Source Intelligence       ║"
echo "  ║   → http://localhost:${PORT}                      ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""

exec python3 breachintel.py --gui --port "${PORT}"
