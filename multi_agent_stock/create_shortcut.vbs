' 바탕화면 단축아이콘 자동 생성 스크립트
' 주식 분석 멀티에이전트 시스템

Dim oShell, oFSO, sDesktop, sTarget, sShortcut
Set oShell = CreateObject("WScript.Shell")
Set oFSO   = CreateObject("Scripting.FileSystemObject")

' 바탕화면 경로
sDesktop = oShell.SpecialFolders("Desktop")

' run.bat 절대 경로 (현재 스크립트 위치 기준)
sTarget = oFSO.GetParentFolderName(WScript.ScriptFullName) & "\run.bat"

' 단축아이콘 경로
sShortcut = sDesktop & "\📈 주식 분석 AI.lnk"

' 단축아이콘 생성
Dim oLink
Set oLink = oShell.CreateShortcut(sShortcut)
oLink.TargetPath       = sTarget
oLink.WorkingDirectory = oFSO.GetParentFolderName(WScript.ScriptFullName)
oLink.Description      = "주식 분석 멀티에이전트 시스템 (6팀 30명 전문가)"
oLink.WindowStyle      = 1   ' 1=보통창, 3=최대화, 7=최소화
oLink.Save

MsgBox "✅ 바탕화면에 단축아이콘이 생성되었습니다!" & vbCrLf & vbCrLf & _
       "📍 위치: " & sShortcut & vbCrLf & vbCrLf & _
       "▶ 사용 전 .env 파일에 ANTHROPIC_API_KEY를 입력하세요.", _
       vbInformation, "주식 분석 AI — 단축아이콘 생성 완료"
