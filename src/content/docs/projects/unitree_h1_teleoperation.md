---
title: Unitree H1 Teleoperation
description: This documentation implements teleoperation of the humanoid robot Unitree H1_2 using Apple Vision Pro.
---


## Demo of the Effect
<img src="https://github.com/unitreerobotics/avp_teleoperate/raw/master/img/2.webp" alt="" />

## Environmental Dependencies
This routine is tested under Ubuntu 20.04 and Ubuntu 22.04 operating systems. When building on other versions of the operating system, the conditions and steps required may differ from those described in this document. You can adjust the build process based on your actual usage.

## 双臂 Inverse Kinematics 环境配置
This section is used to configure the software library related to the solution of the terminal pose inverse kinematics of the H1 arms of the humanoid robot (a total of 14 degrees of freedom). After the Apple Vision Pro takes the left and right wrist poses, it uses the Pinocchio and CasADi libraries to load the URDF and perform inverse kinematics calculations to solve for the articular motor angle value that reaches the pose. The Meshcat library is used to visualize the end when debugging.

```bash
conda create -n tv python=3.8
conda activate tv
conda install pinocchio -c conda-forge
pip install meshcat
```

**Note:** It is possible that the installed Pinocchio is not the latest version 3.1.0, and this environment requires a 3.1.0 version, so please check carefully.

Pinocchio must be installed and ensured before TeleVision's environment can be configured. Reversing the installation order may result in errors in the TeleVision environment that will be installed.

All of the following terminal commands should be executed within Conda's TV environment unless otherwise noted.

## unitree_dds_wrapper Configuration
This part is used to configure the `unitree_dds_wrapper` between the computer host and the humanoid robot, and can be used to implement communication and control between the host and the robot. Run the following command to install it:

```bash
# 安装python版本的 unitree_dds_wrapper
git clone https://github.com/unitreerobotics/unitree_dds_wrapper.git
cd unitree_dds_wrapper/python
pip3 install -e .
```

## TeleVision 环境配置和 Apple Vision Pro 通信配置
This routine is modified on the basis of the TeleVision open-source project, and the following configurations can also refer to the project's related pages. Here, the simulation environment is used to test the configuration correctness.

### 1. Basic Environment Configuration
After cloning this project to the local computer, go to the project path and install the basic function library:

```bash
cd ~
git clone https://github.com/unitreerobotics/avp_teleoperate.git
cd avp_teleoperate
pip install -r requirements.txt
```

### 2. Isaac Gym 安装
Download the installation package from the Isaac Gym download page, unzip it, and run the following command in the directory:

```bash
pip install -e .
```

### 3. Configure the Certificate Generation
#### 3.1 Install mkcert

```bash
# Install brew
sudo apt-get install build-essential procps curl file git
cd ~
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# When asked to press Enter, press Enter. Then proceed:
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> $HOME/.bash_profile

# Configure environment variables
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

# Use brew to install mkcert
brew install mkcert
```

#### 3.2 Generate Certificates

Look at the local IP address:

```bash
ifconfig | grep inet
```

Let's assume the native IP address is `192.168.123.2`.

Create a certificate:

```bash
mkcert -install && mkcert -cert-file cert.pem -key-file key.pem 192.168.123.2 localhost 127.0.0.1
```

Copy the generated `cert.pem` and `key.pem` files to the project's directory:

```bash
cp cert.pem key.pem ~/avp_teleoperate/teleop/
```

System firewall settings:

```bash
sudo ufw allow 8012
```

Install the certificate in Apple Vision Pro:

```bash
mkcert -CAROOT
```

The above command can get the path to `rootCA.pem`. Then send the file to the Apple Vision Pro through Apple's AirDrop feature.

**Note:** Apple Vision Pro needs to enable file reception before receiving files by setting up >> Universal >> AirDrop >> Everyone (10 minutes).

### 4. Enable the WebXR Features of Apple Vision Pro
Go to:

- Set >> Apps >> Safari >> Advanced >> feature flags >> enable WebXR features.

### 5. Enter VR

```bash
cd ~/avp_teleoperate/teleop
python teleop_hand.py
```

Open the browser of Apple Vision Pro and type in `https://192.168.123.2:8012?ws=wss://192.168.123.2:8012`, then allow tracking.

## Hardware Adaptation

### Hardware Inventory

| Name                | Quantity | Renders | Description                               |
|---------------------|----------|---------|-------------------------------------------|
| Apple Vision Pro    | 1        |         | Reference: Apple 官方网址                  |
| Computer            | 1        | /       | x86_64 Architecture                       |
| Humanoid robot H1   | 1        | /       | 具体型号为 H1_2                           |
| Dexterous hands     | 1        |         | You can refer to this document            |
| Binocular camera    | 1        |         | Regular USB driverless binocular camera   |

### Equipment Placement Requirements
If you use real telemanipulation mode, make sure that the humanoid robot Unitree H1_2 does not collide with people or other objects within the range of hardware to avoid accidents.

- The humanoid robot Unitree H1_2 can be hoisted or seated upright (as shown in the Effects Demonstration section of this document) to avoid obvious collisions within the range of both arms.
- Operators should wear the Apple Vision Pro device correctly and follow the software configuration described above.
- The main role of the binocular camera is to assist the operator, and the Apple Vision Pro can see the view of the workspace from the robot's point of view. For best results, adjust the mounting position and orientation of the camera appropriately depending on the camera model you are using and the desired workspace field of view.

## Start the Program
Before performing the teleoperation program, it is necessary to start some service-backed programs in advance.

### Turn on the Dexterous Hand Service
You can refer to Dexterous Hand Development to configure the relevant environment and compile the control program. First, download the Dexterous Hand Control Interface from this website and copy it to the PC2 of the robot Unitree H1_2. After the decompression in PC2 is complete, use the following command to compile:

```bash
sudo apt install libboost-all-dev libspdlog-dev
# Build project
cd h1_inspire_service && mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make
```

```bash
# Terminal 1. Run h1 inspire hand service
sudo ./inspire_hand -s /dev/ttyUSB0
# Terminal 2. Run example
./h1_hand_example
```

If you find that all the fingers of the left and right dexterous hands are constantly opening and closing in a loop, it means that it is successful. Once you have confirmed that it is successful, you can close the program in Terminal 2:

```bash
./h1_hand_example
```

### Enable the Image Ingest Service
Copy the directory to PC2 of the robot Unitree H1_2 and run the following command in PC2:

```bash
sudo python3 image_server.py
```

**Note:** Here you need to check whether the parameters when OpenCV reads the image match the binocular camera hardware, and whether the default port 5555 used for ingest is available.

After the image ingest service is enabled, you can use it on the host terminal to test whether the communication is successful (remember to close the program after the test is successful):

```bash
python image_client.py
```

### Start the Teleoperation Program
**Note 1:** All personnel must keep a sufficient safety distance from the humanoid robot to avoid danger and accidents!

**Note 2:** When using the program and starting it, you must ensure that the input parameters and operating procedures are correct, and that you have a full expectation of the results of the various actions that the program may perform!

```bash
python teleop_hand_and_arm.py
```

```bash
# 程序启动后，如果配置正确，终端最终输出 `Please enter the start signal (enter 's' to start the subsequent program):` 信息。
# 此时，佩戴 Apple Vision Pro 的操作人员应将手臂形状摆放为与 Unitree H1_2 初始姿态相接近的姿势，避免初始位姿差距过大导致机器人产生过大的摆动。
# 当操作人员姿势摆放好后，主机操作人员可按下 `s` 字母和回车键，正式启动遥操作程序。这时，机器人双臂便可跟随佩戴 Apple Vision Pro 的操作人员双臂移动。
```

## Code Directory
The overall structure of the code is the same as TeleVision, and only the file directories related to Unitree Robot are focused here:

```
avp_teleoperate/
│
├── act                       存放模仿学习策略相关文件
│
├── assets                    存放机器人 URDF 相关文件 
│  
├── scripts                   存放一些工具类文件
│
├── teleop                    存放遥操作主要文件
│   │
│   ├── image_server/         图像推流服务端与客户端相关代码
│   │     |
│   │     ├── image_client.py 客户端（仅用于测试 Unitree H1_2 上的图像推流服务是否正常）
│   │     |
│   │     ├── image_server.py 服务端（捕获相机的图像并通过网络对外发送，该代码在 Unitree H1_2 上运行）
│   │         
│   ├── robot_control/             存放IK解算、手臂控制相关文件
│   │      |
│   │      ├── robot_arm_ik.py     双臂IK解算代码
│   │      |
│   │      ├── robot_arm.py        双臂控制代码
│   │      |
│   │      ├── robot_hand.py       机械手控制代码
│   │
│   │──teleop_hand_and_arm.py   遥操作的启动程序代码
│   │
│   │──teleop_hand.py           可用于测试环境配置
```
## Precautions
1. Be sure to install hardware devices and connect cables in accordance with the requirements of this document;

2. In the process of remote operation, please be sure to avoid the collision caused by the overlapping activity trajectory of the robot's arms during remote operation! Ensure that the robot hardware does not collide with people or other objects within the range of activity to avoid accidents;

3. When using routines, it is necessary to ensure that the input parameters and operation flow are correct;

4. The robot will generate heat during operation, please do not touch the motor joints when running or just stopping;

5. After the routine is finished, be sure to turn off the routine and turn off the power;


## Source 
Official Documentation provided by Unitree Robotics