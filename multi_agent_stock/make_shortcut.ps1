$desk = [Environment]::GetFolderPath('Desktop')
$target = 'C:\Users\redna\.claude\multi_agent_stock\run.bat'
$workdir = 'C:\Users\redna\.claude\multi_agent_stock'
$lnkPath = $desk + '\' + [char]0xC8FC + [char]0xC2DD + [char]0xBD84 + [char]0xC11D + 'AI.lnk'

if (Test-Path $lnkPath) { Remove-Item $lnkPath -Force }

$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($lnkPath)
$Shortcut.TargetPath       = $target
$Shortcut.WorkingDirectory = $workdir
$Shortcut.Description      = 'Stock Analysis Multi-Agent System'
$Shortcut.WindowStyle      = 1
$Shortcut.Save()

Write-Host ('Created: ' + $lnkPath)
Write-Host ('Exists : ' + (Test-Path $lnkPath))
