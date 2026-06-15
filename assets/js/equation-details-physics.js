window.EQUATION_REF_DETAILS = {
  "newton2": {
    symbol: "\\( F = ma \\)",
    title: "Newton's Second Law",
    explain: "Net force equals mass times acceleration. The direction of \\( \\mathbf{F} \\) matches the acceleration.",
    example: "A 4 kg block accelerates at 2.5 m/s\\(^2\\):<br>\\( F = 4 \\times 2.5 = 10 \\text{ N} \\)."
  },
  "suvat_v": {
    symbol: "\\( v = u + at \\)",
    title: "SUVAT: Final Velocity",
    explain: "Constant-acceleration kinematics linking initial velocity, acceleration, and time.",
    example: "\\( u = 5 \\text{ m/s} \\), \\( a = 2 \\text{ m/s}^2 \\), \\( t = 4 \\text{ s} \\):<br>\\( v = 5 + 2 \\times 4 = 13 \\text{ m/s} \\)."
  },
  "suvat_s": {
    symbol: "\\( s = ut + \\tfrac{1}{2}at^2 \\)",
    title: "SUVAT: Displacement",
    explain: "Displacement from rest or motion with constant acceleration over time.",
    example: "\\( u = 0 \\), \\( a = 3 \\text{ m/s}^2 \\), \\( t = 2 \\text{ s} \\):<br>\\( s = 0 + \\tfrac{1}{2} \\times 3 \\times 2^2 = 6 \\text{ m} \\)."
  },
  "suvat_v2": {
    symbol: "\\( v^2 = u^2 + 2as \\)",
    title: "SUVAT: Velocity and Displacement",
    explain: "Links velocity change to displacement when time is unknown.",
    example: "\\( u = 10 \\text{ m/s} \\), \\( a = -2 \\text{ m/s}^2 \\), \\( s = 24 \\text{ m} \\):<br>\\( v^2 = 100 + 2(-2)(24) = 4 \\Rightarrow v = 2 \\text{ m/s} \\)."
  },
  "weight": {
    symbol: "\\( W = mg \\)",
    title: "Weight",
    explain: "Weight is the gravitational force on mass \\( m \\). Near Earth's surface, \\( g \\approx 9.8 \\text{ m/s}^2 \\).",
    example: "A 70 kg person:<br>\\( W = 70 \\times 9.8 = 686 \\text{ N} \\)."
  },
  "momentum": {
    symbol: "\\( p = mv \\)",
    title: "Linear Momentum",
    explain: "Momentum is mass times velocity. Conserved in closed systems with no external impulse.",
    example: "A 0.15 kg ball at 20 m/s:<br>\\( p = 0.15 \\times 20 = 3 \\text{ kg m/s} \\)."
  },
  "impulse": {
    symbol: "\\( F\\Delta t = \\Delta p \\)",
    title: "Impulse–Momentum Theorem",
    explain: "Impulse from a force over time equals the change in momentum.",
    example: "A 0.5 kg cart changes velocity by 4 m/s:<br>\\( F\\Delta t = \\Delta p = 0.5 \\times 4 = 2 \\text{ N s} \\)."
  },
  "kinetic": {
    symbol: "\\( E_k = \\tfrac{1}{2}mv^2 \\)",
    title: "Kinetic Energy",
    explain: "Energy of motion. Doubling speed quadruples kinetic energy.",
    example: "\\( m = 2 \\text{ kg} \\), \\( v = 6 \\text{ m/s} \\):<br>\\( E_k = \\tfrac{1}{2} \\times 2 \\times 6^2 = 36 \\text{ J} \\)."
  },
  "gpe": {
    symbol: "\\( E_p = mgh \\)",
    title: "Gravitational Potential Energy",
    explain: "Energy stored due to height \\( h \\) in a uniform field. Reference level for \\( h \\) is chosen by convention.",
    example: "\\( m = 5 \\text{ kg} \\), \\( g = 9.8 \\), \\( h = 3 \\text{ m} \\):<br>\\( E_p = 5 \\times 9.8 \\times 3 = 147 \\text{ J} \\)."
  },
  "power": {
    symbol: "\\( P = \\dfrac{W}{t} \\)",
    title: "Mechanical Power",
    explain: "Power is the rate of energy transfer or work done. Also \\( P = Fv \\) when force and velocity align.",
    example: "300 J of work in 5 s:<br>\\( P = \\dfrac{300}{5} = 60 \\text{ W} \\)."
  },
  "pressure": {
    symbol: "\\( p = \\dfrac{F}{A} \\)",
    title: "Pressure",
    explain: "Pressure is force per unit area. 1 Pa = 1 N/m\\(^2\\).",
    example: "A force of 200 N on 0.04 m\\(^2\\):<br>\\( p = \\dfrac{200}{0.04} = 5{,}000 \\text{ Pa} \\)."
  },
  "density": {
    symbol: "\\( \\rho = \\dfrac{m}{V} \\)",
    title: "Density",
    explain: "Mass per unit volume. Used in flotation, pressure in fluids, and material identification.",
    example: "\\( m = 540 \\text{ g} = 0.54 \\text{ kg} \\), \\( V = 0.0002 \\text{ m}^3 \\):<br>\\( \\rho = \\dfrac{0.54}{0.0002} = 2{,}700 \\text{ kg/m}^3 \\) (aluminium)."
  },
  "wave": {
    symbol: "\\( v = f\\lambda \\)",
    title: "Wave Equation",
    explain: "Wave speed equals frequency times wavelength. Applies to sound, light, and water waves.",
    example: "\\( f = 440 \\text{ Hz} \\), \\( \\lambda = 0.78 \\text{ m} \\):<br>\\( v = 440 \\times 0.78 \\approx 343 \\text{ m/s} \\)."
  },
  "hookes": {
    symbol: "\\( F = kx \\)",
    title: "Hooke's Law",
    explain: "Elastic extension \\( x \\) is proportional to applied force in the linear region. \\( k \\) is the spring constant.",
    example: "\\( k = 200 \\text{ N/m} \\), extension 0.03 m:<br>\\( F = 200 \\times 0.03 = 6 \\text{ N} \\)."
  },
  "youngs": {
    symbol: "\\( E = \\dfrac{\\sigma}{\\varepsilon} \\)",
    title: "Young's Modulus",
    explain: "Stiffness in the elastic region: stress \\( \\sigma = F/A \\) over strain \\( \\varepsilon = \\Delta L/L \\).",
    example: "Stress \\( 2 \\times 10^8 \\text{ Pa} \\), strain 0.001:<br>\\( E = \\dfrac{2 \\times 10^8}{0.001} = 2 \\times 10^{11} \\text{ Pa} \\)."
  },
  "snell": {
    symbol: "\\( n_1\\sin\\theta_1 = n_2\\sin\\theta_2 \\)",
    title: "Snell's Law",
    explain: "Relates angles of incidence and refraction at a boundary between two media.",
    example: "Air (\\( n_1 = 1.0 \\)) to glass (\\( n_2 = 1.5 \\)), \\( \\theta_1 = 30° \\):<br>\\( \\sin\\theta_2 = \\dfrac{1.0 \\times \\sin 30°}{1.5} = \\tfrac{1}{3} \\Rightarrow \\theta_2 \\approx 19.5° \\)."
  },
  "motor_effect": {
    symbol: "\\( F = BIL\\sin\\theta \\)",
    title: "Magnetic Force on a Conductor",
    explain: "Force on a current-carrying wire in magnetic flux density \\( B \\). Maximum when wire is perpendicular to \\( B \\).",
    example: "\\( B = 0.4 \\text{ T} \\), \\( I = 5 \\text{ A} \\), \\( L = 0.2 \\text{ m} \\), \\( \\sin\\theta = 1 \\):<br>\\( F = 0.4 \\times 5 \\times 0.2 = 0.4 \\text{ N} \\)."
  },
  "faraday": {
    symbol: "\\( \\varepsilon = -\\dfrac{\\Delta\\Phi}{\\Delta t} \\)",
    title: "Faraday's Law (Magnitude)",
    explain: "Induced emf equals the rate of change of magnetic flux. The minus sign (Lenz's law) gives direction.",
    example: "Flux changes by 0.012 Wb in 0.03 s:<br>\\( |\\varepsilon| = \\dfrac{0.012}{0.03} = 0.4 \\text{ V} \\)."
  },
  "photon": {
    symbol: "\\( E = hf \\)",
    title: "Photon Energy",
    explain: "Energy of a photon is Planck's constant times frequency. Also \\( E = hc/\\lambda \\) for light.",
    example: "Green light \\( f = 5.5 \\times 10^{14} \\text{ Hz} \\):<br>\\( E = 6.63 \\times 10^{-34} \\times 5.5 \\times 10^{14} \\approx 3.6 \\times 10^{-19} \\text{ J} \\)."
  },
  "ideal_gas": {
    symbol: "\\( pV = nRT \\)",
    title: "Ideal Gas Law",
    explain: "Links pressure, volume, amount of substance \\( n \\), and temperature \\( T \\). \\( R = 8.31 \\text{ J mol}^{-1}\\text{K}^{-1} \\).",
    example: "\\( n = 2 \\text{ mol} \\), \\( T = 300 \\text{ K} \\), \\( V = 0.05 \\text{ m}^3 \\):<br>\\( p = \\dfrac{2 \\times 8.31 \\times 300}{0.05} \\approx 99{,}720 \\text{ Pa} \\)."
  },
};
