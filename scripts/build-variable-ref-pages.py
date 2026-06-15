#!/usr/bin/env python3
"""Generate subject variable reference pages and detail scripts."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets" / "js"
REF = ROOT / "reference"

SUBJECTS = {
    "physics": {
        "title": "Physics Variables",
        "hint": "Tap any physics symbol for an explanation and worked example.",
        "path": "reference/physics/variables.html",
        "entries": [
            ("F", r"\( F \)", "Force", "(Newtons, N)",
             "Force is a vector quantity that causes acceleration or deformation. Newton's second law links net force to mass and acceleration.",
             r"A 2 kg object accelerating at 3 m/s\(^2\):<br>\( F = ma = 2 \times 3 = 6 \text{ N} \)."),
            ("m", r"\( m \)", "Mass", "(Kilograms, kg)",
             "Mass measures the quantity of matter in an object and its inertia — resistance to changes in motion. It is a scalar quantity in SI.",
             r"A book with mass \( m = 1.5 \text{ kg} \) on a table has weight \( W = mg = 1.5 \times 9.8 \approx 14.7 \text{ N} \)."),
            ("a", r"\( a \)", "Acceleration", "(Metres per second squared, m/s\(^2\))",
             "Acceleration is the rate of change of velocity. It can be constant (SUVAT problems) or instantaneous (calculus).",
             r"A car increases speed from 10 m/s to 22 m/s in 4 s:<br>\( a = \dfrac{v - u}{t} = \dfrac{22 - 10}{4} = 3 \text{ m/s}^2 \)."),
            ("v", r"\( v \)", "Velocity", "(Metres per second, m/s)",
             "Velocity is the rate of change of displacement, including direction. Speed is the magnitude of velocity.",
             r"A cyclist travels 150 m north in 30 s:<br>\( v = \dfrac{s}{t} = \dfrac{150}{30} = 5 \text{ m/s} \) north."),
            ("u", r"\( u \)", "Initial Velocity", "(Metres per second, m/s)",
             "Initial velocity \( u \) is the velocity at the start of an interval, used in kinematic (SUVAT) equations.",
             r"Using \( v = u + at \) with \( u = 5 \text{ m/s} \), \( a = 2 \text{ m/s}^2 \), \( t = 3 \text{ s} \):<br>\( v = 5 + 2 \times 3 = 11 \text{ m/s} \)."),
            ("s", r"\( s \)", "Displacement", "(Metres, m)",
             "Displacement is the straight-line distance and direction from start to finish. It differs from distance travelled when the path is not straight.",
             r"A particle moves 3 m east then 4 m north. Displacement magnitude:<br>\( s = \sqrt{3^2 + 4^2} = 5 \text{ m} \)."),
            ("t", r"\( t \)", "Time", "(Seconds, s)",
             "Time measures the duration of an event or interval. SI base unit is the second.",
             r"Free fall from rest for 2 s near Earth (\( g = 9.8 \text{ m/s}^2 \)):<br>\( s = \tfrac{1}{2}gt^2 = \tfrac{1}{2} \times 9.8 \times 4 = 19.6 \text{ m} \)."),
            ("p", r"\( p \)", "Momentum", "(Kilogram metres per second, kg m/s)",
             "Momentum is mass times velocity: \( p = mv \). In closed systems, total momentum is conserved.",
             r"A 0.05 kg tennis ball at 40 m/s has momentum:<br>\( p = mv = 0.05 \times 40 = 2.0 \text{ kg m/s} \)."),
            ("W", r"\( W \)", "Work Done", "(Joules, J)",
             "Work is energy transferred by a force acting through a displacement: \( W = Fs\cos\theta \). One joule equals one newton-metre.",
             r"Pushing a box with 20 N through 3 m (\( \theta = 0° \)):<br>\( W = Fs = 20 \times 3 = 60 \text{ J} \)."),
            ("Ek", r"\( E_k \)", "Kinetic Energy", "(Joules, J)",
             "Kinetic energy is energy of motion: \( E_k = \tfrac{1}{2}mv^2 \).",
             r"A 1200 kg car at 20 m/s:<br>\( E_k = \tfrac{1}{2} \times 1200 \times 20^2 = 240{,}000 \text{ J} \) (240 kJ)."),
            ("Ep", r"\( E_p \)", "Gravitational Potential Energy", "(Joules, J)",
             "Gravitational PE near Earth's surface: \( E_p = mgh \), where \( h \) is height above a chosen reference level.",
             r"A 2 kg mass raised 5 m:<br>\( E_p = mgh = 2 \times 9.8 \times 5 = 98 \text{ J} \)."),
            ("P", r"\( P \)", "Mechanical Power", "(Watts, W)",
             "Power is the rate of doing work or transferring energy: \( P = W/t = Fv \) (when force and velocity are aligned).",
             r"A motor lifts 500 J of energy in 2 s:<br>\( P = \dfrac{W}{t} = \dfrac{500}{2} = 250 \text{ W} \)."),
            ("g", r"\( g \)", "Gravitational Field Strength", "(Metres per second squared, m/s\(^2\))",
             "Near Earth's surface, \( g \approx 9.8 \text{ m/s}^2 \). Weight is \( W = mg \).",
             r"An object of mass 10 kg:<br>\( W = mg = 10 \times 9.8 = 98 \text{ N} \)."),
            ("rho", r"\( \rho \)", "Density", "(Kilograms per cubic metre, kg/m\(^3\))",
             "Density is mass per unit volume: \( \rho = m/V \). Used in flotation, pressure, and material identification.",
             r"Aluminium has \( \rho \approx 2700 \text{ kg/m}^3 \). A block of volume 0.002 m\(^3\):<br>\( m = \rho V = 2700 \times 0.002 = 5.4 \text{ kg} \)."),
            ("pressure", r"\( p \)", "Pressure", "(Pascals, Pa)",
             "Pressure is force per unit area: \( p = F/A \). 1 Pa = 1 N/m\(^2\).",
             r"A 600 N force on an area of 0.05 m\(^2\):<br>\( p = \dfrac{F}{A} = \dfrac{600}{0.05} = 12{,}000 \text{ Pa} \) (12 kPa)."),
            ("Q", r"\( Q \)", "Heat Energy Transferred", "(Joules, J)",
             "Heat \( Q \) is energy transferred due to a temperature difference. In calorimetry, \( Q = mc\Delta T \).",
             r"Heating 0.5 kg of water (\( c = 4200 \text{ J kg}^{-1}\text{K}^{-1} \)) by 20 K:<br>\( Q = mc\Delta T = 0.5 \times 4200 \times 20 = 42{,}000 \text{ J} \)."),
            ("c_wave", r"\( c \)", "Wave Speed", "(Metres per second, m/s)",
             "Wave speed relates frequency and wavelength: \( c = f\lambda \) (or \( v = f\lambda \) for mechanical waves).",
             r"Sound at 440 Hz with wavelength 0.78 m:<br>\( c = f\lambda = 440 \times 0.78 \approx 343 \text{ m/s} \)."),
            ("f", r"\( f \)", "Frequency", "(Hertz, Hz)",
             "Frequency is the number of cycles per second. Period \( T = 1/f \).",
             r"A pendulum completes one swing every 2 s:<br>\( f = \dfrac{1}{T} = \dfrac{1}{2} = 0.5 \text{ Hz} \)."),
            ("lambda", r"\( \lambda \)", "Wavelength", "(Metres, m)",
             "Wavelength is the distance between consecutive identical points on a wave (e.g. crest to crest).",
             r"Radio wave at 100 MHz (\( f = 10^8 \text{ Hz} \)) with \( c = 3 \times 10^8 \text{ m/s} \):<br>\( \lambda = \dfrac{c}{f} = 3 \text{ m} \)."),
            ("T", r"\( T \)", "Period", "(Seconds, s)",
             "Period is the time for one complete oscillation or cycle: \( T = 1/f \).",
             r"A 50 Hz AC supply has period:<br>\( T = \dfrac{1}{50} = 0.02 \text{ s} \) (20 ms)."),
            ("mu", r"\( \mu \)", "Coefficient of Friction", "(Unitless)",
             "The coefficient of friction \( \mu \) relates friction force to normal reaction: \( F_f = \mu R \) (limiting friction).",
             r"A 10 N block on a surface with \( \mu = 0.4 \) and normal reaction 10 N:<br>\( F_f = \mu R = 0.4 \times 10 = 4 \text{ N} \)."),
            ("sigma", r"\( \sigma \)", "Stress", "(Pascals, Pa)",
             "Stress is force per unit area within a material: \( \sigma = F/A \). Used in materials and structural engineering.",
             r"A wire of cross-section \( 2 \times 10^{-6} \text{ m}^2 \) under 40 N tension:<br>\( \sigma = \dfrac{F}{A} = \dfrac{40}{2 \times 10^{-6}} = 20 \text{ MPa} \)."),
            ("E_young", r"\( E \)", "Young's Modulus", "(Pascals, Pa)",
             "Young's modulus measures stiffness in the elastic region: \( E = \sigma / \varepsilon \), where strain \( \varepsilon = \Delta L / L \).",
             r"If stress \( \sigma = 200 \text{ MPa} \) produces strain \( \varepsilon = 0.001 \):<br>\( E = \dfrac{\sigma}{\varepsilon} = \dfrac{200 \times 10^6}{0.001} = 200 \text{ GPa} \)."),
            ("n", r"\( n \)", "Refractive Index", "(Unitless)",
             "Refractive index \( n = c/v \) compares light speed in vacuum to speed in a medium. Snell's law: \( n_1\sin\theta_1 = n_2\sin\theta_2 \).",
             r"Light enters glass (\( n = 1.5 \)) from air (\( n \approx 1 \)) at \( 30° \):<br>\( \sin\theta_2 = \dfrac{n_1\sin 30°}{n_2} = \dfrac{0.5}{1.5} \approx 0.333 \)."),
            ("B", r"\( B \)", "Magnetic Flux Density", "(Tesla, T)",
             "Magnetic flux density \( B \) describes the strength and direction of a magnetic field. Force on a wire: \( F = BIL\sin\theta \).",
             r"A 2 A current in a 0.5 m wire perpendicular to \( B = 0.4 \text{ T} \):<br>\( F = BIL = 0.4 \times 2 \times 0.5 = 0.4 \text{ N} \)."),
            ("phi", r"\( \Phi \)", "Magnetic Flux", "(Webers, Wb)",
             "Magnetic flux \( \Phi = BA\cos\theta \). Faraday's law links changing flux to induced emf.",
             r"A coil of area 0.02 m\(^2\) in \( B = 0.5 \text{ T} \) with field normal to the plane:<br>\( \Phi = BA = 0.5 \times 0.02 = 0.01 \text{ Wb} \)."),
            ("e", r"\( e \)", "Elementary Charge", "(Coulombs, C)",
             "The elementary charge \( e \approx 1.60 \times 10^{-19} \text{ C} \) is the magnitude of charge on a proton or electron.",
             r"One microcoulomb contains about \( N = Q/e = 10^{-6} / (1.6 \times 10^{-19}) \approx 6 \times 10^{12} \) elementary charges."),
            ("h", r"\( h \)", "Planck Constant", "(Joule seconds, J s)",
             "Planck's constant \( h \approx 6.63 \times 10^{-34} \text{ J s} \) links photon energy to frequency: \( E = hf \).",
             r"Green light at \( f = 5.5 \times 10^{14} \text{ Hz} \):<br>\( E = hf = 6.63 \times 10^{-34} \times 5.5 \times 10^{14} \approx 3.6 \times 10^{-19} \text{ J} \approx 2.3 \text{ eV} \)."),
        ],
    },
    "mathematics": {
        "title": "Mathematics Variables",
        "hint": "Tap any mathematical symbol for an explanation and worked example.",
        "path": "reference/mathematics/variables.html",
        "entries": [
            ("x", r"\( x \)", "Independent Variable", "(Context-dependent units)",
             "In calculus and graphs, \( x \) is often the independent variable — the input you choose or control.",
             r"For \( y = 2x + 3 \), when \( x = 4 \):<br>\( y = 2(4) + 3 = 11 \)."),
            ("y", r"\( y \)", "Dependent Variable", "(Context-dependent units)",
             "The dependent variable \( y \) is determined by the function or equation — the output you calculate.",
             r"If \( y = x^2 \) and \( x = 5 \), then \( y = 25 \)."),
            ("m", r"\( m \)", "Gradient (Slope)", "(Unitless or rate units)",
             "In \( y = mx + c \), gradient \( m \) is the change in \( y \) per unit change in \( x \).",
             r"Line through (0, 2) and (4, 10):<br>\( m = \dfrac{10 - 2}{4 - 0} = 2 \)."),
            ("c_int", r"\( c \)", "Y-Intercept", "(Same units as \( y \))",
             "The y-intercept \( c \) is where the line crosses the \( y \)-axis (when \( x = 0 \)).",
             r"For \( y = 2x + 3 \), the y-intercept is \( c = 3 \)."),
            ("dydx", r"\( \dfrac{dy}{dx} \)", "First Derivative", "(Rate of change units)",
             "The derivative measures the instantaneous rate of change of \( y \) with respect to \( x \).",
             r"If \( y = x^3 \), then \( \dfrac{dy}{dx} = 3x^2 \). At \( x = 2 \):<br>\( \dfrac{dy}{dx} = 12 \)."),
            ("d2ydx2", r"\( \dfrac{d^2y}{dx^2} \)", "Second Derivative", "(Rate of change of rate)",
             "The second derivative describes curvature and acceleration of the function — whether the slope is increasing or decreasing.",
             r"If \( y = x^3 \), \( \dfrac{d^2y}{dx^2} = 6x \). At \( x = 1 \):<br>\( \dfrac{d^2y}{dx^2} = 6 \)."),
            ("integral", r"\( \int \)", "Integral", "(Area or accumulation units)",
             "The definite integral accumulates a quantity — often area under a curve — between limits \( a \) and \( b \).",
             r"\( \displaystyle\int_0^2 3x\,dx = \left[\tfrac{3x^2}{2}\right]_0^2 = 6 \)."),
            ("limit", r"\( \lim \)", "Limit", "(Approaching a value)",
             "A limit describes the value a function approaches as the input approaches some point — essential for defining derivatives.",
             r"\( \displaystyle\lim_{x \to 0} \dfrac{\sin x}{x} = 1 \)."),
            ("sum", r"\( \sum \)", "Summation", "(Sum of terms)",
             "Sigma notation compactly adds a sequence of terms indexed by an integer variable.",
             r"\( \displaystyle\sum_{k=1}^{4} k = 1 + 2 + 3 + 4 = 10 \)."),
            ("theta", r"\( \theta \)", "Angle", "(Radians or degrees)",
             "Theta often denotes an angle. Calculus and trigonometry typically use radians unless stated otherwise.",
             r"In a right triangle with opposite 3 and hypotenuse 5:<br>\( \sin\theta = \tfrac{3}{5} = 0.6 \)."),
            ("pi", r"\( \pi \)", "Pi", "(Unitless)",
             "Pi is the ratio of a circle's circumference to its diameter, approximately 3.14159.",
             r"Circle radius 5 cm: circumference \( C = 2\pi r = 2\pi \times 5 \approx 31.4 \text{ cm} \)."),
            ("e_euler", r"\( e \)", "Euler's Number", "(Unitless)",
             "Euler's number \( e \approx 2.718 \) is the base of natural logarithms and appears in exponential growth and decay.",
             r"Continuous growth at rate 5% per year: \( A = P e^{0.05t} \). After 10 years, \( A = P e^{0.5} \approx 1.65P \)."),
            ("i_imag", r"\( i \)", "Imaginary Unit", "(Unitless)",
             "The imaginary unit satisfies \( i^2 = -1 \). Complex numbers have form \( a + bi \).",
             r"\( (3 + 2i) + (1 - 4i) = 4 - 2i \)."),
            ("abs", r"\( |x| \)", "Modulus (Absolute Value)", "(Same units as \( x \))",
             "The modulus gives the non-negative magnitude of a real number or the magnitude of a complex number.",
             r"\( | -7 | = 7 \). For complex \( z = 3 + 4i \):<br>\( |z| = \sqrt{3^2 + 4^2} = 5 \)."),
            ("log", r"\( \log \)", "Logarithm (Base 10)", "(Unitless)",
             "Common logarithm: \( \log_{10}(x) \). Used in decibel scales and orders of magnitude.",
             r"If \( \log_{10}(x) = 3 \), then \( x = 10^3 = 1000 \)."),
            ("ln", r"\( \ln \)", "Natural Logarithm", "(Unitless)",
             "Natural log is logarithm base \( e \): \( \ln(x) = \log_e(x) \). Inverse of the exponential function.",
             r"\( \ln(e^3) = 3 \). Also \( \dfrac{d}{dx}\ln x = \dfrac{1}{x} \)."),
            ("sin", r"\( \sin \)", "Sine", "(Unitless ratio)",
             "Sine of angle \( \theta \) in a right triangle is opposite/hypotenuse. Extends to all angles via the unit circle.",
             r"\( \sin(30°) = 0.5 \). In radians, \( \sin(\pi/6) = 0.5 \)."),
            ("cos", r"\( \cos \)", "Cosine", "(Unitless ratio)",
             "Cosine is adjacent/hypotenuse in a right triangle. Used in projections and AC phase relationships.",
             r"\( \cos(60°) = 0.5 \). Identity: \( \sin^2\theta + \cos^2\theta = 1 \)."),
            ("tan", r"\( \tan \)", "Tangent", "(Unitless ratio)",
             "Tangent is opposite/adjacent, or \( \tan\theta = \sin\theta / \cos\theta \).",
             r"\( \tan(45°) = 1 \). For \( \theta = 45° \), opposite equals adjacent."),
            ("matrix_A", r"\( A \)", "Matrix", "(Entries depend on context)",
             "A matrix is a rectangular array of numbers. Linear systems use \( A\mathbf{x} = \mathbf{b} \).",
             r"\( A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \) has determinant \( \det(A) = 1 \times 4 - 2 \times 3 = -2 \)."),
            ("det", r"\( \det \)", "Determinant", "(Unitless for square matrices)",
             "The determinant of a 2×2 matrix \( \begin{pmatrix} a & b \\ c & d \end{pmatrix} \) is \( ad - bc \). Zero determinant means no unique inverse.",
             r"\( \det\begin{pmatrix} 2 & 1 \\ 4 & 3 \end{pmatrix} = 2 \times 3 - 1 \times 4 = 2 \)."),
            ("eigenvalue", r"\( \lambda \)", "Eigenvalue", "(Same units as linear operator scale)",
             "An eigenvalue \( \lambda \) satisfies \( A\mathbf{v} = \lambda\mathbf{v} \) for a non-zero eigenvector \( \mathbf{v} \).",
             r"For \( A = \begin{pmatrix} 2 & 0 \\ 0 & 3 \end{pmatrix} \), eigenvalues are \( \lambda = 2 \) and \( \lambda = 3 \)."),
            ("nabla", r"\( \nabla \)", "Del (Nabla Operator)", "(Per-unit-length)",
             "In vector calculus, \( \nabla f \) is the gradient of a scalar field — pointing in the direction of steepest increase.",
             r"If \( f(x,y) = x^2 + y^2 \), then \( \nabla f = (2x, 2y) \). At (1, 2): \( \nabla f = (2, 4) \)."),
            ("partial", r"\( \partial \)", "Partial Derivative", "(Rate with respect to one variable)",
             "Partial derivatives hold other variables fixed: \( \partial f / \partial x \) measures change in \( f \) as \( x \) varies.",
             r"If \( f(x,y) = xy \), then \( \dfrac{\partial f}{\partial x} = y \) and \( \dfrac{\partial f}{\partial y} = x \)."),
            ("nCr", r"\( \binom{n}{r} \)", "Binomial Coefficient", "(Count of combinations)",
             "Counts ways to choose \( r \) items from \( n \) without order: \( \binom{n}{r} = \dfrac{n!}{r!(n-r)!} \).",
             r"\( \binom{5}{2} = \dfrac{5!}{2! \cdot 3!} = 10 \) ways to choose 2 from 5."),
        ],
    },
    "quantum": {
        "title": "Quantum Variables",
        "hint": "Tap any quantum symbol for an explanation and worked example.",
        "path": "reference/quantum/variables.html",
        "entries": [
            ("psi", r"\( |\psi\rangle \)", "State Vector (Ket)", "(Normalised vector in Hilbert space)",
             "A pure quantum state is represented by a ket \( |\psi\rangle \). Measurement probabilities come from amplitudes squared.",
             r"A qubit \( |\psi\rangle = \tfrac{1}{\sqrt{2}}(|0\rangle + |1\rangle) \) gives \( P(0) = P(1) = \tfrac{1}{2} \)."),
            ("hbar", r"\( \hbar \)", "Reduced Planck Constant", "(Joule seconds, J s)",
             "H-bar \( \hbar = h / (2\pi) \approx 1.055 \times 10^{-34} \text{ J s} \) appears in commutation relations and the Schrödinger equation.",
             r"Energy-time relation scale: \( \Delta E \Delta t \gtrsim \hbar/2 \) (order-of-magnitude uncertainty principle)."),
            ("alpha", r"\( \alpha \)", "Qubit Amplitude for \( |0\rangle \)", "(Complex number)",
             "A single qubit is written \( |\psi\rangle = \alpha|0\rangle + \beta|1\rangle \) with \( |\alpha|^2 + |\beta|^2 = 1 \).",
             r"If \( \alpha = 0.6 \) (real) and normalised, \( |\alpha|^2 = 0.36 \) so \( P(0) = 0.36 \)."),
            ("beta", r"\( \beta \)", "Qubit Amplitude for \( |1\rangle \)", "(Complex number)",
             "The amplitude \( \beta \) on \( |1\rangle \) satisfies \( |\beta|^2 = 1 - |\alpha|^2 \) for a pure state.",
             r"If \( |\alpha|^2 = 0.36 \), then \( |\beta|^2 = 0.64 \) and \( |\beta| = 0.8 \)."),
            ("ket0", r"\( |0\rangle \)", "Computational Zero State", "(Basis vector)",
             "The computational basis state \( |0\rangle \) is an eigenstate of the Pauli Z operator with eigenvalue +1.",
             r"Measuring \( |0\rangle \) in the Z basis gives outcome 0 with certainty."),
            ("ket1", r"\( |1\rangle \)", "Computational One State", "(Basis vector)",
             "The state \( |1\rangle \) is the other computational basis vector, orthogonal to \( |0\rangle \).",
             r"The Hadamard gate maps \( |0\rangle \to |+\rangle = \tfrac{1}{\sqrt{2}}(|0\rangle + |1\rangle) \)."),
            ("unitary", r"\( U \)", "Unitary Operator", "(Matrix with \( U^\dagger U = I \))",
             "Unitary operators describe reversible quantum gates — they preserve total probability.",
             r"Pauli X: \( X|0\rangle = |1\rangle \), \( X|1\rangle = |0\rangle \) (bit flip)."),
            ("rho", r"\( \rho \)", "Density Matrix", "(Positive operator, trace 1)",
             "The density matrix describes mixed and pure states. For pure \( |\psi\rangle \), \( \rho = |\psi\rangle\langle\psi| \).",
             r"Completely mixed qubit: \( \rho = \tfrac{1}{2}(|0\rangle\langle 0| + |1\rangle\langle 1|) = \tfrac{I}{2} \)."),
            ("entropy", r"\( S \)", "Von Neumann Entropy", "(Bits or nats)",
             "Quantum entropy \( S(\rho) = -\mathrm{Tr}(\rho \log_2 \rho) \) measures mixedness. Pure states have \( S = 0 \).",
             r"Maximally mixed qubit has \( S = 1 \) bit."),
            ("pauli_x", r"\( X \)", "Pauli X Gate", "(Unitary 2×2 matrix)",
             "Pauli X is the quantum NOT gate — it swaps \( |0\rangle \) and \( |1\rangle \).",
             r"\( X = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix} \). Applied to \( |+\rangle \): \( X|+\rangle = |+\rangle \)."),
            ("pauli_z", r"\( Z \)", "Pauli Z Gate", "(Unitary 2×2 matrix)",
             "Pauli Z applies a phase flip on \( |1\rangle \): \( Z|1\rangle = -|1\rangle \), leaves \( |0\rangle \) unchanged.",
             r"\( Z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix} \)."),
            ("hadamard", r"\( H \)", "Hadamard Gate", "(Unitary 2×2 matrix)",
             "Hadamard creates superposition: \( H|0\rangle = |+\rangle \), \( H|1\rangle = |-\rangle \).",
             r"\( H = \tfrac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix} \). Note \( H^2 = I \)."),
            ("cnot", r"\( \mathrm{CNOT} \)", "Controlled-NOT Gate", "(Two-qubit gate)",
             "CNOT flips the target qubit if the control is \( |1\rangle \). Creates entanglement from superposition.",
             r"\( \mathrm{CNOT}|00\rangle = |00\rangle \), \( \mathrm{CNOT}|10\rangle = |11\rangle \)."),
            ("omega", r"\( \omega \)", "Angular Frequency", "(Radians per second, rad/s)",
             "In quantum mechanics, energy often relates to angular frequency: \( E = \hbar\omega \).",
             r"If \( \omega = 2\pi \times 10^{15} \text{ rad/s} \):<br>\( E = \hbar\omega \approx 1.055 \times 10^{-34} \times 2\pi \times 10^{15} \approx 6.6 \times 10^{-19} \text{ J} \)."),
            ("energy", r"\( E \)", "Energy", "(Joules, J, or electronvolts, eV)",
             "Energy eigenvalues label stationary states. Photon energy \( E = h\nu = \hbar\omega \).",
             r"Photon at 500 THz: \( E = h\nu \approx 6.63 \times 10^{-34} \times 5 \times 10^{14} \approx 3.3 \times 10^{-19} \text{ J} \approx 2.1 \text{ eV} \)."),
            ("delta_x", r"\( \Delta x \)", "Position Uncertainty", "(Metres, m)",
             "Standard deviation of position measurements for a quantum state. Pairs with momentum uncertainty in the uncertainty principle.",
             r"Gaussian wave packet with \( \Delta x = 1 \text{ nm} \) implies \( \Delta p \gtrsim \hbar / (2\Delta x) \approx 5 \times 10^{-26} \text{ kg m/s} \)."),
            ("fidelity", r"\( F \)", "State Fidelity", "(Unitless, 0 to 1)",
             "Fidelity measures overlap between states: for pure states \( |\psi\rangle, |\phi\rangle \), \( F = |\langle\psi|\phi\rangle|^2 \).",
             r"If \( |\psi\rangle = |0\rangle \) and \( |\phi\rangle = |+\rangle \):<br>\( F = |\langle 0|+\rangle|^2 = \tfrac{1}{2} \)."),
            ("bell", r"\( |\Phi^+\rangle \)", "Bell State", "(Entangled two-qubit state)",
             "Bell states are maximally entangled. \( |\Phi^+\rangle = \tfrac{1}{\sqrt{2}}(|00\rangle + |11\rangle) \) is a common resource for teleportation.",
             r"Measuring either qubit of \( |\Phi^+\rangle \) in Z yields perfectly correlated 0/0 or 1/1 outcomes."),
        ],
    },
}


def js_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def build_details_js(subject: str, entries: list) -> str:
    lines = ["window.VARIABLE_REF_DETAILS = {"]
    for key, symbol, title, _unit, explain, example in entries:
        lines.append(f"  {js_string(key)}: {{")
        lines.append(f"    symbol: {js_string(symbol)},")
        lines.append(f"    title: {js_string(title)},")
        lines.append(f"    explain: {js_string(explain)},")
        lines.append(f"    example: {js_string(example)}")
        lines.append("  },")
    lines.append("};")
    return "\n".join(lines) + "\n"


def build_html(subject: str, meta: dict) -> str:
    rows = []
    for key, symbol, title, unit, _explain, _example in meta["entries"]:
        rows.append(
            f"""                <button type="button" class="variable-row" data-var="{key}" aria-label="Learn about {title}">
                    <div class="variable-symbol">{symbol}</div>
                    <div class="variable-desc">
                        <span class="variable-name">{title}</span>
                        <span class="variable-unit">{unit}</span>
                    </div>
                </button>"""
        )
    row_html = "\n".join(rows)
    rel = "../../"
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
<body class="variable-ref-page">
    <div class="page-container page-container--narrow">
        <a href="{rel}index.html" class="back-link">&larr; Back to Hub</a>

        <div class="variable-ref">
            <h1>{meta["title"]}</h1>
            <p class="variable-hint">{meta["hint"]}</p>

            <div class="variable-list">
{row_html}
            </div>
        </div>
    </div>

    <div id="variableModal" class="var-modal" hidden>
        <div class="var-modal__backdrop"></div>
        <div class="var-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <button type="button" class="var-modal__close" aria-label="Close">&times;</button>
            <div class="var-modal__symbol" id="modalSymbol"></div>
            <h2 id="modalTitle"></h2>
            <p class="var-modal__explain" id="modalExplain"></p>
            <div class="var-modal__example">
                <h3>Example</h3>
                <p id="modalExample"></p>
            </div>
        </div>
    </div>

    <script src="{rel}assets/js/variable-details-{subject}.js" defer></script>
    <script src="{rel}assets/js/variable-ref-ui.js" defer></script>
</body>
</html>
"""


def main() -> None:
    for subject, meta in SUBJECTS.items():
        html_path = ROOT / meta["path"]
        html_path.parent.mkdir(parents=True, exist_ok=True)
        html_path.write_text(build_html(subject, meta), encoding="utf-8")
        js_path = ASSETS / f"variable-details-{subject}.js"
        js_path.write_text(build_details_js(subject, meta["entries"]), encoding="utf-8")
        print(f"Wrote {html_path.relative_to(ROOT)} ({len(meta['entries'])} variables)")
        print(f"Wrote {js_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
