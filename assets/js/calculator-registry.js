(function () {
  'use strict';

  var META = {
    "ohms_law_calculator.html": {
      "title": "Ohm's Law Calculator",
      "lead": "Calculate resistance from voltage and current.",
      "formula": "$$ R = \\frac{V}{I} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "voltage",
          "label": "Voltage (V)",
          "type": "number",
          "value": "24",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "current",
          "label": "Current (I)",
          "type": "number",
          "value": "3",
          "unit": "A",
          "step": null,
          "options": []
        }
      ]
    },
    "delta_three_phase_power.html": {
      "title": "Delta Power Calculator",
      "lead": "Three-phase delta connection using line values.",
      "formula": "$$ P = \\sqrt{3} \\times V_L \\times I_L \\times \\cos(\\theta) $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "voltage",
          "label": "Line Voltage (VL)",
          "type": "number",
          "value": "400",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "current",
          "label": "Line Current (IL)",
          "type": "number",
          "value": "50",
          "unit": "A",
          "step": null,
          "options": []
        },
        {
          "id": "powerFactor",
          "label": "Power Factor",
          "type": "number",
          "value": "0.9",
          "unit": "—",
          "step": "0.01",
          "options": []
        }
      ]
    },
    "star_three_phase_power.html": {
      "title": "Star Power Calculator",
      "lead": "Three-phase star connection using line values.",
      "formula": "$$ P = \\sqrt{3} \\times V_L \\times I_L \\times \\cos(\\theta) $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "voltage",
          "label": "Line Voltage (VL)",
          "type": "number",
          "value": "400",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "current",
          "label": "Line Current (IL)",
          "type": "number",
          "value": "20",
          "unit": "A",
          "step": null,
          "options": []
        },
        {
          "id": "powerFactor",
          "label": "Power Factor",
          "type": "number",
          "value": "0.92",
          "unit": "—",
          "step": "0.01",
          "options": []
        }
      ]
    },
    "dc_power_calculator.html": {
      "title": "DC Power Calculator",
      "lead": "Calculate power from voltage and current.",
      "formula": "$$ P = V \\times I $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "voltage",
          "label": "Voltage (V)",
          "type": "number",
          "value": "12",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "current",
          "label": "Current (I)",
          "type": "number",
          "value": "5",
          "unit": "A",
          "step": null,
          "options": []
        }
      ]
    },
    "unit_converter_energy.html": {
      "title": "Energy Unit Converter",
      "lead": "Convert between Joules and kWh.",
      "formula": null,
      "buttonLabel": "Convert",
      "fields": [
        {
          "id": "unit",
          "label": "From",
          "type": "select",
          "value": "",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "j",
              "label": "Joules"
            },
            {
              "value": "kwh",
              "label": "kWh"
            }
          ]
        },
        {
          "id": "value",
          "label": "Value",
          "type": "number",
          "value": "3600000",
          "unit": "-",
          "step": null,
          "options": []
        }
      ]
    },
    "energy_cost_calculator.html": {
      "title": "Energy & Cost Calculator",
      "lead": "Calculate energy consumption and electricity cost.",
      "formula": "$$ E = P \\times t $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "power",
          "label": "Power (P)",
          "type": "number",
          "value": "2000",
          "unit": "W",
          "step": null,
          "options": []
        },
        {
          "id": "hours",
          "label": "Time (t)",
          "type": "number",
          "value": "3",
          "unit": "h",
          "step": null,
          "options": []
        },
        {
          "id": "rate",
          "label": "Cost Rate",
          "type": "number",
          "value": "0.28",
          "unit": "p/kWh",
          "step": "0.01",
          "options": []
        }
      ]
    },
    "unit_converter_frequency.html": {
      "title": "Frequency Unit Converter",
      "lead": "Convert between Hz, kHz, and MHz.",
      "formula": null,
      "buttonLabel": "Convert",
      "fields": [
        {
          "id": "unit",
          "label": "From",
          "type": "select",
          "value": "",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "hz",
              "label": "Hz"
            },
            {
              "value": "khz",
              "label": "kHz"
            },
            {
              "value": "mhz",
              "label": "MHz"
            }
          ]
        },
        {
          "id": "value",
          "label": "Value",
          "type": "number",
          "value": "50",
          "unit": "-",
          "step": null,
          "options": []
        }
      ]
    },
    "ac_power_calculator.html": {
      "title": "AC Power Calculator",
      "lead": "Single-phase true power with power factor.",
      "formula": "$$ P = V \\times I \\times \\cos(\\theta) $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "voltage",
          "label": "Voltage (V)",
          "type": "number",
          "value": "230",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "current",
          "label": "Current (I)",
          "type": "number",
          "value": "10",
          "unit": "A",
          "step": null,
          "options": []
        },
        {
          "id": "powerFactor",
          "label": "Power Factor",
          "type": "number",
          "value": "0.9",
          "unit": "—",
          "step": "0.01",
          "options": []
        }
      ]
    },
    "resistor_color_code_calculator.html": {
      "title": "Resistor Colour Code",
      "lead": "Decode 4-band resistor colour codes.",
      "formula": null,
      "buttonLabel": "Decode",
      "fields": [
        {
          "id": "b1",
          "label": "Band 1",
          "type": "select",
          "value": "4",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "0",
              "label": "Black"
            },
            {
              "value": "1",
              "label": "Brown"
            },
            {
              "value": "2",
              "label": "Red"
            },
            {
              "value": "3",
              "label": "Orange"
            },
            {
              "value": "4",
              "label": "Yellow"
            },
            {
              "value": "5",
              "label": "Green"
            },
            {
              "value": "6",
              "label": "Blue"
            },
            {
              "value": "7",
              "label": "Violet"
            },
            {
              "value": "8",
              "label": "Grey"
            },
            {
              "value": "9",
              "label": "White"
            }
          ]
        },
        {
          "id": "b2",
          "label": "Band 2",
          "type": "select",
          "value": "7",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "0",
              "label": "Black"
            },
            {
              "value": "1",
              "label": "Brown"
            },
            {
              "value": "2",
              "label": "Red"
            },
            {
              "value": "3",
              "label": "Orange"
            },
            {
              "value": "4",
              "label": "Yellow"
            },
            {
              "value": "5",
              "label": "Green"
            },
            {
              "value": "6",
              "label": "Blue"
            },
            {
              "value": "7",
              "label": "Violet"
            },
            {
              "value": "8",
              "label": "Grey"
            },
            {
              "value": "9",
              "label": "White"
            }
          ]
        },
        {
          "id": "b3",
          "label": "Multiplier",
          "type": "select",
          "value": "2",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "0",
              "label": "Black x1"
            },
            {
              "value": "1",
              "label": "Brown x10"
            },
            {
              "value": "2",
              "label": "Red x100"
            },
            {
              "value": "3",
              "label": "Orange x1k"
            },
            {
              "value": "4",
              "label": "Yellow x10k"
            },
            {
              "value": "5",
              "label": "Green x100k"
            },
            {
              "value": "6",
              "label": "Blue x1M"
            },
            {
              "value": "7",
              "label": "Gold x0.1"
            },
            {
              "value": "8",
              "label": "Silver x0.01"
            }
          ]
        },
        {
          "id": "b4",
          "label": "Tolerance",
          "type": "select",
          "value": "0",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "0",
              "label": "Gold +/-5%"
            },
            {
              "value": "1",
              "label": "Silver +/-10%"
            },
            {
              "value": "2",
              "label": "Brown +/-1%"
            }
          ]
        }
      ]
    },
    "power_triangle_converter.html": {
      "title": "Power Triangle Converter",
      "lead": "Convert between kW, kVA, and kVAR using power factor.",
      "formula": "$$ S = \\frac{P}{PF} \\quad Q = \\sqrt{S^2 - P^2} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "kw",
          "label": "True Power (P)",
          "type": "number",
          "value": "8",
          "unit": "kW",
          "step": null,
          "options": []
        },
        {
          "id": "pf",
          "label": "Power Factor",
          "type": "number",
          "value": "0.85",
          "unit": "-",
          "step": "0.01",
          "options": []
        }
      ]
    },
    "delta_phase_three_phase_power.html": {
      "title": "Delta Power (Phase Values)",
      "lead": "Three-phase delta connection using phase values.",
      "formula": "$$ P = 3 \\times V_{Ph} \\times I_{Ph} \\times \\cos(\\theta) $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "voltage",
          "label": "Phase Voltage (VPh)",
          "type": "number",
          "value": "400",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "current",
          "label": "Phase Current (IPh)",
          "type": "number",
          "value": "15",
          "unit": "A",
          "step": null,
          "options": []
        },
        {
          "id": "powerFactor",
          "label": "Power Factor",
          "type": "number",
          "value": "0.9",
          "unit": "—",
          "step": "0.01",
          "options": []
        }
      ]
    },
    "generator_efficiency_calculator.html": {
      "title": "Generator Efficiency",
      "lead": "Calculate generator efficiency from input and output power.",
      "formula": "$$ \\eta = \\frac{P_{out}}{P_{in}} \\times 100 $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "powerIn",
          "label": "Input Power",
          "type": "number",
          "value": "12000",
          "unit": "W",
          "step": null,
          "options": []
        },
        {
          "id": "powerOut",
          "label": "Output Power",
          "type": "number",
          "value": "10800",
          "unit": "W",
          "step": null,
          "options": []
        }
      ]
    },
    "unit_converter_voltage.html": {
      "title": "Voltage Unit Converter",
      "lead": "Convert between V and kV.",
      "formula": null,
      "buttonLabel": "Convert",
      "fields": [
        {
          "id": "unit",
          "label": "From",
          "type": "select",
          "value": "",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "v",
              "label": "Volts"
            },
            {
              "value": "kv",
              "label": "Kilovolts"
            }
          ]
        },
        {
          "id": "value",
          "label": "Value",
          "type": "number",
          "value": "11",
          "unit": "-",
          "step": null,
          "options": []
        }
      ]
    },
    "power_ohms_law_calculator.html": {
      "title": "Power (Ohm's Law) Calculator",
      "lead": "Calculate power using Ohm's law relationships.",
      "formula": "$$ P = I^2 R = \\frac{V^2}{R} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "voltage",
          "label": "Voltage (V)",
          "type": "number",
          "value": "230",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "resistance",
          "label": "Resistance (R)",
          "type": "number",
          "value": "46",
          "unit": "Ohm",
          "step": null,
          "options": []
        }
      ]
    },
    "db_converter.html": {
      "title": "dB / dBm Converter",
      "lead": "Convert between power ratio, dB, and dBm.",
      "formula": "$$ \\mathrm{dBm} = 10 \\log_{10}(P_{\\mathrm{mW}}); \\quad \\mathrm{dB} = 10 \\log_{10}\\left(\\frac{P_1}{P_2}\\right) $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "mode",
          "label": "Convert From",
          "type": "select",
          "value": "",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "dbm",
              "label": "dBm"
            },
            {
              "value": "mw",
              "label": "mW"
            },
            {
              "value": "db",
              "label": "dB (ratio)"
            }
          ]
        },
        {
          "id": "value",
          "label": "Value",
          "type": "number",
          "value": "10",
          "unit": "-",
          "step": null,
          "options": []
        }
      ]
    },
    "unit_converter_current.html": {
      "title": "Current Unit Converter",
      "lead": "Convert between A and mA.",
      "formula": null,
      "buttonLabel": "Convert",
      "fields": [
        {
          "id": "unit",
          "label": "From",
          "type": "select",
          "value": "",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "a",
              "label": "Amps"
            },
            {
              "value": "ma",
              "label": "Milliamps"
            }
          ]
        },
        {
          "id": "value",
          "label": "Value",
          "type": "number",
          "value": "250",
          "unit": "-",
          "step": null,
          "options": []
        }
      ]
    },
    "inverter_efficiency_calculator.html": {
      "title": "Inverter Efficiency",
      "lead": "Calculate inverter efficiency from DC input and AC output.",
      "formula": "$$ \\eta = \\frac{P_{AC}}{P_{DC}} \\times 100 $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "powerDC",
          "label": "DC Input Power",
          "type": "number",
          "value": "500",
          "unit": "W",
          "step": null,
          "options": []
        },
        {
          "id": "powerAC",
          "label": "AC Output Power",
          "type": "number",
          "value": "465",
          "unit": "W",
          "step": null,
          "options": []
        }
      ]
    },
    "tru_efficiency_calculator.html": {
      "title": "TRU Efficiency Calculator",
      "lead": "Calculate efficiency from input and output power.",
      "formula": "$$ \\eta = \\frac{P_{\\text{out}}}{P_{\\text{in}}} \\times 100 $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "powerIn",
          "label": "Power In (Pin)",
          "type": "number",
          "value": "500",
          "unit": "W",
          "step": null,
          "options": []
        },
        {
          "id": "powerOut",
          "label": "Power Out (Pout)",
          "type": "number",
          "value": "450",
          "unit": "W",
          "step": null,
          "options": []
        }
      ]
    },
    "logic_truth_table.html": {
      "title": "Logic Truth Table",
      "lead": "Generate truth tables for basic 2-input gates.",
      "formula": null,
      "buttonLabel": "Generate",
      "fields": [
        {
          "id": "gate",
          "label": "Gate",
          "type": "select",
          "value": "",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "and",
              "label": "AND"
            },
            {
              "value": "or",
              "label": "OR"
            },
            {
              "value": "nand",
              "label": "NAND"
            },
            {
              "value": "nor",
              "label": "NOR"
            },
            {
              "value": "xor",
              "label": "XOR"
            },
            {
              "value": "xnor",
              "label": "XNOR"
            }
          ]
        }
      ]
    },
    "power_factor_calculator.html": {
      "title": "Power Factor Calculator",
      "lead": "Calculate power factor from true and reactive power.",
      "formula": "$$ PF = \\frac{P}{S} \\quad \\text{where} \\quad S = \\sqrt{P^2 + Q^2} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "truePower",
          "label": "True Power (P)",
          "type": "number",
          "value": "1000",
          "unit": "W",
          "step": null,
          "options": []
        },
        {
          "id": "reactivePower",
          "label": "Reactive Power (Q)",
          "type": "number",
          "value": "500",
          "unit": "VAR",
          "step": null,
          "options": []
        }
      ]
    },
    "impedance_calculator.html": {
      "title": "Impedance Calculator",
      "lead": "Calculate total impedance from resistance and reactance.",
      "formula": "$$ Z = \\sqrt{R^2 + X^2} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "resistance",
          "label": "Resistance (R)",
          "type": "number",
          "value": "6",
          "unit": "Ohm",
          "step": null,
          "options": []
        },
        {
          "id": "reactance",
          "label": "Reactance (X)",
          "type": "number",
          "value": "8",
          "unit": "Ohm",
          "step": null,
          "options": []
        }
      ]
    },
    "motor_current_calculator.html": {
      "title": "Motor Current Calculator",
      "lead": "Estimate three-phase motor full-load current.",
      "formula": "$$ I = \\frac{P}{\\sqrt{3} \\times V \\times PF \\times \\eta} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "power",
          "label": "Power (P)",
          "type": "number",
          "value": "11000",
          "unit": "W",
          "step": null,
          "options": []
        },
        {
          "id": "voltage",
          "label": "Line Voltage (V)",
          "type": "number",
          "value": "400",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "pf",
          "label": "Power Factor",
          "type": "number",
          "value": "0.85",
          "unit": "-",
          "step": "0.01",
          "options": []
        },
        {
          "id": "efficiency",
          "label": "Efficiency (n)",
          "type": "number",
          "value": "0.9",
          "unit": "-",
          "step": "0.01",
          "options": []
        }
      ]
    },
    "cable_voltage_drop_calculator.html": {
      "title": "Cable Voltage Drop",
      "lead": "Estimate voltage drop along a cable run.",
      "formula": "$$ V_{drop} = I \\times R_{cable} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "current",
          "label": "Current (I)",
          "type": "number",
          "value": "32",
          "unit": "A",
          "step": null,
          "options": []
        },
        {
          "id": "resistance",
          "label": "Cable R (Ohm/km)",
          "type": "number",
          "value": "0.5",
          "unit": "Ohm/km",
          "step": null,
          "options": []
        },
        {
          "id": "length",
          "label": "Cable Length",
          "type": "number",
          "value": "50",
          "unit": "m",
          "step": null,
          "options": []
        }
      ]
    },
    "delta_current_calculator.html": {
      "title": "Delta Current Converter",
      "lead": "Convert between line and phase current in a delta connection.",
      "formula": "$$ I_L = \\sqrt{3} \\times I_{Ph} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "phaseCurrent",
          "label": "Phase Current (Iph)",
          "type": "number",
          "value": "10",
          "unit": "A",
          "step": null,
          "options": []
        }
      ]
    },
    "capacitive_reactance_calculator.html": {
      "title": "Capacitive Reactance Calculator",
      "lead": "Calculate capacitive reactance from frequency and capacitance.",
      "formula": "$$ X_C = \\frac{1}{2\\pi f C} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "frequency",
          "label": "Frequency (f)",
          "type": "number",
          "value": "50",
          "unit": "Hz",
          "step": null,
          "options": []
        },
        {
          "id": "capacitance",
          "label": "Capacitance (C)",
          "type": "number",
          "value": "100",
          "unit": "uF",
          "step": null,
          "options": []
        }
      ]
    },
    "kinetic_energy_calculator.html": {
      "title": "Kinetic Energy Calculator",
      "lead": "Calculate kinetic energy from mass and velocity.",
      "formula": "$$ KE = \\frac{1}{2} m v^2 $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "mass",
          "label": "Mass (m)",
          "type": "number",
          "value": "5",
          "unit": "kg",
          "step": null,
          "options": []
        },
        {
          "id": "velocity",
          "label": "Velocity (v)",
          "type": "number",
          "value": "10",
          "unit": "m/s",
          "step": null,
          "options": []
        }
      ]
    },
    "star_phase_three_phase_power.html": {
      "title": "Star Power (Phase Values)",
      "lead": "Three-phase star connection using phase values.",
      "formula": "$$ P = 3 \\times V_{Ph} \\times I_{Ph} \\times \\cos(\\theta) $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "voltage",
          "label": "Phase Voltage (VPh)",
          "type": "number",
          "value": "230",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "current",
          "label": "Phase Current (IPh)",
          "type": "number",
          "value": "15",
          "unit": "A",
          "step": null,
          "options": []
        },
        {
          "id": "powerFactor",
          "label": "Power Factor",
          "type": "number",
          "value": "0.9",
          "unit": "—",
          "step": "0.01",
          "options": []
        }
      ]
    },
    "radians_to_degrees.html": {
      "title": "Radians to Degrees",
      "lead": "Convert an angle from radians to degrees.",
      "formula": "$$ \\text{Degrees} = \\text{Radians} \\times \\frac{180}{\\pi} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "radians",
          "label": "Angle",
          "type": "number",
          "value": "3.1416",
          "unit": "rad",
          "step": null,
          "options": []
        }
      ]
    },
    "degrees_to_radians.html": {
      "title": "Degrees to Radians",
      "lead": "Convert an angle from degrees to radians.",
      "formula": "$$ \\text{Radians} = \\text{Degrees} \\times \\frac{\\pi}{180} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "degrees",
          "label": "Angle",
          "type": "number",
          "value": "180",
          "unit": "°",
          "step": null,
          "options": []
        }
      ]
    },
    "power_wire_analysis_calculator.html": {
      "title": "Power Wire Analysis",
      "lead": "Aircraft copper wire: max run length (L1/L2), conductor temperature (T2), and temperature-corrected voltage drop per SAE ARP4404C §9.3.4.2.",
      "formula": "$$ \\begin{aligned} V_{drop} &= I \\times l_{wire} \\times R_2 \\\\[0.4em] R_2 &= R_L \\times \\frac{234.5 + T_2}{254.5} \\\\[0.6em] T_2 &= T_1 + (T_R - T_1)\\,\\frac{I}{I_{max}} \\\\[0.6em] L_1 &= \\frac{U}{I \\times R_L} \\\\[0.4em] L_2 &= \\frac{254.5 \\times L_1}{234.5 + T_2} \\end{aligned} $$",
      "buttonLabel": "Calculate",
      "references": [
        {
          "title": "SAE ARP4404C — Aircraft Electrical Installations (Rev. C)",
          "file": "reference/documents/files/sae-arp4404c-aircraft-electrical-installations.pdf",
          "note": "§9.3.4.2 Voltage Drop Calculations"
        },
        {
          "title": "SAE AS50881H — Wiring, Aerospace Vehicle",
          "file": "reference/documents/files/as50881h-wiring-aerospace-vehicle.pdf",
          "note": "Wire ampacity, bundle and altitude de-rating (Imax)"
        }
      ],
      "fields": [
        {
          "id": "allowableDrop",
          "label": "Allowable Voltage Drop (U)",
          "type": "number",
          "value": "1",
          "unit": "V",
          "step": "0.01",
          "options": []
        },
        {
          "id": "current",
          "label": "Circuit Current (I)",
          "type": "number",
          "value": "20",
          "unit": "A",
          "step": null,
          "options": []
        },
        {
          "id": "wireGauge",
          "label": "Wire Gauge (AWG)",
          "type": "select",
          "value": "0.00304",
          "unit": "-",
          "step": null,
          "options": [
            { "value": "0.000792", "label": "8 AWG (0.000792 Ω/ft)" },
            { "value": "0.00126", "label": "10 AWG (0.00126 Ω/ft)" },
            { "value": "0.00202", "label": "12 AWG (0.00202 Ω/ft)" },
            { "value": "0.00304", "label": "14 AWG (0.00304 Ω/ft)" },
            { "value": "0.00488", "label": "16 AWG (0.00488 Ω/ft)" },
            { "value": "0.00780", "label": "18 AWG (0.00780 Ω/ft)" },
            { "value": "0.01240", "label": "20 AWG (0.01240 Ω/ft)" },
            { "value": "0.01977", "label": "22 AWG (0.01977 Ω/ft)" },
            { "value": "0.03143", "label": "24 AWG (0.03143 Ω/ft)" },
            { "value": "custom", "label": "Custom resistance per foot" }
          ]
        },
        {
          "id": "resistancePerFoot",
          "label": "Resistance per Foot (R_L)",
          "type": "number",
          "value": "0.00304",
          "unit": "Ω/ft",
          "step": "0.00001",
          "options": []
        },
        {
          "id": "ambientTemp",
          "label": "Ambient Temperature (T1)",
          "type": "number",
          "value": "50",
          "unit": "°C",
          "step": null,
          "options": []
        },
        {
          "id": "ratedTemp",
          "label": "Wire Rated Temperature (TR)",
          "type": "number",
          "value": "200",
          "unit": "°C",
          "step": null,
          "options": []
        },
        {
          "id": "imax",
          "label": "Maximum Allowable Current (Imax)",
          "type": "number",
          "value": "26",
          "unit": "A",
          "step": null,
          "options": []
        },
        {
          "id": "wireLength",
          "label": "Wire Run Length (incl. ground return)",
          "type": "number",
          "value": "15",
          "unit": "ft",
          "step": null,
          "options": []
        }
      ]
    },
    "aircraft_bus_load_calculator.html": {
      "title": "Aircraft Bus Load Calculator",
      "lead": "Estimate bus current for 28V DC or 115V 400Hz AC loads.",
      "formula": "I = P / (V × PF)",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "busType",
          "label": "Bus Type",
          "type": "select",
          "value": "",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "dc",
              "label": "28V DC"
            },
            {
              "value": "ac",
              "label": "115V AC (1-ph)"
            }
          ]
        },
        {
          "id": "power",
          "label": "Load Power",
          "type": "number",
          "value": "500",
          "unit": "W",
          "step": null,
          "options": []
        },
        {
          "id": "pf",
          "label": "Power Factor",
          "type": "number",
          "value": "0.9",
          "unit": "-",
          "step": "0.01",
          "options": []
        }
      ]
    },
    "tru_sizing_calculator.html": {
      "title": "TRU Sizing Calculator",
      "lead": "Size a Transformer Rectifier Unit from AC bus current: rated input kVA, DC output kW, and DC load current.",
      "formula": "$$ \\begin{aligned} S_{in} &= \\frac{k \\, V_L \\, I_L}{1000} \\quad \\text{(kVA)} \\\\[0.5em] P_{out} &= \\eta \\, S_{in} \\quad \\text{(kW)} \\\\[0.5em] I_{DC} &= \\frac{P_{out} \\times 1000}{V_{DC}} \\end{aligned} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "phaseType",
          "label": "AC Input",
          "type": "select",
          "value": "three_phase",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "three_phase",
              "label": "Three-phase (200 V line)"
            },
            {
              "value": "single_phase",
              "label": "Single-phase (115 V)"
            }
          ]
        },
        {
          "id": "inputVoltage",
          "label": "AC Line Voltage (VL)",
          "type": "number",
          "value": "200",
          "unit": "V",
          "step": "0.1",
          "options": []
        },
        {
          "id": "inputCurrent",
          "label": "AC Input Current (IL)",
          "type": "number",
          "value": "13.21",
          "unit": "A",
          "step": "0.01",
          "options": []
        },
        {
          "id": "efficiency",
          "label": "TRU Efficiency (η)",
          "type": "number",
          "value": "0.875",
          "unit": "-",
          "step": "0.001",
          "options": []
        },
        {
          "id": "dcVoltage",
          "label": "DC Output Voltage (VDC)",
          "type": "number",
          "value": "28",
          "unit": "V",
          "step": "0.1",
          "options": []
        },
        {
          "id": "dcCurrentLimit",
          "label": "DC Current Limit (optional)",
          "type": "number",
          "value": "143",
          "unit": "A",
          "step": "1",
          "options": []
        }
      ]
    },
    "battery_endurance_calculator.html": {
      "title": "Battery Endurance Calculator",
      "lead": "Estimate battery endurance in minutes from ampere-hour capacity and DC bus load — matches the ELA/PWA workbook ARP4404C method.",
      "formula": "$$ t_{\\min} = \\frac{C_{Ah} \\times 60 \\times f_{usable}}{I_{load}} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "batteryCapacity",
          "label": "Battery Capacity",
          "type": "number",
          "value": "25",
          "unit": "Ah",
          "step": "0.1",
          "options": []
        },
        {
          "id": "calcMethod",
          "label": "Capacity Method",
          "type": "select",
          "value": "arp4404",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "arp4404",
              "label": "ARP4404C (72% usable — workbook default)"
            },
            {
              "value": "nameplate",
              "label": "Full nameplate Ah"
            }
          ]
        },
        {
          "id": "load1",
          "label": "Load scenario 1 (e.g. FC21)",
          "type": "number",
          "value": "30.38",
          "unit": "A",
          "step": "0.01",
          "options": []
        },
        {
          "id": "load2",
          "label": "Load scenario 2 (e.g. FC22)",
          "type": "number",
          "value": "22.57",
          "unit": "A",
          "step": "0.01",
          "options": []
        },
        {
          "id": "load3",
          "label": "Load scenario 3 (e.g. FC23)",
          "type": "number",
          "value": "24.04",
          "unit": "A",
          "step": "0.01",
          "options": []
        }
      ]
    },
    "force_calculator.html": {
      "title": "Force Calculator",
      "lead": "Calculate force from mass and acceleration.",
      "formula": "$$ F = m \\times a $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "mass",
          "label": "Mass (m)",
          "type": "number",
          "value": "10",
          "unit": "kg",
          "step": null,
          "options": []
        },
        {
          "id": "acceleration",
          "label": "Acceleration (a)",
          "type": "number",
          "value": "9.81",
          "unit": "m/s2",
          "step": null,
          "options": []
        }
      ]
    },
    "unit_converter_power.html": {
      "title": "Power Unit Converter",
      "lead": "Convert between mW, W, and kW.",
      "formula": null,
      "buttonLabel": "Convert",
      "fields": [
        {
          "id": "unit",
          "label": "From",
          "type": "select",
          "value": "",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "w",
              "label": "Watts"
            },
            {
              "value": "kw",
              "label": "Kilowatts"
            },
            {
              "value": "mw",
              "label": "Milliwatts"
            }
          ]
        },
        {
          "id": "value",
          "label": "Value",
          "type": "number",
          "value": "1500",
          "unit": "-",
          "step": null,
          "options": []
        }
      ]
    },
    "reactive_power_calculator.html": {
      "title": "Reactive Power Calculator",
      "lead": "Calculate reactive power from voltage, current, and phase angle.",
      "formula": "$$ Q = V \\times I \\times \\sin(\\theta) $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "voltage",
          "label": "Voltage (V)",
          "type": "number",
          "value": "230",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "current",
          "label": "Current (I)",
          "type": "number",
          "value": "10",
          "unit": "A",
          "step": null,
          "options": []
        },
        {
          "id": "angle",
          "label": "Phase Angle",
          "type": "number",
          "value": "37",
          "unit": "deg",
          "step": null,
          "options": []
        }
      ]
    },
    "binary_decimal_hex_converter.html": {
      "title": "Binary / Decimal / Hex",
      "lead": "Convert between number bases.",
      "formula": null,
      "buttonLabel": "Convert",
      "fields": [
        {
          "id": "base",
          "label": "Input Base",
          "type": "select",
          "value": "",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "10",
              "label": "Decimal"
            },
            {
              "value": "2",
              "label": "Binary"
            },
            {
              "value": "16",
              "label": "Hexadecimal"
            }
          ]
        },
        {
          "id": "value",
          "label": "Value",
          "type": "text",
          "value": "255",
          "unit": "-",
          "step": null,
          "options": []
        }
      ]
    },
    "transformer_ratio_calculator.html": {
      "title": "Transformer Ratio Calculator",
      "lead": "Calculate secondary voltage from turns ratio.",
      "formula": "$$ \\frac{V_1}{V_2} = \\frac{N_1}{N_2} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "primaryV",
          "label": "Primary Voltage (V1)",
          "type": "number",
          "value": "400",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "primaryN",
          "label": "Primary Turns (N1)",
          "type": "number",
          "value": "1000",
          "unit": "-",
          "step": null,
          "options": []
        },
        {
          "id": "secondaryN",
          "label": "Secondary Turns (N2)",
          "type": "number",
          "value": "100",
          "unit": "-",
          "step": null,
          "options": []
        }
      ]
    },
    "star_voltage_calculator.html": {
      "title": "Star Voltage Converter",
      "lead": "Convert between line and phase voltage in a star connection.",
      "formula": "$$ V_L = \\sqrt{3} \\times V_{Ph} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "phaseVoltage",
          "label": "Phase Voltage (Vph)",
          "type": "number",
          "value": "230",
          "unit": "V",
          "step": null,
          "options": []
        }
      ]
    },
    "twos_complement_converter.html": {
      "title": "2's Complement Converter",
      "lead": "Convert a decimal number to 8-bit two's complement.",
      "formula": null,
      "buttonLabel": "Convert",
      "fields": [
        {
          "id": "decimal",
          "label": "Decimal",
          "type": "number",
          "value": "-5",
          "unit": "-",
          "step": null,
          "options": []
        }
      ]
    },
    "three_phase_power_calculator.html": {
      "title": "Three-Phase Power Calculator",
      "lead": "Balanced three-phase power using line values.",
      "formula": "$$ P = \\sqrt{3} \\times V_L \\times I_L \\times \\cos(\\theta) $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "voltage",
          "label": "Line Voltage (VL)",
          "type": "number",
          "value": "400",
          "unit": "V",
          "step": null,
          "options": []
        },
        {
          "id": "current",
          "label": "Line Current (IL)",
          "type": "number",
          "value": "15",
          "unit": "A",
          "step": null,
          "options": []
        },
        {
          "id": "powerFactor",
          "label": "Power Factor",
          "type": "number",
          "value": "0.85",
          "unit": "—",
          "step": "0.01",
          "options": []
        }
      ]
    },
    "inductive_reactance_calculator.html": {
      "title": "Inductive Reactance Calculator",
      "lead": "Calculate inductive reactance from frequency and inductance.",
      "formula": "$$ X_L = 2\\pi f L $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "frequency",
          "label": "Frequency (f)",
          "type": "number",
          "value": "50",
          "unit": "Hz",
          "step": null,
          "options": []
        },
        {
          "id": "inductance",
          "label": "Inductance (L)",
          "type": "number",
          "value": "0.05",
          "unit": "H",
          "step": "0.001",
          "options": []
        }
      ]
    },
    "apparent_power_calculator.html": {
      "title": "Apparent Power Calculator",
      "lead": "Calculate apparent power from true and reactive power.",
      "formula": "$$ S = \\sqrt{P^2 + Q^2} $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "truePower",
          "label": "True Power (P)",
          "type": "number",
          "value": "3000",
          "unit": "W",
          "step": null,
          "options": []
        },
        {
          "id": "reactivePower",
          "label": "Reactive Power (Q)",
          "type": "number",
          "value": "4000",
          "unit": "VAR",
          "step": null,
          "options": []
        }
      ]
    },
    "fuel_energy_calculator.html": {
      "title": "Fuel Energy Calculator",
      "lead": "Convert fuel mass and energy density to total energy.",
      "formula": "$$ E = m \\times e $$",
      "buttonLabel": "Calculate",
      "fields": [
        {
          "id": "mass",
          "label": "Fuel Mass (m)",
          "type": "number",
          "value": "500",
          "unit": "kg",
          "step": null,
          "options": []
        },
        {
          "id": "density",
          "label": "Energy Density (e)",
          "type": "number",
          "value": "43",
          "unit": "MJ/kg",
          "step": null,
          "options": []
        }
      ]
    },
    "unit_converter_resistance.html": {
      "title": "Resistance Unit Converter",
      "lead": "Convert between Ohm, kOhm, and MOhm.",
      "formula": null,
      "buttonLabel": "Convert",
      "fields": [
        {
          "id": "unit",
          "label": "From",
          "type": "select",
          "value": "",
          "unit": "-",
          "step": null,
          "options": [
            {
              "value": "ohm",
              "label": "Ohm"
            },
            {
              "value": "kohm",
              "label": "kOhm"
            },
            {
              "value": "mohm",
              "label": "MOhm"
            }
          ]
        },
        {
          "id": "value",
          "label": "Value",
          "type": "number",
          "value": "4700",
          "unit": "-",
          "step": null,
          "options": []
        }
      ]
    }
  };

  var HELP = {
    "ohms_law_calculator.html": {
      "title": "Ohm's Law Calculator",
      "what": "Finds resistance when you know voltage and current. Based on the fundamental rule V = I × R.",
      "when": "Use to check resistor values, troubleshoot circuits, or verify that a load has the expected resistance.",
      "steps": [
        "Enter voltage across the component (V).",
        "Enter current flowing through it (A).",
        "The result updates automatically as you enter values.",
        "Result is resistance in ohms."
      ],
      "example": "24 V and 3 A → R = 24/3 = 8 ohms."
    },
    "delta_three_phase_power.html": {
      "title": "Delta Power Calculator",
      "what": "Calculates three-phase power for loads connected in delta (mesh) configuration.",
      "when": "Use when the load is delta-connected. In delta, line voltage equals phase voltage, but line current is √3 times phase current.",
      "steps": [
        "Enter line voltage (same as phase voltage in delta).",
        "Enter line current (measured in the supply wires).",
        "Enter power factor.",
        "The result updates automatically as you enter values."
      ],
      "example": "Delta motor: 400 V line, 17.3 A line current, PF 0.85 → about 10,176 W."
    },
    "star_three_phase_power.html": {
      "title": "Star Power Calculator",
      "what": "Same as the three-phase power formula, specifically for loads connected in star (wye) configuration.",
      "when": "Use when your three-phase load is star-connected — common for motors and distribution transformers. Line current equals phase current in a star connection.",
      "steps": [
        "Enter the line voltage between phases.",
        "Enter the line current.",
        "Enter the power factor.",
        "The result updates automatically as you enter values."
      ],
      "example": "A star-connected motor on 400 V drawing 20 A at PF 0.92 uses about 12,755 W."
    },
    "dc_power_calculator.html": {
      "title": "DC Power Calculator",
      "what": "Works out how much electrical power a DC circuit uses. Power is simply voltage multiplied by current.",
      "when": "Use this for batteries, DC motors, LED circuits, or any system where the current flows in one direction. If you know the voltage and current, this tells you the power in watts.",
      "steps": [
        "Type the voltage (V) in volts — e.g. 12 for a car battery.",
        "Type the current (I) in amps — how much current the load draws.",
        "The result updates automatically as you enter values.",
        "Read the result in watts (W)."
      ],
      "example": "A 12 V circuit drawing 5 A uses 12 × 5 = 60 W of power."
    },
    "unit_converter_energy.html": {
      "title": "Energy Unit Converter",
      "what": "Converts between joules (J) and kilowatt-hours (kWh).",
      "when": "Use when comparing physics energy (joules) with utility billing units (kWh). 1 kWh = 3.6 million joules.",
      "steps": [
        "Select joules or kWh.",
        "Enter the value.",
        "The converted value updates automatically as you enter values."
      ],
      "example": "3,600,000 J = 1 kWh."
    },
    "energy_cost_calculator.html": {
      "title": "Energy & Cost Calculator",
      "what": "Works out how much energy an appliance uses over time and what it costs on your electricity tariff.",
      "when": "Use to estimate running costs for heaters, motors, or any load. Helpful for comparing equipment or budgeting energy bills.",
      "steps": [
        "Enter power in watts (check the nameplate or use another calculator).",
        "Enter how many hours it runs.",
        "Enter your electricity rate in pence per kWh (check your bill).",
        "The result shows kWh used and total cost automatically as you enter values."
      ],
      "example": "2,000 W for 3 hours = 6 kWh. At 28 p/kWh, cost = £1.68."
    },
    "unit_converter_frequency.html": {
      "title": "Frequency Unit Converter",
      "what": "Converts between hertz (Hz), kilohertz (kHz), and megahertz (MHz).",
      "when": "Use when comparing mains frequency (50 Hz) with radio or clock frequencies (kHz/MHz).",
      "steps": [
        "Select the unit you have.",
        "Enter the value.",
        "The converted value updates automatically as you enter values."
      ],
      "example": "50 Hz = 0.05 kHz. 100 MHz = 100,000,000 Hz."
    },
    "ac_power_calculator.html": {
      "title": "AC Power Calculator",
      "what": "Calculates true (real) power in a single-phase AC circuit, taking power factor into account.",
      "when": "Use this for household appliances, single-phase motors, or any AC load where you know voltage, current, and power factor. True power is what you are actually billed for.",
      "steps": [
        "Enter the AC voltage (V) — e.g. 230 V for UK mains.",
        "Enter the current (I) in amps.",
        "Enter the power factor (0 to 1). Use 1.0 for purely resistive loads like heaters; motors are often 0.7–0.9.",
        "The result shows power in watts automatically as you enter values."
      ],
      "example": "230 V, 10 A, power factor 0.9 gives P = 230 × 10 × 0.9 = 2,070 W."
    },
    "resistor_color_code_calculator.html": {
      "title": "Resistor Colour Code",
      "what": "Decodes the coloured bands on a 4-band resistor to find its resistance value and tolerance.",
      "when": "Use when you have a physical resistor and need to know its value before placing it in a circuit.",
      "steps": [
        "Select Band 1 (first digit) from the dropdown.",
        "Select Band 2 (second digit).",
        "Select the multiplier band (how many zeros to add).",
        "Select tolerance (gold = ±5% is most common).",
        "The decoded resistance appears automatically as you select bands."
      ],
      "example": "Yellow (4) + Violet (7) + Red (×100) + Gold → 4,700 Ω (4.7 kΩ) ±5%."
    },
    "power_triangle_converter.html": {
      "title": "Power Triangle Converter",
      "what": "Converts between kilowatts (kW), kilovolt-amperes (kVA), and kilovars (kVAR) using power factor.",
      "when": "Use when sizing generators, UPS systems, or power factor correction. You often know real power (kW) and power factor, but equipment is rated in kVA.",
      "steps": [
        "Enter true power in kW.",
        "Enter power factor (0 to 1).",
        "The result updates automatically as you enter values.",
        "You get apparent power (kVA) and reactive power (kVAR)."
      ],
      "example": "8 kW at PF 0.85 → S = 8/0.85 ≈ 9.41 kVA, Q ≈ 4.95 kVAR."
    },
    "delta_phase_three_phase_power.html": {
      "title": "Delta (Phase Values) Calculator",
      "what": "Calculates three-phase power when you know phase voltage and phase current in a delta connection.",
      "when": "Use when you have measured values inside the delta winding (phase V and phase I) rather than the line values at the supply.",
      "steps": [
        "Enter phase voltage (V across each load element).",
        "Enter phase current (I through each load element).",
        "Enter power factor.",
        "Total three-phase power appears automatically as you enter values."
      ],
      "example": "Phase values 400 V and 10 A with PF 0.85 give total power ≈ 5,886 W."
    },
    "generator_efficiency_calculator.html": {
      "title": "Generator Efficiency Calculator",
      "what": "Calculates what percentage of input power a generator converts to useful electrical output.",
      "when": "Use when evaluating generator performance, comparing models, or estimating fuel consumption.",
      "steps": [
        "Enter input power (mechanical power in, in watts).",
        "Enter output power (electrical power out, in watts).",
        "The result updates automatically as you enter values.",
        "Higher percentage means less energy wasted as heat."
      ],
      "example": "12,000 W in, 10,800 W out → efficiency = 90%."
    },
    "unit_converter_voltage.html": {
      "title": "Voltage Unit Converter",
      "what": "Converts between volts (V) and kilovolts (kV).",
      "when": "Use when working across different voltage scales — e.g. transmission lines in kV vs household volts.",
      "steps": [
        "Select volts or kilovolts.",
        "Enter the value.",
        "The converted value updates automatically as you enter values."
      ],
      "example": "11 kV = 11,000 V."
    },
    "power_ohms_law_calculator.html": {
      "title": "Power (Ohm's Law) Calculator",
      "what": "Calculates power dissipated in a resistor using voltage and resistance.",
      "when": "Use when you know the voltage across a resistor (or heating element) and its resistance, but not the current.",
      "steps": [
        "Enter voltage (V) across the resistor.",
        "Enter resistance (R) in ohms.",
        "The result updates automatically as you enter values.",
        "Shows power using both P = V²/R and P = I²R (same answer)."
      ],
      "example": "230 V across 46 Ω → P = 230²/46 = 1,150 W."
    },
    "db_converter.html": {
      "title": "dB / dBm Converter",
      "what": "Converts between decibels (dB), dBm (power relative to 1 mW), and actual power in milliwatts.",
      "when": "Use in RF, audio, and communications when working with signal levels. dBm is common on test equipment.",
      "steps": [
        "Choose what you are converting from (dBm, mW, or dB ratio).",
        "Enter the value.",
        "The result updates automatically as you enter values.",
        "Read the equivalent values in all three units."
      ],
      "example": "10 dBm = 10 mW of power. 0 dBm = 1 mW."
    },
    "unit_converter_current.html": {
      "title": "Current Unit Converter",
      "what": "Converts between amps (A) and milliamps (mA).",
      "when": "Use when a circuit draws milliamps (e.g. 250 mA) but your breaker is rated in amps.",
      "steps": [
        "Select amps or milliamps.",
        "Enter the value.",
        "The converted value updates automatically as you enter values."
      ],
      "example": "250 mA = 0.25 A."
    },
    "inverter_efficiency_calculator.html": {
      "title": "Inverter Efficiency Calculator",
      "what": "Calculates how efficiently an inverter converts DC battery/solar power to AC output.",
      "when": "Use for solar systems, UPS, or aircraft inverters when comparing DC input to AC output power.",
      "steps": [
        "Enter DC input power in watts.",
        "Enter AC output power in watts.",
        "Efficiency percentage appears automatically as you enter values."
      ],
      "example": "500 W DC in, 465 W AC out → efficiency = 93%."
    },
    "tru_efficiency_calculator.html": {
      "title": "TRU Efficiency Calculator",
      "what": "Calculates how efficiently a Transformer Rectifier Unit (TRU) converts input power to output power.",
      "when": "Use for aircraft electrical systems or any TRU where you want to compare power in vs power out. Efficiency tells you how much energy is lost as heat.",
      "steps": [
        "Enter power going into the TRU (watts).",
        "Enter useful power coming out (watts).",
        "The result updates automatically as you enter values.",
        "Result is efficiency as a percentage — higher is better."
      ],
      "example": "500 W in, 450 W out → efficiency = (450/500) × 100 = 90%."
    },
    "logic_truth_table.html": {
      "title": "Logic Truth Table",
      "what": "Generates a truth table showing the output for every combination of two inputs (A and B).",
      "when": "Use when learning digital logic gates or verifying how AND, OR, NAND, NOR, XOR, and XNOR behave.",
      "steps": [
        "Select the gate type from the dropdown.",
        "The truth table appears automatically when you select a gate.",
        "Read the table: A and B are inputs (0 or 1), Out is the result."
      ],
      "example": "AND gate: output is 1 only when both A AND B are 1. All other rows are 0."
    },
    "power_factor_calculator.html": {
      "title": "Power Factor Calculator",
      "what": "Finds the power factor when you know true power (watts) and reactive power (VAR).",
      "when": "Use when you have P and Q measurements and need to know how efficiently the supply is being used. Low power factor means more current is needed for the same useful power.",
      "steps": [
        "Enter true power (P) in watts.",
        "Enter reactive power (Q) in VAR.",
        "The result updates automatically as you enter values.",
        "Result is a number between 0 and 1 (e.g. 0.85). Closer to 1 is better."
      ],
      "example": "P = 1,000 W and Q = 500 VAR gives PF = 1,000 / √(1,000² + 500²) ≈ 0.894."
    },
    "impedance_calculator.html": {
      "title": "Impedance Calculator",
      "what": "Combines resistance and reactance into total impedance (Z) for AC circuits.",
      "when": "Use for AC circuit analysis when a load has both resistive and reactive parts — e.g. a motor coil or RLC circuit.",
      "steps": [
        "Enter resistance (R) in ohms.",
        "Enter reactance (X) in ohms — inductive is positive, capacitive is negative.",
        "The result updates automatically as you enter values.",
        "Result is total impedance in ohms."
      ],
      "example": "R = 6 Ω, X = 8 Ω → Z = √(6² + 8²) = 10 Ω."
    },
    "motor_current_calculator.html": {
      "title": "Motor Current Calculator",
      "what": "Estimates the full-load current of a three-phase motor.",
      "when": "Use when selecting cables, circuit breakers, or contactors for a motor. You need the motor power rating from the nameplate.",
      "steps": [
        "Enter motor power in watts (11 kW = 11,000 W).",
        "Enter line voltage (e.g. 400 V).",
        "Enter power factor (nameplate value, often 0.8–0.9).",
        "Enter efficiency as a decimal (e.g. 0.9 for 90%).",
        "Full-load current in amps appears automatically as you enter values."
      ],
      "example": "11 kW, 400 V, PF 0.85, efficiency 0.9 → I ≈ 20.8 A."
    },
    "cable_voltage_drop_calculator.html": {
      "title": "Cable Voltage Drop Calculator",
      "what": "Estimates voltage lost along a cable due to its resistance.",
      "when": "Use when checking if a cable run is long enough that voltage at the load drops too low. Important for motors and sensitive equipment.",
      "steps": [
        "Enter the current flowing through the cable (A).",
        "Enter cable resistance in ohms per kilometre (from cable data sheet).",
        "Enter cable length in metres.",
        "Voltage drop in volts appears automatically as you enter values."
      ],
      "example": "32 A, 0.5 Ω/km, 50 m cable → drop = 32 × 0.5 × 0.05 = 0.8 V."
    },
    "delta_current_calculator.html": {
      "title": "Delta Current Converter",
      "what": "Converts phase current (through each delta leg) to line current (in the supply wires).",
      "when": "Use when you have measured current inside a delta winding and need the supply cable current for breaker sizing.",
      "steps": [
        "Enter phase current (I through one delta branch).",
        "The result updates automatically as you enter values.",
        "Result is line current = √3 × phase current."
      ],
      "example": "10 A phase current → 17.32 A line current."
    },
    "capacitive_reactance_calculator.html": {
      "title": "Capacitive Reactance Calculator",
      "what": "Calculates how much a capacitor opposes AC current at a given frequency.",
      "when": "Use for power factor correction, filter design, or understanding capacitor behaviour in AC circuits.",
      "steps": [
        "Enter frequency in Hz.",
        "Enter capacitance in microfarads (µF) — the value printed on the capacitor.",
        "The result updates automatically as you enter values.",
        "Result is capacitive reactance X_C in ohms."
      ],
      "example": "50 Hz, 100 µF → X_C ≈ 31.8 Ω."
    },
    "kinetic_energy_calculator.html": {
      "title": "Kinetic Energy Calculator",
      "what": "Calculates the energy of a moving object from its mass and speed.",
      "when": "Use in physics and engineering when analysing moving parts, vehicles, or any object with mass in motion.",
      "steps": [
        "Enter mass in kilograms.",
        "Enter velocity (speed) in metres per second.",
        "The result updates automatically as you enter values.",
        "Result is kinetic energy in joules (J)."
      ],
      "example": "5 kg moving at 10 m/s → KE = ½ × 5 × 10² = 250 J."
    },
    "star_phase_three_phase_power.html": {
      "title": "Star (Phase Values) Calculator",
      "what": "Calculates three-phase power from phase voltage and phase current in a star connection.",
      "when": "Use when you have phase-to-neutral voltage and current through one phase winding, not the line values.",
      "steps": [
        "Enter phase voltage (V from phase to neutral).",
        "Enter phase current.",
        "Enter power factor.",
        "The result updates automatically as you enter values."
      ],
      "example": "230 V phase, 20 A, PF 0.92 → total three-phase power ≈ 12,755 W."
    },
    "radians_to_degrees.html": {
      "title": "Radians to Degrees",
      "what": "Converts an angle from radians back to degrees.",
      "when": "Use when a calculation gives radians but you need to understand the angle in familiar degrees.",
      "steps": [
        "Enter the angle in radians.",
        "The result updates automatically as you enter values.",
        "Read the result in degrees."
      ],
      "example": "π radians = 180°. 1.5708 rad ≈ 90°."
    },
    "degrees_to_radians.html": {
      "title": "Degrees to Radians",
      "what": "Converts an angle from degrees to radians for use in engineering formulas.",
      "when": "Use before plugging angles into formulas that need radians — e.g. sin(), cos(), or reactance calculations.",
      "steps": [
        "Enter the angle in degrees.",
        "The result updates automatically as you enter values.",
        "Read the result in radians."
      ],
      "example": "180° = π radians (≈ 3.1416). 90° = π/2 ≈ 1.5708 rad."
    },
    "power_wire_analysis_calculator.html": {
      "title": "Power Wire Analysis (PWA)",
      "what": "Computes maximum wire run length, estimated conductor temperature, derated length, and voltage drop for copper aircraft wire using SAE ARP4404C §9.3.4.2 (Voltage Drop Calculations).",
      "when": "Use when sizing or checking aircraft wire runs — especially when ambient temperature is above 20 °C or the wire is heavily loaded and resistance must be corrected for conductor temperature.",
      "steps": [
        "Enter the allowable voltage drop U for the circuit (ARP4404C Table 3 for your nominal bus voltage).",
        "Enter circuit current and select wire AWG (R_L at 20 °C from the wire specification) or enter a custom resistance per foot.",
        "Enter ambient temperature T1, wire insulation rating TR, and Imax per AS50881 (wire current, bundle, and altitude de-rating).",
        "Enter total wire run length including the ground return path, as required by §9.3.4.2.",
        "Results update automatically: L1 (max length at 20 °C reference), T2, L2 (length limit at T2), and Vdrop."
      ],
      "example": "14 AWG, 20 A, U = 1 V, T1 = 50 °C, TR = 200 °C, Imax = 26 A → L1 ≈ 16.4 ft, T2 ≈ 165 °C, L2 ≈ 10.5 ft; 15 ft run → Vdrop ≈ 1.43 V (exceeds 1 V limit — upsize wire or shorten run)."
    },
    "aircraft_bus_load_calculator.html": {
      "title": "Aircraft Bus Load Calculator",
      "what": "Estimates the current drawn from an aircraft electrical bus for a given power load.",
      "when": "Use when planning aircraft electrical loads — avionics, lighting, or cabin equipment on 28 V DC or 115 V AC buses.",
      "steps": [
        "Select bus type: 28 V DC or 115 V AC single-phase.",
        "Enter load power in watts (from equipment nameplate).",
        "Enter power factor (use 1.0 for DC; 0.85–0.95 typical for AC).",
        "Bus voltage and current appear automatically as you enter values."
      ],
      "example": "500 W on 115 V AC at PF 0.9 → I = 500/(115×0.9) ≈ 4.83 A."
    },
    "tru_sizing_calculator.html": {
      "title": "TRU Sizing Calculator",
      "what": "Calculates TRU rated AC input kVA, DC output power, and DC output current from line voltage, line current, efficiency, and DC bus voltage.",
      "when": "Use when sizing or checking Transformer Rectifier Units on 200 V 3φ or 115 V AC feeds — the same chain as the MAX TRU CALC sheet in the ELA/PWA workbook.",
      "steps": [
        "Select three-phase (200 V) or single-phase (115 V) AC input.",
        "Enter AC line voltage and line current drawn by the TRU input.",
        "Enter TRU efficiency (typical ≈ 0.875) and DC output voltage (typically 28 V).",
        "Optionally enter a DC current limit to flag overload.",
        "Results update automatically: input kVA, output kW, and DC amps."
      ],
      "example": "200 V 3φ, 13.21 A in, η = 0.875, 28 V DC out → S ≈ 4.58 kVA, P ≈ 4.00 kW, I ≈ 143 A."
    },
    "battery_endurance_calculator.html": {
      "title": "Battery Endurance Calculator",
      "what": "Estimates how long a battery can supply a DC load before depletion, using ampere-hour capacity and total bus current.",
      "when": "Use for loss-of-generator or loss-of-TRU flight conditions — matches the BATT ENDURANCE tab in the ELA/PWA workbook.",
      "steps": [
        "Enter battery nameplate capacity in ampere-hours.",
        "Select ARP4404C method (72% usable capacity) or full nameplate Ah.",
        "Enter one or more DC load scenarios in amps (leave unused scenarios blank).",
        "Endurance appears in minutes and hours for each scenario entered."
      ],
      "example": "25 Ah, ARP4404C method, 30.38 A load → t ≈ 35.6 min (0.59 h)."
    },
    "force_calculator.html": {
      "title": "Force Calculator",
      "what": "Calculates force using Newton's second law: force equals mass times acceleration.",
      "when": "Use for basic mechanics — finding the force needed to accelerate an object, or the weight of a mass under gravity.",
      "steps": [
        "Enter mass in kilograms (kg).",
        "Enter acceleration in m/s² (use 9.81 for weight due to gravity on Earth).",
        "The result updates automatically as you enter values.",
        "Result is force in newtons (N)."
      ],
      "example": "10 kg at 9.81 m/s² → F = 98.1 N (the weight of a 10 kg object on Earth)."
    },
    "unit_converter_power.html": {
      "title": "Power Unit Converter",
      "what": "Converts between milliwatts, watts, and kilowatts.",
      "when": "Use when datasheets use different units — e.g. a motor rated in kW but a sensor in mW.",
      "steps": [
        "Select the unit you are converting from.",
        "Enter the value.",
        "The converted value updates automatically as you enter values.",
        "Read the equivalent in all three units."
      ],
      "example": "1,500 W = 1.5 kW = 1,500,000 mW."
    },
    "reactive_power_calculator.html": {
      "title": "Reactive Power Calculator",
      "what": "Calculates reactive power (VAR) from voltage, current, and the phase angle between them.",
      "when": "Use when you need to size capacitors for power factor correction, or analyse inductive loads like motors and transformers.",
      "steps": [
        "Enter voltage (V).",
        "Enter current (I).",
        "Enter phase angle in degrees (0° = in phase, positive = current lagging).",
        "Reactive power in VAR appears automatically as you enter values."
      ],
      "example": "230 V, 10 A, angle 37° → Q = 230 × 10 × sin(37°) ≈ 1,384 VAR."
    },
    "binary_decimal_hex_converter.html": {
      "title": "Binary / Decimal / Hex Converter",
      "what": "Converts a number between decimal (everyday numbers), binary (0s and 1s), and hexadecimal (base 16).",
      "when": "Use in digital electronics, programming, and microcontrollers when you need the same value in different number bases.",
      "steps": [
        "Select which base your input number is in.",
        "Type the number (binary: only 0 and 1; hex: 0–9 and A–F).",
        "The converted value updates automatically as you enter values.",
        "Read the equivalent in all three bases."
      ],
      "example": "Decimal 255 = Binary 11111111 = Hex 0xFF."
    },
    "transformer_ratio_calculator.html": {
      "title": "Transformer Ratio Calculator",
      "what": "Finds the secondary voltage from the turns ratio and primary voltage.",
      "when": "Use when designing or checking transformers — step-up, step-down, or isolation transformers.",
      "steps": [
        "Enter primary voltage (V1).",
        "Enter number of primary turns (N1).",
        "Enter number of secondary turns (N2).",
        "Secondary voltage appears automatically as you enter values."
      ],
      "example": "400 V primary, 1000 turns primary, 100 turns secondary → V2 = 40 V."
    },
    "star_voltage_calculator.html": {
      "title": "Star Voltage Converter",
      "what": "Converts between phase voltage (phase-to-neutral) and line voltage (phase-to-phase) in a star system.",
      "when": "Use when you have one value and need the other — e.g. UK mains is 230 V phase / 400 V line in star.",
      "steps": [
        "Enter the phase voltage (V from one phase to neutral).",
        "The result updates automatically as you enter values.",
        "Result is the line voltage between any two phases."
      ],
      "example": "230 V phase → line voltage = √3 × 230 ≈ 398 V (commonly quoted as 400 V)."
    },
    "twos_complement_converter.html": {
      "title": "2's Complement Converter",
      "what": "Shows how a signed decimal number is stored as an 8-bit two's complement binary value.",
      "when": "Use when learning how computers represent negative numbers, or when debugging embedded systems.",
      "steps": [
        "Enter a decimal number from -128 to 127.",
        "The converted value updates automatically as you enter values.",
        "Read the 8-bit binary pattern."
      ],
      "example": "Decimal -5 is stored as 11111011 in 8-bit two's complement."
    },
    "three_phase_power_calculator.html": {
      "title": "Three-Phase Power Calculator",
      "what": "Calculates total true power in a balanced three-phase system using line voltage and line current.",
      "when": "Use this for industrial motors, factory supplies, or any 3-phase equipment. You need the line-to-line voltage (e.g. 400 V) and the current in each supply wire.",
      "steps": [
        "Enter line voltage (V_L) — the voltage between two phases.",
        "Enter line current (I_L) — current in each of the three wires.",
        "Enter power factor (typically 0.8–0.95 for motors).",
        "Power in watts appears automatically as you enter values."
      ],
      "example": "400 V, 15 A, PF 0.85 gives P = √3 × 400 × 15 × 0.85 ≈ 8,834 W."
    },
    "inductive_reactance_calculator.html": {
      "title": "Inductive Reactance Calculator",
      "what": "Calculates how much an inductor opposes AC current at a given frequency.",
      "when": "Use when designing filters, analysing motor windings, or checking inductor behaviour at mains frequency (50/60 Hz).",
      "steps": [
        "Enter frequency in Hz (50 for UK mains).",
        "Enter inductance in henries (H). Millihenries: divide by 1,000.",
        "The result updates automatically as you enter values.",
        "Result is inductive reactance X_L in ohms."
      ],
      "example": "50 Hz, 0.05 H → X_L = 2π × 50 × 0.05 ≈ 15.7 Ω."
    },
    "apparent_power_calculator.html": {
      "title": "Apparent Power Calculator",
      "what": "Calculates apparent power (VA) from true power (W) and reactive power (VAR).",
      "when": "Use when you know real and reactive power and need the total VA the supply must deliver — important for sizing cables, breakers, and transformers.",
      "steps": [
        "Enter true power (P) in watts.",
        "Enter reactive power (Q) in VAR.",
        "The result updates automatically as you enter values.",
        "Result is apparent power in volt-amperes (VA)."
      ],
      "example": "P = 3,000 W, Q = 4,000 VAR → S = √(3,000² + 4,000²) = 5,000 VA."
    },
    "fuel_energy_calculator.html": {
      "title": "Fuel Energy Calculator",
      "what": "Calculates total energy available in a given mass of fuel using its energy density.",
      "when": "Use in aerospace or power generation to estimate energy content of jet fuel, diesel, or other fuels.",
      "steps": [
        "Enter fuel mass in kilograms.",
        "Enter energy density in MJ/kg (jet fuel is typically ~43 MJ/kg).",
        "The result updates automatically as you enter values.",
        "Result shows energy in megajoules and kilowatt-hours."
      ],
      "example": "500 kg of fuel at 43 MJ/kg → 21,500 MJ (≈ 5,972 kWh)."
    },
    "unit_converter_resistance.html": {
      "title": "Resistance Unit Converter",
      "what": "Converts between ohms, kilohms, and megohms.",
      "when": "Use when resistor values span large ranges — e.g. 4.7 kΩ vs 1 MΩ.",
      "steps": [
        "Select the unit you have.",
        "Enter the value.",
        "The converted value updates automatically as you enter values."
      ],
      "example": "4,700 Ω = 4.7 kΩ = 0.0047 MΩ."
    }
  };

  var REFERENCE = {
    'ohms_law_calculator.html': {
      summary: 'Resistance is voltage divided by current.',
      variables: [
        { sym: 'V', desc: 'voltage' },
        { sym: 'I', desc: 'current' },
        { sym: 'R', desc: 'resistance' }
      ]
    },
    'dc_power_calculator.html': {
      summary: 'DC power is the product of voltage and current.',
      variables: [
        { sym: 'P', desc: 'power' },
        { sym: 'V', desc: 'voltage' },
        { sym: 'I', desc: 'current' }
      ]
    },
    'ac_power_calculator.html': {
      summary: 'True (real) power in a single-phase AC circuit.',
      variables: [
        { sym: 'P', desc: 'true power' },
        { sym: 'V', desc: 'voltage' },
        { sym: 'I', desc: 'current' },
        { sym: 'θ', desc: 'phase angle between voltage and current' }
      ]
    },
    'three_phase_power_calculator.html': {
      summary: 'Total three-phase power using line voltage and line current.',
      variables: [
        { sym: 'P', desc: 'true power' },
        { sym: 'V_L', desc: 'line voltage (phase-to-phase)' },
        { sym: 'I_L', desc: 'line current' },
        { sym: 'θ', desc: 'phase angle' }
      ]
    },
    'star_three_phase_power.html': {
      summary: 'Three-phase star (wye) power using line values.',
      variables: [
        { sym: 'P', desc: 'true power' },
        { sym: 'V_L', desc: 'line voltage' },
        { sym: 'I_L', desc: 'line current' },
        { sym: 'θ', desc: 'phase angle' }
      ]
    },
    'delta_three_phase_power.html': {
      summary: 'Three-phase delta power using line values.',
      variables: [
        { sym: 'P', desc: 'true power' },
        { sym: 'V_L', desc: 'line voltage' },
        { sym: 'I_L', desc: 'line current' },
        { sym: 'θ', desc: 'phase angle' }
      ]
    },
    'star_phase_three_phase_power.html': {
      summary: 'Three-phase star power from phase voltage and phase current.',
      variables: [
        { sym: 'P', desc: 'true power' },
        { sym: 'V_Ph', desc: 'phase voltage (phase-to-neutral)' },
        { sym: 'I_Ph', desc: 'phase current' },
        { sym: 'θ', desc: 'phase angle' }
      ]
    },
    'delta_phase_three_phase_power.html': {
      summary: 'Three-phase delta power from phase voltage and phase current.',
      variables: [
        { sym: 'P', desc: 'true power' },
        { sym: 'V_Ph', desc: 'phase voltage' },
        { sym: 'I_Ph', desc: 'phase current' },
        { sym: 'θ', desc: 'phase angle' }
      ]
    },
    'power_factor_calculator.html': {
      summary: 'Power factor is true power divided by apparent power.',
      variables: [
        { sym: 'PF', desc: 'power factor' },
        { sym: 'P', desc: 'true power' },
        { sym: 'Q', desc: 'reactive power' },
        { sym: 'S', desc: 'apparent power' }
      ]
    },
    'reactive_power_calculator.html': {
      summary: 'Reactive power from voltage, current, and phase angle.',
      variables: [
        { sym: 'Q', desc: 'reactive power' },
        { sym: 'V', desc: 'voltage' },
        { sym: 'I', desc: 'current' },
        { sym: 'θ', desc: 'phase angle' }
      ]
    },
    'apparent_power_calculator.html': {
      summary: 'Apparent power from true and reactive power (power triangle).',
      variables: [
        { sym: 'S', desc: 'apparent power' },
        { sym: 'P', desc: 'true power' },
        { sym: 'Q', desc: 'reactive power' }
      ]
    },
    'power_triangle_converter.html': {
      summary: 'Convert between kW, kVA, and kVAR using power factor.',
      variables: [
        { sym: 'P', desc: 'true power (kW)' },
        { sym: 'S', desc: 'apparent power (kVA)' },
        { sym: 'Q', desc: 'reactive power (kVAR)' },
        { sym: 'PF', desc: 'power factor' }
      ]
    },
    'energy_cost_calculator.html': {
      summary: 'Energy consumed equals power multiplied by time.',
      variables: [
        { sym: 'E', desc: 'energy' },
        { sym: 'P', desc: 'power' },
        { sym: 't', desc: 'time' }
      ]
    },
    'tru_efficiency_calculator.html': {
      summary: 'Efficiency is useful output power divided by input power.',
      variables: [
        { sym: 'η', desc: 'efficiency' },
        { sym: 'P_in', desc: 'input power' },
        { sym: 'P_out', desc: 'output power' }
      ]
    },
    'generator_efficiency_calculator.html': {
      summary: 'Generator efficiency: electrical output vs mechanical input.',
      variables: [
        { sym: 'η', desc: 'efficiency' },
        { sym: 'P_in', desc: 'input power' },
        { sym: 'P_out', desc: 'output power' }
      ]
    },
    'inverter_efficiency_calculator.html': {
      summary: 'Inverter efficiency: AC output vs DC input.',
      variables: [
        { sym: 'η', desc: 'efficiency' },
        { sym: 'P_DC', desc: 'DC input power' },
        { sym: 'P_AC', desc: 'AC output power' }
      ]
    },
    'impedance_calculator.html': {
      summary: 'Total AC opposition combining resistance and reactance.',
      variables: [
        { sym: 'Z', desc: 'impedance' },
        { sym: 'R', desc: 'resistance' },
        { sym: 'X', desc: 'reactance' }
      ]
    },
    'inductive_reactance_calculator.html': {
      summary: 'Inductive reactance increases with frequency and inductance.',
      variables: [
        { sym: 'X_L', desc: 'inductive reactance' },
        { sym: 'f', desc: 'frequency' },
        { sym: 'L', desc: 'inductance' }
      ]
    },
    'capacitive_reactance_calculator.html': {
      summary: 'Capacitive reactance decreases with frequency and capacitance.',
      variables: [
        { sym: 'X_C', desc: 'capacitive reactance' },
        { sym: 'f', desc: 'frequency' },
        { sym: 'C', desc: 'capacitance' }
      ]
    },
    'star_voltage_calculator.html': {
      summary: 'Line voltage is √3 times phase voltage in a star system.',
      variables: [
        { sym: 'V_L', desc: 'line voltage (phase-to-phase)' },
        { sym: 'V_Ph', desc: 'phase voltage (phase-to-neutral)' }
      ]
    },
    'delta_current_calculator.html': {
      summary: 'Line current is √3 times phase current in a delta system.',
      variables: [
        { sym: 'I_L', desc: 'line current' },
        { sym: 'I_Ph', desc: 'phase current' }
      ]
    },
    'power_ohms_law_calculator.html': {
      summary: 'Power dissipated in a resistor from voltage and resistance.',
      variables: [
        { sym: 'P', desc: 'power' },
        { sym: 'V', desc: 'voltage' },
        { sym: 'R', desc: 'resistance' },
        { sym: 'I', desc: 'current' }
      ]
    },
    'motor_current_calculator.html': {
      summary: 'Estimate full-load current for a three-phase motor.',
      variables: [
        { sym: 'I', desc: 'line current' },
        { sym: 'P', desc: 'shaft power' },
        { sym: 'V', desc: 'line voltage' },
        { sym: 'PF', desc: 'power factor' },
        { sym: 'η', desc: 'efficiency' }
      ]
    },
    'cable_voltage_drop_calculator.html': {
      summary: 'Voltage lost along a cable due to its resistance.',
      variables: [
        { sym: 'V_drop', desc: 'voltage drop' },
        { sym: 'I', desc: 'current' },
        { sym: 'R', desc: 'cable resistance' }
      ]
    },
    'transformer_ratio_calculator.html': {
      summary: 'Secondary voltage from the turns ratio.',
      variables: [
        { sym: 'V_1', desc: 'primary voltage' },
        { sym: 'V_2', desc: 'secondary voltage' },
        { sym: 'N_1', desc: 'primary turns' },
        { sym: 'N_2', desc: 'secondary turns' }
      ]
    },
    'db_converter.html': {
      summary: 'Decibels express power level as a logarithmic ratio.',
      variables: [
        { sym: 'dBm', desc: 'power in dBm (relative to 1 mW)' },
        { sym: 'dB', desc: 'power ratio in decibels' },
        { sym: 'P_mW', desc: 'power in milliwatts' },
        { sym: 'P_1', desc: 'reference power' },
        { sym: 'P_2', desc: 'comparison power' }
      ]
    },
    'degrees_to_radians.html': {
      summary: 'Convert degrees to radians for trigonometry in formulas.',
      variables: [
        { sym: '°', desc: 'degrees' },
        { sym: 'rad', desc: 'radians' }
      ]
    },
    'radians_to_degrees.html': {
      summary: 'Convert radians back to degrees.',
      variables: [
        { sym: 'rad', desc: 'radians' },
        { sym: '°', desc: 'degrees' }
      ]
    },
    'aircraft_bus_load_calculator.html': {
      summary: 'Bus current from load power, bus voltage, and power factor.',
      variables: [
        { sym: 'I', desc: 'bus current' },
        { sym: 'P', desc: 'load power' },
        { sym: 'V', desc: 'bus voltage' },
        { sym: 'PF', desc: 'power factor' }
      ]
    },
    'tru_sizing_calculator.html': {
      summary: 'TRU input kVA, DC output kW, and DC output current from AC line quantities and efficiency.',
      variables: [
        { sym: 'k', desc: 'phase factor (√3 for 3φ, 1 for 1φ)' },
        { sym: 'V_L', desc: 'AC line voltage' },
        { sym: 'I_L', desc: 'AC line current' },
        { sym: 'S_{in}', desc: 'rated AC input apparent power' },
        { sym: 'η', desc: 'TRU efficiency' },
        { sym: 'P_{out}', desc: 'DC output power' },
        { sym: 'V_{DC}', desc: 'DC output voltage' },
        { sym: 'I_{DC}', desc: 'DC output current' }
      ]
    },
    'battery_endurance_calculator.html': {
      summary: 'Battery endurance from ampere-hour capacity, usable factor, and DC load current.',
      variables: [
        { sym: 'C_{Ah}', desc: 'battery nameplate capacity' },
        { sym: 'f_{usable}', desc: 'usable fraction of nameplate (0.72 per workbook ARP4404C method)' },
        { sym: 'I_{load}', desc: 'total DC bus load' },
        { sym: 't_{min}', desc: 'endurance in minutes' }
      ]
    },
    'power_wire_analysis_calculator.html': {
      summary: 'SAE ARP4404C §9.3.4.2 — wire run length, conductor temperature, and temperature-corrected voltage drop for copper wire.',
      variables: [
        { sym: 'V_drop', desc: 'voltage drop along the wire run (§9.3.4.2)' },
        { sym: 'R_2', desc: 'resistance per foot corrected for conductor temperature T2' },
        { sym: 'R_L', desc: 'resistance per foot at 20 °C (wire specification)' },
        { sym: 'L_1', desc: 'maximum run length at 20 °C reference (derived from U = I × L × R_L)' },
        { sym: 'L_2', desc: 'maximum run length at estimated T2 (derived from R2 correction)' },
        { sym: 'T_1', desc: 'ambient temperature' },
        { sym: 'T_2', desc: 'estimated conductor temperature (§9.3.4.2 formula)' },
        { sym: 'T_R', desc: 'conductor temperature rating' },
        { sym: 'I', desc: 'circuit current' },
        { sym: 'I_max', desc: 'maximum allowable current at TR (per AS50881)' },
        { sym: 'U', desc: 'allowable voltage drop (ARP4404C Table 3)' },
        { sym: 'l_wire', desc: 'wire run length including ground return' }
      ]
    },
    'force_calculator.html': {
      summary: "Newton's second law: force equals mass times acceleration.",
      variables: [
        { sym: 'F', desc: 'force' },
        { sym: 'm', desc: 'mass' },
        { sym: 'a', desc: 'acceleration' }
      ]
    },
    'kinetic_energy_calculator.html': {
      summary: 'Energy of a moving object from its mass and speed.',
      variables: [
        { sym: 'KE', desc: 'kinetic energy' },
        { sym: 'm', desc: 'mass' },
        { sym: 'v', desc: 'velocity' }
      ]
    },
    'fuel_energy_calculator.html': {
      summary: 'Total energy available in a fuel mass.',
      variables: [
        { sym: 'E', desc: 'energy' },
        { sym: 'm', desc: 'fuel mass' },
        { sym: 'e', desc: 'energy density' }
      ]
    }
  };

  function calcIdFromFile(file) {
    return file.replace(/\.html$/, '').replace('_calculator', '');
  }

  if (!window.CalcFormat) {
    window.CalcFormat = {
      num: function (n, d) {
        var digits = typeof d === 'number' ? d : 3;
        if (typeof n !== 'number' || !isFinite(n)) return String(n);
        return n.toLocaleString('en-US', {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits
        });
      },
      line: function (label, val, unit) {
        var suffix = unit ? ' ' + unit : '';
        return String(label) + ': <strong>' + String(val) + suffix + '</strong>';
      },
      lines: function (arr) {
        return arr.join('<br>');
      }
    };
  }

  var defs = {};
  var byFile = {};
  Object.keys(META).forEach(function (file) {
    var id = calcIdFromFile(file);
    var m = META[file];
    byFile[file] = id;
    var ref = REFERENCE[file];
    defs[id] = {
      file: file,
      title: m.title,
      lead: m.lead,
      formula: m.formula || null,
      reference: m.formula ? {
        summary: (ref && ref.summary) || m.lead,
        variables: (ref && ref.variables) || []
      } : null,
      buttonLabel: m.buttonLabel,
      liveRecalc: true,
      fields: m.fields,
      help: HELP[file] || null,
      references: m.references || []
    };
  });

  defs['ohms_law'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var V = u.parse('voltage', 'Voltage');
        var I = u.parseNonZero('current', 'Current');
        var err = u.firstError(V, I);
        if (err) return ctx.fail(err.msg);
        var R = V.value / I.value;
        return ctx.ok(f.line('Resistance', f.num(R, 3), 'Ohm'));
      };

  defs['delta_three_phase_power'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var V = u.parseNonNegative('voltage', 'Line voltage');
        var I = u.parseNonNegative('current', 'Line current');
        var PF = u.parsePowerFactor('powerFactor');
        var err = u.firstError(V, I, PF);
        if (err) return ctx.fail(err.msg);
        var P = Math.sqrt(3) * V.value * I.value * PF.value;
        return ctx.ok(f.line('Power', f.num(P, 3), 'W'));
      };

  defs['star_three_phase_power'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var V = u.parseNonNegative('voltage', 'Line voltage');
        var I = u.parseNonNegative('current', 'Line current');
        var PF = u.parsePowerFactor('powerFactor');
        var err = u.firstError(V, I, PF);
        if (err) return ctx.fail(err.msg);
        var P = Math.sqrt(3) * V.value * I.value * PF.value;
        return ctx.ok(f.line('Power', f.num(P, 3), 'W'));
      };

  defs['dc_power'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var V = u.parse('voltage', 'Voltage');
        var I = u.parse('current', 'Current');
        var err = u.firstError(V, I);
        if (err) return ctx.fail(err.msg);
        var P = V.value * I.value;
        return ctx.ok(f.line('Power', f.num(P, 3), 'W'));
      };

  defs['unit_converter_energy'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var val = u.parse('value', 'Value');
        if (!val.ok) return ctx.fail(val.msg);
        var unit = document.getElementById('unit').value;
        var j = unit === 'kwh' ? val.value * 3.6e6 : val.value;
        return ctx.ok(f.lines([
          f.line('J', f.num(j, 3), ''),
          f.line('kWh', f.num(j / 3.6e6, 9), '')
        ]));
      };

  defs['energy_cost'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var P = u.parseNonNegative('power', 'Power');
        var t = u.parseNonNegative('hours', 'Time');
        var rate = u.parseNonNegative('rate', 'Cost rate');
        var err = u.firstError(P, t, rate);
        if (err) return ctx.fail(err.msg);
        var kWh = (P.value * t.value) / 1000;
        var cost = kWh * rate.value;
        return ctx.ok(f.lines([
          f.line('Energy', f.num(kWh, 3), 'kWh'),
          f.line('Cost', f.num(cost, 2), '')
        ]));
      };

  defs['unit_converter_frequency'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var val = u.parse('value', 'Value');
        if (!val.ok) return ctx.fail(val.msg);
        var unit = document.getElementById('unit').value;
        var hz = unit === 'khz' ? val.value * 1000 : unit === 'mhz' ? val.value * 1e6 : val.value;
        return ctx.ok(f.lines([
          f.line('Hz', f.num(hz, 3), ''),
          f.line('kHz', f.num(hz / 1000, 6), ''),
          f.line('MHz', f.num(hz / 1e6, 9), '')
        ]));
      };

  defs['ac_power'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var V = u.parseNonNegative('voltage', 'Voltage');
        var I = u.parseNonNegative('current', 'Current');
        var PF = u.parsePowerFactor('powerFactor');
        var err = u.firstError(V, I, PF);
        if (err) return ctx.fail(err.msg);
        var P = V.value * I.value * PF.value;
        return ctx.ok(f.line('Power', f.num(P, 3), 'W'));
      };

  defs['resistor_color_code'].compute = function (ctx) {
        var f = ctx.fmt;
        var digits = [
          { v: 0, c: 'Black' }, { v: 1, c: 'Brown' }, { v: 2, c: 'Red' }, { v: 3, c: 'Orange' },
          { v: 4, c: 'Yellow' }, { v: 5, c: 'Green' }, { v: 6, c: 'Blue' }, { v: 7, c: 'Violet' },
          { v: 8, c: 'Grey' }, { v: 9, c: 'White' }
        ];
        var mult = [
          { v: 1, c: 'Black x1' }, { v: 10, c: 'Brown x10' }, { v: 100, c: 'Red x100' },
          { v: 1000, c: 'Orange x1k' }, { v: 10000, c: 'Yellow x10k' }, { v: 100000, c: 'Green x100k' },
          { v: 1000000, c: 'Blue x1M' }, { v: 0.1, c: 'Gold x0.1' }, { v: 0.01, c: 'Silver x0.01' }
        ];
        var tol = [
          { v: 5, c: 'Gold +/-5%' }, { v: 10, c: 'Silver +/-10%' }, { v: 1, c: 'Brown +/-1%' }
        ];
        var b1 = parseInt(document.getElementById('b1').value, 10);
        var b2 = parseInt(document.getElementById('b2').value, 10);
        var b3 = parseInt(document.getElementById('b3').value, 10);
        var b4 = parseInt(document.getElementById('b4').value, 10);
        if (isNaN(b1) || isNaN(b2) || isNaN(b3) || isNaN(b4)) {
          return ctx.fail('Please select all bands.');
        }
        var d1 = digits[b1].v;
        var d2 = digits[b2].v;
        var m = mult[b3].v;
        var t = tol[b4].v;
        var R = (d1 * 10 + d2) * m;
        var pretty = R >= 1e6 ? f.num(R / 1e6, 2) + ' MOhm' : (R >= 1e3 ? f.num(R / 1e3, 2) + ' kOhm' : f.num(R, 1) + ' Ohm');
        return ctx.ok(f.lines([
          'Resistance: <strong>' + pretty + '</strong>',
          'Tolerance: <strong>+/-' + t + '%</strong>'
        ]));
      };
  defs['resistor_color_code'].onInit = function () {
        var digits = [
          { v: 0, c: 'Black' }, { v: 1, c: 'Brown' }, { v: 2, c: 'Red' }, { v: 3, c: 'Orange' },
          { v: 4, c: 'Yellow' }, { v: 5, c: 'Green' }, { v: 6, c: 'Blue' }, { v: 7, c: 'Violet' },
          { v: 8, c: 'Grey' }, { v: 9, c: 'White' }
        ];
        var mult = [
          { v: 1, c: 'Black x1' }, { v: 10, c: 'Brown x10' }, { v: 100, c: 'Red x100' },
          { v: 1000, c: 'Orange x1k' }, { v: 10000, c: 'Yellow x10k' }, { v: 100000, c: 'Green x100k' },
          { v: 1000000, c: 'Blue x1M' }, { v: 0.1, c: 'Gold x0.1' }, { v: 0.01, c: 'Silver x0.01' }
        ];
        var tol = [
          { v: 5, c: 'Gold +/-5%' }, { v: 10, c: 'Silver +/-10%' }, { v: 1, c: 'Brown +/-1%' }
        ];
        function fill(id, arr) {
          var sel = document.getElementById(id);
          if (!sel) return;
          sel.innerHTML = '';
          arr.forEach(function (o, i) {
            var opt = document.createElement('option');
            opt.value = String(i);
            opt.textContent = o.c;
            sel.appendChild(opt);
          });
        }
        fill('b1', digits);
        fill('b2', digits);
        fill('b3', mult);
        fill('b4', tol);
        var b1 = document.getElementById('b1');
        var b2 = document.getElementById('b2');
        var b3 = document.getElementById('b3');
        var b4 = document.getElementById('b4');
        if (b1) b1.value = '4';
        if (b2) b2.value = '7';
        if (b3) b3.value = '2';
        if (b4) b4.value = '0';
      };

  defs['power_triangle_converter'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var P = u.parseNonNegative('kw', 'True power');
        var PF = u.parsePowerFactor('pf');
        var err = u.firstError(P, PF);
        if (err) return ctx.fail(err.msg);
        var S = P.value / PF.value;
        var Q = Math.sqrt(S * S - P.value * P.value);
        if (isNaN(Q)) return ctx.fail('Could not calculate reactive power. Check your inputs.');
        return ctx.ok(f.lines([
          f.line('Apparent Power', f.num(S, 3), 'kVA'),
          f.line('Reactive Power', f.num(Q, 3), 'kVAR')
        ]));
      };

  defs['delta_phase_three_phase_power'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var V = u.parseNonNegative('voltage', 'Phase voltage');
        var I = u.parseNonNegative('current', 'Phase current');
        var PF = u.parsePowerFactor('powerFactor');
        var err = u.firstError(V, I, PF);
        if (err) return ctx.fail(err.msg);
        var P = 3 * V.value * I.value * PF.value;
        return ctx.ok(f.line('Power', f.num(P, 3), 'W'));
      };

  defs['generator_efficiency'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var Pin = u.parsePositive('powerIn', 'Input power');
        var Pout = u.parseNonNegative('powerOut', 'Output power');
        var err = u.firstError(Pin, Pout);
        if (err) return ctx.fail(err.msg);
        if (Pout.value > Pin.value) return ctx.fail('Output power cannot be greater than input power.');
        var eta = (Pout.value / Pin.value) * 100;
        return ctx.ok(f.line('Efficiency', f.num(eta, 2), '%'));
      };

  defs['unit_converter_voltage'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var val = u.parse('value', 'Value');
        if (!val.ok) return ctx.fail(val.msg);
        var unit = document.getElementById('unit').value;
        var v = unit === 'kv' ? val.value * 1000 : val.value;
        return ctx.ok(f.lines([
          f.line('V', f.num(v, 3), ''),
          f.line('kV', f.num(v / 1000, 6), '')
        ]));
      };

  defs['power_ohms_law'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var V = u.parse('voltage', 'Voltage');
        var R = u.parseNonZero('resistance', 'Resistance');
        var err = u.firstError(V, R);
        if (err) return ctx.fail(err.msg);
        var Pv = (V.value * V.value) / R.value;
        var I = V.value / R.value;
        var Pi = I * I * R.value;
        return ctx.ok(f.lines([
          'Power (V&sup2;/R): <strong>' + f.num(Pv, 3) + ' W</strong>',
          'Power (I&sup2;R): <strong>' + f.num(Pi, 3) + ' W</strong>'
        ]));
      };

  defs['db_converter'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var mode = document.getElementById('mode').value;
        var val = u.parse('value', 'Value');
        if (!val.ok) return ctx.fail(val.msg);
        if (mode === 'mw' && val.value <= 0) return ctx.fail('Power in milliwatts must be greater than zero.');
        var mw;
        var dbm;
        var db;
        if (mode === 'dbm') {
          dbm = val.value;
          mw = Math.pow(10, dbm / 10);
          db = dbm;
        } else if (mode === 'mw') {
          mw = val.value;
          dbm = 10 * Math.log10(mw);
          db = dbm;
        } else {
          db = val.value;
          dbm = db;
          mw = Math.pow(10, dbm / 10);
        }
        if (!isFinite(mw) || !isFinite(dbm)) return ctx.fail('Could not convert these values. Check your input.');
        return ctx.ok(f.lines([
          f.line('Power', f.num(mw, 6), 'mW'),
          f.line('dBm', f.num(dbm, 3), 'dBm'),
          f.line('dB ratio', f.num(db, 3), 'dB')
        ]));
      };

  defs['unit_converter_current'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var val = u.parse('value', 'Value');
        if (!val.ok) return ctx.fail(val.msg);
        var unit = document.getElementById('unit').value;
        var a = unit === 'ma' ? val.value / 1000 : val.value;
        return ctx.ok(f.lines([
          f.line('A', f.num(a, 6), ''),
          f.line('mA', f.num(a * 1000, 3), '')
        ]));
      };

  defs['inverter_efficiency'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var Pdc = u.parsePositive('powerDC', 'DC input power');
        var Pac = u.parseNonNegative('powerAC', 'AC output power');
        var err = u.firstError(Pdc, Pac);
        if (err) return ctx.fail(err.msg);
        if (Pac.value > Pdc.value) return ctx.fail('AC output power cannot be greater than DC input power.');
        var eta = (Pac.value / Pdc.value) * 100;
        return ctx.ok(f.line('Efficiency', f.num(eta, 2), '%'));
      };

  defs['tru_efficiency'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var Pin = u.parsePositive('powerIn', 'Power in');
        var Pout = u.parseNonNegative('powerOut', 'Power out');
        var err = u.firstError(Pin, Pout);
        if (err) return ctx.fail(err.msg);
        if (Pout.value > Pin.value) return ctx.fail('Power out cannot be greater than power in.');
        var eta = (Pout.value / Pin.value) * 100;
        return ctx.ok(f.line('Efficiency', f.num(eta, 2), '%'));
      };

  defs['logic_truth_table'].compute = function (ctx) {
        var gate = document.getElementById('gate').value;
        var ops = {
          and: function (a, b) { return a && b; },
          or: function (a, b) { return a || b; },
          nand: function (a, b) { return !(a && b); },
          nor: function (a, b) { return !(a || b); },
          xor: function (a, b) { return a !== b; },
          xnor: function (a, b) { return a === b; }
        };
        var fn = ops[gate];
        if (!fn) return ctx.fail('Please select a valid gate.');
        var html = '<table class="truth-table"><tr><th>A</th><th>B</th><th>Out</th></tr>';
        [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(function (row) {
          var out = fn(row[0], row[1]) ? 1 : 0;
          html += '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + out + '</td></tr>';
        });
        html += '</table>';
        return ctx.ok(html);
      };

  defs['power_factor'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var P = u.parseNonNegative('truePower', 'True power');
        var Q = u.parseNonNegative('reactivePower', 'Reactive power');
        var err = u.firstError(P, Q);
        if (err) return ctx.fail(err.msg);
        if (P.value === 0 && Q.value === 0) return ctx.fail('True power and reactive power cannot both be zero.');
        var S = Math.sqrt(P.value * P.value + Q.value * Q.value);
        var PF = P.value / S;
        return ctx.ok(f.line('Power Factor', f.num(PF, 3), ''));
      };

  defs['impedance'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var R = u.parseNonNegative('resistance', 'Resistance');
        var X = u.parse('reactance', 'Reactance');
        var err = u.firstError(R, X);
        if (err) return ctx.fail(err.msg);
        var Z = Math.sqrt(R.value * R.value + X.value * X.value);
        return ctx.ok(f.line('Impedance', f.num(Z, 3), 'Ohm'));
      };

  defs['motor_current'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var P = u.parsePositive('power', 'Power');
        var V = u.parsePositive('voltage', 'Line voltage');
        var PF = u.parsePowerFactor('pf');
        var eta = u.parseEfficiency('efficiency', 'Efficiency');
        var err = u.firstError(P, V, PF, eta);
        if (err) return ctx.fail(err.msg);
        var I = P.value / (Math.sqrt(3) * V.value * PF.value * eta.value);
        return ctx.ok(f.line('Full-Load Current', f.num(I, 3), 'A'));
      };

  defs['cable_voltage_drop'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var I = u.parseNonNegative('current', 'Current');
        var Rkm = u.parseNonNegative('resistance', 'Cable resistance');
        var L = u.parseNonNegative('length', 'Cable length');
        var err = u.firstError(I, Rkm, L);
        if (err) return ctx.fail(err.msg);
        var R = Rkm.value * (L.value / 1000);
        var Vdrop = I.value * R;
        return ctx.ok(f.line('Voltage Drop', f.num(Vdrop, 3), 'V'));
      };

  defs['delta_current'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var Iph = u.parseNonNegative('phaseCurrent', 'Phase current');
        if (!Iph.ok) return ctx.fail(Iph.msg);
        var Il = Math.sqrt(3) * Iph.value;
        return ctx.ok(f.line('Line Current', f.num(Il, 3), 'A'));
      };

  defs['capacitive_reactance'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var fr = u.parsePositive('frequency', 'Frequency');
        var C = u.parsePositive('capacitance', 'Capacitance');
        var err = u.firstError(fr, C);
        if (err) return ctx.fail(err.msg);
        var XC = 1 / (2 * Math.PI * fr.value * (C.value * 1e-6));
        return ctx.ok(f.line('Capacitive Reactance', f.num(XC, 3), 'Ohm'));
      };

  defs['kinetic_energy'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var m = u.parseNonNegative('mass', 'Mass');
        var v = u.parse('velocity', 'Velocity');
        var err = u.firstError(m, v);
        if (err) return ctx.fail(err.msg);
        var KE = 0.5 * m.value * v.value * v.value;
        return ctx.ok(f.line('Kinetic Energy', f.num(KE, 3), 'J'));
      };

  defs['star_phase_three_phase_power'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var V = u.parseNonNegative('voltage', 'Phase voltage');
        var I = u.parseNonNegative('current', 'Phase current');
        var PF = u.parsePowerFactor('powerFactor');
        var err = u.firstError(V, I, PF);
        if (err) return ctx.fail(err.msg);
        var P = 3 * V.value * I.value * PF.value;
        return ctx.ok(f.line('Power', f.num(P, 3), 'W'));
      };

  defs['radians_to_degrees'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var radians = u.parse('radians', 'Angle');
        if (!radians.ok) return ctx.fail(radians.msg);
        var degrees = radians.value * (180 / Math.PI);
        return ctx.ok('Degrees: <strong>' + f.num(degrees, 6) + '&deg;</strong>');
      };

  defs['degrees_to_radians'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var degrees = u.parse('degrees', 'Angle');
        if (!degrees.ok) return ctx.fail(degrees.msg);
        var radians = degrees.value * (Math.PI / 180);
        return ctx.ok(f.line('Radians', f.num(radians, 6), 'rad'));
      };

  defs['aircraft_bus_load'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var P = u.parsePositive('power', 'Load power');
        if (!P.ok) return ctx.fail(P.msg);
        var type = document.getElementById('busType').value;
        var PF = type === 'dc' ? { ok: true, value: 1 } : u.parsePowerFactor('pf');
        if (!PF.ok) return ctx.fail(PF.msg);
        var V = type === 'dc' ? 28 : 115;
        var I = P.value / (V * PF.value);
        return ctx.ok(f.lines([
          f.line('Bus Voltage', V, 'V'),
          f.line('Bus Current', f.num(I, 3), 'A')
        ]));
      };

  defs['tru_sizing'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var phaseEl = document.getElementById('phaseType');
        var phase = phaseEl ? phaseEl.value : 'three_phase';
        var Vline = u.parsePositive('inputVoltage', 'AC line voltage');
        var Iline = u.parsePositive('inputCurrent', 'AC input current');
        var eta = u.parseEfficiency('efficiency', 'TRU efficiency');
        var Vdc = u.parsePositive('dcVoltage', 'DC output voltage');
        var err = u.firstError(Vline, Iline, eta, Vdc);
        if (err) return ctx.fail(err.msg);

        var phaseFactor = phase === 'three_phase' ? Math.sqrt(3) : 1;
        var kva = (phaseFactor * Iline.value * Vline.value) / 1000;
        var kwOut = kva * eta.value;
        var iDc = (kwOut * 1000) / Vdc.value;

        var lines = [
          f.line('Phase factor', phase === 'three_phase' ? '√3 (three-phase)' : '1 (single-phase)', ''),
          f.line('Rated AC input power', f.num(kva, 3), 'kVA'),
          f.line('DC output power', f.num(kwOut, 3), 'kW'),
          f.line('DC output current', f.num(iDc, 2), 'A')
        ];

        var limitEl = document.getElementById('dcCurrentLimit');
        if (limitEl && String(limitEl.value).trim() !== '') {
          var limit = u.parsePositive('dcCurrentLimit', 'DC current limit');
          if (!limit.ok) return ctx.fail(limit.msg);
          var margin = limit.value - iDc;
          lines.push(f.line('Margin to limit', f.num(margin, 2), 'A'));
          if (iDc > limit.value + 0.01) {
            lines.push('<span class="calc-note">DC output exceeds the TRU current limit — reduce load or add capacity.</span>');
          }
        }

        return ctx.ok(f.lines(lines));
      };

  defs['battery_endurance'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var capacity = u.parsePositive('batteryCapacity', 'Battery capacity');
        if (!capacity.ok) return ctx.fail(capacity.msg);

        var methodEl = document.getElementById('calcMethod');
        var factor = methodEl && methodEl.value === 'nameplate' ? 1 : 0.72;
        var scenarios = [
          { id: 'load1', label: 'Scenario 1' },
          { id: 'load2', label: 'Scenario 2' },
          { id: 'load3', label: 'Scenario 3' }
        ];
        var lines = [
          f.line('Nameplate capacity', f.num(capacity.value, 2), 'Ah'),
          f.line('Usable factor', f.num(factor, 2), '× nameplate'),
          f.line('Usable charge', f.num(capacity.value * factor, 2), 'Ah')
        ];
        var anyLoad = false;

        scenarios.forEach(function (scenario) {
          var el = document.getElementById(scenario.id);
          if (!el || String(el.value).trim() === '') {
            return;
          }
          var load = u.parsePositive(scenario.id, scenario.label + ' load');
          if (!load.ok) {
            return;
          }
          anyLoad = true;
          var minutes = (capacity.value * 60 * factor) / load.value;
          var hours = minutes / 60;
          lines.push(f.line(scenario.label + ' endurance', f.num(minutes, 1) + ' min (' + f.num(hours, 2) + ' h)', 'at ' + f.num(load.value, 2) + ' A'));
        });

        if (!anyLoad) {
          return ctx.fail('Enter at least one load scenario in amps.');
        }

        return ctx.ok(f.lines(lines));
      };

  defs['tru_sizing'].onInit = function () {
        var phaseEl = document.getElementById('phaseType');
        var voltageEl = document.getElementById('inputVoltage');
        if (!phaseEl || !voltageEl) return;

        function syncVoltagePreset() {
          var current = String(voltageEl.value).trim();
          if (phaseEl.value === 'single_phase') {
            if (current === '' || current === '200') {
              voltageEl.value = '115';
            }
          } else if (current === '' || current === '115') {
            voltageEl.value = '200';
          }
        }

        phaseEl.addEventListener('change', syncVoltagePreset);
      };

  defs['power_wire_analysis'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var COPPER_REF = 254.5;
        var COPPER_COEF = 234.5;

        var U = u.parsePositive('allowableDrop', 'Allowable voltage drop');
        var I = u.parsePositive('current', 'Circuit current');
        var T1 = u.parse('ambientTemp', 'Ambient temperature');
        var TR = u.parsePositive('ratedTemp', 'Wire rated temperature');
        var Imax = u.parsePositive('imax', 'Maximum allowable current');
        var Lwire = u.parseNonNegative('wireLength', 'Wire run length');
        var err = u.firstError(U, I, T1, TR, Imax, Lwire);
        if (err) return ctx.fail(err.msg);

        if (TR.value <= T1.value) {
          return ctx.fail('Wire rated temperature must be greater than ambient temperature.');
        }

        var gaugeEl = document.getElementById('wireGauge');
        var Rft;
        if (gaugeEl && gaugeEl.value === 'custom') {
          var Rcustom = u.parsePositive('resistancePerFoot', 'Resistance per foot');
          if (!Rcustom.ok) return ctx.fail(Rcustom.msg);
          Rft = Rcustom.value;
        } else if (gaugeEl) {
          Rft = parseFloat(gaugeEl.value, 10);
          if (isNaN(Rft) || Rft <= 0) {
            return ctx.fail('Select a wire gauge or enter a custom resistance per foot.');
          }
        } else {
          var Rfallback = u.parsePositive('resistancePerFoot', 'Resistance per foot');
          if (!Rfallback.ok) return ctx.fail(Rfallback.msg);
          Rft = Rfallback.value;
        }

        var L1 = U.value / (I.value * Rft);
        var iImax = I.value / Imax.value;
        var T2 = T1.value + (TR.value - T1.value) * (iImax * iImax);
        var L2 = (COPPER_REF * L1) / (COPPER_COEF + T2);
        var tempFactor = (COPPER_COEF + T2) / COPPER_REF;
        var Vdrop = I.value * Rft * Lwire.value * tempFactor;

        var lines = [
          f.line('L1 — max length at 20 °C ref.', f.num(L1, 2), 'ft'),
          f.line('T2 — estimated conductor temp.', f.num(T2, 1), '°C'),
          f.line('L2 — derated max length', f.num(L2, 2), 'ft'),
          f.line('Voltage drop at run length', f.num(Vdrop, 3), 'V')
        ];

        if (Lwire.value > L2.value + 0.01) {
          lines.push('<span class="calc-note">Run length exceeds derated maximum L2 — consider larger wire or shorter run.</span>');
        }
        if (Vdrop.value > U.value + 0.001) {
          lines.push('<span class="calc-note">Voltage drop exceeds allowable limit U.</span>');
        }
        if (I.value > Imax.value) {
          lines.push('<span class="calc-note">Circuit current exceeds Imax — wire ampacity may be insufficient.</span>');
        }

        return ctx.ok(f.lines(lines));
      };

  defs['force'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var m = u.parseNonNegative('mass', 'Mass');
        var a = u.parse('acceleration', 'Acceleration');
        var err = u.firstError(m, a);
        if (err) return ctx.fail(err.msg);
        var F = m.value * a.value;
        return ctx.ok(f.line('Force', f.num(F, 3), 'N'));
      };

  defs['unit_converter_power'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var val = u.parse('value', 'Value');
        if (!val.ok) return ctx.fail(val.msg);
        var unit = document.getElementById('unit').value;
        var w = unit === 'kw' ? val.value * 1000 : unit === 'mw' ? val.value / 1000 : val.value;
        return ctx.ok(f.lines([
          f.line('mW', f.num(w * 1000, 3), ''),
          f.line('W', f.num(w, 3), ''),
          f.line('kW', f.num(w / 1000, 6), '')
        ]));
      };

  defs['reactive_power'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var V = u.parseNonNegative('voltage', 'Voltage');
        var I = u.parseNonNegative('current', 'Current');
        var angle = u.parse('angle', 'Phase angle');
        var err = u.firstError(V, I, angle);
        if (err) return ctx.fail(err.msg);
        var theta = angle.value * Math.PI / 180;
        var Q = V.value * I.value * Math.sin(theta);
        return ctx.ok(f.line('Reactive Power', f.num(Q, 3), 'VAR'));
      };

  defs['binary_decimal_hex_converter'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var base = parseInt(document.getElementById('base').value, 10);
        var raw = u.parseText('value', 'a value');
        if (!raw.ok) return ctx.fail(raw.msg);
        var n = parseInt(raw.value, base);
        if (isNaN(n)) return ctx.fail('That is not a valid number for the selected base.');
        return ctx.ok(f.lines([
          f.line('Decimal', n, ''),
          f.line('Binary', n.toString(2), ''),
          'Hex: <strong>0x' + n.toString(16).toUpperCase() + '</strong>'
        ]));
      };

  defs['transformer_ratio'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var V1 = u.parse('primaryV', 'Primary voltage');
        var N1 = u.parseNonZero('primaryN', 'Primary turns');
        var N2 = u.parse('secondaryN', 'Secondary turns');
        var err = u.firstError(V1, N1, N2);
        if (err) return ctx.fail(err.msg);
        var V2 = V1.value * (N2.value / N1.value);
        return ctx.ok(f.line('Secondary Voltage', f.num(V2, 3), 'V'));
      };

  defs['star_voltage'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var Vph = u.parseNonNegative('phaseVoltage', 'Phase voltage');
        if (!Vph.ok) return ctx.fail(Vph.msg);
        var Vl = Math.sqrt(3) * Vph.value;
        return ctx.ok(f.line('Line Voltage', f.num(Vl, 3), 'V'));
      };

  defs['twos_complement_converter'].compute = function (ctx) {
        var u = ctx.util;
        var n = u.parse('decimal', 'Decimal value');
        if (!n.ok) return ctx.fail(n.msg);
        if (n.value < -128 || n.value > 127 || Math.floor(n.value) !== n.value) {
          return ctx.fail('Enter a whole number from -128 to 127.');
        }
        var v = ((n.value % 256) + 256) % 256;
        var bits = v.toString(2).padStart(8, '0');
        return ctx.ok('8-bit 2\'s complement: <strong>' + bits + '</strong>');
      };

  defs['three_phase_power'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var V = u.parseNonNegative('voltage', 'Line voltage');
        var I = u.parseNonNegative('current', 'Line current');
        var PF = u.parsePowerFactor('powerFactor');
        var err = u.firstError(V, I, PF);
        if (err) return ctx.fail(err.msg);
        var P = Math.sqrt(3) * V.value * I.value * PF.value;
        return ctx.ok(f.line('Power', f.num(P, 3), 'W'));
      };

  defs['inductive_reactance'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var fr = u.parsePositive('frequency', 'Frequency');
        var L = u.parsePositive('inductance', 'Inductance');
        var err = u.firstError(fr, L);
        if (err) return ctx.fail(err.msg);
        var XL = 2 * Math.PI * fr.value * L.value;
        return ctx.ok(f.line('Inductive Reactance', f.num(XL, 3), 'Ohm'));
      };

  defs['apparent_power'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var P = u.parseNonNegative('truePower', 'True power');
        var Q = u.parseNonNegative('reactivePower', 'Reactive power');
        var err = u.firstError(P, Q);
        if (err) return ctx.fail(err.msg);
        var S = Math.sqrt(P.value * P.value + Q.value * Q.value);
        return ctx.ok(f.line('Apparent Power', f.num(S, 3), 'VA'));
      };

  defs['fuel_energy'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var m = u.parsePositive('mass', 'Fuel mass');
        var e = u.parsePositive('density', 'Energy density');
        var err = u.firstError(m, e);
        if (err) return ctx.fail(err.msg);
        var E = m.value * e.value;
        return ctx.ok('Total Energy: <strong>' + f.num(E, 3) + ' MJ</strong> (' + f.num(E / 3.6, 3) + ' kWh)');
      };

  defs['unit_converter_resistance'].compute = function (ctx) {
        var u = ctx.util;
        var f = ctx.fmt;
        var val = u.parse('value', 'Value');
        if (!val.ok) return ctx.fail(val.msg);
        var unit = document.getElementById('unit').value;
        var ohm = unit === 'kohm' ? val.value * 1000 : unit === 'mohm' ? val.value * 1e6 : val.value;
        return ctx.ok(f.lines([
          f.line('Ohm', f.num(ohm, 3), ''),
          f.line('kOhm', f.num(ohm / 1000, 6), ''),
          f.line('MOhm', f.num(ohm / 1e6, 9), '')
        ]));
      };

  defs['logic_truth_table'].resultClass = 'truth-table-wrap';
  defs['logic_truth_table'].fieldsSectionTitle = 'Select Gate';
  defs['logic_truth_table'].placeholder = 'Select a gate to generate the truth table.';
  defs['resistor_color_code'].fieldsSectionTitle = 'Select Bands';
  defs['resistor_color_code'].placeholder = 'Select bands and decode.';

  window.CalcRegistry = {
    byFile: byFile,
    defs: defs
  };
})();
