window.VARIABLE_REF_DETAILS = {
  P: {
    symbol: '\\( P \\)',
    title: 'True Power',
    explain: 'True power (real power) is the portion of electrical power that performs useful work — such as producing heat, light, or mechanical motion. It is measured in watts (W) and is the power your electricity meter effectively bills for in resistive or mixed loads.',
    example: 'A 230 V appliance drawing 10 A of in-phase current delivers true power:<br>\\( P = V \\times I = 230 \\times 10 = 2{,}300 \\text{ W} \\) (2.3 kW).'
  },
  Q: {
    symbol: '\\( Q \\)',
    title: 'Reactive Power',
    explain: 'Reactive power is the power that oscillates between the source and reactive components (inductors and capacitors). It does not perform net work but is needed to establish magnetic or electric fields in motors, transformers, and fluorescent lighting. Measured in volt-amperes reactive (VAR).',
    example: 'If apparent power \\( S = 5{,}000 \\text{ VA} \\) and true power \\( P = 4{,}000 \\text{ W} \\):<br>\\( Q = \\sqrt{S^2 - P^2} = \\sqrt{5000^2 - 4000^2} = 3{,}000 \\text{ VAR} \\).'
  },
  S: {
    symbol: '\\( S \\)',
    title: 'Apparent Power',
    explain: 'Apparent power is the product of voltage and current in an AC circuit, before accounting for phase difference. It represents the total power the supply must deliver, measured in volt-amperes (VA).',
    example: 'A single-phase load at 230 V drawing 10 A has:<br>\\( S = V \\times I = 230 \\times 10 = 2{,}300 \\text{ VA} \\).'
  },
  V_L: {
    symbol: '\\( V_L \\)',
    title: 'Line Voltage',
    explain: 'Line voltage is the voltage measured between any two live conductors in a three-phase system. It is the value typically quoted for industrial supplies (e.g. 400 V in the UK).',
    example: 'A UK three-phase supply is commonly quoted as 400 V line-to-line, so \\( V_L = 400 \\text{ V} \\) between any two phases.'
  },
  V_Ph: {
    symbol: '\\( V_{Ph} \\)',
    title: 'Phase Voltage',
    explain: 'Phase voltage is the voltage across a single phase winding, or between one phase and neutral in a star (wye) connection. In a balanced star system, phase voltage is line voltage divided by \\( \\sqrt{3} \\).',
    example: 'For a 400 V star-connected supply:<br>\\( V_{Ph} = \\dfrac{V_L}{\\sqrt{3}} = \\dfrac{400}{1.732} \\approx 231 \\text{ V} \\).'
  },
  I_L: {
    symbol: '\\( I_L \\)',
    title: 'Line Current',
    explain: 'Line current is the current flowing in each of the three supply conductors (lines) feeding a three-phase load.',
    example: 'An 11 kW motor on a 400 V three-phase supply with power factor 0.85:<br>\\( I_L = \\dfrac{P}{\\sqrt{3} \\times V_L \\times PF} = \\dfrac{11000}{\\sqrt{3} \\times 400 \\times 0.85} \\approx 18.7 \\text{ A} \\).'
  },
  I_Ph: {
    symbol: '\\( I_{Ph} \\)',
    title: 'Phase Current',
    explain: 'Phase current is the current through an individual phase of the load. In a star connection, line current equals phase current. In a delta connection, line current is \\( \\sqrt{3} \\) times phase current.',
    example: 'Star connection with \\( I_L = 10 \\text{ A} \\): \\( I_{Ph} = 10 \\text{ A} \\).<br>Delta connection with \\( I_L = 10 \\text{ A} \\): \\( I_{Ph} = \\dfrac{10}{\\sqrt{3}} \\approx 5.8 \\text{ A} \\).'
  },
  PF: {
    symbol: '\\( PF \\)',
    title: 'Power Factor',
    explain: 'Power factor is the ratio of true power to apparent power, equal to \\( \\cos(\\theta) \\) where \\( \\theta \\) is the phase angle between voltage and current. A value of 1.0 means voltage and current are in phase; lower values indicate more reactive content.',
    example: 'A load consumes \\( P = 800 \\text{ W} \\) with \\( S = 1{,}000 \\text{ VA} \\):<br>\\( PF = \\dfrac{P}{S} = \\dfrac{800}{1000} = 0.8 \\).'
  },
  RF: {
    symbol: '\\( RF \\)',
    title: 'Reactive Factor',
    explain: 'The reactive factor is \\( \\sin(\\theta) \\), the trigonometric companion to power factor. It indicates the fraction of apparent power associated with the reactive component and is used when calculating reactive power directly.',
    example: 'If \\( PF = \\cos(\\theta) = 0.8 \\), then \\( \\theta \\approx 37° \\) and<br>\\( RF = \\sin(\\theta) \\approx 0.6 \\).'
  },
  R: {
    symbol: '\\( R \\)',
    title: 'Resistance',
    explain: 'Resistance is the opposition to electric current in a conductor or resistor, converting electrical energy to heat. Measured in ohms (\\( \\Omega \\)). Defined by Ohm\'s law: \\( R = V / I \\).',
    example: 'A 12 V circuit with 2 A flowing through a resistor:<br>\\( R = \\dfrac{V}{I} = \\dfrac{12}{2} = 6 \\, \\Omega \\).'
  },
  X_L: {
    symbol: '\\( X_L \\)',
    title: 'Inductive Reactance',
    explain: 'Inductive reactance is the opposition to alternating current offered by an inductor. It increases with frequency and inductance: \\( X_L = 2\\pi f L \\). Measured in ohms (\\( \\Omega \\)).',
    example: 'An inductor of 0.1 H on a 50 Hz supply:<br>\\( X_L = 2\\pi \\times 50 \\times 0.1 \\approx 31.4 \\, \\Omega \\).'
  },
  X_C: {
    symbol: '\\( X_C \\)',
    title: 'Capacitive Reactance',
    explain: 'Capacitive reactance is the opposition to alternating current offered by a capacitor. It decreases with frequency and capacitance: \\( X_C = 1 / (2\\pi f C) \\). Measured in ohms (\\( \\Omega \\)).',
    example: 'A 100 μF capacitor on a 50 Hz supply:<br>\\( X_C = \\dfrac{1}{2\\pi \\times 50 \\times 100 \\times 10^{-6}} \\approx 31.8 \\, \\Omega \\).'
  },
  Z: {
    symbol: '\\( Z \\)',
    title: 'Impedance',
    explain: 'Impedance is the total opposition to AC current in a circuit, combining resistance and reactance. For a series R–X circuit: \\( Z = \\sqrt{R^2 + X^2} \\). Measured in ohms (\\( \\Omega \\)).',
    example: 'A circuit with \\( R = 6 \\, \\Omega \\) and \\( X_L = 8 \\, \\Omega \\):<br>\\( Z = \\sqrt{6^2 + 8^2} = \\sqrt{100} = 10 \\, \\Omega \\).'
  },
  f: {
    symbol: '\\( f \\)',
    title: 'Frequency',
    explain: 'Frequency is the number of complete AC cycles per second, measured in hertz (Hz). It determines how quickly voltage and current alternate and affects reactance values.',
    example: 'UK mains electricity alternates 50 times per second, so \\( f = 50 \\text{ Hz} \\). North American mains is typically \\( f = 60 \\text{ Hz} \\).'
  },
  E: {
    symbol: '\\( E \\)',
    title: 'Energy',
    explain: 'Electrical energy is the total work done over time, equal to power multiplied by time. Measured in joules (J). Utility bills often use kilowatt-hours (kWh), where 1 kWh = 3.6 MJ.',
    example: 'A 2 kW heater running for 3 hours:<br>\\( E = P \\times t = 2000 \\times 3 \\times 3600 = 21.6 \\text{ MJ} \\) (or 6 kWh).'
  },
  cos_theta: {
    symbol: '\\( \\cos(\\theta) \\)',
    title: 'Cosine of Phase Angle',
    explain: 'The cosine of the phase angle \\( \\theta \\) (between voltage and current waveforms) gives the power factor. It represents what fraction of apparent power is converted to true power.',
    example: 'If the phase angle \\( \\theta = 30° \\):<br>\\( \\cos(\\theta) = \\cos(30°) \\approx 0.866 \\), so about 86.6% of apparent power is real power.'
  },
  sin_theta: {
    symbol: '\\( \\sin(\\theta) \\)',
    title: 'Sine of Phase Angle',
    explain: 'The sine of the phase angle \\( \\theta \\) is used to calculate the reactive power component. Together with \\( \\cos(\\theta) \\), it describes how apparent power splits between real and reactive parts.',
    example: 'If the phase angle \\( \\theta = 30° \\):<br>\\( \\sin(\\theta) = \\sin(30°) = 0.5 \\). With \\( S = 1{,}000 \\text{ VA} \\), then \\( Q = S \\times \\sin(\\theta) = 500 \\text{ VAR} \\).'
  }
};
