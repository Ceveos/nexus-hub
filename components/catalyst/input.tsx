import { Input as HeadlessInput, type InputProps as HeadlessInputProps } from '@headlessui/react'
import { clsx } from 'clsx'
import { forwardRef } from 'react'

const dateTypes = ['date', 'datetime-local', 'month', 'time', 'week']
type DateType = (typeof dateTypes)[number]

export const Input = forwardRef<
  HTMLInputElement,
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  { postfix?: string | JSX.Element, type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | DateType } & HeadlessInputProps & { ref?: React.Ref<HTMLInputElement> }
>(function Input({ className, prefix, postfix, ...props }, ref) {
  return (
    <span
      data-slot="control"
      className={clsx([
        className,

        // Basic layout
        'relative block w-full',

        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        'before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:shadow',

        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        'dark:before:hidden',

        // Focus ring
        'after:pointer-events-none after:absolute after:rounded-lg after:inset-0 after:ring-transparent after:focus-within:ring-2 after:focus-within:ring-blue-500 ',

        // Border
        'border rounded-lg border-zinc-950/10 has-[[data-hover]]:border-zinc-950/20 dark:border-white/10 dark:has-[[data-hover]]:border-white/20',

        // Disabled state
        'has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none',

        // Invalid state
        'before:has-[[data-invalid]]:shadow-red-500/10 has-[[data-invalid]]:border-red-500 has-[[data-invalid]]:focus-within:ring-1 has-[[data-invalid]]:after:focus-within:ring-red-500 has-[[data-invalid]]:has-[[data-hover]]:border-red-500 has-[[data-invalid]]:dark:border-red-500 has-[[data-invalid]]:has-[[data-hover]]:dark:border-red-500',

        // Pre/Post-fix present
        (prefix || postfix) && 'flex'
      ])}
    >
      {prefix && (<span className={clsx(
        // Basic layout
        'pl-2 rounded-l-lg flex select-none items-center sm:text-sm',

        // Background colors
        'bg-white dark:dark:bg-white/5',

        // Foreground colors
        'text-gray-400 dark:text-primary-dark-400',
      )
      }>
        {prefix}
      </span>)}
      <HeadlessInput
        ref={ref}
        className={clsx([
          // Date classes
          props.type &&
          dateTypes.includes(props.type) && [
            '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
            '[&::-webkit-date-and-time-value]:min-h-[1.5em]',
            '[&::-webkit-datetime-edit]:inline-flex',
            '[&::-webkit-datetime-edit]:p-0',
            '[&::-webkit-datetime-edit-year-field]:p-0',
            '[&::-webkit-datetime-edit-month-field]:p-0',
            '[&::-webkit-datetime-edit-day-field]:p-0',
            '[&::-webkit-datetime-edit-hour-field]:p-0',
            '[&::-webkit-datetime-edit-minute-field]:p-0',
            '[&::-webkit-datetime-edit-second-field]:p-0',
            '[&::-webkit-datetime-edit-millisecond-field]:p-0',
            '[&::-webkit-datetime-edit-meridiem-field]:p-0',
          ],

          // Basic layout
          'break-all text-ellipsis relative block w-full appearance-none rounded-lg py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]',

          // Basic layout when not using prefix
          !prefix && 'pl-[calc(theme(spacing[3.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)]',

          prefix && 'pl-1 ',


          // Typography
          'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',

          // Border
          'border-0 focus:ring-0',

          // Background color
          'bg-transparent dark:bg-white/5',

          // Hide default focus styles
          'focus:outline-none',

          // Disabled state
          'data-[disabled]:border-zinc-950/20 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]',

          // // Postfix present
          (prefix && postfix) && 'rounded-none',
          (prefix && !postfix) && 'rounded-none rounded-r-lg sm:pr-[calc(theme(spacing[3])-1px)]',
          (!prefix && postfix) && 'rounded-none rounded-l-lg sm:pl-[calc(theme(spacing[3])-1px)]',
        ])}
        prefix={prefix}
        {...props}
      />
      {postfix && (<span className={clsx(
        // Basic layout
        'pl-2 pr-2 rounded-r-lg flex select-none items-center sm:text-sm',

        // Background colors
        'bg-white dark:bg-white/5',

        // Foreground colors
        'text-gray-400 dark:text-primary-dark-400',
      )
      }>
        {postfix}
      </span>)}
    </span>
  )
})
