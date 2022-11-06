import { CampusMap, TermMap } from '~/lib/ws.miamioh.edu/api'
import { Menu } from '../Menu'

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

function readableTermId(string: string) {
	const endYear = Number(string.substring(0, 4)) // 2023
	const seasonCode = Number(string.substring(4, 6)) // 10
	const startYear = endYear - 1 // 2022

	const readableSeason = Object.entries(TermMap).find(
		(term) => term[1] === seasonCode
	)?.[0]

	if (!readableSeason) throw new Error('Could not parse Term ID')

	return {
		seasonString: readableSeason,
		endYear: endYear,
		full: `${capitalizeFirstLetter(readableSeason)} ${startYear}-${
			endYear % 100
		}`,
	}
}

export function SearchSettings({
	terms,
	searchParams,
}: {
	searchParams: {
		termId: string
		campusCode: string
		query: string
	}
	terms: {
		termId: string
		name: string
		current: boolean
	}[]
}) {
	const readableQueriedTerm = readableTermId(searchParams.termId)

	return (
		<div className="flex space-x-2">
			<Menu
				title={readableQueriedTerm.full}
				options={terms.map((term) => ({
					href: `/?${new URLSearchParams({
						...searchParams,
						termId: term.termId,
					})}`,
					label: term.current ? `${term.name} (current)` : term.name,
					current: term.termId === searchParams.termId,
				}))}
			/>
			<Menu
				title={
					Object.entries(CampusMap).find(
						(campus) => campus[1] === searchParams.campusCode
					)?.[0] ?? 'Oxford'
				}
				options={Object.entries(CampusMap).map((campus) => ({
					href: `/?${new URLSearchParams({
						...searchParams,
						campusCode: campus[1],
					})}`,
					label: campus[0],
					current: campus[1] === searchParams.campusCode,
				}))}
			/>
		</div>
	)
}
