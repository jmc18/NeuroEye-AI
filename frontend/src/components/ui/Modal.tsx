import type { ReactNode } from 'react'

import { usePreline } from '@hooks/usePreline'
import { cn } from '@lib/utils'

type ModalProps = {
  id: string
  title: string
  children: ReactNode
  trigger: ReactNode
  className?: string
  panelClassName?: string
}

export function Modal({
  id,
  title,
  children,
  trigger,
  className,
  panelClassName,
}: ModalProps) {
  usePreline()

  return (
    <>
      <button
        type="button"
        className={cn(className)}
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls={id}
        data-hs-overlay={`#${id}`}
      >
        {trigger}
      </button>

      <div
        id={id}
        className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none"
        role="dialog"
        tabIndex={-1}
        aria-labelledby={`${id}-title`}
      >
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div
            className={cn(
              'flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700',
              panelClassName,
            )}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
              <h3 id={`${id}-title`} className="font-bold text-gray-800 dark:text-white">
                {title}
              </h3>
              <button
                type="button"
                className="size-8 inline-flex justify-center items-center rounded-full text-gray-800 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                aria-label="Close"
                data-hs-overlay={`#${id}`}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}
