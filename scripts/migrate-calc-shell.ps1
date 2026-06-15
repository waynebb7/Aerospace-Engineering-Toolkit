# Migrates calculator HTML pages to minimal data-calc shells
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$registryPath = Join-Path $root 'js\calculator-registry.js'
$registryText = Get-Content $registryPath -Raw -Encoding UTF8

$metaBlock = if ($registryText -match '(?s)var META = \{(.*?)\n  \};') { $Matches[1] } else { $registryText }
$metaMatches = [regex]::Matches($metaBlock, '"([^"]+\.html)":\s*\{\s*"title":\s*"([^"]+)"')
$shellTemplate = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/corporate.css">
    <script src="js/site-layout.js" defer></script>
    <title>{TITLE} | Engineering Knowledge</title>
</head>
<body class="calculator-page" data-calc="{ID}">
</body>
</html>
'@

function Get-CalcIdFromFile([string]$file) {
    return $file.Replace('.html', '').Replace('_calculator', '')
}

foreach ($m in $metaMatches) {
    $file = $m.Groups[1].Value
    $title = $m.Groups[2].Value
    $id = Get-CalcIdFromFile $file
    $path = Join-Path $root $file
    if (-not (Test-Path $path)) { continue }

    $html = $shellTemplate.Replace('{ID}', $id).Replace('{TITLE}', $title)
    Set-Content $path $html -Encoding UTF8 -NoNewline
    Write-Host "Migrated $file -> data-calc=$id"
}

Write-Host 'Migration complete.'
