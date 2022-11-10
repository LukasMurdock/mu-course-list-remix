import { useSearchParams } from '@remix-run/react'
import { CampusMap, TermMap } from '~/lib/ws.miamioh.edu/api'
import { Menu } from '../Menu'
import { FieldFilters } from './FieldFilters'

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

function readableTermId(string: string) {
	const endYear = Number(string.substring(0, 4)) // 2023
	const seasonCode = Number(string.substring(4, 6)) // 10
	const startYear = endYear - 1 // 2022

	const seasonCodeIndex = Object.values(TermMap).findIndex(
		(codeMap) => codeMap === seasonCode
	)

	console.log({ seasonCodeIndex })
	console.log(Object.values(TermMap)[seasonCodeIndex])

	const readableSeason = Object.entries(TermMap).find(
		(term) => term[1] === seasonCode
	)?.[0]

	if (!readableSeason)
		throw new Error(`Could not parse Term season from: ${string}`)

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
	const [params] = useSearchParams()
	console.log('termId string', searchParams.termId)
	// const readableQueriedTerm = readableTermId(searchParams.termId)

	return (
		<div className="flex sm:space-x-2 flex-col space-y-2 sm:space-y-0 sm:flex-row">
			<Menu
				title={'Select Term'}
				// title={readableQueriedTerm.full}
				options={terms.map((term) => {
					const newParams = params
					newParams.set('termId', term.termId)
					return {
						href: `/?${newParams}`,
						label: term.current
							? `${term.name} (current)`
							: term.name,
						current: term.termId === searchParams.termId,
					}
				})}
			/>
			<Menu
				title={
					Object.entries(CampusMap).find(
						(campus) => campus[1] === searchParams.campusCode
					)?.[0] ?? 'Oxford'
				}
				options={Object.entries(CampusMap).map((campus) => {
					const newParams = params
					newParams.set('campusCode', campus[1])
					return {
						href: `/?${newParams}`,
						label: campus[0],
						current: campus[1] === searchParams.campusCode,
					}
				})}
			/>
			<FieldFilters />
		</div>
	)
}
