import { Dialog, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useSearchParams } from '@remix-run/react'
import { useState, Fragment } from 'react'
import { selectableFields } from '~/utils/fields'

export function FieldFilters() {
	const [searchParams, setSearchParams] = useSearchParams()
	const paramFields = searchParams.getAll('fields')
	const [isOpen, setIsOpen] = useState(false)
	const [selectedFields, setSelectedFields] = useState<string[]>(paramFields)

	function closeModal() {
		setIsOpen(false)
	}

	function openModal() {
		setIsOpen(true)
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const key = e.target.value
		if (e.target.checked) {
			setSelectedFields([...selectedFields, key])
			searchParams.append('fields', key)
			setSearchParams(searchParams)
		} else {
			const newSelectedFields = selectedFields.filter(
				(field) => field !== key
			)
			setSelectedFields(newSelectedFields)

			searchParams.delete('fields')
			newSelectedFields.forEach((id) => {
				searchParams.append('fields', id)
			})
			setSearchParams(searchParams)
		}
	}

	// function handleChange({ nodes }: { nodes: CheckboxNode[] }) {
	// 	const selectedIds = nodes
	// 		.filter((node) => node.isChecked)
	// 		.map((node) => node.value)
	// 	setSelectedFields(selectedIds)
	// searchParams.delete('fields')
	// selectedIds.forEach((id) => {
	// 	searchParams.append('fields', id)
	// })

	// setSearchParams(searchParams)
	// 	// router.replace()
	// }

	return (
		<Fragment>
			<div className="relative inline-block text-left">
				<button
					onClick={openModal}
					className="inline-flex min-h-[40px] w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100"
					//   className="inline-flex min-h-[40px] w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100"
				>
					Select fields
					<ChevronDownIcon
						className="-mr-1 ml-2 h-5 w-5"
						aria-hidden="true"
					/>
				</button>
			</div>
			<Transition.Root show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={setIsOpen}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Select fields
									</Dialog.Title>

									<Checkboxes
										onChange={handleChange}
										caption={'Select Fields'}
										options={selectableFields.map(
											(field) => ({
												label: field.title,
												value: field.key,
												checked:
													selectedFields.includes(
														field.key
													),
											})
										)}
									/>
									{/* <CheckboxSelect
										label={'Fields'}
										options={options}
										handleChange={handleChange}
									/> */}

									<div className="mt-5 sm:mt-6">
										<button
											type="button"
											className="inline-flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white shadow-sm hover:border-black hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 sm:text-sm"
											onClick={closeModal}
										>
											Close
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</Fragment>
	)
}

function Checkboxes({
	caption,
	options,
	onChange,
}: {
	caption: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	options: { label: string; name?: string; value: string; checked: boolean }[]
}) {
	return (
		<fieldset className="space-y-5">
			<legend className="sr-only">{caption}</legend>
			{options.map((option) => {
				return (
					<div
						key={option.value}
						className="relative flex items-start"
					>
						<div className="flex h-5 items-center">
							<input
								id={option.label}
								aria-describedby={option.label}
								name={option.name ?? option.label}
								type="checkbox"
								onChange={onChange}
								className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
								checked={option.checked}
								value={option.value}
							/>
						</div>
						<div className="ml-3 text-sm">
							<label
								htmlFor={option.label}
								className="font-medium text-gray-700"
							>
								{option.label}
							</label>
							{/* <span id="comments-description" className="text-gray-500">
                <span className="sr-only">New comments </span>so you always know what's happening.
              </span> */}
						</div>
					</div>
				)
			})}
		</fieldset>
	)
}
