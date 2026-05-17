$desk = [Environment]::GetFolderPath('Desktop')
$lnkPath = Join-Path $desk "주식분석AI.lnk"
$WshShell = New-Object -comObject WScript.Shell
$lnk = $WshShell.CreateShortcut($lnkPath)
Write-Host "=== 단축아이콘 정보 ==="
Write-Host "파일 위치 : $lnkPath"
Write-Host "대상 경로 : $($lnk.TargetPath)"
Write-Host "작업 폴더 : $($lnk.WorkingDirectory)"
Write-Host "설명      : $($lnk.Description)"
Write-Host ""
Write-Host "대상 파일 존재: $(Test-Path $lnk.TargetPath)"
