---
title: How to Make your Environment using Platform By SmilingRobo
description: Using Platform by SmilingRobo to create you own Environment
---

Visit [Platform](https://platform.smilingrobo.com/) to Start Creating your Environment

This repository provides the official implementation of the RialTo GUI, as proposed in _Reconciling Reality through Simulation_: A Real-to-Sim-to-Real approach for Robust Manipulation The manuscript is available on [arXiv](https://arxiv.org/abs/2403.03949). See the [project page](https://real-to-sim-to-real.github.io/RialTo/)

## Steps

1. Start launching the GUI by visiting the following website: https://platform.smilingrobo.com/
2. Enter the Link of the Model and Click on the Load Model<br>
<img src="/public/img1.png" alt="" />

#### Scan scene and any additional objects you want to interact with:

1. Use Polycam for the scenes
2. Use ARCode for single objects (where you can do a 360 scan around the object)
3. Download the mesh as a USDZ/USD or GLB
4. If you download it as a USDZ convert it into a GLB file through: https://products.aspose.app/3d/conversion/usdz-to-glb
5. Go to the GUI and import your scene and objects (click on upload from local on the menu bar)
6. You can move/rotate/scale the objects by clicking on the object and selecting on the position/rotation/scale buttons on the menu bar
7. Cut objects: click on Pre Cut > a bounding box will appear > you make sure the object you want to separate is within the bounding box (you can scale/rotate/move the box) > click post cut
8. Delete objects: Select object and click on delete (you can delete the table for example)
9. Add a joint:

   a. Click on pre add joint > select two meshes you want to add a joint between > mid add joint, place the joint in the correct place > select post add $joint_type (fixed, revolute, prismatic)

   b. If you want to add a fixed joint on a single object (meaning it will remain static you can click on pre add joint > select only the desired object > mid add joint > post add fixed joint)

10. Add a site (marker to access it on the reward function) (I would always do this when designing rewards to make sure you know where the objects are exactly because sometimes the meshes can be not centered):

    a. Select object you want to attach a site to > pre add site > position the site in the correct place > scale it to make it small > post add site

11. Recommendations:

    a. add a fixed joint on the main scene so that it doesn't fall with gravity

12. When you are done click on Download and move it to your USDAssets/scenes folder
13. Open it on isaac sim using Open > File and run the physics (play button) to make sure everything is correct
14. Specify the necessary values in the config file and collect demos
