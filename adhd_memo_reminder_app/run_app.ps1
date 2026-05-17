$appPath = Join-Path $PSScriptRoot "app.py"

$candidateRunners = @()

$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if ($pythonCommand) {
    $candidateRunners += @(@($pythonCommand.Source))
}

$pyCommand = Get-Command py -ErrorAction SilentlyContinue
if ($pyCommand) {
    $candidateRunners += @(@($pyCommand.Source, "-3"))
}

$candidateRunners += @(
    @("C:\Users\redna\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"),
    @("C:\Program Files\Blender Foundation\Blender 4.5\4.5\python\bin\python.exe")
)

foreach ($runner in $candidateRunners) {
    $exePath = $runner[0]
    if (-not (Test-Path $exePath)) {
        continue
    }

    $extraArgs = @()
    if ($runner.Count -gt 1) {
        $extraArgs = $runner[1..($runner.Count - 1)]
    }

    & $exePath @extraArgs $appPath
    exit $LASTEXITCODE
}

Write-Host "Python interpreter was not found."
Write-Host "Edit run_app.ps1 if your Python path is different."
Read-Host "Press Enter to close"
