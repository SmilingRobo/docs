---
title: Real-to-Sim-to-Real
description: The real-to-sim-to-real framework is designed by SmilingRobo for simplifying the training, transfer, and deployment of robotic policies.
---

The real-to-sim-to-real framework is designed to simplify the training, transfer, and deployment of robotic policies from simulated to real environments using NVIDIA Isaac Gym. <br><br>
This framework provides a structured pipeline for setting up custom environments, collecting demonstration data, training reinforcement learning models, applying teacher-student distillation, and deploying models in real-world setups. <br><br>
The framework is hosted and maintained by SmilingRobo and offers a GUI environment for creating realistic simulations.


## Requirements
- NVIDIA Isaac Gym

## Installation
1. Clone the Repository:

``` bash
git clone https://github.com/your-repo/real-to-sim-to-real.git
cd real-to-sim-to-real 
```

2. Install Dependencies:

Make sure you have Isaac Gym installed on your machine. <br>
For Isaac Gym installation, refer to the [official Isaac Gym installation guide](https://developer.nvidia.com/isaac-gym).

3. Install the Package:
``` bash
pip install -e . 
```
## Steps to Use the Framework
#### 1. Create Your Environment

To get started, you first need to create a custom environment for your robot. This can be easily done using the GUI tools available on [Platform](https://platform.smilingrobo.com/) Once your environment is configured, you can export it for use in this framework.

> [How to Make your Environment using Platform By SmilingRobo](https://platform.smilingrobo.com/)