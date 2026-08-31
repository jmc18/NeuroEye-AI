import type { ReactNode } from 'react'

import { cn } from '@lib/utils'

export type DataTableColumn<T> = {
  id: string
  header: string
  cell: (row: T) => ReactNode
  mono?: boolean
  className?: string
}

type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowId: (row: T) => string
  onRowClick?: (row: T) => void
  empty?: ReactNode
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  onRowClick,
  empty,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-outline-variant/40', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-surface-container-low">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    'px-4 py-3 text-label-caps uppercase tracking-widest text-on-surface-variant',
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-on-surface-variant"
                >
                  {empty}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={getRowId(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'border-t border-outline-variant/30 bg-surface-container-lowest',
                    onRowClick && 'cursor-pointer hover:bg-surface-container-high/40',
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        'px-4 py-3 text-on-surface',
                        column.mono && 'font-data-mono text-data-mono',
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
