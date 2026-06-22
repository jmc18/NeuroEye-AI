import type { StateCreator, StoreMutatorIdentifier } from 'zustand'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

type PersistedStore = [
  ['zustand/persist', unknown],
  ['zustand/devtools', never],
]

type CreatePersistedStoreOptions<T> = {
  name: string
  version?: number
  partialize?: (state: T) => Partial<T>
  onRehydrateStorage?: (state: T | undefined) => void
}

export function createPersistedStore<T extends object>(
  options: CreatePersistedStoreOptions<T>,
  initializer: StateCreator<T, [], PersistedStore>,
) {
  const { name, version = 1, partialize, onRehydrateStorage } = options

  return create<T>()(
    devtools(
      persist(initializer, {
        name: `neuroeye-${name}`,
        version,
        storage: createJSONStorage(() => localStorage),
        partialize,
        onRehydrateStorage: () => onRehydrateStorage,
      }),
      { name: `neuroeye/${name}`, enabled: import.meta.env.DEV },
    ),
  )
}

export async function waitForStoreHydration(
  stores: Array<{ persist: { hasHydrated: () => boolean; onFinishHydration: (fn: () => void) => () => void; rehydrate: () => void } }>,
): Promise<void> {
  await Promise.all(
    stores.map(
      (store) =>
        new Promise<void>((resolve) => {
          if (store.persist.hasHydrated()) {
            resolve()
            return
          }

          const unsubscribe = store.persist.onFinishHydration(() => {
            unsubscribe()
            resolve()
          })

          store.persist.rehydrate()
        }),
    ),
  )
}

export type { StateCreator, StoreMutatorIdentifier }
