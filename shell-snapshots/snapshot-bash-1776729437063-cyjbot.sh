# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
shopt -s expand_aliases
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  alias rg=''\''C:\Users\redna\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\vendor\ripgrep\x64-win32\rg.exe'\'''
fi
export PATH='/c/Users/redna/bin:/mingw64/bin:/usr/local/bin:/usr/bin:/bin:/mingw64/bin:/usr/bin:/c/Users/redna/bin:/c/WINDOWS/system32:/c/WINDOWS:/c/WINDOWS/System32/Wbem:/c/WINDOWS/System32/WindowsPowerShell/v1.0:/c/WINDOWS/System32/OpenSSH:/c/Program Files/NVIDIA Corporation/NVIDIA App/NvDLISR:/c/Program Files (x86)/NVIDIA Corporation/PhysX/Common:/c/ProgramData/chocolatey/bin:/c/Users/redna/AppData/Local/Programs/cursor/resources/app/bin:/cmd:/c/Program Files/nodejs:/c/Program Files/Docker/Docker/resources/bin:/c/Users/redna/.local/bin:/c/Users/redna/AppData/Local/Programs/Python/Python313/Scripts:/c/Users/redna/AppData/Local/Programs/Python/Python313:/c/Users/redna/AppData/Local/Microsoft/WindowsApps:/c/Users/redna/AppData/Local/Programs/Microsoft VS Code/bin:/c/Users/redna/AppData/Local/Programs/cursor/resources/app/bin:/c/Users/redna/.bun/bin:/c/Users/redna/AppData/Local/Programs/Antigravity/bin:/c/Users/redna/AppData/Local/Python/bin:/c/Users/redna/AppData/Local/GitHubDesktop/bin:/c/Users/redna/AppData/Roaming/npm:/c/Program Files (x86)/ESTsoft/ALSee/x64:/usr/bin/vendor_perl:/usr/bin/core_perl:/c/Users/redna/.claude/plugins/cache/claude-plugins-official/superpowers/5.0.7/bin'
