window.EQUATION_REF_DETAILS = {
  "quadratic": {
    symbol: "\\( x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\)",
    title: "Quadratic Formula",
    explain: "Solves \\( ax^2 + bx + c = 0 \\). Discriminant \\( b^2 - 4ac \\) determines the number of real roots.",
    example: "\\( x^2 - 5x + 6 = 0 \\): \\( a=1, b=-5, c=6 \\):<br>\\( x = \\dfrac{5 \\pm \\sqrt{25-24}}{2} = 3 \\) or \\( 2 \\)."
  },
  "pythagoras": {
    symbol: "\\( a^2 + b^2 = c^2 \\)",
    title: "Pythagoras' Theorem",
    explain: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
    example: "\\( a = 3 \\), \\( b = 4 \\):<br>\\( c = \\sqrt{3^2 + 4^2} = 5 \\)."
  },
  "straight_line": {
    symbol: "\\( y = mx + c \\)",
    title: "Straight-Line Equation",
    explain: "\\( m \\) is gradient; \\( c \\) is the y-intercept. Parallel lines share the same \\( m \\).",
    example: "Gradient 2, intercept -3:<br>\\( y = 2x - 3 \\). When \\( x = 4 \\), \\( y = 5 \\)."
  },
  "gradient": {
    symbol: "\\( m = \\dfrac{y_2 - y_1}{x_2 - x_1} \\)",
    title: "Gradient Formula",
    explain: "Change in \\( y \\) divided by change in \\( x \\) between two points on a line.",
    example: "Points (1, 2) and (5, 10):<br>\\( m = \\dfrac{10 - 2}{5 - 1} = 2 \\)."
  },
  "sine_rule": {
    symbol: "\\( \\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} \\)",
    title: "Sine Rule",
    explain: "Relates sides and opposite angles in any triangle. Useful when matching side–angle pairs.",
    example: "\\( A = 30° \\), \\( a = 8 \\), \\( B = 45° \\):<br>\\( b = \\dfrac{8\\sin 45°}{\\sin 30°} = 8\\sqrt{2} \\approx 11.3 \\)."
  },
  "cosine_rule": {
    symbol: "\\( c^2 = a^2 + b^2 - 2ab\\cos C \\)",
    title: "Cosine Rule",
    explain: "Generalises Pythagoras for non-right triangles. Finds a side when two sides and the included angle are known.",
    example: "\\( a = 5 \\), \\( b = 7 \\), \\( C = 60° \\):<br>\\( c^2 = 25 + 49 - 2(5)(7)\\cos 60° = 39 \\Rightarrow c = \\sqrt{39} \\)."
  },
  "trig_identity": {
    symbol: "\\( \\sin^2\\theta + \\cos^2\\theta = 1 \\)",
    title: "Pythagorean Trig Identity",
    explain: "Fundamental identity from the unit circle. Used to simplify expressions and solve equations.",
    example: "If \\( \\sin\\theta = 0.6 \\), then \\( \\cos^2\\theta = 1 - 0.36 = 0.64 \\Rightarrow \\cos\\theta = \\pm 0.8 \\)."
  },
  "power_rule": {
    symbol: "\\( \\dfrac{d}{dx}(x^n) = nx^{n-1} \\)",
    title: "Power Rule (Differentiation)",
    explain: "Differentiates polynomial terms. Valid for real \\( n \\) where the derivative exists.",
    example: "\\( y = x^4 \\):<br>\\( \\dfrac{dy}{dx} = 4x^3 \\). At \\( x = 2 \\), gradient \\( = 32 \\)."
  },
  "chain_rule": {
    symbol: "\\( \\dfrac{dy}{dx} = \\dfrac{dy}{du}\\dfrac{du}{dx} \\)",
    title: "Chain Rule",
    explain: "Differentiates composite functions by multiplying inner and outer derivatives.",
    example: "\\( y = (3x + 1)^5 \\): let \\( u = 3x+1 \\).<br>\\( \\dfrac{dy}{dx} = 5u^4 \\times 3 = 15(3x+1)^4 \\)."
  },
  "int_power": {
    symbol: "\\( \\int x^n \\, dx = \\dfrac{x^{n+1}}{n+1} + C \\)",
    title: "Power Rule (Integration)",
    explain: "Integrates polynomial terms for \\( n \\neq -1 \\). Add constant of integration \\( C \\).",
    example: "\\( \\int 3x^2 \\, dx = x^3 + C \\). Definite from 0 to 2: \\( 8 - 0 = 8 \\)."
  },
  "binomial_sq": {
    symbol: "\\( (a + b)^2 = a^2 + 2ab + b^2 \\)",
    title: "Perfect Square Expansion",
    explain: "Expands a squared binomial. Signs change for \\( (a - b)^2 = a^2 - 2ab + b^2 \\).",
    example: "\\( (x + 3)^2 = x^2 + 6x + 9 \\)."
  },
  "arith_seq": {
    symbol: "\\( u_n = a + (n-1)d \\)",
    title: "Arithmetic Sequence",
    explain: "\\( a \\) is first term, \\( d \\) is common difference, \\( n \\) is term number.",
    example: "\\( a = 5 \\), \\( d = 3 \\):<br>\\( u_4 = 5 + 3(4-1) = 14 \\)."
  },
  "geom_seq": {
    symbol: "\\( u_n = ar^{n-1} \\)",
    title: "Geometric Sequence",
    explain: "\\( a \\) is first term, \\( r \\) is common ratio. Terms multiply by \\( r \\) each step.",
    example: "\\( a = 2 \\), \\( r = 3 \\):<br>\\( u_4 = 2 \\times 3^3 = 54 \\)."
  },
  "log_product": {
    symbol: "\\( \\log_a(xy) = \\log_a x + \\log_a y \\)",
    title: "Logarithm Product Rule",
    explain: "Log of a product equals sum of logs. Requires \\( x, y > 0 \\) and valid base.",
    example: "\\( \\log_{10}(50) = \\log_{10}(5) + \\log_{10}(10) \\approx 0.699 + 1 = 1.699 \\)."
  },
  "circle_area": {
    symbol: "\\( A = \\pi r^2 \\)",
    title: "Area of a Circle",
    explain: "Area enclosed by a circle of radius \\( r \\). Circumference is \\( C = 2\\pi r \\).",
    example: "\\( r = 5 \\text{ cm} \\):<br>\\( A = \\pi \\times 25 \\approx 78.5 \\text{ cm}^2 \\)."
  },
  "sphere_volume": {
    symbol: "\\( V = \\tfrac{4}{3}\\pi r^3 \\)",
    title: "Volume of a Sphere",
    explain: "Volume of a sphere in terms of radius. Surface area is \\( 4\\pi r^2 \\).",
    example: "\\( r = 3 \\text{ m} \\):<br>\\( V = \\tfrac{4}{3}\\pi \\times 27 \\approx 113 \\text{ m}^3 \\)."
  },
  "eigenvalue": {
    symbol: "\\( A\\mathbf{v} = \\lambda\\mathbf{v} \\)",
    title: "Eigenvalue Equation",
    explain: "\\( \\lambda \\) is an eigenvalue and \\( \\mathbf{v} \\) an eigenvector when the matrix scales the vector without rotating direction.",
    example: "\\( A = \\begin{pmatrix}2 & 0 \\\\ 0 & 3\\end{pmatrix} \\): eigenvalues \\( 2 \\) and \\( 3 \\) with axes as eigenvectors."
  },
  "distance_2d": {
    symbol: "\\( d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2} \\)",
    title: "Distance Between Two Points",
    explain: "Euclidean distance in the plane from the coordinate difference.",
    example: "(0, 0) to (6, 8):<br>\\( d = \\sqrt{36 + 64} = 10 \\)."
  },
};
