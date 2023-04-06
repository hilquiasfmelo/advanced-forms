import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { supabase } from './lib/supabase'

const createUserFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .transform((list) => list.item(0)!)
    .refine(
      (file) => file!.size <= 5 * 1024 * 1024,
      'O arquivo precisa ter no máximo 5MB.',
    ),
  name: z
    .string()
    .nonempty('O nome é obrigatório.')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('O e-mail é obrigatório.')
    .email('Formato de e-mail inválido.')
    .toLowerCase()
    .refine((email) => {
      return email.endsWith('hotmail.com')
    }, 'O e-mail precisa ser da Microsoft'),
  password: z.string().min(6, 'Senha deve conter no mínimo 6 caracteres.'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('O título é obrigatório.'),
        knowledge: z.coerce.number().min(1).max(10),
      }),
    )
    .min(2, 'Insira pelo menos 2 tecnologias.'),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
    reValidateMode: 'onSubmit',
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'techs',
  })

  async function handleCreateUser(data: CreateUserFormData) {
    await supabase.storage
      .from('advanced-form/avatar')
      .upload(data.avatar.name, data.avatar)
  }

  function handleAddNewTech() {
    append({ title: '', knowledge: 0 })
  }

  return (
    <main className="h-screen bg-zinc-50 flex items-center justify-center">
      <form
        className="flex flex-col gap-4 w-full max-w-xs"
        onSubmit={handleSubmit(handleCreateUser)}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="avatar">Avatar</label>
          <input type="file" accept="image/*" {...register('avatar')} />
          {errors.avatar && (
            <span className="text-red-500 text-sm">
              {errors.avatar.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="techs" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              onClick={handleAddNewTech}
              className="text-emerald-500 text-sm hover:text-emerald-600"
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div className="flex gap-2" key={field.id}>
                <div className="flex-1 flex flex-col gap-1">
                  <input
                    type="text"
                    className=" border border-zinc-200 shadow-sm rounded h-10 px-3"
                    {...register(`techs.${index}.title`)}
                  />

                  {errors.techs?.[index]?.title && (
                    <span className="text-red-500 text-sm">
                      {errors.techs[index]?.title?.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    className="w-16 border border-zinc-200 shadow-sm rounded h-10 px-3"
                    {...register(`techs.${index}.knowledge`)}
                  />

                  {errors.techs?.[index]?.knowledge && (
                    <span className="text-red-500 text-sm">
                      {errors.techs[index]?.knowledge?.message}
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {errors.techs && (
            <span className="text-red-500 text-sm">{errors.techs.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600 my-3"
        >
          Salvar
        </button>
      </form>
    </main>
  )
}

// Parei em 52:42 min
