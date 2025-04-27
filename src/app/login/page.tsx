'use client'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useActionState } from 'react'
import { z } from 'zod'
import { login } from './action'

const schema = z.object({
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
  password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
})

export default function LoginPage() {
  const [lastResult, action] = useActionState(login, {
    initialValue: {
      email: '',
      password: '',
    } satisfies z.infer<typeof schema>,
  })
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  return (
    <div className="max-w-[400px] mx-auto">
      <div className="text-center font-bold text-xl mb-10">ログイン</div>
      <form id={form.id} onSubmit={form.onSubmit} action={action}>
        {/* メールアドレス */}
        <div className="mb-3">
          <input
            type="email"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="メールアドレス"
            id="email"
            name='email'
            defaultValue={fields.email.value}
          />
          <p style={{ color: "red" }}>{fields.email.errors}</p>
        </div>

        {/* パスワード */}
        <div className="mb-5">
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="パスワード"
            id="password"
            name='password'
            defaultValue={fields.password.value}
          />
          <p style={{ color: "red" }}>{fields.password.errors}</p>
        </div>

        {/* ログインボタン */}
        <div className="mb-5">
          <button
            type="submit"
            className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm cursor-pointer"
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  )
}
