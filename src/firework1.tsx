export const Firework = (num: number, str: string): JSX.Element => {
  const updatedNum = num + 1
  return (
    <div>
      <h1>{`${str}${updatedNum}`}</h1>
      <h1>{`${str}${updatedNum}`}</h1>
      <h1>{`${str}${updatedNum}`}</h1>
    </div>
  ) // 返回 JSX 组件
}
