#!/usr/bin/env python3
"""Replace placeholder worked-example cards with real numerical solutions."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "learn" / "physics" / "a-level"

PLACEHOLDER_MARKER = "A second question extends the same model"

# Inner HTML for cards 3 and 4 (including wrapping div.card elements)
WORKED_EXAMPLES: dict[str, str] = {}

def _register(filename: str, block: str) -> None:
    WORKED_EXAMPLES[filename] = block


_register(
    "waves-a-level.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> A sound wave in air has frequency \(f=440\,\text{Hz}\) and wavelength \(\lambda=0.77\,\text{m}\). Find the wave speed.</p>
        <p><strong>Assumption:</strong> The medium is uniform so \(v=f\lambda\) applies.</p>
        <p><strong>Solution:</strong></p>
        <p>\[v=f\lambda=440\times0.77=3.39\times10^2\,\text{m\,s}^{-1}\]</p>
        <p><strong>Answer:</strong> \(v\approx340\,\text{m\,s}^{-1}\) (2 s.f.). This is close to the speed of sound in air at room temperature (\(\approx343\,\text{m\,s}^{-1}\)), so the result is physically reasonable.</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> Two coherent sources emit waves of wavelength \(\lambda=0.60\,\text{m}\). At a point \(P\), the path difference is \(\Delta x=0.30\,\text{m}\). Find the phase difference and state the interference condition.</p>
        <p><strong>Solution:</strong></p>
        <p>\[\Delta\phi=\frac{2\pi\Delta x}{\lambda}=\frac{2\pi\times0.30}{0.60}=\pi\,\text{rad}\]</p>
        <p><strong>Answer:</strong> Phase difference \(=\pi\) rad (180°). Because \(\Delta x=\lambda/2\), waves arrive in antiphase, giving <strong>destructive interference</strong> (first minimum in the double-slit pattern, if other conditions match).</p>
      </div>
""",
)

_register(
    "materials.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> A copper wire of length \(L=2.00\,\text{m}\) and diameter \(d=0.40\,\text{mm}\) extends by \(\Delta L=1.2\,\text{mm}\) when a load \(F=120\,\text{N}\) is applied. Assuming Hooke's law applies, find stress, strain, and Young modulus.</p>
        <p><strong>Solution:</strong> Convert to SI first: \(d=4.0\times10^{-4}\,\text{m}\), so \(A=\pi(d/2)^2=\pi(2.0\times10^{-4})^2=1.26\times10^{-7}\,\text{m}^2\).</p>
        <p>\[\sigma=\frac{F}{A}=\frac{120}{1.26\times10^{-7}}=9.5\times10^8\,\text{Pa}\]</p>
        <p>\[\varepsilon=\frac{\Delta L}{L}=\frac{1.2\times10^{-3}}{2.00}=6.0\times10^{-4}\]</p>
        <p>\[E=\frac{\sigma}{\varepsilon}=\frac{9.5\times10^8}{6.0\times10^{-4}}=1.6\times10^{11}\,\text{Pa}\]</p>
        <p><strong>Answer:</strong> \(\sigma\approx9.5\times10^8\,\text{Pa}\), \(\varepsilon=6.0\times10^{-4}\), \(E\approx1.6\times10^{11}\,\text{Pa}\). This is consistent with copper (\(E\sim1.1\)–\(1.3\times10^{11}\,\text{Pa}\)); small discrepancy may reflect experimental scatter or wire not being perfectly uniform.</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> The same wire is analysed, but a student uses \(d=0.40\,\text{mm}\) directly in \(A=\pi d^2/4\) without converting to metres. What value of \(E\) do they obtain?</p>
        <p><strong>Solution:</strong> Wrong area: \(A_\text{wrong}=\pi(0.40)^2/4=0.126\,\text{mm}^2\) used as if it were \(\text{m}^2\). Stress is underestimated by \(\sim10^6\), so \(E\) is also wrong by \(\sim10^6\).</p>
        <p>Correct \(E\approx1.6\times10^{11}\,\text{Pa}\); incorrect route gives \(E\approx1.6\times10^5\,\text{Pa}\).</p>
        <p><strong>Answer:</strong> Failing to convert mm to m can make \(E\) wrong by a factor of \(10^6\). Always convert diameter to metres before calculating area in \(\text{m}^2\).</p>
      </div>
""",
)

_register(
    "electric-fields.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> Point charges \(Q=+3.0\,\mu\text{C}\) and \(q=-1.5\,\mu\text{C}\) are separated by \(r=0.25\,\text{m}\) in vacuum. Find the magnitude of the force on \(q\) and state whether the interaction is attractive or repulsive.</p>
        <p><strong>Solution:</strong> \(Q=3.0\times10^{-6}\,\text{C}\), \(q=-1.5\times10^{-6}\,\text{C}\).</p>
        <p>\[F=\frac{1}{4\pi\varepsilon_0}\frac{|Qq|}{r^2}=\frac{(9.0\times10^9)(3.0\times10^{-6})(1.5\times10^{-6})}{(0.25)^2}=0.65\,\text{N}\]</p>
        <p><strong>Answer:</strong> \(F=0.65\,\text{N}\). Opposite signs → <strong>attractive</strong> force on \(q\) toward \(Q\).</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> Parallel plates separated by \(d=5.0\,\text{cm}\) have potential difference \(V=250\,\text{V}\). Find the uniform electric field between the plates. What force acts on an electron (\(q=1.6\times10^{-19}\,\text{C}\)) in this field?</p>
        <p><strong>Assumption:</strong> Field is uniform (neglect edge effects), so \(E=V/d\) applies.</p>
        <p><strong>Solution:</strong> \(d=0.050\,\text{m}\).</p>
        <p>\[E=\frac{V}{d}=\frac{250}{0.050}=5.0\times10^3\,\text{V\,m}^{-1}\]</p>
        <p>\[F=qE=(1.6\times10^{-19})(5.0\times10^3)=8.0\times10^{-16}\,\text{N}\]</p>
        <p><strong>Answer:</strong> \(E=5.0\,\text{kV\,m}^{-1}\); force on electron \(=8.0\times10^{-16}\,\text{N}\) toward the positive plate.</p>
      </div>
""",
)

_register(
    "mechanics-a-level.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> A cyclist accelerates from rest with constant acceleration \(a=2.5\,\text{m\,s}^{-2}\) for \(t=4.0\,\text{s}\). Find final speed and displacement.</p>
        <p><strong>Assumption:</strong> Constant acceleration along a straight line (SUVAT valid).</p>
        <p><strong>Solution:</strong> \(u=0\).</p>
        <p>\[v=u+at=0+2.5\times4.0=10\,\text{m\,s}^{-1}\]</p>
        <p>\[s=ut+\tfrac12 at^2=0+\tfrac12(2.5)(4.0)^2=20\,\text{m}\]</p>
        <p><strong>Answer:</strong> \(v=10\,\text{m\,s}^{-1}\), \(s=20\,\text{m}\).</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> A car travelling at \(u=18\,\text{m\,s}^{-1}\) brakes with constant deceleration \(a=-3.0\,\text{m\,s}^{-2}\). How far does it travel before stopping?</p>
        <p><strong>Solution:</strong> Final speed \(v=0\). Take direction of motion as positive.</p>
        <p>\[v^2=u^2+2as\Rightarrow 0=18^2+2(-3.0)s\Rightarrow s=\frac{324}{6.0}=54\,\text{m}\]</p>
        <p><strong>Answer:</strong> Stopping distance \(s=54\,\text{m}\). Check: \(t=|u/a|=6.0\,\text{s}\) and \(s=\tfrac12(u+v)t=54\,\text{m}\) ✓</p>
      </div>
""",
)

_register(
    "circular-motion.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> A \(0.50\,\text{kg}\) mass on a string moves in a horizontal circle of radius \(r=2.0\,\text{m}\) at speed \(v=4.0\,\text{m\,s}^{-1}\). Find the required centripetal force.</p>
        <p><strong>Solution:</strong></p>
        <p>\[F_c=\frac{mv^2}{r}=\frac{0.50\times4.0^2}{2.0}=4.0\,\text{N}\]</p>
        <p><strong>Answer:</strong> Centripetal force \(=4.0\,\text{N}\) directed toward the centre. The string tension (resolved horizontally) provides this force.</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> A car rounds a flat curve of radius \(r=50\,\text{m}\) at \(v=15\,\text{m\,s}^{-1}\). Mass \(m=1200\,\text{kg}\). What minimum coefficient of friction \(\mu\) is needed if friction alone provides the centripetal force? (\(g=9.8\,\text{m\,s}^{-2}\))</p>
        <p><strong>Solution:</strong> \(F_c=mv^2/r=\mu mg\).</p>
        <p>\[\mu=\frac{v^2}{rg}=\frac{15^2}{50\times9.8}=0.46\]</p>
        <p><strong>Answer:</strong> \(\mu\approx0.46\). A higher \(\mu\) or lower speed would be needed on a wet road.</p>
      </div>
""",
)

_register(
    "thermal-physics.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> How much energy is needed to heat \(m=0.50\,\text{kg}\) of water from \(20\,^\circ\text{C}\) to \(45\,^\circ\text{C}\)? Specific heat capacity \(c=4200\,\text{J\,kg}^{-1}\,\text{K}^{-1}\).</p>
        <p><strong>Solution:</strong> \(\Delta T=25\,\text{K}\).</p>
        <p>\[Q=mc\Delta T=0.50\times4200\times25=5.25\times10^4\,\text{J}\]</p>
        <p><strong>Answer:</strong> \(Q=5.3\times10^4\,\text{J}\) (2 s.f.). Assumes no heat loss to surroundings.</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> An ideal gas has \(n=2.0\,\text{mol}\), temperature \(T=300\,\text{K}\), and pressure \(p=1.0\times10^5\,\text{Pa}\). Find the volume. (\(R=8.31\,\text{J\,mol}^{-1}\,\text{K}^{-1}\))</p>
        <p><strong>Assumption:</strong> Ideal gas law \(pV=nRT\) applies.</p>
        <p><strong>Solution:</strong></p>
        <p>\[V=\frac{nRT}{p}=\frac{2.0\times8.31\times300}{1.0\times10^5}=4.99\times10^{-2}\,\text{m}^3\]</p>
        <p><strong>Answer:</strong> \(V\approx0.050\,\text{m}^3=50\,\text{litres}\).</p>
      </div>
""",
)

_register(
    "capacitors.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> A \(470\,\mu\text{F}\) capacitor is charged to \(V=12\,\text{V}\). Find the stored charge and energy.</p>
        <p><strong>Solution:</strong> \(C=470\times10^{-6}\,\text{F}\).</p>
        <p>\[Q=CV=(470\times10^{-6})(12)=5.6\times10^{-3}\,\text{C}\]</p>
        <p>\[E=\tfrac12 CV^2=\tfrac12(470\times10^{-6})(12)^2=3.4\times10^{-2}\,\text{J}\]</p>
        <p><strong>Answer:</strong> \(Q=5.6\,\text{mC}\), stored energy \(=0.034\,\text{J}\).</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> The capacitor discharges through \(R=10\,\text{k}\Omega\). Find the time constant \(\tau\) and the charge after \(t=5.0\,\text{s}\) if initially fully charged (\(Q_0=5.6\,\text{mC}\)).</p>
        <p><strong>Solution:</strong></p>
        <p>\[\tau=RC=(10\times10^3)(470\times10^{-6})=4.7\,\text{s}\]</p>
        <p>\[Q=Q_0 e^{-t/\tau}=(5.6\times10^{-3})e^{-5.0/4.7}=1.8\times10^{-3}\,\text{C}\]</p>
        <p><strong>Answer:</strong> \(\tau=4.7\,\text{s}\); after \(5.0\,\text{s}\), \(Q\approx1.8\,\text{mC}\) (\(\approx32\%\) of \(Q_0\)).</p>
      </div>
""",
)

_register(
    "magnetic-fields.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> A wire of length \(L=0.15\,\text{m}\) carrying \(I=2.0\,\text{A}\) lies perpendicular to a uniform magnetic field \(B=0.35\,\text{T}\). Find the magnetic force on the wire.</p>
        <p><strong>Solution:</strong> \(\theta=90^\circ\), \(\sin\theta=1\).</p>
        <p>\[F=BIL\sin\theta=0.35\times2.0\times0.15=0.11\,\text{N}\]</p>
        <p><strong>Answer:</strong> \(F=0.11\,\text{N}\). Use Fleming's left-hand rule for direction (perpendicular to both \(I\) and \(B\)).</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> An electron (\(m=9.1\times10^{-31}\,\text{kg}\), \(q=1.6\times10^{-19}\,\text{C}\)) moves at \(v=3.0\times10^6\,\text{m\,s}^{-1}\) perpendicular to \(B=0.20\,\text{T}\). Find the radius of its circular path.</p>
        <p><strong>Solution:</strong> Magnetic force provides centripetal force: \(qvB=mv^2/r\).</p>
        <p>\[r=\frac{mv}{qB}=\frac{(9.1\times10^{-31})(3.0\times10^6)}{(1.6\times10^{-19})(0.20)}=8.5\times10^{-5}\,\text{m}\]</p>
        <p><strong>Answer:</strong> \(r\approx8.5\times10^{-5}\,\text{m}=85\,\mu\text{m}\).</p>
      </div>
""",
)

_register(
    "electromagnetic-induction.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> A coil of \(N=200\) turns and area \(A=4.0\times10^{-3}\,\text{m}^2\) has magnetic flux density perpendicular to the plane changing uniformly from \(B=0.10\,\text{T}\) to \(B=0.50\,\text{T}\) in \(\Delta t=0.20\,\text{s}\). Find the magnitude of the induced emf.</p>
        <p><strong>Solution:</strong> \(\Phi=BA\) with \(\cos\theta=1\).</p>
        <p>\[\mathcal{E}=\left|\frac{N\Delta\Phi}{\Delta t}\right|=\frac{200\times4.0\times10^{-3}\times(0.50-0.10)}{0.20}=1.6\,\text{V}\]</p>
        <p><strong>Answer:</strong> Induced emf magnitude \(=1.6\,\text{V}\). Lenz's law gives direction opposing the increase in flux.</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> An ideal transformer has \(N_p=500\) primary turns and \(N_s=50\) secondary turns. The primary is connected to \(V_p=230\,\text{V}\) rms. Find \(V_s\).</p>
        <p><strong>Solution:</strong></p>
        <p>\[\frac{V_s}{V_p}=\frac{N_s}{N_p}\Rightarrow V_s=230\times\frac{50}{500}=23\,\text{V}\]</p>
        <p><strong>Answer:</strong> Secondary voltage \(=23\,\text{V}\) rms — a step-down transformer (\(N_s&lt;N_p\)).</p>
      </div>
""",
)

_register(
    "alternating-current.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> Mains AC has peak voltage \(V_0=325\,\text{V}\). Find the rms voltage.</p>
        <p><strong>Solution:</strong></p>
        <p>\[V_\text{rms}=\frac{V_0}{\sqrt{2}}=\frac{325}{\sqrt{2}}=230\,\text{V}\]</p>
        <p><strong>Answer:</strong> \(V_\text{rms}=230\,\text{V}\) — the value quoted for UK mains.</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> A series circuit has \(R=40\,\Omega\), \(X_L=60\,\Omega\), and \(X_C=20\,\Omega\) at the operating frequency. Find the impedance \(Z\).</p>
        <p><strong>Solution:</strong></p>
        <p>\[Z=\sqrt{R^2+(X_L-X_C)^2}=\sqrt{40^2+(60-20)^2}=\sqrt{1600+1600}=57\,\Omega\]</p>
        <p><strong>Answer:</strong> \(Z=57\,\Omega\). Inductive reactance dominates (\(X_L&gt;X_C\)), so current lags voltage.</p>
      </div>
""",
)

_register(
    "optics.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> Light enters glass from air with angle of incidence \(\theta_1=35^\circ\). Refractive index of glass \(n_2=1.5\), air \(n_1\approx1.0\). Find the angle of refraction \(\theta_2\).</p>
        <p><strong>Solution:</strong> Snell's law \(n_1\sin\theta_1=n_2\sin\theta_2\).</p>
        <p>\[\sin\theta_2=\frac{\sin35^\circ}{1.5}=0.383\Rightarrow\theta_2=22.5^\circ\]</p>
        <p><strong>Answer:</strong> \(\theta_2\approx23^\circ\) to the normal. Ray bends <strong>toward</strong> the normal in the denser medium.</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> A converging lens has focal length \(f=0.20\,\text{m}\). An object is placed at \(u=0.30\,\text{m}\). Find image distance \(v\) (real-is-positive convention).</p>
        <p><strong>Solution:</strong></p>
        <p>\[\frac{1}{f}=\frac{1}{u}+\frac{1}{v}\Rightarrow\frac{1}{v}=\frac{1}{0.20}-\frac{1}{0.30}=1.67\,\text{m}^{-1}\]</p>
        <p>\[v=0.60\,\text{m}\]</p>
        <p><strong>Answer:</strong> Real image at \(v=0.60\,\text{m}\) on the opposite side of the lens. Magnification \(|m|=v/u=2.0\) (enlarged).</p>
      </div>
""",
)

_register(
    "simple-harmonic-motion.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> A mass–spring system oscillates with angular frequency \(\omega=8.0\,\text{rad\,s}^{-1}\) and amplitude \(A=0.050\,\text{m}\). Find the period and maximum speed.</p>
        <p><strong>Solution:</strong></p>
        <p>\[T=\frac{2\pi}{\omega}=\frac{2\pi}{8.0}=0.79\,\text{s}\]</p>
        <p>\[v_\text{max}=\omega A=8.0\times0.050=0.40\,\text{m\,s}^{-1}\]</p>
        <p><strong>Answer:</strong> \(T=0.79\,\text{s}\), \(v_\text{max}=0.40\,\text{m\,s}^{-1}\) at equilibrium (\(x=0\)).</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> At displacement \(x=0.030\,\text{m}\) from equilibrium, find acceleration for the same oscillator (\(\omega=8.0\,\text{rad\,s}^{-1}\)).</p>
        <p><strong>Solution:</strong> \(a=-\omega^2 x\).</p>
        <p>\[a=-(8.0)^2(0.030)=-1.9\,\text{m\,s}^{-2}\]</p>
        <p><strong>Answer:</strong> \(a=-1.9\,\text{m\,s}^{-2}\) (directed toward equilibrium). Magnitude is less than \(a_\text{max}=\omega^2 A=3.2\,\text{m\,s}^{-2}\).</p>
      </div>
""",
)

_register(
    "nuclear-physics.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> A radioactive sample has half-life \(T_{1/2}=6.0\) hours. What fraction of nuclei remain after \(t=18\) hours?</p>
        <p><strong>Solution:</strong> \(18/6=3\) half-lives.</p>
        <p>\[\frac{N}{N_0}=\left(\frac12\right)^3=\frac18=0.125\]</p>
        <p><strong>Answer:</strong> \(12.5\%\) of nuclei remain; activity has also fallen to \(12.5\%\) of its initial value.</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> A source has activity \(A_0=4.0\times10^4\,\text{Bq}\) and decay constant \(\lambda=3.5\times10^{-6}\,\text{s}^{-1}\). How many undecayed nuclei are present initially?</p>
        <p><strong>Solution:</strong> \(A=\lambda N\).</p>
        <p>\[N_0=\frac{A_0}{\lambda}=\frac{4.0\times10^4}{3.5\times10^{-6}}=1.1\times10^{10}\]</p>
        <p><strong>Answer:</strong> \(N_0\approx1.1\times10^{10}\) nuclei.</p>
      </div>
""",
)

_register(
    "particle-physics-intro.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> An electron has kinetic energy large enough that \(pc=1.2\,\text{MeV}\) and rest energy \(mc^2=0.511\,\text{MeV}\). Find total energy \(E\).</p>
        <p><strong>Solution:</strong> Use \(E^2=(pc)^2+(mc^2)^2\).</p>
        <p>\[E=\sqrt{(1.2)^2+(0.511)^2}=\sqrt{1.44+0.261}=1.29\,\text{MeV}\]</p>
        <p><strong>Answer:</strong> \(E=1.29\,\text{MeV}\). Relativistic relation required — classical \(\tfrac12 mv^2\) would be invalid here.</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> \(\pi^+\) meson at rest decays to \(\mu^+\) and \(\nu_\mu\). Which conservation laws must be checked?</p>
        <p><strong>Solution:</strong> Check charge, lepton number, baryon number, and energy–momentum.</p>
        <p>\(\pi^+\): charge \(+1\), baryon number \(0\), lepton number \(0\). Products: \(\mu^+\) has charge \(+1\), lepton number \(-1\) (antimuon); \(\nu_\mu\) has lepton number \(+1\).</p>
        <p><strong>Answer:</strong> Charge conserved (\(+1\to+1\)), total lepton number conserved (\(0\to-1+1\)), baryon number conserved (\(0\to0\)). Rest mass energy of \(\pi^+\) appears as kinetic energy of products.</p>
      </div>
""",
)

_register(
    "astrophysics-a-level.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> A star has luminosity \(L=3.8\times10^{26}\,\text{W}\). At distance \(d=1.5\times10^{11}\,\text{m}\) (1 AU), find the received flux \(F\).</p>
        <p><strong>Solution:</strong> Inverse-square law \(F=L/(4\pi d^2)\).</p>
        <p>\[F=\frac{3.8\times10^{26}}{4\pi(1.5\times10^{11})^2}=1.35\times10^3\,\text{W\,m}^{-2}\]</p>
        <p><strong>Answer:</strong> Solar flux at Earth \(\approx1.35\,\text{kW\,m}^{-2}\) (solar constant \(\approx1.36\,\text{kW\,m}^{-2}\)).</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> Star A has surface temperature twice that of star B (\(T_A=2T_B\)) and the same radius. How do their luminosities compare?</p>
        <p><strong>Assumption:</strong> Both are black-body radiators: \(L=4\pi R^2\sigma T^4\).</p>
        <p><strong>Solution:</strong> \(L\propto T^4\) for equal \(R\).</p>
        <p>\[\frac{L_A}{L_B}=\left(\frac{T_A}{T_B}\right)^4=2^4=16\]</p>
        <p><strong>Answer:</strong> Star A is <strong>16 times</strong> more luminous. Small temperature changes have large effect because of the \(T^4\) dependence.</p>
      </div>
""",
)

_register(
    "vectors-in-physics.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> Forces \(\vec{F}_1=12\,\text{N}\) east and \(\vec{F}_2=5.0\,\text{N}\) north act on a point. Find the magnitude and direction of the resultant.</p>
        <p><strong>Solution:</strong> Perpendicular components: \(F_x=12\), \(F_y=5.0\).</p>
        <p>\[|\vec{F}|=\sqrt{12^2+5.0^2}=13\,\text{N}\]</p>
        <p>\[\theta=\tan^{-1}\!\left(\frac{5.0}{12}\right)=22.6^\circ\ \text{north of east}\]</p>
        <p><strong>Answer:</strong> Resultant \(=13\,\text{N}\) at \(23^\circ\) north of east.</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> Car A travels north at \(20\,\text{m\,s}^{-1}\); car B travels east at \(15\,\text{m\,s}^{-1}\). Find the velocity of A relative to B (\(\vec{v}_{A/B}\)).</p>
        <p><strong>Solution:</strong> \(\vec{v}_{A/B}=\vec{v}_A-\vec{v}_B\). Take east as \(\hat{i}\), north as \(\hat{j}\).</p>
        <p>\[\vec{v}_{A/B}=-15\,\hat{i}+20\,\hat{j}\,\text{m\,s}^{-1}\]</p>
        <p>\[|\vec{v}_{A/B}|=\sqrt{15^2+20^2}=25\,\text{m\,s}^{-1}\]</p>
        <p><strong>Answer:</strong> A sees B approaching at \(25\,\text{m\,s}^{-1}\) at \(53^\circ\) north of west (or A's velocity relative to B is opposite).</p>
      </div>
""",
)

_register(
    "mathematical-methods-physics.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> Displacement \(x=t^3-2t^2\) m for \(t\ge0\). Find velocity at \(t=2.0\,\text{s}\) and acceleration at that instant.</p>
        <p><strong>Solution:</strong> \(v=\mathrm{d}x/\mathrm{d}t=3t^2-4t\), \(a=\mathrm{d}v/\mathrm{d}t=6t-4\).</p>
        <p>\[v(2)=3(4)-4(2)=4\,\text{m\,s}^{-1}\]</p>
        <p>\[a(2)=6(2)-4=8\,\text{m\,s}^{-2}\]</p>
        <p><strong>Answer:</strong> At \(t=2.0\,\text{s}\): \(v=4\,\text{m\,s}^{-1}\), \(a=8\,\text{m\,s}^{-2}\).</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> A straight-line graph of \(\log T\) against \(\log P\) has gradient \(n=0.71\) and intercept \(\log k=2.10\) when \(P\) is in Pa and \(T\) in K. Write the power law \(T=kP^n\) and estimate \(T\) when \(P=1.0\times10^5\,\text{Pa}\).</p>
        <p><strong>Solution:</strong> \(\log k=2.10\Rightarrow k=10^{2.10}=1.26\times10^2\).</p>
        <p>\[T=1.26\times10^2\times(1.0\times10^5)^{0.71}=1.3\times10^4\,\text{K}\]</p>
        <p><strong>Answer:</strong> \(T\approx kP^{0.71}\) with \(k\approx1.3\times10^2\); at \(P=10^5\,\text{Pa}\), \(T\approx1.3\times10^4\,\text{K}\).</p>
      </div>
""",
)

_register(
    "practical-skills.html",
    r"""
      <div class="card">
        <h2>3) Worked example A</h2>
        <p><strong>Problem:</strong> A length is measured as \(L=24.5\,\text{cm}\pm0.1\,\text{cm}\). Express the percentage uncertainty.</p>
        <p><strong>Solution:</strong></p>
        <p>\[\frac{\Delta L}{L}\times100\%=\frac{0.1}{24.5}\times100\%=0.41\%\]</p>
        <p><strong>Answer:</strong> Percentage uncertainty \(\approx0.4\%\) (1 s.f. on uncertainty).</p>
      </div>

      <div class="card">
        <h2>4) Worked example B</h2>
        <p><strong>Problem:</strong> Density \(\rho=m/V\) where \(m=156\,\text{g}\pm2\,\text{g}\) and \(V=20.0\,\text{cm}^3\pm0.5\,\text{cm}^3\). Find \(\rho\) and its percentage uncertainty.</p>
        <p><strong>Solution:</strong> \(\rho=156/20.0=7.80\,\text{g\,cm}^{-3}\).</p>
        <p>\[\frac{\Delta\rho}{\rho}\approx\frac{\Delta m}{m}+\frac{\Delta V}{V}=\frac{2}{156}+\frac{0.5}{20.0}=0.013+0.025=0.038=3.8\%\]</p>
        <p><strong>Answer:</strong> \(\rho=7.80\,\text{g\,cm}^{-3}\pm3.8\%\) (volume uncertainty dominates). Absolute \(\Delta\rho\approx0.3\,\text{g\,cm}^{-3}\Rightarrow \(\rho=7.8\pm0.3\,\text{g\,cm}^{-3}\).</p>
      </div>
""",
)

CARD_PAIR_RE = re.compile(
    r'<div class="card">\s*<h2>3\) Worked example A</h2>.*?'
    r'<div class="card">\s*<h2>4\) Worked example B</h2>.*?'
    r'</div>\s*',
    re.DOTALL,
)


def process_file(path: Path) -> bool:
    if path.name not in WORKED_EXAMPLES:
        return False
    text = path.read_text(encoding="utf-8")
    if PLACEHOLDER_MARKER not in text:
        return False
    new_block = WORKED_EXAMPLES[path.name].strip() + "\n\n"
    match = CARD_PAIR_RE.search(text)
    if not match:
        return False
    new_text = text[: match.start()] + new_block + text[match.end() :]
    path.write_text(new_text, encoding="utf-8")
    return True


def main() -> None:
    updated = 0
    for path in sorted(TARGET.glob("*.html")):
        if process_file(path):
            updated += 1
            print(f"Updated {path.name}")
    print(f"Worked examples updated on {updated} files")


if __name__ == "__main__":
    main()
