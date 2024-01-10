import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx';

export interface StatItem {
  id: string;
  name: string;
  stat: string;
  icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;
  change?: string;
  changeType?: string;
}

export function StatSet({ children }: { children: React.ReactNode; }) {
  return (
    <div>
      <dl className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5">
        {children}
      </dl>
    </div>
  )
}

export function Stat(item: StatItem) {
  return (
    <div
    key={item.id}
    className={cn(
      "relative overflow-hidden rounded-lg px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 max-w-52",
      
      "bg-white dark:bg-primary-dark-900",
      
      "border border-primary-200 dark:border-primary-dark-700"
      )}
  >
    <dt>
      <div className="absolute rounded-md bg-accent-500 dark:bg-accent-dark-800 p-3">
        {item.icon && <item.icon className="h-6 w-6 text-white" aria-hidden="true" />}
      </div>
      <p className="ml-16 truncate text-sm font-medium text-primary-500 dark:text-primary-dark-200">{item.name}</p>
    </dt>
    <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.stat}</p>
      <p
        className={clsx(
          item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
          'ml-2 flex items-baseline text-sm font-semibold'
        )}
      >
        {item.changeType === 'increase' ? (
          <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
        ) : (
          <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
        )}

        <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
        {item.change}
      </p>
      <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            View all<span className="sr-only"> {item.name} stats</span>
          </a>
        </div>
      </div>
    </dd>
  </div>
  )
}
