from pathlib import Path
import re

base = Path(r'D:/git/engineering/learn/physics/gcse')
files = sorted(base.glob('*.html'))

profiles = {
    'kinematics-gcse.html': {
        'topic': 'Kinematics',
        'subtitle': 'GCSE guide. Describing motion with speed, velocity, acceleration, and graph interpretation.',
        'eqs': ['speed = distance / time', 'acceleration = (final velocity - initial velocity) / time', 'displacement from a velocity-time graph = area under the graph'],
        'practical': 'Required practical style work commonly uses trolleys, light gates, or motion sensors to measure speed and acceleration reliably.',
        'examples': [('A runner covers 400 m in 50 s', 'speed = 400 / 50 = 8.0 m/s'), ('A car changes from 6 m/s to 22 m/s in 4 s', 'a = (22 - 6) / 4 = 4.0 m/s^2'), ('A velocity-time triangle has base 10 s and height 12 m/s', 'displacement = 0.5 x 10 x 12 = 60 m')],
        'quiz': [
            ('A cyclist travels 150 m in 12 s. Find average speed.', '12.5 m/s.'),
            ('Velocity changes from 4 m/s to 19 m/s in 3 s. Find acceleration.', '5.0 m/s^2.'),
            ('What does a horizontal line on a distance-time graph show?', 'The object is stationary.'),
            ('What does area under a velocity-time graph represent?', 'Displacement in metres.'),
            ('Give one factor that increases thinking distance.', 'Any valid factor such as tiredness, alcohol, drugs, or distraction.'),
            ('A car slows from 20 m/s to 8 m/s in 4 s. Find acceleration.', '-3.0 m/s^2.')
        ]
    },
    'forces-and-newtons-laws.html': {
        'topic': "Forces and Newton's Laws",
        'subtitle': "GCSE guide. Resultant force, inertia, acceleration, and interaction pairs explained clearly.",
        'eqs': ['resultant force = mass x acceleration', 'weight = mass x gravitational field strength', 'momentum change depends on force and time of contact'],
        'practical': 'Required practical style investigations often compare force and acceleration using trolleys and measured masses.',
        'examples': [('A 1200 kg car accelerates at 2.5 m/s^2', 'F = 1200 x 2.5 = 3000 N'), ('A 0.40 kg ball accelerates at 15 m/s^2', 'F = 0.40 x 15 = 6.0 N'), ('A 65 kg student on Earth (g = 9.8 N/kg)', 'W = 65 x 9.8 = 637 N')],
        'quiz': [
            ("State Newton's first law.", 'An object remains at rest or constant velocity unless acted on by a resultant force.'),
            ('Calculate force for 5 kg accelerating at 3 m/s^2.', '15 N.'),
            ('Two forces act: 18 N right and 7 N left. Find resultant.', '11 N to the right.'),
            ('Why do third-law pairs not cancel?', 'They act on different objects.'),
            ('Find weight of 4 kg on Earth using 9.8 N/kg.', '39.2 N.'),
            ('Name one safety feature that increases stopping time in a crash.', 'Any valid answer such as crumple zones, airbags, or seat belts.')
        ]
    },
    'moments-and-levers.html': {
        'topic': 'Moments and Levers',
        'subtitle': 'GCSE guide. Turning effects, equilibrium, and mechanical advantage in practical systems.',
        'eqs': ['moment = force x perpendicular distance', 'for equilibrium: clockwise moments = anticlockwise moments', 'mechanical advantage = load / effort'],
        'practical': 'Common practical work measures balancing conditions on metre rules using known masses at measured distances.',
        'examples': [('A 15 N force acts 0.40 m from a pivot', 'moment = 15 x 0.40 = 6.0 N m'), ('Clockwise moment is 12 N m and one anticlockwise force is 8 N at 0.25 m', 'needed extra anticlockwise moment = 4 N m'), ('A lever lifts 300 N load with 75 N effort', 'mechanical advantage = 300 / 75 = 4')],
        'quiz': [
            ('Define moment.', 'The turning effect of a force about a pivot.'),
            ('Find moment for 20 N at 0.30 m.', '6.0 N m.'),
            ('What condition gives rotational equilibrium?', 'Total clockwise moments equal total anticlockwise moments.'),
            ('State one way to increase moment for same force.', 'Increase the perpendicular distance from pivot.'),
            ('A load is 200 N and effort is 50 N. Find MA.', '4.'),
            ('Why is perpendicular distance used, not diagonal distance?', 'Only the perpendicular component produces turning effect about the pivot.')
        ]
    },
    'energy-stores-transfers.html': {
        'topic': 'Energy Stores and Transfers',
        'subtitle': 'GCSE guide. Tracking energy stores, pathways, and dissipation with conservation principles.',
        'eqs': ['energy transferred = power x time', 'kinetic energy = 0.5 x mass x speed^2', 'gravitational potential energy change = mass x g x height'],
        'practical': 'A common required practical context is measuring temperature rise from electrical heating and comparing input energy with useful output.',
        'examples': [('A 2.0 kg object moves at 6.0 m/s', 'KE = 0.5 x 2.0 x 6.0^2 = 36 J'), ('A 1.5 kg book is raised by 1.2 m (g = 9.8 N/kg)', 'GPE change = 1.5 x 9.8 x 1.2 = 17.64 J'), ('A 100 W lamp runs for 180 s', 'E = 100 x 180 = 18,000 J')],
        'quiz': [
            ('State the principle of conservation of energy.', 'Energy cannot be created or destroyed; it is transferred between stores or pathways.'),
            ('Find KE for 3 kg moving at 4 m/s.', '24 J.'),
            ('Find energy transferred by a 60 W bulb in 5 minutes.', '18,000 J.'),
            ('Name one non-useful transfer from a moving car.', 'Thermal energy in brakes, tyres, and surroundings; sound is also valid.'),
            ('Find GPE change for 2 kg raised by 3 m using g = 9.8.', '58.8 J.'),
            ('Why are Sankey diagrams useful?', 'They show how input energy splits into useful and wasted transfers clearly.')
        ]
    },
    'power-efficiency.html': {
        'topic': 'Power and Efficiency',
        'subtitle': 'GCSE guide. Rate of energy transfer and comparing useful output to total input.',
        'eqs': ['power = energy transferred / time', 'power = work done / time', 'efficiency = useful output / total input'],
        'practical': 'Practical activities often involve measuring electrical input and useful mechanical or thermal output to estimate efficiency.',
        'examples': [('A kettle transfers 180,000 J in 120 s', 'P = 180,000 / 120 = 1500 W'), ('A motor gives 240 J useful output from 300 J input', 'efficiency = 240 / 300 = 0.80 = 80%'), ('A 60 W lamp runs for 30 min', 'E = 60 x 1800 = 108,000 J')],
        'quiz': [
            ('Define power.', 'The rate of energy transfer or the rate of doing work.'),
            ('Find power for 900 J transferred in 15 s.', '60 W.'),
            ('Find efficiency if useful output is 45 J from 60 J input.', '0.75 or 75%.'),
            ('Why can efficiency never exceed 100%?', 'Because useful output cannot be greater than total input by conservation of energy.'),
            ('A machine has 500 W input and 350 W useful output. Efficiency?', '70%.'),
            ('State one way engineers improve efficiency.', 'Reduce friction, improve insulation, or optimize design to reduce waste transfers.')
        ]
    },
    'thermal-energy-transfer.html': {
        'topic': 'Thermal Energy Transfer',
        'subtitle': 'GCSE guide. Conduction, convection, radiation, insulation, and heating-rate calculations.',
        'eqs': ['thermal energy change = mass x specific heat capacity x temperature change', 'power = energy / time', 'efficiency improves when unwanted transfer rate is reduced'],
        'practical': 'Required practical contexts include comparing insulation materials by measuring cooling curves or temperature change over time.',
        'examples': [('Heating 0.50 kg water by 25 C with c = 4200 J/kgC', 'E = 0.50 x 4200 x 25 = 52,500 J'), ('A heater transfers 72,000 J in 240 s', 'P = 72,000 / 240 = 300 W'), ('A house loses 15 kJ each minute', 'power loss = 15,000 / 60 = 250 W')],
        'quiz': [
            ('Name the three thermal transfer pathways.', 'Conduction, convection, and infrared radiation.'),
            ('Find energy to heat 2 kg by 10 C with c = 900.', '18,000 J.'),
            ('Why are shiny surfaces used in some insulation layers?', 'They are poor emitters and absorbers of infrared radiation.'),
            ('A system transfers 24,000 J in 80 s. Find power.', '300 W.'),
            ('State one method to reduce heat loss from walls.', 'Cavity wall insulation (or external insulation) is valid.'),
            ('Why does warm fluid rise in convection?', 'It expands, becomes less dense, and is displaced upward by cooler denser fluid.')
        ]
    },
    'particle-model-of-matter.html': {
        'topic': 'Particle Model of Matter',
        'subtitle': 'GCSE guide. Particle arrangement, internal energy, state changes, and density links.',
        'eqs': ['density = mass / volume', 'internal energy is the total kinetic and potential energy of particles', 'specific latent heat links energy to state change without temperature rise'],
        'practical': 'Required practical work includes measuring density of regular and irregular solids and investigating cooling/heating behaviour.',
        'examples': [('A block has mass 0.54 kg and volume 0.0002 m^3', 'density = 0.54 / 0.0002 = 2700 kg/m^3'), ('A 0.20 m^3 gas sample has mass 0.24 kg', 'density = 0.24 / 0.20 = 1.2 kg/m^3'), ('A 1.5 kg object and density 3000 kg/m^3', 'volume = mass / density = 1.5 / 3000 = 0.0005 m^3')],
        'quiz': [
            ('How are particles arranged in a solid?', 'Closely packed in fixed positions, vibrating about those positions.'),
            ('Define density.', 'Mass per unit volume.'),
            ('Find density for 4 kg occupying 0.002 m^3.', '2000 kg/m^3.'),
            ('What happens to internal energy when temperature rises?', 'Internal energy increases.'),
            ('Why does temperature stay constant during melting?', 'Energy is used to break bonds/increase potential energy, not increase kinetic energy.'),
            ('Give one reason gas density is usually much lower than solid density.', 'Particles are much further apart so mass per unit volume is lower.')
        ]
    },
    'gas-laws-intro.html': {
        'topic': 'Gas Laws (Introduction)',
        'subtitle': 'GCSE guide. Pressure, volume, temperature relationships in gases and particle explanations.',
        'eqs': ['for fixed mass at constant temperature: pressure x volume = constant', 'for fixed mass at constant pressure: volume is proportional to absolute temperature', 'for fixed volume: pressure is proportional to absolute temperature'],
        'practical': 'Typical practical contexts use syringes, pressure sensors, and controlled heating to observe gas-law trends safely.',
        'examples': [('A gas changes from 100 kPa and 300 cm^3 to 150 kPa', 'V2 = (100 x 300)/150 = 200 cm^3'), ('Volume changes from 250 cm^3 at 300 K to 360 K at constant pressure', 'V2 = 250 x 360 / 300 = 300 cm^3'), ('Pressure 120 kPa at 290 K rises to 348 K at constant volume', 'P2 = 120 x 348 / 290 = 144 kPa')],
        'quiz': [
            ('What temperature scale is used in gas-law proportionality equations?', 'Kelvin.'),
            ('State Boyle\'s law relationship in words.', 'For fixed mass at constant temperature, pressure is inversely proportional to volume.'),
            ('If temperature in kelvin doubles at constant pressure, what happens to volume?', 'Volume doubles.'),
            ('Why do gas particles cause pressure?', 'They collide with container walls, exerting force per unit area.'),
            ('Convert 27 C to kelvin.', '300 K.'),
            ('A gas at 200 kPa and 100 cm^3 changes to 250 kPa. New volume?', '80 cm^3.')
        ]
    },
    'electric-circuits.html': {
        'topic': 'Electric Circuits',
        'subtitle': 'GCSE guide. Current, potential difference, resistance, circuit rules, and practical measurement.',
        'eqs': ['potential difference = current x resistance', 'power = current x potential difference', 'charge = current x time'],
        'practical': 'Required practical work includes plotting current-potential difference characteristics for components such as resistors, lamps, and diodes.',
        'examples': [('Current is 0.50 A through a 24 ohm resistor', 'V = I x R = 0.50 x 24 = 12 V'), ('A component has 9 V across it and 0.30 A', 'R = V / I = 9 / 0.30 = 30 ohm'), ('Current of 2.5 A flows for 4 min', 'Q = I x t = 2.5 x 240 = 600 C')],
        'quiz': [
            ('State the unit of current.', 'Ampere (A).'),
            ('Find V for 3 A through 4 ohm.', '12 V.'),
            ('In series circuits, what is the same in every component?', 'Current.'),
            ('In parallel circuits, what is the same across each branch?', 'Potential difference (voltage).'),
            ('Find power for 0.8 A at 230 V.', '184 W.'),
            ('Why is an ammeter connected in series?', 'So the same current as the component flows through the ammeter.')
        ]
    },
    'electricity-household.html': {
        'topic': 'Electricity in the Home',
        'subtitle': 'GCSE guide. Mains supply, power ratings, safety devices, and domestic energy calculations.',
        'eqs': ['energy transferred = power x time', 'cost = energy in kWh x tariff', 'current = power / potential difference'],
        'practical': 'Exam contexts include appliance rating labels, fuse selection, and comparing running costs using realistic household data.',
        'examples': [('A 2.0 kW heater runs for 3 h', 'energy = 2.0 x 3 = 6.0 kWh'), ('Tariff is 30 p/kWh and use is 6.0 kWh', 'cost = 6.0 x 30 p = 180 p = 1.80'), ('A 2300 W kettle on 230 V mains', 'I = P / V = 2300 / 230 = 10 A')],
        'quiz': [
            ('State the UK mains voltage used in GCSE contexts.', 'About 230 V AC.'),
            ('Find energy use for a 1.2 kW appliance used 5 h.', '6.0 kWh.'),
            ('Why are fuses or breakers used?', 'They disconnect circuits when current is too high, reducing fire and shock risk.'),
            ('Find current for 920 W on 230 V.', '4.0 A.'),
            ('What does double insulation mean?', 'The appliance has extra insulation so no earth wire is required.'),
            ('Cost of 4 kWh at 28 p/kWh?', '112 p or 1.12.')
        ]
    },
    'static-electricity.html': {
        'topic': 'Static Electricity',
        'subtitle': 'GCSE guide. Charge transfer, electric fields, attraction/repulsion, and discharge applications.',
        'eqs': ['charge is measured in coulombs', 'current = charge / time links static discharge to very short high currents', 'electrostatic force depends on charge size and separation'],
        'practical': 'Classroom practicals often use rods, cloths, pith balls, and electroscopes to observe charging by friction and induction.',
        'examples': [('A spark transfers 0.002 C in 0.0005 s', 'I = Q/t = 0.002 / 0.0005 = 4 A'), ('Object gains 3.2 x 10^-7 C and each electron has 1.6 x 10^-19 C', 'number of electrons = 3.2x10^-7 / 1.6x10^-19 = 2.0x10^12'), ('A charged object attracts a neutral wall', 'induced polarization causes near-side opposite charge and net attraction')],
        'quiz': [
            ('How do objects usually become statically charged?', 'By transfer of electrons, often through friction.'),
            ('Which particles move in solids during charging?', 'Electrons.'),
            ('Do like charges attract or repel?', 'Repel.'),
            ('Why is earthing useful in fuel transfer systems?', 'It allows charge to flow away, reducing spark risk.'),
            ('Find current if 0.006 C transfers in 0.002 s.', '3 A.'),
            ('State one industrial use of electrostatics.', 'Electrostatic paint spraying or electrostatic precipitators are valid.')
        ]
    },
    'magnetism-electromagnets.html': {
        'topic': 'Magnetism and Electromagnets',
        'subtitle': 'GCSE guide. Magnetic fields, electromagnet design, motor effect, and practical applications.',
        'eqs': ['magnetic field lines go from north to south outside a magnet', 'force on a current-carrying wire depends on field strength, current, and wire length', 'transformer relationships link turns and potential difference'],
        'practical': 'Practical contexts include plotting magnetic field patterns and investigating factors affecting electromagnet strength.',
        'examples': [('A transformer has 200 primary turns and 50 secondary turns with 12 V primary', 'Vs/Vp = Ns/Np so Vs = 12 x 50/200 = 3.0 V'), ('An electromagnet lifting test: 1.0 A current lifts 12 paper clips, 2.0 A lifts 25', 'increased current generally increases magnetic strength'), ('A relay coil is energized', 'temporary magnetic field closes switch and controls high-current circuit safely')],
        'quiz': [
            ('What is the direction of magnetic field lines outside a bar magnet?', 'From north pole to south pole.'),
            ('Name one way to make an electromagnet stronger.', 'Increase current, increase turns, or add a soft iron core.'),
            ('Why is soft iron used in many electromagnets?', 'It magnetizes and demagnetizes easily.'),
            ('Find secondary voltage: Np=500, Ns=100, Vp=230 V.', '46 V.'),
            ('State one application of electromagnets.', 'Relays, scrapyard cranes, electric bells, or speakers.'),
            ('What does Fleming\'s left-hand rule predict?', 'Direction of force/motion for a current-carrying conductor in a magnetic field.')
        ]
    },
    'waves-reflection-refraction.html': {
        'topic': 'Waves: Reflection and Refraction',
        'subtitle': 'GCSE guide. Wave behaviour at boundaries, ray diagrams, and quantitative wave calculations.',
        'eqs': ['wave speed = frequency x wavelength', 'angle of incidence = angle of reflection', 'refraction changes direction due to speed change in different media'],
        'practical': 'Required practical work often measures wave speed in a ripple tank or spring and investigates reflection/refraction using ray boxes.',
        'examples': [('A wave has frequency 12 Hz and wavelength 0.25 m', 'speed = 12 x 0.25 = 3.0 m/s'), ('Light ray hits mirror at 35 degrees to normal', 'reflection angle = 35 degrees'), ('Light enters glass and speed falls', 'ray bends toward the normal during refraction')],
        'quiz': [
            ('State the wave equation.', 'Wave speed = frequency x wavelength.'),
            ('Find frequency for speed 340 m/s and wavelength 0.68 m.', '500 Hz.'),
            ('What is the angle of reflection if incidence is 22 degrees?', '22 degrees.'),
            ('Why does refraction happen?', 'Wave speed changes when entering a different medium.'),
            ('Do waves speed up or slow down entering denser optical media?', 'They usually slow down.'),
            ('Name one use of refraction in technology.', 'Lenses in cameras, glasses, microscopes, or telescopes.')
        ]
    },
    'light-lenses.html': {
        'topic': 'Light and Lenses',
        'subtitle': 'GCSE guide. Image formation, lens behaviour, ray diagrams, and eye-correction context.',
        'eqs': ['magnification = image height / object height', 'convex lenses can converge rays to a focal point', 'concave lenses diverge rays'],
        'practical': 'Practical contexts include determining focal length and forming real images on screens with convex lenses.',
        'examples': [('Object height 2.0 cm forms image height 5.0 cm', 'magnification = 5.0 / 2.0 = 2.5'), ('A lens forms image 30 cm from lens when object distance is adjusted', 'that setup can be used to estimate focal length with ray methods'), ('A person with short sight uses a lens', 'concave lens spreads rays before the eye lens so focus moves onto retina')],
        'quiz': [
            ('What type of lens converges parallel rays?', 'Convex lens.'),
            ('Define magnification.', 'Image height divided by object height.'),
            ('Find magnification: image 6 cm, object 3 cm.', '2.'),
            ('Which lens is used for long sight correction?', 'Convex lens.'),
            ('Can a convex lens form a real image?', 'Yes, when the object is beyond the focal length.'),
            ('Name one safety point when using ray boxes/lasers.', 'Avoid shining bright beams into eyes and keep beam paths controlled.')
        ]
    },
    'sound-waves.html': {
        'topic': 'Sound Waves',
        'subtitle': 'GCSE guide. Longitudinal waves, pitch, loudness, echoes, and ultrasound applications.',
        'eqs': ['wave speed = frequency x wavelength', 'distance = speed x time', 'echo distance = (speed x time)/2 for round-trip reflections'],
        'practical': 'Required practical contexts include measuring sound speed with echoes or oscilloscopes and comparing waveforms.',
        'examples': [('A sound has frequency 680 Hz and speed 340 m/s', 'wavelength = 340 / 680 = 0.50 m'), ('Echo heard after 0.40 s with speed 340 m/s', 'distance to wall = 340 x 0.40 / 2 = 68 m'), ('A tone increases from 200 Hz to 400 Hz', 'pitch is higher because frequency increases')],
        'quiz': [
            ('Are sound waves longitudinal or transverse in air?', 'Longitudinal.'),
            ('Find wavelength: speed 330 m/s, frequency 660 Hz.', '0.50 m.'),
            ('What physical quantity mainly determines pitch?', 'Frequency.'),
            ('Why divide by 2 in echo distance calculations?', 'The sound travels to the object and back.'),
            ('Name one use of ultrasound.', 'Medical imaging, cleaning, or industrial crack detection.'),
            ('Can sound travel through a vacuum?', 'No, it needs a medium of particles.')
        ]
    },
    'atomic-structure.html': {
        'topic': 'Atomic Structure',
        'subtitle': 'GCSE guide. Atoms, isotopes, electron arrangement, and development of atomic models.',
        'eqs': ['atomic number = number of protons', 'mass number = protons + neutrons', 'for neutral atoms: electrons = protons'],
        'practical': 'Exam-style practical links include interpreting scattering evidence and using spectroscopy ideas to infer atomic structure.',
        'examples': [('An atom has 11 protons and 12 neutrons', 'atomic number = 11, mass number = 23'), ('A neutral atom has atomic number 17', 'it has 17 electrons'), ('Carbon-14 and carbon-12', 'same proton number but different neutron numbers, so they are isotopes')],
        'quiz': [
            ('What charge does a proton have?', '+1 relative charge.'),
            ('Define isotope.', 'Atoms of the same element with different numbers of neutrons.'),
            ('How many electrons in neutral magnesium (atomic number 12)?', '12 electrons.'),
            ('Find neutron number for mass 56 and atomic number 26.', '30 neutrons.'),
            ('Which experiment supported the nuclear model?', 'Rutherford/Geiger/Marsden alpha scattering experiment.'),
            ('Where is most atomic mass concentrated?', 'In the nucleus.')
        ]
    },
    'nuclear-radiation.html': {
        'topic': 'Nuclear Radiation',
        'subtitle': 'GCSE guide. Alpha, beta, gamma properties, half-life, hazards, and safety controls.',
        'eqs': ['activity is measured in becquerels (decays per second)', 'count rate decreases exponentially with time due to half-life', 'safe practice uses time, distance, and shielding controls'],
        'practical': 'Required practical contexts involve measuring count rate safely at different distances or shielding thicknesses while accounting for background radiation.',
        'examples': [('A source starts at 1600 counts/min and half-life is 3 h', 'after 6 h activity is 400 counts/min'), ('Background is 20 counts/min and measured total is 95', 'corrected count rate = 75 counts/min'), ('Dose rate is reduced by doubling distance from a point source', 'intensity decreases strongly with distance, so exposure falls')],
        'quiz': [
            ('Which radiation is most ionizing?', 'Alpha.'),
            ('Which radiation is most penetrating?', 'Gamma.'),
            ('Define half-life.', 'Time taken for activity/count rate/number of undecayed nuclei to fall to half.'),
            ('A source falls from 800 to 100 counts/s. How many half-lives?', 'Three half-lives.'),
            ('Name one suitable shielding material for beta.', 'Aluminium.'),
            ('Why subtract background count?', 'To isolate the source contribution and improve validity.')
        ]
    },
    'radioactivity.html': {
        'topic': 'Radioactivity',
        'subtitle': 'GCSE guide. Decay processes, nuclear equations, risk-benefit evaluation, and applications.',
        'eqs': ['radioactive decay is random but predictable for large samples', 'nuclear equations conserve mass number and atomic number', 'activity decreases exponentially with time'],
        'practical': 'Typical practical contexts include plotting decay curves, evaluating shielding, and handling count-rate uncertainty.',
        'examples': [('Uranium-238 alpha decay', 'mass number decreases by 4 and atomic number decreases by 2'), ('A sample has activity 320 Bq and half-life 5 days', 'after 10 days activity = 80 Bq'), ('Detector reads 140 counts/min with background 18', 'corrected source count = 122 counts/min')],
        'quiz': [
            ('What does 1 becquerel mean?', 'One decay per second.'),
            ('What changes in beta-minus decay?', 'A neutron changes to a proton and an electron is emitted.'),
            ('If activity halves every 2 h, what fraction remains after 6 h?', 'One eighth.'),
            ('State one medical use of radioisotopes.', 'Imaging tracers or radiotherapy.'),
            ('Why is radioactive decay called random?', 'You cannot predict exactly when one nucleus will decay.'),
            ('What must be conserved in nuclear equations?', 'Mass number and atomic number.')
        ]
    },
    'space-physics-gcse.html': {
        'topic': 'Space Physics',
        'subtitle': 'GCSE guide. Solar system motion, stellar life cycle, red-shift evidence, and observation methods.',
        'eqs': ['orbital speed depends on gravitational attraction and orbital radius', 'apparent brightness decreases with distance', 'red-shift indicates increasing wavelength from receding galaxies'],
        'practical': 'Assessment contexts include interpreting telescope data, orbital periods, and evidence supporting the Big Bang model.',
        'examples': [('Light from a distant galaxy shows shifted spectral lines to longer wavelength', 'this is red-shift evidence that the galaxy is moving away'), ('A moon takes 27 days to orbit its planet at roughly constant radius', 'period and orbital motion data can infer gravitational influence'), ('A star\'s brightness appears four times lower', 'one possible interpretation is roughly double the distance under inverse-square behaviour')],
        'quiz': [
            ('What causes day and night on Earth?', 'Earth rotating on its axis.'),
            ('What is red-shift evidence used to support?', 'An expanding universe and the Big Bang model.'),
            ('Name the stage after a main sequence star for Sun-like stars.', 'Red giant.'),
            ('What keeps planets in orbit?', 'Gravitational attraction providing centripetal force.'),
            ('Why are telescopes placed in space?', 'To avoid atmospheric distortion/absorption of certain wavelengths.'),
            ('What is a light year?', 'The distance light travels in one year.')
        ]
    }
}

for f in files:
    if f.name not in profiles:
        profiles[f.name] = profiles['forces-and-newtons-laws.html']

for f in files:
    text = f.read_text(encoding='utf-8')
    p = profiles[f.name]

    title_m = re.search(r'<title>(.*?)</title>', text, re.S)
    title = title_m.group(1).strip() if title_m else f"{p['topic']} - GCSE Physics"
    h1_m = re.search(r'<h1>(.*?)</h1>', text, re.S)
    h1 = h1_m.group(1).strip() if h1_m else p['topic']
    desc_m = re.search(r'<h1>.*?</h1>\s*<p>(.*?)</p>', text, re.S)
    desc = desc_m.group(1).strip() if desc_m else p['subtitle']
    nav_m = re.search(r'(<div class="content-nav">[\s\S]*?</div>)', text)
    nav = nav_m.group(1) if nav_m else '<div class="content-nav"><a href="../index.html">&larr; Physics Subjects Catalog</a></div>'

    prereq_idx = text.find('<div class="card progression-card prerequisites-card">')
    footer_idx = text.find('<p class="page-footer-note">')
    progression = ''
    if prereq_idx != -1 and footer_idx != -1 and prereq_idx < footer_idx:
        progression = text[prereq_idx:footer_idx].strip()

    eq_list = ''.join(f'<li><code>{e}</code>.</li>' for e in p['eqs'])
    ex_rows = ''.join(f'<tr><td>{q}</td><td>{a}</td></tr>' for q, a in p['examples'])
    quiz_q = ''.join(f'<li>{q}</li>' for q, _ in p['quiz'])
    quiz_a = ''.join(f'<li>{a}</li>' for _, a in p['quiz'])

    cards = f'''
      <div class="card">
        <h2>1) Conceptual foundation</h2>
        <p>{h1} at GCSE level is not only about recalling definitions. It is about building a coherent physical model that can be tested using evidence, calculations, and reasoning. In exam questions, students who score highest usually connect three strands clearly: the scientific idea, the measurable quantities, and the quality of the evidence used to support a conclusion.</p>
        <p>To study this topic thoroughly, begin by identifying what the system is and what may change. Then identify the variable you are measuring and the variables you must keep controlled. This simple habit turns vague revision into analytical revision and makes required practical questions much easier because your method and conclusions become logically linked.</p>
        <p>When answering extended responses, use full scientific language and avoid one-line statements. Show cause-and-effect reasoning, include units where relevant, and write in complete sentences. Examiners reward explanations that show why a change happens, not just that it happens.</p>
        <div class="callout"><strong>Learning anchor:</strong> Treat each question as model + measurement + evaluation. This structure consistently improves both short-answer accuracy and 6-mark response quality.</div>
      </div>

      <div class="card">
        <h2>2) Core quantities and language precision</h2>
        <p>Strong GCSE answers depend on precise vocabulary. Terms that seem similar in everyday language often have strict meanings in physics. A common source of lost marks is mixing definitions, missing units, or failing to specify conditions such as "constant temperature" or "in a closed system" where those conditions matter.</p>
        <p>Build revision fluency by pairing every key term with symbol, unit, and one worked sentence. This prevents memory from becoming list-based only and trains you to use terminology correctly under exam pressure.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Key expression</th><th>How to use it in answers</th></tr>
            </thead>
            <tbody>
              <tr><td>Define clearly</td><td>State what quantity changes, and include unit context when appropriate.</td></tr>
              <tr><td>Use proportional language</td><td>Use "directly proportional", "inversely proportional", or "increases/decreases" accurately.</td></tr>
              <tr><td>Reference conditions</td><td>Mention fixed variables (for example constant mass, pressure, or temperature) where required.</td></tr>
              <tr><td>Finish with units</td><td>Every numerical result should end with a valid SI or expected exam unit.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="warning"><strong>Exam warning:</strong> Correct arithmetic with the wrong unit can still lose method marks. Unit discipline is part of the physics.</div>
      </div>

      <div class="card">
        <h2>3) Key equations and model links</h2>
        <p>Equations are compact statements of the model, not isolated formulas to memorize blindly. Before substituting numbers, state what each symbol means in your specific question. This habit catches many mistakes, especially when two equations use similar symbols differently in different topics.</p>
        <p>For this topic, these equations and relationships are central:</p>
        <ul>
          {eq_list}
        </ul>
        <p>In high-quality exam responses, each equation should be followed by a short interpretation sentence: what does the result imply physically? For example, if a value doubles, explain whether that means faster transfer, greater turning effect, stronger interaction, or reduced uncertainty depending on context.</p>
        <div class="two-col">
          <div>
            <h3>Method sequence</h3>
            <p class="mini">Write equation first, substitute with units, calculate carefully, then round appropriately and check if your answer is physically realistic.</p>
          </div>
          <div>
            <h3>Validation check</h3>
            <p class="mini">Ask if the sign, scale, and unit make sense for the real system. If not, recheck conversions and symbol choice.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>4) Worked numerical examples</h2>
        <p>Practising complete worked examples builds confidence and exam speed. Do not skip intermediate lines during revision; showing each step trains the same structure you need in formal assessment where method marks are available.</p>
        <p>The examples below use realistic GCSE-style values and include explicit units.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Question prompt</th><th>Worked answer</th></tr>
            </thead>
            <tbody>
              {ex_rows}
            </tbody>
          </table>
        </div>
        <p>After each example, perform a reasonableness check. If your answer is unexpectedly large or small, check powers of ten, time unit conversions (seconds vs minutes vs hours), and whether a formula needed rearrangement. This reflective step reduces repeated errors across full papers.</p>
        <div class="callout"><strong>Performance tip:</strong> In exam conditions, write enough working to recover from arithmetic slips. A transparent method often secures partial credit.</div>
      </div>

      <div class="card">
        <h2>5) Required practical and evidence quality</h2>
        <p>{p['practical']}</p>
        <p>A high-mark practical write-up separates three ideas: procedure, results pattern, and evaluation. First describe what was measured and how control variables were handled. Next state what the data trend shows using numbers from your table or graph. Finally evaluate reliability and validity with one realistic improvement.</p>
        <p>In practical contexts, aim to discuss repeat measurements, anomaly handling, instrument precision, and whether the method truly tests the intended relationship. These evaluation points are transferable across GCSE topics and regularly appear in 4- to 6-mark questions.</p>
        <div class="two-col">
          <div>
            <h3>Reliability focus</h3>
            <p class="mini">Take repeats, calculate means, keep intervals consistent, and identify anomalous points with a justified decision to retain or exclude them.</p>
          </div>
          <div>
            <h3>Validity focus</h3>
            <p class="mini">Control non-tested variables, calibrate or zero instruments, and explain why your setup actually measures the target physics relationship.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>6) Exam technique and command words</h2>
        <p>Command words control what examiners expect. "State" needs concise factual recall, "describe" needs observable features, "explain" needs mechanism, and "evaluate" needs balanced judgement with evidence. Many students know the science but lose marks by answering the wrong command level.</p>
        <p>For calculations, use a dependable structure: list known values, choose the equation, substitute with units, solve, then give final units and suitable significant figures. For explanations, use a claim-evidence-reason pattern and include at least one data value where possible.</p>
        <p>For six-mark questions, a short plan before writing can raise marks significantly. Draft one line for model, one line for evidence, and one line for judgement. Then write full linked sentences. This keeps answers analytical rather than repetitive.</p>
        <div class="warning"><strong>Banding risk:</strong> Descriptive writing without mechanism words such as "because", "therefore", and "so" often caps your response in lower bands.</div>
      </div>

      <div class="card">
        <h2>7) Misconceptions, synoptic links, and application</h2>
        <p>Misconceptions are expensive because they seem plausible. To fix them, write each mistaken idea, then rewrite the corrected concept in your own words, then add one numerical or practical example that proves the corrected version. This transforms passive reading into active understanding.</p>
        <p>This topic also links to mathematics (graph gradients, proportion, rearranging equations), engineering judgement (efficiency, safety, design trade-offs), and data literacy (uncertainty, repeatability, and trend interpretation). Building those links now improves retention and prepares you for post-GCSE physics.</p>
        <p>A useful challenge routine is predict-then-calculate: change one variable in a worked example, predict the outcome direction first, then calculate and compare. If prediction and result disagree, identify exactly which assumption failed. This is high-value revision.</p>
        <div class="two-col">
          <div>
            <h3>Correction drill</h3>
            <p class="mini">Turn one common misconception into a mini flashcard: incorrect statement, corrected statement, and one evidence-backed example.</p>
          </div>
          <div>
            <h3>Synoptic extension</h3>
            <p class="mini">Connect one equation from this topic to a different chapter and explain how the same mathematical form appears in a new context.</p>
          </div>
        </div>
        <div class="callout"><strong>Revision habit:</strong> Keep an "expensive mistakes" list after each paper and revisit it weekly to target the errors that cost the most marks.</div>
      </div>

      <div class="card">
        <h2>8) Quiz (6 questions)</h2>
        <p>Use this short quiz for retrieval practice. Attempt all questions without notes, then check your responses and rewrite any weak answer in full exam-style language.</p>
        <div class="quiz">
          <ol>{quiz_q}</ol>
        </div>
        <details class="quiz-answers">
          <summary class="quiz-answers__summary">Show answers</summary>
          <ol class="quiz-answers__list">{quiz_a}</ol>
        </details>
        <p class="mini">Marking guidance: award yourself full credit only when the numerical value, unit, and scientific phrasing are all correct.</p>
      </div>

      <div class="card">
        <h2>9) Extended consolidation and exam-readiness</h2>
        <p>Consolidation work is where understanding becomes durable. After completing a topic, revisit it using mixed question styles: short definition items, multi-step calculations, graph interpretation, practical evaluation, and longer explanation prompts. This variety ensures your knowledge is flexible rather than tied to one familiar wording pattern.</p>
        <p>A high-yield routine is to complete one timed section, then perform a second pass focused only on quality of communication. On that second pass, check each answer for unit clarity, variable naming, and logical linking words. This process often recovers marks without requiring any new content knowledge.</p>
        <p>Use deliberate practice with spacing: revisit this topic after one day, one week, and one month. Each revisit should include at least one numerical problem, one concept explanation, and one practical-evaluation sentence. Spaced retrieval is far more effective than one long cramming session, especially for topics that combine equations and interpretation.</p>
        <p>As you approach exams, blend this topic with related chapters in one session. For example, pair calculations with graph reasoning, then include a required practical critique. Synoptic practice mirrors real papers and improves your ability to identify which idea applies when a question includes unfamiliar context or extra data.</p>
        <div class="callout"><strong>Final check:</strong> if you can explain the model, complete multi-step calculations with units, evaluate practical evidence, and correct common misconceptions, you are working at a strong GCSE Physics standard.</div>
      </div>
'''

    output = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="../../../assets/css/corporate.css">
  <script src="../../../assets/js/site-layout.js" defer></script>
  <title>{title}</title>
</head>
<body class="content-page">
  <div class="page-container">
    <div class="content-hero">
      <nav class="page-hero-breadcrumb" aria-label="Breadcrumb">
        <a href="../../../index.html">&larr; Back to Hub</a>
      </nav>
      <h1>{h1}</h1>
      <p>{desc}</p>
      {nav}
    </div>
    <div class="content-body">
{cards}
{progression}

      <p class="page-footer-note">GCSE Physics content.</p>
    </div>
  </div>
</body>
</html>
'''

    f.write_text(output, encoding='utf-8')

print(f'Updated {len(files)} files.')
