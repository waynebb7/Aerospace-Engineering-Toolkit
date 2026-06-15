$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$files = @(
    'dc_power_calculator.html','ac_power_calculator.html','three_phase_power_calculator.html',
    'star_three_phase_power.html','star_phase_three_phase_power.html','delta_three_phase_power.html',
    'delta_phase_three_phase_power.html','power_factor_calculator.html','degrees_to_radians.html',
    'radians_to_degrees.html','tru_efficiency_calculator.html'
)

foreach ($name in $files) {
    $path = Join-Path $root $name
    $c = Get-Content $path -Raw -Encoding UTF8

    if ($c -notmatch 'class="calculator-page"') {
        $c = $c -replace '<body>', '<body class="calculator-page">'
    }

    $c = $c -replace '<button class="btn--block"', '<button type="button" class="btn--block"'
    $c = $c -replace '<button type="button" type="button"', '<button type="button"'

    $c = $c -replace 'type="number" ', 'type="number" inputmode="decimal" '

    # Standardise result headings
    $c = $c -replace '<h2>Calculated [^<]+</h2>\s*<p id="([^"]+)"([^>]*)></p>',
        '<h2>Result</h2>`n            <p id="$1"$2 class="result-display">Enter values and calculate.</p>'
    $c = $c -replace '<h2>Converted [^<]+</h2>\s*<p id="([^"]+)"([^>]*)></p>',
        '<h2>Result</h2>`n            <p id="$1"$2 class="result-display">Enter values and calculate.</p>'

    if ($c -match '<p id="[^"]+" class="result-display">' -and $c -notmatch 'class="result-display" class="result-display"') {
        # ok
    }

    Set-Content $path $c -Encoding UTF8 -NoNewline
    Write-Host "Updated $name"
}
