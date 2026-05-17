$desk = [Environment]::GetFolderPath('Desktop')
Write-Host "Desktop 경로: $desk"
Get-ChildItem $desk -Filter "*.lnk" | ForEach-Object { Write-Host $_.Name }
