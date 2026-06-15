/**
 * Help text for Transient Thermal Analysis fields and results.
 */
(function (global) {
  'use strict';

  var HELP = {
    'tt-duration': {
      title: 'Simulation duration (min)',
      body: 'Total time span of the transient simulation in minutes. The integrator steps from t = 0 to this duration using the selected timestep. Use a duration long enough to capture peak temperature and relevant cool-down after load changes.'
    },
    'tt-timestep': {
      title: 'Integration timestep',
      body: 'Time step for the Runge–Kutta 4 (RK4) integrator. Smaller steps (1 s) improve accuracy for fast transients; larger steps run faster but may smooth sharp current changes. 1 s is recommended for certification-style substantiation.'
    },
    'tt-initial-mode': {
      title: 'Initial conductor temperature',
      body: 'Starting temperature at t = 0. Ambient uses the primary calculator ambient temperature. Steady-State uses the advanced heat-balance T_c when available, otherwise existing T₂. Custom lets you specify a known starting condition.'
    },
    'tt-initial-custom': {
      title: 'Custom initial T (°C)',
      body: 'User-defined conductor temperature at the start of the simulation. Use when the wire is not at ambient or steady-state at mission start — for example after a prior load segment or hot-soak condition.'
    },
    'tt-profile-type': {
      title: 'Current profile type',
      body: 'How circuit current varies with time. Constant uses the primary calculator current throughout. Other profiles model pulses, duty cycles, mission phases, or a custom piecewise schedule for operational transient assessment.'
    },
    'tt-pulse-current': {
      title: 'Pulse current (A)',
      body: 'Current magnitude during the single pulse event. Between pulses (outside the defined window) current is zero unless combined with another profile logic — for single pulse, current is 0 before start and after start + duration.'
    },
    'tt-pulse-duration': {
      title: 'Pulse duration (s)',
      body: 'Length of time the pulse current is applied, in seconds. Enter decimal values for sub-second pulses (e.g. 0.1 s = 100 ms, 0.001 s = 1 ms). Used with start time to define the loaded interval for a single transient event such as a short overload or inrush.'
    },
    'tt-pulse-start': {
      title: 'Start time (min)',
      body: 'Simulation time when the pulse current begins, in minutes from t = 0. Allows modelling delayed load application after an initial idle or taxi period.'
    },
    'tt-rp-current': {
      title: 'Pulse current (repeating)',
      body: 'Peak current during each repeated pulse cycle. Used with period and duration to model recurring load events such as cyclic equipment operation.'
    },
    'tt-rp-duration': {
      title: 'Pulse duration (repeating, s)',
      body: 'On-time of each pulse within a cycle, in seconds. Use decimals for millisecond-scale pulses (e.g. 0.05 s = 50 ms). Shorter on-times reduce average heating compared to continuous load at the same peak current.'
    },
    'tt-rp-period': {
      title: 'Pulse period (min)',
      body: 'Total cycle time from the start of one pulse to the start of the next, in minutes. Off-time = period − duration, allowing cool-down between pulses.'
    },
    'tt-rp-cycles': {
      title: 'Number of cycles',
      body: 'How many pulse cycles to apply during the simulation. Limits repeating load to a defined number of operations rather than the full simulation duration.'
    },
    'tt-dc-peak': {
      title: 'Peak current (duty cycle)',
      body: 'Maximum current during the ON portion of a duty-cycle waveform. Average heating depends on both peak current and duty percentage.'
    },
    'tt-dc-duty': {
      title: 'Duty cycle (%)',
      body: 'Percentage of each cycle at peak current. 100% equals continuous load; lower duty reduces average I²R heating and allows partial recovery between ON intervals.'
    },
    'tt-dc-period': {
      title: 'Cycle period (duty cycle)',
      body: 'Total repeating cycle length in minutes for the duty-cycle profile. Defines how often the peak-current interval recurs.'
    },
    'tt-mission-profile': {
      title: 'Mission profile',
      body: 'Predefined flight or ground phase with associated current multiplier versus the primary circuit current. Phases include Taxi, Take-Off, Climb, Cruise, Descent, Landing and Ground Operations for typical operational transient assessment.'
    },
    'tt-custom-schedule': {
      title: 'Custom load schedule',
      body: 'Piecewise-constant current versus time defined in the table below. Each row specifies start time, end time and current in amperes. Import/export CSV for mission-specific load profiles. Times are in minutes.'
    },
    'tt-schedule-start': {
      title: 'Schedule start (min)',
      body: 'Beginning of a load segment in minutes from simulation start. Segments should not overlap; gaps imply zero current unless covered by another row.'
    },
    'tt-schedule-end': {
      title: 'Schedule end (min)',
      body: 'End of a load segment in minutes. Current in the row applies from start (inclusive) until end (exclusive or inclusive per model — see solver).'
    },
    'tt-schedule-current': {
      title: 'Schedule current (A)',
      body: 'Circuit current applied during the schedule segment. Used directly in Q_gen = I²R(T) at each integration step within the interval.'
    },
    'tt-density-override': {
      title: 'Override density (kg/m³)',
      body: 'Conductor material density for thermal mass m = ρ × V. Default follows conductor material from advanced inputs (copper ≈ 8960 kg/m³). Override for sensitivity studies or non-standard alloys.'
    },
    'tt-cp-override': {
      title: 'Override Cp (J/kg·K)',
      body: 'Specific heat of the conductor used in mC_p dT/dt. Default follows material properties (copper ≈ 385 J/kg·K). Higher C_p slows temperature rise for the same heat input.'
    },
    'tt-cert-mode': {
      title: 'Conservative Certification Mode',
      body: 'When enabled, inherits worst-case thermal assumptions from advanced inputs (zero airflow, centre bundle, no structural conduction, conservative adjacent loading). Use when installation-specific data is unavailable for substantiation.'
    },
    'tt-worst-case': {
      title: 'Generate Worst Case',
      body: 'Applies a conservative combination of inputs aimed at maximising predicted conductor temperature — for example continuous peak load, centre bundle position, zero airflow and worst-case adjacent wires. Review the note after clicking before relying on results.'
    },
    'tt-sensitivity-enable': {
      title: 'Sensitivity analysis',
      body: 'Runs additional simulations with selected inputs varied by ±10%, ±20% and ±30% to show impact on peak temperature. Useful for identifying which assumptions drive transient results.'
    },
    'tt-res-volume': {
      title: 'Conductor volume',
      body: 'Volume of conducting material (not insulation) calculated from conductor diameter and run length. Used with density to determine thermal mass.'
    },
    'tt-res-mass': {
      title: 'Conductor mass',
      body: 'Mass m = ρ × V of the conductor. Together with C_p this sets thermal inertia — how quickly temperature changes for a given heat imbalance.'
    },
    'tt-res-heat-capacity': {
      title: 'Heat capacity mCp',
      body: 'Thermal capacitance mC_p in J/K from the lumped-parameter model. Appears in mC_p dT/dt = Q_gen − Q_loss. Larger values mean slower temperature changes.'
    },
    'tt-res-peak-temp': {
      title: 'Peak temperature',
      body: 'Maximum conductor temperature reached during the simulation. Compare to conductor rating T_R and installation limit for transient acceptability assessment.'
    },
    'tt-res-peak-time': {
      title: 'Time to peak',
      body: 'Simulation time when peak temperature occurs. Identifies whether the worst case is at end of load or after a delayed thermal buildup.'
    },
    'tt-res-time-rating': {
      title: 'Time to rating limit',
      body: 'First time the conductor temperature reaches the insulation rating T_R, if it occurs within the simulation. Shown as — if the rating is never exceeded.'
    },
    'tt-res-time-install': {
      title: 'Time to installation limit',
      body: 'First time temperature reaches the installation limit when enabled in the primary calculator. Shown as — if not exceeded or installation assessment is off.'
    },
    'tt-res-cool-90': {
      title: 'Cool-down (90% of rise)',
      body: 'Time after peak load reduction for temperature to recover 90% of the rise above initial temperature. Indicates how long significant thermal energy remains in the conductor.'
    },
    'tt-res-cool-75': {
      title: 'Cool-down (75% of rise)',
      body: 'Time to recover 75% of the temperature rise above initial conditions after the peak. Intermediate cool-down metric for duty-cycle spacing assessment.'
    },
    'tt-res-cool-50': {
      title: 'Cool-down (50% of rise)',
      body: 'Time to recover half of the peak temperature rise. Useful for estimating minimum off-time between repeated load pulses.'
    },
    'tt-res-cool-10': {
      title: 'Cool-down (10% of rise)',
      body: 'Time to recover 90% of peak excursion (10% of rise remaining). Approximates near-return to pre-load temperature.'
    },
    'tt-res-degree-hours': {
      title: 'Degree-hours',
      body: 'Thermal exposure metric: integral of temperature above a reference over time, expressed in degree-hours. Supports cumulative damage or ageing style comparisons across profiles.'
    },
    'tt-res-degree-minutes': {
      title: 'Degree-minutes',
      body: 'Same exposure metric as degree-hours but in degree-minutes for shorter missions or fine-grained review.'
    },
    'tt-res-utilisation': {
      title: 'Max thermal utilisation',
      body: 'Peak conductor temperature as a percentage of the conductor rating T_R. Values near or above 100% indicate rating exceedance at some point in the profile.'
    },
    'tt-res-min-margin': {
      title: 'Min safety margin',
      body: 'Smallest temperature margin to T_R or installation limit during the simulation. Minimum of (T_R − T) and (T_inst − T) when installation limits apply.'
    },
    'tt-res-status': {
      title: 'Engineering status',
      body: 'PASS, WARNING or FAIL based on transient peak temperature and margins versus conductor rating and installation limit. Independent of the primary steady-state calculator status.'
    },
    'tt-chart-temp': {
      title: 'Temperature vs time chart',
      body: 'Plot of conductor temperature versus simulation time. Shows heating and cool-down phases in response to the selected current profile and thermal rejection model.'
    },
    'tt-chart-heat': {
      title: 'Heat flow vs time chart',
      body: 'Generated and rejected heat versus time at each step. Helps verify when Q_gen exceeds Q_loss and which rejection path dominates during transients.'
    },
    'tt-chart-current': {
      title: 'Current vs time chart',
      body: 'Applied load current from the selected profile. Confirms the time history driving I²R heating in the transient solver.'
    },
    'tt-sensitivity-table': {
      title: 'Sensitivity analysis table',
      body: 'Peak temperature change when key inputs are perturbed by ±10%, ±20% and ±30%. Highlights assumptions that most affect transient results for focused substantiation.'
    }
  };

  function initTransientThermalHelp() {
    var container = document.getElementById('pwa-transient-body');
    if (!container || !global.PwaInfoHelp) {
      return;
    }
    PwaInfoHelp.initContainer(container, HELP);
  }

  global.PwaTransientThermalHelp = {
    HELP: HELP,
    init: initTransientThermalHelp
  };
})(typeof window !== 'undefined' ? window : this);
