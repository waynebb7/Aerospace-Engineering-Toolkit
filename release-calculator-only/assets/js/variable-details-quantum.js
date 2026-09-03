window.VARIABLE_REF_DETAILS = {
  "psi": {
    symbol: "\\( |\\psi\\rangle \\)",
    title: "State Vector (Ket)",
    explain: "A pure quantum state is represented by a ket \\( |\\psi\rangle \\). Measurement probabilities come from amplitudes squared.",
    example: "A qubit \\( |\\psi\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\) gives \\( P(0) = P(1) = \\tfrac{1}{2} \\)."
  },
  "hbar": {
    symbol: "\\( \\hbar \\)",
    title: "Reduced Planck Constant",
    explain: "H-bar \\( \\hbar = h / (2\\pi) \u0007pprox 1.055 \times 10^{-34} \text{ J s} \\) appears in commutation relations and the Schrödinger equation.",
    example: "Energy-time relation scale: \\( \\Delta E \\Delta t \\gtrsim \\hbar/2 \\) (order-of-magnitude uncertainty principle)."
  },
  "alpha": {
    symbol: "\\( \\alpha \\)",
    title: "Qubit Amplitude for \\( |0\rangle \\)",
    explain: "A single qubit is written \\( |\\psi\rangle = \u0007lpha|0\rangle + \beta|1\rangle \\) with \\( |\u0007lpha|^2 + |\beta|^2 = 1 \\).",
    example: "If \\( \\alpha = 0.6 \\) (real) and normalised, \\( |\\alpha|^2 = 0.36 \\) so \\( P(0) = 0.36 \\)."
  },
  "beta": {
    symbol: "\\( \\beta \\)",
    title: "Qubit Amplitude for \\( |1\rangle \\)",
    explain: "The amplitude \\( \beta \\) on \\( |1\rangle \\) satisfies \\( |\beta|^2 = 1 - |\u0007lpha|^2 \\) for a pure state.",
    example: "If \\( |\\alpha|^2 = 0.36 \\), then \\( |\\beta|^2 = 0.64 \\) and \\( |\\beta| = 0.8 \\)."
  },
  "ket0": {
    symbol: "\\( |0\\rangle \\)",
    title: "Computational Zero State",
    explain: "The computational basis state \\( |0\rangle \\) is an eigenstate of the Pauli Z operator with eigenvalue +1.",
    example: "Measuring \\( |0\\rangle \\) in the Z basis gives outcome 0 with certainty."
  },
  "ket1": {
    symbol: "\\( |1\\rangle \\)",
    title: "Computational One State",
    explain: "The state \\( |1\rangle \\) is the other computational basis vector, orthogonal to \\( |0\rangle \\).",
    example: "The Hadamard gate maps \\( |0\\rangle \\to |+\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\)."
  },
  "unitary": {
    symbol: "\\( U \\)",
    title: "Unitary Operator",
    explain: "Unitary operators describe reversible quantum gates — they preserve total probability.",
    example: "Pauli X: \\( X|0\\rangle = |1\\rangle \\), \\( X|1\\rangle = |0\\rangle \\) (bit flip)."
  },
  "rho": {
    symbol: "\\( \\rho \\)",
    title: "Density Matrix",
    explain: "The density matrix describes mixed and pure states. For pure \\( |\\psi\rangle \\), \\( \rho = |\\psi\rangle\\langle\\psi| \\).",
    example: "Completely mixed qubit: \\( \\rho = \\tfrac{1}{2}(|0\\rangle\\langle 0| + |1\\rangle\\langle 1|) = \\tfrac{I}{2} \\)."
  },
  "entropy": {
    symbol: "\\( S \\)",
    title: "Von Neumann Entropy",
    explain: "Quantum entropy \\( S(\rho) = -\\mathrm{Tr}(\rho \\log_2 \rho) \\) measures mixedness. Pure states have \\( S = 0 \\).",
    example: "Maximally mixed qubit has \\( S = 1 \\) bit."
  },
  "pauli_x": {
    symbol: "\\( X \\)",
    title: "Pauli X Gate",
    explain: "Pauli X is the quantum NOT gate — it swaps \\( |0\rangle \\) and \\( |1\rangle \\).",
    example: "\\( X = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} \\). Applied to \\( |+\\rangle \\): \\( X|+\\rangle = |+\\rangle \\)."
  },
  "pauli_z": {
    symbol: "\\( Z \\)",
    title: "Pauli Z Gate",
    explain: "Pauli Z applies a phase flip on \\( |1\rangle \\): \\( Z|1\rangle = -|1\rangle \\), leaves \\( |0\rangle \\) unchanged.",
    example: "\\( Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix} \\)."
  },
  "hadamard": {
    symbol: "\\( H \\)",
    title: "Hadamard Gate",
    explain: "Hadamard creates superposition: \\( H|0\rangle = |+\rangle \\), \\( H|1\rangle = |-\rangle \\).",
    example: "\\( H = \\tfrac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix} \\). Note \\( H^2 = I \\)."
  },
  "cnot": {
    symbol: "\\( \\mathrm{CNOT} \\)",
    title: "Controlled-NOT Gate",
    explain: "CNOT flips the target qubit if the control is \\( |1\rangle \\). Creates entanglement from superposition.",
    example: "\\( \\mathrm{CNOT}|00\\rangle = |00\\rangle \\), \\( \\mathrm{CNOT}|10\\rangle = |11\\rangle \\)."
  },
  "omega": {
    symbol: "\\( \\omega \\)",
    title: "Angular Frequency",
    explain: "In quantum mechanics, energy often relates to angular frequency: \\( E = \\hbar\\omega \\).",
    example: "If \\( \\omega = 2\\pi \\times 10^{15} \\text{ rad/s} \\):<br>\\( E = \\hbar\\omega \\approx 1.055 \\times 10^{-34} \\times 2\\pi \\times 10^{15} \\approx 6.6 \\times 10^{-19} \\text{ J} \\)."
  },
  "energy": {
    symbol: "\\( E \\)",
    title: "Energy",
    explain: "Energy eigenvalues label stationary states. Photon energy \\( E = h\nu = \\hbar\\omega \\).",
    example: "Photon at 500 THz: \\( E = h\\nu \\approx 6.63 \\times 10^{-34} \\times 5 \\times 10^{14} \\approx 3.3 \\times 10^{-19} \\text{ J} \\approx 2.1 \\text{ eV} \\)."
  },
  "delta_x": {
    symbol: "\\( \\Delta x \\)",
    title: "Position Uncertainty",
    explain: "Standard deviation of position measurements for a quantum state. Pairs with momentum uncertainty in the uncertainty principle.",
    example: "Gaussian wave packet with \\( \\Delta x = 1 \\text{ nm} \\) implies \\( \\Delta p \\gtrsim \\hbar / (2\\Delta x) \\approx 5 \\times 10^{-26} \\text{ kg m/s} \\)."
  },
  "fidelity": {
    symbol: "\\( F \\)",
    title: "State Fidelity",
    explain: "Fidelity measures overlap between states: for pure states \\( |\\psi\rangle, |\\phi\rangle \\), \\( F = |\\langle\\psi|\\phi\rangle|^2 \\).",
    example: "If \\( |\\psi\\rangle = |0\\rangle \\) and \\( |\\phi\\rangle = |+\\rangle \\):<br>\\( F = |\\langle 0|+\\rangle|^2 = \\tfrac{1}{2} \\)."
  },
  "bell": {
    symbol: "\\( |\\Phi^+\\rangle \\)",
    title: "Bell State",
    explain: "Bell states are maximally entangled. \\( |\\Phi^+\rangle = \tfrac{1}{\\sqrt{2}}(|00\rangle + |11\rangle) \\) is a common resource for teleportation.",
    example: "Measuring either qubit of \\( |\\Phi^+\\rangle \\) in Z yields perfectly correlated 0/0 or 1/1 outcomes."
  },
};
