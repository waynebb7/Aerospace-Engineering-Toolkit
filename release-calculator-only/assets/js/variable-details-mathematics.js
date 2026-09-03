window.VARIABLE_REF_DETAILS = {
  "x": {
    symbol: "\\( x \\)",
    title: "Independent Variable",
    explain: "In calculus and graphs, \\( x \\) is often the independent variable — the input you choose or control.",
    example: "For \\( y = 2x + 3 \\), when \\( x = 4 \\):<br>\\( y = 2(4) + 3 = 11 \\)."
  },
  "y": {
    symbol: "\\( y \\)",
    title: "Dependent Variable",
    explain: "The dependent variable \\( y \\) is determined by the function or equation — the output you calculate.",
    example: "If \\( y = x^2 \\) and \\( x = 5 \\), then \\( y = 25 \\)."
  },
  "m": {
    symbol: "\\( m \\)",
    title: "Gradient (Slope)",
    explain: "In \\( y = mx + c \\), gradient \\( m \\) is the change in \\( y \\) per unit change in \\( x \\).",
    example: "Line through (0, 2) and (4, 10):<br>\\( m = \\dfrac{10 - 2}{4 - 0} = 2 \\)."
  },
  "c_int": {
    symbol: "\\( c \\)",
    title: "Y-Intercept",
    explain: "The y-intercept \\( c \\) is where the line crosses the \\( y \\)-axis (when \\( x = 0 \\)).",
    example: "For \\( y = 2x + 3 \\), the y-intercept is \\( c = 3 \\)."
  },
  "dydx": {
    symbol: "\\( \\dfrac{dy}{dx} \\)",
    title: "First Derivative",
    explain: "The derivative measures the instantaneous rate of change of \\( y \\) with respect to \\( x \\).",
    example: "If \\( y = x^3 \\), then \\( \\dfrac{dy}{dx} = 3x^2 \\). At \\( x = 2 \\):<br>\\( \\dfrac{dy}{dx} = 12 \\)."
  },
  "d2ydx2": {
    symbol: "\\( \\dfrac{d^2y}{dx^2} \\)",
    title: "Second Derivative",
    explain: "The second derivative describes curvature and acceleration of the function — whether the slope is increasing or decreasing.",
    example: "If \\( y = x^3 \\), \\( \\dfrac{d^2y}{dx^2} = 6x \\). At \\( x = 1 \\):<br>\\( \\dfrac{d^2y}{dx^2} = 6 \\)."
  },
  "integral": {
    symbol: "\\( \\int \\)",
    title: "Integral",
    explain: "The definite integral accumulates a quantity — often area under a curve — between limits \\( a \\) and \\( b \\).",
    example: "\\( \\displaystyle\\int_0^2 3x\\,dx = \\left[\\tfrac{3x^2}{2}\\right]_0^2 = 6 \\)."
  },
  "limit": {
    symbol: "\\( \\lim \\)",
    title: "Limit",
    explain: "A limit describes the value a function approaches as the input approaches some point — essential for defining derivatives.",
    example: "\\( \\displaystyle\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = 1 \\)."
  },
  "sum": {
    symbol: "\\( \\sum \\)",
    title: "Summation",
    explain: "Sigma notation compactly adds a sequence of terms indexed by an integer variable.",
    example: "\\( \\displaystyle\\sum_{k=1}^{4} k = 1 + 2 + 3 + 4 = 10 \\)."
  },
  "theta": {
    symbol: "\\( \\theta \\)",
    title: "Angle",
    explain: "Theta often denotes an angle. Calculus and trigonometry typically use radians unless stated otherwise.",
    example: "In a right triangle with opposite 3 and hypotenuse 5:<br>\\( \\sin\\theta = \\tfrac{3}{5} = 0.6 \\)."
  },
  "pi": {
    symbol: "\\( \\pi \\)",
    title: "Pi",
    explain: "Pi is the ratio of a circle's circumference to its diameter, approximately 3.14159.",
    example: "Circle radius 5 cm: circumference \\( C = 2\\pi r = 2\\pi \\times 5 \\approx 31.4 \\text{ cm} \\)."
  },
  "e_euler": {
    symbol: "\\( e \\)",
    title: "Euler's Number",
    explain: "Euler's number \\( e \u0007pprox 2.718 \\) is the base of natural logarithms and appears in exponential growth and decay.",
    example: "Continuous growth at rate 5% per year: \\( A = P e^{0.05t} \\). After 10 years, \\( A = P e^{0.5} \\approx 1.65P \\)."
  },
  "i_imag": {
    symbol: "\\( i \\)",
    title: "Imaginary Unit",
    explain: "The imaginary unit satisfies \\( i^2 = -1 \\). Complex numbers have form \\( a + bi \\).",
    example: "\\( (3 + 2i) + (1 - 4i) = 4 - 2i \\)."
  },
  "abs": {
    symbol: "\\( |x| \\)",
    title: "Modulus (Absolute Value)",
    explain: "The modulus gives the non-negative magnitude of a real number or the magnitude of a complex number.",
    example: "\\( | -7 | = 7 \\). For complex \\( z = 3 + 4i \\):<br>\\( |z| = \\sqrt{3^2 + 4^2} = 5 \\)."
  },
  "log": {
    symbol: "\\( \\log \\)",
    title: "Logarithm (Base 10)",
    explain: "Common logarithm: \\( \\log_{10}(x) \\). Used in decibel scales and orders of magnitude.",
    example: "If \\( \\log_{10}(x) = 3 \\), then \\( x = 10^3 = 1000 \\)."
  },
  "ln": {
    symbol: "\\( \\ln \\)",
    title: "Natural Logarithm",
    explain: "Natural log is logarithm base \\( e \\): \\( \\ln(x) = \\log_e(x) \\). Inverse of the exponential function.",
    example: "\\( \\ln(e^3) = 3 \\). Also \\( \\dfrac{d}{dx}\\ln x = \\dfrac{1}{x} \\)."
  },
  "sin": {
    symbol: "\\( \\sin \\)",
    title: "Sine",
    explain: "Sine of angle \\( \theta \\) in a right triangle is opposite/hypotenuse. Extends to all angles via the unit circle.",
    example: "\\( \\sin(30°) = 0.5 \\). In radians, \\( \\sin(\\pi/6) = 0.5 \\)."
  },
  "cos": {
    symbol: "\\( \\cos \\)",
    title: "Cosine",
    explain: "Cosine is adjacent/hypotenuse in a right triangle. Used in projections and AC phase relationships.",
    example: "\\( \\cos(60°) = 0.5 \\). Identity: \\( \\sin^2\\theta + \\cos^2\\theta = 1 \\)."
  },
  "tan": {
    symbol: "\\( \\tan \\)",
    title: "Tangent",
    explain: "Tangent is opposite/adjacent, or \\( \tan\theta = \\sin\theta / \\cos\theta \\).",
    example: "\\( \\tan(45°) = 1 \\). For \\( \\theta = 45° \\), opposite equals adjacent."
  },
  "matrix_A": {
    symbol: "\\( A \\)",
    title: "Matrix",
    explain: "A matrix is a rectangular array of numbers. Linear systems use \\( A\\mathbf{x} = \\mathbf{b} \\).",
    example: "\\( A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\) has determinant \\( \\det(A) = 1 \\times 4 - 2 \\times 3 = -2 \\)."
  },
  "det": {
    symbol: "\\( \\det \\)",
    title: "Determinant",
    explain: "The determinant of a 2×2 matrix \\( \begin{pmatrix} a & b \\ c & d \\end{pmatrix} \\) is \\( ad - bc \\). Zero determinant means no unique inverse.",
    example: "\\( \\det\\begin{pmatrix} 2 & 1 \\\\ 4 & 3 \\end{pmatrix} = 2 \\times 3 - 1 \\times 4 = 2 \\)."
  },
  "eigenvalue": {
    symbol: "\\( \\lambda \\)",
    title: "Eigenvalue",
    explain: "An eigenvalue \\( \\lambda \\) satisfies \\( A\\mathbf{v} = \\lambda\\mathbf{v} \\) for a non-zero eigenvector \\( \\mathbf{v} \\).",
    example: "For \\( A = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix} \\), eigenvalues are \\( \\lambda = 2 \\) and \\( \\lambda = 3 \\)."
  },
  "nabla": {
    symbol: "\\( \\nabla \\)",
    title: "Del (Nabla Operator)",
    explain: "In vector calculus, \\( \nabla f \\) is the gradient of a scalar field — pointing in the direction of steepest increase.",
    example: "If \\( f(x,y) = x^2 + y^2 \\), then \\( \\nabla f = (2x, 2y) \\). At (1, 2): \\( \\nabla f = (2, 4) \\)."
  },
  "partial": {
    symbol: "\\( \\partial \\)",
    title: "Partial Derivative",
    explain: "Partial derivatives hold other variables fixed: \\( \\partial f / \\partial x \\) measures change in \\( f \\) as \\( x \\) varies.",
    example: "If \\( f(x,y) = xy \\), then \\( \\dfrac{\\partial f}{\\partial x} = y \\) and \\( \\dfrac{\\partial f}{\\partial y} = x \\)."
  },
  "nCr": {
    symbol: "\\( \\binom{n}{r} \\)",
    title: "Binomial Coefficient",
    explain: "Counts ways to choose \\( r \\) items from \\( n \\) without order: \\( \binom{n}{r} = \\dfrac{n!}{r!(n-r)!} \\).",
    example: "\\( \\binom{5}{2} = \\dfrac{5!}{2! \\cdot 3!} = 10 \\) ways to choose 2 from 5."
  },
};
