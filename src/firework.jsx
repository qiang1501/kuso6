import React from "react";

export default class Firework {
  constructor(coordinates, color) {
    this.coordinates = coordinates;
    this.color = color;
    this.particles = [];
    this.gravity = 2;
    this.airResistance = 1;

    this.generateParticles();
  }

  // 生成粒子数据
  generateParticles() {
    const particleCount = Math.floor(Math.random() * 500 + 50);
    const liveTime = Math.floor(Math.random() * 10 + 30);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * 360;
      const radius = Math.random() * 10;
      const radians = (angle * Math.PI) / 180;

      const x = radius * Math.cos(radians);
      const y = radius * Math.sin(radians);

      this.particles.push({
        xNow: this.coordinates.x,
        yNow: this.coordinates.y,
        xFps: x,
        yFps: y,
        colorNow: `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`,
        liveTime,
      });
    }
  }

  // 更新粒子状态
  updateParticles() {
    this.particles = this.particles
      .map((particle) => {
        if (particle.liveTime > 0) {
          const updatedXFps = particle.xFps * (1 - this.airResistance / 100);
          const updatedYFps =
            particle.yFps * (1 - this.airResistance / 100) + this.gravity * 0.1;

          return {
            ...particle,
            liveTime: particle.liveTime - 1,
            xNow: particle.xNow + updatedXFps,
            yNow: particle.yNow + updatedYFps,
            xFps: updatedXFps,
            yFps: updatedYFps,
          };
        }
        return null;
      })
      .filter((particle) => particle !== null);
  }

  // 渲染粒子的 JSX
  render() {
    return this.particles.map((particle, index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          left: `${particle.xNow}px`,
          top: `${particle.yNow}px`,
          width: "6px",
          height: "6px",
          backgroundColor: particle.colorNow,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
    ));
  }
}
