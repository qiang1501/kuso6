import { useState } from 'react'
import './Form.css'

export default function Form() {
  const [name, setName] = useState('')
  const [age, setAge] = useState(0)
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      onSubmit={(event) => {
        if (name === '') {
          setError('名前を入力してください')
          // デフォルトの動作をキャンセルする
          // （フォームの送信をしない）
          event.preventDefault()
          return
        }

        if (age < 0 || age > 100) {
          setError('年齢は0〜100の間で入力してください')
          event.preventDefault()
          return
        }

        alert('フォームを送信します!')
      }}
    >
      <div>
        お名前:
        <input
          type='text'
          value={name}
          onChange={(event) => {
            setName(event.target.value)

            if (event.target.value === '') {
              setError('名前を入力してください')
              return
            }

            setError(null)
          }}
        />
      </div>
      <div>
        {/* TODO: 0〜100じゃない数字が入力されたらエラーを出す */}
        年齢（0〜100歳まで）：
        <input
          type='number'
          value={age}
          onChange={(event) => {
            const inputValue = Number.parseInt(event.target.value)
            setAge(inputValue)

            if (inputValue < 0 || inputValue > 100) {
              setError('年齢は0〜100の間で入力してください')
              return
            }

            setError(null)
          }}
        />
      </div>
      {/* && の左側がTrueの場合右側を返す */}
      {error && <div className='error'>{error}</div>}
      <div>
        <input type='submit' />
      </div>
    </form>
  )
}
