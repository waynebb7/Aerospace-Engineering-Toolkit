/**
 * Help text for Advanced Heat-Balance Model fields and results.
 */
(function (global) {
  'use strict';

  var HELP = {
    'at-material': {
      title: 'Conductor material',
      body: 'Select copper or aluminium. Sets the resistance temperature coefficient α used in R(T) = R₂₀[1 + α(T − 20)]. Copper: 0.00393 /°C. Aluminium: 0.00403 /°C. Higher α increases heat generation as the conductor heats.'
    },
    'at-installation-type': {
      title: 'Installation type',
      body: 'Describes how the wire is installed. Each type applies a conservative penalty factor that reduces effective heat rejection: Free Air 1.00, Open Harness 1.05, Bundled Harness 1.15, Conduit 1.25, Cable Tray 1.10, Structure Clamped 0.95. Penalties are engineering assumptions for sensitivity work.'
    },
    'at-wire-position': {
      title: 'Wire position in bundle',
      body: 'Position of this wire within a harness bundle affects how much heat it can reject. Outer 1.00, Mid 1.10, Centre 1.20. A centre wire is thermally worst-case because surrounding wires restrict cooling.'
    },
    'at-air-velocity': {
      title: 'Air velocity (m/s)',
      body: 'Local airflow across the wire surface. 0 m/s represents natural convection only and is conservative where forced airflow is not guaranteed. The model uses h = 5 + 10√v W/m²·K, corrected for altitude air density.'
    },
    'at-emissivity': {
      title: 'Surface emissivity',
      body: 'Radiative emissivity ε of the wire outer surface (0–1). Used in Q_rad = εσA(T⁴ − T_sur⁴). Presets reflect typical insulation finishes; use Custom if datasheet data is available.'
    },
    'at-emissivity-custom': {
      title: 'Custom emissivity',
      body: 'Enter emissivity from manufacturer data or test reports. Must be greater than 0 and less than or equal to 1. Higher emissivity increases radiative heat rejection at elevated temperature.'
    },
    'at-insulation-k': {
      title: 'Insulation thermal conductivity',
      body: 'Thermal conductivity k of the wire insulation (W/m·K). Documented for traceability in the assumptions table. The steady-state heat-balance solver uses external surface rejection; k supports substantiation and future extensions.'
    },
    'at-insulation-k-custom': {
      title: 'Custom insulation k',
      body: 'Enter insulation thermal conductivity from the wire datasheet. Must be greater than 0 W/m·K.'
    },
    'at-insulation-thickness': {
      title: 'Insulation thickness (mm)',
      body: 'Thickness of the insulation layer around the conductor. By default this is calculated as (wire outside diameter − conductor diameter) / 2 from the wire catalog. Override only when measured or datasheet values differ.'
    },
    'at-wire-od': {
      title: 'Wire outside diameter (mm)',
      body: 'Overall outside diameter of the insulated wire. Used to calculate external surface area A = π × OD × run length for convection and radiation. Auto-estimated from the AWG wire catalog average OD unless overridden.'
    },
    'at-adjacent-wires': {
      title: 'Adjacent loaded wires',
      body: 'Number of nearby wires carrying current that add thermal load in the bundle. Default: round(bundle count × bundle loading % / 100). Applies adjacent penalty = min(1.50, 1 + 0.01 × N) to effective heat rejection.'
    },
    'at-hot-surface': {
      title: 'Nearby hot surface temperature',
      body: 'Temperature of surrounding surfaces used as the radiative sink T_sur in the Stefan–Boltzmann term. Defaults to ambient temperature. Increase if the wire is near hot structure, avionics bays, or bleed-air-heated zones.'
    },
    'at-thermal-contact': {
      title: 'Thermal contact to structure',
      body: 'Optional conductive path to aircraft structure. None 0 W/K, Light 0.02 W/K, Moderate 0.05 W/K, Strong 0.10 W/K. Conduction is disabled in Conservative Authority Mode so results stay worst-case unless you explicitly allow heat sinking.'
    },
    'at-conservative-mode': {
      title: 'Conservative Authority Mode',
      body: 'When enabled, forces worst-case assumptions: air velocity 0 m/s, centre bundle position, no structural conduction, and worst-case adjacent loaded wires. Use for certification substantiation when installation-specific data is unavailable.'
    },
    'at-res-tc': {
      title: 'Advanced conductor temperature',
      body: 'Steady-state conductor temperature T_c from the heat-balance solver, where electrical heat generated equals heat rejected by convection, radiation and conduction (after installation penalties).'
    },
    'at-res-existing-t2': {
      title: 'Existing T₂ estimate',
      body: 'Conductor temperature from the primary ARP4404 / derating method in the grid above, for the AWG column with the highest T₂ among visible columns.'
    },
    'at-res-diff': {
      title: 'Difference (advanced − T₂)',
      body: 'Absolute temperature difference between the physics-based estimate and the standards-based T₂ value. Positive means the advanced model predicts a hotter conductor.'
    },
    'at-res-diff-pct': {
      title: 'Percentage difference',
      body: 'Relative difference versus existing T₂: (T_c advanced − T₂) / T₂ × 100%. Used with the comparison classification below.'
    },
    'at-res-rating-margin': {
      title: 'Margin to conductor rating',
      body: 'Temperature margin to the conductor insulation rating T_R: T_R − T_c advanced. A margin below 10 °C yields WARNING status if still below T_R.'
    },
    'at-res-install-margin': {
      title: 'Margin to installation limit',
      body: 'Margin to the installation temperature limit when installation assessment is enabled in the primary calculator: T_inst − T_c advanced. Shown as — if installation limits are not applied.'
    },
    'at-res-status': {
      title: 'Advanced result status',
      body: 'PASS: below conductor rating and installation limit with margin ≥ 10 °C. WARNING: below limits but margin &lt; 10 °C. FAIL: exceeds conductor rating or installation limit. This status does not change the primary calculator pass/fail.'
    },
    'at-res-qgen': {
      title: 'Generated heat',
      body: 'Electrical heat generated in the conductor at the solved temperature: Q_gen = I² × R(T_c). Resistance increases with temperature via the material temperature coefficient.'
    },
    'at-res-qconv': {
      title: 'Convective heat rejection',
      body: 'Heat lost by convection from the wire surface: Q_conv = h × A × (T_c − T_amb). Coefficient h depends on air velocity and altitude-corrected air density.'
    },
    'at-res-qrad': {
      title: 'Radiative heat rejection',
      body: 'Heat lost by radiation: Q_rad = εσA(T_c⁴ − T_sur⁴). Uses surface emissivity and the nearby hot surface temperature as the radiative environment.'
    },
    'at-res-qcond': {
      title: 'Conductive heat rejection',
      body: 'Optional heat conducted to structure: Q_cond = k_contact × (T_c − T_amb). Zero when thermal contact is None or Conservative Authority Mode is enabled.'
    },
    'at-res-mechanism': {
      title: 'Dominant heat transfer mechanism',
      body: 'Which rejection path carries the largest share of total heat loss at the solved temperature: convection, radiation, conduction, or mixed mode when no single path exceeds 55%.'
    },
    'at-res-residual': {
      title: 'Solver residual error',
      body: 'Remaining imbalance Q_gen − Q_loss at convergence in watts. Values near zero confirm the bisection solver found thermal equilibrium within 0.01 °C.'
    },
    'at-res-iterations': {
      title: 'Solver iteration count',
      body: 'Number of bisection iterations used to find T_c where heat generated equals effective heat rejected. Maximum 100 iterations; non-convergence is reported as a warning.'
    },
    'at-cmp-tc': {
      title: 'Conductor temperature (comparison)',
      body: 'Side-by-side comparison of conductor temperature from the existing standards/derating method (T₂) and the advanced heat-balance estimate (T_c). Differences are expected because the methods use different physics and assumptions.'
    },
    'at-cmp-rating-margin': {
      title: 'Margin to rating (comparison)',
      body: 'Margin to conductor insulation rating T_R for each method: T_R − T_conductor. Shows whether the advanced model is more or less conservative than the primary method for rating margin.'
    },
    'at-cmp-install-margin': {
      title: 'Installation margin (comparison)',
      body: 'Margin to the installation temperature limit for each method when installation assessment is enabled. Shown as — if installation limits are not applied in the primary calculator.'
    },
    'at-cmp-classification': {
      title: 'Difference classification',
      body: 'Compares advanced T_c to existing T₂: &lt;5% Comparable, 5–15% Moderate difference, &gt;15% Significant difference. Intended for sensitivity assessment, not as a pass/fail criterion on its own.'
    }
  };

  function initAdvancedThermalHelp() {
    var container = document.getElementById('pwa-advanced-thermal-body');
    if (!container || !global.PwaInfoHelp) {
      return;
    }
    PwaInfoHelp.initContainer(container, HELP);
  }

  global.PwaAdvancedThermalHelp = {
    HELP: HELP,
    init: initAdvancedThermalHelp
  };
})(typeof window !== 'undefined' ? window : this);
