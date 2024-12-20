import React, { useState, useEffect } from "react"; // 导入 React 以及 Hook（useState、useEffect）
import backgroundImg from "./img/beijing3.jpg";


const App = () => {
  // 定义状态，用于保存鼠标的当前坐标
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  // 定义状态，用于存储粒子信息
  const [FFget, FFset] = useState([]);
  const [FFtailget, FFtailset] = useState([]);

  // 定义状态，用于保存当前随机生成的颜色（RGB 格式）
  const [MouseColorGet, MouseColorSet] = useState({ r: 0, g: 0, b: 0 });

  // 重力和空气阻力参数
  const gravity = 1.8; // 重力大小，控制垂直加速度
  const airResistance = 1; // 空气阻力大小，控制水平速度减缓

  // 随机生成 RGB 颜色的函数
  const generateRandomColor = () => {
    const randomColor = {
      r: Math.floor(Math.random() * 256), // 随机生成 0-255 的红色值
      g: Math.floor(Math.random() * 256), // 随机生成 0-255 的绿色值
      b: Math.floor(Math.random() * 256), // 随机生成 0-255 的蓝色值
    };
    MouseColorSet(randomColor); // 更新颜色状态
  };

  // 窗口大小
  // useEffect(() => {
  //   console.log("窗口宽度:", window.innerWidth);
  //   console.log("窗口高度:", window.innerHeight);
  // }, []);


  // 鼠标点击时触发的事件处理函数
  const MouseClick = () => {
    FFlogic(); // 调用烟花逻辑
  };

  // 烟花逻辑（生成粒子）
  function FFlogic() {
    const particle = Math.floor(Math.random() * (100 - 50 + 1) + 50); // 粒子的数量（50~250）
    const newParticles = [];
    const liveTime = Math.floor(Math.random() * (50 - 15 + 1) + 15); // 粒子的存活时间（30~40帧）

    for (let i = 1; i <= particle; i++) {
      const angle = Math.random() * 360; // 随机角度
      const radius = Math.random() * 8; // 爆炸初始速度
      const radians = (angle * Math.PI) / 180;

      const x = radius * Math.cos(radians); // 初始水平速度
      const y = radius * Math.sin(radians); // 初始垂直速度

      const FFone = {
        xNow: coordinates.x, // 当前 X 坐标
        yNow: coordinates.y, // 当前 Y 坐标
        xFps: x, // 水平速度
        yFps: y, // 垂直速度
        colorNow: `rgb(${MouseColorGet.r}, ${MouseColorGet.g}, ${MouseColorGet.b})`, // 动态设置背景颜色
        liveTime: liveTime, // 存活时间
        tailNum: 3, // 设定这个是尾巴的数量
      };
      newParticles.push(FFone);
    }

    // 更新状态
    FFset((prev) => [...prev, ...newParticles]);
  }

  // 消亡逻辑
  function FFlostLogic() {
    const updatedParticles = FFget
      .map((particle) => {
        if (particle.liveTime > 0 && particle.yNow < 864) {
          // 更新粒子位置和速度
          const updatedXFps = particle.xFps * (1 - airResistance / 100); // 水平速度逐渐减小
          const updatedYFps = particle.yFps * (1 - airResistance / 100) + gravity * 0.1; // 垂直速度逐渐增加（重力作用）

          return {
            ...particle,
            liveTime: particle.liveTime - 1, // 减少存活时间
            xNow: particle.xNow + updatedXFps, // 更新 X 坐标
            yNow: particle.yNow + updatedYFps, // 更新 Y 坐标
            xFps: updatedXFps, // 更新水平速度
            yFps: updatedYFps, // 更新垂直速度
            tailNum: Math.floor(Math.random() * 3) + 1, // 随机生成 1 到 5 的整数
          };
        }
        return null; // 删除存活时间为 0 的粒子
      })
      .filter((particle) => particle !== null); // 过滤掉存活时间为 0 的粒子

    // 更新状态
    FFset(updatedParticles);
    // 设置一下尾巴
    FFtailset((prevTailget) => [...prevTailget, ...FFget]);
  }

  function FFTailLostLogic() {
    // 使用回调函数确保状态基于最新值更新
    FFtailset((prevTailParticles) => {
      // 更新尾巴逻辑：减少 tailNum，如果为 0 就过滤掉
      const updatedTail = prevTailParticles
        .map((particle) => {
          if (particle.tailNum > 0) {
            // console.log("particle.tailNum:", particle.tailNum);
            return {
              ...particle,
              tailNum: particle.tailNum - 1, // 减少 tailNum
            };
          }
          return null; // 如果 tailNum 为 0，标记为无效
        })
        .filter((particle) => particle !== null); // 过滤掉无效的粒子

      return updatedTail; // 返回新状态
    });
  }


  // 定时触发消亡逻辑
  useEffect(() => {
    const interval = setInterval(() => {
      FFlostLogic();
      FFTailLostLogic()
    }, 15); // 每 33 毫秒执行一次（30fps）

    return () => clearInterval(interval); // 清理定时器，防止内存泄漏
  }, [FFget]);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 渲染组件的 UI
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div>

      {/* 鼠标点击触发烟花效果 */}
      <div
        onClick={MouseClick}
        style={{
          position: "absolute",
          left: `${coordinates.x - 5}px`,
          top: `${coordinates.y - 5}px`,
          width: "10px",
          height: "10px",
          backgroundColor: `rgb(${MouseColorGet.r}, ${MouseColorGet.g}, ${MouseColorGet.b})`,
          cursor: "pointer",
        }}
      ></div>

      {/* 粒子渲染 */}
      <div>
        {FFget.map((particle, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${particle.xNow}px`,
              top: `${particle.yNow}px`,
              width: "6px",
              height: "6px",
              backgroundColor: particle.colorNow,
              pointerEvents: "none", // 禁止鼠标事件，使其不可点击
            }}
          ></div>
        ))}
      </div>
      {/* 渲染尾巴 */}
      <div>
        {FFtailget.map((particle, index) => (
          <div
            key={`tail-${index}`}
            style={{
              position: "absolute",
              left: `${particle.xNow}px`,
              top: `${particle.yNow}px`,
              width: "4px",
              height: "4px",
              backgroundColor: "white",
              opacity: 0.5,
              pointerEvents: "none",
            }}
          ></div>
        ))}
      </div>

      {/* 光线渲染 */}
      <div>
        {FFget.map((particle, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${particle.xNow - 30}px`,
              top: `${particle.yNow - 30}px`,
              width: "60px",
              height: "60px",
              backgroundColor: "rgb(255, 239, 160)",
              // borderRadius: "50%", // 变成圆形
              pointerEvents: "none", // 禁止鼠标事件，使其不可点击
              opacity: 0.01, // 透明
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default App; // 导出组件，供其他文件导入
