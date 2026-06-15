#!/usr/bin/env python3
"""Generate subject equation reference pages and detail scripts."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets" / "js"

# (key, symbol, title, unit, explain, example, diagram?)
Entry = tuple[str, str, str, str, str, str, str | None]

SUBJECTS: dict[str, dict] = {
    "electrical": {
        "title": "Electrical Engineering Equations",
        "hint": "Tap any equation for a quick explanation and worked example.",
        "path": "reference/electrical/equations.html",
        "circuit_diagrams": True,
        "entries": [
            ("dc_power", r"\( P = V \times I \)", "DC Power Formula", "(Watts, W)",
             "Use when voltage and current are steady (DC) and in the same direction. Gives true power in watts.",
             r"A 12 V motor draws 5 A:<br>\( P = 12 \times 5 = 60 \text{ W} \).", "dc"),
            ("ac_single", r"\( P = V \times I \times \cos(\theta) \)", "Single-Phase AC Power", "(Watts, W)",
             r"For AC, voltage and current can be out of phase. The \( \cos(\theta) \) term (power factor) gives real power.",
             r"230 V, 10 A, power factor 0.9:<br>\( P = 230 \times 10 \times 0.9 = 2{,}070 \text{ W} \).", "ac_single"),
            ("ac_three", r"\( P = \sqrt{3} \times V_L \times I_L \times \cos(\theta) \)", "Three-Phase AC Power", "(Watts, W)",
             "Calculates total true power in a balanced three-phase system using line voltage and line current.",
             r"400 V line, 15 A line, PF 0.85:<br>\( P = \sqrt{3} \times 400 \times 15 \times 0.85 \approx 8{,}834 \text{ W} \).", "ac_three"),
            ("apparent", r"\( S = \sqrt{P^2 + Q^2} \)", "Apparent Power Calculation", "(Volt-Amps, VA)",
             r"Combines true power \( P \) and reactive power \( Q \) to find apparent power \( S \), measured in VA.",
             r"\( P = 3{,}000 \text{ W} \), \( Q = 4{,}000 \text{ VAR} \):<br>\( S = \sqrt{3000^2 + 4000^2} = 5{,}000 \text{ VA} \).", None),
            ("reactive", r"\( Q = V \times I \times \sin(\theta) \)", "Reactive Power Formula", "(Volt-Amps Reactive, VAR)",
             "Gives reactive power from voltage, current, and phase angle. Used for inductive or capacitive loads.",
             r"230 V, 10 A, \( \sin(\theta) \approx 0.6 \):<br>\( Q = 230 \times 10 \times 0.6 = 1{,}380 \text{ VAR} \).", None),
            ("ohms", r"\( R = \dfrac{V}{I} \)", "Ohm's Law (Resistance Calculation)", r"(Ohms, \( \Omega \))",
             r"Resistance is voltage divided by current. Rearrange to \( V = IR \) or \( I = V/R \) as needed.",
             r"24 V across a resistor with 3 A flowing:<br>\( R = \dfrac{24}{3} = 8 \, \Omega \).", None),
            ("impedance", r"\( Z = \sqrt{R^2 + X^2} \)", "Impedance Formula", r"(Ohms, \( \Omega \))",
             r"In AC circuits, total opposition \( Z \) combines resistance \( R \) and reactance \( X \).",
             r"\( R = 3 \, \Omega \), \( X = 4 \, \Omega \):<br>\( Z = \sqrt{3^2 + 4^2} = 5 \, \Omega \).", None),
            ("xl", r"\( X_L = 2\pi f L \)", "Inductive Reactance", r"(Ohms, \( \Omega \))",
             "An inductor opposes AC current. Reactance rises with frequency and inductance.",
             r"50 Hz, 0.05 H inductor:<br>\( X_L = 2\pi \times 50 \times 0.05 \approx 15.7 \, \Omega \).", "inductor"),
            ("xc", r"\( X_C = \dfrac{1}{2\pi f C} \)", "Capacitive Reactance", r"(Ohms, \( \Omega \))",
             "A capacitor opposes AC current. Reactance falls as frequency or capacitance increases.",
             r"50 Hz, 200 μF capacitor:<br>\( X_C = \dfrac{1}{2\pi \times 50 \times 200 \times 10^{-6}} \approx 15.9 \, \Omega \).", "capacitor"),
            ("star_voltage", r"\( V_L = \sqrt{3} \times V_{Ph} \)", "Star Connection: Line vs. Phase Voltage", "(Volts, V)",
             r"In a star (wye) connection, line voltage is \( \sqrt{3} \) times the phase voltage to neutral.",
             r"Phase voltage 230 V:<br>\( V_L = \sqrt{3} \times 230 \approx 400 \text{ V} \).", "star"),
            ("star_current", r"\( I_L = I_{Ph} \)", "Star Connection: Line vs. Phase Current", "(Amps, A)",
             "In a star connection, current in each supply line equals current through each phase load.",
             r"If each phase draws 12 A, then \( I_L = 12 \text{ A} \) in each line conductor.", "star_current"),
            ("delta_voltage", r"\( V_L = V_{Ph} \)", "Delta Connection: Line vs. Phase Voltage", "(Volts, V)",
             "In a delta connection, each phase is connected line-to-line, so line voltage equals phase voltage.",
             r"A 400 V three-phase delta supply has \( V_L = V_{Ph} = 400 \text{ V} \).", "delta"),
            ("delta_current", r"\( I_L = \sqrt{3} \times I_{Ph} \)", "Delta Connection: Line vs. Phase Current", "(Amps, A)",
             r"In a delta connection, line current is \( \sqrt{3} \) times the current through each phase winding.",
             r"Each phase carries 10 A:<br>\( I_L = \sqrt{3} \times 10 \approx 17.3 \text{ A} \).", "delta_current"),
        ],
    },
    "physics": {
        "title": "Physics Equations",
        "hint": "Tap any equation for a quick explanation and worked example.",
        "path": "reference/physics/equations.html",
        "circuit_diagrams": False,
        "entries": [
            ("newton2", r"\( F = ma \)", "Newton's Second Law", "(Newtons, N)",
             r"Net force equals mass times acceleration. The direction of \( \mathbf{F} \) matches the acceleration.",
             r"A 4 kg block accelerates at 2.5 m/s\(^2\):<br>\( F = 4 \times 2.5 = 10 \text{ N} \).", None),
            ("suvat_v", r"\( v = u + at \)", "SUVAT: Final Velocity", "(Metres per second, m/s)",
             "Constant-acceleration kinematics linking initial velocity, acceleration, and time.",
             r"\( u = 5 \text{ m/s} \), \( a = 2 \text{ m/s}^2 \), \( t = 4 \text{ s} \):<br>\( v = 5 + 2 \times 4 = 13 \text{ m/s} \).", None),
            ("suvat_s", r"\( s = ut + \tfrac{1}{2}at^2 \)", "SUVAT: Displacement", "(Metres, m)",
             "Displacement from rest or motion with constant acceleration over time.",
             r"\( u = 0 \), \( a = 3 \text{ m/s}^2 \), \( t = 2 \text{ s} \):<br>\( s = 0 + \tfrac{1}{2} \times 3 \times 2^2 = 6 \text{ m} \).", None),
            ("suvat_v2", r"\( v^2 = u^2 + 2as \)", "SUVAT: Velocity and Displacement", "(Metres per second squared, m/s\(^2\))",
             "Links velocity change to displacement when time is unknown.",
             r"\( u = 10 \text{ m/s} \), \( a = -2 \text{ m/s}^2 \), \( s = 24 \text{ m} \):<br>\( v^2 = 100 + 2(-2)(24) = 4 \Rightarrow v = 2 \text{ m/s} \).", None),
            ("weight", r"\( W = mg \)", "Weight", "(Newtons, N)",
             r"Weight is the gravitational force on mass \( m \). Near Earth's surface, \( g \approx 9.8 \text{ m/s}^2 \).",
             r"A 70 kg person:<br>\( W = 70 \times 9.8 = 686 \text{ N} \).", None),
            ("momentum", r"\( p = mv \)", "Linear Momentum", "(kg m/s)",
             "Momentum is mass times velocity. Conserved in closed systems with no external impulse.",
             r"A 0.15 kg ball at 20 m/s:<br>\( p = 0.15 \times 20 = 3 \text{ kg m/s} \).", None),
            ("impulse", r"\( F\Delta t = \Delta p \)", "Impulse–Momentum Theorem", "(N s or kg m/s)",
             "Impulse from a force over time equals the change in momentum.",
             r"A 0.5 kg cart changes velocity by 4 m/s:<br>\( F\Delta t = \Delta p = 0.5 \times 4 = 2 \text{ N s} \).", None),
            ("kinetic", r"\( E_k = \tfrac{1}{2}mv^2 \)", "Kinetic Energy", "(Joules, J)",
             "Energy of motion. Doubling speed quadruples kinetic energy.",
             r"\( m = 2 \text{ kg} \), \( v = 6 \text{ m/s} \):<br>\( E_k = \tfrac{1}{2} \times 2 \times 6^2 = 36 \text{ J} \).", None),
            ("gpe", r"\( E_p = mgh \)", "Gravitational Potential Energy", "(Joules, J)",
             r"Energy stored due to height \( h \) in a uniform field. Reference level for \( h \) is chosen by convention.",
             r"\( m = 5 \text{ kg} \), \( g = 9.8 \), \( h = 3 \text{ m} \):<br>\( E_p = 5 \times 9.8 \times 3 = 147 \text{ J} \).", None),
            ("power", r"\( P = \dfrac{W}{t} \)", "Mechanical Power", "(Watts, W)",
             r"Power is the rate of energy transfer or work done. Also \( P = Fv \) when force and velocity align.",
             r"300 J of work in 5 s:<br>\( P = \dfrac{300}{5} = 60 \text{ W} \).", None),
            ("pressure", r"\( p = \dfrac{F}{A} \)", "Pressure", "(Pascals, Pa)",
             r"Pressure is force per unit area. 1 Pa = 1 N/m\(^2\).",
             r"A force of 200 N on 0.04 m\(^2\):<br>\( p = \dfrac{200}{0.04} = 5{,}000 \text{ Pa} \).", None),
            ("density", r"\( \rho = \dfrac{m}{V} \)", "Density", "(kg/m\(^3\))",
             "Mass per unit volume. Used in flotation, pressure in fluids, and material identification.",
             r"\( m = 540 \text{ g} = 0.54 \text{ kg} \), \( V = 0.0002 \text{ m}^3 \):<br>\( \rho = \dfrac{0.54}{0.0002} = 2{,}700 \text{ kg/m}^3 \) (aluminium).", None),
            ("wave", r"\( v = f\lambda \)", "Wave Equation", "(Wave speed in m/s)",
             r"Wave speed equals frequency times wavelength. Applies to sound, light, and water waves.",
             r"\( f = 440 \text{ Hz} \), \( \lambda = 0.78 \text{ m} \):<br>\( v = 440 \times 0.78 \approx 343 \text{ m/s} \).", None),
            ("hookes", r"\( F = kx \)", "Hooke's Law", "(Newtons, N)",
             r"Elastic extension \( x \) is proportional to applied force in the linear region. \( k \) is the spring constant.",
             r"\( k = 200 \text{ N/m} \), extension 0.03 m:<br>\( F = 200 \times 0.03 = 6 \text{ N} \).", None),
            ("youngs", r"\( E = \dfrac{\sigma}{\varepsilon} \)", "Young's Modulus", "(Pascals, Pa)",
             r"Stiffness in the elastic region: stress \( \sigma = F/A \) over strain \( \varepsilon = \Delta L/L \).",
             r"Stress \( 2 \times 10^8 \text{ Pa} \), strain 0.001:<br>\( E = \dfrac{2 \times 10^8}{0.001} = 2 \times 10^{11} \text{ Pa} \).", None),
            ("snell", r"\( n_1\sin\theta_1 = n_2\sin\theta_2 \)", "Snell's Law", "(Unitless refractive indices)",
             "Relates angles of incidence and refraction at a boundary between two media.",
             r"Air (\( n_1 = 1.0 \)) to glass (\( n_2 = 1.5 \)), \( \theta_1 = 30° \):<br>\( \sin\theta_2 = \dfrac{1.0 \times \sin 30°}{1.5} = \tfrac{1}{3} \Rightarrow \theta_2 \approx 19.5° \).", None),
            ("motor_effect", r"\( F = BIL\sin\theta \)", "Magnetic Force on a Conductor", "(Newtons, N)",
             r"Force on a current-carrying wire in magnetic flux density \( B \). Maximum when wire is perpendicular to \( B \).",
             r"\( B = 0.4 \text{ T} \), \( I = 5 \text{ A} \), \( L = 0.2 \text{ m} \), \( \sin\theta = 1 \):<br>\( F = 0.4 \times 5 \times 0.2 = 0.4 \text{ N} \).", None),
            ("faraday", r"\( \varepsilon = -\dfrac{\Delta\Phi}{\Delta t} \)", "Faraday's Law (Magnitude)", "(Volts, V)",
             r"Induced emf equals the rate of change of magnetic flux. The minus sign (Lenz's law) gives direction.",
             r"Flux changes by 0.012 Wb in 0.03 s:<br>\( |\varepsilon| = \dfrac{0.012}{0.03} = 0.4 \text{ V} \).", None),
            ("photon", r"\( E = hf \)", "Photon Energy", "(Joules, J)",
             r"Energy of a photon is Planck's constant times frequency. Also \( E = hc/\lambda \) for light.",
             r"Green light \( f = 5.5 \times 10^{14} \text{ Hz} \):<br>\( E = 6.63 \times 10^{-34} \times 5.5 \times 10^{14} \approx 3.6 \times 10^{-19} \text{ J} \).", None),
            ("ideal_gas", r"\( pV = nRT \)", "Ideal Gas Law", "(Pressure in Pa, volume in m\(^3\))",
             r"Links pressure, volume, amount of substance \( n \), and temperature \( T \). \( R = 8.31 \text{ J mol}^{-1}\text{K}^{-1} \).",
             r"\( n = 2 \text{ mol} \), \( T = 300 \text{ K} \), \( V = 0.05 \text{ m}^3 \):<br>\( p = \dfrac{2 \times 8.31 \times 300}{0.05} \approx 99{,}720 \text{ Pa} \).", None),
        ],
    },
    "mathematics": {
        "title": "Mathematics Equations",
        "hint": "Tap any equation for a quick explanation and worked example.",
        "path": "reference/mathematics/equations.html",
        "circuit_diagrams": False,
        "entries": [
            ("quadratic", r"\( x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a} \)", "Quadratic Formula", "(Solutions for \( x \))",
             r"Solves \( ax^2 + bx + c = 0 \). Discriminant \( b^2 - 4ac \) determines the number of real roots.",
             r"\( x^2 - 5x + 6 = 0 \): \( a=1, b=-5, c=6 \):<br>\( x = \dfrac{5 \pm \sqrt{25-24}}{2} = 3 \) or \( 2 \).", None),
            ("pythagoras", r"\( a^2 + b^2 = c^2 \)", "Pythagoras' Theorem", "(Length units)",
             "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
             r"\( a = 3 \), \( b = 4 \):<br>\( c = \sqrt{3^2 + 4^2} = 5 \).", None),
            ("straight_line", r"\( y = mx + c \)", "Straight-Line Equation", "(Coordinates)",
             r"\( m \) is gradient; \( c \) is the y-intercept. Parallel lines share the same \( m \).",
             r"Gradient 2, intercept -3:<br>\( y = 2x - 3 \). When \( x = 4 \), \( y = 5 \).", None),
            ("gradient", r"\( m = \dfrac{y_2 - y_1}{x_2 - x_1} \)", "Gradient Formula", "(Unitless or rate units)",
             "Change in \( y \) divided by change in \( x \) between two points on a line.",
             r"Points (1, 2) and (5, 10):<br>\( m = \dfrac{10 - 2}{5 - 1} = 2 \).", None),
            ("sine_rule", r"\( \dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C} \)", "Sine Rule", "(Length and angles)",
             "Relates sides and opposite angles in any triangle. Useful when matching side–angle pairs.",
             r"\( A = 30° \), \( a = 8 \), \( B = 45° \):<br>\( b = \dfrac{8\sin 45°}{\sin 30°} = 8\sqrt{2} \approx 11.3 \).", None),
            ("cosine_rule", r"\( c^2 = a^2 + b^2 - 2ab\cos C \)", "Cosine Rule", "(Length units)",
             "Generalises Pythagoras for non-right triangles. Finds a side when two sides and the included angle are known.",
             r"\( a = 5 \), \( b = 7 \), \( C = 60° \):<br>\( c^2 = 25 + 49 - 2(5)(7)\cos 60° = 39 \Rightarrow c = \sqrt{39} \).", None),
            ("trig_identity", r"\( \sin^2\theta + \cos^2\theta = 1 \)", "Pythagorean Trig Identity", "(Unitless)",
             "Fundamental identity from the unit circle. Used to simplify expressions and solve equations.",
             r"If \( \sin\theta = 0.6 \), then \( \cos^2\theta = 1 - 0.36 = 0.64 \Rightarrow \cos\theta = \pm 0.8 \).", None),
            ("power_rule", r"\( \dfrac{d}{dx}(x^n) = nx^{n-1} \)", "Power Rule (Differentiation)", "(Derivative units)",
             "Differentiates polynomial terms. Valid for real \( n \) where the derivative exists.",
             r"\( y = x^4 \):<br>\( \dfrac{dy}{dx} = 4x^3 \). At \( x = 2 \), gradient \( = 32 \).", None),
            ("chain_rule", r"\( \dfrac{dy}{dx} = \dfrac{dy}{du}\dfrac{du}{dx} \)", "Chain Rule", "(Derivative units)",
             "Differentiates composite functions by multiplying inner and outer derivatives.",
             r"\( y = (3x + 1)^5 \): let \( u = 3x+1 \).<br>\( \dfrac{dy}{dx} = 5u^4 \times 3 = 15(3x+1)^4 \).", None),
            ("int_power", r"\( \int x^n \, dx = \dfrac{x^{n+1}}{n+1} + C \)", "Power Rule (Integration)", "(Integral units)",
             r"Integrates polynomial terms for \( n \neq -1 \). Add constant of integration \( C \).",
             r"\( \int 3x^2 \, dx = x^3 + C \). Definite from 0 to 2: \( 8 - 0 = 8 \).", None),
            ("binomial_sq", r"\( (a + b)^2 = a^2 + 2ab + b^2 \)", "Perfect Square Expansion", "(Algebraic)",
             "Expands a squared binomial. Signs change for \( (a - b)^2 = a^2 - 2ab + b^2 \).",
             r"\( (x + 3)^2 = x^2 + 6x + 9 \).", None),
            ("arith_seq", r"\( u_n = a + (n-1)d \)", "Arithmetic Sequence", "(Sequence terms)",
             r"\( a \) is first term, \( d \) is common difference, \( n \) is term number.",
             r"\( a = 5 \), \( d = 3 \):<br>\( u_4 = 5 + 3(4-1) = 14 \).", None),
            ("geom_seq", r"\( u_n = ar^{n-1} \)", "Geometric Sequence", "(Sequence terms)",
             r"\( a \) is first term, \( r \) is common ratio. Terms multiply by \( r \) each step.",
             r"\( a = 2 \), \( r = 3 \):<br>\( u_4 = 2 \times 3^3 = 54 \).", None),
            ("log_product", r"\( \log_a(xy) = \log_a x + \log_a y \)", "Logarithm Product Rule", "(Logarithmic)",
             "Log of a product equals sum of logs. Requires \( x, y > 0 \) and valid base.",
             r"\( \log_{10}(50) = \log_{10}(5) + \log_{10}(10) \approx 0.699 + 1 = 1.699 \).", None),
            ("circle_area", r"\( A = \pi r^2 \)", "Area of a Circle", "(Square units)",
             "Area enclosed by a circle of radius \( r \). Circumference is \( C = 2\pi r \).",
             r"\( r = 5 \text{ cm} \):<br>\( A = \pi \times 25 \approx 78.5 \text{ cm}^2 \).", None),
            ("sphere_volume", r"\( V = \tfrac{4}{3}\pi r^3 \)", "Volume of a Sphere", "(Cubic units)",
             "Volume of a sphere in terms of radius. Surface area is \( 4\pi r^2 \).",
             r"\( r = 3 \text{ m} \):<br>\( V = \tfrac{4}{3}\pi \times 27 \approx 113 \text{ m}^3 \).", None),
            ("eigenvalue", r"\( A\mathbf{v} = \lambda\mathbf{v} \)", "Eigenvalue Equation", "(Matrix algebra)",
             r"\( \lambda \) is an eigenvalue and \( \mathbf{v} \) an eigenvector when the matrix scales the vector without rotating direction.",
             r"\( A = \begin{pmatrix}2 & 0 \\ 0 & 3\end{pmatrix} \): eigenvalues \( 2 \) and \( 3 \) with axes as eigenvectors.", None),
            ("distance_2d", r"\( d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2} \)", "Distance Between Two Points", "(Length units)",
             "Euclidean distance in the plane from the coordinate difference.",
             r"(0, 0) to (6, 8):<br>\( d = \sqrt{36 + 64} = 10 \).", None),
        ],
    },
    "quantum": {
        "title": "Quantum Equations",
        "hint": "Tap any equation for a quick explanation and worked example.",
        "path": "reference/quantum/equations.html",
        "circuit_diagrams": False,
        "entries": [
            ("planck", r"\( E = hf \)", "Planck Relation", "(Joules, J)",
             r"Photon energy proportional to frequency. \( h \approx 6.63 \times 10^{-34} \text{ J s} \).",
             r"Red light \( f = 4.3 \times 10^{14} \text{ Hz} \):<br>\( E \approx 2.9 \times 10^{-19} \text{ J} \).", None),
            ("hbar_omega", r"\( E = \hbar\omega \)", "Energy and Angular Frequency", "(Joules, J)",
             r"\( \hbar = h/(2\pi) \). Common in quantum mechanics and qubit Hamiltonians.",
             r"\( \omega = 2\pi \times 10^9 \text{ rad/s} \):<br>\( E = \hbar\omega \approx 1.05 \times 10^{-25} \text{ J} \).", None),
            ("de_broglie", r"\( \lambda = \dfrac{h}{p} \)", "de Broglie Wavelength", "(Metres, m)",
             r"Matter waves: wavelength inversely proportional to momentum \( p = mv \) for non-relativistic particles.",
             r"Electron \( p = 9.1 \times 10^{-25} \text{ kg m/s} \):<br>\( \lambda = h/p \approx 7.3 \times 10^{-10} \text{ m} \).", None),
            ("schrodinger_td", r"\( i\hbar\dfrac{\partial\psi}{\partial t} = \hat{H}\psi \)", "Time-Dependent Schrödinger Equation", "(Wavefunction evolution)",
             r"Governs how quantum state \( \psi \) evolves in time under Hamiltonian \( \hat{H} \).",
             r"For a free particle, \( \hat{H} = -\dfrac{\hbar^2}{2m}\nabla^2 \); plane-wave solutions have \( E = \hbar\omega \).", None),
            ("schrodinger_ti", r"\( \hat{H}\psi = E\psi \)", "Time-Independent Schrödinger Equation", "(Energy eigenstates)",
             "Stationary states have definite energy \( E \). Used to find energy levels in wells, atoms, and molecules.",
             r"Infinite square well width \( L \):<br>\( E_n = \dfrac{n^2 h^2}{8mL^2} \), \( n = 1, 2, 3, \ldots \)", None),
            ("uncertainty", r"\( \Delta x \, \Delta p \geq \dfrac{\hbar}{2} \)", "Heisenberg Uncertainty Principle", "(Position–momentum limits)",
             "Fundamental limit on simultaneously knowing position and momentum. Not a measurement error — intrinsic to quantum theory.",
             r"If \( \Delta x = 1 \text{ nm} = 10^{-9} \text{ m} \):<br>\( \Delta p \gtrsim \hbar/(2\Delta x) \approx 5 \times 10^{-26} \text{ kg m/s} \).", None),
            ("commutation", r"\( [\hat{x}, \hat{p}] = i\hbar \)", "Canonical Commutation Relation", "(Operator algebra)",
             r"Position and momentum operators do not commute. Implies uncertainty and underpins quantization.",
             r"Applied to \( \psi(x) \):<br>\( \hat{x}\hat{p}\psi - \hat{p}\hat{x}\psi = i\hbar\psi \).", None),
            ("born", r"\( P = |\langle\phi|\psi\rangle|^2 \)", "Born Rule", "(Probability, 0 to 1)",
             r"Probability of measuring state \( |\phi\rangle \) when the system is in \( |\psi\rangle \).",
             r"\( |\psi\rangle = |+\rangle \), \( |\phi\rangle = |0\rangle \):<br>\( P = |\langle 0|+\rangle|^2 = \tfrac{1}{2} \).", None),
            ("qubit_state", r"\( |\psi\rangle = \alpha|0\rangle + \beta|1\rangle \)", "Single-Qubit State", "(Complex amplitudes)",
             r"Pure qubit state with normalization \( |\alpha|^2 + |\beta|^2 = 1 \).",
             r"\( \alpha = \tfrac{1}{\sqrt{2}} \), \( \beta = \tfrac{1}{\sqrt{2}} \):<br>\( |\psi\rangle = |+\rangle \); measure 0 or 1 with equal probability.", None),
            ("density_pure", r"\( \rho = |\psi\rangle\langle\psi| \)", "Pure-State Density Matrix", "(Density operator)",
             "Projects onto pure state. Trace 1, idempotent (\( \rho^2 = \rho \)). Used for mixed states when diagonal.",
             r"\( |\psi\rangle = |0\rangle \):<br>\( \rho = \begin{pmatrix}1 & 0 \\ 0 & 0\end{pmatrix} \).", None),
            ("von_neumann", r"\( S(\rho) = -\mathrm{Tr}(\rho \log_2 \rho) \)", "Von Neumann Entropy", "(Bits or nats)",
             r"Quantum generalisation of Shannon entropy. Pure states have \( S = 0 \); maximally mixed qubit has \( S = 1 \) bit.",
             r"Maximally mixed qubit \( \rho = I/2 \):<br>\( S = 1 \text{ bit} \).", None),
            ("hadamard", r"\( H|0\rangle = |+\rangle \)", "Hadamard Gate Action", "(State transformation)",
             r"\( H = \tfrac{1}{\sqrt{2}}\begin{pmatrix}1 & 1 \\ 1 & -1\end{pmatrix} \) creates equal superposition from \( |0\rangle \).",
             r"Apply \( H \) to \( |0\rangle \):<br>\( |+\rangle = \tfrac{1}{\sqrt{2}}(|0\rangle + |1\rangle) \).", None),
            ("cnot", r"\( \mathrm{CNOT}|10\rangle = |11\rangle \)", "CNOT Gate Action", "(Entangling gate)",
             r"Flips target when control is \( |1\rangle \). With superposition on control, creates entanglement.",
             r"\( \mathrm{CNOT}\tfrac{1}{\sqrt{2}}(|00\rangle + |10\rangle) = \tfrac{1}{\sqrt{2}}(|00\rangle + |11\rangle) = |\Phi^+\rangle \).", None),
            ("fidelity", r"\( F = |\langle\phi|\psi\rangle|^2 \)", "State Fidelity", "(0 to 1)",
             "Overlap measure between pure states. 1 means identical up to global phase; 0 means orthogonal.",
             r"\( |\psi\rangle = |0\rangle \), \( |\phi\rangle = |1\rangle \):<br>\( F = 0 \). For \( |\phi\rangle = |0\rangle \), \( F = 1 \).", None),
            ("bell_phi", r"\( |\Phi^+\rangle = \tfrac{1}{\sqrt{2}}(|00\rangle + |11\rangle) \)", "Bell State \( |\Phi^+\rangle \)", "(Entangled state)",
             "Maximally entangled two-qubit state. Resource for teleportation, superdense coding, and Bell tests.",
             r"Measuring both qubits in Z yields correlated outcomes 00 or 11, each with probability \( \tfrac{1}{2} \).", None),
        ],
    },
}


def js_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def build_details_js(entries: list[Entry]) -> str:
    lines = ["window.EQUATION_REF_DETAILS = {"]
    for key, symbol, title, _unit, explain, example, diagram in entries:
        lines.append(f"  {js_string(key)}: {{")
        lines.append(f"    symbol: {js_string(symbol)},")
        lines.append(f"    title: {js_string(title)},")
        lines.append(f"    explain: {js_string(explain)},")
        if diagram:
            lines.append(f"    example: {js_string(example)},")
            lines.append(f"    diagram: {js_string(diagram)}")
        else:
            lines.append(f"    example: {js_string(example)}")
        lines.append("  },")
    lines.append("};")
    return "\n".join(lines) + "\n"


def build_html(subject: str, meta: dict) -> str:
    rows = []
    for key, symbol, title, unit, _explain, _example, _diagram in meta["entries"]:
        rows.append(
            f"""                <button type="button" class="variable-row" data-eq="{key}" aria-label="Learn about {title}">
                    <div class="variable-symbol">{symbol}</div>
                    <div class="variable-desc">
                        <span class="variable-name">{title}</span>
                        <span class="variable-unit">{unit}</span>
                    </div>
                </button>"""
        )
    row_html = "\n".join(rows)
    rel = "../../"
    circuit_script = ""
    if meta.get("circuit_diagrams"):
        circuit_script = f'    <script src="{rel}assets/js/circuit-diagrams.js"></script>\n'
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{rel}assets/css/corporate.css">
    <script src="{rel}assets/js/site-layout.js" defer></script>
    <title>{meta["title"]} | Engineering Knowledge</title>
    <script type="text/javascript" async
        src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML">
    </script>
</head>
<body class="variable-ref-page variable-ref-page--equations">
    <div class="page-container page-container--narrow">
        <a href="{rel}index.html" class="back-link">&larr; Back to Hub</a>

        <div class="variable-ref variable-ref--equations">
            <h1>{meta["title"]}</h1>
            <p class="variable-hint">{meta["hint"]}</p>

            <div class="variable-list">
{row_html}
            </div>
        </div>
    </div>

    <div id="equationModal" class="var-modal" hidden>
        <div class="var-modal__backdrop"></div>
        <div class="var-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="eqModalTitle">
            <button type="button" class="var-modal__close" aria-label="Close">&times;</button>
            <div class="var-modal__symbol" id="eqModalSymbol"></div>
            <div class="var-modal__diagram" id="eqModalDiagram" hidden></div>
            <h2 id="eqModalTitle"></h2>
            <p class="var-modal__explain" id="eqModalExplain"></p>
            <div class="var-modal__example">
                <h3>Example</h3>
                <p id="eqModalExample"></p>
            </div>
        </div>
    </div>

{circuit_script}    <script src="{rel}assets/js/equation-details-{subject}.js" defer></script>
    <script src="{rel}assets/js/equation-ref-ui.js" defer></script>
</body>
</html>
"""


def main() -> None:
    for subject, meta in SUBJECTS.items():
        html_path = ROOT / meta["path"]
        html_path.parent.mkdir(parents=True, exist_ok=True)
        html_path.write_text(build_html(subject, meta), encoding="utf-8")
        js_path = ASSETS / f"equation-details-{subject}.js"
        js_path.write_text(build_details_js(meta["entries"]), encoding="utf-8")
        print(f"Wrote {html_path.relative_to(ROOT)} ({len(meta['entries'])} equations)")
        print(f"Wrote {js_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
