import { useSearchParams } from '@remix-run/react'
import { CourseSections } from '~/lib/ws.miamioh.edu/api-types'
import { ParseError } from '~/lib/ws.miamioh.edu/wrapper'
import { Result } from '~/routes'
import { generateFieldMapping } from '~/utils/fields'
import { DescriptionList } from '../DescriptionList'

export function SearchResults({ results }: { results: Result[] }) {
	return (
		<div className="space-y-2">
			{results.map((result) => {
				if (result.success) {
					return <CourseCard key={result.query} result={result} />
				} else {
					return <ParseErrorCard key={result.query} result={result} />
				}
			})}
		</div>
	)
}

function ParseErrorCard({ result }: { result: ParseError }) {
	return (
		<div className="rounded-md border border-red-500 p-4">
			<p className="truncate text-sm font-bold text-red-500">
				{result.query}
			</p>
			<DescriptionList
				list={result.errors.map((error) => {
					return {
						title: 'Error',
						description: error,
					}
				})}
			/>
		</div>
	)
}

function CourseCard({
	result,
}: {
	result: {
		success: true
		data: CourseSections
		query: string
	}
}) {
	const [searchParams] = useSearchParams()
	const fields = searchParams.getAll('fields')

	if (fields.length === 0) {
		fields.push('enrollmentCountAvailable', '')
	}
	if (
		result?.data?.courseSections ||
		result?.data?.courseSections?.length === 0
	) {
		return (
			<div className="rounded-md border p-4">
				<p className="truncate text-sm">
					No results for{' '}
					<span className="rounded-md bg-gray-50 p-1">
						{result.query}
					</span>
				</p>
			</div>
		)
	}

	const generatedFields = result.data.courseSections.map((result) => ({
		section: result,
		fields: generateFieldMapping(result).filter((field) =>
			fields.includes(field.key)
		),
	}))

	return (
		<>
			{generatedFields.map((result) => {
				return (
					<div
						key={result.section.courseId}
						className="rounded-md border p-4"
					>
						<p className="truncate text-sm font-bold">
							{result.section.courseCode}
						</p>
						<DescriptionList list={result.fields} />
					</div>
				)
			})}
		</>
	)

	return (
		<>
			{result.data.courseSections.map((result) => {
				return (
					<div
						key={result.courseId}
						className="rounded-md border p-4"
					>
						<p className="truncate text-sm font-bold">
							{result.courseCode}
						</p>
						<div>
							<pre>
								<code>
									{JSON.stringify(generatedFields, null, 2)}
								</code>
							</pre>
						</div>
						{/* <div>
							<pre>
								<code>{JSON.stringify(result, null, 2)}</code>
							</pre>
						</div> */}
						{/* <DescriptionList
							list={[
								{
									title: 'Title',
									description: result.courseTitle,
								},
								{
									title: 'Description',
									description: result.courseDescription,
								},
								{
									title: 'CRN',
									description: result.courseId,
								},
								{
									title: 'Credit hours',
									description: `${result.lectureHoursLow} - ${result.lectureHoursHigh}`,
								},
								{
									title: 'Available Seats',
									description:
										result.enrollmentCountAvailable,
								},
								{
									title: 'Attributes',
									description: result.attributes
										.map(
											(attribute) =>
												attribute.attributeCode
										)
										.join(', '),
								},
								{
									title: 'Enrollment',
									description: `${result.enrollmentCountCurrent} / ${result.enrollmentCountMax}`,
								},
								{
									title: 'Instructors',
									description: result.instructors
										.map(
											(instructor) =>
												`${
													instructor.nameDisplayFormal
												} (${instructor.username.toLowerCase()})`
										)
										.join(', '),
								},
								{
									title: 'Dates',
									description: result.courseSchedules
										.map(
											(schedule) =>
												`${schedule.startDate} - ${schedule.endDate}`
										)
										.join(', '),
								},
								{
									title: 'Days',
									description: result.courseSchedules
										.map((schedule) => `${schedule.days}`)
										.join(', '),
								},
								{
									title: 'Time',
									description: result.courseSchedules
										.map(
											(schedule) =>
												`${schedule.startTime} - ${schedule.endTime}`
										)
										.join(', '),
								},
								{
									title: 'Room',
									description: result.courseSchedules
										.map((schedule) => schedule.room)
										.join(', '),
								},
								{
									title: 'Building',
									description: result.courseSchedules
										.map(
											(schedule) =>
												`${schedule.buildingName} (${schedule.buildingCode})`
										)
										.join(', '),
								},
							]}
						/> */}
					</div>
				)
			})}
		</>
	)
}
