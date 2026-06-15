window.EQUATION_REF_DETAILS = {
  "dc_power": {
    symbol: "\\( P = V \\times I \\)",
    title: "DC Power Formula",
    explain: "Use when voltage and current are steady (DC) and in the same direction. Gives true power in watts.",
    example: "A 12 V motor draws 5 A:<br>\\( P = 12 \\times 5 = 60 \\text{ W} \\).",
    diagram: "dc"
  },
  "ac_single": {
    symbol: "\\( P = V \\times I \\times \\cos(\\theta) \\)",
    title: "Single-Phase AC Power",
    explain: "For AC, voltage and current can be out of phase. The \\( \\cos(\\theta) \\) term (power factor) gives real power.",
    example: "230 V, 10 A, power factor 0.9:<br>\\( P = 230 \\times 10 \\times 0.9 = 2{,}070 \\text{ W} \\).",
    diagram: "ac_single"
  },
  "ac_three": {
    symbol: "\\( P = \\sqrt{3} \\times V_L \\times I_L \\times \\cos(\\theta) \\)",
    title: "Three-Phase AC Power",
    explain: "Calculates total true power in a balanced three-phase system using line voltage and line current.",
    example: "400 V line, 15 A line, PF 0.85:<br>\\( P = \\sqrt{3} \\times 400 \\times 15 \\times 0.85 \\approx 8{,}834 \\text{ W} \\).",
    diagram: "ac_three"
  },
  "apparent": {
    symbol: "\\( S = \\sqrt{P^2 + Q^2} \\)",
    title: "Apparent Power Calculation",
    explain: "Combines true power \\( P \\) and reactive power \\( Q \\) to find apparent power \\( S \\), measured in VA.",
    example: "\\( P = 3{,}000 \\text{ W} \\), \\( Q = 4{,}000 \\text{ VAR} \\):<br>\\( S = \\sqrt{3000^2 + 4000^2} = 5{,}000 \\text{ VA} \\)."
  },
  "reactive": {
    symbol: "\\( Q = V \\times I \\times \\sin(\\theta) \\)",
    title: "Reactive Power Formula",
    explain: "Gives reactive power from voltage, current, and phase angle. Used for inductive or capacitive loads.",
    example: "230 V, 10 A, \\( \\sin(\\theta) \\approx 0.6 \\):<br>\\( Q = 230 \\times 10 \\times 0.6 = 1{,}380 \\text{ VAR} \\)."
  },
  "ohms": {
    symbol: "\\( R = \\dfrac{V}{I} \\)",
    title: "Ohm's Law (Resistance Calculation)",
    explain: "Resistance is voltage divided by current. Rearrange to \\( V = IR \\) or \\( I = V/R \\) as needed.",
    example: "24 V across a resistor with 3 A flowing:<br>\\( R = \\dfrac{24}{3} = 8 \\, \\Omega \\)."
  },
  "impedance": {
    symbol: "\\( Z = \\sqrt{R^2 + X^2} \\)",
    title: "Impedance Formula",
    explain: "In AC circuits, total opposition \\( Z \\) combines resistance \\( R \\) and reactance \\( X \\).",
    example: "\\( R = 3 \\, \\Omega \\), \\( X = 4 \\, \\Omega \\):<br>\\( Z = \\sqrt{3^2 + 4^2} = 5 \\, \\Omega \\)."
  },
  "xl": {
    symbol: "\\( X_L = 2\\pi f L \\)",
    title: "Inductive Reactance",
    explain: "An inductor opposes AC current. Reactance rises with frequency and inductance.",
    example: "50 Hz, 0.05 H inductor:<br>\\( X_L = 2\\pi \\times 50 \\times 0.05 \\approx 15.7 \\, \\Omega \\).",
    diagram: "inductor"
  },
  "xc": {
    symbol: "\\( X_C = \\dfrac{1}{2\\pi f C} \\)",
    title: "Capacitive Reactance",
    explain: "A capacitor opposes AC current. Reactance falls as frequency or capacitance increases.",
    example: "50 Hz, 200 μF capacitor:<br>\\( X_C = \\dfrac{1}{2\\pi \\times 50 \\times 200 \\times 10^{-6}} \\approx 15.9 \\, \\Omega \\).",
    diagram: "capacitor"
  },
  "star_voltage": {
    symbol: "\\( V_L = \\sqrt{3} \\times V_{Ph} \\)",
    title: "Star Connection: Line vs. Phase Voltage",
    explain: "In a star (wye) connection, line voltage is \\( \\sqrt{3} \\) times the phase voltage to neutral.",
    example: "Phase voltage 230 V:<br>\\( V_L = \\sqrt{3} \\times 230 \\approx 400 \\text{ V} \\).",
    diagram: "star"
  },
  "star_current": {
    symbol: "\\( I_L = I_{Ph} \\)",
    title: "Star Connection: Line vs. Phase Current",
    explain: "In a star connection, current in each supply line equals current through each phase load.",
    example: "If each phase draws 12 A, then \\( I_L = 12 \\text{ A} \\) in each line conductor.",
    diagram: "star_current"
  },
  "delta_voltage": {
    symbol: "\\( V_L = V_{Ph} \\)",
    title: "Delta Connection: Line vs. Phase Voltage",
    explain: "In a delta connection, each phase is connected line-to-line, so line voltage equals phase voltage.",
    example: "A 400 V three-phase delta supply has \\( V_L = V_{Ph} = 400 \\text{ V} \\).",
    diagram: "delta"
  },
  "delta_current": {
    symbol: "\\( I_L = \\sqrt{3} \\times I_{Ph} \\)",
    title: "Delta Connection: Line vs. Phase Current",
    explain: "In a delta connection, line current is \\( \\sqrt{3} \\) times the current through each phase winding.",
    example: "Each phase carries 10 A:<br>\\( I_L = \\sqrt{3} \\times 10 \\approx 17.3 \\text{ A} \\).",
    diagram: "delta_current"
  },
};
