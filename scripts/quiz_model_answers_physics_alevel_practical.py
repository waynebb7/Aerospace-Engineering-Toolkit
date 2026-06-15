#!/usr/bin/env python3
"""Model answers for A-Level physics practical-template quiz checks."""
from __future__ import annotations

ALEVEL_PRACTICAL_PREFIX = "learn/physics/a-level/"

# Sourced from apply-topic-quiz-answers.py (filename -> answers).
_ALEVEL_PRACTICAL_BY_FILE: dict[str, list[str]] = {
    "thermal-physics.html": [
        r"The ideal gas law \(pV=nRT\) applies to gases behaving ideally (low density, high temperature relative to condensation point). The first law \(\Delta U=Q-W\) applies to a defined system with \(W\) as work done <em>by</em> the system. State which model you are using before substituting.",
        r"A common error is mixing °C with kelvin in gas-law calculations — \(T\) must be in kelvin. Another is confusing heat \(Q\) with temperature. Convert to SI and use absolute temperature before substitution.",
        r"\(Q=mc\Delta T\), where \(Q\) is heat energy transferred (J), \(m\) is mass (kg), \(c\) is specific heat capacity (J kg\(^{-1}\) K\(^{-1}\)), and \(\Delta T\) is temperature change (K).",
        r"For \(pV=nRT\), pressure in Pa and volume in m\(^3\) give energy-consistent units with \(R=8.31\) J mol\(^{-1}\) K\(^{-1}\). Using kPa with cm\(^3\) without conversion introduces powers-of-ten errors.",
        r"When measuring specific heat capacity, insulate the sample to reduce heat loss to surroundings, stir for even temperature, take repeat readings of temperature rise, and start timing when heating begins.",
        r"Check \(\Delta U=Q-W\) sign conventions match the question wording. For an ideal gas isothermal process, \(\Delta T=0\) implies \(\Delta U=0\) so \(Q=W\). Specific heat values should match tabulated orders of magnitude (e.g. water \(c\approx4200\) J kg\(^{-1}\) K\(^{-1}\)).",
    ],
    "capacitors.html": [
        r"Capacitance \(C=Q/V\) defines the charge–voltage relation for a given capacitor geometry. Discharge \(Q=Q_0 e^{-t/RC}\) applies to an RC circuit with constant \(R\) and \(C\). State whether the capacitor is charging or discharging before using the exponential form.",
        r"Students often forget that \(Q\) on a capacitor refers to charge on one plate, or use mF/µF inconsistently with seconds and ohms in the time constant \(\tau=RC\). Convert all units to SI before finding \(\tau\).",
        r"\(E=\frac{1}{2}CV^2\), where \(E\) is energy stored (J), \(C\) is capacitance (F), and \(V\) is potential difference across the capacitor (V).",
        r"\(\tau=RC\) requires \(R\) in ohms and \(C\) in farads to give time in seconds. Mixing µF with k\(\Omega\) without converting produces time constants wrong by \(10^9\).",
        r"Measure voltage at regular time intervals during discharge, keep circuit connections stable, discharge through a fixed resistor, and repeat the run to check the exponential trend is consistent.",
        r"After one time constant, voltage should fall to \(\approx37\%\) of \(V_0\). Stored energy should be positive and scale as \(V^2\). If \(Q\) increases while discharging, sign or circuit polarity has been misapplied.",
    ],
    "vectors-in-physics.html": [
        r"Resolve vectors into perpendicular components before adding them. Relative velocity \(\vec{v}_{A/B}=\vec{v}_A-\vec{v}_B\) applies in a chosen inertial frame with consistent direction conventions stated first.",
        r"A common error is adding magnitudes directly when vectors are not collinear — \(|\vec{A}+\vec{B}|\neq|\vec{A}|+|\vec{B}|\) in general. Resolve into components, add components, then find resultant magnitude.",
        r"\(|\vec{A}|=\sqrt{A_x^2+A_y^2}\), where \(A_x\) and \(A_y\) are perpendicular components (same units as the vector, e.g. m s\(^{-1}\) for velocity).",
        r"Component values must use the same unit in each axis (e.g. both m s\(^{-1}\)). Mixing km h\(^{-1}\) with m s\(^{-1}\) in \(A_x\) and \(A_y\) gives a meaningless resultant magnitude.",
        r"When finding a resultant force experimentally, repeat spring-balance or force-meter readings, ensure forces act in a defined plane, and zero instruments before each measurement.",
        r"Check the resultant direction lies between the component directions for non-opposing vectors. For forces in equilibrium, the vector sum should be \(\approx\vec{0}\) within experimental uncertainty.",
    ],
    "nuclear-physics.html": [
        r"Exponential decay \(N=N_0 e^{-\lambda t}\) assumes a large number of nuclei and constant decay probability per nucleus. Half-life \(T_{1/2}=\ln 2/\lambda\) is valid for this random decay model.",
        r"Students confuse activity \(A\) (decays per second, Bq) with the number of nuclei \(N\), or use minutes for \(t\) while \(\lambda\) is in s\(^{-1}\). Convert time to seconds before substitution.",
        r"\(A=\lambda N\), where \(A\) is activity (Bq), \(\lambda\) is decay constant (s\(^{-1}\)), and \(N\) is the number of undecayed nuclei.",
        r"Activity is measured in becquerels (s\(^{-1}\)). If \(\lambda\) is in yr\(^{-1}\) but \(t\) is in seconds, the exponent \(\lambda t\) will be wrong by orders of magnitude.",
        r"Use a fixed source–detector geometry, repeat count-rate measurements, subtract background count rate, and keep counting time long enough to reduce percentage uncertainty.",
        r"After one half-life, activity should halve. Activity should decrease over time, never increase for a single isotope. Check \(A=\lambda N\) is consistent with tabulated half-life values.",
    ],
    "particle-physics-intro.html": [
        r"The relativistic energy–momentum relation \(E^2=(pc)^2+(mc^2)^2\) applies to individual particles. Conservation laws (charge, baryon number, lepton number) must hold in every allowed interaction — state which laws you are checking.",
        r"A common error is treating kinetic energy as \(\frac{1}{2}mv^2\) for particles moving near the speed of light. Use relativistic relations when \(v\) is an appreciable fraction of \(c\).",
        r"\(E^2=(pc)^2+(mc^2)^2\), where \(E\) is total energy (J), \(p\) is momentum (kg m s\(^{-1}\)), \(m\) is rest mass (kg), and \(c\) is the speed of light (m s\(^{-1}\)).",
        r"Mass–energy calculations require SI units. Rest energy \(mc^2\) in joules uses kg for mass. Mixing MeV with SI units without conversion causes scale errors.",
        r"In particle-track analysis, calibrate detector scale from known references, measure track curvature consistently, and account for energy loss in the medium before inferring momentum.",
        r"Check conserved quantities balance on both sides of a reaction. Total charge, baryon number, and lepton number should each sum to the same value before and after. Annihilation products must include both particle and antiparticle where required.",
    ],
    "mathematical-methods-physics.html": [
        r"Kinematic relations \(v=\mathrm{d}x/\mathrm{d}t\) and \(a=\mathrm{d}^2x/\mathrm{d}t^2\) apply when \(x(t)\) is differentiable. Linearisation \(\log y=n\log x+\log k\) applies when a power law \(y=kx^n\) is assumed.",
        r"Rounding too early in multi-step differentiation or gradient calculations distorts final values. Keep extra significant figures through intermediate steps and round only at the end.",
        r"\(y=mx+c\), where \(y\) is the dependent variable, \(m\) is gradient (change in \(y\) per unit \(x\)), \(x\) is the independent variable, and \(c\) is the intercept.",
        r"Gradient calculations require consistent units on both axes (e.g. m s\(^{-1}\) on \(y\) vs s on \(x\) gives gradient in m s\(^{-2}\)). Mixing axis units invalidates the physical meaning of \(m\).",
        r"When finding a gradient from a graph, use a large triangle spanning multiple data points, read axes accurately, and repeat the gradient estimate from different point pairs.",
        r"Differentiated velocity should have units one power of time below displacement (e.g. m s\(^{-1}\) from \(x\) in m). A power-law gradient \(n\) from \(\log\)-\(\log\) plots should be constant across the fitted range.",
    ],
    "mechanics-a-level.html": [
        r"SUVAT equations apply only for <strong>constant acceleration</strong> along a straight line. Newton's second law \(\sum\vec{F}=m\vec{a}\) applies in an inertial frame with net force causing acceleration in the same direction as \(\vec{a}\).",
        r"Students often use SUVAT when acceleration is not constant, or omit the negative sign when decelerating. Define positive direction first and keep signs consistent for \(u\), \(v\), \(a\), and \(s\).",
        r"\(v=u+at\), where \(v\) is final velocity (m s\(^{-1}\)), \(u\) is initial velocity (m s\(^{-1}\)), \(a\) is acceleration (m s\(^{-2}\)), and \(t\) is time (s).",
        r"SUVAT requires metres, seconds, and m s\(^{-1}\)/m s\(^{-2}\). Using km h\(^{-1}\) for \(u\) without converting to m s\(^{-1}\) gives answers wrong by roughly a factor of 3.6 squared in energy terms.",
        r"In dynamics experiments, repeat timing measurements, minimise friction where possible, keep release height consistent, and use light gates or video analysis for more reliable velocity data.",
        r"Check \(v^2=u^2+2as\) gives positive \(v^2\) for real motion. For free fall near Earth, \(a\approx9.8\) m s\(^{-2}\). Momentum and energy answers should be consistent with the same sign convention.",
    ],
    "circular-motion.html": [
        r"Centripetal acceleration \(a_c=v^2/r\) points toward the centre of the circle. It applies when speed \(v\) is instantaneous tangential speed and \(r\) is radius of the circular path. Identify which real force provides the centripetal force.",
        r"Students confuse centripetal force with a separate 'outward' force. Only real forces (tension, friction, gravity components) provide \(F_c=mv^2/r\) inward — there is no centrifugal force in the rotating frame analysis at A-Level.",
        r"\(F_c=\frac{mv^2}{r}\), where \(F_c\) is centripetal force (N), \(m\) is mass (kg), \(v\) is speed (m s\(^{-1}\)), and \(r\) is radius (m).",
        r"Radius must be in metres. Using cm for \(r\) makes required force wrong by \(10^4\). Speed must be tangential speed, not angular speed — convert using \(v=\omega r\) if needed.",
        r"When measuring centripetal force practically (e.g. whirling bung), repeat timing for several revolutions, measure radius to the centre of mass of the object, and keep the plane of motion horizontal.",
        r"Centripetal force magnitude should increase with \(v^2\) and decrease with \(r\). Direction must point toward the centre. For a conical pendulum, resolve tension to confirm \(T\sin\theta=mv^2/r\).",
    ],
    "electric-fields.html": [
        r"Coulomb's law applies to point charges in vacuum (or uniform medium with permittivity). \(E=F/q\) defines field at a point using a small test charge. \(E=V/d\) applies only to a <strong>uniform</strong> field between parallel plates.",
        r"Students use \(E=V/d\) for radial fields around a point charge, or forget that force direction depends on charge sign (attraction vs repulsion). State whether the field is uniform before choosing the equation.",
        r"\(F=\frac{1}{4\pi\varepsilon_0}\frac{Qq}{r^2}\), where \(F\) is force (N), \(Q\) and \(q\) are charges (C), \(r\) is separation (m), and \(\varepsilon_0\) is permittivity of free space.",
        r"Charge in coulombs and distance in metres give force in newtons. Using cm for \(r\) in Coulomb's law changes force by \(10^4\). Field strength from \(E=V/d\) needs \(d\) in metres and \(V\) in volts.",
        r"In field-mapping experiments, keep electrode geometry fixed, avoid moisture on plates, repeat potential readings, and ensure the probe does not disturb the field being measured.",
        r"Like charges repel, unlike charges attract. Field lines point from positive to negative. For a uniform field, \(E\) should be constant between parallel plates; \(F=qE\) direction follows test charge sign.",
    ],
    "simple-harmonic-motion.html": [
        r"SHM requires acceleration proportional to displacement and directed toward equilibrium: \(a=-\omega^2 x\). The sinusoidal solution \(x=A\cos(\omega t+\phi)\) applies when damping is negligible and amplitude is small enough for the restoring model.",
        r"Students forget the negative sign in \(a=-\omega^2 x\), or confuse angular frequency \(\omega\) (rad s\(^{-1}\)) with frequency \(f\) (Hz). Use \(T=2\pi/\omega\) and \(\omega=2\pi f\) consistently.",
        r"\(a=-\omega^2 x\), where \(a\) is acceleration (m s\(^{-2}\)), \(\omega\) is angular frequency (rad s\(^{-1}\)), and \(x\) is displacement from equilibrium (m).",
        r"Displacement and amplitude must be in metres, \(\omega\) in rad s\(^{-1}\), giving acceleration in m s\(^{-2}\). Using degrees instead of radians in \(\cos(\omega t)\) breaks the phase calculation.",
        r"Measure period from multiple complete oscillations and divide by the number of cycles, minimise friction at the pivot, keep amplitude small for a mass–spring system, and repeat timing.",
        r"Maximum speed occurs at \(x=0\) and equals \(\omega A\). Maximum acceleration magnitude is \(\omega^2 A\) at the extremes. Period should be independent of amplitude for ideal SHM.",
    ],
    "alternating-current.html": [
        r"RMS values \(V_{\mathrm{rms}}=V_0/\sqrt{2}\) apply to sinusoidal AC. Impedance \(Z=\sqrt{R^2+(X_L-X_C)^2}\) applies to series LCR circuits in steady-state sinusoidal conditions with consistent reactance at the driving frequency.",
        r"Students use peak voltage where RMS is required for power, or add reactances arithmetically without phasor awareness. State whether a value is peak or RMS before calculating power.",
        r"\(V_{\mathrm{rms}}=\frac{V_0}{\sqrt{2}}\), where \(V_{\mathrm{rms}}\) is root-mean-square voltage (V) and \(V_0\) is peak voltage (V) for a sinusoidal waveform.",
        r"Reactance \(X_L=\omega L\) needs \(\omega\) in rad s\(^{-1}\) and \(L\) in henry to give ohms. Mixing kHz with mH without SI conversion gives impedance wrong by powers of ten.",
        r"Use an oscilloscope to measure peak-to-peak voltage accurately, average over several cycles for frequency, and keep circuit connections tight to reduce contact resistance in AC measurements.",
        r"For a resistor, \(V_{\mathrm{rms}}/I_{\mathrm{rms}}\approx R\). At resonance in a series LCR circuit, impedance should equal \(R\) and be minimum. Power delivered should be non-negative and largest near resonance.",
    ],
    "optics.html": [
        r"Snell's law \(n_1\sin\theta_1=n_2\sin\theta_2\) applies at a smooth boundary between media with real refractive indices. The lens equation \(1/f=1/u+1/v\) uses sign conventions stated in the question (real is positive for many A-Level conventions).",
        r"Students mix up incidence and refraction angles (both measured from the normal), or apply the lens equation without the correct sign convention for \(u\) and \(v\). Draw a ray diagram first.",
        r"\(n_1\sin\theta_1=n_2\sin\theta_2\), where \(n_1,n_2\) are refractive indices (dimensionless), and \(\theta_1,\theta_2\) are angles to the normal in each medium.",
        r"Angles must be in degrees or radians consistently within the sine function — calculators in degree mode for geometry problems. Refractive index is dimensionless; only ratios of speeds matter in \(n=c/v\).",
        r"Pin optics apparatus securely, repeat image distance measurements, use a darkened room for sharp images, and measure object and image distances from the lens centre.",
        r"Light bends toward the normal when entering a denser medium (\(n_2>n_1\)). Magnification should be consistent with image size ratio. For total internal reflection, check \(\theta_i>\theta_c\) where \(\sin\theta_c=n_2/n_1\).",
    ],
    "astrophysics-a-level.html": [
        r"The inverse-square flux law \(F=L/(4\pi d^2)\) applies when radiation spreads isotropically from a source. Stefan–Boltzmann \(L=4\pi R^2\sigma T^4\) assumes a black-body radiator. State which stellar approximation you are using.",
        r"Students confuse flux \(F\) (W m\(^{-2}\) at observer) with luminosity \(L\) (total power emitted), or use parsecs for \(d\) without converting to metres in SI-based calculations.",
        r"\(F=\frac{L}{4\pi d^2}\), where \(F\) is observed flux (W m\(^{-2}\)), \(L\) is luminosity (W), and \(d\) is distance to the source (m).",
        r"Distance must be in metres for SI consistency with \(L\) in watts. Using astronomical units without converting gives flux wrong by enormous factors. Temperature in Wien's law must be in kelvin.",
        r"Calibrate telescope/spectrometer data against known standard stars, subtract background sky brightness, and repeat photometry measurements across multiple wavelengths.",
        r"Flux decreases with \(d^2\). Hotter stars peak at shorter wavelengths (Wien's law). Main-sequence stars should have luminosity and temperature consistent with Hertzsprung–Russell diagram position.",
    ],
    "practical-skills.html": [
        r"Percentage uncertainty \(\Delta x/x\times100\%\) applies to a directly measured quantity. Percentage uncertainties add for multiplied/divided combinations (\(z=xy\) or \(z=x/y\)); absolute uncertainties add for added/subtracted combinations.",
        r"Students round intermediate values too early, losing precision in propagated uncertainty. Keep extra significant figures until the final reported value and quote uncertainty to one significant figure (or two if leading digit is 1).",
        r"\(\frac{\Delta z}{z}\approx\frac{\Delta x}{x}+\frac{\Delta y}{y}\) for \(z=xy\) or \(z=x/y\), where \(\Delta x,\Delta y\) are absolute uncertainties in measured quantities.",
        r"Uncertainty propagation is dimensionless in percentage form — both \(\Delta x/x\) and \(\Delta y/y\) must use the same units as \(x\) and \(y\) before forming the ratio.",
        r"Repeat measurements to reduce random uncertainty, calibrate instruments before use, control environmental variables, and tabulate raw data with units before processing.",
        r"Report final values with justified significant figures matching uncertainty (e.g. \(g=9.81\pm0.02\) m s\(^{-2}\)). Percentage uncertainty should not be quoted to unrealistic precision. Identify whether random or systematic errors dominate.",
    ],
    "waves-a-level.html": [
        r"The wave equation \(v=f\lambda\) applies to a continuous wave of fixed frequency in a uniform medium. Phase difference \(\Delta\phi=2\pi\Delta x/\lambda\) applies to coherent waves of the same frequency.",
        r"Students confuse path difference with phase difference (multiply by \(2\pi/\lambda\)), or use cm for \(\lambda\) with m s\(^{-1}\) for \(v\). Convert all lengths to metres before substitution.",
        r"\(v=f\lambda\), where \(v\) is wave speed (m s\(^{-1}\)), \(f\) is frequency (Hz), and \(\lambda\) is wavelength (m).",
        r"Frequency in hertz and wavelength in metres give speed in m s\(^{-1}\). Using kHz with mm for \(\lambda\) without conversion produces speeds wrong by \(10^6\).",
        r"Use a steady signal generator, measure wavelength from several antinodes/nodes to average, keep string tension constant in standing-wave experiments, and repeat frequency settings.",
        r"For standing waves, \(f=n v/(2L)\) for harmonics on a string fixed at both ends. Intensity \(\propto A^2\) — doubling amplitude quadruples intensity. Path difference of \(\lambda\) gives phase difference \(2\pi\) (constructive for appropriate boundary conditions).",
    ],
    "magnetic-fields.html": [
        r"Force on a wire \(F=BIL\sin\theta\) applies when current \(I\) flows in uniform flux density \(B\) over length \(L\), with \(\theta\) the angle between current and field. Charge motion \(F=Bqv\sin\theta\) applies to perpendicular components in uniform fields.",
        r"Students apply \(F=BIL\) when the wire is parallel to the field (\(\sin\theta=0\)), or use the left-hand rule inconsistently with electron flow vs conventional current. State angle and current direction.",
        r"\(F=BIL\sin\theta\), where \(F\) is force (N), \(B\) is magnetic flux density (T), \(I\) is current (A), \(L\) is wire length in the field (m), and \(\theta\) is angle between current and \(B\).",
        r"Flux density in tesla, current in amps, length in metres give force in newtons. Using cm for \(L\) makes force wrong by 100. Velocity in \(F=Bqv\) must be in m s\(^{-1}\).",
        r"Keep the wire segment length in the field uniform, repeat balance/readings for force on a current wire, zero the balance with no current, and reverse current to confirm force direction reverses.",
        r"Force direction is perpendicular to both current and field (Fleming's left-hand rule). Circular motion radius \(r=mv/(Bq)\) should decrease if \(B\) increases. Parallel current and field give zero magnetic force.",
    ],
    "electromagnetic-induction.html": [
        r"Faraday's law \(\mathcal{E}=-\mathrm{d}(N\Phi)/\mathrm{d}t\) applies when flux linkage changes. The negative sign is Lenz's law (induced effects oppose the change). Transformer ratio \(V_s/V_p=N_s/N_p\) applies to ideal transformers with negligible flux loss.",
        r"Students omit the negative sign in Faraday's law, or use changing area without accounting for \(\cos\theta\) in \(\Phi=BA\cos\theta\). State what is changing — \(B\), \(A\), \(\theta\), or \(N\).",
        r"\(\Phi=BA\cos\theta\), where \(\Phi\) is magnetic flux (Wb), \(B\) is flux density (T), \(A\) is area (m\(^2\)), and \(\theta\) is angle between \(\vec{B}\) and the area normal.",
        r"Flux in webers requires tesla × m\(^2\). Using cm\(^2\) for area without converting makes flux and induced emf wrong by \(10^4\). Emf in volts from \(\mathrm{d}\Phi/\mathrm{d}t\) needs seconds in the denominator.",
        r"Move the magnet at constant speed through a coil for repeatable emf traces, keep coil turns fixed, repeat induced voltage readings for different flux change rates, and account for meter loading.",
        r"Induced current opposes the flux change (Lenz's law). Magnitude of emf increases with faster flux change. Step-up transformers have \(N_s>N_p\); power ideally conserved so higher voltage means lower secondary current.",
    ],
    "materials.html": [
        r"Hooke's law \(E=\sigma/\varepsilon\) applies in the <strong>linear elastic</strong> region — stress is proportional to strain and the material returns to its original shape when unloaded. Plastic deformation begins once the limit of proportionality is exceeded.",
        r"Students confuse stress (Pa) with force (N), or strain (dimensionless) with extension in metres. Another error is using diameter in mm without converting when finding area \(A=\pi d^2/4\).",
        r"\(E=\sigma/\varepsilon\), where \(E\) is Young's modulus (Pa), \(\sigma=F/A\) is stress (Pa), and \(\varepsilon=\Delta L/L\) is strain (dimensionless).",
        r"Stress requires force in newtons and area in m\(^2\) to give pascals. Using mm for wire diameter without converting to metres makes \(A\) wrong by \(10^6\) and \(E\) wrong by the same factor.",
        r"When finding Young's modulus, measure original length with a micrometer, apply several loads and repeat extension readings, keep wire temperature stable, and average over multiple trials.",
        r"Check \(E\) matches tabulated values for the material (e.g. copper \(\sim1.1\)–\(1.3\times10^{11}\) Pa). A stress–strain graph should be linear in the elastic region; gradient gives \(E\) and should be consistent with your calculated value.",
    ],
}

PHYSICS_ALEVEL_PRACTICAL_MODEL_ANSWERS: dict[str, list[str]] = {
    ALEVEL_PRACTICAL_PREFIX + filename: answers
    for filename, answers in _ALEVEL_PRACTICAL_BY_FILE.items()
}
