import { getAcademicTerms, getCurrentAcademicTerm } from './api'
import { ApiTerm } from './api-types'

function formatTerm(term: ApiTerm) {
	return {
		termId: term.termId,
		name: term.name.replace('Term ', '').replace('Semester ', ''),
		current: false,
	}
}

export async function fetchSelectableTerms() {
	const currentTerm = await getCurrentAcademicTerm()
	const terms = await getAcademicTerms({
		termId: currentTerm.data.termId,
		next: 3,
		previous: 2,
	})

	const formattedTerms = terms.data.map(formatTerm)

	const setCurrent = formattedTerms.map((term) => {
		if (term.termId === currentTerm.data.termId) {
			return {
				...term,
				current: true,
			}
		} else {
			return term
		}
	})

	return [...setCurrent].sort((a, b) => (a.termId > b.termId ? -1 : 1))
}

export type ParseSuccess = {
	success: true
	subjectCode: string
	courseNumber: string
	sectionCode: string | undefined
	query: string
}

export type ParseError = {
	success: false
	errors: string[]
	query: string
}

//
export function parseCourses(string: string): (ParseSuccess | ParseError)[] {
	const courses = separateCourses(string)
	return courses.map(parseCourse)
}

export function partitionedParseCourses(string: string) {
	const courses = separateCourses(string)
	return courses.reduce(
		(acc, curr) => {
			const parse = parseCourse(curr)
			if (parse.success) {
				acc.success.push(parse)
			} else {
				acc.errors.push(parse)
			}
			acc.all.push(parse)
			return acc
		},
		{
			success: [] as ParseSuccess[],
			errors: [] as ParseError[],
			all: [] as (ParseSuccess | ParseError)[],
		}
	)
}

function separateCourses(string: string) {
	return string.split(',').map((string) => string.trim())
}

function parseCourse(string: string):
	| { success: false; errors: string[]; query: string }
	| {
			success: true
			subjectCode: string
			courseNumber: string
			sectionCode: string | undefined
			query: string
	  } {
	const [subjectCode, courseNumber, sectionCode] = string.split(' ')
	let errors = [] as string[]
	if (!courseNumber) {
		errors.push('No course number')
	}

	if (errors.length === 0) {
		return {
			success: true,
			subjectCode,
			courseNumber,
			sectionCode,
			query: string,
		}
	} else {
		return {
			success: false,
			errors,
			query: string,
		}
	}
}
