import { Environment } from 'vitest'

export default <Environment>{
  transformMode: 'ssr',
  name: 'prisma',
  async setup() {
    console.log('Executed')

    return {
      teardown() {
        console.log('finished')
      },
    }
  },
}
