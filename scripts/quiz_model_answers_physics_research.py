#!/usr/bin/env python3
"""Model answers for research-template physics quizzes and A-Level quantum topics."""
from __future__ import annotations

# Shared Q2–Q6 answers (indices 1–5) for all 23 research-template physics pages.
RESEARCH_METHODOLOGY_ANSWERS: list[str] = [
    r"Compare characteristic timescales, lengths, and energies before trusting a reduced model. If a relaxation or equilibration timescale is much shorter than the driving timescale, quasi-steady or equilibrium approximations are justified; if not, transients dominate and steady-state formulas mislead. Identify the controlling dimensionless groups (e.g. signal-to-noise, inertial-to-dissipative, nonlinear-to-linear ratio) to map when a simplified model sits in a valid regime.",
    r"Sensitivity analysis recomputes the result with optimistic and conservative choices of priors or parameters (Section 5, Step 3). If the scientific conclusion flips sign or order of magnitude, the claim is prior-sensitive and must be reported with that dependence explicit. Without this check, a single parameter set can look definitive while the inference is fragile.",
    r"<strong>Statistical uncertainty</strong> arises from finite data and stochastic fluctuations (shot noise, sample variance, Monte Carlo error); it typically shrinks with more data. <strong>Systematic uncertainty</strong> comes from calibration errors, model-form bias, background subtraction, instrument response, or unvalidated assumptions — it does not automatically average away. Report which dominates in each regime.",
    r"Run synthetic-data validation before analysing real measurements: inject known parameters through the full pipeline and verify recovery. Combine this with version-controlled assumptions, fixed random seeds, deterministic preprocessing, and regenerable figures so every plot can be reproduced from source and configuration.",
    r"<strong>Misconception:</strong> a better fit always means a better physical model. <strong>Corrective habit:</strong> inspect residual structure, out-of-sample behaviour, and whether extra parameters only chase noise — goodness of fit must be weighed against parsimony and domain validity.",
]

PHYSICS_RESEARCH_Q1: dict[str, str] = {
    "learn/physics/frontier/black-hole-physics.html": (
        r"\(r_s=2GM/c^2\) is the Schwarzschild radius: the spherical radius at which the escape speed equals \(c\), defining the event horizon for a non-rotating, uncharged black hole. "
        r"Assumption: asymptotically flat, spherically symmetric vacuum solution of GR. "
        r"\(T_H=\hbar c^3/(8\pi G M k_B)\) is the Hawking temperature — the effective black-body temperature of horizon radiation. "
        r"Assumption: semiclassical limit (quantum fields on a fixed classical spacetime) with \(M\) large enough that back-reaction is negligible. "
        r"\(S_{BH}=k_B A/(4\ell_P^2)\) is the Bekenstein–Hawking entropy, proportional to horizon area in Planck units. "
        r"Assumption: horizon area is well defined and quantum gravity enters only through the Planck-area scale."
    ),
    "learn/physics/frontier/computational-relativity.html": (
        r"\(\partial_t u=\mathcal{N}(u)\) is the semidiscrete time-evolution law for a relativistic field or constraint system. "
        r"Assumption: the state \(u\) lies in a function space where \(\mathcal{N}\) is well posed (stable boundary conditions and gauge choice fixed). "
        r"\(C_{\mathrm{Ham}}=0\) is the Hamiltonian constraint of the 3+1 split — the equation that initial data must satisfy to generate a physical spacetime. "
        r"Assumption: ADM or related hyperbolic formulation with consistent matter sources. "
        r"\(\Delta t\le C\Delta x\) is a CFL stability bound linking timestep to grid spacing for explicit integrators. "
        r"Assumption: hyperbolic principal part with bounded characteristic speeds on the mesh."
    ),
    "learn/physics/frontier/dark-energy.html": (
        r"\(w=p/\rho\) is the dark-energy equation-of-state parameter relating pressure to energy density. "
        r"Assumption: stress-energy is that of a perfect homogeneous fluid (isotropic pressure). "
        r"\(H^2(z)=H_0^2[\Omega_m(1+z)^3+\Omega_{DE}(1+z)^{3(1+w)}+\cdots]\) gives the Friedmann expansion rate as a function of redshift. "
        r"Assumption: spatially flat or specified-curvature FLRW cosmology with slowly varying or constant \(w\). "
        r"\(\mu=5\log_{10}(d_L/10\,\mathrm{pc})\) is the distance modulus used to compare luminosity distances from supernova or standard-candle data. "
        r"Assumption: \(d_L\) from a cosmological model and negligible line-of-sight extinction."
    ),
    "learn/physics/frontier/dark-matter.html": (
        r"\(R\propto\frac{\rho_0}{m_\chi}\int_{v_{\min}}^\infty \frac{f(v)}{v}\,dv\) scales the WIMP direct-detection event rate with local halo density \(\rho_0\), particle mass \(m_\chi\), and the velocity distribution above threshold. "
        r"Assumption: specified halo model (e.g. Maxwellian \(f(v)\)) and elastic, non-relativistic scattering. "
        r"\(\Omega_\chi h^2\approx 0.12\) is the cosmological dark-matter density parameter inferred from CMB and large-scale structure. "
        r"Assumption: \(\Lambda\)CDM framework with standard thermal relic abundance calculation. "
        r"\(E_R=\frac{\mu_{\chi N}^2 v^2}{m_N}(1-\cos\theta)\) is the nuclear recoil energy in a detector. "
        r"Assumption: two-body elastic collision in the lab frame with known reduced mass \(\mu_{\chi N}\)."
    ),
    "learn/physics/frontier/early-universe.html": (
        r"\(\ddot{a}>0\) indicates accelerated expansion (or deceleration when negative) of the scale factor. "
        r"Assumption: homogeneous isotropic FRW metric with scalar factor \(a(t)\). "
        r"\(P_\zeta(k)=A_s(k/k_*)^{n_s-1}\) is the primordial curvature power spectrum from inflation. "
        r"Assumption: single-field slow-roll inflation producing nearly scale-invariant adiabatic perturbations. "
        r"\(\eta_B=(n_B-n_{\bar B})/n_\gamma\) is the baryon asymmetry per CMB photon. "
        r"Assumption: standard Big Bang nucleosynthesis and known photon number density today."
    ),
    "learn/physics/frontier/fusion-physics.html": (
        r"\(nT\tau_E\) is the Lawson product (density \(\times\) temperature \(\times\) energy confinement time) used as an ignition/breakeven figure of merit. "
        r"Assumption: quasi-steady magnetically or inertially confined plasma with D–T as the dominant channel. "
        r"\(P_{\mathrm{fus}}\propto n_D n_T \langle\sigma v\rangle E_{\mathrm{fusion}}\) gives fusion power from reactant densities and the thermally averaged cross section. "
        r"Assumption: Maxwellian ion distributions and negligible fuel dilution by impurities. "
        r"\(Q=P_{\mathrm{fusion}}/P_{\mathrm{heating}}\) is the gain — fusion power divided by heating power. "
        r"Assumption: sustained operation where both powers are measurable steady averages."
    ),
    "learn/physics/frontier/high-energy-density-physics.html": (
        r"\(P\sim \rho u_s u_p\) scales dynamic pressure in shock compression (mass density times shock and particle speeds). "
        r"Assumption: strong planar shock with negligible radiative preheat and steady shock structure. "
        r"\(\Gamma_1=(\partial\ln P/\partial\ln\rho)_s\) is the first adiabatic exponent (logarithmic stiffness of the EOS at constant entropy). "
        r"Assumption: equilibrium equation of state along an adiabat. "
        r"\(E=\int C_V\,dT\) relates internal energy to heat capacity integrated along a thermodynamic path. "
        r"Assumption: well-defined calorimetric \(C_V(T)\) and slow compression relative to equilibration."
    ),
    "learn/physics/frontier/loop-quantum-gravity.html": (
        r"\(\hat{A}\,|j\rangle=8\pi\gamma\ell_P^2\sqrt{j(j+1)}\,|j\rangle\) gives area eigenvalues on spin-network links labelled by spin \(j\). "
        r"Assumption: loop representation with Barbero–Immirzi parameter \(\gamma\) fixed. "
        r"\(\hat{V}|\Gamma,j,i\rangle=V_{\Gamma,j,i}|\Gamma,j,i\rangle\) is the volume operator eigenvalue on a fixed spin-network graph. "
        r"Assumption: chosen graph \(\Gamma\) and intertwiner labels diagonalise the volume operator. "
        r"\(\{A^i_a,E^b_j\}=8\pi G\gamma\,\delta^b_a\delta^i_j\) is the canonical Poisson bracket in connection–triad variables. "
        r"Assumption: Ashtekar–Barbero symplectic structure without matter couplings shown."
    ),
    "learn/physics/frontier/nonlinear-dynamics.html": (
        r"\(\dot{x}=f(x,\mu)\) is an autonomous dynamical system: state \(x\) evolving with parameter \(\mu\). "
        r"Assumption: \(f\) is smooth and the phase space is completely specified. "
        r"\(\lambda=\lim_{t\to\infty}\frac{1}{t}\ln\frac{\|\delta x(t)\|}{\|\delta x(0)\|}\) is a Lyapunov exponent measuring exponential sensitivity to initial conditions. "
        r"Assumption: trajectory is chaotic and the time average exists. "
        r"\(x_{n+1}=rx_n(1-x_n)\) is the logistic map — discrete-time population dynamics with growth parameter \(r\). "
        r"Assumption: one-dimensional state and no explicit time dependence (autonomous iteration)."
    ),
    "learn/physics/frontier/numerical-relativity.html": (
        r"\(\partial_t \mathbf{U}+\nabla\cdot \mathbf{F}(\mathbf{U})=\mathbf{S}(\mathbf{U})\) is a hyperbolic conservation system with sources (mass–momentum–stress evolution). "
        r"Assumption: finite-volume discretisation with consistent numerical fluxes. "
        r"\(\mathcal{H}=0,\;\mathcal{M}_i=0\) are the Hamiltonian and momentum constraints of GR. "
        r"Assumption: constraint-damped formulation so constraints remain bounded during evolution. "
        r"\(\|e\|\propto (\Delta x)^p\) states discretisation error convergence with mesh spacing \(\Delta x\) and scheme order \(p\). "
        r"Assumption: smooth solution and stable numerical scheme in the tested regime."
    ),
    "learn/physics/frontier/string-theory.html": (
        r"\(S\sim -\frac{1}{2\pi\alpha'}\int d^2\sigma \sqrt{-h}\,h^{ab}\partial_a X^\mu\partial_b X_\mu\) is the string worldsheet action (Nambu–Goto / Polyakov form). "
        r"Assumption: perturbative closed/open string propagating in a fixed target spacetime. "
        r"\(M^2\sim (N+\tilde N-a)/\alpha'\) gives open-string mass-squared levels from left/right oscillator numbers. "
        r"Assumption: light-cone or covariant quantisation with GSO projection (constant \(a\) sets sector). "
        r"\(g_s=e^{\langle\Phi\rangle}\) relates string coupling to the dilaton vacuum expectation value. "
        r"Assumption: weak coupling \(g_s\ll 1\) so perturbation theory in genus is valid."
    ),
    "learn/physics/postgraduate/accelerator-physics.html": (
        r"\(x''+K(s)x=0\) is Hill's equation for transverse betatron oscillations with focusing strength \(K(s)\) along path length \(s\). "
        r"Assumption: linear optics and small-amplitude motion in a periodic lattice. "
        r"\(\sigma_x=\sqrt{\beta_x \epsilon_x}\) gives the RMS horizontal beam size from the beta function and emittance. "
        r"Assumption: Gaussian beam distribution with uncorrelated phase-space moments. "
        r"\(\mathcal{L}=\frac{N_1N_2 f_{\mathrm{rev}} n_b}{4\pi\sigma_x\sigma_y}\) is the collider luminosity (collision rate per unit cross section). "
        r"Assumption: head-on Gaussian beams with revolution frequency \(f_{\mathrm{rev}}\) and bunch factor \(n_b\)."
    ),
    "learn/physics/postgraduate/advanced-electrodynamics.html": (
        r"\(\partial_\mu F^{\mu\nu}=\mu_0 J^\nu\) is Maxwell's inhomogeneous equation linking field divergence/curl sources to four-current. "
        r"Assumption: classical continuum limit with well-defined \(J^\nu\). "
        r"\(\Box A^\mu=\mu_0 J^\mu\) is the wave equation for the four-potential in Lorenz gauge. "
        r"Assumption: Lorenz gauge \(\partial_\mu A^\mu=0\) and retarded boundary conditions. "
        r"\(P=\frac{q^2 a^2}{6\pi\epsilon_0 c^3}\) is the Larmor power radiated by an accelerating point charge. "
        r"Assumption: non-relativistic or mildly relativistic motion with negligible radiation reaction."
    ),
    "learn/physics/postgraduate/atomic-molecular-optical.html": (
        r"\(i\hbar\dot{c}_e=\frac{\hbar\Omega}{2}c_g\) is the optical Bloch/Rabi equation coupling ground amplitude \(c_g\) to excited \(c_e\) at Rabi frequency \(\Omega\). "
        r"Assumption: two-level atom, rotating-wave approximation, classical driving field. "
        r"\(\Delta E=\hbar\omega\) matches a transition energy to photon energy at angular frequency \(\omega\). "
        r"Assumption: resonant or near-resonant monochromatic field and dipole selection rules. "
        r"\(\Gamma_{\mathrm{sc}}=\frac{\Gamma}{2}\frac{s_0}{1+s_0+4\Delta^2/\Gamma^2}\) is the steady-state scattering rate in saturation. "
        r"Assumption: optical Bloch equations at steady state with natural linewidth \(\Gamma\) and saturation \(s_0\)."
    ),
    "learn/physics/postgraduate/condensed-matter-theory.html": (
        r"\(H=-t\sum_{\langle ij\rangle} c_i^\dagger c_j+U\sum_i n_{i\uparrow}n_{i\downarrow}\) is the Hubbard model: nearest-neighbour hopping \(t\) plus on-site repulsion \(U\). "
        r"Assumption: tight-binding lattice with single orbital per site. "
        r"\(E(k)=-2t\cos ka\) is the 1D tight-binding band dispersion. "
        r"Assumption: infinite periodic lattice with nearest-neighbour hopping only. "
        r"\(\sigma_{xy}=\nu e^2/h\) is quantised Hall conductivity with integer (or fractional) \(\nu\). "
        r"Assumption: two-dimensional electron gas in a gapped many-body ground state (integer/fractional QHE regime)."
    ),
    "learn/physics/postgraduate/cosmology.html": (
        r"\(H^2=\frac{8\pi G}{3}\rho-\frac{k}{a^2}+\frac{\Lambda}{3}\) is the first Friedmann equation relating expansion rate to energy density, curvature \(k\), and \(\Lambda\). "
        r"Assumption: homogeneous isotropic FLRW metric. "
        r"\(1+z=a_0/a\) links cosmological redshift to the ratio of scale factors today and at emission. "
        r"Assumption: photon propagates through an expanding FLRW background. "
        r"\(\delta''+2H\delta'-4\pi G\rho_m\delta=0\) governs linear growth of matter density contrast \(\delta\). "
        r"Assumption: pressureless matter, Newtonian gauge, and \(|\delta|\ll 1\)."
    ),
    "learn/physics/postgraduate/general-relativity.html": (
        r"\(G_{\mu\nu}=\frac{8\pi G}{c^4}T_{\mu\nu}\) is Einstein's field equation: spacetime curvature sourced by stress-energy. "
        r"Assumption: classical GR with metric-compatible connection and specified \(T_{\mu\nu}\). "
        r"\(\frac{d^2x^\mu}{d\tau^2}+\Gamma^\mu_{\alpha\beta}\frac{dx^\alpha}{d\tau}\frac{dx^\beta}{d\tau}=0\) is the geodesic equation for free-fall trajectories. "
        r"Assumption: test particle (negligible self-gravity) with affine parameter \(\tau\). "
        r"\(ds^2=g_{\mu\nu}dx^\mu dx^\nu\) defines the invariant spacetime interval. "
        r"Assumption: differentiable Lorentzian manifold with chosen coordinate chart."
    ),
    "learn/physics/postgraduate/gravitational-physics.html": (
        r"\(F=Gm_1m_2/r^2\) is Newton's gravitational force between two masses. "
        r"Assumption: weak field, speeds \(\ll c\), point or spherically symmetric masses. "
        r"\(v_{\mathrm{esc}}=\sqrt{2GM/r}\) is escape speed at radius \(r\). "
        r"Assumption: spherically symmetric potential and test particle at rest at \(r\). "
        r"\(\Phi=-GM/r\) is the Newtonian gravitational potential. "
        r"Assumption: point mass and zero potential at infinity."
    ),
    "learn/physics/postgraduate/gravitational-waves.html": (
        r"\(h\sim\frac{2G}{c^4R}\ddot{Q}\) scales gravitational-wave strain from the quadrupole moment \(Q\) at distance \(R\). "
        r"Assumption: slow-motion, far-field (radiative) zone with dominant quadrupole emission. "
        r"\(f_{\mathrm{ISCO}}\approx\frac{c^3}{6^{3/2}\pi GM}\) estimates the innermost stable circular orbit frequency for a test body. "
        r"Assumption: Schwarzschild (or equatorial Kerr) geometry for a test particle. "
        r"\(\rho^2=4\int \frac{|\tilde{h}(f)|^2}{S_n(f)}\,df\) is the matched-filter signal-to-noise ratio. "
        r"Assumption: Gaussian stationary detector noise \(S_n(f)\) and optimal whitening/filtering."
    ),
    "learn/physics/postgraduate/magnetohydrodynamics.html": (
        r"\(\rho(\partial_t\mathbf{v}+\mathbf{v}\cdot\nabla\mathbf{v})=-\nabla p+\mathbf{J}\times\mathbf{B}\) is the MHD momentum equation for a conducting fluid. "
        r"Assumption: single-fluid MHD, negligible displacement current, isotropic pressure. "
        r"\(\partial_t\mathbf{B}=\nabla\times(\mathbf{v}\times\mathbf{B})+\eta\nabla^2\mathbf{B}\) is the induction equation with resistivity \(\eta\). "
        r"Assumption: Ohm's law \(\mathbf{E}+\mathbf{v}\times\mathbf{B}=\eta\mathbf{J}\) and \(\nabla\cdot\mathbf{B}=0\). "
        r"\(v_A=B/\sqrt{\mu_0\rho}\) is the Alfvén speed — characteristic MHD wave speed. "
        r"Assumption: uniform magnetic field \(B\) and mass density \(\rho\) over the scale considered."
    ),
    "learn/physics/postgraduate/particle-phenomenology.html": (
        r"\(\sigma=\frac{N_{\mathrm{obs}}-N_{\mathrm{bkg}}}{\mathcal{L}\epsilon}\) infers cross section from observed events minus background, integrated luminosity \(\mathcal{L}\), and efficiency \(\epsilon\). "
        r"Assumption: well-modelled acceptance, trigger efficiency, and background subtraction. "
        r"\(\mathcal{L}_{\mathrm{EFT}}=\mathcal{L}_{\mathrm{SM}}+\sum_i C_i\mathcal{O}_i/\Lambda^2\) adds higher-dimension operators to the Standard Model below scale \(\Lambda\). "
        r"Assumption: heavy new physics integrated out; \(\mathcal{O}_i\) are gauge-invariant dimension-6 operators. "
        r"\(Z=\sqrt{2((s+b)\ln(1+s/b)-s)}\) converts signal/background counts to significance. "
        r"Assumption: Poisson counting experiment with \(s,b\gg 1\) in the asymptotic limit."
    ),
    "learn/physics/postgraduate/plasma-physics.html": (
        r"\(\lambda_D=\sqrt{\epsilon_0 k_B T_e/(n_e e^2)}\) is the Debye length — the scale over which mobile electrons screen electric fields. "
        r"Assumption: quasi-neutral plasma with Maxwellian electrons at temperature \(T_e\). "
        r"\(\omega_{pe}=\sqrt{n_e e^2/(m_e\epsilon_0)}\) is the electron plasma frequency. "
        r"Assumption: cold-fluid limit where ion motion is negligible on the timescale. "
        r"\(\partial_t f+\mathbf{v}\cdot\nabla f+\frac{q}{m}(\mathbf{E}+\mathbf{v}\times\mathbf{B})\cdot\nabla_v f=0\) is the Vlasov equation for the one-particle distribution \(f\). "
        r"Assumption: collisionless plasma with self-consistent mean fields \(\mathbf{E},\mathbf{B}\)."
    ),
    "learn/physics/postgraduate/precision-metrology.html": (
        r"\(u_c=\sqrt{\sum_i (\partial f/\partial x_i)^2 u_i^2}\) is combined standard uncertainty from independent inputs (GUM propagation). "
        r"Assumption: linear (or locally linear) \(f(x_i)\) and uncorrelated input uncertainties \(u_i\). "
        r"\(\delta\phi_{\mathrm{SQL}}\sim 1/\sqrt{N}\) is the standard quantum limit for phase noise with \(N\) independent particles/modes. "
        r"Assumption: uncorrelated particles, no squeezing or entanglement enhancement. "
        r"\(\delta\nu/\nu=\Delta\nu/\nu_0\) is the fractional frequency shift relative to reference \(\nu_0\). "
        r"Assumption: small perturbation so linearised shift is meaningful."
    ),
}


def build_research_answers(topic_path: str) -> list[str]:
    """Return six model answers (Q1–Q6) for a research-template physics topic."""
    try:
        q1 = PHYSICS_RESEARCH_Q1[topic_path]
    except KeyError as exc:
        raise KeyError(f"No Q1 model answer for research topic: {topic_path}") from exc
    return [q1, *RESEARCH_METHODOLOGY_ANSWERS]


PHYSICS_ALEVEL_MODEL_ANSWERS: dict[str, list[str]] = {
    "learn/physics/a-level/quantum-physics-intro.html": [
        r"\(E=\frac{hc}{\lambda}=\frac{1240\,\mathrm{eV\cdot nm}}{520\,\mathrm{nm}}\approx 2.38\,\mathrm{eV}\).",
        r"Intensity sets the <em>number</em> of photons arriving per second, not the energy of each photon. In the photoelectric equation \(hf=\phi+K_{\max}\), only frequency (hence \(hf\)) sets \(K_{\max}\); brighter light ejects more electrons but each photon's energy is unchanged.",
        r"\(K=eV=100\,\mathrm{eV}=1.602\times 10^{-17}\,\mathrm{J}\). Then \(p=\sqrt{2m_e K}\approx 5.4\times 10^{-24}\,\mathrm{kg\,m\,s^{-1}}\) and \(\lambda=\frac{h}{p}\approx 0.12\,\mathrm{nm}\) (de Broglie wavelength).",
        r"\(\Delta E=13.6\left(\frac{1}{2^2}-\frac{1}{3^2}\right)=\frac{5}{36}\times 13.6\,\mathrm{eV}\approx 1.89\,\mathrm{eV}\). Then \(\lambda=\frac{hc}{\Delta E}\approx 656\,\mathrm{nm}\) — the red Balmer-\(\alpha\) line.",
        r"Detecting which slit the electron uses requires interaction that localises the particle path. That which-path information is incompatible with the coherent superposition needed for interference, so the fringe pattern is lost.",
        r"\(\int_{-\infty}^{\infty}|\psi(x)|^2\,dx=1\): the total probability of finding the particle somewhere must equal 1.",
    ],
    "learn/physics/a-level/quantum-mechanics-1.html": [
        r"For a 1D infinite well, \(E_n=\frac{n^2\pi^2\hbar^2}{2ma^2}\). With \(a=1\,\mathrm{nm}\) and \(n=2\): \(E_2=4E_1\approx 1.5\,\mathrm{eV}\) (using \(E_1\approx 0.38\,\mathrm{eV}\) for an electron in a 1 nm well).",
        r"\(\psi_0(x)\propto\exp\!\left(-\frac{m\omega x^2}{2\hbar}\right)\): a Gaussian centred at the origin (ground state of the quantum harmonic oscillator).",
        r"For hydrogen with \(n=3\), degeneracy is \(n^2=9\) distinct states: \(l=0\) gives 1 state, \(l=1\) gives 3, and \(l=2\) gives 5 (all \(m\) values for each \(l\)), ignoring spin.",
        r"\(\int_0^a\frac{2}{a}\sin^2\!\left(\frac{\pi x}{a}\right)dx=\frac{2}{a}\cdot\frac{a}{2}=1\), using \(\int_0^a\sin^2(\pi x/a)\,dx=a/2\).",
        r"For \(l=2\), magnetic quantum number \(m\) runs from \(-l\) to \(+l\): \(m=-2,-1,0,+1,+2\) — five values.",
        r"The uncertainty principle forbids simultaneously localising position at the minimum of \(V(x)=\frac{1}{2}m\omega^2x^2\) and having zero momentum. The ground state therefore has zero-point energy \(E_0=\frac{1}{2}\hbar\omega>0\).",
    ],
    "learn/physics/a-level/quantum-mechanics-2.html": [
        r"The 2D harmonic-oscillator ground state is even in \(z\) (\(\psi(-z)=\psi(z)\)), while \(\hat{z}\) is odd. So \(E_0^{(1)}=\langle 0|\lambda\hat{z}|0\rangle=0\) by parity — no first-order energy shift.",
        r"Dirac fine structure splits hydrogen \(n=2\) into three levels: \(2s_{1/2}\), \(2p_{1/2}\), and \(2p_{3/2}\) (two values of \(j\) for \(l=1\) plus \(j=\frac{1}{2}\) for \(l=0\)).",
        r"Born approximation: \(f(\theta)\approx -\frac{m}{2\pi\hbar^2}\int V(\mathbf{r}')\,e^{i\mathbf{q}\cdot\mathbf{r}'}\,d^3r'\). Here \(\mathbf{q}=\mathbf{k}_f-\mathbf{k}_i\) is the momentum transfer (scattered minus incident wave vector).",
        r"Antisymmetric ground state of two non-interacting fermions in a 1D box: \(\Psi(x_1,x_2)=\frac{1}{\sqrt{2}}\bigl[\psi_1(x_1)\psi_2(x_2)-\psi_2(x_1)\psi_1(x_2)\bigr]\) with \(\psi_n(x)=\sqrt{2/a}\sin(n\pi x/a)\) (one particle in \(n=1\), one in \(n=2\)).",
        r"For any normalised trial state \(|\psi_{\mathrm{trial}}\rangle\), \(\frac{\langle\psi_{\mathrm{trial}}|\hat{H}|\psi_{\mathrm{trial}}\rangle}{\langle\psi_{\mathrm{trial}}|\psi_{\mathrm{trial}}\rangle}\geq E_0\) because the ground state minimises \(\langle\hat{H}\rangle\). A trial state is generally not the true ground state, so its expectation value lies <em>above</em> \(E_0\).",
        r"Fermi's golden rule applies when a constant (or slowly turned-on) perturbation \(\hat{H}'\) connects an initial discrete state to a <em>continuum</em> of final states with density \(\rho(E_f)\), giving rate \(\Gamma_{i\to f}=\frac{2\pi}{\hbar}|\langle f|\hat{H}'|i\rangle|^2\rho(E_f)\).",
    ],
    "learn/physics/a-level/quantum-information.html": [
        r"\(S(\rho)=-\sum_i \lambda_i\log_2\lambda_i=-\frac{3}{4}\log_2\frac{3}{4}-\frac{1}{4}\log_2\frac{1}{4}\approx 0.81\) bits.",
        r"\(\rho_B=\mathrm{Tr}_A(|\Phi^+\rangle\langle\Phi^+|)=\frac{1}{2}(|0\rangle\langle 0|+|1\rangle\langle 1|)\). Eigenvalues \(\frac{1}{2},\frac{1}{2}\) give \(S_B=-2\times\frac{1}{2}\log_2\frac{1}{2}=1\) bit.",
        r"Unknown quantum states cannot be copied faithfully. Protocols such as QKD and teleportation rely on this — an eavesdropper cannot duplicate intercepted qubits, and naive backup strategies fail.",
        r"Match \(\mathcal{E}(\rho)=(1-p)\rho+pX\rho X\) to \(\sum_k E_k\rho E_k^\dagger\): \(E_0=\sqrt{1-p}\,I\) and \(E_1=\sqrt{p}\,X\) (since \(X^2=I\)).",
        r"Yes. CPTP maps need not preserve entropy. Example: amplitude damping (or measure-and-reset) maps the maximally mixed qubit \(\rho=I/2\) (\(S=1\)) to a pure state \(|0\rangle\langle 0|\) (\(S=0\)). Entropy can increase under open-system evolution but may decrease when information is discarded.",
        r"At most <strong>one</strong> classical bit: a single measurement in the computational basis yields outcome 0 or 1 with probabilities \(|\alpha|^2\) and \(|\beta|^2\). The amplitudes themselves are not accessible.",
    ],
    "learn/physics/a-level/quantum-optics.html": [
        r"With \(X=\frac{1}{2}(a+a^\dagger)\), \(P=\frac{i}{2}(a^\dagger-a)\) and \([a,a^\dagger]=1\), the vacuum has \(\langle X\rangle=\langle P\rangle=0\) and \((\Delta X)^2=(\Delta P)^2=\frac{1}{4}\), so \(\Delta X\cdot\Delta P\geq\frac{1}{4}\) (saturated for the vacuum).",
        r"For a coherent state \(|\alpha\rangle\): \(\langle\hat{n}\rangle=|\alpha|^2\) and \((\Delta n)^2=\langle\hat{n}^2\rangle-\langle\hat{n}\rangle^2=|\alpha|^2\) — Poissonian photon-number statistics (mean equals variance).",
        r"A 50:50 beam splitter implements a Hadamard on the dual-rail photon number: \(|1\rangle_1|0\rangle_2\to\frac{1}{\sqrt{2}}(|1\rangle_1|0\rangle_2+|0\rangle_1|1\rangle_2)\). The single photon is in an equal superposition of exiting on path 1 or path 2.",
        r"Bosons occupy symmetric states: indistinguishable photons on a beam splitter interfere destructively on the coincidence output (HOM dip). Fermions require antisymmetric states, forbidding the same two-particle symmetric path that bosons favour — coincidence is enhanced rather than suppressed.",
        r"At resonance \(\omega_c=\omega_a\), the Jaynes–Cummings interaction resonantly couples \(|g,1\rangle\) and \(|e,0\rangle\), producing vacuum Rabi oscillations (energy exchanges at rate \(g\)) rather than off-resonant Stark shifts alone.",
        r"A true single-photon source emits one photon per pulse with negligible multi-photon probability (\(g^{(2)}(0)\approx 0\)). An attenuated laser produces a Poissonian mixture of \(|n\rangle\) states; pulses can contain two or more photons, enabling beam-splitting attacks in QKD.",
    ],
}
