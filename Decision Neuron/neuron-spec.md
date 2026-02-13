# Should I Break No Contact? - Neuron Decision Website Spec

## Overview
An interactive single-neuron decision system that humorously models the decision of whether to break no contact with an ex. Users can adjust input sliders to see how different factors influence the final decision, visualize decision boundaries, and optionally train the neuron with example scenarios.

---

## Core Concept

### The Neuron Model
A simple perceptron that computes:
```
output = sigmoid(w1*x1 + w2*x2 + w3*x3 + w4*x4 + w5*x5 + bias)
```

Where the sigmoid function maps the weighted sum to a value between 0 and 1.

---

## Inputs (5 sliders)

### 1. Time since last contact
- **Range:** 0 to 1
- **Label:** "Time since last contact"
- **Low end (0):** "literally yesterday"
- **High end (1):** "it's been years"
- **Weight:** +0.7
- **Default value:** 0.5

### 2. Current emotional state
- **Range:** 0 to 1
- **Label:** "Current emotional state"
- **Low end (0):** "so grounded"
- **High end (1):** "i need therapy"
- **Weight:** +0.9
- **Default value:** 0.5

### 3. Time of night
- **Range:** 0 to 1
- **Label:** "Time of night"
- **Low end (0):** "the sun is out"
- **High end (1):** "prime demon time hours"
- **Weight:** +0.6
- **Default value:** 0.3

### 4. Friends available to stop you
- **Range:** 0 to 1
- **Label:** "Friends available to stop you"
- **Low end (0):** "they're actively protesting"
- **High end (1):** "i'm completely alone"
- **Weight:** +0.7
- **Default value:** 0.5

### 5. Amount of hints they're dropping
- **Range:** 0 to 1
- **Label:** "Amount of hints they're dropping"
- **Low end (0):** "total silence"
- **High end (1):** "feeding my delusions"
- **Weight:** +0.8
- **Default value:** 0.3

---

## Model Parameters

### Bias
- **Value:** -0.3
- **Purpose:** Slight default tendency toward "don't do it"

### Weights Summary
```javascript
weights = [0.7, 0.9, 0.6, 0.7, 0.8]
bias = -0.3
```

---

## Output Display

### Output Value
The neuron outputs a value between 0 and 1 after applying the sigmoid function.

### Output Interpretation (5 ranges)

| Range | Label | Meaning |
|-------|-------|---------|
| 0.0 - 0.2 | "absolutely not" | Strong recommendation against contact |
| 0.2 - 0.4 | "don't do it" | Lean toward no contact |
| 0.4 - 0.6 | "hold me back" | Danger zone - could go either way |
| 0.6 - 0.8 | "perchance" | Leaning toward breaking no contact |
| 0.8 - 1.0 | "let's get sendy" | Strong impulse to make contact |

---

## Decision Boundary Visualization

### 2D Plot
- **X-axis:** Time of night (input 3)
- **Y-axis:** Current emotional state (input 2)
- **Other inputs:** Held at current slider values
- **Decision boundary:** Line where output = 0.5
- **Color coding:**
  - Below boundary (output < 0.5): "PUT THE PHONE DOWN" zone
  - Above boundary (output ≥ 0.5): "SEND IT" zone

### Visualization Labels
- **No zone label:** "PUT THE PHONE DOWN"
- **Yes zone label:** "SEND IT"

---

## Training Mode (Optional Feature)

### Purpose
Allow users to create example scenarios and adjust weights/bias to match desired outputs.

### Training Interface
1. **Add Example:** User sets all 5 input values and specifies desired output (0-1)
2. **Display Examples:** Show list of training examples as points on the visualization
3. **Train Button:** Adjust weights and bias to minimize error across all examples
4. **Training Algorithm:** Simple gradient descent or closed-form solution

### Example Scenarios (Pre-loaded suggestions)
- **Scenario 1:** "The 2am vulnerability spiral"
  - Inputs: [0.3, 0.8, 0.9, 0.8, 0.2]
  - Target output: 0.2 (should resist despite conditions)
  
- **Scenario 2:** "Healthy daytime check-in after 6 months"
  - Inputs: [0.5, 0.2, 0.1, 0.3, 0.1]
  - Target output: 0.3 (maybe okay, but cautious)
  
- **Scenario 3:** "They're breadcrumbing and you're alone at night"
  - Inputs: [0.3, 0.7, 0.8, 0.9, 0.9]
  - Target output: 0.9 (maximum danger - will probably send)

---

## UI/UX Design Notes

### Layout
- **Header:** Title "Should I Break No Contact?"
- **Main section:** 5 input sliders stacked vertically
- **Output section:** Large display of current output value and interpretation label
- **Visualization section:** 2D decision boundary plot
- **Optional training section:** Collapsible or separate tab

### Design Aesthetic
- Fun, slightly chaotic energy
- Relatable humor in copy
- Clear visual feedback when sliders change
- Color scheme that reflects the emotional nature (maybe warm/danger colors for high outputs, cool/safe colors for low)

### Interactivity
- Real-time updates as sliders move
- Smooth animations
- Hover states showing exact values
- Mobile-responsive design

---

## Technical Implementation

### Recommended Stack
- **Framework:** React (for state management and reactivity)
- **Visualization:** Recharts, D3.js, or Plotly for 2D plot
- **Styling:** Tailwind CSS
- **Math:** Basic JavaScript math (no heavy ML libraries needed)

### Key Functions

```javascript
// Sigmoid activation function
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

// Compute neuron output
function computeOutput(inputs, weights, bias) {
  const sum = inputs.reduce((acc, input, i) => acc + input * weights[i], 0) + bias;
  return sigmoid(sum);
}

// Determine output label based on value
function getOutputLabel(output) {
  if (output < 0.2) return "absolutely not";
  if (output < 0.4) return "don't do it";
  if (output < 0.6) return "hold me back";
  if (output < 0.8) return "perchance";
  return "let's get sendy";
}
```

---

## Future Enhancements (Optional)

1. **Multiple neuron layers:** Deep network for more complex decision modeling
2. **Share results:** Generate shareable link with current slider settings
3. **History tracking:** Save past decisions and see patterns over time
4. **Export model:** Download trained weights as JSON
5. **Comparison mode:** Compare multiple scenarios side-by-side
6. **Mobile app version:** Native app with notifications ("You're in the danger zone!")

---

## Success Criteria

- ✅ Users can intuitively adjust inputs and see output change in real-time
- ✅ Decision boundary visualization clearly shows the "danger zone"
- ✅ Copy/labels are funny and relatable
- ✅ Training mode (if implemented) successfully adjusts weights
- ✅ Works on mobile and desktop
- ✅ Actually might prevent some regrettable late-night texts (bonus!)
