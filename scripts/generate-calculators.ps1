# Generates minimal calculator shell HTML pages (logic lives in calculator-registry.js)
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

function New-CalcShell($relativePath, $title, $id) {
    $dir = Split-Path -Parent (Join-Path $root $relativePath)
    if ($dir -and -not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $depth = ($relativePath -split '/').Count - 1
    $assetPrefix = if ($depth -gt 0) { ('../' * $depth) } else { '' }
    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${assetPrefix}assets/css/corporate.css">
    <script src="${assetPrefix}assets/js/site-layout.js" defer></script>
    <title>$title | Engineering Knowledge</title>
</head>
<body class="calculator-page" data-calc="$id">
</body>
</html>
"@
    Set-Content (Join-Path $root $relativePath) $html -Encoding UTF8 -NoNewline
    Write-Host "Created $relativePath (data-calc=$id)"
}

# Example: add new calculators here, then define compute/fields/help in assets/js/calculator-registry.js
# New-CalcShell 'calculators/power/example.html' 'Example Calculator' 'example'

Write-Host "Done. Register new calculators in assets/js/calculator-registry.js"
