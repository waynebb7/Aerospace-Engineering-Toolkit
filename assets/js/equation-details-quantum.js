window.EQUATION_REF_DETAILS = {
  "planck": {
    symbol: "\\( E = hf \\)",
    title: "Planck Relation",
    explain: "Photon energy proportional to frequency. \\( h \\approx 6.63 \\times 10^{-34} \\text{ J s} \\).",
    example: "Red light \\( f = 4.3 \\times 10^{14} \\text{ Hz} \\):<br>\\( E \\approx 2.9 \\times 10^{-19} \\text{ J} \\)."
  },
  "hbar_omega": {
    symbol: "\\( E = \\hbar\\omega \\)",
    title: "Energy and Angular Frequency",
    explain: "\\( \\hbar = h/(2\\pi) \\). Common in quantum mechanics and qubit Hamiltonians.",
    example: "\\( \\omega = 2\\pi \\times 10^9 \\text{ rad/s} \\):<br>\\( E = \\hbar\\omega \\approx 1.05 \\times 10^{-25} \\text{ J} \\)."
  },
  "de_broglie": {
    symbol: "\\( \\lambda = \\dfrac{h}{p} \\)",
    title: "de Broglie Wavelength",
    explain: "Matter waves: wavelength inversely proportional to momentum \\( p = mv \\) for non-relativistic particles.",
    example: "Electron \\( p = 9.1 \\times 10^{-25} \\text{ kg m/s} \\):<br>\\( \\lambda = h/p \\approx 7.3 \\times 10^{-10} \\text{ m} \\)."
  },
  "schrodinger_td": {
    symbol: "\\( i\\hbar\\dfrac{\\partial\\psi}{\\partial t} = \\hat{H}\\psi \\)",
    title: "Time-Dependent Schrödinger Equation",
    explain: "Governs how quantum state \\( \\psi \\) evolves in time under Hamiltonian \\( \\hat{H} \\).",
    example: "For a free particle, \\( \\hat{H} = -\\dfrac{\\hbar^2}{2m}\\nabla^2 \\); plane-wave solutions have \\( E = \\hbar\\omega \\)."
  },
  "schrodinger_ti": {
    symbol: "\\( \\hat{H}\\psi = E\\psi \\)",
    title: "Time-Independent Schrödinger Equation",
    explain: "Stationary states have definite energy \\( E \\). Used to find energy levels in wells, atoms, and molecules.",
    example: "Infinite square well width \\( L \\):<br>\\( E_n = \\dfrac{n^2 h^2}{8mL^2} \\), \\( n = 1, 2, 3, \\ldots \\)"
  },
  "uncertainty": {
    symbol: "\\( \\Delta x \\, \\Delta p \\geq \\dfrac{\\hbar}{2} \\)",
    title: "Heisenberg Uncertainty Principle",
    explain: "Fundamental limit on simultaneously knowing position and momentum. Not a measurement error — intrinsic to quantum theory.",
    example: "If \\( \\Delta x = 1 \\text{ nm} = 10^{-9} \\text{ m} \\):<br>\\( \\Delta p \\gtrsim \\hbar/(2\\Delta x) \\approx 5 \\times 10^{-26} \\text{ kg m/s} \\)."
  },
  "commutation": {
    symbol: "\\( [\\hat{x}, \\hat{p}] = i\\hbar \\)",
    title: "Canonical Commutation Relation",
    explain: "Position and momentum operators do not commute. Implies uncertainty and underpins quantization.",
    example: "Applied to \\( \\psi(x) \\):<br>\\( \\hat{x}\\hat{p}\\psi - \\hat{p}\\hat{x}\\psi = i\\hbar\\psi \\)."
  },
  "born": {
    symbol: "\\( P = |\\langle\\phi|\\psi\\rangle|^2 \\)",
    title: "Born Rule",
    explain: "Probability of measuring state \\( |\\phi\\rangle \\) when the system is in \\( |\\psi\\rangle \\).",
    example: "\\( |\\psi\\rangle = |+\\rangle \\), \\( |\\phi\\rangle = |0\\rangle \\):<br>\\( P = |\\langle 0|+\\rangle|^2 = \\tfrac{1}{2} \\)."
  },
  "qubit_state": {
    symbol: "\\( |\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle \\)",
    title: "Single-Qubit State",
    explain: "Pure qubit state with normalization \\( |\\alpha|^2 + |\\beta|^2 = 1 \\).",
    example: "\\( \\alpha = \\tfrac{1}{\\sqrt{2}} \\), \\( \\beta = \\tfrac{1}{\\sqrt{2}} \\):<br>\\( |\\psi\\rangle = |+\\rangle \\); measure 0 or 1 with equal probability."
  },
  "density_pure": {
    symbol: "\\( \\rho = |\\psi\\rangle\\langle\\psi| \\)",
    title: "Pure-State Density Matrix",
    explain: "Projects onto pure state. Trace 1, idempotent (\\( \rho^2 = \rho \\)). Used for mixed states when diagonal.",
    example: "\\( |\\psi\\rangle = |0\\rangle \\):<br>\\( \\rho = \\begin{pmatrix}1 & 0 \\\\ 0 & 0\\end{pmatrix} \\)."
  },
  "von_neumann": {
    symbol: "\\( S(\\rho) = -\\mathrm{Tr}(\\rho \\log_2 \\rho) \\)",
    title: "Von Neumann Entropy",
    explain: "Quantum generalisation of Shannon entropy. Pure states have \\( S = 0 \\); maximally mixed qubit has \\( S = 1 \\) bit.",
    example: "Maximally mixed qubit \\( \\rho = I/2 \\):<br>\\( S = 1 \\text{ bit} \\)."
  },
  "hadamard": {
    symbol: "\\( H|0\\rangle = |+\\rangle \\)",
    title: "Hadamard Gate Action",
    explain: "\\( H = \\tfrac{1}{\\sqrt{2}}\\begin{pmatrix}1 & 1 \\\\ 1 & -1\\end{pmatrix} \\) creates equal superposition from \\( |0\\rangle \\).",
    example: "Apply \\( H \\) to \\( |0\\rangle \\):<br>\\( |+\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\)."
  },
  "cnot": {
    symbol: "\\( \\mathrm{CNOT}|10\\rangle = |11\\rangle \\)",
    title: "CNOT Gate Action",
    explain: "Flips target when control is \\( |1\\rangle \\). With superposition on control, creates entanglement.",
    example: "\\( \\mathrm{CNOT}\\tfrac{1}{\\sqrt{2}}(|00\\rangle + |10\\rangle) = \\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle) = |\\Phi^+\\rangle \\)."
  },
  "fidelity": {
    symbol: "\\( F = |\\langle\\phi|\\psi\\rangle|^2 \\)",
    title: "State Fidelity",
    explain: "Overlap measure between pure states. 1 means identical up to global phase; 0 means orthogonal.",
    example: "\\( |\\psi\\rangle = |0\\rangle \\), \\( |\\phi\\rangle = |1\\rangle \\):<br>\\( F = 0 \\). For \\( |\\phi\\rangle = |0\\rangle \\), \\( F = 1 \\)."
  },
  "bell_phi": {
    symbol: "\\( |\\Phi^+\\rangle = \\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle) \\)",
    title: "Bell State \\( |\\Phi^+\rangle \\)",
    explain: "Maximally entangled two-qubit state. Resource for teleportation, superdense coding, and Bell tests.",
    example: "Measuring both qubits in Z yields correlated outcomes 00 or 11, each with probability \\( \\tfrac{1}{2} \\)."
  },
};
