export function SearchInput({
	searchParams: { termId, campusCode, q },
}: {
	searchParams: {
		q: string | undefined
		campusCode: string
		termId: string
	}
}) {
	return (
		<div className=" selection:bg-red-500 selection:text-white">
			<input type="hidden" name="termId" value={termId} />
			<input type="hidden" name="campusCode" value={campusCode} />
			<label htmlFor="search-course" className="sr-only">
				Search a course
			</label>
			<input
				type="search"
				name="q"
				autoComplete="off"
				id="search-course"
				className="block w-full rounded-full border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
				defaultValue={q}
				placeholder="MKT 335, MKT 335C"
			/>
			<p className="py-1.5 text-xs text-gray-500">
				Comma separated search
			</p>
		</div>
	)
}
