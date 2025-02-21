import consola from 'consola'

export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Run database seed task'
  },
  async run() {
    consola.log('Running DB seed task...')
    const users = [
      {
        name: 'Demhat',
        email: 'demhat@shaoula.com',
        emailVerified: true,
        role: 'superadmin',
      },
      {
        name: 'Nebi Özel',
        email: 'nebi@shaoula.com',
        emailVerified: true,
        role: 'admin',
      },
      {
        name: 'Süleyman Taş',
        email: 'suleyman@shaoula.com',
        emailVerified: true,
        role: 'admin',
      },
    ]
    await useDrizzle().insert(tables.users).values(users)
    return { result: 'success' }
  }
})
