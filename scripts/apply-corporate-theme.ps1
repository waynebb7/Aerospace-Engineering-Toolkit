# Applies corporate.css and site-layout.js to all HTML files
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$htmlFiles = Get-ChildItem -Path $root -Recurse -Filter "*.html" | Where-Object { $_.FullName -notmatch '\\scripts\\' }

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    if ($content -match 'corporate\.css') { continue }

    $relative = $file.FullName.Substring($root.Length + 1)
    $depth = ($relative -split '[\\/]').Count - 1
    $prefix = if ($depth -eq 0) { '' } else { ('../' * $depth) }

    $inject = @"
    <link rel="stylesheet" href="${prefix}css/corporate.css">
    <script src="${prefix}js/site-layout.js" defer></script>
"@

    if ($content -match '(<meta name="viewport"[^>]*>)') {
        $content = $content -replace '(<meta name="viewport"[^>]*>)', "`$1`n$inject"
    } else {
        $content = $content -replace '(<head>)', "`$1`n$inject"
    }

    # Remove inline style blocks (corporate.css handles styling)
    $content = $content -replace '(?s)\s*<style>.*?</style>', ''

    # Calculator pages: wrap content in corporate layout shell
    if ($content -match 'class="input-container"' -or ($content -match '<div class="input-container">' -and $file.Name -match 'calculator|power|degrees|radians|efficiency')) {
        if ($content -notmatch 'calculator-panel') {
            $content = $content -replace '(<body>\s*)', "`$1`n    <div class=`"page-container page-container--calculator`">`n        <a href=`"${prefix}index.html`" class=`"back-link`">&larr; Back to Hub</a>`n        <div class=`"calculator-panel`">`n"
            $content = $content -replace '(\s*<script>)', "`n        </div>`n    </div>`n`$1"
            if ($content -notmatch '</div>\s*</div>\s*<script>') {
                $content = $content -replace '(</body>)', "        </div>`n    </div>`n`$1"
            }
            $content = $content -replace '<button ', '<button class="btn--block" '
            $content = $content -replace 'class="btn--block" class="btn--block"', 'class="btn--block"'
        }
    }
    # Reference / equation pages
    elseif ($content -match 'equation-container') {
        if ($content -notmatch 'page-container') {
            $content = $content -replace '(<body>\s*)', "`$1`n    <div class=`"page-container`">`n        <a href=`"${prefix}index.html`" class=`"back-link`">&larr; Back to Hub</a>`n"
            $content = $content -replace '(</body>)', "    </div>`n`$1"
        }
    }
    # Default pages with simple h1 body
    elseif ($content -notmatch 'page-container|page-hero|map-page' -and $content -match '<body>') {
        if ($file.Name -ne 'index.html') {
            $content = $content -replace '(<body>\s*)', "`$1`n    <div class=`"page-container`">`n        <a href=`"${prefix}index.html`" class=`"back-link`">&larr; Back to Hub</a>`n"
            $content = $content -replace '(</body>)', "    </div>`n`$1"
        }
    }

    # Prerequisite map pages
    if ($file.Name -match 'prereq-map') {
        $content = $content -replace '<body>', '<body class="map-page">'
    }

    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Updated: $relative"
}

Write-Host "Done."
