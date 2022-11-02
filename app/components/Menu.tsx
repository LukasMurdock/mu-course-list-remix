import { Fragment } from 'react'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { clsx } from 'clsx'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { NavLink } from '@remix-run/react'

type Navigation = {
	href: string
	label: string
	current?: boolean
}

export function Menu(props: { title: string; options: Navigation[] }) {
	return (
		<HeadlessMenu as="div" className="relative inline-block text-left">
			<div>
				<HeadlessMenu.Button className="inline-flex min-h-[40px] w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100">
					{props.title}
					<ChevronDownIcon
						className="-mr-1 ml-2 h-5 w-5"
						aria-hidden="true"
					/>
				</HeadlessMenu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<HeadlessMenu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div>
						{props.options.map((option) => {
							return (
								<HeadlessMenu.Item key={option.href}>
									{({ active }) => (
										<NavLink
											to={option.href}
											className={clsx(
												active
													? 'bg-red-600 text-white'
													: option.current
													? 'bg-red-100'
													: 'text-gray-700',
												'block rounded-md px-4 py-2 text-sm'
											)}
										>
											{option.label}
										</NavLink>
									)}
								</HeadlessMenu.Item>
							)
						})}
					</div>
				</HeadlessMenu.Items>
			</Transition>
		</HeadlessMenu>
	)
}
