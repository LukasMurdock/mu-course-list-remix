import { useSearchParams } from '@remix-run/react'

export function SearchInput({
	searchParams: { termId, campusCode, q },
}: {
	searchParams: {
		q: string | undefined
		campusCode: string
		termId: string
	}
}) {
	const [params] = useSearchParams()

	return (
		<div className=" selection:bg-red-500 selection:text-white">
			{Array.from(params.entries())
				// Filter out q param
				.filter((param) => param[0] !== 'q')
				.map((param) => {
					return (
						<input type="hidden" name={param[0]} value={param[1]} />
					)
				})}
			{/* <input type="hidden" name="termId" value={termId} /> */}
			{/* <input type="hidden" name="campusCode" value={campusCode} /> */}
			<label htmlFor="search-course" className="sr-only">
				Search a course
			</label>
			<input
				type="search"
				name="q"
				autoComplete="off"
				id="search-course"
				className="block w-full uppercase caret-red-500 rounded-full border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
				defaultValue={q}
				placeholder="MKT 335, MKT 335 C"
				enterKeyHint="search"
			/>
			<p className="py-1.5 text-xs text-gray-500">
				Comma separated search
			</p>
		</div>
	)
}
