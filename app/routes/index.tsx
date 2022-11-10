import { json, LoaderFunction, redirect } from '@remix-run/node'
import {
	Form,
	ShouldReloadFunction,
	useLoaderData,
	useSearchParams,
	useTransition,
} from '@remix-run/react'
import { SearchInput } from '~/components/search/SearchInput'
import { SearchResults } from '~/components/search/SearchResults'
import { SearchSettings } from '~/components/search/SearchSettings'
import { Skeleton } from '~/components/Skeleton'
import { searchMiamiCourses } from '~/lib/ws.miamioh.edu/api'
import { CourseSections } from '~/lib/ws.miamioh.edu/api-types'
import {
	fetchSelectableTerms,
	ParseError,
	partitionedParseCourses,
} from '~/lib/ws.miamioh.edu/wrapper'

// https://remix.run/docs/en/v1/api/conventions#unstable_shouldreload
// export const unstable_shouldReload: ShouldReloadFunction = ({ params }) => {
// 	return !!params.fields
// }

export type Result =
	| {
			success: true
			data: CourseSections
			query: string
	  }
	| ParseError

type LoaderData = {
	terms: {
		termId: string
		name: string
		current: boolean
	}[]
	results?: Result[]
}

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url)
	const fields = url.searchParams.getAll('fields')
	const termId = url.searchParams.get('termId')
	const campusCode = url.searchParams.get('campusCode')
	const selectableTerms = await fetchSelectableTerms()

	if (!termId || !campusCode || !fields) {
		// Set default termId
		if (!termId) {
			const nextTerm =
				selectableTerms[
					selectableTerms.findIndex((term) => term.current) - 1
				]
			if (!nextTerm) throw new Error('No current term found')
			// const currentTerm = await getCurrentAcademicTerm()
			url.searchParams.set('termId', nextTerm.termId)
		}
		// Set default campus code
		if (!campusCode) {
			url.searchParams.set('campusCode', 'O')
		}

		// Set default fields
		if (!fields.length) {
			url.searchParams.append('fields', 'title')
			url.searchParams.append('fields', 'description')
			url.searchParams.append('fields', 'courseId')
		}
		return redirect(`/?${url.searchParams}`)
	}

	const query = url.searchParams.get('q')

	const currentTerm = selectableTerms.find((term) => term.current)
	if (!currentTerm) throw new Error('No current term found')

	if (!query) {
		return json<LoaderData>({
			terms: selectableTerms,
		})
	}

	// Partition queries to parallelize requests
	const parsed = partitionedParseCourses(query)

	// Parallelize requests
	const queries = await Promise.all(
		parsed.success.map((course) => {
			return searchMiamiCourses({
				termId: Number(termId),
				campusCode: campusCode,
				subject: course.subjectCode,
				courseNumber: Number(course.courseNumber),
				courseSectionCode: course.sectionCode,
			})
		})
	)

	// Format queried data
	const successfulQueries = queries.map((queryCourse, index) => {
		return {
			success: true as true,
			query: parsed.success[index].query,
			data: queryCourse,
		}
	})

	successfulQueries.forEach((query) => {
		console.log(query.query, 'length', query.data.courseSections.length)
	})

	return json<LoaderData>(
		{
			terms: selectableTerms,
			// Rejoin partitioned data
			results: [...parsed.errors, ...successfulQueries],
		},
		{
			headers: {
				'Cache-Control':
					'public, max-age=10, s-maxage=3600, stale-while-revalidate=86400',
			},
		}
	)
}

export default function Index() {
	const loaderData = useLoaderData<LoaderData>()
	const transition = useTransition()
	const [searchParams] = useSearchParams()
	const termId = searchParams.get('termId')
	const campusCode = searchParams.get('campusCode')
	const query = searchParams.get('q')
	const isLoading = transition.state === 'loading'
	const isSubmitting = transition.state === 'submitting'
	// const isLoading = transition.type === 'loaderSubmission'

	if (!termId || !campusCode) throw new Error('No params')

	return (
		<div className="m-auto max-w-prose space-y-4">
			<div className="space-y-2">
				<SearchSettings
					terms={loaderData.terms}
					searchParams={{
						termId,
						campusCode,
						query: query ?? '',
					}}
				/>
				<Form>
					<SearchInput
						searchParams={{
							q: query ?? undefined,
							campusCode,
							termId,
						}}
					/>
				</Form>
				{loaderData.results ? (
					isLoading || isSubmitting ? (
						<Skeleton rounded="md">
							<div className="p-3" />
						</Skeleton>
					) : (
						<SearchResults results={loaderData.results} />
					)
				) : null}
			</div>
		</div>
	)
}
